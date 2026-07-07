"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  Cpu,
  Server,
  MemoryStick,
  Network,
  DollarSign,
  Building2,
  Bot,
  Activity,
  Ban,
  Power,
  Search,
  Save,
  RotateCcw,
  Check,
  TrendingUp,
  ArrowLeft,
  Lock,
  Coins,
  Sparkles,
} from "lucide-react";
import { agents, tenants as seedTenants, platformLoad, type Tenant } from "@/lib/mock-data";
import { useKritamStore, resolvePrice } from "@/lib/store";
import { MrrChart, LoadChart } from "@/components/kritam/telemetry-charts";
import { agentIconMap } from "@/components/kritam/agent-icons";
import { AgentDeployerForm } from "@/components/agent-deployer-form";
import { cn } from "@/lib/utils";

export function AdminPage() {
  const { setPage, lockAdmin, customAgents } = useKritamStore();

  return (
    <div className="relative pt-24 pb-20">
      <div className="pointer-events-none absolute inset-0 grid-bg grid-bg-fade opacity-40" />
      <div className="pointer-events-none absolute -top-20 right-1/4 h-72 w-72 rounded-full bg-red-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-wrap items-start justify-between gap-4"
        >
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-red-300">
                <ShieldAlert className="h-3 w-3" /> Master Admin
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Session verified
              </span>
              <span className="text-xs text-muted-foreground">Restricted · Kritam Space</span>
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Platform Control Center
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Live infrastructure health, system-wide revenue, tenant governance,
              dynamic pricing and agent deployment — all in one console.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage("home")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/40 px-3.5 py-2 text-xs font-semibold hover:bg-accent/50"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to platform
            </button>
            <button
              onClick={lockAdmin}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/40 bg-red-500/10 px-3.5 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20"
            >
              <Lock className="h-3.5 w-3.5" /> Lock & exit
            </button>
          </div>
        </motion.div>

        <div className="grid gap-6">
          <IncomeTracker customCount={customAgents.length} />
          <AgentDeployerForm />
          <HealthTracker />
          <SystemAnalytics />
          <TenantManagement />
          <PricingEditor />
        </div>
      </div>
    </div>
  );
}

