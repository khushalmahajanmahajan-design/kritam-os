"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Star,
  TrendingUp,
  Zap,
  Check,
  ArrowRight,
  SlidersHorizontal,
  Users,
  Sparkles,
  Loader2,
  RefreshCw,
  Database,
  WifiOff,
  Mic,
  Video,
} from "lucide-react";
import {
  agents as demoAgents,
  CATEGORIES,
  type Agent,
  type Category,
} from "@/lib/mock-data";
import { agentIconMap } from "@/components/kritam/agent-icons";
import { CheckoutModal } from "@/components/checkout-modal";
import { useKritamStore, resolvePrice } from "@/lib/store";
import { rowToAgent } from "@/lib/row-mapper";
import type { AgentRow } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const FILTERS = ["All", ...CATEGORIES] as const;
type Filter = (typeof FILTERS)[number];

export function MarketplacePage() {
  const [filter, setFilter] = useState<Filter>("All");
  const [checkout, setCheckout] = useState<Agent | null>(null);
  const { deployedAgentIds, setPage, pricingOverrides, customAgents } = useKritamStore();

  // live DB catalog state
  const [dbAgents, setDbAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"supabase" | "demo" | null>(null);

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/agents", { cache: "no-store" });
      const json = await res.json();
      setSource(json.source as "supabase" | "demo");
      const rows: AgentRow[] = json.agents ?? [];
      setDbAgents(rows.map(rowToAgent));
    } catch {
      setSource("demo");
      setDbAgents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // useEffect data fetch — streams live agents on mount
  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  // live DB agents + admin-published local custom agents + demo fallback.
  // When live, DB agents fully replace the demo catalog; local customAgents
  // (just-published) always show on top for instant feedback.
  const liveAgents = source === "supabase" ? dbAgents : demoAgents;
  const allAgents = [...customAgents, ...liveAgents];
  const filtered = allAgents.filter(
    (a) => filter === "All" || a.category === (filter as Category)
  );
  const price = (a: Agent) =>
    resolvePrice({ hourly: a.hourly, monthly: a.monthly }, pricingOverrides[a.id]);

  return (
    <div className="relative pt-28 pb-20">
      <div className="pointer-events-none absolute inset-0 grid-bg grid-bg-fade opacity-60" />
      <div className="pointer-events-none absolute -top-20 right-1/3 h-72 w-72 rounded-full bg-[#7F00FF]/12 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00F2FE]">
              AI Workforce Marketplace
            </span>
            <DbPill source={source} loading={loading} />
          </div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Browse. Deploy. <span className="gradient-text">Scale autonomously.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Specialist AI employees, pre-trained and ready to join your swarm. Each
            profile ships with transparent success rates, billing and one-click deploy.
          </p>
        </motion.div>

        {/* stats strip */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: Users, label: "Active agents", value: String(filtered.length) },
            { icon: TrendingUp, label: "Avg success rate", value: "96.2%" },
            { icon: Zap, label: "Deploy time", value: "< 60s" },
            { icon: Check, label: "Deployed in your workspace", value: String(deployedAgentIds.length) },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border/60 bg-card/40 p-4 backdrop-blur-sm">
              <s.icon className="h-4 w-4 text-[#00F2FE]" />
              <div className="mt-2 text-xl font-bold">{s.value}</div>
              <div className="text-[11px] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* filters */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors border whitespace-nowrap",
                  filter === f
                    ? "border-[#00F2FE]/50 bg-[#00F2FE]/10 text-[#00F2FE]"
                    : "border-border/60 bg-card/40 text-muted-foreground hover:text-foreground"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {filtered.length} agent{filtered.length !== 1 ? "s" : ""} available
            </span>
            <button
              onClick={fetchAgents}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/40 px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-60"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
              {loading ? "Streaming…" : "Refresh"}
            </button>
          </div>
        </div>

        {/* loading state */}
        {loading && (
          <div className="mt-10 flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
            <Loader2 className="h-7 w-7 animate-spin text-[#00F2FE]" />
            <p className="text-sm">Streaming agents from catalog…</p>
          </div>
        )}

        {/* grid */}
        {!loading && (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((agent, i) => {
            const Icon = agentIconMap[agent.icon] ?? Zap;
            const deployed = deployedAgentIds.includes(agent.id);
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm transition-colors hover:border-border"
              >
                {/* glow */}
                <div
                  className={cn(
                    "pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity",
                    agent.accent === "cyan" ? "bg-[#00F2FE]/20" : "bg-[#7F00FF]/20"
                  )}
                />

                {/* header */}
                <div className="relative flex items-start justify-between p-5 pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl border",
                        agent.accent === "cyan"
                          ? "border-[#00F2FE]/30 bg-[#00F2FE]/10 text-[#00F2FE]"
                          : "border-[#7F00FF]/30 bg-[#7F00FF]/10 text-[#b14bff]"
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{agent.name}</h3>
                        {agent.custom && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#00F2FE]/20 to-[#7F00FF]/20 px-1.5 py-0.5 text-[9px] font-medium text-[#00F2FE]">
                            <Sparkles className="h-2.5 w-2.5" /> Custom
                          </span>
                        )}
                        {deployed && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-medium text-emerald-400">
                            <Check className="h-2.5 w-2.5" /> Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{agent.role}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-1">
                        {agent.audio && (
                          <span className="inline-flex items-center gap-0.5 rounded border border-[#00F2FE]/30 bg-[#00F2FE]/10 px-1 py-0.5 text-[8px] font-medium text-[#00F2FE]" title="Supports Real-Time Audio Calling">
                            <Mic className="h-2 w-2" /> Audio
                          </span>
                        )}
                        {agent.video && (
                          <span className="inline-flex items-center gap-0.5 rounded border border-[#7F00FF]/30 bg-[#7F00FF]/10 px-1 py-0.5 text-[8px] font-medium text-[#b14bff]" title="Supports Video Consultation">
                            <Video className="h-2 w-2" /> Video
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 rounded-full border border-border/60 bg-background/40 px-2 py-1 text-xs">
                    <Star className="h-3 w-3 fill-[#00F2FE] text-[#00F2FE]" />
                    <span className="font-medium">{agent.rating}</span>
                  </div>
                </div>

                {/* body */}
                <div className="relative flex-1 px-5 pb-3">
                  <p className="text-sm font-medium text-foreground/90">{agent.tagline}</p>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    {agent.description}
                  </p>

                  {/* skills */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {agent.skills.map((s) => (
                      <span
                        key={s}
                        className="rounded-md border border-border/60 bg-background/40 px-2 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* tasks handled */}
                  <div className="mt-4">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Tasks handled
                    </div>
                    <ul className="mt-1.5 grid grid-cols-2 gap-1">
                      {agent.tasksHandled.map((t) => (
                        <li key={t} className="flex items-center gap-1.5 text-xs">
                          <Check className={cn("h-3 w-3", agent.accent === "cyan" ? "text-[#00F2FE]" : "text-[#b14bff]")} />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* metrics */}
                <div className="relative grid grid-cols-3 gap-px border-y border-border/60 bg-border/40 text-center">
                  <div className="bg-card/60 px-2 py-2.5">
                    <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Success</div>
                    <div className="text-sm font-bold text-emerald-400">{agent.successRate}%</div>
                  </div>
                  <div className="bg-card/60 px-2 py-2.5">
                    <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Hourly</div>
                    <div className="text-sm font-bold">₹{Math.round(price(agent).hourly * 83).toLocaleString("en-IN")}</div>
                  </div>
                  <div className="bg-card/60 px-2 py-2.5">
                    <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Monthly</div>
                    <div className="text-sm font-bold">₹{(agent.priceINR ?? Math.round(price(agent).monthly * 83)).toLocaleString("en-IN")}</div>
                  </div>
                </div>

                {/* action */}
                <div className="relative p-4">
                  {deployed ? (
                    <button
                      onClick={() => setPage("dashboard")}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border/60 bg-background/40 px-4 py-2.5 text-sm font-semibold hover:bg-accent/50"
                    >
                      Manage in workspace
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setCheckout(agent)}
                      className="group/btn relative inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground overflow-hidden"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-[#00F2FE] to-[#7F00FF]" />
                      <span className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity bg-gradient-to-r from-[#7F00FF] to-[#00F2FE]" />
                      <Zap className="relative z-10 h-4 w-4" />
                      <span className="relative z-10">Hire Agent / Subscribe</span>
                    </button>
                  )}
                  <p className="mt-2 text-center text-[10px] text-muted-foreground">
                    {agent.deployments.toLocaleString()} deployments · {agent.department}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
        )}
      </div>

      <CheckoutModal agent={checkout} open={!!checkout} onClose={() => setCheckout(null)} />
    </div>
  );
}

/* ---------------- DB source pill ---------------- */
function DbPill({
  source,
  loading,
}: {
  source: "supabase" | "demo" | null;
  loading: boolean;
}) {
  if (loading) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" /> Connecting…
      </span>
    );
  }
  if (source === "supabase") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-300">
        <Database className="h-3 w-3" />
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
        Live DB
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-medium text-amber-300">
      <WifiOff className="h-3 w-3" /> Demo catalog
    </span>
  );
}
