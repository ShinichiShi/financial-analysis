#!/usr/bin/env bash
# exit on error
set -o errexit

# Upgrade pip and install dependencies
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

# Verify uvicorn is installed
python -c "import uvicorn; print(f'uvicorn version: {uvicorn.__version__}')"

# Print all installed packages for debugging
python -m pip list 