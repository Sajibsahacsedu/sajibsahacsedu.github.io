"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, type ShaderMaterial } from "three";
import { Glow } from "../Glow";
import { isStationActive } from "../StationGroup";
import { createRng, SOFT_POINT_FRAGMENT } from "../utils";

const LENGTH = 70;

const VERTEX = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
uniform float uLength;
attribute float aAngle;
attribute float aRadius;
attribute float aZ;
attribute float aRand;
varying vec3 vColor;
varying float vAlpha;
void main() {
  float z = mod(aZ + uTime * 7.0 * (0.6 + 0.4 * aRand), uLength);
  float t = z / uLength;             // 0 = far end, 1 = mouth
  float posZ = -uLength + z;
  float funnel = 1.0 + 3.2 * pow(t, 4.0);
  float ang = aAngle + uTime * 0.22 + posZ * 0.07;
  float r = aRadius * funnel;
  vec3 p = vec3(cos(ang) * r, sin(ang) * r, posZ);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = min(46.0 * (0.4 + aRand) * uPixelRatio / -mv.z, 30.0 * uPixelRatio);
  vec3 violet = vec3(0.5, 0.4, 1.0);
  vec3 teal = vec3(0.36, 0.74, 0.7);
  vColor = mix(violet, teal, smoothstep(0.2, 0.9, t)) * 1.2;
  vAlpha = smoothstep(0.0, 0.2, t) * (1.0 - smoothstep(0.82, 1.0, t)) * (0.35 + 0.65 * aRand);
}
`;

/** A swirling tunnel of light — the last stop: contact. */
export function Wormhole({ low }: { low: boolean }) {
  const mat = useRef<ShaderMaterial>(null);
  const count = low ? 4000 : 10000;

  const attrs = useMemo(() => {
    const rand = createRng(808);
    const positions = new Float32Array(count * 3);
    const angles = new Float32Array(count);
    const radii = new Float32Array(count);
    const zs = new Float32Array(count);
    const rands = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      angles[i] = rand() * Math.PI * 2;
      radii[i] = 2.4 + Math.pow(rand(), 2) * 1.6;
      zs[i] = rand() * LENGTH;
      rands[i] = rand();
    }
    return { positions, angles, radii, zs, rands };
  }, [count]);

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uPixelRatio: { value: 1 }, uLength: { value: LENGTH } }),
    [],
  );

  useFrame((state) => {
    if (!isStationActive(8) || !mat.current) return;
    mat.current.uniforms.uTime.value = state.clock.elapsedTime;
    mat.current.uniforms.uPixelRatio.value = state.viewport.dpr;
  });

  return (
    <group>
      <Glow color="#c9c0ff" size={26} intensity={0.9} power={2.4} position={[0, 0, -LENGTH + 6]} />
      <Glow color="#5ABDB2" size={60} intensity={0.12} power={1.6} position={[0, 0, -LENGTH * 0.5]} />
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[attrs.positions, 3]} />
          <bufferAttribute attach="attributes-aAngle" args={[attrs.angles, 1]} />
          <bufferAttribute attach="attributes-aRadius" args={[attrs.radii, 1]} />
          <bufferAttribute attach="attributes-aZ" args={[attrs.zs, 1]} />
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
