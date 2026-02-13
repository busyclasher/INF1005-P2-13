"use client";

import { Landmark, Plus, CreditCard, Banknote, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const accounts = [
  {
    id: "1",
    name: "DBS Business Account",
    type: "bank",
    currency: "SGD",
    balance: 45230.5,
    icon: Landmark,
  },
  {
    id: "2",
    name: "Corporate Credit Card",
    type: "credit_card",
    currency: "SGD",
    balance: -2150.0,
    icon: CreditCard,
  },
  {
    id: "3",
    name: "Petty Cash",
    type: "cash",
    currency: "SGD",
    balance: 500.0,
    icon: Wallet,
  },
];

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency,
  }).format(amount);
}

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground">
            Manage your financial accounts.
          </p>
        </div>
        <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4" />
          Add Account
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((acc) => (
          <Card
            key={acc.id}
            className="hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-emerald-600/10 transition-colors">
                  <acc.icon className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium">
                    {acc.name}
                  </CardTitle>
                  <Badge variant="secondary" className="text-[10px] mt-1">
                    {acc.type.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p
                className={`text-2xl font-bold ${
                  acc.balance < 0 ? "text-red-500" : "text-foreground"
                }`}
              >
                {formatCurrency(acc.balance, acc.currency)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {acc.currency}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
