/* ============================================================
   KRITAM OS — Multi-Category Marketplace Catalog
   12 executive categories · 20 Top Recommended Launch Agents
   ============================================================ */

export const CATEGORIES = [
  "Customer & Sales",
  "Marketing",
  "Business Operations",
  "Finance",
  "Human Resources",
  "Data & Research",
  "Software Development",
  "E-commerce",
  "Legal",
  "Creative",
  "Productivity",
  "Industry-Specific",
] as const;
export type Category = (typeof CATEGORIES)[number];

export interface Agent {
  id: string;
  name: string;
  role: string;
  department: "Tech" | "Sales" | "HR" | "Finance" | "Support" | "Marketing" | "Legal";
  /** executive marketplace category (one of 12) */
  category: Category;
  tagline: string;
  description: string;
  tasksHandled: string[];
  successRate: number;
  hourly: number;
  monthly: number;
  rating: number;
  deployments: number;
  accent: "cyan" | "purple";
  icon: string;
  skills: string[];
  /** supports real-time audio calling */
  audio?: boolean;
  /** supports video consultation */
  video?: boolean;
  /** top-20 recommended launch agent */
  featured?: boolean;
  /** true for admin-published custom agents */
  custom?: boolean;
  /** original INR pricing for custom agents */
  priceINR?: number;
}

