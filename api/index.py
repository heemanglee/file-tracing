"""Vercel serverless entry point — re-exports the FastAPI app."""
import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from app.main import app  # noqa: E402, F401
