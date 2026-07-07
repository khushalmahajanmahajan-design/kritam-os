"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  KeyRound,
  Copy,
  Check,
  Plus,
  ShieldCheck,
  ScrollText,
  Users2,
  Trash2,
  Search,
  Filter,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
} from "lucide-react";
import { apiTokens, auditLogs, teamRoles } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function EnterprisePage() {
  return (
    <div className="relative pt-28 pb-20">
      <div className="pointer-events-none absolute inset-0 grid-bg grid-bg-fade opacity-50" />
      <div className="pointer-events-none absolute -top-20 left-1/3 h-72 w-72 rounded-full bg-[#00F2FE]/12 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00F2FE]">
            Enterprise Controls & Compliance
          </span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Govern every agent. Audit every action.
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Generate scoped API tokens, trace agent activity in immutable audit logs,
            and manage role-based access across your organisation.
          </p>
        </motion.div>

        {/* status banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8 flex flex-wrap items-center gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4"
        >
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-emerald-300">Compliance posture: Healthy</p>
            <p className="text-xs text-muted-foreground">SOC 2 Type II · ISO 27001 · GDPR · HIPAA-ready</p>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <div className="text-lg font-bold text-emerald-400">100%</div>
              <div className="text-[10px] text-muted-foreground">Audit coverage</div>
            </div>
            <div>
              <div className="text-lg font-bold text-emerald-400">0</div>
              <div className="text-[10px] text-muted-foreground">Open incidents</div>
            </div>
            <div>
              <div className="text-lg font-bold text-emerald-400">A+</div>
              <div className="text-[10px] text-muted-foreground">Security grade</div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6">
          <ApiTokensSection />
          <AuditLogsSection />
          <TeamRolesSection />
        </div>
      </div>
    </div>
  );
}

/* ---------------- API Tokens ---------------- */
function ApiTokensSection() {
  const [tokens, setTokens] = useState(apiTokens);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      const id = `tok_live_${Math.random().toString(36).slice(2, 6)}`;
      setTokens((t) => [
        {
          id,
          label: "New token",
          scope: "agents:ro",
          created: new Date().toISOString().slice(0, 10),
          lastUsed: "never",
        },
        ...t,
      ]);
      setRevealed((r) => ({ ...r, [id]: true }));
      setGenerating(false);
    }, 900);
  };

  const copy = (id: string) => {
    navigator.clipboard?.writeText(id).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const revoke = (id: string) => setTokens((t) => t.filter((x) => x.id !== id));

  return (
    <section className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-[#00F2FE]" />
          <h2 className="text-base font-semibold">API Token Management</h2>
        </div>
        <button
          onClick={generate}
          disabled={generating}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#00F2FE] to-[#7F00FF] px-3.5 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-70"
        >
          {generating ? (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          ) : (
            <Plus className="h-3.5 w-3.5" />
          )}
          Generate new token
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="py-2 pr-4 font-medium">Token</th>
              <th className="py-2 pr-4 font-medium">Label</th>
              <th className="py-2 pr-4 font-medium">Scope</th>
              <th className="py-2 pr-4 font-medium">Created</th>
              <th className="py-2 pr-4 font-medium">Last used</th>
              <th className="py-2 pr-2 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {tokens.map((t) => (
              <tr key={t.id} className="group">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <code className="rounded-md border border-border/60 bg-background/40 px-2 py-1 font-mono text-xs">
                      {revealed[t.id] ? t.id : `${t.id.slice(0, 8)}${"•".repeat(8)}`}
                    </code>
                    <button
                      onClick={() => copy(t.id)}
                      className="text-muted-foreground hover:text-foreground"
                      aria-label="copy"
                    >
                      {copied === t.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </td>
                <td className="py-3 pr-4">{t.label}</td>
                <td className="py-3 pr-4">
                  <code className="text-xs text-[#b14bff]">{t.scope}</code>
                </td>
                <td className="py-3 pr-4 text-muted-foreground">{t.created}</td>
                <td className="py-3 pr-4 text-muted-foreground">{t.lastUsed}</td>
                <td className="py-3 pr-2 text-right">
                  <button
                    onClick={() => revoke(t.id)}
                    className="inline-flex items-center gap-1 rounded-md border border-border/60 px-2 py-1 text-[11px] text-muted-foreground hover:text-red-400 hover:border-red-400/40"
                  >
                    <Trash2 className="h-3 w-3" /> Revoke
                  </button>
                </td>
              </tr>
            ))}
            {tokens.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                  No active tokens. Generate one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ---------------- Audit Logs ---------------- */
function AuditLogsSection() {
  const [filter, setFilter] = useState<"all" | "info" | "success" | "warn" | "error">("all");
  const [query, setQuery] = useState("");

  const filtered = auditLogs.filter((l) => {
    if (filter !== "all" && l.level !== filter) return false;
    if (query && !`${l.agent} ${l.action} ${l.id}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const levelMap = {
    info: { Icon: Info, cls: "text-[#00F2FE] bg-[#00F2FE]/10 border-[#00F2FE]/30" },
    success: { Icon: CheckCircle2, cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
    warn: { Icon: AlertTriangle, cls: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
    error: { Icon: XCircle, cls: "text-red-400 bg-red-500/10 border-red-500/30" },
  };

  return (
    <section className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ScrollText className="h-4 w-4 text-[#b14bff]" />
          <h2 className="text-base font-semibold">System Audit Logs</h2>
          <span className="rounded-full bg-muted/40 px-2 py-0.5 text-[10px] text-muted-foreground">
            {filtered.length} entries
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search logs…"
              className="h-8 w-44 rounded-lg border border-border/60 bg-background/40 pl-8 pr-3 text-xs outline-none focus:border-[#00F2FE]/60"
            />
          </div>
          <div className="flex items-center gap-1">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            {(["all", "info", "success", "warn", "error"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-md px-2 py-1 text-[11px] font-medium capitalize transition-colors",
                  filter === f
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto space-y-1.5 pr-1">
        {filtered.map((log) => {
          const { Icon, cls } = levelMap[log.level];
          return (
            <div
              key={log.id}
              className="flex items-start gap-3 rounded-lg border border-border/60 bg-background/40 px-3 py-2.5"
            >
              <span className={cn("mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border", cls)}>
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground">{log.id}</span>
                  <span className="rounded bg-accent/60 px-1.5 py-0.5 text-[10px] font-medium">{log.agent}</span>
                </div>
                <p className="mt-0.5 text-xs text-foreground/90">{log.action}</p>
              </div>
              <span className="shrink-0 text-[10px] text-muted-foreground">{log.time}</span>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No logs match your filters.
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------- Team Roles ---------------- */
function TeamRolesSection() {
  const [roles, setRoles] = useState(teamRoles);

  const roleColors: Record<string, string> = {
    Owner: "bg-[#7F00FF]/15 text-[#b14bff] border-[#7F00FF]/30",
    Admin: "bg-[#00F2FE]/15 text-[#00F2FE] border-[#00F2FE]/30",
    Operator: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    Analyst: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    Viewer: "bg-muted/40 text-muted-foreground border-border/60",
  };
  const statusColors: Record<string, string> = {
    active: "bg-emerald-400",
    invited: "bg-amber-400",
    suspended: "bg-red-400",
  };

  return (
    <section className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users2 className="h-4 w-4 text-[#00F2FE]" />
          <h2 className="text-base font-semibold">Team & Role-Based Access</h2>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/40 px-3.5 py-2 text-xs font-semibold hover:bg-accent/50">
          <Plus className="h-3.5 w-3.5" /> Invite member
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="py-2 pr-4 font-medium">Member</th>
              <th className="py-2 pr-4 font-medium">Role</th>
              <th className="py-2 pr-4 font-medium">Agents accessible</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-2 font-medium text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {roles.map((m, i) => (
              <tr key={m.email} className="group">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold"
                      style={{
                        background:
                          i % 2 === 0
                            ? "linear-gradient(135deg, #00F2FE, #7F00FF)"
                            : "linear-gradient(135deg, #7F00FF, #00F2FE)",
                        color: "#0a0a12",
                      }}
                    >
                      {m.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{m.name}</div>
                      <div className="text-[11px] text-muted-foreground">{m.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <select
                    value={m.role}
                    onChange={(e) =>
                      setRoles((r) => r.map((x) => (x.email === m.email ? { ...x, role: e.target.value } : x)))
                    }
                    className={cn(
                      "rounded-md border bg-background/40 px-2 py-1 text-xs font-medium outline-none",
                      roleColors[m.role]
                    )}
                  >
                    {["Owner", "Admin", "Operator", "Analyst", "Viewer"].map((r) => (
                      <option key={r} value={r} className="bg-card text-foreground">
                        {r}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-border/60">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#00F2FE] to-[#7F00FF]"
                        style={{ width: `${(m.agents / 6) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{m.agents}/6</span>
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <span className="inline-flex items-center gap-1.5 text-xs">
                    <span className={cn("h-1.5 w-1.5 rounded-full", statusColors[m.status])} />
                    <span className="capitalize text-muted-foreground">{m.status}</span>
                  </span>
                </td>
                <td className="py-3 pr-2 text-right">
                  <button
                    onClick={() => setRoles((r) => r.filter((x) => x.email !== m.email))}
                    className="rounded-md p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-accent hover:text-foreground group-hover:opacity-100"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-5">
        {["Owner", "Admin", "Operator", "Analyst", "Viewer"].map((r) => (
          <div key={r} className={cn("rounded-lg border px-3 py-2 text-center", roleColors[r])}>
            <div className="text-[10px] uppercase tracking-wider opacity-70">{r}</div>
            <div className="text-xs font-semibold">
              {roles.filter((m) => m.role === r).length} member{roles.filter((m) => m.role === r).length !== 1 ? "s" : ""}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
