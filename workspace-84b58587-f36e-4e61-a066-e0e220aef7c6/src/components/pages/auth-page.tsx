"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Building2, Eye, EyeOff, ShieldCheck, Fingerprint, ArrowRight, Check } from "lucide-react";
import { KritamLogo } from "@/components/kritam-logo";
import { useKritamStore } from "@/lib/store";
import { cn } from "@/lib/utils";

function SocialIcon({ name }: { name: "google" | "github" | "apple" }) {
  if (name === "google") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 5.1 29.6 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-2.5z" />
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 5.1 29.6 3 24 3 16 3 9.1 7.6 6.3 14.7z" />
        <path fill="#4CAF50" d="M24 43c5.5 0 10.5-2.1 14.3-5.5l-6.6-5.6C29.6 33.6 27 34.5 24 34.5c-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9 40.2 16 43 24 43z" />
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.4l6.6 5.6C41.9 36.5 44 30.9 44 24c0-1.3-.1-2.3-.4-2.5z" />
      </svg>
    );
  }
  if (name === "github") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
        <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.4 9.4 0 0112 6.85c.85 0 1.71.12 2.51.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.59.69.49A10.02 10.02 0 0022 12.25C22 6.58 17.52 2 12 2z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

export function AuthPage() {
  const { setPage, authForm, setAuthForm } = useKritamStore();
  const [tab, setTab] = useState<"signin" | "register">("signin");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      setTimeout(() => {
        setDone(false);
        setPage("dashboard");
      }, 900);
    }, 1200);
  };

  return (
    <section className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-28">
      <div className="pointer-events-none absolute inset-0 grid-bg grid-bg-fade" />
      <div className="pointer-events-none absolute -top-32 left-1/4 h-80 w-80 rounded-full bg-[#00F2FE]/15 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-[#7F00FF]/15 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        {/* logo */}
        <div className="mb-6 flex flex-col items-center">
          <KritamLogo size={48} />
          <h1 className="mt-3 text-2xl font-bold">
            <span className="gradient-text">KRITAM</span>
            <span className="ml-1.5">OS</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {tab === "signin" ? "Sign in to your workforce console" : "Register your enterprise workspace"}
          </p>
        </div>

        {/* glass card */}
        <div className="glass gradient-border relative rounded-2xl border border-border/60 p-6 shadow-2xl">
          {/* tabs */}
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl border border-border/60 bg-background/40 p-1">
            {(["signin", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "relative rounded-lg py-2 text-sm font-medium transition-colors",
                  tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab === t && (
                  <motion.span
                    layoutId="auth-tab"
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#00F2FE]/20 to-[#7F00FF]/20 border border-border/60"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  {t === "signin" ? "Sign In" : "Register"}
                </span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-8 text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/40">
                  <Check className="h-7 w-7 text-emerald-400" />
                </div>
                <p className="mt-4 font-medium">Authenticated</p>
                <p className="text-sm text-muted-foreground">Booting your workspace…</p>
              </motion.div>
            ) : (
              <motion.form
                key={tab}
                initial={{ opacity: 0, x: tab === "signin" ? -16 : 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: tab === "signin" ? 16 : -16 }}
                transition={{ duration: 0.25 }}
                onSubmit={submit}
                className="space-y-4"
              >
                {tab === "register" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Organization name</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        required
                        value={authForm.org}
                        onChange={(e) => setAuthForm({ org: e.target.value })}
                        placeholder="Acme Corp"
                        className="h-11 w-full rounded-xl border border-border/60 bg-background/50 pl-10 pr-3 text-sm outline-none transition-colors focus:border-[#00F2FE]/60"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    {tab === "signin" ? "Work email" : "Admin email"}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      required
                      type="email"
                      value={authForm.email}
                      onChange={(e) => setAuthForm({ email: e.target.value })}
                      placeholder="you@company.com"
                      className="h-11 w-full rounded-xl border border-border/60 bg-background/50 pl-10 pr-3 text-sm outline-none transition-colors focus:border-[#00F2FE]/60"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      required
                      type={showPw ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-11 w-full rounded-xl border border-border/60 bg-background/50 pl-10 pr-10 text-sm outline-none transition-colors focus:border-[#00F2FE]/60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label="toggle password"
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {tab === "signin" && (
                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 text-muted-foreground">
                      <input type="checkbox" className="accent-[#00F2FE]" /> Remember me
                    </label>
                    <button type="button" className="text-[#00F2FE] hover:underline">
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground overflow-hidden disabled:opacity-70"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#00F2FE] to-[#7F00FF]" />
                  {loading ? (
                    <>
                      <span className="relative z-10 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      <span className="relative z-10">Authenticating…</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="relative z-10 h-4 w-4" />
                      <span className="relative z-10">
                        {tab === "signin" ? "Sign in securely" : "Create workspace"}
                      </span>
                      <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border/60" />
            <span className="text-xs text-muted-foreground">or continue with</span>
            <div className="h-px flex-1 bg-border/60" />
          </div>

          {/* social */}
          <div className="grid grid-cols-3 gap-2">
            {(["google", "github", "apple"] as const).map((p) => (
              <button
                key={p}
                onClick={() => {}}
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-border/60 bg-background/40 text-sm font-medium transition-colors hover:bg-accent/50"
              >
                <SocialIcon name={p} />
                <span className="capitalize hidden sm:inline">{p}</span>
              </button>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Fingerprint className="h-3.5 w-3.5 text-[#00F2FE]" />
            Secured with passkeys · SOC 2 Type II · End-to-end encrypted
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          By continuing you agree to KRITAM OS{" "}
          <button className="text-foreground hover:underline">Terms</button> and{" "}
          <button className="text-foreground hover:underline">Privacy Policy</button>.
        </p>
      </motion.div>
    </section>
  );
}
