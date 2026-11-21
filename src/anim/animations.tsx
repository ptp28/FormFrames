import { add, along, angleOf, dir, mul, pt, type Anim, type FK, type Frame, type IK, type Pose } from './engine';
import {
  bbEnd,
  bbFront,
  bench,
  box,
  cable,
  db,
  dbEnd,
  kb,
  knob,
  ln,
  pad,
  plateEdge,
  post,
  pulley,
  sidePad,
  stack,
} from './kit';

const fk = (a: number, b: number, s?: number, s2?: number): FK => ({ a, b, s, s2 });
const ik = (x: number, y: number, bend?: number): IK => ({ x, y, bend });
const F = (pose: Pose, d: number, h = 0): Frame => ({ pose, d, h });

// Common stances
const STAND_SIDE = { hip: [118, 108] as [number, number], t: 0, lN: ik(120, 183) };
const STAND_FRONT = { hip: [120, 108] as [number, number], t: 0, lN: fk(176, 182) };
const SEAT_FRONT = { hip: [120, 138] as [number, number], t: 0, lN: fk(150, 178, 0.35) };

const frontSeat = (
  <g>
    {post(104, 146)}
    {post(136, 146)}
    {box(96, 141, 48, 8, 3)}
  </g>
);

/* ============================== BACK ============================== */

export const pullUp: Anim = {
  view: 'front',
  ground: false,
  hi: ['lats', 'biceps'],
  frames: [
    F({ hip: [120, 122], t: 0, aN: ik(156, 30), lN: fk(176, 183) }, 1.1, 0.25),
    F({ hip: [120, 84], t: 0, aN: ik(156, 30), lN: fk(170, 188) }, 0.9, 0.35),
  ],
  back: () => (
    <g>
      {post(44, 22, 188, 5)}
      {post(196, 22, 188, 5)}
      {ln(pt(36, 30), pt(204, 30), 4)}
    </g>
  ),
};

export const seatedRow: Anim = {
  view: 'side',
  hi: ['upperBack', 'lats', 'biceps', 'delts'],
  frames: [
    F({ hip: [100, 140], t: 7, aN: ik(156, 102), lN: ik(160, 168), p: { w: 0 } }, 0.9, 0.15),
    F({ hip: [100, 140], t: -5, aN: ik(108, 108), lN: ik(160, 168), p: { w: 1 } }, 1.0, 0.35),
  ],
  back: (s) => (
    <g>
      {stack(196, 40, s.p.w)}
      {post(186, 40, 188, 4)}
      {bench(56, 128, 150)}
      {pad(pt(168, 150), pt(168, 184), 6)}
      {pulley(pt(184, 108))}
      {cable(pt(184, 108), s.haN)}
    </g>
  ),
  front: (s) => (
    <g>
      {ln(add(s.haN, pt(0, -6)), add(s.haN, pt(0, 6)), 4)}
    </g>
  ),
};

export const rowErg: Anim = {
  view: 'side',
  hi: ['quads', 'lats', 'biceps', 'core'],
  frames: [
    F({ hip: [118, 152], t: 25, aN: ik(186, 124), lN: ik(170, 158), f: 75 }, 0.55, 0.05),
    F({ hip: [100, 152], t: 8, aN: ik(152, 116), lN: ik(170, 158), f: 75 }, 0.35),
    F({ hip: [97, 152], t: -22, aN: ik(98, 116), lN: ik(170, 158), f: 75 }, 0.45, 0.1),
    F({ hip: [100, 152], t: 6, aN: ik(150, 116), lN: ik(170, 158), f: 75 }, 0.8),
  ],
  back: (s) => (
    <g>
      {ln(pt(28, 166), pt(196, 166), 5)}
      {post(36, 166, 188, 4)}
      {post(188, 166, 188, 4)}
      <circle cx={206} cy={146} r={20} fill="var(--eq2)" stroke="var(--eq)" strokeWidth={3} />
      <circle cx={206} cy={146} r={4} fill="var(--eq)" />
      {ln(pt(176, 150), pt(176, 170), 4)}
      {box(s.hip.x - 13, 157, 26, 6, 2)}
      {cable(s.haN, pt(192, 136))}
    </g>
  ),
  front: (s) => ln(add(s.haN, pt(0, -5)), add(s.haN, pt(0, 5)), 4),
};

export const crossPulldown: Anim = {
  view: 'front',
  hi: ['lats', 'biceps', 'upperBack'],
  frames: [
    F({ ...SEAT_FRONT, aN: ik(168, 42) }, 1.0, 0.2),
    F({ ...SEAT_FRONT, aN: ik(152, 90) }, 0.9, 0.35),
  ],
  back: () => (
    <g>
      {post(20, 10, 188, 5)}
      {post(220, 10, 188, 5)}
      {pulley(pt(27, 20))}
      {pulley(pt(213, 20))}
      {frontSeat}
    </g>
  ),
  front: (s) => (
    <g>
      {cable(pt(27, 20), s.haN)}
      {cable(pt(213, 20), s.haF)}
      {knob(s.haN, 3.6)}
      {knob(s.haF, 3.6)}
    </g>
  ),
};

export const latPulldown: Anim = {
  view: 'front',
  hi: ['lats', 'biceps'],
  frames: [
    F({ ...SEAT_FRONT, aN: ik(158, 40) }, 1.0, 0.2),
    F({ ...SEAT_FRONT, aN: ik(162, 84) }, 0.9, 0.35),
  ],
  back: () => (
    <g>
      {ln(pt(90, 8), pt(150, 8), 5)}
      {pulley(pt(120, 12))}
      {frontSeat}
    </g>
  ),
  front: (s) => {
    const mid = pt((s.haN.x + s.haF.x) / 2, (s.haN.y + s.haF.y) / 2);
    const l = add(s.haF, pt(-20, 0));
    const r = add(s.haN, pt(20, 0));
    return (
      <g>
        {cable(pt(120, 12), mid)}
        {ln(l, r, 3.5)}
        {ln(l, add(l, pt(-6, 7)), 3.5)}
        {ln(r, add(r, pt(6, 7)), 3.5)}
        {box(98, 141, 44, 6, 3)}
      </g>
    );
  },
};

const rickBottom: Pose = { hip: [104, 135], t: 55, aN: fk(180, 180), lN: ik(120, 183) };
const rickTop: Pose = { hip: [118, 108], t: 0, aN: fk(180, 180), lN: ik(120, 183) };
export const rickshaw: Anim = {
  view: 'side',
  hi: ['traps', 'glutes', 'hamstrings', 'lowerBack', 'forearms'],
  frames: [F(rickBottom, 1.0, 0.25), F(rickTop, 0.35), F({ ...rickTop, sh: 6 }, 0.35, 0.35), F(rickTop, 0.9)],
  front: (s) => db(s.haN, 90),
};

export const shrugs: Anim = {
  view: 'front',
  hi: ['traps'],
  frames: [F({ ...STAND_FRONT, aN: fk(172, 178) }, 0.6, 0.25), F({ ...STAND_FRONT, sh: 7, aN: fk(172, 178) }, 0.6, 0.5)],
  front: (s) => (
    <g>
      {dbEnd(s.haN)}
      {dbEnd(s.haF)}
    </g>
  ),
};

export const reversePecFly: Anim = {
  view: 'front',
  hi: ['delts', 'upperBack'],
  frames: [
    F({ ...SEAT_FRONT, aN: fk(95, 95, -0.25, -0.25) }, 0.9, 0.2),
    F({ ...SEAT_FRONT, aN: fk(95, 95, 1, 1) }, 0.9, 0.4),
  ],
  back: (s) => (
    <g>
      {post(120, 36, 188, 7)}
      {frontSeat}
      {ln(pt(120, 44), s.haN, 2.5)}
      {ln(pt(120, 44), s.haF, 2.5)}
    </g>
  ),
  front: (s) => (
    <g>
      {ln(add(s.haN, pt(0, -7)), add(s.haN, pt(0, 7)), 4)}
      {ln(add(s.haF, pt(0, -7)), add(s.haF, pt(0, 7)), 4)}
    </g>
  ),
};

export const kbSwing: Anim = {
  view: 'side',
  hi: ['glutes', 'hamstrings', 'lowerBack', 'core'],
  frames: [
    F({ hip: [100, 128], t: 60, aN: fk(200, 200), lN: ik(120, 183) }, 0.55, 0.05),
    F({ hip: [118, 108], t: -4, aN: fk(95, 95), lN: ik(120, 183) }, 0.6, 0.12),
  ],
  front: (s) => kb(s.haN, angleOf(s.elN, s.haN)),
};

/* ============================== BICEPS ============================== */

