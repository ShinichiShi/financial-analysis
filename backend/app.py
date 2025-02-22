from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import joblib
from sklearn.preprocessing import MinMaxScaler

app = Flask(__name__)

# Load trained model
model = joblib.load("stock_price_prediciton.pkl")

# Load dataset for reference
df = pd.read_csv('/home/taneesha1432/Desktop/foss hack/MSFT_2006-01-01_to_2018-01-01.csv')

# Identify closing price column
possible_cols = ['Close', 'close', 'Adj Close', 'adj close', 'Closing Price', 'closing price']
target_col = next((col for col in possible_cols if col in df.columns), None)

if target_col is None:
    raise KeyError(f"None of the expected closing price columns {possible_cols} were found.")

# Scale data
scaler = MinMaxScaler(feature_range=(0, 1))
data = df[[target_col]].values
scaled_data = scaler.fit_transform(data)

@app.route("/predict", methods=["GET"])
def predict_stock():
    stock_symbol = request.args.get("symbol", "MSFT")  # Default to MSFT
    last_60_days = scaled_data[-60:].reshape(1, 60, 1)  # Last 60 days of stock prices

    # Predict next day's stock price
    predicted_price = model.predict(last_60_days)
    predicted_price = scaler.inverse_transform(predicted_price)

    return jsonify({"predicted_price": float(predicted_price[0][0])})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
