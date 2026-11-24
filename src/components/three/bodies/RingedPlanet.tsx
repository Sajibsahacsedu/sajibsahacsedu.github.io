"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, BackSide, DoubleSide, Vector3, type Group, type Mesh, type ShaderMaterial } from "three";
import { isStationActive } from "../StationGroup";
import { SIMPLEX_NOISE } from "../utils";

const LIGHT_DIR = new Vector3(-0.7, 0.45, 0.55).normalize();

const PLANET_VERTEX = /* glsl */ `
varying vec3 vNormalW;
varying vec3 vPosL;
varying vec3 vPosW;
void main() {
  vPosL = position;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vPosW = w.xyz;
  vNormalW = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

const PLANET_FRAGMENT = /* glsl */ `
uniform float uTime;
uniform vec3 uLightDir;
varying vec3 vNormalW;
varying vec3 vPosL;
varying vec3 vPosW;
${SIMPLEX_NOISE}
void main() {
  float lat = vPosL.y / 3.0;
  float warp = snoise(vec3(vPosL * 0.55 + vec3(0.0, 0.0, uTime * 0.03)));
  float bands = sin(lat * 17.0 + warp * 2.4) * 0.5 + 0.5;
  float fine = snoise(vec3(lat * 38.0, vPosL.x * 0.35, vPosL.z * 0.35)) * 0.5 + 0.5;
  vec3 c1 = vec3(0.03, 0.12, 0.15);
  vec3 c2 = vec3(0.3, 0.68, 0.66);
  vec3 c3 = vec3(0.93, 0.86, 0.72);
  vec3 col = mix(c1, c2, bands);
  col = mix(col, c3, smoothstep(0.55, 1.0, fine) * 0.4);

  vec3 N = normalize(vNormalW);
  vec3 L = normalize(uLightDir);
  vec3 V = normalize(cameraPosition - vPosW);
  float ndl = dot(N, L);
  float diff = max(ndl, 0.0);
  float wrap = smoothstep(-0.25, 1.0, ndl);
  vec3 lit = col * (0.02 + 1.15 * diff + 0.12 * wrap);
  float rim = pow(1.0 - max(dot(N, V), 0.0), 3.0);
  lit += vec3(0.35, 0.85, 0.8) * rim * (0.15 + 0.9 * wrap);
  gl_FragColor = vec4(lit, 1.0);
}
`;

const ATMOS_VERTEX = /* glsl */ `
varying vec3 vNormalV;
void main() {
  vNormalV = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const ATMOS_FRAGMENT = /* glsl */ `
varying vec3 vNormalV;
void main() {
  float e = clamp(-vNormalV.z, 0.0, 1.0);
  float i = pow(clamp(e * 1.9, 0.0, 1.0), 3.0);
  gl_FragColor = vec4(vec3(0.35, 0.85, 0.8), i * 0.55);
}
`;

const RING_VERTEX = /* glsl */ `
varying vec2 vPos;
void main() {
  vPos = position.xy;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const RING_FRAGMENT = /* glsl */ `
uniform float uInner;
uniform float uOuter;
varying vec2 vPos;
void main() {
  float r = length(vPos);
  float t = (r - uInner) / (uOuter - uInner);
  float bands = 0.55 + 0.45 * sin(t * 70.0 + sin(t * 13.0) * 3.0);
  bands *= 0.7 + 0.3 * sin(t * 23.0 + 1.3);
  float dg = (t - 0.62) / 0.025;
  float gap = 1.0 - 0.85 * exp(-(dg * dg));
  float edge = smoothstep(0.0, 0.06, t) * (1.0 - smoothstep(0.88, 1.0, t));
  float a = bands * gap * edge * 0.75;
  vec3 col = mix(vec3(0.95, 0.88, 0.74), vec3(0.4, 0.78, 0.74), smoothstep(0.2, 1.0, t));
  gl_FragColor = vec4(col * 0.9, a);
}
`;

/** A banded gas giant with rings and a small moon. */
export function RingedPlanet() {
  const planetMat = useRef<ShaderMaterial>(null);
  const planet = useRef<Mesh>(null);
  const moonPivot = useRef<Group>(null);

  const planetUniforms = useMemo(() => ({ uTime: { value: 0 }, uLightDir: { value: LIGHT_DIR } }), []);
  const ringUniforms = useMemo(() => ({ uInner: { value: 4 }, uOuter: { value: 7.6 } }), []);

  useFrame((state, delta) => {
    if (!isStationActive(2)) return;
    if (planetMat.current) planetMat.current.uniforms.uTime.value = state.clock.elapsedTime;
    if (planet.current) planet.current.rotation.y += delta * 0.06;
    if (moonPivot.current) moonPivot.current.rotation.y += delta * 0.18;
  });

  return (
    <group rotation={[0.25, 0.3, 0.38]}>
      <mesh ref={planet}>
        <sphereGeometry args={[3, 96, 96]} />
        <shaderMaterial
          ref={planetMat}
          uniforms={planetUniforms}
          vertexShader={PLANET_VERTEX}
          fragmentShader={PLANET_FRAGMENT}
        />
      </mesh>
      <mesh scale={1.16}>
        <sphereGeometry args={[3, 64, 64]} />
        <shaderMaterial
          vertexShader={ATMOS_VERTEX}
          fragmentShader={ATMOS_FRAGMENT}
          side={BackSide}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4, 7.6, 256, 1]} />
        <shaderMaterial
          uniforms={ringUniforms}
          vertexShader={RING_VERTEX}
          fragmentShader={RING_FRAGMENT}
          side={DoubleSide}
          transparent
          depthWrite={false}
        />
      </mesh>
      <group ref={moonPivot} rotation={[0.3, 0, 0]}>
        <mesh position={[10, 0.6, 0]}>
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshStandardMaterial color="#b9c2c9" roughness={0.9} metalness={0} />
        </mesh>
      </group>
    </group>
  );
}
