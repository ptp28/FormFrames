# FormFrames

Every move, frame by frame. FormFrames is an animated, searchable library of exercises, built with React and Fluent UI React v9. Everything runs in the browser.

## Run it

```bash
npm install
npm run dev
```

To build a static site into `dist/`, run `npm run build`. The output works from any folder or static host.

## Where things live

- `src/data/exercises.ts` holds the exercise list: names, sections, equipment tags, steps and tips.
- `src/anim/animations.tsx` defines each animation as keyframe poses plus the equipment drawing.
- `src/anim/engine.ts` is the small skeletal animation engine (forward and inverse kinematics).
- `src/components/` contains the cards, table view and details drawer.

In dev mode, open `/?sheet` to see every keyframe of every animation. Use `/?sheet=leg,curl` to filter by exercise id.

## Deploy

Every push to `main` builds the site and publishes it to GitHub Pages through `.github/workflows/deploy.yml`.
