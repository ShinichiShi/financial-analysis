#!/bin/bash

# Backend Server Startup Script

# Set environment variables
export PYTHONPATH="$PYTHONPATH:$(pwd)"

# Logging setup
LOG_DIR="logs"
mkdir -p "$LOG_DIR"
TIMESTAMP=$(date +"