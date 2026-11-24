"use client";

import { useSyncExternalStore } from "react";
import type Lenis from "lenis";

/**
 * Tiny mutable store shared between the DOM (scroll position) and the
 * WebGL scene. The 3D scene reads `scrollState` every frame without
 * triggering React renders; the HUD subscribes to the rounded station.
 */
export const scrollState = {
  /** Continuous station index, e.g. 2.4 = 40% of the way from station 2 to 3. */
  station: 0,
  /** 0..1 progress through the whole page. */
  progress: 0,
  /** Normalised pointer position, -1..1. */
  pointerX: 0,
  pointerY: 0,
};

let activeStation = 0;
const stationListeners = new Set<() => void>();
const progressListeners = new Set<(p: number, station: number) => void>();
let lenisInstance: Lenis | null = null;

export function setActiveStation(index: number) {
  if (index === activeStation) return;
  activeStation = index;
  stationListeners.forEach((l) => l());
}

export function emitProgress() {
  progressListeners.forEach((l) => l(scrollState.progress, scrollState.station));
}

export function onProgress(listener: (p: number, station: number) => void) {
  progressListeners.add(listener);
  return () => {
    progressListeners.delete(listener);
  };
}

function subscribe(listener: () => void) {
  stationListeners.add(listener);
  return () => {
    stationListeners.delete(listener);
  };
}

export function useActiveStation() {
  return useSyncExternalStore(
    subscribe,
    () => activeStation,
    () => 0,
  );
}

export function setLenis(lenis: Lenis | null) {
  lenisInstance = lenis;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisInstance) {
    lenisInstance.scrollTo(el, { duration: 1.6 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
