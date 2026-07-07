import type { Agent } from "@/lib/mock-data";
import type { AgentRow } from "@/lib/supabase";

const ICON_BY_DEPT: Record<string, string> = {
  Tech: "code",
  Sales: "trending-up",
  Marketing: "search",
  HR: "calendar",
  Finance: "calculator",
  Support: "headset",
  Legal: "scale",
};

const ACCENT_BY_DEPT: Record<string, "cyan" | "purple"> = {
  Tech: "purple",
  Sales: "cyan",
  Marketing: "cyan",
  HR: "purple",
  Finance: "purple",
  Support: "cyan",
  Legal: "cyan",
};

const TASKS_BY_DEPT: Record<string, string[]> = {
  Tech: ["Build features", "Review PRs", "Fix CI", "Maintain docs"],
  Sales: ["Prospect leads", "Book demos", "Update CRM", "Outreach"],
  Marketing: ["SEO briefs", "Content", "Campaigns", "Analytics"],
  HR: ["Onboard hires", "Schedule reviews", "Draft policies", "Triage"],
  Finance: ["Reconcile books", "Draft P&L", "Flag anomalies", "Tax prep"],
  Support: ["Resolve tickets", "Live chat", "Escalations", "Sentiment"],
  Legal: ["Draft contracts", "Review SLAs", "Compliance", "Risk audit"],
};

/** Maps a role_category string from the DB to a marketplace Category. */
const CATEGORY_BY_DEPT: Record<string, Agent["category"]> = {
  Tech: "Software Development",
  Sales: "Customer & Sales",
  Marketing: "Marketing",
  HR: "Human Resources",
  Finance: "Finance",
  Support: "Business Operations",
  Legal: "Legal",
};

/**
 * Maps a raw Supabase catalog row to the richer Agent shape used by the
 * marketplace UI. Falls back to sensible defaults for unknown departments.
 */
export function rowToAgent(row: AgentRow): Agent {
  const dept = (row.role_category || "Tech") as Agent["department"];
  const inr = Number(row.monthly_price_inr) || 0;
  const monthlyUSD = Math.max(1, Math.round(inr / 83));
  const hourlyUSD = Math.max(0.5, Math.round((monthlyUSD / 180) * 10) / 10);
  return {
    id: `db-${row.id}`,
    name: row.agent_name || "Unnamed Agent",
    role: `${dept} AI`,
    department: dept,
    category: CATEGORY_BY_DEPT[dept] ?? "Industry-Specific",
    tagline: "Live from catalog",
    description:
      row.base_system_prompt ||
      "Autonomous AI employee published from the admin portal.",
    tasksHandled: TASKS_BY_DEPT[dept] ?? ["Custom tasks"],
    successRate: 96,
    hourly: hourlyUSD,
    monthly: monthlyUSD,
    rating: 4.7,
    deployments: 0,
    accent: ACCENT_BY_DEPT[dept] ?? "cyan",
    icon: ICON_BY_DEPT[dept] ?? "code",
    skills: [dept, "Live"],
    audio: false,
    video: false,
    featured: true,
    custom: true,
    priceINR: inr,
  };
}
