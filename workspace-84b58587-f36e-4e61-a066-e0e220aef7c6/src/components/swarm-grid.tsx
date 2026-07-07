"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Workflow } from "lucide-react";
import { swarmNodes } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const PAIRS: [string, string][] = [
  ["tech", "sales"],
  ["sales", "finance"],
  ["finance", "support"],
  ["support", "hr"],
  ["hr", "tech"],
  ["tech", "finance"],
  ["sales", "support"],
];

export function SwarmGrid() {
  const [active, setActive] = useState<string | null>(null);

  const activeNode = swarmNodes.find((n) => n.id === active);

  return (
    <div className="relative w-full">
      <div className="relative aspect-square w-full max-w-2xl mx-auto">
        {/* connection layer */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="swarm-line" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#00F2FE" stopOpacity="0.6" />
              <stop offset="1" stopColor="#7F00FF" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="swarm-line-active" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#00F2FE" stopOpacity="1" />
              <stop offset="1" stopColor="#7F00FF" stopOpacity="1" />
            </linearGradient>
          </defs>
          {PAIRS.map(([a, b], i) => {
            const na = swarmNodes.find((n) => n.id === a)!;
            const nb = swarmNodes.find((n) => n.id === b)!;
            const isActive =
              active === a || active === b;
            return (
              <g key={i}>
                <line
                  x1={na.x}
                  y1={na.y}
                  x2={nb.x}
                  y2={nb.y}
                  stroke={isActive ? "url(#swarm-line-active)" : "url(#swarm-line)"}
                  strokeWidth={isActive ? 0.5 : 0.25}
                  vectorEffect="non-scaling-stroke"
                />
                {isActive && (
                  <motion.circle
                    r="0.9"
                    fill="#00F2FE"
                    initial={{ offsetDistance: "0%" }}
                    animate={{ offsetDistance: ["0%", "100%"] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                    style={{
                      offsetPath: `path("M ${na.x} ${na.y} L ${nb.x} ${nb.y}")`,
                    }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* nodes */}
        {swarmNodes.map((node) => {
          const isActive = active === node.id;
          const isCenter = node.id === "finance";
          return (
            <button
              key={node.id}
              onClick={() => setActive(isActive ? null : node.id)}
              onMouseEnter={() => setActive(node.id)}
              className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
                className={cn(
                  "relative flex items-center justify-center rounded-2xl border transition-all",
                  isCenter ? "h-24 w-24 sm:h-28 sm:w-28" : "h-20 w-20 sm:h-24 sm:w-24",
                  isActive
                    ? node.accent === "cyan"
                      ? "border-[#00F2FE]/60 box-glow-cyan bg-[#00F2FE]/10"
                      : "border-[#7F00FF]/60 box-glow-purple bg-[#7F00FF]/10"
                    : "border-border/60 bg-card/80 backdrop-blur-sm hover:border-border"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="node-glow"
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background:
                        node.accent === "cyan"
                          ? "radial-gradient(circle, rgba(0,242,254,0.25), transparent 70%)"
                          : "radial-gradient(circle, rgba(127,0,255,0.25), transparent 70%)",
                    }}
                  />
                )}
                <div className="relative text-center">
                  <Workflow
                    className={cn(
                      "mx-auto h-5 w-5 mb-1 transition-colors",
                      isActive
                        ? node.accent === "cyan"
                          ? "text-[#00F2FE]"
                          : "text-[#b14bff]"
                        : "text-muted-foreground"
                    )}
                  />
                  <div className="text-[10px] sm:text-xs font-semibold leading-tight">
                    {node.label}
                  </div>
                </div>
              </motion.div>
            </button>
          );
        })}

        {/* center label */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">
            KRITAM Core
          </div>
        </div>
      </div>

      {/* active pipeline detail */}
      <div className="mt-6 min-h-[120px]">
        <AnimatePresence mode="wait">
          {activeNode ? (
            <motion.div
              key={activeNode.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    {activeNode.department} Department
                  </div>
                  <h4 className="text-base font-semibold">{activeNode.label} Pipeline</h4>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[10px] font-medium",
                    activeNode.accent === "cyan"
                      ? "bg-[#00F2FE]/10 text-[#00F2FE]"
                      : "bg-[#7F00FF]/10 text-[#b14bff]"
                  )}
                >
                  Live
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {activeNode.tasks.map((task, i) => (
                  <div
                    key={task}
                    className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/40 px-2.5 py-1.5 text-xs"
                  >
                    <span className="text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                    <span>{task}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-dashed border-border/60 bg-card/30 p-4 text-center text-sm text-muted-foreground"
            >
              Click or hover any department to reveal its operational pipeline.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
