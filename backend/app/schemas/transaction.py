"""
Pydantic schemas for Transaction endpoints.
"""
from datetime import date, datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel


class TransactionDirection(str, Enum):
    INFLOW = "inflow"
    OUTFLOW = "outflow"


class TransactionCreate(BaseModel):
    account_id: UUID
    transaction_date: date
    description: str
    amount: float
    direction: TransactionDirection
    category: str = "Uncategorized"
    metadata: dict | None = None


class TransactionUpdate(BaseModel):
    description: str | None = None
    amount: float | None = None
    direction: TransactionDirection | None = None
    category: str | None = None


class TransactionResponse(BaseModel):
    id: UUID
    account_id: UUID
    csv_upload_id: UUID | None
    transaction_date: date
    description: str
    amount: float
    direction: TransactionDirection
    category: str
    metadata: dict | None
    created_at: datetime

    class Config:
        from_attributes = True


class TransactionSummaryResponse(BaseModel):
    period: str
    total_inflow: float
    total_outflow: float
    net: float
