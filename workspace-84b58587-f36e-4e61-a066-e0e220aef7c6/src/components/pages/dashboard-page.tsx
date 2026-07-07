"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Network,
  Database,
  BarChart3,
  ShieldAlert,
  Play,
  Pause,
  Settings2,
  Cpu,
  Zap,
  Clock,
  DollarSign,
  TrendingUp,
  ChevronRight,
  Activity,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { agents } from "@/lib/mock-data";
import { agentIconMap } from "@/components/kritam/agent-icons";
import { KnowledgeCenter } from "@/components/kritam/knowledge-center";
import { UsageChart, DepartmentChart, TokenPie } from "@/components/kritam/telemetry-charts";
import { useKritamStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { tokenSplit } from "@/lib/mock-data";

const SECTIONS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "orchestra", label: "Agent Orchestra", icon: Network },
  { id: "knowledge", label: "Knowledge Base", icon: Database },
  { id: "analytics", label: "Live Analytics", icon: BarChart3 },
  { id: "security", label: "Enterprise Security", icon: ShieldAlert },
] as const;

export function DashboardPage() {
  const { dashboardSection, setDashboardSection, deployedAgentIds, setPage } = useKritamStore();
  const deployed = agents.filter((a) => deployedAgentIds.includes(a.id));

  return (
    <div className="relative pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* sidebar */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-2xl border border-border/60 bg-card/40 p-3 backdrop-blur-sm">
              <div className="px-2 py-2">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  KRITAM Central
                </div>
                <div className="text-sm font-semibold">Command Panel</div>
              </div>
              <nav className="mt-2 space-y-1">
                {SECTIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setDashboardSection(s.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      dashboardSection === s.id
                        ? "bg-gradient-to-r from-[#00F2FE]/15 to-[#7F00FF]/15 text-foreground border border-border/60"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    )}
                  >
                    <s.icon className={cn("h-4 w-4", dashboardSection === s.id && "text-[#00F2FE]")} />
                    <span className="flex-1 text-left">{s.label}</span>
                    {dashboardSection === s.id && <ChevronRight className="h-3.5 w-3.5" />}
                  </button>
                ))}
              </nav>

              <div className="mt-3 rounded-xl border border-border/60 bg-background/40 p-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  <span className="text-xs font-medium text-emerald-300">Swarm online</span>
                </div>
                <div className="mt-2 text-[11px] text-muted-foreground">
                  {deployed.length} agents active · 0 incidents
                </div>
              </div>
            </div>
          </aside>

          {/* content */}
          <div className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={dashboardSection}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {dashboardSection === "overview" && <OverviewSection deployed={deployed} />}
                {dashboardSection === "orchestra" && <OrchestraSection deployed={deployed} />}
                {dashboardSection === "knowledge" && <KnowledgeCenter />}
                {dashboardSection === "analytics" && <AnalyticsSection />}
                {dashboardSection === "security" && <SecuritySection goEnterprise={() => setPage("enterprise")} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Overview ---------------- */
function OverviewSection({ deployed }: { deployed: typeof agents }) {
  const kpis = [
    { label: "Credits used", value: "36,400", sub: "/ 50,000", icon: Zap, color: "#00F2FE" },
    { label: "Tokens remaining", value: "2.1M", sub: "+12% vs last week", icon: Cpu, color: "#7F00FF" },
    { label: "Hours logged", value: "1,127", sub: "this month", icon: Clock, color: "#00F2FE" },
    { label: "Spend", value: "$4,820", sub: "budget $8,000", icon: DollarSign, color: "#7F00FF" },
  ];
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold">Overview</h2>
        <p className="text-sm text-muted-foreground">Real-time snapshot of your AI workforce.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl border border-border/60 bg-card/40 p-4">
            <div className="flex items-center justify-between">
              <k.icon className="h-4 w-4" style={{ color: k.color }} />
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-bold">{k.value}</div>
            <div className="text-[11px] text-muted-foreground">{k.label}</div>
            <div className="mt-1 text-[10px] text-muted-foreground/70">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card/40 p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Usage & tokens</h3>
            <span className="text-xs text-muted-foreground">7-day</span>
          </div>
          <UsageChart />
        </div>
        <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
          <h3 className="mb-3 text-sm font-semibold">Token allocation</h3>
          <TokenPie />
          <div className="mt-2 space-y-1.5">
            {tokenSplit.map((t) => (
              <div key={t.name} className="flex items-center gap-2 text-xs">
                <span className="h-2 w-2 rounded-full" style={{ background: t.color }} />
                <span className="flex-1 text-muted-foreground">{t.name}</span>
                <span className="font-medium">{t.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* active agents */}
      <div className="rounded-2xl border border-border/60 bg-card/40">
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-3">
          <h3 className="text-sm font-semibold">Active agents</h3>
          <span className="text-xs text-muted-foreground">{deployed.length} deployed</span>
        </div>
        <div className="divide-y divide-border/60">
          {deployed.map((a) => {
            const Icon = agentIconMap[a.icon] ?? Zap;
            return (
              <div key={a.id} className="flex items-center gap-3 px-5 py-3">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg border",
                    a.accent === "cyan"
                      ? "border-[#00F2FE]/30 bg-[#00F2FE]/10 text-[#00F2FE]"
                      : "border-[#7F00FF]/30 bg-[#7F00FF]/10 text-[#b14bff]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{a.name} · {a.role}</div>
                  <div className="text-[11px] text-muted-foreground">{a.successRate}% success · {a.tasksHandled.length} task types</div>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-xs text-emerald-400">Running</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Orchestra ---------------- */
function OrchestraSection({ deployed }: { deployed: typeof agents }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold">Agent Orchestra</h2>
        <p className="text-sm text-muted-foreground">Control execution, scope and permissions per agent.</p>
      </div>
      <div className="grid gap-4">
        {deployed.map((a) => (
          <AgentControlCard key={a.id} agent={a} />
        ))}
        {deployed.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border/60 bg-card/30 p-10 text-center text-sm text-muted-foreground">
            No agents deployed yet. Visit the marketplace to hire your first AI employee.
          </div>
        )}
      </div>
    </div>
  );
}

function AgentControlCard({ agent }: { agent: (typeof agents)[number] }) {
  const [running, setRunning] = useState(true);
  const [autonomy, setAutonomy] = useState(60);
  const [budget, setBudget] = useState(40);
  const [tools, setTools] = useState(true);
  const [humanReview, setHumanReview] = useState(false);
  const Icon = agentIconMap[agent.icon] ?? Zap;

  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl border",
              agent.accent === "cyan"
                ? "border-[#00F2FE]/30 bg-[#00F2FE]/10 text-[#00F2FE]"
                : "border-[#7F00FF]/30 bg-[#7F00FF]/10 text-[#b14bff]"
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{agent.name}</h3>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                  running
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-muted/40 text-muted-foreground"
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {running ? "Running" : "Paused"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{agent.role} · {agent.department}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRunning((r) => !r)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold",
              running
                ? "border border-border/60 bg-background/40 hover:bg-accent/50"
                : "bg-gradient-to-r from-[#00F2FE] to-[#7F00FF] text-primary-foreground"
            )}
          >
            {running ? <><Pause className="h-3.5 w-3.5" /> Pause</> : <><Play className="h-3.5 w-3.5" /> Resume</>}
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/40 px-3 py-1.5 text-xs font-semibold hover:bg-accent/50">
            <Settings2 className="h-3.5 w-3.5" /> Configure
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        <div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Autonomy level</span>
            <span className="font-mono text-[#00F2FE]">{autonomy}%</span>
          </div>
          <Slider value={[autonomy]} onValueChange={(v) => setAutonomy(v[0])} max={100} step={5} className="mt-2" />
          <p className="mt-1.5 text-[10px] text-muted-foreground">
            Higher = more independent decisions before escalation.
          </p>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Monthly budget cap</span>
            <span className="font-mono text-[#b14bff]">${(budget * 50).toLocaleString()}</span>
          </div>
          <Slider value={[budget]} onValueChange={(v) => setBudget(v[0])} max={100} step={5} className="mt-2" />
          <p className="mt-1.5 text-[10px] text-muted-foreground">
            Agent auto-pauses when spend reaches the cap.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <ToggleRow
          label="Tool access"
          desc="Allow API & integration calls"
          checked={tools}
          onChange={setTools}
        />
        <ToggleRow
          label="Require human review"
          desc="Route high-impact actions for approval"
          checked={humanReview}
          onChange={setHumanReview}
        />
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 px-3 py-2.5">
      <div>
        <div className="text-xs font-medium">{label}</div>
        <div className="text-[10px] text-muted-foreground">{desc}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

/* ---------------- Analytics ---------------- */
function AnalyticsSection() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold">Live Analytics</h2>
        <p className="text-sm text-muted-foreground">Telemetry across your entire AI workforce.</p>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Multi-tenant usage credits</h3>
            <span className="text-xs text-[#00F2FE]">live</span>
          </div>
          <UsageChart />
        </div>
        <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
          <h3 className="mb-3 text-sm font-semibold">Department load (tasks executed)</h3>
          <DepartmentChart />
        </div>
        <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
          <h3 className="mb-3 text-sm font-semibold">Token consumption split</h3>
          <TokenPie />
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {tokenSplit.map((t) => (
              <div key={t.name} className="flex items-center gap-2 text-xs">
                <span className="h-2 w-2 rounded-full" style={{ background: t.color }} />
                <span className="text-muted-foreground">{t.name}</span>
                <span className="ml-auto font-medium">{t.value}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
          <h3 className="mb-3 text-sm font-semibold">Task lists executed (24h)</h3>
          <div className="space-y-2">
            {[
              { agent: "Aria", task: "Resolve ticket #55321", status: "done" },
              { agent: "Forge", task: "Merge PR #2841", status: "done" },
              { agent: "Orion", task: "Book meeting · Globex", status: "done" },
              { agent: "Nova", task: "Publish SEO brief", status: "done" },
              { agent: "Ledger", task: "Reconcile Q3 books", status: "running" },
              { agent: "Vega", task: "Draft daily brief", status: "running" },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/40 px-3 py-2">
                <span className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  t.status === "done" ? "bg-emerald-400" : "bg-[#00F2FE] animate-pulse"
                )} />
                <span className="text-xs font-medium">{t.agent}</span>
                <span className="flex-1 truncate text-xs text-muted-foreground">{t.task}</span>
                <span className="text-[10px] uppercase text-muted-foreground">{t.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Security ---------------- */
function SecuritySection({ goEnterprise }: { goEnterprise: () => void }) {
  const items = [
    { icon: Lock, title: "Data isolation", desc: "Per-tenant vector store encryption", status: "Enforced" },
    { icon: ShieldAlert, title: "Audit logging", desc: "Immutable activity trail for every agent", status: "Active" },
    { icon: AlertTriangle, title: "Anomaly detection", desc: "ML-based behaviour monitoring", status: "Monitoring" },
    { icon: Cpu, title: "Token scoping", desc: "Least-privilege API access per agent", status: "Enforced" },
  ];
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Enterprise Security</h2>
          <p className="text-sm text-muted-foreground">Posture & controls protecting your workforce.</p>
        </div>
        <button
          onClick={goEnterprise}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#00F2FE] to-[#7F00FF] px-3.5 py-2 text-xs font-semibold text-primary-foreground"
        >
          Open enterprise controls <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((it) => (
          <div key={it.title} className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card/40 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#00F2FE]/30 bg-[#00F2FE]/10 text-[#00F2FE]">
              <it.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">{it.title}</h3>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                  {it.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{it.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
