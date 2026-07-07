import { NextResponse } from "next/server";
import { isSupabaseConfigured, getSupabase, SUPABASE_URL } from "@/lib/supabase";

/**
 * GET /api/health
 * Reports the live Supabase connection status so the UI can show a
 * "Live" / "Demo" pill. Does NOT throw — always returns 200.
 */
export async function GET() {
  const configured = isSupabaseConfigured();
  const supabase = getSupabase();

  let dbReachable = false;
  let dbError: string | null = null;

  if (configured && supabase) {
    try {
      // light-touch reachability check — count 1 row from the catalog
      const { error } = await supabase
        .from("ai_agents_catalog")
        .select("id", { count: "exact", head: true })
        .limit(1);
      dbReachable = !error;
      dbError = error?.message ?? null;
    } catch (err) {
      dbReachable = false;
      dbError = err instanceof Error ? err.message : "unknown error";
    }
  }

  return NextResponse.json({
    status: "ok",
    supabase: {
      url: SUPABASE_URL,
      configured,
      reachable: dbReachable,
      error: dbError,
      mode: configured ? (dbReachable ? "live" : "configured-unreachable") : "demo",
    },
    timestamp: new Date().toISOString(),
  });
}

export const dynamic = "force-dynamic";
