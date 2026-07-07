"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Cpu,
  ShieldCheck,
  Zap,
  Network,
  GitBranch,
  Gauge,
  Lock,
  Sparkles,
} from "lucide-react";
import { ParticleGlobe } from "@/components/particle-globe";
import { SwarmGrid } from "@/components/swarm-grid";
import { ErrorBoundary } from "@/components/error-boundary";
import { useKritamStore } from "@/lib/store";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const STATS = [
  { label: "AI Employees deployed", value: "1.2M+", icon: Cpu },
  { label: "Autonomous success rate", value: "97.4%", icon: Gauge },
  { label: "Hours logged / month", value: "4.8M", icon: Zap },
  { label: "Enterprise SOC 2", value: "Type II", icon: ShieldCheck },
];

const FEATURES = [
  {
    icon: Network,
    title: "Swarm Orchestration",
    desc: "AI employees hand tasks to each other across departments — no human relay, no dropped context.",
    accent: "cyan",
  },
  {
    icon: GitBranch,
    title: "Guardrailed Autonomy",
    desc: "Define scope, budgets and permissions per agent. They operate within your boundaries, always.",
    accent: "purple",
  },
  {
    icon: Sparkles,
    title: "Vector Knowledge Core",
    desc: "Drop any document. KRITAM indexes it into a secure vector base every agent can reason over.",
    accent: "cyan",
  },
  {
    icon: Lock,
    title: "Enterprise-grade Security",
    desc: "Role-based access, full audit trails, token-scoped APIs and per-tenant data isolation.",
    accent: "purple",
  },
];

const STEPS = [
  { n: "01", title: "Browse the marketplace", desc: "Pick from a catalog of specialist AI employees pre-trained for their domain." },
  { n: "02", title: "Deploy to workspace", desc: "Checkout in seconds. The agent provisions, onboards your KB and joins the swarm." },
  { n: "03", title: "Orchestrate & scale", desc: "Assign tasks, monitor telemetry and chain agents into autonomous pipelines." },
];

export function HomePage() {
  const { setPage } = useKritamStore();

  return (
    <div className="relative">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
        {/* grid bg */}
        <div className="pointer-events-none absolute inset-0 grid-bg grid-bg-fade" />
        {/* glow orbs */}
        <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-[#00F2FE]/15 blur-[120px]" />
        <div className="pointer-events-none absolute top-20 right-1/4 h-72 w-72 rounded-full bg-[#7F00FF]/15 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <motion.div
                custom={0}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-sm"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00F2FE] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00F2FE]" />
                </span>
                KRITAM OS v3.2 — multi-tenant swarm online
              </motion.div>

              <motion.h1
                custom={1}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
              >
                Hire AI Employees in Minutes.
                <span className="block gradient-text">
                  Scale Your Business Without Scaling Your Team.
                </span>
              </motion.h1>

              <motion.p
                custom={2}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg"
              >
                KRITAM OS is the autonomous workforce operating system. Deploy
                specialist AI agents across Sales, Support, Finance, HR and
                Engineering — they collaborate as a swarm and execute around the clock.
              </motion.p>

              <motion.div
                custom={3}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <button
                  onClick={() => setPage("marketplace")}
                  className="group relative inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-primary-foreground overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#00F2FE] to-[#7F00FF]" />
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-[#7F00FF] to-[#00F2FE]" />
                  <span className="relative z-10">Hire your first AI employee</span>
                  <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => setPage("dashboard")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-card/50 px-6 py-3 text-sm font-semibold backdrop-blur-sm hover:bg-accent/50 transition-colors"
                >
                  Explore the workspace
                </button>
              </motion.div>

              <motion.div
                custom={4}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4"
              >
                {STATS.map((s) => (
                  <div key={s.label} className="rounded-xl border border-border/60 bg-card/40 p-3 backdrop-blur-sm">
                    <s.icon className="h-4 w-4 text-[#00F2FE]" />
                    <div className="mt-2 text-xl font-bold">{s.value}</div>
                    <div className="text-[11px] leading-tight text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* globe */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-square w-full"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00F2FE]/10 to-[#7F00FF]/10 blur-2xl" />
              <ErrorBoundary label="Particle globe">
                <ParticleGlobe className="relative h-full w-full" />
              </ErrorBoundary>
              <div className="pointer-events-none absolute inset-0 rounded-full border border-border/30" />
              {/* corner ticks */}
              {[
                "top-0 left-0",
                "top-0 right-0",
                "bottom-0 left-0",
                "bottom-0 right-0",
              ].map((pos) => (
                <div
                  key={pos}
                  className={`pointer-events-none absolute ${pos} h-8 w-8 border-[#00F2FE]/40`}
                  style={{
                    borderTopWidth: pos.includes("top") ? 1 : 0,
                    borderBottomWidth: pos.includes("bottom") ? 1 : 0,
                    borderLeftWidth: pos.includes("left") ? 1 : 0,
                    borderRightWidth: pos.includes("right") ? 1 : 0,
                  }}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== SWARM ===== */}
      <section className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00F2FE]"
            >
              Live Swarm
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
            >
              One swarm. Every department. Zero handoffs lost.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-muted-foreground"
            >
              Each AI employee owns its domain and passes work seamlessly to the
              next. Tap any node to inspect its live operational pipeline.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-12"
          >
            <SwarmGrid />
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="relative py-20 sm:py-28 border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b14bff]">
              The Operating System
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Built like infrastructure. Felt like a teammate.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur-sm transition-colors hover:border-border"
              >
                <div
                  className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl transition-opacity opacity-0 group-hover:opacity-100 ${
                    f.accent === "cyan" ? "bg-[#00F2FE]/20" : "bg-[#7F00FF]/20"
                  }`}
                />
                <div
                  className={`relative inline-flex h-11 w-11 items-center justify-center rounded-xl border ${
                    f.accent === "cyan"
                      ? "border-[#00F2FE]/30 bg-[#00F2FE]/10 text-[#00F2FE]"
                      : "border-[#7F00FF]/30 bg-[#7F00FF]/10 text-[#b14bff]"
                  }`}
                >
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="relative mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="relative mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="relative py-20 sm:py-28 border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00F2FE]">
              How it works
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              From zero to autonomous workforce in three moves.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur-sm"
              >
                <span className="font-mono text-4xl font-bold gradient-text">{s.n}</span>
                <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                {i < STEPS.length - 1 && (
                  <ArrowRight className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-[#00F2FE]/40 md:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/40 p-8 text-center backdrop-blur-sm sm:p-14"
          >
            <div className="pointer-events-none absolute inset-0 grid-bg grid-bg-fade opacity-50" />
            <div className="pointer-events-none absolute -top-20 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-[#00F2FE]/20 blur-[100px]" />
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Your next hire doesn&apos;t sleep.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Stand up a full AI workforce today. No onboarding, no benefits,
                no ramp time — just outcomes.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  onClick={() => setPage("marketplace")}
                  className="group relative inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-primary-foreground overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#00F2FE] to-[#7F00FF]" />
                  <span className="relative z-10">Enter the marketplace</span>
                  <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => setPage("auth")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-card/50 px-6 py-3 text-sm font-semibold backdrop-blur-sm hover:bg-accent/50 transition-colors"
                >
                  Create free account
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
