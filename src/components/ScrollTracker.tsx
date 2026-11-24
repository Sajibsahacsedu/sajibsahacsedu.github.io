"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { emitProgress, scrollState, setActiveStation, setLenis } from "@/lib/scroll-store";

/**
 * Drives smooth scrolling (Lenis) and converts the scroll position into a
 * continuous "station" value consumed by the 3D camera and the HUD.
 */
export function ScrollTracker() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = reduceMotion ? null : new Lenis({ duration: 1.15, smoothWheel: true });
    setLenis(lenis);

    let bottoms: number[] = [];
    const measure = () => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-station]"));
      bottoms = sections.map((el) => el.getBoundingClientRect().bottom + window.scrollY);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);

    const onPointer = (e: PointerEvent) => {
      scrollState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      scrollState.pointerY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let raf = 0;
    const loop = (time: number) => {
      lenis?.raf(time);
      const y = window.scrollY;
      const vh = window.innerHeight;
      // Each section boundary contributes 0 → 1 as it travels from the bottom
      // of the viewport to the top, so the camera holds still while you read.
      let station = 0;
      for (let i = 0; i < bottoms.length - 1; i++) {
        station += Math.min(1, Math.max(0, 1 - (bottoms[i] - y) / vh));
      }
      scrollState.station = station;
      const max = document.documentElement.scrollHeight - vh;
      scrollState.progress = max > 0 ? Math.min(1, y / max) : 0;
      setActiveStation(Math.round(station));
      emitProgress();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointermove", onPointer);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
