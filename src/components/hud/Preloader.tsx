"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const BOOT_LOG = [
  "mounting gargantua.glsl",
  "calibrating accretion disk",
  "spawning agents × 3  (plan · build · review)",
  "connecting MCP servers",
  "loading resume.tex",
  "ready",
];

/** Full-screen loader with a percentage counter, inspired by HUD boot screens. */
export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);
  const ready = useRef(false);

  useEffect(() => {
    const onReady = () => {
      ready.current = true;
    };
    window.addEventListener("scene-ready", onReady);
    // Never block the page if WebGL is unavailable.
    const fallback = window.setTimeout(onReady, 4500);

    let raf = 0;
    let value = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const target = ready.current ? 100 : Math.min(88, (elapsed / 1600) * 88);
      value += (target - value) * (ready.current ? 0.12 : 0.08);
      if (ready.current && value > 99.5 && elapsed > 1200) value = 100;
      setProgress(value);
      if (value >= 100) {
        setDone(true);
        window.setTimeout(() => setGone(true), 900);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(fallback);
      window.removeEventListener("scene-ready", onReady);
    };
  }, []);

  if (gone) return null;

  const pct = Math.floor(progress);
  const lines = BOOT_LOG.slice(0, Math.max(1, Math.ceil((pct / 100) * BOOT_LOG.length)));

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Loading ${pct}%`}
      className={cn(
        "fixed inset-0 z-[100] bg-black transition-opacity duration-700 ease-out",
        done && "pointer-events-none opacity-0",
      )}
    >
      <div className="absolute inset-x-0 top-0 h-0.5 bg-white/10">
        <span className="block h-full bg-white transition-[width] duration-100" style={{ width: `${progress}%` }} />
      </div>
      <div className="hud-label absolute left-6 top-6 text-white/70 sm:left-10 sm:top-8">Sajib Saha · Portfolio</div>
      <div className="hud-label absolute right-6 top-6 hidden text-white/40 sm:right-10 sm:top-8 sm:block">
        Dhaka · 23.81° N 90.41° E
      </div>
      <ul className="absolute left-6 top-24 space-y-1.5 font-mono text-[11px] text-white/50 sm:left-10 sm:top-28 sm:text-xs">
        {lines.map((l, i) => (
          <li key={l} className={cn(i === lines.length - 1 && "text-brand")}>
            <span className="text-white/30">&gt;</span> {l}
          </li>
        ))}
      </ul>
      <div className="absolute bottom-4 left-5 select-none text-[26vw] font-bold leading-none tracking-tighter text-white/90 tabular-nums sm:left-10 sm:text-[18vw]">
        {String(pct).padStart(3, "0")}
        <span className="text-[0.4em] text-white/40">%</span>
      </div>
    </div>
  );
}
