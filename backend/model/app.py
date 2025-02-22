from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd
import uvicorn
import yfinance as yf
import requests
import pickle
import json
import logging
from datetime import datetime, timedelta
from mlxtend.frequent_patterns import apriori
from mlxtend.frequent_patterns import association_rules
from typing import Dict, Any

# Configure logging
import logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),  # Output to console
        logging.FileHandler('stock_analysis.log')  # Output to a log file
    ]
)

app = FastAPI(title="Stock Price Prediction API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Twelve Data API Configuration
TWELVE_DATA_API_KEY = "195c0092a87e4ce294517bd8ce0e9bde"  # Replace with your API key
TWELVE_DATA_URL = "https://api.twelvedata.com"

class StockAssociationRequest(BaseModel):
    tickers: list[str]  # List of stock tickers
    start_date: str  # YYYY-MM-DD
    end_date: str  # YYYY-MM-DD
    min_support: float = 0.2  # Default min support
    min_lift: float = 1.0  # Default min lift

class StockDataRequest(BaseModel):
    symbol: str  # e.g., "AAPL"
    interval: str = "1h"  # Default: "1h"

class ForecastRequest(BaseModel):
    symbol: str  # Stock symbol to forecast
    forecast_horizon: int  # Number of future periods to forecast
    interval: str = "1h"  # Default: "1h"

class StockAnalysisRequest(BaseModel):
    symbol: str
    start_date: str = "2023-01-01"
    end_date: str = "2024-01-01"

# Load the trained LSTM model and scaler from pickle files
try:
    model = joblib.load("stock_price_prediction.pkl")
    scaler = joblib.load("scaler.pkl")
except Exception as e:
    raise Exception(f"Error loading model or scaler: {e}")

def fetch_twelve_data(symbol: str, interval: str) -> pd.DataFrame:
    """Fetch stock data from Twelve Data and return as DataFrame."""
    endpoint = f"{TWELVE_DATA_URL}/time_series"
    
    params = {
        "symbol": symbol,
        "interval": interval,
        "apikey": TWELVE_DATA_API_KEY,
        "outputsize": "5000"  # Get maximum available data points
    }
    
    try:
        response = requests.get(endpoint, params=params)
        response.raise_for_status()  # Raise an exception for bad status codes
        data = response.json()
        
        # Log response for debugging
        logging.debug(json.dumps(data, indent=2))
        
        if "values" not in data:
            raise HTTPException(status_code=400, detail=f"Invalid API response: {data}")
        
        # Convert API response to DataFrame
        df = pd.DataFrame(data["values"])
        
        # Convert string values to appropriate types
        df["datetime"] = pd.to_datetime(df["datetime"])
        numeric_columns = ["open", "high", "low", "close", "volume"]
        for col in numeric_columns:
            df[col] = pd.to_numeric(df[col])
        
        # Rename columns to match existing code
        df = df.rename(columns={
            "datetime": "Date",
            "open": "Open",
            "high": "High",
            "low": "Low",
            "close": "Close",

            "volume": "Volume"
        })
        
        # Set index and sort
        df.set_index("Date", inplace=True)
        df.sort_index(inplace=True)
        
        return df
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error fetching data from Twelve Data: {str(e)}")

@app.post("/stock_association")
def stock_association(request: StockAssociationRequest):
    try:
        # Fetch stock data using yfinance (keeping this as is since it handles multiple symbols well)
        df = yf.download(request.tickers, start=request.start_date, end=request.end_date)
        df = df["Close"]  # Fix MultiIndex issue

        # Convert to binary transactions
        df_returns = df.pct_change().dropna()
        df_binary = df_returns > 0  # Boolean values (True = price increase, False = decrease)

        # Apply Apriori Algorithm
        frequent_itemsets = apriori(df_binary, min_support=request.min_support, use_colnames=True)
        rules = association_rules(frequent_itemsets, metric="lift", min_threshold=request.min_lift)

        # Save rules as a pickle file
        pickle_filename = "association_rules.pkl"
        with open(pickle_filename, "wb") as f:
            pickle.dump(rules, f)

        # Format results for JSON response
        rules_list = []
        for _, row in rules.iterrows():
            rules_list.append({
                "antecedents": list(row["antecedents"]),
                "consequents": list(row["consequents"]),
                "support": round(row["support"], 4),
                "confidence": round(row["confidence"], 4),
                "lift": round(row["lift"], 4)
            })

        return {
            "message": "Stock association rules generated successfully!",
            "rules": rules_list,
            "pickle_file": pickle_filename
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing stock association: {e}")

@app.post("/fetch_data")
def fetch_data(request: StockDataRequest):
    df = fetch_twelve_data(request.symbol, request.interval)
    return {"message": "Stock data fetched successfully!", "csv_data": df.to_csv()}

@app.post("/forecast")
def forecast(request: ForecastRequest):
    if request.forecast_horizon <= 0:
        raise HTTPException(status_code=400, detail="Forecast horizon must be positive.")

    try:
        # Fetch the latest data from Twelve Data
        df = fetch_twelve_data(request.symbol, request.interval)
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
    # Adjust the frequency based on the interval
    freq_map = {
        "1min": "T",
        "5min": "5T",
        "15min": "15T",
        "30min": "30T",
        "1h": "H",
        "2h": "2H",
        "4h": "4H",
        "1day": "D"
    }
    freq = freq_map.get(request.interval, "H")
    
    future_dates = pd.date_range(
        start=last_date, 
        periods=request.forecast_horizon + 1, 
        freq=freq
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

def multi_step_forecast(model, last_sequence, forecast_days, scaler):
    predictions_scaled = []
    current_sequence = last_sequence.copy()

    for _ in range(forecast_days):
        current_input = np.reshape(current_sequence, (1, current_sequence.shape[0], 1))
        pred_scaled = model.predict(current_input)[0, 0]
        predictions_scaled.append(pred_scaled)
        current_sequence = np.append(current_sequence, [[pred_scaled]], axis=0)[1:]

    return scaler.inverse_transform(np.array(predictions_scaled).reshape(-1, 1)).flatten()

def safe_float_conversion(value, default=0):
    """
    Safely convert a value to float, handling NaN and other edge cases.
    
    Args:
        value: Input value to convert
        default: Default value to return if conversion fails
    
    Returns:
        Float value or default
    """
    try:
        # Check for None, NaN, or other non-numeric values
        if pd.isna(value) or value is None:
            return default
        
        # Convert to float
        float_val = float(value)
        
        # Check for infinity or extremely large values
        if np.isinf(float_val):
            return default
        
        return float_val
    except (TypeError, ValueError):
        return default

@app.post("/comprehensive_analysis")
def comprehensive_stock_analysis(request: StockAnalysisRequest):
    try:
        # Fetch stock data
        stock_data = yf.Ticker(request.symbol)
        
        # Log available info keys for debugging
        logging.info(f"Available stock info keys: {list(stock_data.info.keys())}")
        
        # Fetch historical market data
        try:
            hist = stock_data.history(start=request.start_date, end=request.end_date)
            logging.info(f"Historical data shape: {hist.shape}")
        except Exception as hist_error:
            logging.error(f"Error fetching historical data: {hist_error}")
            hist = pd.DataFrame()  # Provide an empty DataFrame to prevent further errors
        
        # Basic Financial Metrics
        analysis_results: Dict[str, Any] = {
            "basic_info": {
                "company_name": stock_data.info.get('longName', request.symbol),
                "sector": stock_data.info.get('sector', 'N/A'),
                "industry": stock_data.info.get('industry', 'N/A'),
            },
            "price_metrics": {
                "current_price": safe_float_conversion(stock_data.info.get('currentPrice', 0)),
                "fifty_two_week_high": safe_float_conversion(stock_data.info.get('fiftyTwoWeekHigh', 0)),
                "fifty_two_week_low": safe_float_conversion(stock_data.info.get('fiftyTwoWeekLow', 0)),
            },
            "financial_health": {
                "market_cap": safe_float_conversion(stock_data.info.get('marketCap', 0)),
                "pe_ratio": safe_float_conversion(stock_data.info.get('trailingPE', 0)),
                "dividend_yield": safe_float_conversion(stock_data.info.get('dividendYield', 0)),
                "beta": safe_float_conversion(stock_data.info.get('beta', 0)),
            },
            "performance_analysis": {
                "monthly_returns": [],
                "volatility": 0,
                "sharpe_ratio": 0
            }
        }
        
        # Ensure we have enough historical data
        if len(hist) > 0:
            # Calculate Monthly Returns
            monthly_returns = hist['Close'].resample('M').last().pct_change()
            
            # Filter out NaN returns
            monthly_returns = monthly_returns.dropna()
            
            analysis_results['performance_analysis']['monthly_returns'] = [
                {
                    "month": date.strftime('%B %Y'),
                    "return": safe_float_conversion(return_val * 100, 0)
                } 
                for date, return_val in monthly_returns.items()
            ]
            
            # Calculate Volatility (Standard Deviation of Returns)
            try:
                volatility = monthly_returns.std() * np.sqrt(12)  # Annualized
                analysis_results['performance_analysis']['volatility'] = safe_float_conversion(volatility * 100, 0)
            except Exception as vol_error:
                logging.warning(f"Volatility calculation error: {vol_error}")
                analysis_results['performance_analysis']['volatility'] = 0
            
            # Simple Sharpe Ratio Calculation (assuming risk-free rate of 2%)
            try:
                risk_free_rate = 0.02
                excess_returns = monthly_returns - (risk_free_rate / 12)
                
                # Safely calculate Sharpe Ratio
                mean_excess_return = excess_returns.mean()
                std_excess_return = excess_returns.std()
                
                if std_excess_return != 0:
                    sharpe_ratio = mean_excess_return / std_excess_return * np.sqrt(12)
                    analysis_results['performance_analysis']['sharpe_ratio'] = safe_float_conversion(sharpe_ratio, 0)
                else:
                    analysis_results['performance_analysis']['sharpe_ratio'] = 0
            except Exception as sharpe_error:
                logging.warning(f"Sharpe Ratio calculation error: {sharpe_error}")
                analysis_results['performance_analysis']['sharpe_ratio'] = 0
            
            # Risk Assessment
            volatility_val = analysis_results['performance_analysis']['volatility']
            sharpe_ratio_val = analysis_results['performance_analysis']['sharpe_ratio']
            
            analysis_results['risk_assessment'] = {
                "volatility_category": (
                    "Low" if volatility_val < 10 else 
                    "Moderate" if volatility_val < 20 else 
                    "High"
                ),
                "investment_risk_level": (
                    "Conservative" if sharpe_ratio_val > 1 else 
                    "Moderate" if sharpe_ratio_val > 0 else 
                    "Aggressive"
                )
            }
        else:
            # Default values if no historical data
            analysis_results['performance_analysis'] = {
                "monthly_returns": [],
                "volatility": 0,
                "sharpe_ratio": 0
            }
            analysis_results['risk_assessment'] = {
                "volatility_category": "N/A",
                "investment_risk_level": "N/A"
            }
        
        # Sentiment and Trend Analysis
        try:
            # Try multiple methods to get recommendations
            recommendations = None
            
            # Method 1: Direct recommendations attribute
            recommendations = stock_data.recommendations
            
            # Method 2: Try recommendations from info
            if recommendations is None or (isinstance(recommendations, pd.DataFrame) and recommendations.empty):
                recommendations = stock_data.info.get('recommendationKey', None)
            
            # Logging for debugging
            logging.info(f"Recommendations type: {type(recommendations)}")
            logging.info(f"Recommendations content: {recommendations}")
            
            # Process recommendations if available
            if recommendations is not None and not (isinstance(recommendations, pd.DataFrame) and recommendations.empty):
                if isinstance(recommendations, pd.DataFrame):
                    # Ensure columns exist
                    columns = recommendations.columns
                    analysis_results['analyst_recommendations'] = {
                        "buy": int(safe_float_conversion(recommendations['Buy'].sum() if 'Buy' in columns else 0)),
                        "hold": int(safe_float_conversion(recommendations['Hold'].sum() if 'Hold' in columns else 0)),
                        "sell": int(safe_float_conversion(recommendations['Sell'].sum() if 'Sell' in columns else 0))
                    }
                else:
                    # Fallback for other recommendation formats
                    analysis_results['analyst_recommendations'] = {
                        "buy": 0,
                        "hold": 0,
                        "sell": 0
                    }
            else:
                # No recommendations found
                analysis_results['analyst_recommendations'] = {
                    "buy": 0,
                    "hold": 0,
                    "sell": 0
                }
        except Exception as rec_error:
            # Log the recommendation error but don't stop the entire analysis
            logging.warning(f"Could not fetch analyst recommendations: {rec_error}")
            analysis_results['analyst_recommendations'] = {
                "buy": 0,
                "hold": 0,
                "sell": 0
            }
        
        return analysis_results
    
    except Exception as e:
        # More detailed error logging
        logging.error(f"Comprehensive analysis error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error in comprehensive analysis: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)