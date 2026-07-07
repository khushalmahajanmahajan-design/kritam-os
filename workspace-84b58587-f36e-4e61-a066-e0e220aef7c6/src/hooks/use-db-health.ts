"use client";

import { useEffect, useState } from "react";

export type DbMode = "live" | "configured-unreachable" | "demo" | "loading";

export interface HealthState {
  mode: DbMode;
  configured: boolean;
  reachable: boolean;
  error: string | null;
}

/**
 * Polls /api/health to surface whether Supabase is wired up live or
 * running in demo fallback mode. Used to render the status pill.
 */
export function useDbHealth(): HealthState {
  const [state, setState] = useState<HealthState>({
    mode: "loading",
    configured: false,
    reachable: false,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      try {
        const res = await fetch("/api/health", { cache: "no-store" });
        const json = await res.json();
        if (cancelled) return;
        const supa = json.supabase ?? {};
        setState({
          mode: (supa.mode as DbMode) ?? "demo",
          configured: !!supa.configured,
          reachable: !!supa.reachable,
          error: supa.error ?? null,
        });
      } catch {
        if (!cancelled) {
          setState({
            mode: "demo",
            configured: false,
            reachable: false,
            error: "health check failed",
          });
        }
      }
    };
    tick();
    // re-check every 30s so a key swap is picked up without a refresh
    const id = setInterval(tick, 30000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return state;
}
