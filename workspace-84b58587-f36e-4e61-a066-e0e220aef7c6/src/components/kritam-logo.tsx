"use client";

import { motion } from "framer-motion";

interface KritamLogoProps {
  size?: number;
  className?: string;
  withGlow?: boolean;
}

/**
 * KRITAM OS geometric 3D logo — layered hexagonal core with orbiting
 * nodes and a soft neon pulse. Pure SVG + Framer Motion.
 */
export function KritamLogo({ size = 36, className, withGlow = true }: KritamLogoProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className ?? ""}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        <defs>
          <linearGradient id="kritam-cyan-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00F2FE" />
            <stop offset="1" stopColor="#7F00FF" />
          </linearGradient>
          <linearGradient id="kritam-purple-grad" x1="48" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7F00FF" />
            <stop offset="1" stopColor="#00F2FE" />
          </linearGradient>
          <radialGradient id="kritam-core" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="0.5" stopColor="#00F2FE" stopOpacity="0.7" />
            <stop offset="1" stopColor="#7F00FF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* outer rotating hex ring */}
        <motion.g
          style={{ transformOrigin: "24px 24px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        >
          <polygon
            points="24,3 41.5,13 41.5,35 24,45 6.5,35 6.5,13"
            stroke="url(#kritam-cyan-grad)"
            strokeWidth="1.2"
            strokeOpacity="0.55"
            fill="none"
          />
        </motion.g>

        {/* inner counter-rotating hex */}
        <motion.g
          style={{ transformOrigin: "24px 24px" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        >
          <polygon
            points="24,9 36.5,16 36.5,32 24,39 11.5,32 11.5,16"
            stroke="url(#kritam-purple-grad)"
            strokeWidth="1"
            strokeOpacity="0.7"
            fill="none"
          />
        </motion.g>

        {/* 3D core — layered triangles */}
        <motion.g
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "24px 24px" }}
        >
          <polygon points="24,14 33,29 15,29" fill="url(#kritam-cyan-grad)" fillOpacity="0.9" />
          <polygon points="24,14 33,29 24,24" fill="#ffffff" fillOpacity="0.25" />
          <polygon points="24,24 33,29 15,29" fill="#000000" fillOpacity="0.25" />
        </motion.g>

        {/* glowing core dot */}
        <motion.circle
          cx="24"
          cy="24"
          r="3.4"
          fill="url(#kritam-core)"
          animate={{ opacity: [0.85, 1, 0.85], r: [3.2, 4, 3.2] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* orbiting nodes */}
        <motion.g
          style={{ transformOrigin: "24px 24px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="24" cy="6" r="1.6" fill="#00F2FE" />
          <circle cx="42" cy="24" r="1.2" fill="#7F00FF" />
          <circle cx="24" cy="42" r="1.6" fill="#00F2FE" />
          <circle cx="6" cy="24" r="1.2" fill="#7F00FF" />
        </motion.g>
      </svg>

      {withGlow && (
        <div
          className="absolute inset-0 z-0 rounded-full blur-xl"
          style={{
            background:
              "radial-gradient(circle, rgba(0,242,254,0.35) 0%, rgba(127,0,255,0.18) 45%, transparent 70%)",
          }}
        />
      )}
    </div>
  );
}

export function KritamWordmark({ className }: { className?: string }) {
  return (
    <span className={`font-bold tracking-tight ${className ?? ""}`}>
      <span className="gradient-text">KRITAM</span>
      <span className="ml-1.5 text-foreground">OS</span>
    </span>
  );
}
