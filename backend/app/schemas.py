# backend/app/schemas.py
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from .models import UserRole, FoodStatus

# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    name: str
    location: Optional[str] = None
    role: UserRole

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    is_verified: bool

    class Config:
        from_attributes = True

# --- Auth Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class TokenData(BaseModel):
    email: Optional[str] = None

# --- Food Schemas ---
class FoodItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    quantity: str
    location: str
    pickup_time: datetime

class FoodItemCreate(FoodItemBase):
    pass

class FoodItem(FoodItemBase):
    id: int
    created_at: datetime
    status: FoodStatus
    donor_id: int
    donor: User
    image_url: Optional[str] = None

    class Config:
        orm_mode = True

# --- Claim Schemas ---
class ClaimBase(BaseModel):
    food_item_id: int

class Claim(ClaimBase):
    id: int
    ngo_id: int
    claimed_at: datetime
    status: FoodStatus
    food_item: FoodItem # Nested food item details
    ngo: User # Nested NGO details

class Config:
    from_attributes = True

class ClaimUpdate(BaseModel):
    status: FoodStatus # Only status can be updated (delivered/cancelled)

# --- AI Schemas ---
class AIShelfLifeRequest(BaseModel):
    description: str

class AIShelfLifeResponse(BaseModel):
    shelf_life_estimation: str
    warnings: List[str]

class AIMatchRequest(BaseModel):
    location: str
    food_type: str
    quantity: str

class AINgoSuggestion(BaseModel):
    ngo_id: int
    name: str
    location: str
    match_score: float # 0.0 to 1.0
    reason: str

class AIMatchResponse(BaseModel):
    suggestions: List[AINgoSuggestion]

class AIDraftMessageRequest(BaseModel):
    food_name: str
    quantity: str
    location: str
    pickup_time: datetime

class AIDraftMessageResponse(BaseModel):
    draft_message: str

class AIAnalyticsResponse(BaseModel):
    total_food_redistributed: int
    top_donor_locations: List[dict]
    top_ngo_locations: List[dict]
    insight: str