export const agents: Agent[] = [
  /* ---- Customer & Sales ---- */
  {
    id: "support",
    name: "Aria",
    role: "Customer Support AI",
    department: "Support",
    category: "Customer & Sales",
    tagline: "24/7 omnichannel resolution specialist",
    description:
      "Handles tickets, live chat, email triage and escalations with empathetic, on-brand responses. Learns your KB in minutes.",
    tasksHandled: ["Ticket triage", "Live chat", "Refund processing", "Escalation routing"],
    successRate: 98.6,
    hourly: 4.2,
    monthly: 740,
    rating: 4.9,
    deployments: 1842,
    accent: "cyan",
    icon: "headset",
    skills: ["Sentiment", "Multi-lang", "Zendesk", "Intercom"],
    audio: true,
    video: true,
    featured: true,
  },
  {
    id: "sales",
    name: "Orion",
    role: "Sales AI",
    department: "Sales",
    category: "Customer & Sales",
    tagline: "Autonomous SDR that books qualified meetings",
    description:
      "Prospects, enriches leads, writes hyper-personalised sequences and books meetings directly into your calendar.",
    tasksHandled: ["Lead enrichment", "Cold outreach", "Meeting booking", "CRM updates"],
    successRate: 92.4,
    hourly: 6.8,
    monthly: 1180,
    rating: 4.8,
    deployments: 1305,
    accent: "purple",
    icon: "trending-up",
    skills: ["Outreach", "Apollo", "Salesforce", "Gong"],
    audio: true,
    featured: true,
  },

  /* ---- Marketing ---- */
  {
    id: "seo",
    name: "Nova",
    role: "SEO AI",
    department: "Marketing",
    category: "Marketing",
    tagline: "Rankings engineer + content strategist",
    description:
      "Performs technical audits, keyword research and ships optimised long-form content that compounds traffic.",
    tasksHandled: ["Technical audits", "Keyword research", "Content briefs", "Backlink scouting"],
    successRate: 95.1,
    hourly: 5.4,
    monthly: 960,
    rating: 4.7,
    deployments: 988,
    accent: "cyan",
    icon: "search",
    skills: ["Ahrefs", "Schema", "SERP", "GSC"],
    featured: true,
  },
  {
    id: "marketing-strategist",
    name: "Pulse",
    role: "Marketing Strategist AI",
    department: "Marketing",
    category: "Marketing",
    tagline: "Full-funnel campaign architect",
    description:
      "Designs multi-channel campaigns, allocates budget across paid/organic and tracks attribution against pipeline targets.",
    tasksHandled: ["Campaign design", "Budget allocation", "Attribution", "A/B testing"],
    successRate: 93.7,
    hourly: 6.1,
    monthly: 1080,
    rating: 4.7,
    deployments: 642,
    accent: "purple",
    icon: "trending-up",
    skills: ["HubSpot", "Meta Ads", "Google Ads", "Mixpanel"],
    featured: true,
  },
  {
    id: "social-media",
    name: "Reach",
    role: "Social Media AI",
    department: "Marketing",
    category: "Marketing",
    tagline: "Always-on community & content engine",
    description:
      "Schedules posts, engages followers, monitors brand mentions and surfaces viral opportunities in real time.",
    tasksHandled: ["Content scheduling", "Community engagement", "Brand monitoring", "Trend spotting"],
    successRate: 91.8,
    hourly: 4.8,
    monthly: 840,
    rating: 4.6,
    deployments: 871,
    accent: "cyan",
    icon: "search",
    skills: ["Buffer", "Hootsuite", "Canva", "Sprout"],
    featured: true,
  },

  /* ---- Business Operations ---- */
  {
    id: "ops",
    name: "Ops",
    role: "Business Operations AI",
    department: "Support",
    category: "Business Operations",
    tagline: "Keeps the engine room running",
    description:
      "Monitors workflows, automates approvals, tracks SLAs and flags bottlenecks before they impact delivery.",
    tasksHandled: ["Workflow automation", "SLA tracking", "Approval routing", "Bottleneck flags"],
    successRate: 96.4,
    hourly: 5.9,
    monthly: 1040,
    rating: 4.7,
    deployments: 534,
    accent: "purple",
    icon: "calendar",
    skills: ["Zapier", "Notion", "Jira", "Asana"],
    featured: true,
  },

  /* ---- Finance ---- */
  {
    id: "accountant",
    name: "Ledger",
    role: "Accountant AI",
    department: "Finance",
    category: "Finance",
    tagline: "Books, reconciles and reports autonomously",
    description:
      "Categorises transactions, reconciles accounts, drafts P&L statements and flags anomalies before month-end.",
    tasksHandled: ["Reconciliation", "P&L drafting", "Anomaly flags", "Tax prep"],
    successRate: 99.2,
    hourly: 7.1,
    monthly: 1240,
    rating: 4.9,
    deployments: 742,
    accent: "purple",
    icon: "calculator",
    skills: ["QuickBooks", "Xero", "GST", "Audit"],
    featured: true,
  },
  {
    id: "tax-auditor",
    name: "Audit",
    role: "Tax Auditor AI",
    department: "Finance",
    category: "Finance",
    tagline: "Compliance-first tax intelligence",
    description:
      "Scans transactions for GST/TDS compliance, prepares audit-ready statements and tracks filing deadlines.",
    tasksHandled: ["GST reconciliation", "TDS checks", "Filing prep", "Compliance flags"],
    successRate: 98.9,
    hourly: 7.8,
    monthly: 1380,
    rating: 4.8,
    deployments: 412,
    accent: "cyan",
    icon: "calculator",
    skills: ["ClearTax", "Tally", "GSTN", "IT Act"],
    featured: true,
  },

  /* ---- Human Resources ---- */
  {
    id: "recruiter",
    name: "Hire",
    role: "Recruiter AI",
    department: "HR",
    category: "Human Resources",
    tagline: "Sources, screens and schedules autonomously",
    description:
      "Writes job specs, sources candidates across 40+ boards, screens resumes and schedules interviews with video screening.",
    tasksHandled: ["Sourcing", "Resume screening", "Interview scheduling", "Candidate comms"],
    successRate: 94.6,
    hourly: 5.6,
    monthly: 980,
    rating: 4.7,
    deployments: 623,
    accent: "purple",
    icon: "calendar",
    skills: ["LinkedIn", "Greenhouse", "Lever", "Naukri"],
    video: true,
    featured: true,
  },
  {
    id: "training",
    name: "Tutor",
    role: "Training & L&D AI",
    department: "HR",
    category: "Human Resources",
    tagline: "Personalised onboarding & upskilling",
    description:
      "Builds personalised learning paths, delivers interactive video sessions and tracks skill mastery across your org.",
    tasksHandled: ["Learning paths", "Video sessions", "Skill assessments", "Progress tracking"],
    successRate: 95.3,
    hourly: 5.2,
    monthly: 920,
    rating: 4.8,
    deployments: 389,
    accent: "cyan",
    icon: "calendar",
    skills: ["Moodle", "Coursera", "Udemy", "SCORM"],
    audio: true,
    video: true,
    featured: true,
  },

  /* ---- Data & Research ---- */
  {
    id: "data-analyst",
    name: "Insight",
    role: "Data Analyst AI",
    department: "Tech",
    category: "Data & Research",
    tagline: "Turns raw data into boardroom narratives",
    description:
      "Queries your warehouse, builds dashboards, runs statistical analysis and delivers narrative reports with cited sources.",
    tasksHandled: ["SQL queries", "Dashboard builds", "Statistical analysis", "Narrative reports"],
    successRate: 96.8,
    hourly: 8.4,
    monthly: 1480,
    rating: 4.9,
    deployments: 567,
    accent: "purple",
    icon: "search",
    skills: ["SQL", "Python", "Tableau", "Looker"],
    featured: true,
  },

  /* ---- Software Development ---- */
  {
    id: "engineer",
    name: "Forge",
    role: "Software Engineer AI",
    department: "Tech",
    category: "Software Development",
    tagline: "Ships production code & PRs autonomously",
    description:
      "Writes, tests, reviews and deploys code. Opens PRs, fixes CI and maintains docs with guardrails you define.",
    tasksHandled: ["Feature builds", "PR reviews", "CI fixes", "Docs"],
    successRate: 94.3,
    hourly: 9.2,
    monthly: 1620,
    rating: 4.9,
    deployments: 1109,
    accent: "purple",
    icon: "code",
    skills: ["TypeScript", "Python", "Docker", "GitHub"],
    featured: true,
  },
  {
    id: "cybersecurity",
    name: "Shield",
    role: "Cybersecurity AI",
    department: "Tech",
    category: "Software Development",
    tagline: "Autonomous SOC + threat hunter",
    description:
      "Monitors traffic, hunts threats, auto-remediates alerts and maintains compliance with SOC 2 / ISO 27001 controls.",
    tasksHandled: ["Threat hunting", "Alert triage", "Patch management", "Compliance audits"],
    successRate: 97.5,
    hourly: 9.8,
    monthly: 1720,
    rating: 4.8,
    deployments: 398,
    accent: "cyan",
    icon: "code",
    skills: ["Splunk", "Wireshark", "OWASP", "NIST"],
    featured: true,
  },

  /* ---- E-commerce ---- */
  {
    id: "ecommerce-manager",
    name: "Commerce",
    role: "E-commerce Manager AI",
    department: "Sales",
    category: "E-commerce",
    tagline: "Optimises listings, pricing & funnels",
    description:
      "Manages product listings, dynamic pricing, cart abandonment flows and marketplace SEO across Shopify/Amazon.",
    tasksHandled: ["Listing management", "Dynamic pricing", "Funnel optimisation", "Marketplace SEO"],
    successRate: 94.1,
    hourly: 6.4,
    monthly: 1140,
    rating: 4.7,
    deployments: 712,
    accent: "purple",
    icon: "trending-up",
    skills: ["Shopify", "Amazon", "WooCommerce", "Klaviyo"],
    featured: true,
  },
  {
    id: "inventory",
    name: "Retail",
    role: "Inventory AI",
    department: "Finance",
    category: "E-commerce",
    tagline: "Stock-smart, never stock-out",
    description:
      "Forecasts demand, sets reorder points, tracks stock across warehouses and flags dead inventory automatically.",
    tasksHandled: ["Demand forecasting", "Reorder triggers", "Warehouse tracking", "Dead-stock flags"],
    successRate: 96.2,
    hourly: 5.8,
    monthly: 1020,
    rating: 4.7,
    deployments: 456,
    accent: "cyan",
    icon: "calculator",
    skills: ["Zoho Inventory", "TradeGecko", "SKULabs", "ERP"],
    featured: true,
  },

  /* ---- Legal ---- */
  {
    id: "legal-counsel",
    name: "Compliance",
    role: "Legal Counsel AI",
    department: "Legal",
    category: "Legal",
    tagline: "In-house counsel on demand",
    description:
      "Drafts NDAs/MSAs, reviews SLAs for red flags, tracks regulatory changes and escalates high-risk clauses.",
    tasksHandled: ["Contract drafting", "SLA review", "Regulatory tracking", "Risk escalation"],
    successRate: 97.1,
    hourly: 8.9,
    monthly: 1560,
    rating: 4.8,
    deployments: 341,
    accent: "cyan",
    icon: "scale",
    skills: ["DocuSign", "Ironclad", "GDPR", "DPDP Act"],
    featured: true,
  },
  {
    id: "contract",
    name: "Draft",
    role: "Contract AI",
    department: "Legal",
    category: "Legal",
    tagline: "Clause-level contract intelligence",
    description:
      "Reviews contracts clause-by-clause, compares against your playbooks and auto-redlines risky provisions.",
    tasksHandled: ["Clause review", "Playbook matching", "Auto-redline", "Obligation tracking"],
    successRate: 95.8,
    hourly: 8.2,
    monthly: 1440,
    rating: 4.7,
    deployments: 287,
    accent: "purple",
    icon: "scale",
    skills: ["CLM", "LawGeex", "Evisort", "Kira"],
    featured: true,
  },

  /* ---- Creative ---- */
  {
    id: "creative-designer",
    name: "Canvas",
    role: "Creative Designer AI",
    department: "Marketing",
    category: "Creative",
    tagline: "Brand-grade visuals at machine speed",
    description:
      "Generates on-brand marketing creative, social assets and pitch decks with consistent design systems.",
    tasksHandled: ["Asset generation", "Brand systems", "Pitch decks", "Social creatives"],
    successRate: 92.3,
    hourly: 5.6,
    monthly: 980,
    rating: 4.6,
    deployments: 689,
    accent: "cyan",
    icon: "search",
    skills: ["Figma", "Midjourney", "After Effects", "Canva"],
    featured: true,
  },

  /* ---- Productivity ---- */
  {
    id: "assistant",
    name: "Vega",
    role: "Executive Assistant AI",
    department: "HR",
    category: "Productivity",
    tagline: "Your chief of staff in the cloud",
    description:
      "Manages calendars, inboxes, travel and briefs you with a daily mission-critical summary before standup.",
    tasksHandled: ["Calendar", "Inbox triage", "Travel", "Daily briefs"],
    successRate: 97.8,
    hourly: 3.9,
    monthly: 680,
    rating: 4.8,
    deployments: 1567,
    accent: "cyan",
    icon: "calendar",
    skills: ["Gmail", "Notion", "Slack", "Calendly"],
    audio: true,
    featured: true,
  },

  /* ---- Industry-Specific ---- */
  {
    id: "healthcare",
    name: "Medic",
    role: "Healthcare Compliance AI",
    department: "Support",
    category: "Industry-Specific",
    tagline: "HIPAA-grade clinical admin",
    description:
      "Manages patient scheduling, insurance claims, clinical documentation and HIPAA compliance for healthcare providers.",
    tasksHandled: ["Patient scheduling", "Claims processing", "Clinical docs", "HIPAA audits"],
    successRate: 98.3,
    hourly: 8.6,
    monthly: 1520,
    rating: 4.9,
    deployments: 234,
    accent: "purple",
    icon: "headset",
    skills: ["Epic", "Cerner", "HL7", "HIPAA"],
    video: true,
    featured: true,
  },
  {
    id: "research",
    name: "Scholar",
    role: "Research Analyst AI",
    department: "Tech",
    category: "Industry-Specific",
    tagline: "Deep-research at expert depth",
    description:
      "Conducts literature reviews, synthesises findings across 200M+ papers and produces cited research briefs.",
    tasksHandled: ["Literature review", "Source synthesis", "Citation graphs", "Research briefs"],
    successRate: 95.6,
    hourly: 7.4,
    monthly: 1300,
    rating: 4.8,
    deployments: 178,
    accent: "cyan",
    icon: "search",
    skills: ["Semantic Scholar", "arXiv", "PubMed", "Citation"],
    featured: true,
  },
];

