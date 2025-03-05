#!/usr/bin/env bash
# exit on error
set -o errexit

# Print current directory and Python version for debugging
echo "Current directory: $(pwd)"
echo "Python version: $(python --version)"

# Set environment variables for Render - IMPORTANT: Use the PORT that Render provides
echo "Render PORT: $PORT"
export PORT=${PORT:-8000}
echo "Using PORT: $PORT"

# Change to the directory containing the FastAPI app
cd backend/model
echo "Changed to directory: $(pwd)"

# List files in the current directory
echo "Files in current directory:"
ls -la

# Print Python path
echo "Python path:"
python -c "import sys; print(sys.path)"

# Start the FastAPI application - IMPORTANT: Binding to 0.0.0.0 is critical for Render
echo "Starting uvicorn server on port $PORT..."
exec python -m uvicorn app:app --host 0.0.0.0 --port $PORT --workers 1 