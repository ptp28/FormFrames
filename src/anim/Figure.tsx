import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { tokens } from '@fluentui/react-components';
import { B, G, add, dir, mul, sample, solve, type Anim, type Muscle, type P, type Skel } from './engine';

/* ---------- shared animation clock: one requestAnimationFrame for every figure ---------- */
type Sub = (now: number) => void;
const subs = new Set<Sub>();
let raf = 0;
function loop(now: number) {
  subs.forEach((f) => f(now));
  raf = subs.size ? requestAnimationFrame(loop) : 0;
}
function subscribe(fn: Sub) {
  subs.add(fn);
  if (!raf) raf = requestAnimationFrame(loop);
  return () => {
    subs.delete(fn);
  };
}

function useInView<T extends Element>(ref: React.RefObject<T>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '80px' });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return inView;
}

/* ---------- rendering ---------- */
const VAR_STYLE = {
  '--fig': tokens.colorBrandBackground,
  '--hi': tokens.colorPaletteRedBackground3,
  '--eq': tokens.colorNeutralForeground3,
  '--eq2': tokens.colorNeutralBackground5,
  '--cable': tokens.colorNeutralForeground4,
  '--ground': tokens.colorNeutralStroke1,
} as CSSProperties;

const FIG = 'var(--fig)';
const HI = 'var(--hi)';

const seg = (a: P, b: P, w: number, c: string) => (
  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={c} strokeWidth={w} strokeLinecap="round" />
);

function parts(s: Skel, hi: Set<Muscle>, side: 'N' | 'F') {
  const n = side === 'N';
  const has = (...m: Muscle[]) => m.some((x) => hi.has(x));
  const arm = has('biceps', 'triceps') ? HI : FIG;
  const fore = has('forearms') ? HI : FIG;
  const thigh = has('quads', 'hamstrings', 'adductors', 'abductors') ? HI : FIG;
  const shin = has('calves') ? HI : FIG;
  const [sh, el, ha] = n ? [s.shN, s.elN, s.haN] : [s.shF, s.elF, s.haF];
  const [hp, kn, an, to] = n ? [s.hipN, s.knN, s.anN, s.toN] : [s.hipF, s.knF, s.anF, s.toF];
  return {
    leg: (
      <g>
        {seg(hp, kn, 8.5, thigh)}
        {seg(kn, an, 7, shin)}
        {seg(an, to, 5, FIG)}
      </g>
    ),
    arm: (
      <g>
        {seg(sh, el, 6.5, arm)}
        {seg(el, ha, 5.5, fore)}
        {hi.has('delts') && <circle cx={sh.x} cy={sh.y} r={5.2} fill={HI} />}
      </g>
    ),
  };
}

function Torso({ s, hi }: { s: Skel; hi: Set<Muscle> }) {
  const has = (...m: Muscle[]) => m.some((x) => hi.has(x));
  const d = dir(s.t);
  const pr = dir(s.t + 90);
  const L = (k: number) => add(s.hip, mul(d, B.T * k));
  const neckTop = add(s.hip, mul(d, B.T + B.NECK));
  if (s.view === 'side') {
    return (
      <g>
        {seg(s.sc, neckTop, 6, FIG)}
        {seg(s.hip, s.sc, 12, FIG)}
        {has('chest', 'upperBack', 'lats') && seg(L(0.5), s.sc, 12, HI)}
        {has('lowerBack', 'core') && seg(s.hip, L(0.45), 12, HI)}
        {has('traps') && seg(s.sc, add(add(s.sc, mul(d, 6)), mul(pr, -2.5)), 7, HI)}
        {has('glutes') && <circle cx={s.hip.x - pr.x * 3} cy={s.hip.y - pr.y * 3} r={6.6} fill={HI} />}
        <circle cx={s.head.x} cy={s.head.y} r={B.HR} fill={FIG} />
      </g>
    );
  }
  const poly = (pts: P[], c: string) => (
    <polygon points={pts.map((p) => `${p.x},${p.y}`).join(' ')} fill={c} stroke={c} strokeWidth={5} strokeLinejoin="round" />
  );
  const mid = L(0.5);
  const midN = add(mid, mul(pr, 10));
  const midF = add(mid, mul(pr, -10));
  return (
    <g>
      {seg(s.sc, neckTop, 6, FIG)}
      {poly([s.shN, s.shF, s.hipF, s.hipN], FIG)}
      {has('chest', 'upperBack', 'lats') && poly([s.shN, s.shF, midF, midN], HI)}
      {has('lowerBack', 'core') && poly([midN, midF, s.hipF, s.hipN], HI)}
      {has('traps') && (
        <g>
          {seg(s.shN, add(s.sc, mul(d, 4)), 5, HI)}
          {seg(s.shF, add(s.sc, mul(d, 4)), 5, HI)}
        </g>
      )}
      {has('glutes') && (
        <g>
          <circle cx={s.hipN.x} cy={s.hipN.y} r={5.5} fill={HI} />
          <circle cx={s.hipF.x} cy={s.hipF.y} r={5.5} fill={HI} />
        </g>
      )}
      <circle cx={s.head.x} cy={s.head.y} r={B.HR} fill={FIG} />
    </g>
  );
}

export function Figure({ anim, time, title, showHighlight = true }: { anim: Anim; time: number; title?: string; showHighlight?: boolean }) {
  const s = solve(sample(anim, time), anim.view);
  const hi = new Set<Muscle>(showHighlight ? anim.hi : []);
  const N = parts(s, hi, 'N');
  const F = parts(s, hi, 'F');
  const side = anim.view === 'side';
  return (
    <svg viewBox="0 0 240 200" role="img" aria-label={title} style={{ ...VAR_STYLE, width: '100%', height: '100%', display: 'block' }}>
      {title && <title>{title}</title>}
      {anim.ground !== false && <line x1={8} y1={G} x2={232} y2={G} stroke="var(--ground)" strokeWidth={2} strokeLinecap="round" />}
      {anim.back?.(s)}
      {side ? (
        <g opacity={0.42} transform="translate(-2.5 -1)">
          {F.leg}
          {F.arm}
        </g>
      ) : (
        <g>
          {F.leg}
          {N.leg}
        </g>
      )}
      <Torso s={s} hi={hi} />
      {side ? N.leg : null}
      {side ? N.arm : (
        <g>
          {F.arm}
          {N.arm}
        </g>
      )}
      {anim.front?.(s)}
    </svg>
  );
}

/** A figure that plays its animation in a loop while visible. */
export function AnimatedFigure({
  anim,
  playing = true,
  speed = 1,
  title,
  showHighlight,
  offset = 0,
}: {
  anim: Anim;
  playing?: boolean;
  speed?: number;
  title?: string;
  showHighlight?: boolean;
  offset?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);
  const [time, setTime] = useState(offset);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  useEffect(() => {
    if (!playing || !visible) return;
    let last: number | null = null;
    return subscribe((now) => {
      if (last !== null) {
        const dt = Math.min(0.1, (now - last) / 1000) * speedRef.current;
        setTime((t) => t + dt);
      }
      last = now;
    });
  }, [playing, visible]);

  return (
    <div ref={ref} style={{ width: '100%', height: '100%' }}>
      <Figure anim={anim} time={time} title={title} showHighlight={showHighlight} />
    </div>
  );
}
