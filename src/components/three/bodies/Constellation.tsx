"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, type Group, type ShaderMaterial } from "three";
import { Glow } from "../Glow";
import { isStationActive } from "../StationGroup";
import { createRng, SOFT_POINT_FRAGMENT } from "../utils";

const LINE_VERTEX = /* glsl */ `
attribute float aT;
attribute float aSeed;
varying float vT;
varying float vSeed;
void main() {
  vT = aT;
  vSeed = aSeed;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const LINE_FRAGMENT = /* glsl */ `
uniform float uTime;
varying float vT;
varying float vSeed;
void main() {
  float head = fract(uTime * (0.25 + vSeed * 0.3) + vSeed * 13.0);
  float isLit = step(0.45, fract(vSeed * 7.31));
  float pulse = smoothstep(0.14, 0.0, abs(vT - head)) * isLit;
  float a = 0.1 + pulse * 0.95;
  vec3 col = mix(vec3(0.45, 0.62, 0.8), vec3(0.6, 1.0, 0.93), pulse);
  gl_FragColor = vec4(col, a);
}
`;

const NODE_VERTEX = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
attribute float aScale;
attribute float aRand;
varying vec3 vColor;
varying float vAlpha;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float pulse = 0.5 + 0.5 * sin(uTime * 2.0 + aRand * 30.0);
  gl_PointSize = (90.0 + 60.0 * pulse) * aScale * uPixelRatio / -mv.z;
  vColor = mix(vec3(0.75, 0.95, 1.0), vec3(0.36, 0.74, 0.7), aRand);
  vAlpha = 0.6 + 0.4 * pulse;
}
`;

/** A neural-network-like constellation with signals travelling along edges. */
export function Constellation({ low }: { low: boolean }) {
  const lineMat = useRef<ShaderMaterial>(null);
  const nodeMat = useRef<ShaderMaterial>(null);
  const group = useRef<Group>(null);
  const outer = low ? 90 : 150;
  const inner = low ? 20 : 36;

  const data = useMemo(() => {
    const rand = createRng(2025);
    const total = outer + inner;
    const nodes: [number, number, number][] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < outer; i++) {
      const y = 1 - (i / (outer - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const th = golden * i;
      const R = 5 + (rand() - 0.5) * 1.1;
      nodes.push([Math.cos(th) * rad * R * 1.15, y * R * 0.9, Math.sin(th) * rad * R]);
    }
    for (let i = 0; i < inner; i++) {
      const u = rand() * 2 - 1;
      const th = rand() * Math.PI * 2;
      const r = 1 + rand() * 2.4;
      const s = Math.sqrt(1 - u * u);
      nodes.push([Math.cos(th) * s * r, u * r, Math.sin(th) * s * r]);
    }

    const edges = new Set<string>();
    const pairs: [number, number][] = [];
    for (let i = 0; i < total; i++) {
      const dists: [number, number][] = [];
      for (let j = 0; j < total; j++) {
        if (i === j) continue;
        const dx = nodes[i][0] - nodes[j][0];
        const dy = nodes[i][1] - nodes[j][1];
        const dz = nodes[i][2] - nodes[j][2];
        dists.push([dx * dx + dy * dy + dz * dz, j]);
      }
      dists.sort((a, b) => a[0] - b[0]);
      for (let k = 0; k < 3; k++) {
        const j = dists[k][1];
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!edges.has(key)) {
          edges.add(key);
          pairs.push([i, j]);
        }
      }
    }

    const nodePos = new Float32Array(total * 3);
    const nodeScale = new Float32Array(total);
    const nodeRand = new Float32Array(total);
    nodes.forEach((n, i) => {
      nodePos.set(n, i * 3);
      nodeScale[i] = i >= outer ? 0.6 + rand() * 0.6 : 0.35 + rand() * 0.7;
      nodeRand[i] = rand();
    });

    const linePos = new Float32Array(pairs.length * 6);
    const lineT = new Float32Array(pairs.length * 2);
    const lineSeed = new Float32Array(pairs.length * 2);
    pairs.forEach(([a, b], k) => {
      linePos.set(nodes[a], k * 6);
      linePos.set(nodes[b], k * 6 + 3);
      lineT[k * 2] = 0;
      lineT[k * 2 + 1] = 1;
      const seed = rand();
      lineSeed[k * 2] = seed;
      lineSeed[k * 2 + 1] = seed;
    });
    return { nodePos, nodeScale, nodeRand, linePos, lineT, lineSeed };
  }, [outer, inner]);

  const lineUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  const nodeUniforms = useMemo(() => ({ uTime: { value: 0 }, uPixelRatio: { value: 1 } }), []);

  useFrame((state, delta) => {
    if (!isStationActive(5)) return;
    const t = state.clock.elapsedTime;
    if (lineMat.current) lineMat.current.uniforms.uTime.value = t;
    if (nodeMat.current) {
      nodeMat.current.uniforms.uTime.value = t;
      nodeMat.current.uniforms.uPixelRatio.value = state.viewport.dpr;
    }
    if (group.current) {
      group.current.rotation.y += delta * 0.07;
      group.current.rotation.x = Math.sin(t * 0.15) * 0.12;
    }
  });

  return (
    <group>
      <Glow color="#5ABDB2" size={14} intensity={0.2} power={2} />
      <group ref={group}>
        <lineSegments frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[data.linePos, 3]} />
            <bufferAttribute attach="attributes-aT" args={[data.lineT, 1]} />
            <bufferAttribute attach="attributes-aSeed" args={[data.lineSeed, 1]} />
          </bufferGeometry>
          <shaderMaterial
            ref={lineMat}
            uniforms={lineUniforms}
            vertexShader={LINE_VERTEX}
            fragmentShader={LINE_FRAGMENT}
            transparent
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </lineSegments>
        <points frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[data.nodePos, 3]} />
            <bufferAttribute attach="attributes-aScale" args={[data.nodeScale, 1]} />
            <bufferAttribute attach="attributes-aRand" args={[data.nodeRand, 1]} />
          </bufferGeometry>
          <shaderMaterial
            ref={nodeMat}
            uniforms={nodeUniforms}
            vertexShader={NODE_VERTEX}
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
