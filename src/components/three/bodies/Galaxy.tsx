"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, Color, type Group, type ShaderMaterial } from "three";
import { Glow } from "../Glow";
import { isStationActive } from "../StationGroup";
import { createRng, SOFT_POINT_FRAGMENT } from "../utils";

const VERTEX = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
attribute float aScale;
attribute vec3 aColor;
attribute float aRand;
varying vec3 vColor;
varying float vAlpha;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = 70.0 * aScale * uPixelRatio / -mv.z;
  vColor = aColor;
  vAlpha = 0.55 + 0.45 * sin(uTime * 1.5 + aRand * 40.0);
}
`;

/** Classic spiral galaxy built from particles. */
export function Galaxy({ low }: { low: boolean }) {
  const mat = useRef<ShaderMaterial>(null);
  const group = useRef<Group>(null);
  const count = low ? 16000 : 42000;

  const attrs = useMemo(() => {
    const rand = createRng(99);
    const radius = 9;
    const branches = 4;
    const spin = 1.15;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const rands = new Float32Array(count);
    const inside = new Color("#ffd6a0");
    const outside = new Color("#4d63ff");
    const teal = new Color("#5ABDB2");
    const c = new Color();
    for (let i = 0; i < count; i++) {
      const r = Math.pow(rand(), 1.5) * radius;
      const branch = ((i % branches) / branches) * Math.PI * 2;
      const angle = branch + r * spin;
      const spread = (1 - r / radius) * 0.4 + 0.25;
      const rx = Math.pow(rand(), 3) * (rand() < 0.5 ? 1 : -1) * spread * r * 0.5;
      const ry = Math.pow(rand(), 3) * (rand() < 0.5 ? 1 : -1) * spread * (1.2 - r / radius) * 1.2;
      const rz = Math.pow(rand(), 3) * (rand() < 0.5 ? 1 : -1) * spread * r * 0.5;
      positions[i * 3] = Math.cos(angle) * r + rx;
      positions[i * 3 + 1] = ry;
      positions[i * 3 + 2] = Math.sin(angle) * r + rz;
      c.copy(inside).lerp(outside, Math.min(1, r / radius));
      if (rand() < 0.18) c.lerp(teal, 0.7);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      scales[i] = 0.4 + rand() * 1.1;
      rands[i] = rand();
    }
    return { positions, colors, scales, rands };
  }, [count]);

  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uPixelRatio: { value: 1 } }), []);

  useFrame((state, delta) => {
    if (!isStationActive(4)) return;
    if (mat.current) {
      mat.current.uniforms.uTime.value = state.clock.elapsedTime;
      mat.current.uniforms.uPixelRatio.value = state.viewport.dpr;
    }
    if (group.current) group.current.rotation.y += delta * 0.06;
  });

  return (
    <group rotation={[0.12, 0, 0.18]}>
      <Glow color="#ffcf94" size={7} intensity={0.9} power={2.4} />
      <Glow color="#7B61FF" size={26} intensity={0.1} power={1.6} />
      <group ref={group}>
        <points frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[attrs.positions, 3]} />
            <bufferAttribute attach="attributes-aColor" args={[attrs.colors, 3]} />
            <bufferAttribute attach="attributes-aScale" args={[attrs.scales, 1]} />
            <bufferAttribute attach="attributes-aRand" args={[attrs.rands, 1]} />
          </bufferGeometry>
          <shaderMaterial
            ref={mat}
            uniforms={uniforms}
            vertexShader={VERTEX}
            fragmentShader={SOFT_POINT_FRAGMENT}
            transparent
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </points>
      </group>
    </group>
  );
}
