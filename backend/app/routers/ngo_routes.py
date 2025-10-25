# backend/app/routers/ngo_routes.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import schemas, models, auth, database

router = APIRouter()

@router.get("/ngo/food/available", response_model=List[schemas.FoodItem])
def get_available_food_donations(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_ngo)
):
    available_food = db.query(models.FoodItem).filter(
        models.FoodItem.status == models.FoodStatus.pending
    ).order_by(models.FoodItem.pickup_time.asc()).all()
    return available_food

@router.post("/ngo/food/claim/{food_item_id}", response_model=schemas.Claim)
def claim_food_item(
    food_item_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_ngo)
):
    # 1. Find the food item
    db_food_item = db.query(models.FoodItem).filter(models.FoodItem.id == food_item_id).first()
    
    if not db_food_item:
        raise HTTPException(status_code=404, detail="Food item not found")
        
    # 2. Check if it's still pending
    if db_food_item.status != models.FoodStatus.pending:
        raise HTTPException(status_code=400, detail="Food item is no longer available")
        
    # 3. Create the claim
    new_claim = models.Claim(
        food_item_id=food_item_id,
        ngo_id=current_user.id,
        status=models.FoodStatus.claimed
    )
    
    # 4. Update the food item status
    db_food_item.status = models.FoodStatus.claimed
    
    db.add(new_claim)
    db.add(db_food_item)
    db.commit()
    db.refresh(new_claim)
    
    return new_claim

@router.put("/ngo/food/claim/{claim_id}", response_model=schemas.Claim)
def update_claim_status(
    claim_id: int,
    claim_update: schemas.ClaimUpdate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_ngo)
):
    db_claim = db.query(models.Claim).filter(models.Claim.id == claim_id).first()
    
    if not db_claim:
        raise HTTPException(status_code=404, detail="Claim not found")
        
    if db_claim.ngo_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this claim")
        
    # Update status for both claim and food item
    db_claim.status = claim_update.status
    db_claim.food_item.status = claim_update.status
    
    db.commit()
    db.refresh(db_claim)
    return db_claim

@router.get("/ngo/food/history", response_model=List[schemas.Claim])
def get_ngo_claim_history(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_ngo)
):
    history = db.query(models.Claim).filter(models.Claim.ngo_id == current_user.id).order_by(models.Claim.claimed_at.desc()).all()
    return history