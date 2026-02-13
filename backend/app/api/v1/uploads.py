"""
CSV Upload API routes (dummy implementation).
"""
from uuid import uuid4
from datetime import datetime, timezone

from fastapi import APIRouter, UploadFile, File

from app.dummy_data import DUMMY_UPLOADS, DUMMY_UPLOAD_PREVIEW, ORG_ID, USER_ID
from app.schemas.upload import (
    ConfirmMappingRequest,
    UploadPreviewResponse,
    UploadResponse,
)

router = APIRouter(prefix="/uploads", tags=["CSV Uploads"])


@router.post("/csv", response_model=UploadResponse, status_code=201)
async def upload_csv(file: UploadFile = File(...)):
    """Upload a CSV file for parsing."""
    return {
        "id": uuid4(),
        "organization_id": ORG_ID,
        "uploaded_by": USER_ID,
        "original_filename": file.filename or "unknown.csv",
        "status": "pending",
        "rows_parsed": 0,
        "rows_failed": 0,
        "column_mapping": None,
        "error_log": None,
        "created_at": datetime.now(timezone.utc),
    }


@router.get("/{upload_id}/preview", response_model=UploadPreviewResponse)
async def preview_upload(upload_id: str):
    """Preview parsed rows and auto-detected column mapping."""
    return DUMMY_UPLOAD_PREVIEW


@router.post("/{upload_id}/confirm", response_model=UploadResponse)
async def confirm_mapping(upload_id: str, body: ConfirmMappingRequest):
    """Confirm column mapping and trigger async parsing."""
    upload = {**DUMMY_UPLOADS[0]}
    upload["status"] = "processing"
    upload["column_mapping"] = body.column_mapping
    return upload


@router.get("/{upload_id}/status", response_model=UploadResponse)
async def get_upload_status(upload_id: str):
    """Poll upload parsing status."""
    return DUMMY_UPLOADS[0]


@router.get("", response_model=list[UploadResponse])
async def list_uploads():
    """List all uploads for the organization."""
    return DUMMY_UPLOADS
