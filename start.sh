#!/bin/bash

# Install dependencies with pip
pip install -r backend/requirements.txt
pip install uvicorn fastapi

# Set environment variables for Render
export PORT=${PORT:-10000}

# Change to the directory containing the FastAPI app
cd backend/model

# Start the FastAPI application using python module path
python -m uvicorn app:app --host 0.0.0.0 --port $PORT 