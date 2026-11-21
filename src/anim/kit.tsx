import { G, add, along, angleOf, dir, mul, pt, type P } from './engine';

/** Drawing helpers for equipment. Colors come from CSS variables set by <Figure>. */
export const EQ = 'var(--eq)';
export const EQ2 = 'var(--eq2)';
export const CABLE = 'var(--cable)';

export const ln = (a: P, b: P, w = 3, c = EQ) => (
  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={c} strokeWidth={w} strokeLinecap="round" />
);

export const box = (x: number, y: number, w: number, h: number, r = 2, fill = EQ2) => (
  <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} stroke={EQ} strokeWidth={1.5} />
);

/** A padded beam (seat, backrest, bench pad) between two points */
export const pad = (a: P, b: P, w = 9) => (
  <g>
    {ln(a, b, w + 3, EQ)}
    {ln(a, b, w, EQ2)}
  </g>
);

export const post = (x: number, y1: number, y2 = G, w = 4) => ln(pt(x, y1), pt(x, y2), w);

export const cable = (a: P, b: P) => ln(a, b, 1.4, CABLE);

export const pulley = (p: P) => <circle cx={p.x} cy={p.y} r={4} fill={EQ2} stroke={EQ} strokeWidth={2} />;

export const knob = (p: P, r = 3.2) => <circle cx={p.x} cy={p.y} r={r} fill={EQ} />;

/** Dumbbell seen end-on (handle points at the viewer) */
export const dbEnd = (p: P, r = 6) => (
  <g>
    <circle cx={p.x} cy={p.y} r={r} fill={EQ} />
    <circle cx={p.x} cy={p.y} r={r * 0.35} fill={EQ2} />
  </g>
);

/** Dumbbell drawn along an axis angle (engine convention) */
export const db = (p: P, ang: number, len = 18) => (
  <g transform={`translate(${p.x} ${p.y}) rotate(${ang})`}>
    <line x1={0} y1={-len / 2} x2={0} y2={len / 2} stroke={EQ} strokeWidth={2.5} strokeLinecap="round" />
    <rect x={-5} y={-len / 2 - 2} width={10} height={5.5} rx={1.6} fill={EQ} />
    <rect x={-5} y={len / 2 - 3.5} width={10} height={5.5} rx={1.6} fill={EQ} />
  </g>
);

/** Barbell seen end-on: a weight plate */
export const bbEnd = (p: P, r = 12) => (
  <g>
    <circle cx={p.x} cy={p.y} r={r} fill={EQ2} stroke={EQ} strokeWidth={2.5} />
    <circle cx={p.x} cy={p.y} r={2.6} fill={EQ} />
  </g>
);

/** Barbell seen from the front between two hands */
export const bbFront = (l: P, r: P, ext = 34) => {
  const a = along(r, l, Math.hypot(r.x - l.x, r.y - l.y) + ext);
  const b = along(l, r, Math.hypot(r.x - l.x, r.y - l.y) + ext);
  const pl = along(r, l, Math.hypot(r.x - l.x, r.y - l.y) + ext - 6);
  const pr = along(l, r, Math.hypot(r.x - l.x, r.y - l.y) + ext - 6);
  return (
    <g>
      {ln(a, b, 3)}
      <rect x={pl.x - 3} y={pl.y - 12} width={6} height={24} rx={2} fill={EQ} />
      <rect x={pr.x - 3} y={pr.y - 12} width={6} height={24} rx={2} fill={EQ} />
    </g>
  );
};

/** Kettlebell hanging past the hand along the forearm direction */
export const kb = (hand: P, ang: number) => (
  <g transform={`translate(${hand.x} ${hand.y}) rotate(${ang})`}>
    <rect x={-5.5} y={-8} width={11} height={10} rx={5} fill="none" stroke={EQ} strokeWidth={2.6} />
    <circle cx={0} cy={-15} r={8.5} fill={EQ} />
  </g>
);

/** Weight plate seen edge-on, perpendicular to `ang` */
export const plateEdge = (p: P, ang: number) => (
  <g transform={`translate(${p.x} ${p.y}) rotate(${ang})`}>
    <rect x={-13} y={-2.8} width={26} height={5.6} rx={2} fill={EQ} />
  </g>
);

/** Weight stack; lift 0..1 raises the top plates */
export const stack = (x: number, top: number, lift = 0) => {
  const plates = [];
  const n = 7;
  for (let i = 0; i < n; i++) {
    const y = G - 4 - (i + 1) * 6;
    const raised = i >= n - 3 ? lift * 20 : 0;
    plates.push(<rect key={i} x={x + 3} y={y - raised} width={16} height={5} rx={1} fill={i >= n - 3 ? EQ : EQ2} stroke={EQ} strokeWidth={1} />);
  }
  return (
    <g>
      {post(x, top, G, 2.5)}
      {post(x + 22, top, G, 2.5)}
      {ln(pt(x, top), pt(x + 22, top), 2.5)}
      {ln(pt(x + 11, top), pt(x + 11, G - 4 - n * 6 - lift * 20), 1.4, CABLE)}
      {plates}
    </g>
  );
};

/** Bench with two legs */
export const bench = (x1: number, x2: number, y: number) => (
  <g>
    {post(x1 + 6, y)}
    {post(x2 - 6, y)}
    {pad(pt(x1, y), pt(x2, y), 8)}
  </g>
);

/** Pad running alongside a segment, offset perpendicular */
export const sidePad = (a: P, b: P, off: number, w = 7) => {
  const n = dir(angleOf(a, b) + 90);
  return pad(add(a, mul(n, off)), add(b, mul(n, off)), w);
};
