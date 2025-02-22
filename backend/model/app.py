from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd
import uvicorn
import requests
import io
import os
import json
import logging
app = FastAPI(title="Stock Price Prediction API")

# Alpha Vantage API Configuration
ALPHA_VANTAGE_API_KEY = "XL36FJ4OLX72LPQ3"
ALPHA_VANTAGE_URL = "https://www.alphavantage.co/query"

# Load the trained LSTM model and scaler from pickle files
try:
    model = joblib.load("stock_price_prediction.pkl")
    scaler = joblib.load("scaler.pkl")
except Exception as e:
    raise Exception(f"Error loading model or scaler: {e}")

# Define request models
class StockDataRequest(BaseModel):
    symbol: str  # e.g., "IBM"
    interval: str = "5min"  # Default: "5min"

class ForecastRequest(BaseModel):
    symbol: str  # Stock symbol to forecast
    forecast_horizon: int  # Number of future days to forecast
    interval: str = "5min"  # Default: "5min"

def fetch_alpha_vantage_data(symbol: str, interval: str) -> pd.DataFrame:
    """Fetch stock data from Alpha Vantage and return as DataFrame."""
    params = {
        "function": "TIME_SERIES_INTRADAY",
        "symbol": symbol,
        "interval": interval,
        "apikey": ALPHA_VANTAGE_API_KEY,
        "outputsize": "full"  # Get the full set of time series data
    }
    
    response = requests.get(ALPHA_VANTAGE_URL, params=params)
    response_data = response.json()
    
    # Log response for debugging
    logging.warning(json.dumps(response_data, indent=2))

    # Dynamically find the correct key for time series data
    time_series_key = f"Time Series ({interval})"

    if time_series_key not in response_data:
        raise HTTPException(status_code=400, detail=f"Invalid API response: {response_data}")

    time_series_data = response_data[time_series_key]

    # Convert JSON to DataFrame
    rows = []
    for timestamp, values in time_series_data.items():
        rows.append([
            timestamp,
            float(values["1. open"]),
            float(values["2. high"]),
            float(values["3. low"]),
            float(values["4. close"]),
            int(values["5. volume"])
        ])

    df = pd.DataFrame(rows, columns=["Date", "Open", "High", "Low", "Close", "Volume"])
    df["Date"] = pd.to_datetime(df["Date"])
    df.sort_values("Date", inplace=True)
    df.set_index("Date", inplace=True)
    
    return df

@app.post("/fetch_data")
def fetch_data(request: StockDataRequest):
    df = fetch_alpha_vantage_data(request.symbol, request.interval)
    return {"message": "Stock data fetched successfully!", "csv_data": df.to_csv()}

@app.post("/forecast")
def forecast(request: ForecastRequest):
    if request.forecast_horizon <= 0:
        raise HTTPException(status_code=400, detail="Forecast horizon must be positive.")

    try:
        # Fetch the latest data from Alpha Vantage
        df = fetch_alpha_vantage_data(request.symbol, request.interval)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching stock data: {str(e)}")

    # Check target column
    target_col = "Close"
    if target_col not in df.columns:
        raise HTTPException(status_code=500, detail="Target column 'Close' not found in data.")

    # Scale the historical target data
    data_values = df[[target_col]].values
    scaled_data = scaler.transform(data_values)

    # Get last sequence
    sequence_length = 60
    if len(scaled_data) < sequence_length:
        raise HTTPException(
            status_code=400, 
            detail=f"Not enough historical data. Need at least {sequence_length} data points."
        )

    last_sequence = scaled_data[-sequence_length:]

    # Forecast future prices
    future_predictions = multi_step_forecast(model, last_sequence, request.forecast_horizon, scaler)
    
    # Create response with timestamps
    last_date = df.index[-1]
    future_dates = pd.date_range(
        start=last_date, 
        periods=request.forecast_horizon + 1, 
        freq=request.interval
    )[1:]  # Skip the first date as it's the last actual data point

    forecast_data = {
        "dates": future_dates.strftime('%Y-%m-%d %H:%M:%S').tolist(),
        "predictions": future_predictions.tolist()
    }
    
    return {
        "symbol": request.symbol,
        "forecast_horizon": request.forecast_horizon,
        "interval": request.interval,
        "forecast_data": forecast_data
    }

# Multi-step forecasting function
def multi_step_forecast(model, last_sequence, forecast_days, scaler):
    predictions_scaled = []
    current_sequence = last_sequence.copy()

    for _ in range(forecast_days):
        current_input = np.reshape(current_sequence, (1, current_sequence.shape[0], 1))
        pred_scaled = model.predict(current_input)[0, 0]
        predictions_scaled.append(pred_scaled)
        current_sequence = np.append(current_sequence, [[pred_scaled]], axis=0)[1:]

    return scaler.inverse_transform(np.array(predictions_scaled).reshape(-1, 1)).flatten()

# Run the API
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)