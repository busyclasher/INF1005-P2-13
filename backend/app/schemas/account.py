"""
Pydantic schemas for Account endpoints.
"""
from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel


class AccountType(str, Enum):
    BANK = "bank"
    CREDIT_CARD = "credit_card"
    CASH = "cash"
    OTHER = "other"


class AccountCreate(BaseModel):
    account_name: str
    account_type: AccountType = AccountType.BANK
    currency: str = "SGD"
    current_balance: float = 0.0


class AccountUpdate(BaseModel):
    account_name: str | None = None
    account_type: AccountType | None = None
    currency: str | None = None
    current_balance: float | None = None


class AccountResponse(BaseModel):
    id: UUID
    organization_id: UUID
    account_name: str
    account_type: AccountType
    currency: str
    current_balance: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