/* ---------------- Income Tracker ---------------- */
function IncomeTracker({ customCount }: { customCount: number }) {
  const kpis = [
    { label: "Platform MRR", value: "$358,000", sub: "+14.1% MoM", icon: DollarSign, color: "#00F2FE" },
    { label: "Active Corporate Tenants", value: "1,284", sub: "+38 this month", icon: Building2, color: "#7F00FF" },
    { label: "Token / Credit Balance", value: "842.5M", sub: "across all tenants", icon: Coins, color: "#00F2FE" },
    { label: "Custom Agents Published", value: String(customCount), sub: "via deployer", icon: Sparkles, color: "#7F00FF" },
  ];
  return (
    <section className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-[#00F2FE]" />
        <h2 className="text-base font-semibold">Global Subscription & Income Tracker</h2>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> live
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-border/60 bg-background/40 p-4">
            <div className="flex items-center justify-between">
              <k.icon className="h-4 w-4" style={{ color: k.color }} />
              <TrendingUp className="h-3 w-3 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-bold">{k.value}</div>
            <div className="text-[11px] text-muted-foreground">{k.label}</div>
            <div className="mt-1 text-[10px] text-muted-foreground/70">{k.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Health Tracker ---------------- */
function HealthTracker() {
  const [load, setLoad] = useState(platformLoad);
  const [live, setLive] = useState({ cpu: 61, mem: 68, net: 48 });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // live-wiggle the "now" tick so the gauges feel alive
    intervalRef.current = setInterval(() => {
      setLive((prev) => {
        const jitter = (base: number, amp: number) =>
          Math.max(8, Math.min(96, base + (Math.random() - 0.5) * amp));
        const next = {
          cpu: Math.round(jitter(prev.cpu, 14)),
          mem: Math.round(jitter(prev.mem, 8)),
          net: Math.round(jitter(prev.net, 18)),
        };
        setLoad((arr) => {
          const withoutNow = arr.slice(0, -1);
          return [...withoutNow, { t: "now", ...next }];
        });
        return next;
      });
    }, 2200);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const gauges = [
    { label: "CPU load", value: live.cpu, icon: Cpu, color: "#00F2FE" },
    { label: "Server load", value: live.mem, icon: Server, color: "#7F00FF" },
    { label: "Memory", value: live.mem, icon: MemoryStick, color: "#b14bff" },
    { label: "Network I/O", value: live.net, icon: Network, color: "#00F2FE" },
  ];

  return (
    <section className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-2">
        <Activity className="h-4 w-4 text-[#00F2FE]" />
        <h2 className="text-base font-semibold">Global Platform Health</h2>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> All systems nominal
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {gauges.map((g) => (
          <div key={g.label} className="rounded-xl border border-border/60 bg-background/40 p-4">
            <div className="flex items-center justify-between">
              <g.icon className="h-4 w-4" style={{ color: g.color }} />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">live</span>
            </div>
            <div className="mt-2 flex items-end gap-1">
              <motion.span
                key={g.value}
                initial={{ opacity: 0.5, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold"
              >
                {g.value}
              </motion.span>
              <span className="mb-1 text-xs text-muted-foreground">%</span>
            </div>
            <div className="text-[11px] text-muted-foreground">{g.label}</div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border/60">
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${g.color}, ${g.color}80)` }}
                animate={{ width: `${g.value}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-border/60 bg-background/40 p-4">
        <div className="mb-2 flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#00F2FE]" /> CPU</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#b14bff]" /> Memory</span>
          <span className="ml-auto text-muted-foreground">24h trend</span>
        </div>
        <LoadChart data={load} />
      </div>
    </section>
  );
}

/* ---------------- System Analytics ---------------- */
function SystemAnalytics() {
  const kpis = [
    { label: "Total MRR", value: "$358,000", sub: "+14.1% MoM", icon: DollarSign, color: "#00F2FE" },
    { label: "Active tenants", value: "1,284", sub: "+38 this month", icon: Building2, color: "#7F00FF" },
    { label: "Hired AI agents", value: "12,840", sub: "across all tenants", icon: Bot, color: "#00F2FE" },
    { label: "Platform uptime", value: "99.98%", sub: "last 90 days", icon: TrendingUp, color: "#7F00FF" },
  ];
  return (
    <section className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-[#b14bff]" />
        <h2 className="text-base font-semibold">System-wide Analytics</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-border/60 bg-background/40 p-4">
            <div className="flex items-center justify-between">
              <k.icon className="h-4 w-4" style={{ color: k.color }} />
              <TrendingUp className="h-3 w-3 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-bold">{k.value}</div>
            <div className="text-[11px] text-muted-foreground">{k.label}</div>
            <div className="mt-1 text-[10px] text-muted-foreground/70">{k.sub}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-border/60 bg-background/40 p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Monthly recurring revenue</h3>
          <span className="text-xs text-muted-foreground">7-month</span>
        </div>
        <MrrChart />
      </div>
    </section>
  );
}

/* ---------------- Tenant Management ---------------- */
function TenantManagement() {
  const [rows, setRows] = useState<Tenant[]>(seedTenants);
  const [query, setQuery] = useState("");

  const filtered = rows.filter((r) =>
    `${r.company} ${r.contact} ${r.plan}`.toLowerCase().includes(query.toLowerCase())
  );

  const toggle = (id: string) =>
    setRows((rs) =>
      rs.map((r) =>
        r.id === id
          ? { ...r, status: r.status === "suspended" ? "active" : "suspended" }
          : r
      )
    );

  const planColor: Record<string, string> = {
    Enterprise: "bg-[#7F00FF]/15 text-[#b14bff] border-[#7F00FF]/30",
    Scale: "bg-[#00F2FE]/15 text-[#00F2FE] border-[#00F2FE]/30",
    Growth: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    Starter: "bg-muted/40 text-muted-foreground border-border/60",
  };
  const statusDot: Record<string, string> = {
    active: "bg-emerald-400",
    suspended: "bg-red-400",
    trial: "bg-amber-400",
  };

  return (
    <section className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-[#00F2FE]" />
          <h2 className="text-base font-semibold">User Management</h2>
          <span className="rounded-full bg-muted/40 px-2 py-0.5 text-[10px] text-muted-foreground">
            {filtered.length} tenants
          </span>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tenants…"
            className="h-8 w-44 rounded-lg border border-border/60 bg-background/40 pl-8 pr-3 text-xs outline-none focus:border-[#00F2FE]/60"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b border-border/60 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="py-2 pr-4 font-medium">Company</th>
              <th className="py-2 pr-4 font-medium">Plan</th>
              <th className="py-2 pr-4 font-medium">Agents</th>
              <th className="py-2 pr-4 font-medium">MRR</th>
              <th className="py-2 pr-4 font-medium">Region</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-2 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {filtered.map((t) => (
              <tr key={t.id} className="group">
                <td className="py-3 pr-4">
                  <div className="text-sm font-medium">{t.company}</div>
                  <div className="text-[11px] text-muted-foreground">{t.contact}</div>
                </td>
                <td className="py-3 pr-4">
                  <span className={cn("rounded-md border px-2 py-0.5 text-[11px] font-medium", planColor[t.plan])}>
                    {t.plan}
                  </span>
                </td>
                <td className="py-3 pr-4 text-muted-foreground">{t.agents}</td>
                <td className="py-3 pr-4 font-medium">${t.mrr.toLocaleString()}</td>
                <td className="py-3 pr-4 text-muted-foreground">{t.region}</td>
                <td className="py-3 pr-4">
                  <span className="inline-flex items-center gap-1.5 text-xs">
                    <span className={cn("h-1.5 w-1.5 rounded-full", statusDot[t.status])} />
                    <span className="capitalize text-muted-foreground">{t.status}</span>
                  </span>
                </td>
                <td className="py-3 pr-2 text-right">
                  <button
                    onClick={() => toggle(t.id)}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium transition-colors",
                      t.status === "suspended"
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                        : "border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    )}
                  >
                    {t.status === "suspended" ? (
                      <><Power className="h-3 w-3" /> Activate</>
                    ) : (
                      <><Ban className="h-3 w-3" /> Suspend</>
                    )}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                  No tenants match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ---------------- Pricing Editor ---------------- */
function PricingEditor() {
  const { pricingOverrides, setPricing, resetPricing } = useKritamStore();
  // local draft state so edits are buffered until "Save"
  const [draft, setDraft] = useState<Record<string, { hourly: number; monthly: number }>>(() => {
    const d: Record<string, { hourly: number; monthly: number }> = {};
    agents.forEach((a) => {
      const p = resolvePrice({ hourly: a.hourly, monthly: a.monthly }, pricingOverrides[a.id]);
      d[a.id] = { hourly: p.hourly, monthly: p.monthly };
    });
    return d;
  });
  const [saved, setSaved] = useState<string | null>(null);

  const update = (id: string, field: "hourly" | "monthly", value: number) =>
    setDraft((d) => ({ ...d, [id]: { ...d[id], [field]: value } }));

  const saveAll = () => {
    agents.forEach((a) => {
      const base = { hourly: a.hourly, monthly: a.monthly };
      const d = draft[a.id];
      if (d.hourly !== base.hourly || d.monthly !== base.monthly) {
        setPricing(a.id, d.hourly, d.monthly);
      } else {
        resetPricing(a.id);
      }
    });
    setSaved("all");
    setTimeout(() => setSaved(null), 1800);
  };

  const resetAll = () => {
    const d: Record<string, { hourly: number; monthly: number }> = {};
    agents.forEach((a) => {
      d[a.id] = { hourly: a.hourly, monthly: a.monthly };
      resetPricing(a.id);
    });
    setDraft(d);
    setSaved("reset");
    setTimeout(() => setSaved(null), 1800);
  };

  return (
    <section className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-[#b14bff]" />
          <h2 className="text-base font-semibold">Dynamic Agent Pricing Editor</h2>
          <span className="rounded-full bg-muted/40 px-2 py-0.5 text-[10px] text-muted-foreground">
            Top {agents.length} AI employees
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetAll}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-xs font-semibold hover:bg-accent/50"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
          <button
            onClick={saveAll}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#00F2FE] to-[#7F00FF] px-3.5 py-2 text-xs font-semibold text-primary-foreground"
          >
            {saved === "all" ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
            {saved === "all" ? "Saved" : "Save pricing"}
          </button>
        </div>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {agents.map((a) => {
          const Icon = agentIconMap[a.icon] ?? Bot;
          const d = draft[a.id];
          const base = { hourly: a.hourly, monthly: a.monthly };
          const changed = d.hourly !== base.hourly || d.monthly !== base.monthly;
          return (
            <div
              key={a.id}
              className={cn(
                "rounded-xl border bg-background/40 p-3 transition-colors",
                changed ? "border-[#00F2FE]/40" : "border-border/60"
              )}
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg border",
                    a.accent === "cyan"
                      ? "border-[#00F2FE]/30 bg-[#00F2FE]/10 text-[#00F2FE]"
                      : "border-[#7F00FF]/30 bg-[#7F00FF]/10 text-[#b14bff]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{a.name}</div>
                  <div className="truncate text-[10px] text-muted-foreground">{a.role}</div>
                </div>
                {changed && (
                  <span className="ml-auto rounded-full bg-[#00F2FE]/10 px-1.5 py-0.5 text-[9px] font-medium text-[#00F2FE]">
                    edited
                  </span>
                )}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="text-[10px] text-muted-foreground">Hourly $</span>
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    value={d.hourly}
                    onChange={(e) => update(a.id, "hourly", parseFloat(e.target.value) || 0)}
                    className="mt-0.5 h-9 w-full rounded-lg border border-border/60 bg-background/50 px-2.5 text-sm outline-none focus:border-[#00F2FE]/60"
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] text-muted-foreground">Monthly $</span>
                  <input
                    type="number"
                    min={0}
                    step={10}
                    value={d.monthly}
                    onChange={(e) => update(a.id, "monthly", parseFloat(e.target.value) || 0)}
                    className="mt-0.5 h-9 w-full rounded-lg border border-border/60 bg-background/50 px-2.5 text-sm outline-none focus:border-[#00F2FE]/60"
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>
      {saved && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300"
        >
          <Check className="h-3.5 w-3.5" />
          {saved === "all" ? "Pricing published to marketplace." : "Pricing reset to defaults."}
        </motion.div>
      )}
    </section>
  );
}
