import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Agent } from "@/lib/mock-data";

export type PageId =
  | "home"
  | "auth"
  | "marketplace"
  | "dashboard"
  | "enterprise"
  | "admin";

export type KnowledgeStatus =
  | "queued"
  | "ingesting"
  | "vectorising"
  | "indexed";

export interface KnowledgeFile {
  id: string;
  name: string;
  type: "pdf" | "csv" | "url";
  size: string;
  status: KnowledgeStatus;
  progress: number;
  chunks: number;
  addedAt: number;
}

export interface AuthForm {
  email: string;
  name: string;
  org: string;
}

/** New agent draft published from the admin deployer */
export interface NewAgentDraft {
  name: string;
  role: string;
  department: Agent["department"];
  pricingINR: number;
  systemPrompt: string;
}

interface KritamState {
  page: PageId;
  setPage: (page: PageId) => void;

  deployedAgentIds: string[];
  deployAgent: (id: string) => void;

  dashboardSection: string;
  setDashboardSection: (s: string) => void;

  knowledgeFiles: KnowledgeFile[];
  addKnowledgeFiles: (files: KnowledgeFile[]) => void;
  updateKnowledgeFile: (id: string, patch: Partial<KnowledgeFile>) => void;
  clearKnowledgeFiles: () => void;

  pricingOverrides: Record<string, { hourly: number; monthly: number }>;
  setPricing: (id: string, hourly: number, monthly: number) => void;
  resetPricing: (id: string) => void;

  authForm: AuthForm;
  setAuthForm: (patch: Partial<AuthForm>) => void;

  /* -------- Admin security gate (session-only, NOT persisted) -------- */
  adminUnlocked: boolean;
  gateOpen: boolean;
  openAdminGate: () => void;
  closeAdminGate: () => void;
  unlockAdmin: () => void;
  lockAdmin: () => void;

  /* -------- Custom agents published from admin (persisted) -------- */
  customAgents: Agent[];
  addCustomAgent: (draft: NewAgentDraft) => Agent;
}

export const useKritamStore = create<KritamState>()(
  persist(
    (set) => ({
      page: "home",
      setPage: (page) => {
        set({ page });
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      },

      deployedAgentIds: ["support", "seo"],
      deployAgent: (id) =>
        set((s) =>
          s.deployedAgentIds.includes(id)
            ? s
            : { deployedAgentIds: [...s.deployedAgentIds, id] }
        ),

      dashboardSection: "overview",
      setDashboardSection: (dashboardSection) => set({ dashboardSection }),

      knowledgeFiles: [],
      addKnowledgeFiles: (files) =>
        set((s) => ({ knowledgeFiles: [...files, ...s.knowledgeFiles] })),
      updateKnowledgeFile: (id, patch) =>
        set((s) => ({
          knowledgeFiles: s.knowledgeFiles.map((f) =>
            f.id === id ? { ...f, ...patch } : f
          ),
        })),
      clearKnowledgeFiles: () => set({ knowledgeFiles: [] }),

      pricingOverrides: {},
      setPricing: (id, hourly, monthly) =>
        set((s) => ({
          pricingOverrides: {
            ...s.pricingOverrides,
            [id]: { hourly, monthly },
          },
        })),
      resetPricing: (id) =>
        set((s) => {
          const next = { ...s.pricingOverrides };
          delete next[id];
          return { pricingOverrides: next };
        }),

      authForm: { email: "", name: "", org: "" },
      setAuthForm: (patch) =>
        set((s) => ({ authForm: { ...s.authForm, ...patch } })),

      adminUnlocked: false,
      gateOpen: false,
      openAdminGate: () => set({ gateOpen: true }),
      closeAdminGate: () => set({ gateOpen: false }),
      unlockAdmin: () => set({ adminUnlocked: true, gateOpen: false }),
      lockAdmin: () => set({ adminUnlocked: false, page: "home" }),

      customAgents: [],
      addCustomAgent: (draft) => {
        // convert INR pricing -> USD for the internal Agent model
        const monthlyUSD = Math.max(1, Math.round(draft.pricingINR / 83));
        const hourlyUSD = Math.max(0.5, Math.round((monthlyUSD / 180) * 10) / 10);
        const iconFor: Record<Agent["department"], string> = {
          Tech: "code",
          Sales: "trending-up",
          Marketing: "search",
          HR: "calendar",
          Finance: "calculator",
          Support: "headset",
          Legal: "scale",
        };
        const accentFor: Record<Agent["department"], "cyan" | "purple"> = {
          Tech: "purple",
          Sales: "cyan",
          Marketing: "cyan",
          HR: "purple",
          Finance: "purple",
          Support: "cyan",
          Legal: "cyan",
        };
        const tasksByDept: Record<Agent["department"], string[]> = {
          Tech: ["Build features", "Review PRs", "Fix CI", "Maintain docs"],
          Sales: ["Prospect leads", "Book demos", "Update CRM", "Outreach"],
          Marketing: ["SEO briefs", "Content", "Campaigns", "Analytics"],
          HR: ["Onboard hires", "Schedule reviews", "Draft policies", "Triage"],
          Finance: ["Reconcile books", "Draft P&L", "Flag anomalies", "Tax prep"],
          Support: ["Resolve tickets", "Live chat", "Escalations", "Sentiment"],
          Legal: ["Draft contracts", "Review SLAs", "Compliance", "Risk audit"],
        };
        // map department → executive marketplace category
        const categoryFor: Record<Agent["department"], Agent["category"]> = {
          Tech: "Software Development",
          Sales: "Customer & Sales",
          Marketing: "Marketing",
          HR: "Human Resources",
          Finance: "Finance",
          Support: "Business Operations",
          Legal: "Legal",
        };
        const agent: Agent = {
          id: `custom-${Date.now()}`,
          name: draft.name,
          role: `${draft.department} AI`,
          department: draft.department,
          category: categoryFor[draft.department],
          tagline: "Custom-deployed AI employee",
          description: draft.systemPrompt,
          tasksHandled: tasksByDept[draft.department],
          successRate: 96,
          hourly: hourlyUSD,
          monthly: monthlyUSD,
          rating: 4.7,
          deployments: 0,
          accent: accentFor[draft.department],
          icon: iconFor[draft.department],
          skills: [draft.department, "Custom"],
          audio: false,
          video: false,
          featured: true,
          custom: true,
          priceINR: draft.pricingINR,
        };
        set((s) => ({ customAgents: [agent, ...s.customAgents] }));
        return agent;
      },
    }),
    {
      name: "kritam-os-store",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        deployedAgentIds: state.deployedAgentIds,
        pricingOverrides: state.pricingOverrides,
        authForm: state.authForm,
        knowledgeFiles: state.knowledgeFiles.filter(
          (f) => f.status === "indexed"
        ),
        customAgents: state.customAgents,
        // NOTE: adminUnlocked & gateOpen are intentionally NOT persisted —
        // admin access must be re-verified every session.
      }),
    }
  )
);

export function resolvePrice(
  base: { hourly: number; monthly: number },
  override?: { hourly: number; monthly: number }
) {
  return override ?? base;
}
