"use client";

import dynamic from "next/dynamic";

// WebGL scene is client-only.
const Scene = dynamic(() => import("./Scene"), { ssr: false });

export function SceneLoader() {
  return <Scene />;
}