const curl = (front: Anim['front']): Anim => ({
  view: 'side',
  hi: ['biceps', 'forearms'],
  frames: [F({ ...STAND_SIDE, aN: fk(178, 176) }, 0.9, 0.2), F({ ...STAND_SIDE, aN: fk(172, 22) }, 0.9, 0.35)],
  front,
});
export const curlDumbbell = curl((s) => dbEnd(s.haN, 6.5));
export const curlBarbell = curl((s) => bbEnd(s.haN, 13));
export const hammerCurl: Anim = { ...curl((s) => db(s.haN, angleOf(s.elN, s.haN) + 90)) };

export const curlMachine: Anim = {
  view: 'side',
  hi: ['biceps'],
  frames: [
    F({ hip: [92, 145], t: 8, aN: fk(130, 112), lN: fk(95, 178) }, 0.9, 0.2),
    F({ hip: [92, 145], t: 8, aN: fk(130, 10), lN: fk(95, 178) }, 0.8, 0.3),
  ],
  back: (s) => (
    <g>
      {post(118, 128)}
      {post(92, 155)}
      {box(70, 150, 44, 7, 3)}
      {sidePad(add(s.shN, mul(dir(130), 6)), add(s.elN, mul(dir(130), 6)), 9, 8)}
    </g>
  ),
  front: (s) => (
    <g>
      {ln(s.elN, s.haN, 3)}
      <circle cx={s.elN.x} cy={s.elN.y} r={3} fill="var(--eq2)" stroke="var(--eq)" strokeWidth={1.5} />
      {knob(s.haN, 3.6)}
    </g>
  ),
};

/* ============================== SHOULDERS ============================== */

const press = (front: Anim['front'], back?: Anim['back']): Anim => ({
  view: 'front',
  hi: ['delts', 'triceps'],
  frames: [F({ ...STAND_FRONT, aN: fk(98, 4) }, 0.9, 0.2), F({ ...STAND_FRONT, aN: fk(18, 4) }, 0.8, 0.3)],
  front,
  back,
});
export const pressDumbbell = press((s) => (
  <g>
    {db(s.haN, 90)}
    {db(s.haF, 90)}
  </g>
));
export const pressBarbell = press((s) => bbFront(s.haF, s.haN));
export const pressCable = press(
  (s) => (
    <g>
      {cable(pt(213, 176), s.haN)}
      {cable(pt(27, 176), s.haF)}
      {knob(s.haN, 3.6)}
      {knob(s.haF, 3.6)}
    </g>
  ),
  () => (
    <g>
      {post(20, 10, 188, 5)}
      {post(220, 10, 188, 5)}
      {pulley(pt(27, 176))}
      {pulley(pt(213, 176))}
    </g>
  ),
);

export const lateralDumbbell: Anim = {
  view: 'front',
  hi: ['delts'],
  frames: [F({ ...STAND_FRONT, aN: fk(170, 174) }, 0.9, 0.2), F({ ...STAND_FRONT, aN: fk(88, 92) }, 0.9, 0.35)],
  front: (s) => (
    <g>
      {dbEnd(s.haN)}
      {dbEnd(s.haF)}
    </g>
  ),
};

export const lateralMachine: Anim = {
  view: 'front',
  hi: ['delts'],
  frames: [
    F({ ...SEAT_FRONT, aN: fk(172, 178, 1, 0.35) }, 0.9, 0.2),
    F({ ...SEAT_FRONT, aN: fk(92, 100, 1, 0.35) }, 0.9, 0.35),
  ],
  back: () => (
    <g>
      {box(104, 70, 32, 68, 6)}
      {frontSeat}
    </g>
  ),
  front: (s) => (
    <g>
      {sidePad(along(s.shN, s.elN, 10), s.elN, -6, 7)}
      {sidePad(along(s.shF, s.elF, 10), s.elF, 6, 7)}
    </g>
  ),
};

export const frontRaisePlate: Anim = {
  view: 'side',
  hi: ['delts'],
  frames: [F({ ...STAND_SIDE, aN: fk(165, 168) }, 0.9, 0.2), F({ ...STAND_SIDE, aN: fk(72, 74) }, 0.9, 0.3)],
  front: (s) => plateEdge(s.haN, angleOf(s.shN, s.haN)),
};

const roll = (sh: number, sx: number) => F({ ...STAND_SIDE, sh, sx, aN: fk(180, 180) }, 0.45);
export const shoulderRolls: Anim = {
  view: 'side',
  hi: ['traps', 'delts'],
  frames: [roll(0, 3), roll(6, 1), roll(4, -4), roll(-1, -1)],
  front: (s) => db(s.haN, 90),
};

export const facePull: Anim = {
  view: 'side',
  hi: ['delts', 'upperBack', 'traps'],
  frames: [
    F({ hip: [114, 108], t: -3, aN: fk(85, 85), lN: ik(126, 183), lF: ik(102, 183) }, 0.8, 0.2),
    F({ hip: [114, 108], t: -3, aN: fk(85, 70, -0.45, 1), lN: ik(126, 183), lF: ik(102, 183) }, 0.8, 0.35),
  ],
  back: () => (
    <g>
      {post(222, 14, 188, 5)}
      {pulley(pt(215, 46))}
    </g>
  ),
  front: (s) => (
    <g>
      {cable(pt(215, 46), s.haN)}
      {ln(s.haN, add(s.haN, pt(-2, 7)), 3)}
      {ln(s.haN, add(s.haN, pt(2, -7)), 3)}
    </g>
  ),
};

/* ============================== CHEST ============================== */

export const pushUp: Anim = {
  view: 'side',
  hi: ['chest', 'triceps', 'delts'],
  frames: [
    F({ hip: [104.7, 150.9], t: 66.4, aN: ik(150, 182), lN: ik(36, 179), f: 150 }, 0.8, 0.15),
    F({ hip: [110.6, 173], t: 83.9, aN: ik(150, 182), lN: ik(36, 179), f: 150 }, 0.8, 0.15),
  ],
};

export const chestPress: Anim = {
  view: 'side',
  hi: ['chest', 'triceps', 'delts'],
  frames: [
    F({ hip: [80, 142], t: -8, aN: ik(102, 98), lN: fk(97, 176), p: { w: 0 } }, 0.9, 0.2),
    F({ hip: [80, 142], t: -8, aN: ik(126, 96), lN: fk(97, 176), p: { w: 1 } }, 0.9, 0.3),
  ],
  back: (s) => (
    <g>
      {stack(190, 40, s.p.w)}
      {post(150, 30)}
      {post(84, 155)}
      {pad(pt(72, 148), pt(61, 78), 10)}
      {box(60, 148, 46, 7, 3)}
    </g>
  ),
  front: (s) => (
    <g>
      {ln(pt(150, 40), s.haN, 3.5)}
      {knob(s.haN, 4)}
    </g>
  ),
};

export const inclinePress: Anim = {
  view: 'side',
  hi: ['chest', 'delts', 'triceps'],
  frames: [
    F({ hip: [130, 140], t: -55, aN: ik(99, 60), lN: ik(172, 183) }, 0.9, 0.2),
    F({ hip: [130, 140], t: -55, aN: ik(97, 95), lN: ik(172, 183) }, 0.8, 0.15),
  ],
  back: () => (
    <g>
      {post(70, 36)}
      {ln(pt(70, 52), pt(78, 52), 4)}
      {post(88, 126)}
      {post(140, 154)}
      {pad(pt(128, 150), pt(70, 109), 10)}
      {pad(pt(118, 151), pt(152, 151), 9)}
    </g>
  ),
  front: (s) => bbEnd(s.haN, 13),
};

export const declinePress: Anim = {
  view: 'side',
  hi: ['chest', 'triceps'],
  frames: [
    F({ hip: [140, 118], t: -110, aN: ik(99, 82), lN: fk(108, 180) }, 0.9, 0.2),
    F({ hip: [140, 118], t: -110, aN: ik(103, 118), lN: fk(108, 180) }, 0.8, 0.15),
  ],
  back: () => (
    <g>
      {post(98, 150)}
      {post(146, 132)}
      {ln(pt(152, 126), pt(184, 156), 4)}
      {pad(pt(152, 125), pt(74, 153), 10)}
    </g>
  ),
  front: (s) => (
    <g>
      <circle cx={186} cy={160} r={6} fill="var(--eq2)" stroke="var(--eq)" strokeWidth={2} />
      {bbEnd(s.haN, 13)}
    </g>
  ),
};

