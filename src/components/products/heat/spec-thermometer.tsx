'use client';

import { useEffect, useRef } from 'react';

import { onScrollFrame } from '@/lib/scroll';

/**
 * When the thermometer runs: desktop widths, for people who take motion. The
 * same query shows it in styles/heat-spec.css, so the two must match. Below
 * it the rows fade up on their own <Motion>; with reduced motion (or no
 * script) the markup is the finished frame: mercury full, every row shown.
 */
const SCRUB = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';

/** The reading line, as a share of the viewport height, that the mercury's tip follows. */
const LINE = 0.62;

/**
 * The spec tables with a slim thermometer down their left edge. As the page
 * scrolls the mercury flows down from the bulb, its tip on the reading line
 * (on the shared scroll loop, so it moves with Lenis), warming gold to orange
 * to red; each row fades in as the tip reaches it (`data-on`), in both
 * tables at once, since they share the line.
 */
export function SpecThermometer({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const tube = root?.querySelector<HTMLElement>('.hsx-tube');
    if (!root || !tube) return;
    const query = window.matchMedia(SCRUB);
    const rows = [...root.querySelectorAll<HTMLElement>('.hsx-row')];

    let stop: (() => void) | null = null;
    let last = -1;

    const read = () => {
      const box = tube.getBoundingClientRect();
      const tip = Math.min(box.bottom, Math.max(box.top, window.innerHeight * LINE));
      const fill = box.height ? (tip - box.top) / box.height : 1;
      if (Math.abs(fill - last) >= 0.0005) {
        last = fill;
        root.style.setProperty('--hsx-fill', fill.toFixed(4));
      }
      // A row is reached once the tip passes its top edge.
      for (const row of rows) row.toggleAttribute('data-on', row.getBoundingClientRect().top <= tip - 1 || fill >= 1);
    };

    const arm = () => {
      if (query.matches && !stop) {
        root.setAttribute('data-armed', '');
        stop = onScrollFrame(read);
      } else if (!query.matches && stop) {
        disarm();
      }
    };
    const disarm = () => {
      stop?.();
      stop = null;
      last = -1;
      root.removeAttribute('data-armed');
      root.style.removeProperty('--hsx-fill');
      rows.forEach((row) => row.removeAttribute('data-on'));
    };

    arm();
    query.addEventListener('change', arm);
    return () => {
      query.removeEventListener('change', arm);
      disarm();
    };
  }, []);

  return (
    <div ref={ref} className="hsx">
      <div aria-hidden className="hsx-thermo">
        <span className="hsx-bulb" />
        <span className="hsx-tube">
          <span className="hsx-mercury" />
        </span>
      </div>
      {children}
    </div>
  );
}
