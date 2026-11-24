"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { scrollState } from "@/lib/scroll-store";
import { STATIONS, stationView } from "./stations";
import { clamp } from "./utils";

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Flies the camera between stations based on scroll position. */
export function CameraRig() {
  const size = useThree((s) => s.size);
  const state = useRef({
    pos: new Vector3(),
    look: new Vector3(),
    aPos: new Vector3(),
    aLook: new Vector3(),
    bPos: new Vector3(),
    bLook: new Vector3(),
    tPos: new Vector3(),
    tLook: new Vector3(),
    initialised: false,
  });

  useFrame(({ camera }, delta) => {
    const s = state.current;
    const aspect = size.width / Math.max(1, size.height);
    const last = STATIONS.length - 1;
    const station = clamp(scrollState.station, 0, last);
    const i = Math.floor(station);
    const j = Math.min(i + 1, last);
    const f = easeInOutCubic(station - i);

    stationView(i, aspect, s.aPos, s.aLook);
    stationView(j, aspect, s.bPos, s.bLook);
    s.tPos.lerpVectors(s.aPos, s.bPos, f);
    s.tLook.lerpVectors(s.aLook, s.bLook, f);

    // Swoop upward mid-flight for a more cinematic path.
    const arc = Math.sin(f * Math.PI);
    s.tPos.y += arc * 7;
    s.tLook.y += arc * 3;

    // Subtle pointer parallax.
    s.tPos.x += scrollState.pointerX * 0.9;
    s.tPos.y += scrollState.pointerY * 0.55;

    if (!s.initialised) {
      s.pos.copy(s.tPos);
      s.look.copy(s.tLook);
      s.initialised = true;
    }

    const k = 1 - Math.exp(-Math.min(delta, 0.1) * 3.2);
    s.pos.lerp(s.tPos, k);
    s.look.lerp(s.tLook, k);
    camera.position.copy(s.pos);
    camera.lookAt(s.look);
  });

  return null;
}
