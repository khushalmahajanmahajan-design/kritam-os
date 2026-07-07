"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Particle network "digital globe" rendered on a 2D canvas.
 * Particles orbit on a projected sphere; nearby ones connect with
 * gradient lines. Reacts subtly to scroll + pointer. Zero deps.
 *
 * SSR-safe: all canvas/window access happens inside useEffect, and a
 * loader fallback is shown until the canvas has mounted + sized.
 */
export function ParticleGlobe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const pointer = useRef({ x: 0, y: 0, active: false });
  const scroll = useRef(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // guard: cancel on non-browser / no 2d context
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const N = 120;
    // distribute particles on a sphere (fibonacci)
    const pts: { x: number; y: number; z: number }[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      pts.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let rotY = 0;
    let rotX = 0.3;

    const onScroll = () => {
      scroll.current = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.current.x = (e.clientX - rect.left) / rect.width - 0.5;
      pointer.current.y = (e.clientY - rect.top) / rect.height - 0.5;
      pointer.current.active = true;
    };
    const onLeave = () => {
      pointer.current.active = false;
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.42;

      // gentle auto rotation + scroll influence + pointer drag
      rotY += 0.0025 + scroll.current * 0.00001;
      const targetX = 0.3 + (pointer.current.active ? pointer.current.y * 1.2 : 0) + scroll.current * 0.0008;
      rotX += (targetX - rotX) * 0.04;
      const targetY = rotY + (pointer.current.active ? pointer.current.x * 1.6 : 0);

      const cosY = Math.cos(targetY);
      const sinY = Math.sin(targetY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const projected = pts.map((p) => {
        // rotate around Y
        let x = p.x * cosY - p.z * sinY;
        let z = p.x * sinY + p.z * cosY;
        let y = p.y;
        // rotate around X
        const y2 = y * cosX - z * sinX;
        const z2 = y * sinX + z * cosX;
        y = y2;
        z = z2;
        const persp = 1 / (1.8 - z * 0.6);
        return {
          sx: cx + x * radius * persp,
          sy: cy + y * radius * persp,
          z,
          persp,
        };
      });

      // connections
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const a = projected[i];
          const b = projected[j];
          const dx = a.sx - b.sx;
          const dy = a.sy - b.sy;
          const d2 = dx * dx + dy * dy;
          const max = 64;
          if (d2 < max * max) {
            const alpha = (1 - Math.sqrt(d2) / max) * 0.5;
            const front = (a.z + b.z) / 2 + 0.5;
            const grad = ctx.createLinearGradient(a.sx, a.sy, b.sx, b.sy);
            grad.addColorStop(0, `rgba(0,242,254,${alpha * front})`);
            grad.addColorStop(1, `rgba(127,0,255,${alpha * front})`);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.sx, a.sy);
            ctx.lineTo(b.sx, b.sy);
            ctx.stroke();
          }
        }
      }

      // particles
      for (const p of projected) {
        const front = p.z + 0.5;
        const size = Math.max(0.5, p.persp * 2.4 * front);
        const glow = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, size * 3);
        const isCyan = p.z > 0;
        glow.addColorStop(0, isCyan ? "rgba(0,242,254,0.9)" : "rgba(127,0,255,0.7)");
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, size * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isCyan ? "rgba(180,250,255,0.95)" : "rgba(200,170,255,0.85)";
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, size, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(render);
    };
    let firstFrame = true;
    const renderLoop = () => {
      if (firstFrame) {
        firstFrame = false;
        setReady(true);
      }
      render();
    };
    rafRef.current = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className={cn("relative", className)}>
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full border-2 border-[#00F2FE]/20" />
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#00F2FE] border-r-[#7F00FF]" />
          </div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        aria-hidden
      />
    </div>
  );
}
