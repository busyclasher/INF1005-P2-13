"""
Account API routes (dummy implementation).
"""
from uuid import UUID, uuid4
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from app.dummy_data import DUMMY_ACCOUNTS, ORG_ID
from app.schemas.account import AccountCreate, AccountResponse, AccountUpdate

router = APIRouter(prefix="/accounts", tags=["Accounts"])


@router.get("", response_model=list[AccountResponse])
async def list_accounts():
    """List all accounts for the organization."""
    return DUMMY_ACCOUNTS


@router.post("", response_model=AccountResponse, status_code=201)
async def create_account(body: AccountCreate):
    """Create a new financial account."""
    now = datetime.now(timezone.utc)
    return {
        "id": uuid4(),
        "organization_id": ORG_ID,
        "account_name": body.account_name,
        "account_type": body.account_type,
        "currency": body.currency,
        "current_balance": body.current_balance,
        "created_at": now,
        "updated_at": now,
    }


@router.get("/{account_id}", response_model=AccountResponse)
async def get_account(account_id: UUID):
    """Get a single account by ID."""
    for acc in DUMMY_ACCOUNTS:
        if acc["id"] == account_id:
            return acc
    raise HTTPException(status_code=404, detail="Account not found")


@router.put("/{account_id}", response_model=AccountResponse)
async def update_account(account_id: UUID, body: AccountUpdate):
    """Update an account."""
    for acc in DUMMY_ACCOUNTS:
        if acc["id"] == account_id:
            updated = {**acc}
            if body.account_name is not None:
                updated["account_name"] = body.account_name
            if body.account_type is not None:
                updated["account_type"] = body.account_type
            if body.currency is not None:
                updated["currency"] = body.currency
            if body.current_balance is not None:
                updated["current_balance"] = body.current_balance
            updated["updated_at"] = datetime.now(timezone.utc)
            return updated
    raise HTTPException(status_code=404, detail="Account not found")


@router.delete("/{account_id}", status_code=204)
async def delete_account(account_id: UUID):
    """Soft-delete an account."""
    return None
