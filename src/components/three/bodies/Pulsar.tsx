"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { AdditiveBlending, ConeGeometry, DoubleSide, Vector3, type Group, type ShaderMaterial } from "three";
import { Glow } from "../Glow";
import { isStationActive } from "../StationGroup";

const BEAM_LENGTH = 17;

const BEAM_VERTEX = /* glsl */ `
uniform float uLength;
varying float vT;
varying vec3 vN;
varying vec3 vV;
void main() {
  vT = clamp(-position.y / uLength, 0.0, 1.0);
  vec4 w = modelMatrix * vec4(position, 1.0);
  vN = normalize(mat3(modelMatrix) * normal);
  vV = normalize(cameraPosition - w.xyz);
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

const BEAM_FRAGMENT = /* glsl */ `
uniform float uTime;
varying float vT;
varying vec3 vN;
varying vec3 vV;
void main() {
  float edge = pow(abs(dot(normalize(vN), normalize(vV))), 1.6);
  float flicker = 0.88 + 0.12 * sin(uTime * 24.0);
  float a = pow(1.0 - vT, 1.7) * edge * flicker * 0.85;
  vec3 col = mix(vec3(0.85, 0.96, 1.0), vec3(0.35, 0.75, 0.72), smoothstep(0.0, 0.7, vT));
  gl_FragColor = vec4(col, a);
}
`;

/** A spinning neutron star sweeping two lighthouse beams. */
export function Pulsar() {
  const spin = useRef<Group>(null);
  const beamMat = useRef<ShaderMaterial>(null);

  const beamGeometry = useMemo(() => {
    const g = new ConeGeometry(1.7, BEAM_LENGTH, 48, 1, true);
    g.translate(0, -BEAM_LENGTH / 2, 0);
    return g;
  }, []);

  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uLength: { value: BEAM_LENGTH } }), []);

  // Dipole magnetic field lines: r = L * sin^2(theta).
  const fieldLines = useMemo(() => {
    const lines: Vector3[][] = [];
    const shells = [2.0, 3.3];
    for (const L of shells) {
      for (let k = 0; k < 6; k++) {
        const phi = (k / 6) * Math.PI * 2;
        const pts: Vector3[] = [];
        for (let i = 0; i <= 64; i++) {
          const theta = 0.25 + (i / 64) * (Math.PI - 0.5);
          const r = L * Math.sin(theta) ** 2;
          const x = r * Math.sin(theta);
          const y = r * Math.cos(theta);
          pts.push(new Vector3(x * Math.cos(phi), y, x * Math.sin(phi)));
        }
        lines.push(pts);
      }
    }
    return lines;
  }, []);

  useFrame((state, delta) => {
    if (!isStationActive(3)) return;
    if (spin.current) spin.current.rotation.y += delta * 1.25;
    if (beamMat.current) beamMat.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <group rotation={[0.15, 0, -0.2]}>
      <Glow color="#bfe9ff" size={6} intensity={1.1} power={2.2} />
      <Glow color="#5ABDB2" size={18} intensity={0.16} power={2} />
      <group ref={spin}>
        <group rotation={[0, 0, 0.5]}>
          <mesh>
            <sphereGeometry args={[0.55, 48, 48]} />
            <meshBasicMaterial color={[2.6, 3, 3.4]} toneMapped={false} />
          </mesh>
          {[0, Math.PI].map((rx) => (
            <mesh key={rx} geometry={beamGeometry} rotation={[rx, 0, 0]}>
              <shaderMaterial
                ref={rx === 0 ? beamMat : undefined}
                uniforms={uniforms}
                vertexShader={BEAM_VERTEX}
                fragmentShader={BEAM_FRAGMENT}
                transparent
                depthWrite={false}
                side={DoubleSide}
                blending={AdditiveBlending}
              />
            </mesh>
          ))}
          {fieldLines.map((pts, i) => (
            <Line key={i} points={pts} color="#5ABDB2" lineWidth={1} transparent opacity={0.35} />
          ))}
        </group>
      </group>
    </group>
  );
}
