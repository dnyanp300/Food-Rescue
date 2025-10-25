# backend/app/routers/donor_routes.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import schemas, models, auth, database

router = APIRouter()

@router.post("/donor/food", response_model=schemas.FoodItem)
def submit_food_donation(
    food: schemas.FoodItemCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_donor)
):
    # TODO: Add image upload logic here. For now, we'll skip it.
    
    db_food_item = models.FoodItem(
        **food.dict(),
        donor_id=current_user.id,
        status=models.FoodStatus.pending
        # image_url= "path/to/uploaded/image.jpg" # Add this once upload is handled
    )
    db.add(db_food_item)
    db.commit()
    db.refresh(db_food_item)
    return db_food_item

@router.get("/donor/food/history", response_model=List[schemas.FoodItem])
def get_donor_submission_history(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_donor)
):
    history = db.query(models.FoodItem).filter(models.FoodItem.donor_id == current_user.id).order_by(models.FoodItem.created_at.desc()).all()
    return history