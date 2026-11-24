"use client";

import { Component, Suspense, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { CameraRig } from "./CameraRig";
import { StationGroup } from "./StationGroup";
import { Starfield } from "./Starfield";
import { CAMERA_FOV } from "./stations";
import { BlackHole } from "./bodies/BlackHole";
import { Nebula } from "./bodies/Nebula";
import { RingedPlanet } from "./bodies/RingedPlanet";
import { Pulsar } from "./bodies/Pulsar";
import { Galaxy } from "./bodies/Galaxy";
import { Constellation } from "./bodies/Constellation";
import { AsteroidField } from "./bodies/AsteroidField";
import { OrbitalSystem } from "./bodies/OrbitalSystem";
import { Wormhole } from "./bodies/Wormhole";

function detectLowPower() {
  if (typeof window === "undefined") return false;
  const small = window.innerWidth < 768;
  const cores = navigator.hardwareConcurrency ?? 8;
  return small || cores <= 4;
}

class WebGLBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    if (typeof window !== "undefined") window.dispatchEvent(new Event("scene-ready"));
  }
  render() {
    if (this.state.failed) {
      return (
        <div
          className="h-full w-full"
          style={{
            background:
              "radial-gradient(circle at 72% 45%, rgba(90,189,178,0.16), rgba(123,97,255,0.08) 38%, #000 72%)",
          }}
        />
      );
    }
    return this.props.children;
  }
}

export default function Scene() {
  const [low] = useState(detectLowPower);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <WebGLBoundary>
      <Canvas
        dpr={[1, low ? 1.3 : 1.75]}
        gl={{ antialias: !low, powerPreference: "high-performance", alpha: false }}
        camera={{ fov: CAMERA_FOV, near: 0.1, far: 1500, position: [0, 1.3, 17] }}
        onCreated={() => window.dispatchEvent(new Event("scene-ready"))}
      >
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.18} />
        <directionalLight position={[-10, 8, 6]} intensity={1.6} />

        <Suspense fallback={null}>
          <Environment resolution={256} frames={1}>
            <Lightformer form="rect" intensity={4} color="#5ABDB2" position={[-5, 2, 3]} scale={[6, 2, 1]} />
            <Lightformer form="rect" intensity={3} color="#7B61FF" position={[5, -1, 2]} scale={[4, 4, 1]} />
            <Lightformer form="ring" intensity={6} color="#ffffff" position={[0, 5, -5]} scale={3} />
            <Lightformer form="rect" intensity={2} color="#ff8a5b" position={[0, -5, 4]} scale={[8, 1, 1]} />
          </Environment>

          <Starfield low={low} />
          <StationGroup index={0}>
            <BlackHole low={low} />
          </StationGroup>
          <StationGroup index={1}>
            <Nebula low={low} />
          </StationGroup>
          <StationGroup index={2}>
            <RingedPlanet />
          </StationGroup>
          <StationGroup index={3}>
            <Pulsar />
          </StationGroup>
          <StationGroup index={4}>
            <Galaxy low={low} />
          </StationGroup>
          <StationGroup index={5}>
            <Constellation low={low} />
          </StationGroup>
          <StationGroup index={6}>
            <AsteroidField low={low} />
          </StationGroup>
          <StationGroup index={7}>
            <OrbitalSystem />
          </StationGroup>
          <StationGroup index={8}>
            <Wormhole low={low} />
          </StationGroup>
        </Suspense>

        <CameraRig />

        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom
            mipmapBlur
            intensity={low ? 0.8 : 1.05}
            luminanceThreshold={0.22}
            luminanceSmoothing={0.35}
            radius={0.72}
            resolutionScale={low ? 0.5 : 1}
          />
          <Vignette darkness={0.65} offset={0.28} />
        </EffectComposer>
      </Canvas>
      </WebGLBoundary>
    </div>
  );
}
