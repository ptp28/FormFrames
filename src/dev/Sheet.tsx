import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { Figure } from '../anim/Figure';
import { EXERCISES } from '../data/exercises';

/** Dev-only contact sheet: every keyframe of every animation (open /?sheet). */
export function Sheet() {
  const only = new URLSearchParams(location.search).get('sheet');
  const items = EXERCISES.flatMap((e) => e.variants.map((v) => ({ name: `${e.name} · ${v.label}`, id: e.id, anim: v.anim }))).filter(
    (x) => !only || only.split(',').some((o) => x.id.includes(o)),
  );
  return (
    <FluentProvider theme={webLightTheme}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(600px, 1fr))', gap: 8, padding: 8 }}>
        {items.map((x) => {
          let t = 0;
          const times = x.anim.frames.map((f) => {
            const at = t;
            t += (f.h ?? 0) + f.d;
            return at;
          });
          return (
            <div key={x.name} style={{ border: '1px solid #ccc', padding: 4 }}>
              <div style={{ fontSize: 12, fontFamily: 'sans-serif' }}>{x.name}</div>
              <div style={{ display: 'flex' }}>
                {times.slice(0, 4).map((tt) => (
                  <div key={tt} style={only ? { width: 300, height: 250 } : { width: 150, height: 125 }}>
                    <Figure anim={x.anim} time={tt} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </FluentProvider>
  );
}
