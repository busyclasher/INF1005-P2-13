"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RefreshCw, Shield, AlertTriangle, Info } from "lucide-react";

const riskData = {
  overall: 72.5,
  level: "medium" as const,
  summary:
    "Your financial health is moderate. Key concern is revenue concentration — diversifying your client base would reduce risk. Liquidity and cash runway are healthy.",
  factors: [
    { factor: "Cash Runway", score: 80, desc: "Projected runway of 8+ months at current burn rate." },
    { factor: "Liquidity Ratio", score: 78, desc: "Sufficient liquid assets to cover 2.5 months of expenses." },
    { factor: "Burn Rate", score: 65, desc: "Monthly burn rate is moderate relative to revenue." },
    { factor: "Expense Volatility", score: 82, desc: "Expenses are relatively stable month-over-month." },
    { factor: "Revenue Concentration", score: 55, desc: "Top 3 clients account for 60% of revenue." },
  ],
};

const levelColor: Record<string, string> = {
  low: "text-emerald-500",
  medium: "text-yellow-500",
  high: "text-orange-500",
  critical: "text-red-500",
};

function scoreColor(s: number) {
  if (s >= 75) return "bg-emerald-500";
  if (s >= 50) return "bg-yellow-500";
  return "bg-red-500";
}

export default function RiskPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Risk Score</h1>
          <p className="text-muted-foreground">
            Automated financial health assessment.
          </p>
        </div>
        <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
          <RefreshCw className="h-4 w-4" />
          Recalculate
        </Button>
      </div>

      {/* Overall score */}
      <Card className="relative overflow-hidden">
        <CardContent className="pt-6 flex flex-col items-center text-center">
          <div className="relative h-36 w-36 mb-4">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              <circle
                cx="60"
                cy="60"
                r="52"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="60"
                cy="60"
                r="52"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(riskData.overall / 100) * 327} 327`}
                className={levelColor[riskData.level]}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{riskData.overall}</span>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
          </div>
          <Badge
            className={`text-sm px-3 py-1 ${
              riskData.level === "medium"
                ? "bg-yellow-500/10 text-yellow-500"
                : "bg-emerald-500/10 text-emerald-500"
            }`}
          >
            <Shield className="h-3.5 w-3.5 mr-1" />
            {riskData.level.toUpperCase()} RISK
          </Badge>
          <p className="mt-4 text-sm text-muted-foreground max-w-md">
            {riskData.summary}
          </p>
        </CardContent>
      </Card>

      {/* Factor breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Risk Factor Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {riskData.factors
            .sort((a, b) => a.score - b.score)
            .map((f) => (
              <div key={f.factor} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{f.factor}</span>
                  <span className="text-sm font-bold">{f.score}</span>
                </div>
                <Progress
                  value={f.score}
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