export const pecFly: Anim = {
  view: 'front',
  hi: ['chest'],
  frames: [
    F({ ...SEAT_FRONT, aN: fk(95, 2, 1, 1) }, 0.9, 0.2),
    F({ ...SEAT_FRONT, aN: fk(95, 2, -0.42, 1) }, 0.9, 0.35),
  ],
  back: (s) => (
    <g>
      {box(104, 70, 32, 68, 6)}
      {ln(pt(60, 16), pt(180, 16), 5)}
      {frontSeat}
      {ln(pt(134, 16), s.haN, 2.5)}
      {ln(pt(106, 16), s.haF, 2.5)}
      {sidePad(s.elN, s.haN, -5, 6)}
      {sidePad(s.elF, s.haF, 5, 6)}
    </g>
  ),
};

export const pullover: Anim = {
  view: 'side',
  hi: ['chest', 'lats', 'triceps'],
  frames: [
    F({ hip: [140, 138], t: -90, aN: fk(5, 5), lN: ik(176, 183) }, 1.0, 0.2),
    F({ hip: [140, 138], t: -90, aN: fk(-100, -100), lN: ik(176, 183) }, 1.0, 0.25),
  ],
  back: () => bench(70, 150, 148),
  front: (s) => {
    const a = angleOf(s.shN, s.haN);
    return db(add(s.haN, mul(dir(a), 6)), a, 16);
  },
};

/* ============================== TRICEPS ============================== */

const overhead = (single: boolean): Anim => ({
  view: 'side',
  hi: ['triceps'],
  frames: [
    F({ ...STAND_SIDE, aN: fk(-8, 192), aF: single ? fk(165, 140) : undefined }, 0.9, 0.2),
    F({ ...STAND_SIDE, aN: fk(-8, 352), aF: single ? fk(165, 140) : undefined }, 0.8, 0.3),
  ],
  front: (s) => {
    const a = angleOf(s.elN, s.haN);
    return single ? db(s.haN, a + 90) : db(add(s.haN, mul(dir(a), 6)), a, 16);
  },
});
export const tricepExtBoth = overhead(false);
export const tricepExtSingle = overhead(true);

export const dips: Anim = {
  view: 'side',
  hi: ['triceps', 'chest'],
  frames: [
    F({ hip: [112.7, 103.3], t: 10, aN: ik(120, 108), lN: fk(172, 215) }, 0.8, 0.2),
    F({ hip: [109, 131.6], t: 18, aN: ik(120, 108), lN: fk(172, 215) }, 0.9, 0.15),
  ],
  back: () => (
    <g>
      {post(80, 108)}
      {post(160, 108)}
      {ln(pt(70, 108), pt(170, 108), 5)}
    </g>
  ),
};

export const pushDown: Anim = {
  view: 'side',
  hi: ['triceps'],
  frames: [
    F({ hip: [116, 108], t: 8, aN: fk(172, 62), lN: ik(126, 183), lF: ik(106, 183) }, 0.8, 0.15),
    F({ hip: [116, 108], t: 8, aN: fk(172, 178), lN: ik(126, 183), lF: ik(106, 183) }, 0.8, 0.3),
  ],
  back: () => (
    <g>
      {post(196, 12, 188, 5)}
      {pulley(pt(188, 22))}
    </g>
  ),
  front: (s) => (
    <g>
      {cable(pt(188, 22), s.haN)}
      {ln(add(s.haN, pt(-7, 0)), add(s.haN, pt(7, 0)), 3.5)}
    </g>
  ),
};

/* ============================== LEGS ============================== */

export const squat: Anim = {
  view: 'side',
  hi: ['quads', 'glutes'],
  frames: [
    F({ hip: [118, 108], t: 3, aN: fk(90, 90), lN: ik(120, 183) }, 1.0, 0.2),
    F({ hip: [92, 148], t: 38, aN: fk(80, 80), lN: ik(120, 183) }, 0.9, 0.2),
  ],
};

export const lunge: Anim = {
  view: 'side',
  hi: ['quads', 'glutes', 'hamstrings'],
  frames: [
    F({ hip: [120, 112], t: 0, aN: fk(180, 180), lN: ik(152, 183), lF: ik(82, 176), f: 100, fF: 150 }, 1.0, 0.2),
    F({ hip: [118, 142], t: 0, aN: fk(180, 180), lN: ik(152, 183), lF: ik(82, 176), f: 100, fF: 150 }, 0.9, 0.2),
  ],
};

export const legPress: Anim = {
  view: 'side',
  hi: ['quads', 'glutes'],
  frames: [
    F({ hip: [70, 150], t: -40, aN: fk(150, 95), lN: ik(111, 109), f: -45 }, 0.9, 0.15),
    F({ hip: [70, 150], t: -40, aN: fk(150, 95), lN: ik(121.6, 98.4), f: -45 }, 0.9, 0.25),
  ],
  back: () => (
    <g>
      {ln(pt(110, 176), pt(222, 64), 5)}
      {post(160, 126)}
      {post(212, 76)}
      {ln(pt(24, 176), pt(130, 176), 5)}
      {post(40, 176)}
      {pad(pt(70, 160), pt(28, 110), 10)}
      {pad(pt(62, 158), pt(92, 158), 10)}
    </g>
  ),
  front: (s) => {
    const legDir = pt(0.707, -0.707);
    const u = pt(0.707, 0.707);
    const c = add(s.anN, mul(legDir, 5));
    return (
      <g>
        {ln(add(c, mul(u, -20)), add(c, mul(u, 16)), 6)}
        {ln(add(c, mul(u, 10)), add(add(c, mul(u, 10)), mul(u, 22)), 4)}
        {knob(s.haN, 3.6)}
      </g>
    );
  },
};

const rollerAt = (s: { knN: { x: number; y: number }; anN: { x: number; y: number } }, side: 1 | -1) =>
  add(s.anN, mul(dir(angleOf(s.knN, s.anN) + 90 * side), 7));

export const legCurl: Anim = {
  view: 'side',
  hi: ['hamstrings'],
  frames: [
    F({ hip: [86, 136], t: -10, aN: fk(165, 100), lN: fk(92, 100), f: 10 }, 0.9, 0.15),
    F({ hip: [86, 136], t: -10, aN: fk(165, 100), lN: fk(92, 196), f: 110 }, 0.9, 0.25),
  ],
  back: () => (
    <g>
      {post(86, 146)}
      {pad(pt(70, 140), pt(62, 84), 10)}
      {box(62, 141, 66, 7, 3)}
    </g>
  ),
  front: (s) => {
    const r = rollerAt(s, 1);
    return (
      <g>
        {pad(pt(102, 125), pt(128, 125), 8)}
        {ln(s.knN, r, 3.5)}
        <circle cx={r.x} cy={r.y} r={6.5} fill="var(--eq2)" stroke="var(--eq)" strokeWidth={2} />
      </g>
    );
  },
};

export const legExtension: Anim = {
  view: 'side',
  hi: ['quads'],
  frames: [
    F({ hip: [86, 136], t: -6, aN: fk(170, 120), lN: fk(92, 182), f: 95 }, 0.9, 0.15),
    F({ hip: [86, 136], t: -6, aN: fk(170, 120), lN: fk(92, 96), f: 10 }, 0.9, 0.3),
  ],
  back: () => (
    <g>
      {post(86, 146)}
      {pad(pt(72, 140), pt(66, 84), 10)}
      {box(62, 141, 66, 7, 3)}
    </g>
  ),
  front: (s) => {
    const r = rollerAt(s, -1);
    return (
      <g>
        {ln(s.knN, r, 3.5)}
        <circle cx={r.x} cy={r.y} r={6.5} fill="var(--eq2)" stroke="var(--eq)" strokeWidth={2} />
      </g>
    );
  },
};

const hipMachine = (outer: boolean): Anim => {
  const wide: Pose = { hip: [120, 132], t: 0, aN: fk(160, 175), lN: fk(128, 180, 0.55) };
  const narrow: Pose = { ...wide, lN: fk(168, 180, 0.4) };
  const o = outer ? 1 : -1;
  return {
    view: 'front',
    hi: outer ? ['abductors', 'glutes'] : ['adductors'],
    frames: outer ? [F(narrow, 0.9, 0.2), F(wide, 0.9, 0.3)] : [F(wide, 0.9, 0.2), F(narrow, 0.9, 0.3)],
    back: () => (
      <g>
        {box(104, 66, 32, 68, 6)}
        {post(120, 142)}
        {box(94, 134, 52, 9, 3)}
      </g>
    ),
    front: (s) => (
      <g>
        {pad(add(s.knN, pt(5 * o, -10)), add(s.knN, pt(5 * o, 12)), 6)}
        {pad(add(s.knF, pt(-5 * o, -10)), add(s.knF, pt(-5 * o, 12)), 6)}
        {knob(s.haN, 3.4)}
        {knob(s.haF, 3.4)}
      </g>
    ),
  };
};
export const hipAdductor = hipMachine(false);
export const hipAbductor = hipMachine(true);

