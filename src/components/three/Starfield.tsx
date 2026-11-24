"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, type ShaderMaterial } from "three";
import { createRng } from "./utils";

const VERTEX = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
attribute float aScale;
attribute float aPhase;
attribute vec3 aColor;
varying vec3 vColor;
varying float vAlpha;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float size = 260.0 * aScale / -mv.z;
  gl_PointSize = clamp(size, 1.0, 4.5) * uPixelRatio;
  vColor = aColor;
  vAlpha = (0.55 + 0.45 * sin(uTime * (0.6 + aPhase) + aPhase * 12.0)) * smoothstep(0.6, 2.0, size + 0.8);
}
`;

const FRAGMENT = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = 1.0 - smoothstep(0.1, 0.5, d);
  gl_FragColor = vec4(vColor, a * vAlpha);
}
`;

/** Twinkling stars filling the whole flight path. */
export function Starfield({ low }: { low: boolean }) {
  const mat = useRef<ShaderMaterial>(null);
  const count = low ? 3500 : 8000;

  const { positions, scales, phases, colors } = useMemo(() => {
    const rand = createRng(7);
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const phases = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const palette = [
      [1, 1, 1],
      [0.75, 0.85, 1],
      [1, 0.9, 0.78],
      [0.6, 0.95, 0.9],
    ];
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * 460;
      positions[i * 3 + 1] = (rand() - 0.5) * 320;
      positions[i * 3 + 2] = 80 - rand() * 820;
      scales[i] = 0.4 + Math.pow(rand(), 3) * 2.2;
      phases[i] = rand();
      const c = palette[Math.floor(rand() * palette.length)];
      colors.set(c, i * 3);
    }
    return { positions, scales, phases, colors };
  }, [count]);

  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uPixelRatio: { value: 1 } }), []);

  useFrame((state) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value = state.clock.elapsedTime;
    mat.current.uniforms.uPixelRatio.value = state.viewport.dpr;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
        <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}