export interface SwarmNode {
  id: string;
  label: string;
  department: "Tech" | "Sales" | "HR" | "Finance" | "Support";
  x: number;
  y: number;
  tasks: string[];
  accent: "cyan" | "purple";
}

export const swarmNodes: SwarmNode[] = [
  { id: "tech", label: "Engineering", department: "Tech", x: 50, y: 18, accent: "purple", tasks: ["Build features", "Fix CI", "Ship PRs", "Maintain docs"] },
  { id: "sales", label: "Sales", department: "Sales", x: 82, y: 42, accent: "cyan", tasks: ["Prospect leads", "Book demos", "Update CRM", "Sequence outreach"] },
  { id: "support", label: "Support", department: "Support", x: 50, y: 78, accent: "cyan", tasks: ["Resolve tickets", "Live chat", "Route escalations", "Tag sentiment"] },
  { id: "hr", label: "People Ops", department: "HR", x: 18, y: 42, accent: "purple", tasks: ["Onboard hires", "Schedule reviews", "Draft policies", "Triage inbox"] },
  { id: "finance", label: "Finance", department: "Finance", x: 50, y: 50, accent: "purple", tasks: ["Reconcile books", "Draft P&L", "Flag anomalies", "Tax prep"] },
];

export const telemetryUsage = [
  { day: "Mon", credits: 4200, tokens: 880, hours: 142 },
  { day: "Tue", credits: 5100, tokens: 940, hours: 168 },
  { day: "Wed", credits: 4800, tokens: 1020, hours: 155 },
  { day: "Thu", credits: 6200, tokens: 1180, hours: 198 },
  { day: "Fri", credits: 7400, tokens: 1340, hours: 224 },
  { day: "Sat", credits: 4900, tokens: 760, hours: 132 },
  { day: "Sun", credits: 3800, tokens: 620, hours: 108 },
];

