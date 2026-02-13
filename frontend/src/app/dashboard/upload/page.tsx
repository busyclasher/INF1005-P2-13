"use client";

import { useState } from "react";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const pastUploads = [
  {
    id: "1",
    filename: "jan_2026_transactions.csv",
    status: "completed" as const,
    rows_parsed: 142,
    rows_failed: 3,
    date: "2026-01-28",
  },
];

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Upload CSV</h1>
        <p className="text-muted-foreground">
          Import your financial data via CSV files.
        </p>
      </div>

      {/* Upload zone */}
      <Card>
        <CardContent className="p-8">
          <div
            onDragEnter={() => setDragActive(true)}
            onDragLeave={() => setDragActive(false)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => setDragActive(false)}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
              dragActive
                ? "border-emerald-500 bg-emerald-500/5"
                : "border-border hover:border-emerald-500/50"
            }`}
          >
            <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-1">
              Drag & drop your CSV file here
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse. Supports .csv files up to 10 MB.
            </p>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Select File
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Past uploads */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {pastUploads.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-5 w-5 text-emerald-500" />
                <div>
                  <p className="text-sm font-medium">{u.filename}</p>
                  <p className="text-xs text-muted-foreground">
                    {u.date} · {u.rows_parsed} rows parsed
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {u.rows_failed > 0 && (
                  <Badge variant="destructive" className="text-[10px]">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {u.rows_failed} errors
                  </Badge>
                )}
                <Badge
                  variant="secondary"
                  className="text-[10px] bg-emerald-600/10 text-emerald-500"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {u.status}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
