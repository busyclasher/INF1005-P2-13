"use client";

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// ---- Dummy data (inline for now — will be fetched from API) ----
const kpis = [
  {
    title: "Total Revenue",
    value: "$128,450",
    change: "+12.5%",
    positive: true,
    icon: DollarSign,
  },
  {
    title: "Total Expenses",
    value: "$87,320",
    change: "-3.2%",
    positive: true,
    icon: TrendingDown,
  },
  {
    title: "Net Cash Flow",
    value: "$41,130",
    change: "+18.7%",
    positive: true,
    icon: TrendingUp,
  },
  {
    title: "Burn Rate",
    value: "$29,107/mo",
    change: "-5.1%",
    positive: true,
    icon: Flame,
  },
];

const revenueData = [
  { month: "Mar", revenue: 9200 },
  { month: "Apr", revenue: 11500 },
  { month: "May", revenue: 10800 },
  { month: "Jun", revenue: 13200 },
  { month: "Jul", revenue: 12100 },
  { month: "Aug", revenue: 14500 },
  { month: "Sep", revenue: 13800 },
  { month: "Oct", revenue: 15200 },
  { month: "Nov", revenue: 14100 },
  { month: "Dec", revenue: 16800 },
  { month: "Jan", revenue: 15500 },
  { month: "Feb", revenue: 17200 },
];

const cashFlowData = Array.from({ length: 14 }, (_, i) => {
  const day = i + 1;
  const inflow = 3000 + Math.random() * 5000;
  const outflow = 2000 + Math.random() * 4000;
  return {
    day: `Feb ${day}`,
    inflow: Math.round(inflow),
    outflow: Math.round(outflow),
  };
});

const expenseData = [
  { name: "Salaries", value: 35000, color: "#10b981" },
  { name: "Rent", value: 14000, color: "#06b6d4" },
  { name: "Marketing", value: 12500, color: "#8b5cf6" },
  { name: "Software", value: 8200, color: "#f59e0b" },
  { name: "Utilities", value: 5800, color: "#ef4444" },
  { name: "Other", value: 11820, color: "#6b7280" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, Jane. Here&apos;s your financial overview.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {kpi.positive ? (
                  <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                )}
                <span
                  className={`text-xs font-medium ${
                    kpi.positive ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {kpi.change}
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
            {/* Gradient accent */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500" />
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Trend — spans 2 cols */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" tick={{ fill: "var(--color-muted-foreground)" }} />
                <YAxis className="text-xs" tick={{ fill: "var(--color-muted-foreground)" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    color: "var(--color-popover-foreground)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#revGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense Breakdown — pie chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {expenseData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    color: "var(--color-popover-foreground)",
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Cash Flow chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cash Flow — Inflow vs Outflow</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={cashFlowData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="day" className="text-xs" tick={{ fill: "var(--color-muted-foreground)" }} />
              <YAxis className="text-xs" tick={{ fill: "var(--color-muted-foreground)" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  color: "var(--color-popover-foreground)",
                }}
              />
              <Bar dataKey="inflow" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="outflow" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