export const departmentLoad = [
  { name: "Tech", value: 38, fill: "url(#barPurple)" },
  { name: "Sales", value: 27, fill: "url(#barCyan)" },
  { name: "Support", value: 44, fill: "url(#barCyan)" },
  { name: "Finance", value: 18, fill: "url(#barPurple)" },
  { name: "HR", value: 22, fill: "url(#barPurple)" },
];

export const tokenSplit = [
  { name: "LLM推理", value: 48, color: "#00F2FE" },
  { name: "向量检索", value: 22, color: "#7F00FF" },
  { name: "工具调用", value: 18, color: "#b14bff" },
  { name: "审计日志", value: 12, color: "#3a7a85" },
];

export const auditLogs = [
  { id: "LOG-9F21", agent: "Forge", action: "Merged PR #2841 in kritam/core", level: "info", time: "2m ago" },
  { id: "LOG-9F20", agent: "Aria", action: "Auto-resolved ticket #55321 (refund)", level: "success", time: "6m ago" },
  { id: "LOG-9F1F", agent: "Orion", action: "Booked meeting with Globex Corp", level: "success", time: "14m ago" },
  { id: "LOG-9F1E", agent: "Ledger", action: "Flagged anomaly: duplicate invoice #INV-2210", level: "warn", time: "31m ago" },
  { id: "LOG-9F1D", agent: "Nova", action: "Published SEO brief /cluster/edge-compute", level: "info", time: "52m ago" },
  { id: "LOG-9F1C", agent: "Vega", action: "Rescheduled standup → 09:30 IST", level: "info", time: "1h ago" },
  { id: "LOG-9F1B", agent: "Forge", action: "Permission denied: deploy to prod", level: "error", time: "1h ago" },
  { id: "LOG-9F1A", agent: "Aria", action: "Escalated ticket #55298 to human", level: "warn", time: "2h ago" },
];

