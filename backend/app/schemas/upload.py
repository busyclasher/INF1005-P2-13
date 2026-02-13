"""
Pydantic schemas for CSV Upload endpoints.
"""
from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel


class UploadStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class UploadResponse(BaseModel):
    id: UUID
    organization_id: UUID
    uploaded_by: UUID
    original_filename: str
    status: UploadStatus
    rows_parsed: int
    rows_failed: int
    column_mapping: dict | None
    error_log: list | None
    created_at: datetime

    class Config:
        from_attributes = True


class UploadPreviewResponse(BaseModel):
    id: UUID
    original_filename: str
    headers: list[str]
    sample_rows: list[dict]
    suggested_mapping: dict


class ConfirmMappingRequest(BaseModel):
    column_mapping: dict
