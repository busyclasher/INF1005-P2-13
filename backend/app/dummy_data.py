"""
Dummy / seed data for development.
Returns realistic-looking mock data for all API endpoints.
"""
import random
from datetime import date, datetime, timedelta, timezone
from uuid import UUID, uuid4

# ---------------------------------------------------------------------------
# Fixed IDs so relationships are consistent across endpoints
# ---------------------------------------------------------------------------
ORG_ID = UUID("a1b2c3d4-e5f6-7890-abcd-ef1234567890")
USER_ID = UUID("11111111-2222-3333-4444-555555555555")
ACCOUNT_BANK_ID = UUID("aaaa1111-bbbb-cccc-dddd-eeeeeeee0001")
ACCOUNT_CARD_ID = UUID("aaaa1111-bbbb-cccc-dddd-eeeeeeee0002")
ACCOUNT_CASH_ID = UUID("aaaa1111-bbbb-cccc-dddd-eeeeeeee0003")
UPLOAD_ID = UUID("cccc1111-dddd-eeee-ffff-aaaaaaaaa001")

NOW = datetime.now(timezone.utc)

# ---------------------------------------------------------------------------
# Users & Org
# ---------------------------------------------------------------------------
DUMMY_ORG = {
    "id": ORG_ID,
    "name": "Acme Pte Ltd",
    "industry": "Retail",
    "country": "Singapore",
    "timezone": "Asia/Singapore",
    "created_at": NOW - timedelta(days=120),
}

DUMMY_USER = {
    "id": USER_ID,
    "organization_id": ORG_ID,
    "email": "owner@acme.sg",
    "full_name": "Jane Tan",
    "role": "owner",
    "is_active": True,
    "last_login": NOW - timedelta(hours=2),
    "created_at": NOW - timedelta(days=120),
}

DUMMY_USERS = [
    DUMMY_USER,
    {
        "id": uuid4(),
        "organization_id": ORG_ID,
        "email": "alex@acme.sg",
        "full_name": "Alex Lim",
        "role": "admin",
        "is_active": True,
        "last_login": NOW - timedelta(days=1),
        "created_at": NOW - timedelta(days=90),
    },
    {
        "id": uuid4(),
        "organization_id": ORG_ID,
        "email": "mei@acme.sg",
        "full_name": "Mei Wong",
        "role": "viewer",
        "is_active": True,
        "last_login": NOW - timedelta(days=3),
        "created_at": NOW - timedelta(days=60),
    },
]

# ---------------------------------------------------------------------------
# Accounts
# ---------------------------------------------------------------------------
DUMMY_ACCOUNTS = [
    {
        "id": ACCOUNT_BANK_ID,
        "organization_id": ORG_ID,
        "account_name": "DBS Business Account",
        "account_type": "bank",
        "currency": "SGD",
        "current_balance": 45_230.50,
        "created_at": NOW - timedelta(days=120),
        "updated_at": NOW - timedelta(days=1),
    },
    {
        "id": ACCOUNT_CARD_ID,
        "organization_id": ORG_ID,
        "account_name": "Corporate Credit Card",
        "account_type": "credit_card",
        "currency": "SGD",
        "current_balance": -2_150.00,
        "created_at": NOW - timedelta(days=100),
        "updated_at": NOW - timedelta(days=2),
    },
    {
        "id": ACCOUNT_CASH_ID,
        "organization_id": ORG_ID,
        "account_name": "Petty Cash",
        "account_type": "cash",
        "currency": "SGD",
        "current_balance": 500.00,
        "created_at": NOW - timedelta(days=90),
        "updated_at": NOW - timedelta(days=5),
    },
]

# ---------------------------------------------------------------------------
# Transactions
# ---------------------------------------------------------------------------
CATEGORIES_INFLOW = ["Sales Revenue", "Service Income", "Interest", "Refund"]
CATEGORIES_OUTFLOW = ["Rent", "Salaries", "Utilities", "Supplies", "Marketing", "Software", "Travel"]
DESCRIPTIONS_INFLOW = [
    "Payment from Client A", "Online store sale", "Consulting fee",
    "Invoice #1042 paid", "Subscription renewal", "Workshop registration",
]
DESCRIPTIONS_OUTFLOW = [
    "Office rent - Feb", "AWS monthly bill", "Staff salary - Jan",
    "Google Ads campaign", "Office supplies", "Electricity bill",
    "Team lunch", "Software license renewal",
]


def _generate_transactions(count: int = 40) -> list[dict]:
    txns = []
    for i in range(count):
        direction = random.choice(["inflow", "outflow"])
        txns.append({
            "id": uuid4(),
            "account_id": random.choice([ACCOUNT_BANK_ID, ACCOUNT_CARD_ID, ACCOUNT_CASH_ID]),
            "csv_upload_id": None,
            "transaction_date": (date.today() - timedelta(days=random.randint(0, 90))).isoformat(),
            "description": random.choice(
                DESCRIPTIONS_INFLOW if direction == "inflow" else DESCRIPTIONS_OUTFLOW
            ),
            "amount": round(random.uniform(50, 12_000), 2),
            "direction": direction,
            "category": random.choice(
                CATEGORIES_INFLOW if direction == "inflow" else CATEGORIES_OUTFLOW
            ),
            "metadata": None,
            "created_at": NOW - timedelta(days=random.randint(0, 90)),
        })
    txns.sort(key=lambda t: t["transaction_date"], reverse=True)
    return txns


DUMMY_TRANSACTIONS = _generate_transactions()

