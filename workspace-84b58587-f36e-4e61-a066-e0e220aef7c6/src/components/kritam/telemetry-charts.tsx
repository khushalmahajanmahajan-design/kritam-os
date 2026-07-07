"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { telemetryUsage, departmentLoad, tokenSplit, platformMrr, platformLoad } from "@/lib/mock-data";

const tooltipStyle = {
  backgroundColor: "rgba(15,15,25,0.95)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "0.5rem",
  fontSize: "12px",
  color: "#fff",
};

export function UsageChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={telemetryUsage} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="gCyan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00F2FE" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#00F2FE" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gPurple" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7F00FF" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#7F00FF" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area type="monotone" dataKey="credits" stroke="#00F2FE" strokeWidth={2} fill="url(#gCyan)" />
        <Area type="monotone" dataKey="tokens" stroke="#b14bff" strokeWidth={2} fill="url(#gPurple)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function DepartmentChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={departmentLoad} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="barCyan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00F2FE" />
            <stop offset="100%" stopColor="#00F2FE" stopOpacity={0.3} />
          </linearGradient>
          <linearGradient id="barPurple" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7F00FF" />
            <stop offset="100%" stopColor="#7F00FF" stopOpacity={0.3} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={42} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TokenPie() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={tokenSplit}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={52}
          outerRadius={84}
          paddingAngle={3}
          stroke="none"
        >
          {tokenSplit.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
      </PieChart>
    </ResponsiveContainer>
  );
}

/* ---------- Admin charts ---------- */
export function MrrChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={platformMrr} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="gAdminMrr" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00F2FE" stopOpacity={0.55} />
            <stop offset="100%" stopColor="#00F2FE" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis
          stroke="rgba(255,255,255,0.4)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `$${v / 1000}k`}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(v: number) => [`$${v.toLocaleString()}`, "MRR"]}
        />
        <Area type="monotone" dataKey="mrr" stroke="#00F2FE" strokeWidth={2.5} fill="url(#gAdminMrr)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function LoadChart({ data }: { data: typeof platformLoad }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -24, bottom: 0 }}>
        <defs>
          <linearGradient id="gCpu" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00F2FE" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#00F2FE" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gMem" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7F00FF" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#7F00FF" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="t" stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} axisLine={false} />
        <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} axisLine={false} unit="%" />
        <Tooltip contentStyle={tooltipStyle} unit="%" />
        <Area type="monotone" dataKey="cpu" stroke="#00F2FE" strokeWidth={2} fill="url(#gCpu)" />
        <Area type="monotone" dataKey="mem" stroke="#b14bff" strokeWidth={2} fill="url(#gMem)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
