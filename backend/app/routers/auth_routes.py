# backend/app/routers/auth_routes.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from .. import schemas, models, auth, database

# --- ADD THESE 3 IMPORTS ---
from firebase_admin import auth as firebase_auth
from pydantic import BaseModel

router = APIRouter()

@router.post("/auth/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = auth.get_user(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    
    # Default verification based on role
    is_verified = user.role == models.UserRole.donor # Donors verified by default
    
    new_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        name=user.name,
        role=user.role,
        location=user.location,
        is_verified=is_verified # NGOs/Admins must be verified by another admin
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/auth/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = auth.get_user(db, email=form_data.username) # username is the email
    
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    if not user.is_verified:
        raise HTTPException(status_code=403, detail="User account not yet verified by admin")

    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    # Get the user data in the correct Pydantic schema (Pydantic v2)
    user_schema = schemas.User.model_validate(user)
    
    return {"access_token": access_token, "token_type": "bearer", "user": user_schema}


class GoogleToken(BaseModel):
    """The model for the request body, expecting a Google ID token."""
    token: str

@router.post("/auth/google", response_model=schemas.Token)
def google_auth(
    google_token: GoogleToken, 
    db: Session = Depends(database.get_db)
):
    """
    Handles Google Sign-In.
    Verifies the Google ID token, finds the user in our DB,
    or creates a new user if they don't exist.
    """
    try:
        # 1. Verify the ID token sent from the frontend
        decoded_token = firebase_auth.verify_id_token(google_token.token)
        
        # Extract user information
        uid = decoded_token.get("uid")
        email = decoded_token.get("email")
        name = decoded_token.get("name", "Google User")
        
        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Email not found in Google token"
            )

    except HTTPException:
        # Re-raise HTTPExceptions
        raise
    except Exception as e:
        # Token is invalid or expired
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Google token: {str(e)}"
        )

    # 2. Check if this user already exists in our database
    user = auth.get_user(db, email=email)
    
    if not user:
        # 3. User doesn't exist. Create a new user in our database.
        
        # We create a placeholder password, as they will only use Google to log in.
        placeholder_password = auth.get_password_hash(f"google-user-secret-{email}")
        
        # Default new Google users to 'donor' and auto-verify them.
        user = models.User(
            email=email,
            name=name,
            hashed_password=placeholder_password,
            role=models.UserRole.donor,
            location="Not specified",
            is_verified=True, # Auto-verify Google users
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # 4. User exists (or was just created). Create and return *our* app's
    # access token so they can make authenticated requests.
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    # Convert user model to schema (Pydantic v2 uses from_attributes)
    user_schema = schemas.User.model_validate(user)
    
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "user": user_schema
    }