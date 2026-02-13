"use client";

import { useState } from "react";
import { BrainCircuit, Send, User, Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const sampleQuestions = [
  "What is my current burn rate?",
  "How has revenue changed over the last 3 months?",
  "What is my biggest expense category?",
  "Am I at risk of running out of cash?",
];

export default function AnalystPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI Financial Analyst. Ask me anything about your financial data — revenue trends, expense analysis, risk assessment, and more.",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { role: "user", content: input };
    const aiMsg: ChatMessage = {
      role: "assistant",
      content: `Based on your financial data, your net cash flow has been positive for the last 3 months averaging $14,377/month. Your largest expense category is Salaries at 40.1% of total expenses. Revenue is trending upward at +12.5% MoM. (This is a dummy response — in production, this would call the OpenAI-powered /ai/analyze endpoint.)`,
    };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Analyst</h1>
        <p className="text-muted-foreground">
          Ask questions about your financial data in natural language.
        </p>
      </div>

      {/* Suggested questions */}
      <div className="flex flex-wrap gap-2">
        {sampleQuestions.map((q) => (
          <Button
            key={q}
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => setInput(q)}
          >
            {q}
          </Button>
        ))}
      </div>

      {/* Chat area */}
      <Card className="flex flex-col h-[500px]">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="h-8 w-8 rounded-full bg-emerald-600/20 flex items-center justify-center flex-shrink-0">
                  <BrainCircuit className="h-4 w-4 text-emerald-500" />
                </div>
              )}
              <div
                className={`rounded-xl px-4 py-2.5 max-w-[80%] text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-emerald-600 text-white"
                    : "bg-muted"
                }`}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
        </CardContent>

        {/* Input */}
        <div className="border-t border-border p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your finances..."
              className="flex-1"
            />
            <Button
              type="submit"
              size="icon"
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
