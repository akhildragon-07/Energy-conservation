from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import endpoints
from .database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Drone-Based Solar Panel Analyzer API",
    description="Backend for analyzing solar panel images for defects.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(endpoints.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Welcome to the Solar Panel Analyzer API"}
