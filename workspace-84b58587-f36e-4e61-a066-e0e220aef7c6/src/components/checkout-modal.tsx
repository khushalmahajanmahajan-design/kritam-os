"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShieldCheck,
  Check,
  CreditCard,
  Lock,
  Sparkles,
  Loader2,
  Phone,
  Mail,
  User,
  Zap,
  Brain,
  ArrowRight,
} from "lucide-react";
import { type Agent } from "@/lib/mock-data";
import { useKritamStore, resolvePrice } from "@/lib/store";
import {
  isRazorpayConfigured,
  openRazorpayCheckout,
} from "@/lib/razorpay";
import { cn } from "@/lib/utils";

type Phase = "summary" | "processing" | "success";

export function CheckoutModal({
  agent,
  open,
  onClose,
}: {
  agent: Agent | null;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && agent && (
        <CheckoutInner
          key={`checkout-${agent.id}-${open}`}
          agent={agent}
          onClose={onClose}
        />
      )}
    </AnimatePresence>
  );
}

function CheckoutInner({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  const { deployAgent, pricingOverrides } = useKritamStore();
  const [phase, setPhase] = useState<Phase>("summary");
  const [plan, setPlan] = useState<"monthly" | "hourly">("monthly");
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const price = resolvePrice(
    { hourly: agent.hourly, monthly: agent.monthly },
    pricingOverrides[agent.id]
  );
  const amount = plan === "monthly" ? price.monthly : price.hourly;
  const amountINR = agent.priceINR && plan === "monthly"
    ? agent.priceINR
    : Math.round(amount * 83);

  const configured = useMemo(() => isRazorpayConfigured(), []);

  const pay = async () => {
    setError(null);
    setPhase("processing");

    if (configured) {
      // Real Razorpay checkout — open the native overlay
      try {
        const id = await openRazorpayCheckout({
          amountINR,
          name: "Kritam OS",
          description: "Autonomous AI Employee Deployment",
          prefill: {
            name: customer.name || undefined,
            email: customer.email || undefined,
            contact: customer.phone || undefined,
          },
          notes: { agent: agent.name, plan, workspace: "kritam-default" },
          onSuccess: (pid) => {
            setPaymentId(pid);
            deployAgent(agent.id);
            setPhase("success");
          },
        });
        // promise resolves on success; if it rejects (dismiss), we catch
        if (id) {
          setPaymentId(id);
        }
      } catch (err) {
        // user dismissed or error — return to summary
        setPhase("summary");
        setError(
          err instanceof Error && err.message.includes("dismissed")
            ? "Checkout dismissed. You can retry anytime."
            : err instanceof Error
              ? err.message
              : "Payment failed. Please retry."
        );
      }
    } else {
      // Simulated fallback (placeholder key) — 2.5s processing cascade
      await new Promise((r) => setTimeout(r, 2500));
      const fakeId = `pay_sim_${Math.random().toString(36).slice(2, 12)}`;
      setPaymentId(fakeId);
      deployAgent(agent.id);
      setPhase("success");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 sm:items-center"
    >
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={phase === "processing" ? undefined : onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="relative my-4 w-full max-w-md overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl"
      >
        {/* header */}
        <div className="relative flex items-start justify-between border-b border-border/60 p-5">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#00F2FE]/5 to-[#7F00FF]/5" />
          <div className="relative flex min-w-0 items-center gap-3">
            <div
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border",
                agent.accent === "cyan"
                  ? "border-[#00F2FE]/40 bg-[#00F2FE]/10 text-[#00F2FE]"
                  : "border-[#7F00FF]/40 bg-[#7F00FF]/10 text-[#b14bff]"
              )}
            >
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">Hiring AI Employee</div>
              <div className="truncate font-semibold">{agent.name} · {agent.role}</div>
            </div>
          </div>
          {phase !== "processing" && (
            <button
              onClick={onClose}
              className="relative shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="close"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {/* ---- Billing Summary ---- */}
          {phase === "summary" && (
            <motion.div
              key="summary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-5"
            >
              {/* plan toggle */}
              <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl border border-border/60 bg-background/40 p-1">
                {(["hourly", "monthly"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlan(p)}
                    className={cn(
                      "relative rounded-lg py-2 text-sm font-medium capitalize transition-colors",
                      plan === p ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {plan === p && (
                      <motion.span
                        layoutId="plan-pill"
                        className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#00F2FE]/20 to-[#7F00FF]/20 border border-border/60"
                      />
                    )}
                    <span className="relative z-10">
                      {p} · ₹{(p === "monthly"
                        ? (agent.priceINR ?? Math.round(price.monthly * 83))
                        : Math.round(price.hourly * 83)
                      ).toLocaleString("en-IN")}
                      {p === "hourly" ? "/hr" : "/mo"}
                    </span>
                  </button>
                ))}
              </div>

              {/* billing summary */}
              <div className="mb-4 rounded-xl border border-border/60 bg-background/40 p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{agent.name} · {plan}</span>
                  <span>₹{amountINR.toLocaleString("en-IN")}</span>
                </div>
                <div className="mt-1 flex justify-between">
                  <span className="text-muted-foreground">GST (incl.)</span>
                  <span>₹0</span>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-2 font-semibold">
                  <span>Total due today</span>
                  <span className="gradient-text">₹{amountINR.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* customer prefill */}
              <div className="mb-4 space-y-2.5">
                <div className="text-xs font-medium text-muted-foreground">Billing details</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative col-span-2">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      placeholder="Full name"
                      className="h-10 w-full rounded-lg border border-border/60 bg-background/50 pl-10 pr-3 text-sm outline-none focus:border-[#00F2FE]/60"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      placeholder="Email"
                      className="h-10 w-full rounded-lg border border-border/60 bg-background/50 pl-10 pr-3 text-sm outline-none focus:border-[#00F2FE]/60"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                      placeholder="Phone"
                      className="h-10 w-full rounded-lg border border-border/60 bg-background/50 pl-10 pr-3 text-sm outline-none focus:border-[#00F2FE]/60"
                    />
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-400"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={pay}
                className="group relative inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#00F2FE] to-[#7F00FF]" />
                <CreditCard className="relative z-10 h-4 w-4" />
                <span className="relative z-10">
                  {configured ? "Pay ₹" + amountINR.toLocaleString("en-IN") + " via Razorpay" : "Pay ₹" + amountINR.toLocaleString("en-IN") + " (Demo)"}
                </span>
                <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                {configured
                  ? "Razorpay-secured · PCI-DSS · 256-bit TLS"
                  : "Demo mode — add a real rzp_test_ key to .env to go live"}
              </div>
            </motion.div>
          )}

          {/* ---- Processing ---- */}
          {phase === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center px-6 py-14 text-center"
            >
              <div className="relative h-24 w-24">
                <div className="absolute inset-0 rounded-full border-2 border-[#00F2FE]/20" />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#00F2FE] border-r-[#7F00FF]"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <CreditCard className="h-8 w-8 text-[#00F2FE] animate-pulse" />
                </div>
              </div>
              <p className="mt-6 font-semibold">
                {configured ? "Opening Razorpay checkout…" : "Processing payment…"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {configured
                  ? "Complete the payment in the Razorpay window"
                  : "Simulating transaction via UPI node"}
              </p>
              <div className="mt-5 flex w-full max-w-xs flex-col gap-2 text-left text-xs">
                {[
                  "Securing billing session",
                  configured ? "Awaiting Razorpay confirmation" : "Verifying via UPI node",
                  "Initializing AI brain node",
                ].map((s, i) => (
                  <motion.div
                    key={s}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.5 }}
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#00F2FE]" />
                    {s}…
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ---- Success cascade ---- */}
          {phase === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center px-6 py-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/40 box-glow-cyan"
              >
                <motion.svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  initial="hidden"
                  animate="visible"
                >
                  <motion.path
                    d="M10 20.5L17 27L30 13"
                    stroke="#34d399"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={{
                      hidden: { pathLength: 0, opacity: 0 },
                      visible: { pathLength: 1, opacity: 1 },
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </motion.svg>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-5 text-lg font-semibold"
              >
                Payment Secured!
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="mt-2 flex items-center gap-1.5 text-sm text-[#00F2FE]"
              >
                <Brain className="h-4 w-4" />
                Initializing AI Brain Node…
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-4 rounded-lg border border-border/60 bg-background/40 px-3 py-1.5 font-mono text-[11px] text-muted-foreground"
              >
                Payment ID: {paymentId}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mt-3 text-sm text-muted-foreground"
              >
                {agent.name} is now deployed to your workspace.
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                onClick={onClose}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-background/50 px-5 py-2.5 text-sm font-semibold hover:bg-accent/50"
              >
                <Check className="h-4 w-4 text-emerald-400" />
                Continue to workspace
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
