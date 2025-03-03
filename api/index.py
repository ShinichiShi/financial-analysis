from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

# Add the backend directory to the path so we can import the app
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend', 'model'))

# Import the FastAPI app from your backend
from app import app as fastapi_app

# Add CORS middleware
fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# This is required for Vercel serverless functions
async def handler(request: Request):
    return await fastapi_app(request.scope, request._receive, request._send)

# Export the handler for Vercel
__all__ = ["handler"] 