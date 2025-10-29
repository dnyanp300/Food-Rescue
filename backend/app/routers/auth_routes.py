# backend/app/routers/auth_routes.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from .. import schemas, models, auth, database
import os
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
import random
import string
from ..services.email_service import send_otp_email

router = APIRouter()

@router.post("/auth/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = auth.get_user(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    
    # Default verification based on role
    is_verified = user.role == models.UserRole.donor  # Donors verified by default
    if user.role == models.UserRole.admin:
        # Auto-verify the first admin to enable bootstrap
        existing_admin = (
            db.query(models.User)
            .filter(models.User.role == models.UserRole.admin)
            .first()
        )
        if existing_admin is None:
            is_verified = True
    
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
        
    if not user.is_verified and user.role != models.UserRole.admin:
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

@router.post("/auth/otp/request")
def request_otp(email: EmailStr, db: Session = Depends(database.get_db)):
    user = auth.get_user(db, email=email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    code = "".join(random.choices(string.digits, k=6))
    expires_at = datetime.utcnow() + timedelta(minutes=10)

    # Invalidate previous OTPs
    db.query(models.OtpCode).filter(models.OtpCode.email == email, models.OtpCode.consumed == False).update({models.OtpCode.consumed: True})
    otp = models.OtpCode(email=email, code=code, expires_at=expires_at)
    db.add(otp)
    db.commit()

    # Send email (will fall back to console if SMTP_STRICT=false)
    try:
        send_otp_email(email, code, 10)
    except Exception:
        # The email client already logged the error; proceed so that dev can continue
        pass

    response = {"message": "OTP generated", "expires_in_minutes": 10}
    if os.getenv("ENV", "development").lower() != "production":
        # Expose OTP in non-production for local testing
        response["dev_code"] = code
    return response


class OtpVerifyRequest(BaseModel):
    email: EmailStr
    code: str

@router.post("/auth/otp/verify", response_model=schemas.Token)
def verify_otp(payload: OtpVerifyRequest, db: Session = Depends(database.get_db)):
    otp: models.OtpCode | None = (
        db.query(models.OtpCode)
        .filter(models.OtpCode.email == payload.email, models.OtpCode.code == payload.code, models.OtpCode.consumed == False)
        .order_by(models.OtpCode.id.desc())
        .first()
    )

    if not otp or otp.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    otp.consumed = True
    db.add(otp)
    db.commit()

    user = auth.get_user(db, email=payload.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    if not user.is_verified and user.role != models.UserRole.admin:
        raise HTTPException(status_code=403, detail="User account not yet verified by admin")

    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)
    user_schema = schemas.User.model_validate(user)
    return {"access_token": access_token, "token_type": "bearer", "user": user_schema}