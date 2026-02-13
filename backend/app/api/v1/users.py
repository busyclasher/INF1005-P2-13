"""
User API routes (dummy implementation).
"""
from fastapi import APIRouter

from app.dummy_data import DUMMY_USER, DUMMY_USERS
from app.schemas.user import (
    InviteUserRequest,
    UserResponse,
    UserUpdateRequest,
)

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
async def get_current_user():
    """Get the current authenticated user."""
    return DUMMY_USER


@router.put("/me", response_model=UserResponse)
async def update_current_user(body: UserUpdateRequest):
    """Update current user profile."""
    user = {**DUMMY_USER}
    if body.full_name:
        user["full_name"] = body.full_name
    if body.email:
        user["email"] = body.email
    return user


@router.get("", response_model=list[UserResponse])
async def list_users():
    """List all users in the organization."""
    return DUMMY_USERS


@router.post("/invite", response_model=UserResponse, status_code=201)
async def invite_user(body: InviteUserRequest):
    """Invite a new user to the organization."""
    from uuid import uuid4
    from datetime import datetime, timezone
    from app.dummy_data import ORG_ID

    return {
        "id": uuid4(),
        "organization_id": ORG_ID,
        "email": body.email,
        "full_name": "New User",
        "role": body.role,
        "is_active": False,
        "last_login": None,
        "created_at": datetime.now(timezone.utc),
    }
