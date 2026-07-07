"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Sparkles,
  Upload,
  Check,
  Brain,
  Tag,
  User,
  ChevronDown,
  ArrowRight,
  Loader2,
  Database,
  WifiOff,
} from "lucide-react";
import { useKritamStore, type NewAgentDraft } from "@/lib/store";
import { agentIconMap } from "@/components/kritam/agent-icons";
import { useDbHealth } from "@/hooks/use-db-health";
import { cn } from "@/lib/utils";

const DEPARTMENTS = ["Tech", "Sales", "Marketing", "HR", "Finance", "Legal"] as const;
const USD_RATE = 83;

export function AgentDeployerForm() {
  const { addCustomAgent, setPage } = useKritamStore();
  const health = useDbHealth();
  const [name, setName] = useState("");
  const [dept, setDept] = useState<(typeof DEPARTMENTS)[number]>("Tech");
  const [pricingINR, setPricingINR] = useState<number>(4999);
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [published, setPublished] = useState<{ name: string; id: string; live: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const monthlyUSD = Math.max(1, Math.round(pricingINR / USD_RATE));

  const publish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Agent name is required.");
      return;
    }
    if (!prompt.trim() || prompt.trim().length < 20) {
      setError("Brain blueprint must be at least 20 characters.");
      return;
    }
    if (!pricingINR || pricingINR <= 0) {
      setError("Subscription pricing must be a positive number.");
      return;
    }
    setError(null);
    setSubmitting(true);

    // also push to the local persisted store so the marketplace card
    // renders instantly even before the refetch revalidates.
    const draft: NewAgentDraft = {
      name: name.trim(),
      role: `${dept} AI`,
      department: dept,
      pricingINR,
      systemPrompt: prompt.trim(),
    };
    const localAgent = addCustomAgent(draft);

    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent_name: name.trim(),
          role_category: dept,
          monthly_price_inr: Number(pricingINR),
          base_system_prompt: prompt.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Publish failed");
      }
      const live = json.source === "supabase";
      setPublished({ name: localAgent.name, id: localAgent.id, live });
    } catch (err) {
      // network/DB failure — the local store entry still keeps the card
      // visible; surface a soft notice.
      setPublished({
        name: localAgent.name,
        id: localAgent.id,
        live: false,
      });
      setError(
        err instanceof Error
          ? `Saved locally (${err.message}).`
          : "Saved locally — DB unreachable."
      );
    } finally {
      setSubmitting(false);
      // reset form
      setName("");
      setPrompt("");
      setPricingINR(4999);
      setDept("Tech");
      setTimeout(() => setPublished(null), 4500);
    }
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-sm">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-[#00F2FE]" />
          <h2 className="text-base font-semibold">System Agent Manager</h2>
          <span className="rounded-full bg-[#00F2FE]/10 px-2 py-0.5 text-[10px] font-medium text-[#00F2FE]">
            Deployer
          </span>
        </div>
        <DbStatusPill mode={health.mode} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* form */}
        <form onSubmit={publish} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <User className="h-3 w-3" /> Agent Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sentinel"
                className="h-11 w-full rounded-xl border border-border/60 bg-background/50 px-3 text-sm outline-none focus:border-[#00F2FE]/60"
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Tag className="h-3 w-3" /> Role Category
              </label>
              <div className="relative">
                <select
                  value={dept}
                  onChange={(e) => setDept(e.target.value as (typeof DEPARTMENTS)[number])}
                  className="h-11 w-full appearance-none rounded-xl border border-border/60 bg-background/50 px-3 pr-9 text-sm outline-none focus:border-[#00F2FE]/60"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d} className="bg-card">
                      {d}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Tag className="h-3 w-3" /> Subscription Pricing Tag (INR / month)
              </span>
              <span className="font-mono text-[10px] text-[#00F2FE]">≈ ${monthlyUSD}/mo</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">₹</span>
              <input
                type="number"
                min={1}
                step={1}
                value={pricingINR}
                onChange={(e) => setPricingINR(parseInt(e.target.value) || 0)}
                className="h-11 w-full rounded-xl border border-border/60 bg-background/50 pl-8 pr-3 text-sm outline-none focus:border-[#00F2FE]/60"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[999, 2999, 4999, 9999, 19999].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPricingINR(p)}
                  className={cn(
                    "rounded-md border px-2 py-0.5 text-[10px] transition-colors",
                    pricingINR === p
                      ? "border-[#00F2FE]/50 bg-[#00F2FE]/10 text-[#00F2FE]"
                      : "border-border/60 bg-background/40 text-muted-foreground hover:text-foreground"
                  )}
                >
                  ₹{p.toLocaleString("en-IN")}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Brain className="h-3 w-3" /> Base System Prompt / Brain Blueprint
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
              placeholder="Define the core behavioral instructions and operational rules for this agent. e.g. 'You are an autonomous legal counsel that drafts NDAs, reviews SLAs for red flags, and escalates high-risk clauses for human review…'"
              className="w-full resize-none rounded-xl border border-border/60 bg-background/50 p-3 text-sm outline-none focus:border-[#00F2FE]/60"
            />
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>Min 20 characters</span>
              <span className={cn(prompt.length < 20 && "text-amber-400")}>{prompt.length} chars</span>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-400"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={submitting}
            className="group relative inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground overflow-hidden disabled:cursor-not-allowed"
          >
            <span
              className={cn(
                "absolute inset-0 bg-gradient-to-r from-[#00F2FE] to-[#7F00FF] transition-opacity",
                submitting ? "opacity-40" : "opacity-100"
              )}
 />
            {submitting && (
              <motion.span
                className="absolute inset-0 opacity-70"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(0,242,254,0.6), rgba(127,0,255,0.6), transparent)",
                  backgroundSize: "200% 100%",
                }}
                animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
              />
            )}
            {submitting ? (
              <>
                <Loader2 className="relative z-10 h-4 w-4 animate-spin" />
                <span className="relative z-10">Publishing to catalog…</span>
              </>
            ) : (
              <>
                <Upload className="relative z-10 h-4 w-4" />
                <span className="relative z-10">Publish Agent to Marketplace</span>
                <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* live preview */}
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Live preview
          </div>
          <div className="rounded-xl border border-border/60 bg-background/40 p-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl border",
                  dept === "Tech" || dept === "HR" || dept === "Finance"
                    ? "border-[#7F00FF]/30 bg-[#7F00FF]/10 text-[#b14bff]"
                    : "border-[#00F2FE]/30 bg-[#00F2FE]/10 text-[#00F2FE]"
                )}
              >
                {(() => {
                  const IconMap: Record<string, string> = {
                    Tech: "code",
                    Sales: "trending-up",
                    Marketing: "search",
                    HR: "calendar",
                    Finance: "calculator",
                    Legal: "scale",
                  };
                  const Icon = agentIconMap[IconMap[dept]] ?? Bot;
                  return <Icon className="h-6 w-6" />;
                })()}
              </div>
              <div className="min-w-0">
                <div className="truncate font-semibold">{name || "Unnamed Agent"}</div>
                <div className="truncate text-xs text-muted-foreground">{dept} AI</div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-lg border border-border/60 bg-card/40 py-1.5">
                <div className="text-[9px] uppercase text-muted-foreground">INR</div>
                <div className="text-sm font-bold">₹{pricingINR.toLocaleString("en-IN")}</div>
              </div>
              <div className="rounded-lg border border-border/60 bg-card/40 py-1.5">
                <div className="text-[9px] uppercase text-muted-foreground">USD</div>
                <div className="text-sm font-bold">${monthlyUSD}</div>
              </div>
            </div>
            <div className="mt-3 rounded-lg border border-border/60 bg-card/40 p-2.5">
              <div className="text-[9px] uppercase text-muted-foreground">Blueprint</div>
              <p className="mt-0.5 line-clamp-4 text-[11px] text-muted-foreground">
                {prompt || "Brain blueprint will appear here as you type…"}
              </p>
            </div>
          </div>

          <AnimatePresence>
            {published && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3"
              >
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-300">
                  <Check className="h-4 w-4" /> {published.name} published
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {published.live
                    ? "Inserted into ai_agents_catalog — now live in the marketplace."
                    : "Saved to local catalog — visible in the marketplace (demo mode)."}
                </p>
                <button
                  onClick={() => setPage("marketplace")}
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-[#00F2FE] hover:underline"
                >
                  View in marketplace <ArrowRight className="h-3 w-3" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ---------------- DB status pill ---------------- */
function DbStatusPill({ mode }: { mode: string }) {
  if (mode === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-300">
        <Database className="h-3 w-3" />
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
        Supabase Live
      </span>
    );
  }
  if (mode === "configured-unreachable") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-medium text-amber-300">
        <WifiOff className="h-3 w-3" /> DB unreachable
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
      <Database className="h-3 w-3" /> Demo mode
    </span>
  );
}