# ---------------------------------------------------------------------------
# CSV Uploads
# ---------------------------------------------------------------------------
DUMMY_UPLOADS = [
    {
        "id": UPLOAD_ID,
        "organization_id": ORG_ID,
        "uploaded_by": USER_ID,
        "original_filename": "jan_2026_transactions.csv",
        "status": "completed",
        "rows_parsed": 142,
        "rows_failed": 3,
        "column_mapping": {
            "Date": "transaction_date",
            "Description": "description",
            "Amount": "amount",
            "Type": "direction",
        },
        "error_log": [
            {"row": 45, "error": "Invalid date format"},
            {"row": 89, "error": "Missing amount"},
            {"row": 131, "error": "Unknown category"},
        ],
        "created_at": NOW - timedelta(days=15),
    },
]

DUMMY_UPLOAD_PREVIEW = {
    "id": UPLOAD_ID,
    "original_filename": "feb_2026_transactions.csv",
    "headers": ["Date", "Description", "Amount", "Type", "Category"],
    "sample_rows": [
        {"Date": "2026-02-01", "Description": "Office rent", "Amount": "3500.00", "Type": "outflow", "Category": "Rent"},
        {"Date": "2026-02-03", "Description": "Client payment", "Amount": "8200.00", "Type": "inflow", "Category": "Sales Revenue"},
        {"Date": "2026-02-05", "Description": "Electricity bill", "Amount": "420.50", "Type": "outflow", "Category": "Utilities"},
    ],
    "suggested_mapping": {
        "Date": "transaction_date",
        "Description": "description",
        "Amount": "amount",
        "Type": "direction",
        "Category": "category",
    },
}

# ---------------------------------------------------------------------------
# Dashboard KPIs
# ---------------------------------------------------------------------------
DUMMY_KPI = {
    "total_revenue": 128_450.00,
    "total_expenses": 87_320.00,
    "net_cash_flow": 41_130.00,
    "burn_rate": 29_106.67,
    "revenue_change_pct": 12.5,
    "expense_change_pct": -3.2,
}


def _generate_revenue_chart() -> list[dict]:
    points = []
    for i in range(12):
        d = date.today().replace(day=1) - timedelta(days=30 * (11 - i))
        points.append({
            "date": d.strftime("%Y-%m"),
            "revenue": round(random.uniform(8_000, 18_000), 2),
        })
    return points


DUMMY_REVENUE_CHART = _generate_revenue_chart()

DUMMY_EXPENSE_BREAKDOWN = [
    {"category": "Salaries", "amount": 35_000.00, "percentage": 40.1},
    {"category": "Rent", "amount": 14_000.00, "percentage": 16.0},
    {"category": "Marketing", "amount": 12_500.00, "percentage": 14.3},
    {"category": "Software", "amount": 8_200.00, "percentage": 9.4},
    {"category": "Utilities", "amount": 5_800.00, "percentage": 6.6},
    {"category": "Supplies", "amount": 4_320.00, "percentage": 4.9},
    {"category": "Travel", "amount": 3_800.00, "percentage": 4.4},
    {"category": "Other", "amount": 3_700.00, "percentage": 4.3},
]


def _generate_cashflow_trend() -> list[dict]:
    points = []
    for i in range(30):
        d = date.today() - timedelta(days=29 - i)
        inflow = round(random.uniform(2_000, 8_000), 2)
        outflow = round(random.uniform(1_500, 6_000), 2)
        points.append({
            "date": d.isoformat(),
            "inflow": inflow,
            "outflow": outflow,
            "net": round(inflow - outflow, 2),
        })
    return points


DUMMY_CASHFLOW_TREND = _generate_cashflow_trend()

# ---------------------------------------------------------------------------
# AI / ML
# ---------------------------------------------------------------------------
FORECAST_ID = uuid4()
RISK_ID = uuid4()


def _generate_forecast() -> dict:
    forecasts = []
    for i in range(30):
        d = date.today() + timedelta(days=i + 1)
        inflow = round(random.uniform(3_000, 9_000), 2)
        outflow = round(random.uniform(2_000, 7_000), 2)
        net = round(inflow - outflow, 2)
        forecasts.append({
            "date": d.isoformat(),
            "predicted_inflow": inflow,
            "predicted_outflow": outflow,
            "predicted_net": net,
            "confidence_lower": round(net - random.uniform(500, 2000), 2),
            "confidence_upper": round(net + random.uniform(500, 2000), 2),
        })
    return {
        "id": FORECAST_ID,
        "organization_id": ORG_ID,
        "model_version": "v0.1.0-dummy",
        "generated_at": NOW.isoformat(),
        "forecasts": forecasts,
    }


DUMMY_FORECAST = _generate_forecast()

DUMMY_RISK_SCORE = {
    "id": RISK_ID,
    "organization_id": ORG_ID,
    "score_date": date.today().isoformat(),
    "overall_score": 72.5,
    "risk_level": "medium",
    "factors": [
        {"factor": "Burn Rate", "score": 65.0, "description": "Monthly burn rate is moderate relative to revenue."},
        {"factor": "Liquidity Ratio", "score": 78.0, "description": "Sufficient liquid assets to cover 2.5 months of expenses."},
        {"factor": "Revenue Concentration", "score": 55.0, "description": "Top 3 clients account for 60% of revenue."},
        {"factor": "Expense Volatility", "score": 82.0, "description": "Expenses are relatively stable month-over-month."},
        {"factor": "Cash Runway", "score": 80.0, "description": "Projected runway of 8+ months at current burn rate."},
    ],
    "summary_text": "Your financial health is moderate. Key concern is revenue concentration — diversifying your client base would reduce risk. Liquidity and cash runway are healthy.",
    "model_version": "v0.1.0-dummy",
    "generated_at": NOW.isoformat(),
}
