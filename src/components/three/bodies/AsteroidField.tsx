"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { IcosahedronGeometry, Object3D, type Group, type InstancedMesh, type Mesh } from "three";
import { Glow } from "../Glow";
import { isStationActive } from "../StationGroup";
import { createRng, gaussian } from "../utils";

/** A belt of chrome asteroids orbiting an iridescent crystal. */
export function AsteroidField({ low }: { low: boolean }) {
  const count = low ? 55 : 110;
  const mesh = useRef<InstancedMesh>(null);
  const crystal = useRef<Mesh>(null);
  const moons = useRef<Group>(null);
  const dummy = useMemo(() => new Object3D(), []);

  const rockGeometry = useMemo(() => {
    const g = new IcosahedronGeometry(1, 1);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      // Position-based displacement keeps shared vertices together.
      const k =
        1 + 0.2 * Math.sin(x * 3.1 + y * 1.7) + 0.13 * Math.sin(y * 4.3 + z * 2.9) + 0.1 * Math.cos(z * 5.1 + x * 2.3);
      pos.setXYZ(i, x * k, y * k * 0.85, z * k);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  const params = useMemo(() => {
    const rand = createRng(77);
    return Array.from({ length: count }, () => {
      const radius = 4.2 + Math.pow(rand(), 0.8) * 5.5;
      return {
        radius,
        angle: rand() * Math.PI * 2,
        y: gaussian(rand) * 0.5,
        speed: 0.35 / Math.sqrt(radius),
        scale: 0.1 + Math.pow(rand(), 2.5) * 0.55,
        rx: rand() * Math.PI,
        ry: rand() * Math.PI,
        spin: (rand() - 0.5) * 1.2,
      };
    });
  }, [count]);

  // Integrated orbit angles live in a ref so the params array stays immutable.
  const angles = useRef<number[] | null>(null);

  useFrame((state, delta) => {
    if (!isStationActive(6) || !mesh.current) return;
    const t = state.clock.elapsedTime;
    if (!angles.current || angles.current.length !== params.length) {
      angles.current = params.map((p) => p.angle);
    }
    const a = angles.current;
    params.forEach((p, i) => {
      a[i] += p.speed * Math.min(delta, 0.1);
      dummy.position.set(Math.cos(a[i]) * p.radius, p.y, Math.sin(a[i]) * p.radius);
      dummy.rotation.set(p.rx + t * p.spin, p.ry + t * p.spin * 0.7, 0);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    if (crystal.current) crystal.current.rotation.y += delta * 0.35;
    if (moons.current) moons.current.rotation.y -= delta * 0.5;
  });

  return (
    <group rotation={[0.35, 0, -0.12]}>
      <Glow color="#5ABDB2" size={12} intensity={0.3} power={2.2} />
      <Glow color="#7B61FF" size={22} intensity={0.08} power={1.5} />
      <pointLight color="#5ABDB2" intensity={30} distance={14} decay={1.6} />
      <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.6}>
        <mesh ref={crystal} scale={[1, 1.45, 1]}>
          <octahedronGeometry args={[1.5, 0]} />
          <meshPhysicalMaterial
            color="#c9fff6"
            metalness={0.95}
            roughness={0.08}
            iridescence={1}
            iridescenceIOR={1.7}
            iridescenceThicknessRange={[200, 900]}
            clearcoat={1}
            clearcoatRoughness={0.05}
            envMapIntensity={1.6}
            flatShading
          />
        </mesh>
      </Float>
      <group ref={moons}>
        {[0, 1, 2].map((k) => {
          const ang = (k / 3) * Math.PI * 2;
          return (
            <mesh key={k} position={[Math.cos(ang) * 2.8, Math.sin(ang * 2) * 0.6, Math.sin(ang) * 2.8]} scale={0.35}>
              <octahedronGeometry args={[1, 0]} />
              <meshPhysicalMaterial
                color="#ffffff"
                metalness={1}
                roughness={0.1}
                iridescence={1}
                iridescenceIOR={1.5}
                envMapIntensity={1.4}
                flatShading
              />
            </mesh>
          );
        })}
      </group>
      <instancedMesh ref={mesh} args={[rockGeometry, undefined, count]} frustumCulled={false}>
        <meshStandardMaterial color="#9aa3ad" roughness={0.42} metalness={0.75} envMapIntensity={0.9} flatShading />
      </instancedMesh>
    </group>
  );
}
