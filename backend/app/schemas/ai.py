"""
Pydantic schemas for AI/ML endpoints.
"""
from datetime import date, datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel


class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class ForecastPoint(BaseModel):
    date: date
    predicted_inflow: float
    predicted_outflow: float
    predicted_net: float
    confidence_lower: float
    confidence_upper: float


class ForecastResponse(BaseModel):
    id: UUID
    organization_id: UUID
    model_version: str
    generated_at: datetime
    forecasts: list[ForecastPoint]


class RiskFactorBreakdown(BaseModel):
    factor: str
    score: float
    description: str


class RiskScoreResponse(BaseModel):
    id: UUID
    organization_id: UUID
    score_date: date
    overall_score: float
    risk_level: RiskLevel
    factors: list[RiskFactorBreakdown]
    summary_text: str
    model_version: str
    generated_at: datetime


class AnalyzeRequest(BaseModel):
    query: str


class AnalyzeResponse(BaseModel):
    query: str
    answer: str
    data_points: list[dict] | None = None