export const calfRaise: Anim = {
  view: 'side',
  hi: ['calves'],
  frames: [
    F({ hip: [118, 108], t: 0, aN: fk(180, 180), lN: ik(120, 183), f: 100 }, 0.7, 0.2),
    F({ hip: [118, 101], t: 0, aN: fk(180, 180), lN: ik(120, 176), f: 140 }, 0.6, 0.45),
  ],
};

/* ======================================================================
 * ADDITIONS: variants of the exercises above, plus new exercises.
 * ====================================================================== */

const rope = (h: { x: number; y: number }) => (
  <g>
    {ln(h, add(h, pt(-3, 8)), 3)}
    {ln(h, add(h, pt(3, 8)), 3)}
  </g>
);
const pullRig = (
  <g>
    {post(44, 22, 188, 5)}
    {post(196, 22, 188, 5)}
    {ln(pt(36, 30), pt(204, 30), 4)}
  </g>
);

/* ----------------------------- Pull-up variants ----------------------------- */

const pullFrames = (x: number, low: number, high = 84, legs = fk(176, 183), legsTop = fk(170, 188)): Frame[] => [
  F({ hip: [120, low], t: 0, aN: ik(x, 30), lN: legs }, 1.1, 0.25),
  F({ hip: [120, high], t: 0, aN: ik(x, 30), lN: legsTop }, 0.9, 0.35),
];
export const chinUp: Anim = { ...pullUp, hi: ['biceps', 'lats'], frames: pullFrames(140, 128) };
export const pullUpWide: Anim = { ...pullUp, hi: ['lats', 'upperBack'], frames: pullFrames(172, 114, 80) };
export const pullUpAssisted: Anim = {
  ...pullUp,
  frames: pullFrames(156, 122, 84, fk(174, 180, 0.7, 0.25), fk(174, 180, 0.7, 0.25)),
  back: () => pullRig,
  front: (s) => {
    const y = s.knN.y + 7;
    return (
      <g>
        {ln(pt(120, y), pt(120, 188), 4)}
        {pad(pt(s.knF.x - 9, y), pt(s.knN.x + 9, y), 7)}
      </g>
    );
  },
};
export const pullUpBand: Anim = {
  ...pullUp,
  back: () => pullRig,
  front: (s) => (
    <g>
      {ln(pt(113, 31), add(s.anN, pt(-3, 5)), 2.5, 'var(--hi)')}
      {ln(pt(127, 31), add(s.anN, pt(4, 5)), 2.5, 'var(--hi)')}
    </g>
  ),
};

/* --------------------------- Seated row / pulldown --------------------------- */

export const seatedRowWide: Anim = {
  ...seatedRow,
  hi: ['upperBack', 'delts', 'lats'],
  frames: [
    F({ hip: [100, 140], t: 7, aN: ik(156, 102), lN: ik(160, 168), p: { w: 0 } }, 0.9, 0.15),
    F({ hip: [100, 140], t: -5, aN: ik(112, 96), lN: ik(160, 168), p: { w: 1 } }, 1.0, 0.35),
  ],
  front: (s) => (
    <g>
      {knob(s.haN, 4.5)}
      {knob(s.haN, 2)}
    </g>
  ),
};

const pulldown = (top: [number, number], bot: [number, number], aF?: IK): Frame[] => [
  F({ ...SEAT_FRONT, aN: ik(...top), aF }, 1.0, 0.2),
  F({ ...SEAT_FRONT, aN: ik(...bot), aF }, 0.9, 0.35),
];
const pulldownBack = () => (
  <g>
    {ln(pt(90, 8), pt(150, 8), 5)}
    {pulley(pt(120, 12))}
    {frontSeat}
  </g>
);
export const latPulldownClose: Anim = {
  view: 'front',
  hi: ['lats', 'biceps'],
  frames: pulldown([128, 40], [127, 88]),
  back: pulldownBack,
  front: (s) => {
    const mid = pt((s.haN.x + s.haF.x) / 2, Math.min(s.haN.y, s.haF.y) - 6);
    return (
      <g>
        {cable(pt(120, 12), mid)}
        {ln(mid, s.haN, 3)}
        {ln(mid, s.haF, 3)}
        {knob(s.haN, 3.4)}
        {knob(s.haF, 3.4)}
      </g>
    );
  },
};
export const latPulldownReverse: Anim = {
  view: 'front',
  hi: ['lats', 'biceps'],
  frames: pulldown([146, 40], [143, 90]),
  back: pulldownBack,
  front: (s) => (
    <g>
      {cable(pt(120, 12), pt(120, s.haN.y))}
      {ln(add(s.haF, pt(-10, 0)), add(s.haN, pt(10, 0)), 3.5)}
    </g>
  ),
};
export const latPulldownSingle: Anim = {
  view: 'front',
  hi: ['lats', 'biceps'],
  frames: pulldown([142, 38], [142, 90], ik(104, 128)),
  back: () => (
    <g>
      {ln(pt(110, 8), pt(160, 8), 5)}
      {pulley(pt(142, 12))}
      {frontSeat}
    </g>
  ),
  front: (s) => (
    <g>
      {cable(pt(142, 12), s.haN)}
      {knob(s.haN, 3.6)}
    </g>
  ),
};

/* ------------------------------ Shrug variants ------------------------------ */

