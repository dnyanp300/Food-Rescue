# backend/app/models.py
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum , Boolean
from sqlalchemy.orm import relationship
from .database import Base
import enum
from datetime import datetime

class UserRole(str, enum.Enum):
    donor = "donor"
    ngo = "ngo"
    admin = "admin"

class FoodStatus(str, enum.Enum):
    pending = "pending"
    claimed = "claimed"
    delivered = "delivered"
    cancelled = "cancelled"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    location = Column(String) # e.g., "Whitefield, Bangalore"
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False) # For admin approval

    # Relationships
    food_submissions = relationship("FoodItem", back_populates="donor")
    claims = relationship("Claim", back_populates="ngo")

class FoodItem(Base):
    __tablename__ = "food_items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(String)
    quantity = Column(String, nullable=False) # e.g., "20 packets" or "10 kg"
    location = Column(String, nullable=False)
    pickup_time = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    image_url = Column(String, nullable=True)
    status = Column(Enum(FoodStatus), default=FoodStatus.pending)
    
    donor_id = Column(Integer, ForeignKey("users.id"))
    donor = relationship("User", back_populates="food_submissions")
    
    claim = relationship("Claim", back_populates="food_item", uselist=False)

class Claim(Base):
    __tablename__ = "claims"
    id = Column(Integer, primary_key=True, index=True)
    food_item_id = Column(Integer, ForeignKey("food_items.id"), unique=True)
    ngo_id = Column(Integer, ForeignKey("users.id"))
    claimed_at = Column(DateTime, default=datetime.utcnow)
    status = Column(Enum(FoodStatus), default=FoodStatus.claimed) # Can be updated to delivered/cancelled
    
    food_item = relationship("FoodItem", back_populates="claim")
    ngo = relationship("User", back_populates="claims")

class OtpCode(Base):
    __tablename__ = "otp_codes"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True, nullable=False)
    code = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    consumed = Column(Boolean, default=False)