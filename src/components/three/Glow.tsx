"use client";

import { useMemo } from "react";
import { Billboard } from "@react-three/drei";
import { AdditiveBlending, Color } from "three";

export const UV_VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const GLOW_FRAGMENT = /* glsl */ `
uniform vec3 uColor;
uniform float uIntensity;
uniform float uPower;
varying vec2 vUv;
void main() {
  float d = length(vUv - 0.5) * 2.0;
  float a = pow(clamp(1.0 - d, 0.0, 1.0), uPower) * uIntensity;
  gl_FragColor = vec4(uColor, a);
}
`;

type GlowProps = {
  color?: string;
  size?: number;
  intensity?: number;
  power?: number;
  position?: [number, number, number];
};

/** Camera-facing radial glow sprite (additive). */
export function Glow({ color = "#ffffff", size = 4, intensity = 1, power = 2, position }: GlowProps) {
  const uniforms = useMemo(
    () => ({
      uColor: { value: new Color(color) },
      uIntensity: { value: intensity },
      uPower: { value: power },
    }),
    [color, intensity, power],
  );
  return (
    <Billboard position={position}>
      <mesh>
        <planeGeometry args={[size, size]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={UV_VERTEX}
          fragmentShader={GLOW_FRAGMENT}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>
    </Billboard>
  );
}
