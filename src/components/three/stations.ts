import { Vector3 } from "three";

/**
 * Camera "stations": one per page section. Each entry places a cosmic body
 * in world space and describes where the camera sits relative to it.
 */
export type StationConfig = {
  /** World position of the body. */
  pos: [number, number, number];
  /** Direction from the body towards the camera (normalised at runtime). */
  dir: [number, number, number];
  /** Camera distance from the body. */
  dist: number;
  /** How far right (in NDC, 0..1) the body sits on wide screens, leaving room for text. */
  shift: number;
};

export const STATIONS: StationConfig[] = [
  { pos: [0, 0, 0], dir: [0, 0.075, 1], dist: 17, shift: 0.3 }, // 0 Gargantua
  { pos: [46, 12, -70], dir: [0.3, 0.2, 1], dist: 21, shift: 0.42 }, // 1 Nebula
  { pos: [-36, -6, -140], dir: [-0.25, 0.12, 1], dist: 21, shift: 0.42 }, // 2 Ringed planet
  { pos: [38, 16, -210], dir: [0.12, 0.05, 1], dist: 19, shift: 0.42 }, // 3 Pulsar
  { pos: [-26, 30, -290], dir: [0, 0.6, 1], dist: 22, shift: 0.4 }, // 4 Galaxy
  { pos: [42, -10, -360], dir: [0.2, 0.1, 1], dist: 16, shift: 0.42 }, // 5 Constellation
  { pos: [-38, 6, -430], dir: [-0.2, 0.35, 1], dist: 20, shift: 0.42 }, // 6 Asteroid field
  { pos: [32, 22, -500], dir: [0, 0.45, 1], dist: 19, shift: 0.42 }, // 7 Orbital system
  { pos: [0, 0, -585], dir: [0, 0, 1], dist: 9, shift: 0 }, // 8 Wormhole
];

const DIRS = STATIONS.map((s) => new Vector3(...s.dir).normalize());
const UP = new Vector3(0, 1, 0);
const _right = new Vector3();
const _forward = new Vector3();
const FOV = 45;
const HALF_TAN = Math.tan(((FOV / 2) * Math.PI) / 180);

export const CAMERA_FOV = FOV;

/** Writes the camera position and look-at target for a station into the out vectors. */
export function stationView(index: number, aspect: number, outPos: Vector3, outLook: Vector3) {
  const s = STATIONS[index];
  const dir = DIRS[index];
  // Portrait screens: pull back so the body still fits horizontally.
  const distFactor = aspect < 1 ? Math.min(1.75, Math.max(1, 0.8 / aspect)) : 1;
  const dist = s.dist * distFactor;
  const k = aspect >= 1.25 ? s.shift : aspect >= 0.9 ? s.shift * 0.45 : 0;
  const halfWidth = dist * HALF_TAN * aspect;

  _forward.copy(dir).negate();
  _right.crossVectors(_forward, UP).normalize();

  outLook.set(s.pos[0], s.pos[1], s.pos[2]).addScaledVector(_right, -halfWidth * k);
  // On portrait screens push the body slightly up, above the copy.
  if (aspect < 0.9) outLook.y -= dist * HALF_TAN * 0.18;
  outPos.copy(outLook).addScaledVector(dir, dist);
}
