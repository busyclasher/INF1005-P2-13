"""
Transaction API routes (dummy implementation).
"""
from uuid import UUID, uuid4
from datetime import datetime, timezone

from fastapi import APIRouter, Query

from app.dummy_data import DUMMY_TRANSACTIONS
from app.schemas.transaction import (
    TransactionCreate,
    TransactionResponse,
    TransactionSummaryResponse,
    TransactionUpdate,
)

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.get("", response_model=list[TransactionResponse])
async def list_transactions(
    account_id: UUID | None = Query(None),
    direction: str | None = Query(None),
    category: str | None = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    """List transactions with filtering and pagination."""
    filtered = DUMMY_TRANSACTIONS
    if account_id:
        filtered = [t for t in filtered if t["account_id"] == account_id]
    if direction:
        filtered = [t for t in filtered if t["direction"] == direction]
    if category:
        filtered = [t for t in filtered if t["category"] == category]
    return filtered[offset : offset + limit]


@router.post("", response_model=TransactionResponse, status_code=201)
async def create_transaction(body: TransactionCreate):
    """Create a single transaction."""
    return {
        "id": uuid4(),
        "account_id": body.account_id,
        "csv_upload_id": None,
        "transaction_date": body.transaction_date,
        "description": body.description,
        "amount": body.amount,
        "direction": body.direction,
        "category": body.category,
        "metadata": body.metadata,
        "created_at": datetime.now(timezone.utc),
    }


@router.get("/summary", response_model=list[TransactionSummaryResponse])
async def transaction_summary():
    """Aggregated inflow / outflow / net by month."""
    # Simplified dummy aggregation
    return [
        {"period": "2026-01", "total_inflow": 42_300.00, "total_outflow": 28_100.00, "net": 14_200.00},
        {"period": "2025-12", "total_inflow": 38_600.00, "total_outflow": 31_500.00, "net": 7_100.00},
        {"period": "2025-11", "total_inflow": 47_550.00, "total_outflow": 27_720.00, "net": 19_830.00},
    ]


@router.get("/{transaction_id}", response_model=TransactionResponse)
async def get_transaction(transaction_id: UUID):
    """Get a single transaction."""
    for txn in DUMMY_TRANSACTIONS:
        if txn["id"] == transaction_id:
            return txn
    return DUMMY_TRANSACTIONS[0]


@router.put("/{transaction_id}", response_model=TransactionResponse)
async def update_transaction(transaction_id: UUID, body: TransactionUpdate):
    """Update a transaction."""
    txn = {**DUMMY_TRANSACTIONS[0], "id": transaction_id}
    if body.description is not None:
        txn["description"] = body.description
    if body.amount is not None:
        txn["amount"] = body.amount
    if body.direction is not None:
        txn["direction"] = body.direction
    if body.category is not None:
        txn["category"] = body.category
    return txn


@router.delete("/{transaction_id}", status_code=204)
async def delete_transaction(transaction_id: UUID):
    """Delete a transaction."""
    return None
