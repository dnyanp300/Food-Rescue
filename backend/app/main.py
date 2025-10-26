# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from . import models
from .routers import auth_routes, donor_routes, ngo_routes, admin_routes, ai_routes
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- Firebase Admin Setup ---
import firebase_admin
from firebase_admin import credentials

# Get Firebase credentials from environment variable
FIREBASE_CRED_PATH = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "app/firebase-service-account.json")

# Check if the credentials file exists
if not os.path.exists(FIREBASE_CRED_PATH):
    raise FileNotFoundError(
        f"Firebase service account file not found at: {FIREBASE_CRED_PATH}\n"
        f"Please set FIREBASE_SERVICE_ACCOUNT_PATH environment variable or place the file at the default location."
    )

cred = credentials.Certificate(FIREBASE_CRED_PATH)
firebase_admin.initialize_app(cred)

# Create all database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Food Rescue AI Platform")

# --- CORS ---
# Allow requests from our React frontend (running on localhost:3000)
origins = [
    "http://localhost:3000",
    "http://localhost:3001", # Sometimes React uses this
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allow all methods
    allow_headers=["*"], # Allow all headers
)

# --- API Routers ---
# We prefix all API routes with /api/v1
api_prefix = "/api/v1"

app.include_router(auth_routes.router, prefix=api_prefix, tags=["Authentication"])
app.include_router(donor_routes.router, prefix=api_prefix, tags=["Donor"])
app.include_router(ngo_routes.router, prefix=api_prefix, tags=["NGO"])
app.include_router(admin_routes.router, prefix=api_prefix, tags=["Admin"])
app.include_router(ai_routes.router, prefix=api_prefix, tags=["AI"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Food Rescue AI Platform API"}

# Note: Image upload logic would be added to the donor_routes
# We'll keep it simple for now and just store a text URL