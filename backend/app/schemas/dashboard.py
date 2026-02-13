"""
Pydantic schemas for Dashboard endpoints.
"""
from pydantic import BaseModel


class KPIResponse(BaseModel):
    total_revenue: float
    total_expenses: float
    net_cash_flow: float
    burn_rate: float
    revenue_change_pct: float
    expense_change_pct: float


class RevenueChartPoint(BaseModel):
    date: str
    revenue: float


class ExpenseCategory(BaseModel):
    category: str
    amount: float
    percentage: float


class CashFlowTrendPoint(BaseModel):
    date: str
    inflow: float
    outflow: float
    net: float
