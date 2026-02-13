"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const forecastData = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i + 1);
  const inflow = 3000 + Math.random() * 6000;
  const outflow = 2000 + Math.random() * 5000;
  const net = inflow - outflow;
  return {
    date: d.toISOString().split("T")[0],
    net: Math.round(net),
    upper: Math.round(net + 500 + Math.random() * 1500),
    lower: Math.round(net - 500 - Math.random() * 1500),
  };
});

export default function ForecastPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Cash Flow Forecast
          </h1>
          <p className="text-muted-foreground">
            AI-predicted cash flow for the next 30 days.
          </p>
        </div>
        <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
          <RefreshCw className="h-4 w-4" />
          Regenerate
        </Button>
      </div>

      {/* Model info */}
      <div className="flex items-center gap-3">
        <Badge variant="secondary">Model: v0.1.0</Badge>
        <Badge variant="outline" className="text-muted-foreground">
          Generated: just now (dummy)
        </Badge>
      </div>

      {/* Forecast chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Predicted Net Cash Flow (with confidence interval)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="date"
                className="text-xs"
                tick={{ fill: "var(--color-muted-foreground)" }}
                tickFormatter={(v: string) => v.slice(5)}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: "var(--color-muted-foreground)" }}
              />
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
                dataKey="upper"
                stroke="transparent"
                fill="url(#confGrad)"
              />
              <Area
                type="monotone"
                dataKey="lower"
                stroke="transparent"
                fill="transparent"
              />
              <Area
                type="monotone"
                dataKey="net"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#netGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
