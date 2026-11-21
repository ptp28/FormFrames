import type { ReactNode } from 'react';

/**
 * A tiny 2D skeletal animation engine.
 *
 * Angles are in degrees: 0 = straight up, 90 = forward/right, 180 = down, -90 = back/left.
 * The hip is the root. Limbs are either forward kinematics (absolute angles of the
 * upper and lower segment) or inverse kinematics (a target point for the hand/ankle).
 */

export type P = { x: number; y: number };

/** Forward kinematics: absolute angles; s/s2 scale the projected length (foreshortening, may be negative). */
export type FK = { a: number; b: number; s?: number; s2?: number };
/** Inverse kinematics: end effector target, bend chooses which side the elbow/knee goes. */
export type IK = { x: number; y: number; bend?: number };
export type Limb = FK | IK;

export interface Pose {
  hip: [number, number];
  /** torso angle */
  t: number;
  /** shrug: raise shoulders along the torso */
  sh?: number;
  /** shoulder shift forward(+)/back(-) perpendicular to the torso */
  sx?: number;
  aN: Limb;
  aF?: Limb;
  lN: Limb;
  lF?: Limb;
  /** foot angle near / far (side view) */
  f?: number;
  fF?: number;
  /** free parameters for equipment (e.g. weight-stack lift 0..1) */
  p?: Record<string, number>;
}

export interface Frame {
  pose: Pose;
  /** seconds to travel to the next frame */
  d: number;
  /** seconds to hold this frame */
  h?: number;
}

export type View = 'side' | 'front';

export type Muscle =
  | 'chest'
  | 'upperBack'
  | 'lats'
  | 'lowerBack'
  | 'core'
  | 'traps'
  | 'delts'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'glutes'
  | 'quads'
  | 'hamstrings'
  | 'adductors'
  | 'abductors'
  | 'calves';

export interface Skel {
  view: View;
  t: number;
  hip: P;
  hipN: P;
  hipF: P;
  sc: P;
  shN: P;
  shF: P;
  head: P;
  elN: P;
  elF: P;
  haN: P;
  haF: P;
  knN: P;
  knF: P;
  anN: P;
  anF: P;
  toN: P;
  toF: P;
  p: Record<string, number>;
}

export interface Anim {
  view: View;
  frames: Frame[];
  hi: Muscle[];
  back?: (s: Skel) => ReactNode;
  front?: (s: Skel) => ReactNode;
  ground?: boolean;
}

export const B = {
  T: 48,
  NECK: 5,
  HR: 9,
  UA: 28,
  FA: 26,
  TH: 38,
  SH: 37,
  FOOT: 10,
  SW: 13,
  HW: 7,
};

export const G = 188; // ground line

const rad = (d: number) => (d * Math.PI) / 180;
export const dir = (deg: number): P => ({ x: Math.sin(rad(deg)), y: -Math.cos(rad(deg)) });
export const add = (a: P, b: P): P => ({ x: a.x + b.x, y: a.y + b.y });
export const sub = (a: P, b: P): P => ({ x: a.x - b.x, y: a.y - b.y });
export const mul = (a: P, k: number): P => ({ x: a.x * k, y: a.y * k });
export const pt = (x: number, y: number): P => ({ x, y });
/** Angle (engine convention) of the vector a -> b */
export const angleOf = (a: P, b: P) => (Math.atan2(b.x - a.x, -(b.y - a.y)) * 180) / Math.PI;
/** Point at distance `len` from a, along a -> b (can exceed b) */
export const along = (a: P, b: P, len: number): P => {
  const d = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  return { x: a.x + ((b.x - a.x) / d) * len, y: a.y + ((b.y - a.y) / d) * len };
};

export const isIK = (l: Limb): l is IK => 'x' in l;
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

function lerpLimb(a: Limb, b: Limb, u: number): Limb {
  if (isIK(a) && isIK(b)) return { x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), bend: a.bend };
  if (!isIK(a) && !isIK(b))
    return {
      a: lerp(a.a, b.a, u),
      b: lerp(a.b, b.b, u),
      s: lerp(a.s ?? 1, b.s ?? 1, u),
      s2: lerp(a.s2 ?? 1, b.s2 ?? 1, u),
    };
  return u < 0.5 ? a : b;
}

function lerpOpt(a: Limb | undefined, b: Limb | undefined, u: number) {
  if (!a || !b) return a ?? b;
  return lerpLimb(a, b, u);
}

