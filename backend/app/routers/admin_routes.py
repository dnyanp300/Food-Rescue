# backend/app/routers/admin_routes.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from .. import schemas, models, auth, database

router = APIRouter()

@router.get("/admin/users", response_model=List[schemas.User])
def get_all_users(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_admin)
):
    users = db.query(models.User).all()
    return users

@router.put("/admin/users/{user_id}/verify", response_model=schemas.User)
def verify_user(
    user_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_admin)
):
    user_to_verify = db.query(models.User).filter(models.User.id == user_id).first()
    if not user_to_verify:
        raise HTTPException(status_code=404, detail="User not found")
        
    user_to_verify.is_verified = True
    db.commit()
    db.refresh(user_to_verify)
    return user_to_verify

# ... (Add other admin actions like suspend_user, etc.)

@router.get("/admin/analytics", response_model=schemas.AIAnalyticsResponse)
def get_platform_analytics(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_admin)
):
    # This is a simple DB query. The real AI analytics is in ai_routes.
    total_food = db.query(models.FoodItem).filter(models.FoodItem.status == models.FoodStatus.delivered).count()
    
    # Example of finding top locations
    top_donor_locs = db.query(
        models.FoodItem.location, func.count(models.FoodItem.id).label('count')
    ).group_by(models.FoodItem.location).order_by(func.count(models.FoodItem.id).desc()).limit(3).all()
    
    return {
        "total_food_redistributed": total_food,
        "top_donor_locations": [{"location": loc, "count": count} for loc, count in top_donor_locs],
        "top_ngo_locations": [], # Could add similar logic for NGOs
        "insight": "Data analysis complete. Run AI analytics for deeper insights."
    }