export const teamRoles = [
  { name: "Aarav Mehta", email: "aarav@kritam.space", role: "Owner", agents: 6, status: "active" },
  { name: "Diya Sharma", email: "diya@kritam.space", role: "Admin", agents: 6, status: "active" },
  { name: "Kabir Nair", email: "kabir@kritam.space", role: "Operator", agents: 4, status: "active" },
  { name: "Meera Iyer", email: "meera@kritam.space", role: "Analyst", agents: 2, status: "invited" },
  { name: "Rohan Das", email: "rohan@kritam.space", role: "Viewer", agents: 0, status: "suspended" },
];

export const apiTokens = [
  { id: "tok_live_8f2a", label: "Production Gateway", scope: "agents:rw, kb:rw", created: "2025-01-12", lastUsed: "2m ago" },
  { id: "tok_live_4c91", label: "Analytics Pipeline", scope: "telemetry:ro", created: "2025-02-03", lastUsed: "1h ago" },
  { id: "tok_test_1d77", label: "Staging Sandbox", scope: "agents:rw", created: "2025-03-21", lastUsed: "3d ago" },
];

/* ---------- Admin: platform tenants ---------- */
export interface Tenant {
  id: string;
  company: string;
  contact: string;
  plan: "Starter" | "Growth" | "Scale" | "Enterprise";
  agents: number;
  mrr: number;
  status: "active" | "suspended" | "trial";
  region: string;
}

