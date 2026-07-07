"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShieldCheck, ChevronRight } from "lucide-react";
import { KritamLogo, KritamWordmark } from "@/components/kritam-logo";
import { useKritamStore, type PageId } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV: { id: PageId; label: string }[] = [
  { id: "home", label: "Engine" },
  { id: "marketplace", label: "Marketplace" },
  { id: "dashboard", label: "Workspace" },
  { id: "enterprise", label: "Enterprise" },
];

export function Navbar() {
  const { page, setPage } = useKritamStore();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: PageId) => {
    setPage(id);
    setOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* logo */}
          <button
            onClick={() => go("home")}
            className="group flex items-center gap-2.5"
            aria-label="KRITAM OS home"
          >
            <KritamLogo size={34} />
            <KritamWordmark className="text-lg" />
          </button>

          {/* desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                  page === item.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {page === item.id && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-lg bg-accent/70 border border-border/60"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* actions */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => go("auth")}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={() => go("auth")}
              className="group relative inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-primary-foreground overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#00F2FE] to-[#7F00FF]" />
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-[#7F00FF] to-[#00F2FE]" />
              <ShieldCheck className="relative z-10 h-4 w-4" />
              <span className="relative z-10">Get Access</span>
            </button>
          </div>

          {/* mobile toggle */}
          <button
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 text-foreground"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden border-b border-border/60 bg-background/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-1">
              {NAV.map((item) => (
                <button
                  key={item.id}
                  onClick={() => go(item.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium",
                    page === item.id
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  {item.label}
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </button>
              ))}
              <button
                onClick={() => go("auth")}
                className="mt-2 w-full rounded-lg bg-gradient-to-r from-[#00F2FE] to-[#7F00FF] px-4 py-3 text-sm font-semibold text-primary-foreground"
              >
                Get Access
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