export const shrugsBarbell: Anim = { ...shrugs, front: (s) => bbFront(s.haF, s.haN, 30) };
export const shrugsTrapBar: Anim = {
  ...shrugs,
  front: (s) => {
    const a = add(s.haF, pt(-8, 0));
    const b = add(s.haN, pt(8, 0));
    const pts = [a, add(s.haF, pt(-2, -6)), add(s.haN, pt(2, -6)), b, add(s.haN, pt(2, 6)), add(s.haF, pt(-2, 6))];
    return (
      <g>
        <polygon points={pts.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke="var(--eq)" strokeWidth={2.5} />
        {ln(add(a, pt(-22, 0)), a, 3)}
        {ln(b, add(b, pt(22, 0)), 3)}
        <rect x={a.x - 20} y={a.y - 12} width={6} height={24} rx={2} fill="var(--eq)" />
        <rect x={b.x + 14} y={b.y - 12} width={6} height={24} rx={2} fill="var(--eq)" />
      </g>
    );
  },
};
export const shrugsMachine: Anim = {
  ...shrugs,
  back: () => (
    <g>
      {post(56, 20)}
      {post(184, 20)}
    </g>
  ),
  front: (s) => (
    <g>
      {ln(pt(56, s.haF.y), s.haF, 3.5)}
      {ln(pt(184, s.haN.y), s.haN, 3.5)}
      {knob(s.haN, 3.6)}
      {knob(s.haF, 3.6)}
    </g>
  ),
};

/* --------------------------- Reverse fly variants --------------------------- */

export const reverseFlyDumbbell: Anim = {
  view: 'side',
  hi: ['delts', 'upperBack'],
  frames: [
    F({ hip: [100, 120], t: 72, aN: fk(180, 182, 1, 1), lN: ik(118, 183) }, 0.9, 0.2),
    F({ hip: [100, 120], t: 72, aN: fk(180, 182, 0.12, 0.12), lN: ik(118, 183) }, 0.9, 0.4),
  ],
  front: (s) => dbEnd(s.haN),
};
export const reverseFlyCable: Anim = {
  view: 'front',
  hi: ['delts', 'upperBack'],
  frames: [
    F({ ...STAND_FRONT, aN: fk(95, 95, -0.25, -0.25) }, 0.9, 0.2),
    F({ ...STAND_FRONT, aN: fk(95, 95, 1, 1) }, 0.9, 0.4),
  ],
  back: () => (
    <g>
      {post(20, 10, 188, 5)}
      {post(220, 10, 188, 5)}
      {pulley(pt(27, 62))}
      {pulley(pt(213, 62))}
    </g>
  ),
  front: (s) => (
    <g>
      {cable(pt(27, 62), s.haN)}
      {cable(pt(213, 62), s.haF)}
      {knob(s.haN, 3.4)}
      {knob(s.haF, 3.4)}
    </g>
  ),
};

/* ---------------------------- Swing variants ---------------------------- */

export const dbSwing: Anim = {
  ...kbSwing,
  front: (s) => {
    const a = angleOf(s.elN, s.haN);
    return db(add(s.haN, mul(dir(a), 7)), a, 16);
  },
};
export const kbSwingSingle: Anim = {
  ...kbSwing,
  frames: kbSwing.frames.map((f) => ({ ...f, pose: { ...f.pose, aF: fk(f.pose.t > 30 ? 175 : 175, 168) } })),
};

/* ----------------------------- Curl variants ----------------------------- */

const lowPulleyFront = () => (
  <g>
    {post(204, 140)}
    {pulley(pt(196, 180))}
  </g>
);
export const curlCable: Anim = {
  ...curlDumbbell,
  back: lowPulleyFront,
  front: (s) => (
    <g>
      {cable(pt(196, 180), s.haN)}
      {knob(s.haN, 4)}
    </g>
  ),
};
export const hammerCurlRope: Anim = {
  ...curlDumbbell,
  back: lowPulleyFront,
  front: (s) => (
    <g>
      {cable(pt(196, 180), s.haN)}
      {rope(s.haN)}
    </g>
  ),
};
export const preacherBarbell: Anim = { ...curlMachine, hi: ['biceps', 'forearms'], front: (s) => bbEnd(s.haN, 12) };
export const preacherDumbbell: Anim = { ...curlMachine, hi: ['biceps', 'forearms'], front: (s) => dbEnd(s.haN, 6.5) };

export const concentrationCurl: Anim = {
  view: 'side',
  hi: ['biceps'],
  frames: [
    F({ hip: [90, 145], t: 45, aN: fk(178, 178), aF: ik(130, 142), lN: fk(92, 180) }, 0.9, 0.2),
    F({ hip: [90, 145], t: 45, aN: fk(178, 28), aF: ik(130, 142), lN: fk(92, 180) }, 0.9, 0.35),
  ],
  back: () => bench(50, 112, 155),
  front: (s) => dbEnd(s.haN, 6.5),
};

/* ---------------------------- Shoulder variants ---------------------------- */

export const pressMachine: Anim = {
  view: 'front',
  hi: ['delts', 'triceps'],
  frames: [F({ ...SEAT_FRONT, aN: fk(98, 4) }, 0.9, 0.2), F({ ...SEAT_FRONT, aN: fk(18, 4) }, 0.8, 0.3)],
  back: () => (
    <g>
      {box(104, 70, 32, 68, 6)}
      {frontSeat}
      {post(60, 20)}
      {post(180, 20)}
    </g>
  ),
  front: (s) => (
    <g>
      {ln(pt(60, s.haF.y + 10), s.haF, 3.5)}
      {ln(pt(180, s.haN.y + 10), s.haN, 3.5)}
      {knob(s.haN, 3.6)}
      {knob(s.haF, 3.6)}
    </g>
  ),
};
export const arnoldPress: Anim = {
  view: 'front',
  hi: ['delts', 'triceps'],
  frames: [
    F({ ...STAND_FRONT, aN: fk(178, 2, 0.35, 1) }, 0.55, 0.2),
    F({ ...STAND_FRONT, aN: fk(98, 4) }, 0.7),
    F({ ...STAND_FRONT, aN: fk(18, 4) }, 0.7, 0.3),
    F({ ...STAND_FRONT, aN: fk(98, 4) }, 0.55),
  ],
  front: pressDumbbell.front,
};
export const frontRaiseDumbbell: Anim = { ...frontRaisePlate, front: (s) => dbEnd(s.haN, 6) };
export const frontRaiseCable: Anim = {
  ...frontRaisePlate,
  back: () => (
    <g>
      {post(64, 120)}
      {pulley(pt(72, 182))}
    </g>
  ),
  front: (s) => (
    <g>
      {cable(pt(72, 182), s.haN)}
      {knob(s.haN, 3.8)}
    </g>
  ),
};

export const uprightRow: Anim = {
  view: 'front',
  hi: ['delts', 'traps'],
  frames: [F({ ...STAND_FRONT, aN: ik(127, 114) }, 0.9, 0.2), F({ ...STAND_FRONT, aN: ik(127, 66) }, 0.8, 0.3)],
  front: (s) => bbFront(s.haF, s.haN, 30),
};

/* ----------------------------- Chest variants ----------------------------- */

const lyingBench = (front: Anim['front'], hi: Anim['hi'] = ['chest', 'triceps', 'delts']): Anim => ({
  view: 'side',
  hi,
  frames: [
    F({ hip: [140, 138], t: -90, aN: ik(94, 85), lN: ik(176, 183) }, 0.9, 0.2),
    F({ hip: [140, 138], t: -90, aN: ik(98, 124), lN: ik(176, 183) }, 0.9, 0.15),
  ],
  back: () => (
    <g>
      {post(64, 76, 188, 3)}
      {ln(pt(64, 86), pt(72, 86), 3)}
      {bench(70, 150, 148)}
    </g>
  ),
  front,
});
export const benchBarbell = lyingBench((s) => bbEnd(s.haN, 13));
export const benchDumbbell = lyingBench((s) => dbEnd(s.haN, 7));
export const closeGripBench = lyingBench((s) => bbEnd(s.haN, 13), ['triceps', 'chest']);

export const inclineDumbbell: Anim = { ...inclinePress, front: (s) => dbEnd(s.haN, 7) };
export const inclineMachine: Anim = {
  ...inclinePress,
  back: () => (
    <g>
      {post(170, 120)}
      {post(88, 126)}
      {post(140, 154)}
      {pad(pt(128, 150), pt(70, 109), 10)}
      {pad(pt(118, 151), pt(152, 151), 9)}
    </g>
  ),
  front: (s) => (
    <g>
      {ln(pt(170, 128), s.haN, 3.5)}
      {knob(s.haN, 4)}
    </g>
  ),
};
export const declineDumbbell: Anim = { ...declinePress, front: (s) => <g><circle cx={186} cy={160} r={6} fill="var(--eq2)" stroke="var(--eq)" strokeWidth={2} />{dbEnd(s.haN, 7)}</g> };
export const declineMachine: Anim = {
  ...declinePress,
  front: (s) => (
    <g>
      <circle cx={186} cy={160} r={6} fill="var(--eq2)" stroke="var(--eq)" strokeWidth={2} />
      {post(40, 60)}
      {ln(pt(40, 70), s.haN, 3.5)}
      {knob(s.haN, 4)}
    </g>
  ),
};

export const dumbbellFly: Anim = {
  view: 'side',
  hi: ['chest'],
  frames: [
    F({ hip: [140, 138], t: -90, aN: fk(2, -6, 1, 1), lN: ik(176, 183) }, 1.0, 0.2),
    F({ hip: [140, 138], t: -90, aN: fk(2, -6, -0.12, -0.12), lN: ik(176, 183) }, 1.0, 0.25),
  ],
  back: () => bench(70, 150, 148),
  front: (s) => dbEnd(s.haN, 7),
};
export const cableCrossover: Anim = {
  view: 'front',
  hi: ['chest'],
  frames: [F({ ...STAND_FRONT, aN: ik(176, 70) }, 0.9, 0.2), F({ ...STAND_FRONT, aN: ik(127, 112) }, 0.9, 0.35)],
  back: () => (
    <g>
      {post(20, 10, 188, 5)}
      {post(220, 10, 188, 5)}
      {pulley(pt(27, 20))}
      {pulley(pt(213, 20))}
    </g>
  ),
  front: (s) => (
    <g>
      {cable(pt(213, 20), s.haN)}
      {cable(pt(27, 20), s.haF)}
      {knob(s.haN, 3.4)}
      {knob(s.haF, 3.4)}
    </g>
  ),
};

/* ---------------------------- Push-up variants ---------------------------- */

export const pushUpKnee: Anim = {
  view: 'side',
  hi: ['chest', 'triceps', 'delts'],
  frames: [
    F({ hip: [108, 156], t: 62, aN: ik(150, 182), lN: ik(50, 166), f: -60 }, 0.8, 0.15),
    F({ hip: [112, 172], t: 77, aN: ik(150, 182), lN: ik(54, 170), f: -60 }, 0.8, 0.15),
  ],
};
export const pushUpIncline: Anim = {
  view: 'side',
  hi: ['chest', 'triceps', 'delts'],
  frames: [
    F({ hip: [88.2, 124.5], t: 40, aN: ik(119, 142), lN: ik(40, 182), f: 140 }, 0.8, 0.15),
    F({ hip: [107.4, 149.1], t: 64, aN: ik(119, 142), lN: ik(40, 182), f: 140 }, 0.8, 0.15),
  ],
  back: () => bench(100, 150, 146),
};
export const pushUpDecline: Anim = {
  view: 'side',
  hi: ['chest', 'delts', 'triceps'],
  frames: [
    F({ hip: [114, 135.6], t: 80.5, aN: ik(162, 182), lN: ik(40, 145), f: 150 }, 0.8, 0.15),
    F({ hip: [114.5, 156.5], t: 96.5, aN: ik(166, 182), lN: ik(40, 145), f: 150 }, 0.8, 0.15),
  ],
  back: () => bench(18, 64, 152),
};
export const pushUpDiamond: Anim = {
  ...pushUp,
  hi: ['triceps', 'chest'],
  frames: pushUp.frames.map((f) => ({ ...f, pose: { ...f.pose, aN: ik(142, 182) } })),
};

/* ---------------------------- Triceps variants ---------------------------- */

const pushDownBack = pushDown.back;
export const pushDownRope: Anim = {
  ...pushDown,
  front: (s) => (
    <g>
      {cable(pt(188, 22), s.haN)}
      {rope(s.haN)}
    </g>
  ),
};
export const pushDownSingle: Anim = {
  ...pushDown,
  frames: pushDown.frames.map((f) => ({ ...f, pose: { ...f.pose, aF: fk(168, 160) } })),
  back: pushDownBack,
  front: (s) => (
    <g>
      {cable(pt(188, 22), s.haN)}
      {knob(s.haN, 3.6)}
    </g>
  ),
};
export const tricepExtCable: Anim = {
  view: 'side',
  hi: ['triceps'],
  frames: [
    F({ hip: [110, 112], t: 22, aN: fk(30, 212), lN: ik(132, 183), lF: ik(90, 183) }, 0.9, 0.2),
    F({ hip: [110, 112], t: 22, aN: fk(30, 386), lN: ik(132, 183), lF: ik(90, 183) }, 0.8, 0.3),
  ],
  back: () => (
    <g>
      {post(22, 20, 188, 5)}
      {pulley(pt(30, 100))}
    </g>
  ),
  front: (s) => (
    <g>
      {cable(pt(30, 100), s.haN)}
      {rope(s.haN)}
    </g>
  ),
};
export const dipsAssisted: Anim = {
  ...dips,
  front: (s) => {
    const y = s.knN.y + 7;
    return (
      <g>
        {ln(pt(s.knN.x + 4, y), pt(s.knN.x + 4, 188), 3)}
        {pad(pt(s.knN.x - 10, y), pt(s.knN.x + 14, y), 6)}
      </g>
    );
  },
};
export const benchDips: Anim = {
  view: 'side',
  hi: ['triceps', 'chest'],
  frames: [
    F({ hip: [95, 132], t: -4, aN: ik(86, 138), lN: ik(150, 183), f: 60 }, 0.9, 0.15),
    F({ hip: [95, 160], t: -4, aN: ik(86, 138), lN: ik(150, 183), f: 60 }, 0.9, 0.2),
  ],
  back: () => bench(30, 92, 142),
};
export const skullCrusher: Anim = {
  view: 'side',
  hi: ['triceps'],
  frames: [
    F({ hip: [140, 138], t: -90, aN: fk(-10, -10), lN: ik(176, 183) }, 0.9, 0.2),
    F({ hip: [140, 138], t: -90, aN: fk(-10, -140), lN: ik(176, 183) }, 0.9, 0.2),
  ],
  back: () => bench(70, 150, 148),
  front: (s) => bbEnd(s.haN, 11),
};
export const kickback: Anim = {
  view: 'side',
  hi: ['triceps'],
  frames: [
    F({ hip: [100, 122], t: 70, aN: fk(-100, 180), aF: ik(142, 140), lN: ik(118, 183) }, 0.8, 0.15),
    F({ hip: [100, 122], t: 70, aN: fk(-100, 262), aF: ik(142, 140), lN: ik(118, 183) }, 0.8, 0.35),
  ],
  front: (s) => db(s.haN, angleOf(s.elN, s.haN) + 90),
};

/* ------------------------------ Leg variants ------------------------------ */

const backBar = (t: number): FK => fk(t + 197, t - 20);
const barOnBack = (s: { sc: { x: number; y: number }; t: number }) => add(add(s.sc, mul(dir(s.t - 90), 11)), mul(dir(s.t + 180), 2));
export const squatBarbell: Anim = {
  ...squat,
  frames: [
    F({ hip: [118, 108], t: 3, aN: backBar(3), lN: ik(120, 183) }, 1.0, 0.2),
    F({ hip: [92, 148], t: 38, aN: backBar(38), lN: ik(120, 183) }, 0.9, 0.2),
  ],
  front: (s) => bbEnd(barOnBack(s), 11),
};
export const squatSmith: Anim = {
  ...squatBarbell,
  back: () => (
    <g>
      {post(100, 12, 188, 3)}
      {post(140, 12, 188, 3)}
      {ln(pt(96, 12), pt(144, 12), 4)}
    </g>
  ),
  front: (s) => {
    const c = barOnBack(s);
    return (
      <g>
        {ln(pt(100, c.y), pt(140, c.y), 3)}
        {bbEnd(c, 11)}
      </g>
    );
  },
};
const goblet = (t: number): FK => fk(t + 172, t + 12);
const gobletFrames: Frame[] = [
  F({ hip: [118, 108], t: 3, aN: goblet(3), lN: ik(120, 183) }, 1.0, 0.2),
  F({ hip: [98, 150], t: 25, aN: goblet(25), lN: ik(120, 183) }, 0.9, 0.2),
];
export const squatGobletDb: Anim = { ...squat, frames: gobletFrames, front: (s) => db(add(s.haN, pt(4, -2)), s.t) };
export const squatGobletKb: Anim = { ...squat, frames: gobletFrames, front: (s) => kb(add(s.haN, pt(4, -4)), 180) };

export const lungeDumbbell: Anim = { ...lunge, front: (s) => dbEnd(s.haN, 6) };
const lungeStand: Pose = { hip: [128, 108], t: 0, aN: fk(180, 180), lN: ik(130, 183), lF: ik(126, 183), f: 100, fF: 100 };
export const lungeReverse: Anim = {
  view: 'side',
  hi: ['quads', 'glutes', 'hamstrings'],
  frames: [
    F(lungeStand, 0.4, 0.2),
    F({ ...lungeStand, hip: [116, 112], lF: ik(90, 166), fF: 130 }, 0.45),
    F({ ...lungeStand, hip: [98, 142], lF: ik(62, 176), fF: 150 }, 0.5, 0.2),
    F({ ...lungeStand, hip: [116, 112], lF: ik(90, 166), fF: 130 }, 0.45),
  ],
};
const walkA: Pose = { hip: [118, 142], t: 0, aN: fk(180, 180), lN: ik(152, 183), lF: ik(82, 176), f: 100, fF: 150 };
export const lungeWalking: Anim = {
  view: 'side',
  hi: ['quads', 'glutes', 'hamstrings'],
  frames: [
    F(walkA, 0.55, 0.15),
    F({ ...walkA, hip: [120, 110], lN: ik(118, 183), lF: ik(132, 166), f: 100, fF: 110 }, 0.55),
    F({ ...walkA, lN: ik(82, 176), lF: ik(152, 183), f: 150, fF: 100 }, 0.55, 0.15),
    F({ ...walkA, hip: [120, 110], lN: ik(132, 166), lF: ik(118, 183), f: 110, fF: 100 }, 0.55),
  ],
};

export const legCurlLying: Anim = {
  view: 'side',
  hi: ['hamstrings'],
  frames: [
    F({ hip: [100, 140], t: 90, aN: fk(150, 120), lN: fk(-90, -90), f: 180 }, 0.9, 0.15),
    F({ hip: [100, 140], t: 90, aN: fk(150, 120), lN: fk(-90, 12), f: 80 }, 0.9, 0.25),
  ],
  back: () => (
    <g>
      {post(60, 150)}
      {post(160, 150)}
      {pad(pt(44, 151), pt(174, 151), 8)}
    </g>
  ),
  front: (s) => {
    const r = rollerAt(s, 1);
    return (
      <g>
        {ln(s.knN, r, 3.5)}
        <circle cx={r.x} cy={r.y} r={6.5} fill="var(--eq2)" stroke="var(--eq)" strokeWidth={2} />
      </g>
    );
  },
};
export const legCurlStanding: Anim = {
  view: 'side',
  hi: ['hamstrings'],
  frames: [
    F({ hip: [112, 108], t: 10, aN: ik(150, 100), lN: fk(180, 180), lF: ik(110, 183), f: 100 }, 0.9, 0.15),
    F({ hip: [112, 108], t: 10, aN: ik(150, 100), lN: fk(180, 300), lF: ik(110, 183), f: 30 }, 0.9, 0.25),
  ],
  back: () => (
    <g>
      {post(166, 96)}
      {pad(pt(144, 100), pt(172, 100), 8)}
      {pad(pt(124, 136), pt(124, 156), 6)}
    </g>
  ),
  front: (s) => {
    const r = rollerAt(s, 1);
    return (
      <g>
        {ln(s.knN, r, 3.5)}
        <circle cx={r.x} cy={r.y} r={6.5} fill="var(--eq2)" stroke="var(--eq)" strokeWidth={2} />
      </g>
    );
  },
};

const seatedCalf = { hip: [88, 142] as [number, number], t: 0, aN: ik(126, 134) };
export const calfRaiseSeated: Anim = {
  view: 'side',
  hi: ['calves'],
  frames: [
    F({ ...seatedCalf, lN: ik(128, 174), f: 100 }, 0.7, 0.2),
    F({ ...seatedCalf, lN: ik(128, 167), f: 140 }, 0.6, 0.45),
  ],
  back: () => (
    <g>
      {post(84, 152)}
      {box(62, 148, 42, 7, 3)}
      {box(122, 177, 28, 11, 2)}
    </g>
  ),
  front: (s) => {
    const a = add(s.knN, pt(-8, -8));
    const b = add(s.knN, pt(12, -8));
    return (
      <g>
        {ln(b, pt(156, 188), 3.5)}
        {pad(a, b, 6)}
      </g>
    );
  },
};
export const calfRaiseMachine: Anim = {
  ...calfRaise,
  frames: calfRaise.frames.map((f) => ({ ...f, pose: { ...f.pose, aN: fk(150, 10) } })),
  back: () => post(160, 24),
  front: (s) => {
    const a = add(s.sc, pt(-9, -6));
    const b = add(s.sc, pt(9, -6));
    return (
      <g>
        {ln(b, pt(160, b.y), 3.5)}
        {pad(a, b, 7)}
      </g>
    );
  },
};
export const calfRaiseSingle: Anim = {
  view: 'side',
  hi: ['calves'],
  frames: [
    F({ hip: [118, 98], t: 0, aN: fk(180, 180), aF: fk(70, 80), lN: ik(120, 173), lF: fk(180, 250), f: 100 }, 0.7, 0.2),
    F({ hip: [118, 91], t: 0, aN: fk(180, 180), aF: fk(70, 80), lN: ik(120, 166), lF: fk(180, 250), f: 140 }, 0.6, 0.45),
  ],
  back: () => (
    <g>
      {post(178, 40, 188, 6)}
      {box(104, 176, 36, 12, 2)}
    </g>
  ),
  front: (s) => dbEnd(s.haN, 6),
};

/* ======================================================================
 * NEW EXERCISES
 * ====================================================================== */

/* ------------------------------- Back ------------------------------- */

export const deadlift: Anim = {
  view: 'side',
  hi: ['glutes', 'hamstrings', 'lowerBack', 'quads'],
  frames: [
    F({ hip: [98, 138], t: 60, aN: ik(130, 166), lN: ik(120, 183) }, 1.0, 0.25),
    F({ hip: [118, 108], t: 0, aN: ik(124, 113), lN: ik(120, 183) }, 1.0, 0.35),
  ],
  front: (s) => bbEnd(s.haN, 20),
};

const rdlFrames: Frame[] = [
  F({ hip: [118, 108], t: 0, aN: ik(122, 113), lN: ik(120, 183) }, 1.1, 0.2),
  F({ hip: [98, 114], t: 78, aN: ik(136, 156), lN: ik(120, 183) }, 1.0, 0.3),
];
export const rdlBarbell: Anim = { view: 'side', hi: ['hamstrings', 'glutes', 'lowerBack'], frames: rdlFrames, front: (s) => bbEnd(s.haN, 13) };
export const rdlDumbbell: Anim = { ...rdlBarbell, front: (s) => dbEnd(s.haN, 6.5) };

const rowFrames: Frame[] = [
  F({ hip: [100, 122], t: 60, aN: ik(140, 151), lN: ik(118, 183) }, 0.8, 0.15),
  F({ hip: [100, 122], t: 60, aN: ik(124, 120), lN: ik(118, 183) }, 0.9, 0.35),
];
export const bentOverRowBarbell: Anim = { view: 'side', hi: ['upperBack', 'lats', 'biceps', 'lowerBack'], frames: rowFrames, front: (s) => bbEnd(s.haN, 13) };
export const bentOverRowDumbbell: Anim = { ...bentOverRowBarbell, front: (s) => dbEnd(s.haN, 6.5) };
export const tBarRow: Anim = {
  ...bentOverRowBarbell,
  front: (s) => {
    const anchor = pt(26, 185);
    const end = along(anchor, s.haN, Math.hypot(s.haN.x - anchor.x, s.haN.y - anchor.y) + 10);
    return (
      <g>
        {ln(anchor, end, 3.5)}
        {bbEnd(end, 14)}
        {knob(s.haN, 3.6)}
      </g>
    );
  },
};
export const singleArmRow: Anim = {
  view: 'side',
  hi: ['lats', 'upperBack', 'biceps'],
  frames: [
    F({ hip: [88, 110], t: 92, aN: ik(137, 164), aF: ik(142, 150), lN: ik(100, 183), lF: fk(180, -90), fF: -95 }, 0.8, 0.15),
    F({ hip: [88, 110], t: 92, aN: ik(118, 122), aF: ik(142, 150), lN: ik(100, 183), lF: fk(180, -90), fF: -95 }, 0.9, 0.35),
  ],
  back: () => bench(36, 154, 155),
  front: (s) => dbEnd(s.haN, 7),
};
const crossed = (t: number): FK => fk(t + 165, t + 15);
export const backExtension: Anim = {
  view: 'side',
  hi: ['lowerBack', 'glutes', 'hamstrings'],
  frames: [
    F({ hip: [120, 110], t: 150, aN: crossed(150), lN: fk(-135, -135), f: 135 }, 1.0, 0.2),
    F({ hip: [120, 110], t: 45, aN: crossed(45), lN: fk(-135, -135), f: 135 }, 1.0, 0.35),
  ],
  back: () => (
    <g>
      {ln(pt(124, 124), pt(112, 188), 4)}
      {ln(pt(62, 172), pt(70, 188), 4)}
      {ln(pt(62, 172), pt(84, 188), 3)}
      {pad(pt(58, 168), pt(74, 184), 5)}
    </g>
  ),
  front: () => pad(pt(129, 112), pt(112, 129), 8),
};

/* ------------------------------- Legs ------------------------------- */

const thrustTop: Pose = { hip: [120, 140], t: -90, aN: ik(122, 127), lN: ik(152, 183) };
export const hipThrust: Anim = {
  view: 'side',
  hi: ['glutes', 'hamstrings'],
  frames: [F({ hip: [112, 172], t: -57, aN: ik(114, 159), lN: ik(152, 183) }, 0.8, 0.15), F(thrustTop, 0.9, 0.4)],
  back: () => bench(16, 76, 152),
  front: (s) => bbEnd(add(s.hip, pt(2, -13)), 15),
};
export const gluteBridge: Anim = {
  view: 'side',
  hi: ['glutes', 'hamstrings'],
  frames: [
    F({ hip: [122, 178], t: -90, aN: fk(95, 95), lN: ik(156, 183) }, 0.8, 0.15),
    F({ hip: [120, 148], t: -122.5, aN: fk(98, 98), lN: ik(156, 183) }, 0.9, 0.4),
  ],
};
export const bulgarianSplitSquat: Anim = {
  view: 'side',
  hi: ['quads', 'glutes'],
  frames: [
    F({ hip: [125, 112], t: 2, aN: fk(180, 180), lN: ik(150, 183), lF: ik(58, 146), fF: -95 }, 1.0, 0.2),
    F({ hip: [115, 142], t: 8, aN: fk(180, 180), lN: ik(150, 183), lF: ik(58, 146), fF: -95 }, 0.9, 0.2),
  ],
  back: () => bench(26, 76, 152),
  front: (s) => dbEnd(s.haN, 6),
};
const stepStart: Pose = { hip: [112, 110], t: 6, aN: fk(178, 178), lN: ik(146, 146), lF: ik(100, 183) };
export const stepUp: Anim = {
  view: 'side',
  hi: ['quads', 'glutes'],
  frames: [
    F(stepStart, 0.5, 0.2),
    F({ ...stepStart, hip: [130, 90], lF: ik(118, 168), fF: 130 }, 0.45),
    F({ ...stepStart, hip: [142, 76], t: 0, lF: ik(152, 128) }, 0.5, 0.3),
    F({ ...stepStart, hip: [130, 90], lF: ik(118, 168), fF: 130 }, 0.45),
  ],
  back: () => box(128, 150, 58, 38, 3),
};

/* ------------------------------- Core ------------------------------- */

const plankPose: Pose = { hip: [110, 164], t: 80, aN: fk(180, 90), lN: ik(38, 180), f: 150 };
export const plank: Anim = {
  view: 'side',
  hi: ['core', 'glutes'],
  frames: [F(plankPose, 1.4, 0.8), F({ ...plankPose, hip: [110, 162] }, 1.4, 0.8)],
};
const sideBase: Pose = { hip: [110, 156], t: 75, aN: fk(180, 90), aF: fk(240, 250), lN: ik(40, 180), lF: ik(40, 172) };
export const sidePlank: Anim = {
  view: 'front',
  hi: ['core', 'abductors'],
  frames: [F(sideBase, 1.0, 0.6), F({ ...sideBase, aF: fk(370, 370) }, 1.0, 0.8)],
};
export const hangingLegRaise: Anim = {
  view: 'side',
  ground: false,
  hi: ['core'],
  frames: [
    F({ hip: [118, 118], t: 0, aN: fk(0, 0), lN: fk(180, 180), f: 165 }, 1.0, 0.2),
    F({ hip: [118, 118], t: -8, aN: fk(0, 0), lN: fk(88, 88), f: 40 }, 1.0, 0.35),
  ],
  back: () => (
    <g>
      {ln(pt(118, 16), pt(196, 16), 4)}
      {post(196, 12, 192, 5)}
    </g>
  ),
  front: () => knob(pt(118, 16), 3.5),
};
export const cableCrunch: Anim = {
  view: 'side',
  hi: ['core'],
  frames: [
    F({ hip: [110, 146], t: 10, aN: fk(20, 190), lN: fk(180, -90), f: -95 }, 0.9, 0.2),
    F({ hip: [106, 146], t: 95, aN: fk(105, 275), lN: fk(180, -90), f: -95 }, 0.9, 0.3),
  ],
  back: () => (
    <g>
      {post(214, 10, 188, 5)}
      {pulley(pt(206, 24))}
    </g>
  ),
  front: (s) => (
    <g>
      {cable(pt(206, 24), s.haN)}
      {rope(s.haN)}
    </g>
  ),
};
const twistBase = { hip: [120, 168] as [number, number], lN: fk(20, 170, 0.5, 0.45) };
export const russianTwist: Anim = {
  view: 'front',
  hi: ['core'],
  frames: [
    F({ ...twistBase, t: -8, aN: ik(150, 150), aF: ik(140, 152) }, 0.7, 0.15),
    F({ ...twistBase, t: 8, aN: ik(100, 152), aF: ik(90, 150) }, 0.7, 0.15),
  ],
  front: (s) => bbEnd(pt((s.haN.x + s.haF.x) / 2, (s.haN.y + s.haF.y) / 2), 9),
};
const bug: Pose = { hip: [130, 176], t: -90, aN: fk(0, 0), aF: fk(0, 0), lN: fk(0, 90), lF: fk(0, 90), f: 20, fF: 20 };
export const deadBug: Anim = {
  view: 'side',
  hi: ['core'],
  frames: [
    F(bug, 0.7, 0.1),
    F({ ...bug, aF: fk(-85, -85), lN: fk(92, 92), f: 90 }, 0.7, 0.3),
    F(bug, 0.7, 0.1),
    F({ ...bug, aN: fk(-85, -85), lF: fk(92, 92), fF: 90 }, 0.7, 0.3),
  ],
};
export const abWheel: Anim = {
  view: 'side',
  hi: ['core', 'lats'],
  frames: [
    F({ hip: [90, 146], t: 60, aN: ik(134, 176), lN: fk(180, -92), f: -95 }, 1.1, 0.2),
    F({ hip: [122, 168], t: 86, aN: ik(212, 176), lN: fk(245, -92), f: -95 }, 1.0, 0.25),
  ],
  front: (s) => (
    <g>
      <circle cx={s.haN.x} cy={178} r={9} fill="var(--eq2)" stroke="var(--eq)" strokeWidth={2.5} />
      {ln(pt(s.haN.x - 7, 178), pt(s.haN.x + 7, 178), 3)}
    </g>
  ),
};

/* ------------------------------- Cardio ------------------------------- */

const run = (near: boolean, contact: boolean): Pose => {
  const front = ik(138, 181);
  const back = ik(88, 172);
  const under = ik(116, 181);
  const kick = ik(96, 150);
  const fwdArm = fk(150, 40);
  const backArm = fk(205, 110);
  const midArm = fk(180, 90);
  if (contact) {
    return near
      ? { hip: [116, 108], t: 10, lN: front, lF: back, f: 100, fF: 150, aN: backArm, aF: fwdArm }
      : { hip: [116, 108], t: 10, lF: front, lN: back, f: 150, fF: 100, aF: backArm, aN: fwdArm };
  }
  return near
    ? { hip: [116, 102], t: 10, lN: under, lF: kick, f: 100, fF: 160, aN: midArm, aF: midArm }
    : { hip: [116, 102], t: 10, lF: under, lN: kick, f: 160, fF: 100, aN: midArm, aF: midArm };
};
export const treadmill: Anim = {
  view: 'side',
  hi: ['quads', 'hamstrings', 'calves', 'glutes'],
  frames: [F(run(true, true), 0.2), F(run(true, false), 0.2), F(run(false, true), 0.2), F(run(false, false), 0.2)],
  back: () => (
    <g>
      {ln(pt(52, 186), pt(198, 186), 5)}
      {ln(pt(190, 186), pt(176, 90), 4)}
      {ln(pt(176, 92), pt(150, 92), 4)}
      {box(170, 78, 22, 12, 2)}
    </g>
  ),
};

const pedal = (deg: number) => {
  const r = (deg * Math.PI) / 180;
  return { n: ik(128 + 14 * Math.cos(r), 166 + 14 * Math.sin(r)), f: ik(128 - 14 * Math.cos(r), 166 - 14 * Math.sin(r)) };
};
const bikePose = (deg: number): Pose => {
  const p = pedal(deg);
  return { hip: [100, 112], t: 28, aN: ik(160, 98), lN: p.n, lF: p.f, f: 95, fF: 95 };
};
export const bike: Anim = {
  view: 'side',
  hi: ['quads', 'glutes', 'calves'],
  frames: [F(bikePose(0), 0.22), F(bikePose(90), 0.22), F(bikePose(180), 0.22), F(bikePose(270), 0.22)],
  back: () => (
    <g>
      {ln(pt(60, 186), pt(190, 186), 5)}
      {ln(pt(104, 124), pt(128, 166), 4)}
      {ln(pt(128, 166), pt(162, 104), 4)}
      {ln(pt(156, 98), pt(168, 98), 4)}
      {box(86, 118, 28, 6, 3)}
      <circle cx={176} cy={164} r={16} fill="var(--eq2)" stroke="var(--eq)" strokeWidth={3} />
      {ln(pt(128, 166), pt(176, 164), 3)}
      {ln(pt(128, 166), pt(120, 186), 4)}
      {ln(pt(176, 164), pt(184, 186), 4)}
      <circle cx={128} cy={166} r={5} fill="var(--eq)" />
    </g>
  ),
};

const hop = (y: number, ph: number): Pose => ({ ...STAND_FRONT, hip: [120, y], aN: fk(160, 112), p: { ph } });
export const jumpRope: Anim = {
  view: 'front',
  hi: ['calves', 'delts'],
  frames: [F(hop(108, 0), 0.22), F(hop(100, 0.5), 0.22), F(hop(108, 1), 0)],
  front: (s) => {
    const cy = 82.5 - 167.5 * Math.cos(2 * Math.PI * (s.p.ph ?? 0));
    return <path d={`M ${s.haF.x} ${s.haF.y} Q 120 ${cy} ${s.haN.x} ${s.haN.y}`} fill="none" stroke="var(--eq)" strokeWidth={1.8} />;
  },
};

const bStand: Pose = { hip: [118, 108], t: 0, aN: ik(120, 114), lN: ik(120, 183), f: 100 };
const bSquat: Pose = { hip: [104, 150], t: 60, aN: ik(150, 182), lN: ik(120, 183), f: 100 };
const bPlank: Pose = { hip: [104.7, 150.9], t: 66.4, aN: ik(150, 182), lN: ik(36, 179), f: 150 };
const bLow: Pose = { hip: [110.6, 173], t: 83.9, aN: ik(150, 182), lN: ik(36, 179), f: 150 };
const bJump: Pose = { hip: [118, 96], t: 0, aN: ik(124, -4), lN: ik(120, 170), f: 140 };
export const burpee: Anim = {
  view: 'side',
  hi: ['quads', 'chest', 'core', 'glutes'],
  frames: [
    F(bStand, 0.45),
    F(bSquat, 0.3),
    F(bPlank, 0.45),
    F(bLow, 0.45),
    F(bPlank, 0.3),
    F(bSquat, 0.4),
    F(bJump, 0.4),
  ],
};
