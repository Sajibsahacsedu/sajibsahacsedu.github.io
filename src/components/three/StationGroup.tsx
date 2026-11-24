"use client";

import { useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { scrollState } from "@/lib/scroll-store";
import { STATIONS } from "./stations";

/** Positions a body at its station and hides it when the camera is far away. */
export function StationGroup({ index, children }: { index: number; children: ReactNode }) {
  const ref = useRef<Group>(null);
  useFrame(() => {
    if (ref.current) ref.current.visible = Math.abs(scrollState.station - index) < 1.35;
  });
  return (
    <group ref={ref} position={STATIONS[index].pos}>
      {children}
    </group>
  );
}

/** True when the station is near enough to be worth animating. */
export function isStationActive(index: number) {
  return Math.abs(scrollState.station - index) < 1.35;
}
