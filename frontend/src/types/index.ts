/**
 * Shared TypeScript types matching the backend Pydantic schemas.
 */

// --- Enums ---
export type UserRole = "owner" | "admin" | "viewer";
export type AccountType = "bank" | "credit_card" | "cash" | "other";
export type TransactionDirection = "inflow" | "outflow";
export type UploadStatus = "pending" | "processing" | "completed" | "failed";
export type RiskLevel = "low" | "medium" | "high" | "critical";

// --- Auth ---
export interface TokenResponse {
  access_token: string;
  token_type: string;
}

// --- User ---
export interface User {
  id: string;
  organization_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

// --- Organization ---
export interface Organization {
  id: string;
  name: string;
  industry: string | null;
  country: string | null;
  timezone: string;
  created_at: string;
}

// --- Account ---
export interface Account {
  id: string;
  organization_id: string;
  account_name: string;
  account_type: AccountType;
  currency: string;
  current_balance: number;
  created_at: string;
  updated_at: string;
}

// --- Transaction ---
export interface Transaction {
  id: string;
  account_id: string;
  csv_upload_id: string | null;
  transaction_date: string;
  description: string;
  amount: number;
  direction: TransactionDirection;
  category: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface TransactionSummary {
  period: string;
  total_inflow: number;
  total_outflow: number;
  net: number;
}

// --- Upload ---
export interface Upload {
  id: string;
  organization_id: string;
  uploaded_by: string;
  original_filename: string;
  status: UploadStatus;
  rows_parsed: number;
  rows_failed: number;
  column_mapping: Record<string, string> | null;
  error_log: Array<{ row: number; error: string }> | null;
  created_at: string;
}

export interface UploadPreview {
  id: string;
  original_filename: string;
  headers: string[];
  sample_rows: Record<string, string>[];
  suggested_mapping: Record<string, string>;
}

// --- Dashboard ---
export interface KPI {
  total_revenue: number;
  total_expenses: number;
  net_cash_flow: number;
  burn_rate: number;
  revenue_change_pct: number;
  expense_change_pct: number;
}

export interface RevenueChartPoint {
  date: string;
  revenue: number;
}

export interface ExpenseCategory {
  category: string;
  amount: number;
  percentage: number;
}

export interface CashFlowTrendPoint {
  date: string;
  inflow: number;
  outflow: number;
  net: number;
}

// --- AI ---
export interface ForecastPoint {
  date: string;
  predicted_inflow: number;
  predicted_outflow: number;
  predicted_net: number;
  confidence_lower: number;
  confidence_upper: number;
}

export interface Forecast {
  id: string;
  organization_id: string;
  model_version: string;
  generated_at: string;
  forecasts: ForecastPoint[];
}

export interface RiskFactor {
  factor: string;
  score: number;
  description: string;
}

export interface RiskScore {
  id: string;
  organization_id: string;
  score_date: string;
  overall_score: number;
  risk_level: RiskLevel;
  factors: RiskFactor[];
  summary_text: string;
  model_version: string;
  generated_at: string;
}
