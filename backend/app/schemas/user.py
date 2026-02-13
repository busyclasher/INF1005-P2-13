"""
Pydantic schemas for User and Auth endpoints.
"""
from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, EmailStr


class UserRole(str, Enum):
    OWNER = "owner"
    ADMIN = "admin"
    VIEWER = "viewer"


# --- Request schemas ---

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    organization_name: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserUpdateRequest(BaseModel):
    full_name: str | None = None
    email: EmailStr | None = None


class InviteUserRequest(BaseModel):
    email: EmailStr
    role: UserRole = UserRole.VIEWER


# --- Response schemas ---

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: UUID
    organization_id: UUID
    email: str
    full_name: str
    role: UserRole
    is_active: bool
    last_login: datetime | None
    created_at: datetime

    class Config:
        from_attributes = True


class OrganizationResponse(BaseModel):
    id: UUID
    name: str
    industry: str | None
    country: str | None
    timezone: str
    created_at: datetime

    class Config:
        from_attributes = True
