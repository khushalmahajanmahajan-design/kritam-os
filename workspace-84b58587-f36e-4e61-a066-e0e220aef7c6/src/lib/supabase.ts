import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase configuration.
 *
 * NOTE: The anon key currently in .env is a placeholder
 * ("PASTE_YOUR_LONG_EYJ_ANON_KEY_HERE"). A real anon key is a JWT that
 * starts with "eyJ". Until a real key is provided, all API routes fall
 * back to local demo data so the UI never breaks — the moment a real
 * key is dropped into .env (and the server restarted), every read/write
 * goes live automatically.
 */
export const SUPABASE_URL = "https://caulpqnbxtlqihfdhglm.supabase.co";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "PASTE_YOUR_LONG_EYJ_ANON_KEY_HERE";

const PLACEHOLDER_KEYS = new Set([
  "",
  "PASTE_YOUR_LONG_EYJ_ANON_KEY_HERE",
]);

/** True only when a real-looking anon JWT key is present. */
export function isSupabaseConfigured(): boolean {
  return (
    !!SUPABASE_URL &&
    !PLACEHOLDER_KEYS.has(SUPABASE_ANON_KEY) &&
    SUPABASE_ANON_KEY.startsWith("eyJ")
  );
}

let _client: SupabaseClient | null = null;

/**
 * Lazily-built singleton Supabase client. Returns null when not configured
 * so callers can branch into the demo-data fallback safely.
 */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (_client) return _client;
  _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
  return _client;
}

/** Row shape for the ai_agents_catalog table. */
export interface AgentRow {
  id: string | number;
  agent_name: string;
  role_category: string;
  monthly_price_inr: number;
  base_system_prompt: string;
  is_live_in_marketplace: boolean | null;
  created_at?: string | null;
}

/** Payload accepted by the publish endpoint. */
export interface PublishAgentPayload {
  agent_name: string;
  role_category: string;
  monthly_price_inr: number;
  base_system_prompt: string;
}
