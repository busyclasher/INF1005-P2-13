/**
 * API client — wraps fetch calls to the FastAPI backend.
 * Base URL defaults to localhost:8000 for dev.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(error.detail || `API error: ${res.status}`);
    }

    if (res.status === 204) return null as T;
    return res.json();
}

// --- Auth ---
export const api = {
    auth: {
        login: (email: string, password: string) =>
            apiFetch("/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            }),
        register: (data: { email: string; password: string; full_name: string; organization_name: string }) =>
            apiFetch("/auth/register", { method: "POST", body: JSON.stringify(data) }),
    },

    // --- Users ---
    users: {
        me: () => apiFetch("/users/me"),
        list: () => apiFetch("/users"),
    },

    // --- Accounts ---
    accounts: {
        list: () => apiFetch("/accounts"),
        create: (data: Record<string, unknown>) =>
            apiFetch("/accounts", { method: "POST", body: JSON.stringify(data) }),
        get: (id: string) => apiFetch(`/accounts/${id}`),
        update: (id: string, data: Record<string, unknown>) =>
            apiFetch(`/accounts/${id}`, { method: "PUT", body: JSON.stringify(data) }),
        delete: (id: string) =>
            apiFetch(`/accounts/${id}`, { method: "DELETE" }),
    },

    // --- Transactions ---
    transactions: {
        list: (params?: Record<string, string>) => {
            const qs = params ? "?" + new URLSearchParams(params).toString() : "";
            return apiFetch(`/transactions${qs}`);
        },
        create: (data: Record<string, unknown>) =>
            apiFetch("/transactions", { method: "POST", body: JSON.stringify(data) }),
        summary: () => apiFetch("/transactions/summary"),
    },

    // --- Uploads ---
    uploads: {
        list: () => apiFetch("/uploads"),
        uploadCSV: (file: File) => {
            const formData = new FormData();
            formData.append("file", file);
            return apiFetch("/uploads/csv", {
                method: "POST",
                body: formData,
                headers: {}, // Let browser set content-type for FormData
            });
        },
        preview: (id: string) => apiFetch(`/uploads/${id}/preview`),
        confirm: (id: string, mapping: Record<string, string>) =>
            apiFetch(`/uploads/${id}/confirm`, {
                method: "POST",
                body: JSON.stringify({ column_mapping: mapping }),
            }),
        status: (id: string) => apiFetch(`/uploads/${id}/status`),
    },

    // --- Dashboard ---
    dashboard: {
        kpi: () => apiFetch("/dashboard/kpi"),
        revenueChart: () => apiFetch("/dashboard/revenue-chart"),
        expenseBreakdown: () => apiFetch("/dashboard/expense-breakdown"),
        cashFlowTrend: () => apiFetch("/dashboard/cash-flow-trend"),
    },

    // --- AI ---
    ai: {
        forecast: () => apiFetch("/ai/forecast/latest"),
        generateForecast: () =>
            apiFetch("/ai/forecast", { method: "POST" }),
        riskScore: () => apiFetch("/ai/risk-score/latest"),
        generateRiskScore: () =>
            apiFetch("/ai/risk-score", { method: "POST" }),
        analyze: (query: string) =>
            apiFetch("/ai/analyze", {
                method: "POST",
                body: JSON.stringify({ query }),
            }),
    },
};