export function lerpPose(a: Pose, b: Pose, u: number): Pose {
  const p: Record<string, number> = {};
  const keys = new Set([...Object.keys(a.p ?? {}), ...Object.keys(b.p ?? {})]);
  keys.forEach((k) => (p[k] = lerp(a.p?.[k] ?? 0, b.p?.[k] ?? 0, u)));
  return {
    hip: [lerp(a.hip[0], b.hip[0], u), lerp(a.hip[1], b.hip[1], u)],
    t: lerp(a.t, b.t, u),
    sh: lerp(a.sh ?? 0, b.sh ?? 0, u),
    sx: lerp(a.sx ?? 0, b.sx ?? 0, u),
    aN: lerpLimb(a.aN, b.aN, u),
    aF: lerpOpt(a.aF, b.aF, u),
    lN: lerpLimb(a.lN, b.lN, u),
    lF: lerpOpt(a.lF, b.lF, u),
    f: lerp(a.f ?? 100, b.f ?? 100, u),
    fF: a.fF !== undefined || b.fF !== undefined ? lerp(a.fF ?? a.f ?? 100, b.fF ?? b.f ?? 100, u) : undefined,
    p,
  };
}

const ease = (u: number) => 0.5 - Math.cos(Math.PI * u) / 2;

export function totalDuration(anim: Anim) {
  return anim.frames.reduce((s, f) => s + f.d + (f.h ?? 0), 0);
}

/** Pose at time `time` (seconds), looping. */
export function sample(anim: Anim, time: number): Pose {
  const { frames } = anim;
  const total = totalDuration(anim);
  let t = ((time % total) + total) % total;
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i];
    const h = f.h ?? 0;
    if (t < h) return f.pose;
    t -= h;
    if (t < f.d) return lerpPose(f.pose, frames[(i + 1) % frames.length].pose, ease(t / f.d));
    t -= f.d;
  }
  return frames[0].pose;
}

function solveLimb(root: P, limb: Limb, L1: number, L2: number, defBend: number): [P, P] {
  if (!isIK(limb)) {
    const mid = add(root, mul(dir(limb.a), L1 * (limb.s ?? 1)));
    return [mid, add(mid, mul(dir(limb.b), L2 * (limb.s2 ?? 1)))];
  }
  const dx = limb.x - root.x;
  const dy = limb.y - root.y;
  const d = Math.hypot(dx, dy);
  const dc = Math.min(Math.max(d, Math.abs(L1 - L2) + 0.01), L1 + L2 - 0.01);
  const base = Math.atan2(dy, dx);
  const cosA = (L1 * L1 + dc * dc - L2 * L2) / (2 * L1 * dc);
  const A = Math.acos(Math.min(1, Math.max(-1, cosA)));
  const ang = base + (limb.bend ?? defBend) * A;
  const mid = { x: root.x + Math.cos(ang) * L1, y: root.y + Math.sin(ang) * L1 };
  const end = { x: root.x + Math.cos(base) * dc, y: root.y + Math.sin(base) * dc };
  return [mid, end];
}

function mirror(l: Limb, cx: number): Limb {
  if (isIK(l)) return { x: 2 * cx - l.x, y: l.y, bend: -(l.bend ?? 0) || undefined };
  return { a: -l.a, b: -l.b, s: l.s, s2: l.s2 };
}

export function solve(pose: Pose, view: View): Skel {
  const hip = pt(pose.hip[0], pose.hip[1]);
  const d = dir(pose.t);
  const pr = dir(pose.t + 90);
  const sc = add(add(hip, mul(d, B.T + (pose.sh ?? 0))), mul(pr, pose.sx ?? 0));
  const head = add(hip, mul(d, B.T + B.NECK + B.HR));
  const front = view === 'front';
  const shN = front ? add(sc, mul(pr, B.SW)) : sc;
  const shF = front ? sub(sc, mul(pr, B.SW)) : sc;
  const hipN = front ? add(hip, mul(pr, B.HW)) : hip;
  const hipF = front ? sub(hip, mul(pr, B.HW)) : hip;

  const fixBend = (l: Limb, def: number): Limb => (isIK(l) && l.bend === undefined ? { ...l, bend: def } : l);
  const aN = fixBend(pose.aN, 1);
  const lN = fixBend(pose.lN, -1);
  const aF = pose.aF ? fixBend(pose.aF, front ? -1 : 1) : front ? mirror(aN, hip.x) : aN;
  const lF = pose.lF ? fixBend(pose.lF, front ? 1 : -1) : front ? mirror(lN, hip.x) : lN;

  const [elN, haN] = solveLimb(shN, aN, B.UA, B.FA, 1);
  const [elF, haF] = solveLimb(shF, aF, B.UA, B.FA, 1);
  const [knN, anN] = solveLimb(hipN, lN, B.TH, B.SH, -1);
  const [knF, anF] = solveLimb(hipF, lF, B.TH, B.SH, -1);

  const toN = front ? add(anN, mul(dir(100), 6)) : add(anN, mul(dir(pose.f ?? 100), B.FOOT));
  const toF = front ? add(anF, mul(dir(-100), 6)) : add(anF, mul(dir(pose.fF ?? pose.f ?? 100), B.FOOT));

  return { view, t: pose.t, hip, hipN, hipF, sc, shN, shF, head, elN, elF, haN, haF, knN, knF, anN, anF, toN, toF, p: pose.p ?? {} };
}
