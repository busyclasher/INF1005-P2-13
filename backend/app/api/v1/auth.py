"""
Auth API routes — register, login, refresh (dummy implementation).
"""
from fastapi import APIRouter

from app.core.security import create_access_token, hash_password
from app.dummy_data import DUMMY_USER, DUMMY_ORG
from app.schemas.user import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
    OrganizationResponse,
)

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(body: RegisterRequest):
    """Register a new organization + owner. Returns JWT."""
    # In production: create org + user in DB, hash password, etc.
    _ = hash_password(body.password)
    token = create_access_token({"sub": str(DUMMY_USER["id"]), "org": str(DUMMY_ORG["id"])})
    return TokenResponse(access_token=token)


@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest):
    """Authenticate and return JWT."""
    token = create_access_token({"sub": str(DUMMY_USER["id"]), "org": str(DUMMY_ORG["id"])})
    return TokenResponse(access_token=token)


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token():
    """Refresh access token."""
    token = create_access_token({"sub": str(DUMMY_USER["id"]), "org": str(DUMMY_ORG["id"])})
    return TokenResponse(access_token=token)
