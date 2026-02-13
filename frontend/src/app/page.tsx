import Link from "next/link";
import {
  TrendingUp,
  BarChart3,
  Shield,
  Upload,
  BrainCircuit,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Real-Time Dashboard",
    desc: "Visualize revenue, expenses, and cash flow with interactive charts.",
  },
  {
    icon: Upload,
    title: "CSV Import Pipeline",
    desc: "Upload bank statements and auto-parse transactions with smart column mapping.",
  },
  {
    icon: Shield,
    title: "Risk Scoring",
    desc: "AI-powered financial health assessment with factor-level breakdown.",
  },
  {
    icon: TrendingUp,
    title: "Cash Flow Forecast",
    desc: "30-day predictions with confidence intervals powered by ML models.",
  },
  {
    icon: BrainCircuit,
    title: "AI Analyst",
    desc: "Ask questions about your finances in plain English and get instant insights.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              CashFlow Sentinel
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Get Started
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center">
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-500 text-xs font-medium px-3 py-1 rounded-full mb-6">
            <Shield className="h-3 w-3" />
            AI-Powered Financial Intelligence
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
            Master Your{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
              Cash Flow
            </span>
            <br />
            Before It Masters You
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            CashFlow Sentinel gives SMEs a clear picture of their financial
            health with real-time dashboards, AI-powered forecasting, and
            automated risk scoring — so you can make confident decisions.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-lg transition-colors text-sm"
            >
              Open Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center gap-2 border border-border hover:bg-muted text-foreground font-medium px-6 py-3 rounded-lg transition-colors text-sm"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-2xl font-bold text-center mb-12">
            Everything you need to stay financially healthy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-emerald-500/30 transition-all"
              >
                <div className="h-10 w-10 rounded-lg bg-emerald-600/10 flex items-center justify-center mb-4 group-hover:bg-emerald-600/20 transition-colors">
                  <f.icon className="h-5 w-5 text-emerald-500" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            © 2026 CashFlow Sentinel. INF1005 Project.
          </p>
          <p className="text-xs text-muted-foreground">v0.1.0</p>
        </div>
      </footer>
    </div>
  );
}
