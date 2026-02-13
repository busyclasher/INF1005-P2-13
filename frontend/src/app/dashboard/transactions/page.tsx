"use client";

import { ArrowDownLeft, ArrowUpRight, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const transactions = [
  { id: "1", date: "2026-02-12", desc: "Payment from Client A", amount: 8200, dir: "inflow", cat: "Sales Revenue", account: "DBS Business" },
  { id: "2", date: "2026-02-11", desc: "Office rent - Feb", amount: 3500, dir: "outflow", cat: "Rent", account: "DBS Business" },
  { id: "3", date: "2026-02-10", desc: "Google Ads campaign", amount: 1200, dir: "outflow", cat: "Marketing", account: "Credit Card" },
  { id: "4", date: "2026-02-09", desc: "Consulting fee", amount: 5500, dir: "inflow", cat: "Service Income", account: "DBS Business" },
  { id: "5", date: "2026-02-08", desc: "AWS monthly bill", amount: 420, dir: "outflow", cat: "Software", account: "Credit Card" },
  { id: "6", date: "2026-02-07", desc: "Online store sale", amount: 3150, dir: "inflow", cat: "Sales Revenue", account: "DBS Business" },
  { id: "7", date: "2026-02-06", desc: "Staff salary - Jan", amount: 12000, dir: "outflow", cat: "Salaries", account: "DBS Business" },
  { id: "8", date: "2026-02-05", desc: "Invoice #1042 paid", amount: 6800, dir: "inflow", cat: "Sales Revenue", account: "DBS Business" },
  { id: "9", date: "2026-02-04", desc: "Electricity bill", amount: 420, dir: "outflow", cat: "Utilities", account: "Petty Cash" },
  { id: "10", date: "2026-02-03", desc: "Workshop registration", amount: 1500, dir: "inflow", cat: "Service Income", account: "DBS Business" },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-SG", { style: "currency", currency: "SGD" }).format(amount);
}

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            View and manage all financial transactions.
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Inflow</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-emerald-500">$25,150.00</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Outflow</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-red-500">$17,540.00</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Net</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">$7,610.00</p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Account</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((txn) => (
                <TableRow key={txn.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="text-sm text-muted-foreground">
                    {txn.date}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {txn.dir === "inflow" ? (
                        <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <ArrowUpRight className="h-3.5 w-3.5 text-red-500" />
                      )}
                      {txn.desc}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px]">
                      {txn.cat}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {txn.account}
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      txn.dir === "inflow" ? "text-emerald-500" : "text-red-500"
                    }`}
                  >
                    {txn.dir === "inflow" ? "+" : "-"}
                    {formatCurrency(txn.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
