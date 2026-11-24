"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, Color, type Group, type ShaderMaterial } from "three";
import { Glow } from "../Glow";
import { isStationActive } from "../StationGroup";
import { createRng, gaussian, SOFT_POINT_FRAGMENT } from "../utils";

const VERTEX = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
attribute float aScale;
attribute float aAlpha;
attribute float aRand;
attribute vec3 aColor;
varying vec3 vColor;
varying float vAlpha;
void main() {
  vec3 p = position;
  float ph = aRand * 6.2831;
  p += vec3(sin(uTime * 0.21 + ph), cos(uTime * 0.17 + ph * 2.0), sin(uTime * 0.13 + ph * 0.5)) * 0.22;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = min(420.0 * aScale * uPixelRatio / -mv.z, 220.0 * uPixelRatio);
  vColor = aColor;
  vAlpha = aAlpha;
}
`;

const CLUSTERS: { c: [number, number, number]; color: string; spread: number; weight: number }[] = [
  { c: [0, 0, 0], color: "#5ABDB2", spread: 2.6, weight: 0.32 },
  { c: [3.6, 1.3, -1], color: "#7B61FF", spread: 2.3, weight: 0.22 },
  { c: [-3.4, -0.9, 0.8], color: "#E056FD", spread: 2.1, weight: 0.18 },
  { c: [1.4, -2.6, 1.5], color: "#3D7BFF", spread: 1.8, weight: 0.16 },
  { c: [-1.6, 2.7, -1.5], color: "#FF8A5B", spread: 1.5, weight: 0.12 },
];

/** Soft multicoloured nebula built from large additive sprites. */
export function Nebula({ low }: { low: boolean }) {
  const mat = useRef<ShaderMaterial>(null);
  const group = useRef<Group>(null);
  const clouds = low ? 1000 : 2200;
  const stars = low ? 200 : 450;

  const attrs = useMemo(() => {
    const rand = createRng(1234);
    const total = clouds + stars;
    const positions = new Float32Array(total * 3);
    const colors = new Float32Array(total * 3);
    const scales = new Float32Array(total);
    const alphas = new Float32Array(total);
    const rands = new Float32Array(total);
    const tmp = new Color();
    for (let i = 0; i < total; i++) {
      const isStar = i >= clouds;
      let pick = rand();
      let cluster = CLUSTERS[0];
      for (const c of CLUSTERS) {
        if (pick < c.weight) {
          cluster = c;
          break;
        }
        pick -= c.weight;
      }
      const spread = cluster.spread * (isStar ? 1.4 : 1);
      positions[i * 3] = cluster.c[0] + gaussian(rand) * spread * 1.2;
      positions[i * 3 + 1] = cluster.c[1] + gaussian(rand) * spread * 0.7;
      positions[i * 3 + 2] = cluster.c[2] + gaussian(rand) * spread;
      if (isStar) {
        tmp.set("#ffffff").lerp(new Color(cluster.color), rand() * 0.4);
        scales[i] = 0.03 + rand() * 0.06;
        alphas[i] = 0.7 + rand() * 0.3;
      } else {
        tmp.set(cluster.color).offsetHSL((rand() - 0.5) * 0.06, 0, (rand() - 0.5) * 0.1);
        scales[i] = 0.6 + rand() * 1.8;
        alphas[i] = 0.035 + rand() * 0.08;
      }
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
      rands[i] = rand();
    }
    return { positions, colors, scales, alphas, rands };
  }, [clouds, stars]);

  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uPixelRatio: { value: 1 } }), []);

  useFrame((state, delta) => {
    if (!isStationActive(1)) return;
    if (mat.current) {
      mat.current.uniforms.uTime.value = state.clock.elapsedTime;
      mat.current.uniforms.uPixelRatio.value = state.viewport.dpr;
    }
    if (group.current) group.current.rotation.y += delta * 0.03;
  });

  return (
    <group ref={group} rotation={[0.2, 0, 0.1]}>
      <Glow color="#5ABDB2" size={16} intensity={0.22} power={2} />
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[attrs.positions, 3]} />
          <bufferAttribute attach="attributes-aColor" args={[attrs.colors, 3]} />
          <bufferAttribute attach="attributes-aScale" args={[attrs.scales, 1]} />
          <bufferAttribute attach="attributes-aAlpha" args={[attrs.alphas, 1]} />
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
  );
}
