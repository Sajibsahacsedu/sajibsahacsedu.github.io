"use client";

import { useEffect, useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { profile, stations } from "@/lib/resume";
import { onProgress, scrollToId, useActiveStation } from "@/lib/scroll-store";
import { cn } from "@/lib/utils";

/**
 * Fixed telemetry HUD:
 * - Right-edge station rail with tooltips (desktop)
 * - Bottom-right SLX-style scroll progress counter & bar + social links
 * - Bottom-center scroll cue on the first station
 */
export function HudOverlay() {
  const activeIndex = useActiveStation();
  const [showScrollCue, setShowScrollCue] = useState(true);
  const pctRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    return onProgress((p) => {
      const pct = Math.round(p * 100);
      if (pctRef.current) pctRef.current.textContent = String(pct).padStart(3, "0");
      if (barRef.current) barRef.current.style.width = `${pct}%`;
      setShowScrollCue(p < 0.04);
    });
  }, []);

  const active = stations[activeIndex] ?? stations[0];

  return (
    <>
      {/* Right-edge cosmic station rail */}
      <aside
        aria-label="Section progress rail"
        className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-2.5 sm:right-8 lg:flex"
      >
        {stations.map((s, idx) => {
          const isActive = idx === activeIndex;
          return (
            <Tooltip key={s.id}>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    onClick={() => scrollToId(s.id)}
                    aria-label={`Jump to ${s.label} (${s.body})`}
                    aria-current={isActive ? "step" : undefined}
                    className="group flex cursor-pointer items-center gap-2.5 py-0.5 focus-visible:outline-none"
                  />
                }
              >
                <span
                  className={cn(
                    "rounded bg-black/75 px-2 py-0.5 font-mono text-xs uppercase tracking-[0.2em] backdrop-blur-sm transition-all duration-300",
                    isActive
                      ? "translate-x-0 text-white opacity-100"
                      : "pointer-events-none translate-x-1 text-white/75 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                  )}
                >
                  {s.label}
                </span>
                <span
                  className={cn(
                    "block rounded-full transition-all duration-300",
                    isActive
                      ? "h-2.5 w-7 bg-brand shadow-[0_0_12px_rgba(99,210,198,0.9)]"
                      : "h-2 w-2 bg-white/50 group-hover:w-3.5 group-hover:bg-white",
                  )}
                />
              </TooltipTrigger>
              <TooltipContent side="left" className="border border-white/20 bg-black/95 font-mono text-xs uppercase tracking-[0.18em] text-white">
                {String(idx + 1).padStart(2, "0")} / {String(stations.length).padStart(2, "0")} · {s.body}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </aside>

      {/* Bottom-left active station badge (desktop) */}
      <div className="pointer-events-none fixed bottom-5 left-6 z-40 hidden items-center gap-3 rounded-full border border-white/15 bg-black/75 px-4 py-2 backdrop-blur-md sm:left-8 md:flex">
        <span className="relative flex h-2.5 w-2.5">
          <span className="ping-soft absolute inline-flex h-full w-full rounded-full bg-brand" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand" />
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.24em] text-white/80">
          <span className="font-semibold text-white">{String(activeIndex + 1).padStart(2, "0")}</span>
          <span className="mx-1 text-white/45">/</span>
          <span>{String(stations.length).padStart(2, "0")}</span>
          <span className="mx-2 text-white/45">·</span>
          <span className="font-medium text-brand">{active.body}</span>
        </span>
      </div>

      {/* Bottom-center scroll cue (hero only) */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none fixed bottom-6 left-1/2 z-40 hidden -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-500 sm:flex",
          showScrollCue ? "opacity-100" : "opacity-0",
        )}
      >
        <span className="relative block h-[30px] w-[20px] rounded-full border border-white/75 bg-black/50 backdrop-blur-sm">
          <span className="scroll-dot absolute left-1/2 top-[6px] block h-[6px] w-[2px] bg-white" />
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/80">Scroll</span>
      </div>

      {/* Bottom-right SLX-style progress bar + external links */}
      <div className="fixed bottom-5 right-5 z-40 hidden items-center gap-6 rounded-full border border-white/15 bg-black/75 px-4 py-2 backdrop-blur-md sm:right-8 md:flex">
        <div className="flex flex-col items-end gap-1">
          <span className="font-mono text-xs font-medium tracking-[0.22em] text-white tabular-nums">
            <span ref={pctRef}>000</span>
            <span className="text-white/60">%</span>
          </span>
          <span className="relative block h-[2px] w-24 bg-white/25">
            <span
              ref={barRef}
              className="absolute inset-y-0 left-0 block bg-brand transition-[width] duration-100"
              style={{ width: "0%" }}
            />
          </span>
        </div>

        <div className="flex items-center gap-4 border-l border-white/15 pl-4">
          <a
            href={profile.links.github.href}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-white/80 transition-colors hover:text-brand"
          >
            GitHub
          </a>
          <a
            href={profile.links.linkedin.href}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-white/80 transition-colors hover:text-brand"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </>
  );
}
