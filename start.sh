#!/bin/bash

# Print current directory and Python version for debugging
echo "Current directory: $(pwd)"
echo "Python version: $(python --version)"

# Install dependencies with pip and ensure they're installed in the user's path
python -m pip install --upgrade pip
python -m pip install -r backend/requirements.txt
python -m pip install uvicorn fastapi

# Print installed packages for debugging
echo "Installed packages:"
python -m pip list

# Set environment variables for Render
export PORT=${PORT:-10000}

# Change to the directory containing the FastAPI app
cd backend/model
echo "Changed to directory: $(pwd)"

# Start the FastAPI application using the full path to Python
echo "Starting uvicorn server..."
python -m uvicorn app:app --host 0.0.0.0 --port $PORT 