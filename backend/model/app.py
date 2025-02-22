from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd
import uvicorn

app = FastAPI(title="Stock Price Prediction API")

# Load the trained LSTM model and scaler from pickle files
try:
    model = joblib.load("stock_price_prediction.pkl")
    scaler = joblib.load("scaler.pkl")
except Exception as e:
    raise Exception(f"Error loading model or scaler: {e}")

# Load the historical CSV data (used during training)
# data_path = '/home/taneesha1432/Desktop/foss hack/financial-analysis/model/AAPL_2006-01-01_to_2018-01-01.csv'
data_path = '/home/shinichi/Documents/VSC/financial-analysis/backend/model/MSFT_2006-01-01_to_2018-01-01.csv'

try:
    df = pd.read_csv(data_path)
except Exception as e:
    raise Exception(f"Error loading historical CSV data: {e}")

# Process the date column (if available)
if 'Date' in df.columns:
    df['Date'] = pd.to_datetime(df['Date'])
    df.sort_values('Date', inplace=True)
    df.set_index('Date', inplace=True)
else:
    df.index = pd.to_datetime(df.index)
    df.sort_index(inplace=True)

# Identify the target column (e.g., "Close" or "Adj Close")
possible_cols = ['Close', 'close', 'Adj Close', 'adj close', 'Closing Price', 'closing price']
target_col = None
for col in possible_cols:
    if col in df.columns:
        target_col = col
        break
if target_col is None:
    raise Exception(f"None of the expected target columns {possible_cols} were found.")

# Scale the historical target data using the loaded scaler
data_values = df[[target_col]].values
# We assume the scaler was fitted on similar data during training.
scaled_data = scaler.transform(data_values)

# Define the sequence length (must match the training sequence length)
sequence_length = 60

# Extract the last 60 days of scaled data to serve as the starting sequence
last_sequence = scaled_data[-sequence_length:]  # shape: (60, 1)

# Define the multi-step iterative forecasting function
def multi_step_forecast(model, last_sequence, forecast_days, scaler):
    """
    Predict future stock prices iteratively.
    
    Parameters:
      - model: Trained LSTM model.
      - last_sequence: numpy array of shape (sequence_length, 1) containing the most recent (scaled) data.
      - forecast_days: Number of future days to forecast.
      - scaler: The scaler used during training.
      
    Returns:
      - predictions: Array of predicted closing prices in the original scale.
    """
    predictions_scaled = []
    current_sequence = last_sequence.copy()  # shape: (sequence_length, 1)
    
    for _ in range(forecast_days):
        # Reshape for LSTM input: (1, sequence_length, 1)
        current_input = np.reshape(current_sequence, (1, current_sequence.shape[0], 1))
        # Predict next day (result is scaled)
        pred_scaled = model.predict(current_input)[0, 0]
        predictions_scaled.append(pred_scaled)
        # Append prediction and drop the oldest value to maintain the sequence length
        current_sequence = np.append(current_sequence, [[pred_scaled]], axis=0)
        current_sequence = current_sequence[1:]
        
    # Convert scaled predictions back to the original scale
    predictions = scaler.inverse_transform(np.array(predictions_scaled).reshape(-1, 1))
    return predictions.flatten()

# Define the Pydantic model for forecast requests
class ForecastRequest(BaseModel):
    forecast_horizon: int  # Number of future days to forecast

# Define the /forecast endpoint
@app.post("/forecast")
def forecast(request: ForecastRequest):
    if request.forecast_horizon <= 0:
        raise HTTPException(status_code=400, detail="Forecast horizon must be positive.")
    future_predictions = multi_step_forecast(model, last_sequence, request.forecast_horizon, scaler)
    return {
        "forecast_horizon": request.forecast_horizon,
        "predictions": future_predictions.tolist()
    }

# Run the API with: uvicorn this_filename:app --reload
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
