import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

const Sheet = import.meta.env.DEV ? lazy(() => import('./dev/Sheet').then((m) => ({ default: m.Sheet }))) : null;
const showSheet = Sheet && new URLSearchParams(location.search).has('sheet');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {showSheet && Sheet ? (
      <Suspense fallback={null}>
        <Sheet />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
);
