"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  Fingerprint,
  Loader2,
  Check,
  KeyRound,
} from "lucide-react";
import { useKritamStore } from "@/lib/store";
import { KritamLogo } from "@/components/kritam-logo";
import { cn } from "@/lib/utils";

/**
 * Mock master admin password. In a real deployment this would be verified
 * server-side; for this demo it is checked locally.
 */
const MASTER_PASSWORD = "Kritam@Admin#2026!MasterSpace";

type Phase = "input" | "verifying" | "denied" | "granted";

export function AdminGateModal() {
  const gateOpen = useKritamStore((s) => s.gateOpen);

  // lock body scroll while gate is open
  useEffect(() => {
    if (gateOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [gateOpen]);

  return (
    <AnimatePresence>
      {gateOpen && (
        <GateOverlay key="gate-overlay">
          <GateCard />
        </GateOverlay>
      )}
    </AnimatePresence>
  );
}

function GateOverlay({ children }: { children: React.ReactNode }) {
  const closeAdminGate = useKritamStore((s) => s.closeAdminGate);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
    >
      {/* backdrop with grid + scanline */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={closeAdminGate}
      />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-20" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/10 blur-[120px]" />
      {children}
    </motion.div>
  );
}

function GateCard() {
  const { closeAdminGate, unlockAdmin, setPage } = useKritamStore();
  // fresh mount every time the gate opens -> clean initial state, no
  // setState-in-effect needed.
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<Phase>("input");
  const [attempts, setAttempts] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // focus the input shortly after mount
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pw) return;
    setPhase("verifying");
    setTimeout(() => {
      if (pw === MASTER_PASSWORD) {
        setPhase("granted");
        setTimeout(() => {
          unlockAdmin();
          setPage("admin");
        }, 900);
      } else {
        setPhase("denied");
        setAttempts((a) => a + 1);
      }
    }, 900);
  };

  const onPwChange = (v: string) => {
    setPw(v);
    if (phase === "denied") setPhase("input");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 16 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        x: phase === "denied" ? [0, -12, 12, -10, 10, -6, 6, 0] : 0,
      }}
      exit={{ opacity: 0, scale: 0.94, y: 16 }}
      transition={{
        x: { duration: 0.5, ease: "easeInOut" },
        default: { type: "spring", stiffness: 280, damping: 26 },
      }}
      className="relative w-full max-w-md overflow-hidden rounded-2xl border border-red-500/30 bg-card shadow-2xl"
    >
      {/* top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-red-500 via-[#7F00FF] to-red-500" />

      {/* header */}
      <div className="relative flex items-start justify-between border-b border-border/60 p-5">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-red-500/5 to-[#7F00FF]/5" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/40 bg-red-500/10 text-red-400 box-glow-purple">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-400">
              Restricted Zone
            </div>
            <div className="font-semibold">Admin Access Verification</div>
          </div>
        </div>
        <button
          onClick={closeAdminGate}
          disabled={phase === "verifying"}
          className="relative rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-40"
          aria-label="close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {phase === "granted" ? (
          <motion.div
            key="granted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center px-6 py-14 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/40 box-glow-cyan"
            >
              <Check className="h-8 w-8 text-emerald-400" />
            </motion.div>
            <p className="mt-5 font-semibold">Access Granted</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Initializing master console…
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-5"
          >
            <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-border/60 bg-background/40 p-3">
              <KritamLogo size={28} />
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">Secure entry to</div>
                <div className="truncate text-sm font-medium">Kritam Space Admin Portal</div>
              </div>
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[9px] font-medium text-red-400">
                <Lock className="h-2.5 w-2.5" /> L3
              </span>
            </div>

            <form onSubmit={submit} className="space-y-3">
              <div className="space-y-1.5">
                <label className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                  <span>Master Administrator Password</span>
                  <span className="flex items-center gap-1 text-[10px] text-red-400/80">
                    <Fingerprint className="h-3 w-3" /> biometric ready
                  </span>
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    ref={inputRef}
                    type={show ? "text" : "password"}
                    value={pw}
                    onChange={(e) => onPwChange(e.target.value)}
                    disabled={phase === "verifying"}
                    placeholder="Enter master key"
                    className={cn(
                      "h-12 w-full rounded-xl border bg-background/50 pl-10 pr-10 text-sm outline-none transition-colors disabled:opacity-60",
                      phase === "denied"
                        ? "border-red-500/70 box-glow-purple bg-red-500/5"
                        : "border-border/60 focus:border-[#00F2FE]/60"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="toggle password"
                    tabIndex={-1}
                  >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {phase === "denied" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400"
                  >
                    <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                    Access Denied: Invalid Admin Credentials
                    {attempts > 1 && (
                      <span className="ml-auto font-mono text-[10px] text-red-400/70">
                        {attempts} attempts
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={phase === "verifying" || !pw}
                className="group relative inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white overflow-hidden disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-red-600 via-[#7F00FF] to-red-600" />
                {phase === "verifying" ? (
                  <>
                    <Loader2 className="relative z-10 h-4 w-4 animate-spin" />
                    <span className="relative z-10">Verifying credentials…</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="relative z-10 h-4 w-4" />
                    <span className="relative z-10">Authenticate & Enter</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
              <Lock className="h-3 w-3 text-red-400/70" />
              All access attempts are logged · 256-bit encrypted · SOC 2 enforced
            </div>

            {attempts >= 3 && (
              <div className="mt-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-center text-[10px] text-amber-400">
                Hint: master key follows the format{" "}
                <code className="font-mono">Kritam@Admin#2026!MasterSpace</code>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
