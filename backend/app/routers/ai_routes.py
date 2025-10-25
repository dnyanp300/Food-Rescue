# backend/app/routers/ai_routes.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import schemas, models, auth, database
from ..services import ai_service

router = APIRouter()

@router.post("/ai/shelf-life", response_model=schemas.AIShelfLifeResponse)
async def get_shelf_life_estimation(
    req: schemas.AIShelfLifeRequest,
    current_user: models.User = Depends(auth.get_current_active_user)
):
    # In a real app, you'd add your google-generativeai logic here
    return await ai_service.get_mock_shelf_life(req.description)

@router.post("/ai/match-ngo", response_model=schemas.AIMatchResponse)
async def get_smart_ngo_matching(
    req: schemas.AIMatchRequest,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_donor)
):
    return await ai_service.get_mock_ngo_match(req, db)

@router.post("/ai/draft-message", response_model=schemas.AIDraftMessageResponse)
async def get_auto_drafted_message(
    req: schemas.AIDraftMessageRequest,
    current_user: models.User = Depends(auth.get_current_donor)
):
    return await ai_service.get_mock_draft_message(req)


@router.get("/ai/analytics-insight", response_model=schemas.AIAnalyticsResponse)
async def get_ai_analytics_insight(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_admin)
):
    return await ai_service.get_mock_analytics_insight(db)