export const tenants: Tenant[] = [
  { id: "t-001", company: "Globex Corp", contact: "ops@globex.io", plan: "Enterprise", agents: 12, mrr: 8400, status: "active", region: "APAC" },
  { id: "t-002", company: "Initech LLP", contact: "it@initech.com", plan: "Scale", agents: 8, mrr: 4200, status: "active", region: "EU" },
  { id: "t-003", company: "Umbrella Labs", contact: "dev@umbrella.ai", plan: "Growth", agents: 5, mrr: 1980, status: "active", region: "US" },
  { id: "t-004", company: "Stark Industries", contact: "pepper@stark.co", plan: "Enterprise", agents: 16, mrr: 11200, status: "active", region: "US" },
  { id: "t-005", company: "Wayne Holdings", contact: "lucius@wayne.gov", plan: "Scale", agents: 6, mrr: 3600, status: "suspended", region: "EU" },
  { id: "t-006", company: "Hooli Inc", contact: "ceo@hooli.xyz", plan: "Growth", agents: 4, mrr: 1480, status: "trial", region: "APAC" },
  { id: "t-007", company: "Pied Piper", contact: "richard@piedpiper.com", plan: "Starter", agents: 2, mrr: 640, status: "active", region: "US" },
  { id: "t-008", company: "Vandelay Imports", contact: "art@vandelay.com", plan: "Scale", agents: 7, mrr: 3900, status: "active", region: "EU" },
];

/* ---------- Admin: platform-wide metrics ---------- */
export const platformMrr = [
  { month: "Jan", mrr: 142000 },
  { month: "Feb", mrr: 168000 },
  { month: "Mar", mrr: 191000 },
  { month: "Apr", mrr: 224000 },
  { month: "May", mrr: 268000 },
  { month: "Jun", mrr: 312000 },
  { month: "Jul", mrr: 358000 },
];

export const platformLoad = [
  { t: "00:00", cpu: 38, mem: 52, net: 24 },
  { t: "04:00", cpu: 28, mem: 44, net: 18 },
  { t: "08:00", cpu: 64, mem: 71, net: 58 },
  { t: "12:00", cpu: 78, mem: 82, net: 66 },
  { t: "16:00", cpu: 72, mem: 79, net: 60 },
  { t: "20:00", cpu: 55, mem: 64, net: 42 },
  { t: "now", cpu: 61, mem: 68, net: 48 },
];
