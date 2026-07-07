import { NextRequest, NextResponse } from "next/server";
import {
  getSupabase,
  isSupabaseConfigured,
  type AgentRow,
  type PublishAgentPayload,
} from "@/lib/supabase";
import { agents as demoAgents } from "@/lib/mock-data";

/**
 * GET /api/agents
 * Returns all live marketplace agents.
 *
 * - When Supabase is configured with a real anon key, streams rows from
 *   the `ai_agents_catalog` table where is_live_in_marketplace = true.
 * - Otherwise (placeholder key), returns the local demo catalog so the
 *   UI keeps working. The `source` field tells the client which path ran.
 */
export async function GET() {
  const supabase = getSupabase();

  if (!supabase) {
    // Demo fallback — map the local catalog to the AgentRow shape.
    const demo: AgentRow[] = demoAgents.map((a) => ({
      id: a.id,
      agent_name: a.name,
      role_category: a.department,
      monthly_price_inr: Math.round(a.monthly * 83),
      base_system_prompt: a.description,
      is_live_in_marketplace: true,
    }));
    return NextResponse.json({
      source: "demo",
      configured: false,
      agents: demo,
    });
  }

  try {
    const { data, error } = await supabase
      .from("ai_agents_catalog")
      .select("*")
      .eq("is_live_in_marketplace", true);

    if (error) {
      // surface the DB error but still fall back to demo so the UI renders
      return NextResponse.json(
        {
          source: "demo",
          configured: true,
          error: error.message,
          agents: demoAgents.map((a) => ({
            id: a.id,
            agent_name: a.name,
            role_category: a.department,
            monthly_price_inr: Math.round(a.monthly * 83),
            base_system_prompt: a.description,
            is_live_in_marketplace: true,
          })),
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      source: "supabase",
      configured: true,
      agents: (data ?? []) as AgentRow[],
    });
  } catch (err) {
    return NextResponse.json(
      {
        source: "demo",
        configured: true,
        error: err instanceof Error ? err.message : "unknown error",
        agents: demoAgents.map((a) => ({
          id: a.id,
          agent_name: a.name,
          role_category: a.department,
          monthly_price_inr: Math.round(a.monthly * 83),
          base_system_prompt: a.description,
          is_live_in_marketplace: true,
        })),
      },
      { status: 200 }
    );
  }
}

/**
 * POST /api/agents
 * Publish a new AI employee to ai_agents_catalog.
 *
 * Body: PublishAgentPayload
 * - When Supabase is configured, performs the live insert mutation.
 * - Otherwise, echoes back the created row in demo mode.
 */
export async function POST(req: NextRequest) {
  let body: PublishAgentPayload;
  try {
    body = (await req.json()) as PublishAgentPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  // basic server-side validation
  const name = (body.agent_name || "").trim();
  const category = (body.role_category || "").trim();
  const price = Number(body.monthly_price_inr);
  const prompt = (body.base_system_prompt || "").trim();

  if (!name) {
    return NextResponse.json(
      { ok: false, error: "Agent name is required." },
      { status: 422 }
    );
  }
  if (!category) {
    return NextResponse.json(
      { ok: false, error: "Role category is required." },
      { status: 422 }
    );
  }
  if (!Number.isFinite(price) || price <= 0) {
    return NextResponse.json(
      { ok: false, error: "Monthly price (INR) must be a positive number." },
      { status: 422 }
    );
  }
  if (prompt.length < 20) {
    return NextResponse.json(
      { ok: false, error: "Brain blueprint must be at least 20 characters." },
      { status: 422 }
    );
  }

  const row = {
    agent_name: name,
    role_category: category,
    monthly_price_inr: price,
    base_system_prompt: prompt,
    is_live_in_marketplace: true,
  };

  const supabase = getSupabase();

  if (!supabase) {
    // Demo mode — pretend the insert succeeded.
    return NextResponse.json({
      ok: true,
      source: "demo",
      configured: false,
      agent: { id: `demo-${Date.now()}`, ...row },
    });
  }

  try {
    const { data, error } = await supabase
      .from("ai_agents_catalog")
      .insert([row])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, source: "supabase", error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      source: "supabase",
      configured: true,
      agent: data as AgentRow,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        source: "supabase",
        error: err instanceof Error ? err.message : "unknown error",
      },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
