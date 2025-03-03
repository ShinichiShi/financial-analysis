#!/bin/bash

# Install dependencies
pip install -r backend/requirements.txt

# Set environment variables for Render
export PORT=${PORT:-10000}

# Change to the directory containing the FastAPI app
cd backend/model

# Start the FastAPI application
exec uvicorn app:app --host 0.0.0.0 --port $PORT 