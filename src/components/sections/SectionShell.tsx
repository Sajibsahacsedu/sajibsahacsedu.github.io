"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { stations } from "@/lib/resume";

type SectionShellProps = {
  stationIndex: number;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * Shared editorial layout wrapper for each resume chapter.
 * On desktop, content occupies the left ~56% so the station's 3D body
 * remains framed on the right (except centered stations like Contact).
 */
export function SectionShell({
  stationIndex,
  eyebrow,
  title,
  subtitle,
  centered = false,
  className,
  children,
}: SectionShellProps) {
  const station = stations[stationIndex];
  const num = String(stationIndex + 1).padStart(2, "0");
  const total = String(stations.length).padStart(2, "0");

  return (
    <section
      id={station.id}
      data-station={stationIndex}
      aria-labelledby={`${station.id}-heading`}
      className={cn(
        "relative z-10 flex min-h-[100svh] w-full flex-col justify-center px-5 py-28 sm:px-10 md:py-32 lg:px-16",
        className,
      )}
    >
      {/* Subtle readability scrim behind the text column while leaving the 3D scene open */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 -z-10",
          centered
            ? "bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.68)_0%,rgba(0,0,0,0.35)_55%,transparent_85%)]"
            : "bg-gradient-to-b from-black/55 via-black/45 to-black/55 lg:bg-gradient-to-r lg:from-black/78 lg:via-black/48 lg:to-transparent",
        )}
      />

      <div
        className={cn(
          "w-full",
          centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl lg:max-w-[60%] xl:max-w-[56%]",
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Editorial station counter inspired by SLX Management */}
          <div
            className={cn(
              "mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.26em] text-white/80 sm:text-[13px]",
              centered && "justify-center",
            )}
          >
            <span className="font-semibold text-brand">{num}</span>
            <span className="text-white/45">/</span>
            <span className="text-white/70">{total}</span>
            <span className="text-white/45">·</span>
            <span className="font-medium text-white">{station.body}</span>
            {eyebrow && (
              <>
                <span className="hidden text-white/45 sm:inline">—</span>
                <span className="hidden text-white/80 sm:inline">{eyebrow}</span>
              </>
            )}
          </div>

          <h2
            id={`${station.id}-heading`}
            className="text-3xl font-semibold tracking-tight text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.85)] sm:text-5xl lg:text-[3.15rem] lg:leading-[1.1]"
          >
            {title}
          </h2>

          {subtitle && (
            <p
              className={cn(
                "mt-4 text-base leading-relaxed text-white/88 drop-shadow-[0_1px_12px_rgba(0,0,0,0.85)] sm:text-lg",
                centered ? "mx-auto max-w-2xl" : "max-w-2xl",
              )}
            >
              {subtitle}
            </p>
          )}

          {/* Hairline rule with vertical end ticks */}
          <div className={cn("mt-6 mb-8 flex items-center", centered && "mx-auto max-w-md")}>
            <span className="h-2.5 w-px bg-brand" />
            <span className="h-px flex-1 bg-gradient-to-r from-brand/70 via-white/30 to-white/10" />
            <span className="h-2.5 w-px bg-white/45" />
          </div>

          {children}
        </motion.div>
      </div>
    </section>
  );
}
