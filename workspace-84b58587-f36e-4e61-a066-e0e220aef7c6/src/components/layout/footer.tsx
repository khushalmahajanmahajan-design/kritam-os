"use client";

import { Github, Twitter, Linkedin, Activity, Lock } from "lucide-react";
import { useKritamStore, type PageId } from "@/lib/store";
import { KritamLogo } from "@/components/kritam-logo";

const LINKS: { title: string; items: { label: string; page?: PageId }[] }[] = [
  {
    title: "Platform",
    items: [
      { label: "Engine", page: "home" },
      { label: "Marketplace", page: "marketplace" },
      { label: "Workspace", page: "dashboard" },
      { label: "Enterprise", page: "enterprise" },
    ],
  },
  {
    title: "Company",
    items: [{ label: "About" }, { label: "Careers" }, { label: "Press" }, { label: "Contact" }],
  },
  {
    title: "Resources",
    items: [{ label: "Docs" }, { label: "Changelog" }, { label: "Status" }, { label: "Security" }],
  },
  {
    title: "Legal",
    items: [{ label: "Privacy" }, { label: "Terms" }, { label: "SOC 2" }, { label: "DPA" }],
  },
];

export function Footer() {
  const { setPage, openAdminGate } = useKritamStore();

  return (
    <footer className="mt-auto border-t border-border/60 bg-background/60 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          {/* brand + status */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <KritamLogo size={32} />
              <span className="text-lg font-bold">
                <span className="gradient-text">KRITAM</span>
                <span className="ml-1.5 text-foreground">OS</span>
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              The autonomous AI workforce operating system. Hire, deploy and orchestrate AI employees at scale.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <Activity className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-300">All Agents Operational</span>
            </div>
          </div>

          {/* link columns */}
          {LINKS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {col.title}
              </h4>
              <ul className="mt-3 space-y-2">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() => item.page && setPage(item.page)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Kritam Space. All systems reserved.
            </p>
            <div className="flex items-center gap-3">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <button
                  key={i}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="social"
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => openAdminGate()}
            className="group inline-flex items-center gap-1.5 rounded-md px-1 py-0.5 font-mono text-[11px] tracking-wider text-muted-foreground/70 transition-colors hover:text-[#00F2FE]"
            aria-label="Open Kritam Space Admin Portal"
            title="Open Kritam Space Admin Portal"
          >
            <span className="relative">
              Kritam Space Admin Portal
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#00F2FE] transition-all duration-300 group-hover:w-full" />
            </span>
            <Lock className="h-3 w-3 opacity-50 transition-opacity group-hover:opacity-100" />
          </button>
        </div>
      </div>
    </footer>
  );
}
