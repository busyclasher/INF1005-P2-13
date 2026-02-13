"""
Dashboard API routes (dummy implementation).
"""
from fastapi import APIRouter

from app.dummy_data import (
    DUMMY_CASHFLOW_TREND,
    DUMMY_EXPENSE_BREAKDOWN,
    DUMMY_KPI,
    DUMMY_REVENUE_CHART,
)
from app.schemas.dashboard import (
    CashFlowTrendPoint,
    ExpenseCategory,
    KPIResponse,
    RevenueChartPoint,
)

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/kpi", response_model=KPIResponse)
async def get_kpis():
    """Aggregated KPIs: revenue, expenses, net cash flow, burn rate."""
    return DUMMY_KPI


@router.get("/revenue-chart", response_model=list[RevenueChartPoint])
async def get_revenue_chart():
    """Monthly revenue time-series for charting."""
    return DUMMY_REVENUE_CHART


@router.get("/expense-breakdown", response_model=list[ExpenseCategory])
async def get_expense_breakdown():
    """Expenses grouped by category."""
    return DUMMY_EXPENSE_BREAKDOWN


@router.get("/cash-flow-trend", response_model=list[CashFlowTrendPoint])
async def get_cash_flow_trend():
    """Daily inflow vs outflow trend (last 30 days)."""
    return DUMMY_CASHFLOW_TREND
