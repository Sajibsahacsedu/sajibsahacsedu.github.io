"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import { AdditiveBlending, DoubleSide, type Group, type ShaderMaterial } from "three";
import { Glow } from "../Glow";
import { isStationActive } from "../StationGroup";
import { createRng, gaussian, SIMPLEX_NOISE, SOFT_POINT_FRAGMENT } from "../utils";

const INNER = 2.1;
const OUTER = 7.6;

const DISK_POINTS_VERTEX = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
uniform float uInner;
uniform float uOuter;
attribute float aRadius;
attribute float aAngle;
attribute float aRand;
varying vec3 vColor;
varying float vAlpha;
void main() {
  float r = aRadius;
  float a = aAngle + uTime * (2.2 / pow(r, 1.5));
  vec3 p = vec3(cos(a) * r, position.y, sin(a) * r);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;

  float t = clamp((r - uInner) / (uOuter - uInner), 0.0, 1.0);
  vec3 hot = vec3(1.0, 0.94, 0.84);
  vec3 mid = vec3(1.0, 0.56, 0.2);
  vec3 cool = vec3(0.6, 0.15, 0.05);
  vec3 col = mix(hot, mid, smoothstep(0.0, 0.3, t));
  col = mix(col, cool, smoothstep(0.3, 1.0, t));
  // Relativistic beaming: the side moving toward the viewer is brighter.
  float beam = 0.7 + 0.6 * cos(a);
  vColor = col * beam * (1.25 - 0.45 * t);
  vAlpha = pow(1.0 - t, 1.3) * (0.35 + 0.65 * aRand);
  gl_PointSize = 34.0 * (0.5 + aRand) * uPixelRatio / -mv.z;
}
`;

const POS_VERTEX = /* glsl */ `
varying vec2 vPos;
void main() {
  vPos = position.xy;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const DISK_GAS_FRAGMENT = /* glsl */ `
uniform float uTime;
uniform float uInner;
uniform float uOuter;
varying vec2 vPos;
${SIMPLEX_NOISE}
void main() {
  float r = length(vPos);
  float a = atan(vPos.y, vPos.x);
  float t = clamp((r - uInner) / (uOuter - uInner), 0.0, 1.0);
  float ang = a + uTime * (2.2 / pow(r, 1.5));
  vec2 q = vec2(cos(ang), sin(ang)) * r;
  float n = snoise(vec3(q * 0.8, uTime * 0.05)) * 0.5 + 0.5;
  float streak = snoise(vec3(r * 3.2, cos(ang) * 1.4, sin(ang) * 1.4)) * 0.5 + 0.5;
  float density = pow(1.0 - t, 1.7) * smoothstep(0.0, 0.05, t);
  float intensity = density * (0.25 + 0.75 * n * streak);
  vec3 col = mix(vec3(1.0, 0.92, 0.8), vec3(1.0, 0.52, 0.18), smoothstep(0.0, 0.35, t));
  col = mix(col, vec3(0.55, 0.13, 0.04), smoothstep(0.35, 1.0, t));
  float beam = 0.7 + 0.5 * cos(a);
  gl_FragColor = vec4(col * beam * 1.5, intensity * 0.9);
}
`;

const HALO_FRAGMENT = /* glsl */ `
uniform float uTime;
varying vec2 vPos;
${SIMPLEX_NOISE}
void main() {
  float r = length(vPos);
  float a = atan(vPos.y, vPos.x);
  float dp = (r - 1.6) / 0.04;
  float dh = (r - 1.95) / 0.38;
  float photon = exp(-(dp * dp)) * 1.4;
  float halo = exp(-(dh * dh));
  float s = sin(a);
  float vertical = pow(max(abs(s), 0.0001), 1.4) * (s > 0.0 ? 1.0 : 0.6);
  float n = snoise(vec3(cos(a) * 3.0, sin(a) * 3.0, r * 4.0 - uTime * 0.35)) * 0.5 + 0.5;
  float intensity = photon + halo * vertical * (0.35 + 0.85 * n);
  vec3 col = mix(vec3(1.0, 0.92, 0.8), vec3(1.0, 0.55, 0.2), smoothstep(1.6, 3.0, r));
  gl_FragColor = vec4(col, clamp(intensity, 0.0, 1.0));
}
`;

/** "Gargantua": a black hole with an accretion disk and lensed halo. */
export function BlackHole({ low }: { low: boolean }) {
  const pointsMat = useRef<ShaderMaterial>(null);
  const gasMat = useRef<ShaderMaterial>(null);
  const haloMat = useRef<ShaderMaterial>(null);
  const tilt = useRef<Group>(null);
  const count = low ? 14000 : 36000;

  const { positions, radii, angles, rands } = useMemo(() => {
    const rand = createRng(42);
    const positions = new Float32Array(count * 3);
    const radii = new Float32Array(count);
    const angles = new Float32Array(count);
    const rands = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = INNER + (OUTER - INNER) * Math.pow(rand(), 1.9);
      const a = rand() * Math.PI * 2;
      const y = gaussian(rand) * 0.025 * r;
      radii[i] = r;
      angles[i] = a;
      rands[i] = rand();
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(a) * r;
    }
    return { positions, radii, angles, rands };
  }, [count]);

  const pointUniforms = useMemo(
    () => ({ uTime: { value: 0 }, uPixelRatio: { value: 1 }, uInner: { value: INNER }, uOuter: { value: OUTER } }),
    [],
  );
  const gasUniforms = useMemo(() => ({ uTime: { value: 0 }, uInner: { value: INNER }, uOuter: { value: OUTER } }), []);
  const haloUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((state) => {
    if (!isStationActive(0)) return;
    const t = state.clock.elapsedTime;
    if (pointsMat.current) {
      pointsMat.current.uniforms.uTime.value = t;
      pointsMat.current.uniforms.uPixelRatio.value = state.viewport.dpr;
    }
    if (gasMat.current) gasMat.current.uniforms.uTime.value = t;
    if (haloMat.current) haloMat.current.uniforms.uTime.value = t;
    if (tilt.current) {
      tilt.current.rotation.z = -0.12 + Math.sin(t * 0.2) * 0.02;
    }
  });

  return (
    <group>
      <Glow color="#ff9a4a" size={26} intensity={0.22} power={2.6} />
      <group ref={tilt} rotation={[0.06, 0, -0.12]}>
        {/* Event horizon */}
        <mesh>
          <sphereGeometry args={[1.5, 64, 64]} />
          <meshBasicMaterial color="#000000" />
        </mesh>

        {/* Gas layer of the accretion disk */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[INNER - 0.1, OUTER, 256, 6]} />
          <shaderMaterial
            ref={gasMat}
            uniforms={gasUniforms}
            vertexShader={POS_VERTEX}
            fragmentShader={DISK_GAS_FRAGMENT}
            transparent
            depthWrite={false}
            side={DoubleSide}
            blending={AdditiveBlending}
          />
        </mesh>

        {/* Particle layer of the accretion disk */}
        <points frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            <bufferAttribute attach="attributes-aRadius" args={[radii, 1]} />
            <bufferAttribute attach="attributes-aAngle" args={[angles, 1]} />
            <bufferAttribute attach="attributes-aRand" args={[rands, 1]} />
          </bufferGeometry>
          <shaderMaterial
            ref={pointsMat}
            uniforms={pointUniforms}
            vertexShader={DISK_POINTS_VERTEX}
            fragmentShader={SOFT_POINT_FRAGMENT}
            transparent
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </points>
      </group>

      {/* Gravitationally lensed image of the far side of the disk */}
      <Billboard>
        <mesh>
          <ringGeometry args={[1.52, 3.4, 256, 4]} />
          <shaderMaterial
            ref={haloMat}
            uniforms={haloUniforms}
            vertexShader={POS_VERTEX}
            fragmentShader={HALO_FRAGMENT}
            transparent
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
      </Billboard>
    </group>
  );
}
