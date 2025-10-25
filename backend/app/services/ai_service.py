# backend/app/services/ai_service.py
from typing import List
from .. import schemas, models
from sqlalchemy.orm import Session
from sqlalchemy import func
"""
THIS IS A MOCK AI SERVICE.
Replace the logic in these functions with actual calls to the 
Google Gemini API (google-generativeai) using your API key.

Example (pseudocode):
import google.generativeai as genai
genai.configure(api_key="YOUR_API_KEY")
model = genai.GenerativeModel('gemini-pro')
"""

async def get_mock_shelf_life(description: str) -> schemas.AIShelfLifeResponse:
    # MOCK LOGIC: Replace with Gemini call
    description = description.lower()
    if "cooked rice" in description:
        return schemas.AIShelfLifeResponse(
            shelf_life_estimation="6-12 hours at room temp, 2-3 days refrigerated.",
            warnings=["High risk of bacterial growth. Refrigerate immediately.", "Reheat thoroughly."]
        )
    elif "bread" in description or "bakery" in description:
        return schemas.AIShelfLifeResponse(
            shelf_life_estimation="1-2 days.",
            warnings=["Best consumed fresh.", "Check for mold."]
        )
    else:
        return schemas.AIShelfLifeResponse(
            shelf_life_estimation="24-48 hours.",
            warnings=["General warning: assess visual and olfactory signs before consumption."]
        )


async def get_mock_ngo_match(req: schemas.AIMatchRequest, db: Session) -> schemas.AIMatchResponse:
    # MOCK LOGIC: Replace with Gemini call
    # This mock just finds all NGOs and gives them a dummy score.
    # A real implementation would query Gemini with NGO profiles and the food details.
    
    ngos = db.query(models.User).filter(models.User.role == models.UserRole.ngo, models.User.is_verified == True).all()
    
    suggestions = []
    for i, ngo in enumerate(ngos):
        score = 1.0 - (i * 0.1) # Dummy score
        reason = f"NGO is active. Location: {ngo.location}."
        if req.location.lower() in ngo.location.lower():
             score = 1.0
             reason = f"High match: NGO is in the same location ({ngo.location})."
             
        suggestions.append(schemas.AINgoSuggestion(
            ngo_id=ngo.id,
            name=ngo.name,
            location=ngo.location,
            match_score=max(0.1, score), # Ensure score is not 0
            reason=reason
        ))
        
    return schemas.AIMatchResponse(suggestions=sorted(suggestions, key=lambda x: x.match_score, reverse=True))


async def get_mock_draft_message(req: schemas.AIDraftMessageRequest) -> schemas.AIDraftMessageResponse:
    # MOCK LOGIC: Replace with Gemini call
    # A real Gemini call would make this more conversational.
    
    msg = f"New food available! {req.quantity} of {req.food_name} at {req.location}. Please pickup around {req.pickup_time.strftime('%I:%M %p, %b %d')}. Can you collect?"
    
    return schemas.AIDraftMessageResponse(draft_message=msg)


async def get_mock_analytics_insight(db: Session) -> schemas.AIAnalyticsResponse:
    # MOCK LOGIC: Replace with Gemini call
    # A real Gemini call would analyze the full dataset.
    
    total_food = db.query(models.FoodItem).filter(models.FoodItem.status == models.FoodStatus.delivered).count()
    top_donor_locs_db = db.query(
        models.FoodItem.location, func.count(models.FoodItem.id).label('count')
    ).group_by(models.FoodItem.location).order_by(func.count(models.FoodItem.id).desc()).limit(3).all()
    
    top_donor_locations = [{"location": loc, "count": count} for loc, count in top_donor_locs_db]

    insight = "Mock AI Insight: Most food waste occurs in Whitefield. Recommend increasing NGO coverage in this area."
    
    # Example of data to send to Gemini:
    # all_items = db.query(models.FoodItem).all()
    # data_summary = [{"location": item.location, "status": item.status, "type": item.name} for item in all_items]
    # prompt = f"Analyze this food donation data and provide an insight: {data_summary}"
    # response = model.generate_content(prompt)
    # insight = response.text
    
    return schemas.AIAnalyticsResponse(
        total_food_redistributed=total_food,
        top_donor_locations=top_donor_locations,
        top_ngo_locations=[], # Add logic for this
        insight=insight
    )