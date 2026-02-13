"""
AI / ML API routes (dummy implementation).
"""
from fastapi import APIRouter

from app.dummy_data import DUMMY_FORECAST, DUMMY_RISK_SCORE
from app.schemas.ai import (
    AnalyzeRequest,
    AnalyzeResponse,
    ForecastResponse,
    RiskScoreResponse,
)

router = APIRouter(prefix="/ai", tags=["AI / ML"])


@router.post("/forecast", response_model=ForecastResponse, status_code=201)
async def generate_forecast():
    """Trigger a new cash flow forecast."""
    return DUMMY_FORECAST


@router.get("/forecast/latest", response_model=ForecastResponse)
async def get_latest_forecast():
    """Get the most recent forecast for the organization."""
    return DUMMY_FORECAST


@router.get("/forecast/history")
async def get_forecast_history():
    """Historical forecast accuracy."""
    return {
        "history": [
            {"model_version": "v0.1.0-dummy", "mae": 1_250.00, "rmse": 1_820.00, "generated_at": "2026-02-01"},
        ]
    }


@router.post("/risk-score", response_model=RiskScoreResponse, status_code=201)
async def generate_risk_score():
    """Trigger risk score calculation."""
    return DUMMY_RISK_SCORE


@router.get("/risk-score/latest", response_model=RiskScoreResponse)
async def get_latest_risk_score():
    """Get the latest risk score."""
    return DUMMY_RISK_SCORE


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_natural_language(body: AnalyzeRequest):
    """Natural language query about financial data (OpenAI)."""
    return AnalyzeResponse(
        query=body.query,
        answer=(
            "Based on your financial data, your net cash flow has been positive for the "
            "last 3 months averaging $14,377/month. Your largest expense category is Salaries "
            "at 40.1% of total expenses. Revenue is trending upward at +12.5% MoM."
        ),
        data_points=[
            {"metric": "avg_monthly_net", "value": 14_377.00},
            {"metric": "top_expense_category", "value": "Salaries"},
            {"metric": "revenue_trend_pct", "value": 12.5},
        ],
    )
