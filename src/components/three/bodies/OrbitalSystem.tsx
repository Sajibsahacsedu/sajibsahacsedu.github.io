"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { Vector3, type Group } from "three";
import { Glow } from "../Glow";
import { isStationActive } from "../StationGroup";

const ORBITS = [
  { radius: 2.6, size: 0.22, color: "#c9d3dc", speed: 0.9, phase: 0.4 },
  { radius: 3.9, size: 0.36, color: "#5ABDB2", speed: 0.6, phase: 2.1 },
  { radius: 5.4, size: 0.3, color: "#ff8a5b", speed: 0.42, phase: 4.0 },
  { radius: 7.1, size: 0.55, color: "#8b7bff", speed: 0.28, phase: 1.2 },
];

/** A small star system: education & achievements orbiting a bright star. */
export function OrbitalSystem() {
  const pivots = useRef<(Group | null)[]>([]);

  const circles = useMemo(
    () =>
      ORBITS.map((o) =>
        Array.from({ length: 129 }, (_, i) => {
          const a = (i / 128) * Math.PI * 2;
          return new Vector3(Math.cos(a) * o.radius, 0, Math.sin(a) * o.radius);
        }),
      ),
    [],
  );

  useFrame((_, delta) => {
    if (!isStationActive(7)) return;
    pivots.current.forEach((p, i) => {
      if (p) p.rotation.y += delta * ORBITS[i].speed;
    });
  });

  return (
    <group rotation={[0.42, 0, 0.12]}>
      <mesh>
        <sphereGeometry args={[1, 48, 48]} />
        <meshBasicMaterial color={[4, 2.7, 1.3]} toneMapped={false} />
      </mesh>
      <Glow color="#ffc27a" size={7} intensity={1} power={2.2} />
      <Glow color="#ff9a4a" size={20} intensity={0.14} power={1.8} />
      <pointLight color="#ffd7a8" intensity={60} distance={22} decay={1.4} />
      {circles.map((pts, i) => (
        <Line key={i} points={pts} color="#ffffff" lineWidth={1} transparent opacity={0.16} />
      ))}
      {ORBITS.map((o, i) => (
        <group
          key={i}
          ref={(el) => {
            pivots.current[i] = el;
          }}
          rotation={[0, o.phase, 0]}
        >
          <mesh position={[o.radius, 0, 0]}>
            <sphereGeometry args={[o.size, 32, 32]} />
            <meshStandardMaterial color={o.color} roughness={0.55} metalness={0.15} />
          </mesh>
          {i === 3 && (
            <mesh position={[o.radius, 0, 0]} rotation={[-Math.PI / 2 + 0.3, 0, 0]}>
              <ringGeometry args={[0.75, 1.05, 64]} />
              <meshBasicMaterial color="#b8b0ff" transparent opacity={0.45} side={2} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}
