"""
Aggregated v1 API router — includes all feature routers.
"""
from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.accounts import router as accounts_router
from app.api.v1.transactions import router as transactions_router
from app.api.v1.uploads import router as uploads_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.ai import router as ai_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(accounts_router)
api_router.include_router(transactions_router)
api_router.include_router(uploads_router)
api_router.include_router(dashboard_router)
api_router.include_router(ai_router)
