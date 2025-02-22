import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM, Dropout
from sklearn.metrics import mean_absolute_error, mean_squared_error
import joblib

# 1. Load the dataset from Kaggle
df = pd.read_csv('/home/taneesha1432/Desktop/foss hack/MSFT_2006-01-01_to_2018-01-01.csv')

# Print available columns to help diagnose naming issues
print("Available columns in dataset:", df.columns.tolist())

if 'Date' in df.columns:
    df['Date'] = pd.to_datetime(df['Date'])
    df.sort_values('Date', inplace=True)
    df.set_index('Date', inplace=True)
else:
    # Otherwise, assume the index holds date information; convert index to datetime.
    df.index = pd.to_datetime(df.index)
    df.sort_index(inplace=True)

# identify the target column for the closing price

possible_cols = ['Close', 'close', 'Adj Close', 'adj close', 'Closing Price', 'closing price']
target_col = None
for col in possible_cols:
    if col in df.columns:
        target_col = col
        break

if target_col is None:
    raise KeyError(f"None of the expected closing price columns {possible_cols} were found in the dataset. Available columns: {df.columns.tolist()}")

print(f"Using '{target_col}' as the target column for closing prices.")

# 4. Use the target column as the variable to predict
data = df[[target_col]].values

# 5. Scale the data to the range [0, 1]
scaler = MinMaxScaler(feature_range=(0, 1))
scaled_data = scaler.fit_transform(data)

# 6. Create sequences: use the past 60 days to predict the next day's closing price.
sequence_length = 60

def create_sequences(data, seq_length):
    X = []
    y = []
    for i in range(seq_length, len(data)):
        X.append(data[i-seq_length:i, 0])
        y.append(data[i, 0])
    return np.array(X), np.array(y)

X, y = create_sequences(scaled_data, sequence_length)

# Reshape X to be [samples, time_steps, features]
X = np.reshape(X, (X.shape[0], X.shape[1], 1))

# 7. Split data into training and testing sets (80% training, 20% testing)
train_size = int(len(X) * 0.8)
X_train, X_test = X[:train_size], X[train_size:]
y_train, y_test = y[:train_size], y[train_size:]

# 8. Build the LSTM model
model = Sequential()
model.add(LSTM(50, return_sequences=True, input_shape=(X_train.shape[1], 1)))
model.add(Dropout(0.2))
model.add(LSTM(50, return_sequences=False))
model.add(Dropout(0.2))
model.add(Dense(25))
model.add(Dense(1)) 

model.compile(optimizer='adam', loss='mean_squared_error')

history = model.fit(X_train, y_train, batch_size=32, epochs=50, validation_data=(X_test, y_test))
predictions = model.predict(X_test)
predictions = scaler.inverse_transform(predictions)
y_test_unscaled = scaler.inverse_transform(y_test.reshape(-1, 1))
print(predictions)
mae = mean_absolute_error(y_test_unscaled,predictions)
rmse = np.sqrt(mean_squared_error(y_test_unscaled, predictions))

print(f'🚀 lstm MAE: {mae:.4f}')
print(f'🚀 lstm RMSE: {rmse:.4f}')
plt.figure(figsize=(10, 6))
plt.plot(y_test_unscaled, label='Actual Price')
plt.plot(predictions, label='Predicted Price')
plt.title('Stock Price Prediction with LSTM')
plt.xlabel('Time')
plt.ylabel('Price')
plt.legend()
plt.show()
joblib.dump(model,'stock_price_prediciton.pkl')
print("model saved as 'stock_price_prediction.pkl'")