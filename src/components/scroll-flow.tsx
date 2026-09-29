'use client';

import { useEffect, useRef } from 'react';

import { onScrollFrame } from '@/lib/scroll';

/** How far a card's photo travels, end to end, as the card crosses the screen. */
const PARALLAX = 24;

const clamp = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Ties a section to the scroll. It only reports positions, as variables;
 * global CSS (styles/parameter-card.css) does the moving:
 *
 *   --flow-in   0 → 1 as the section scrolls in (top edge, from the bottom
 *               of the screen to near its top)
 *   --flow-out  0 → 1 as it leaves (bottom edge, from 60% of the screen up)
 *   --pc-y      on each `.pc`, its photo's offset for where the card is
 *
 * It reads on the shared scroll frame (lib/scroll), so it stays in step with
 * smooth scrolling, and does nothing while the section is off screen. With
 * reduced motion it sets nothing and the section is still.
 */
export function ScrollFlow({
  as: Tag = 'section',
  id,
  className,
  labelledBy,
  children,
}: {
  as?: 'section' | 'div';
  id?: string;
  className: string;
  labelledBy?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cards = [...root.querySelectorAll<HTMLElement>('.pc')];

    const read = () => {
      const vh = window.innerHeight;
      const box = root.getBoundingClientRect();
      if (box.bottom < -vh * 0.2 || box.top > vh * 1.2) return;
      root.style.setProperty('--flow-in', clamp((vh - box.top) / (vh * 0.9)).toFixed(3));
      root.style.setProperty('--flow-out', clamp((vh * 0.6 - box.bottom) / (vh * 0.5)).toFixed(3));
      for (const card of cards) {
        const r = card.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) continue;
        const crossed = clamp((vh - r.top) / (vh + r.height));
        card.style.setProperty('--pc-y', `${((crossed - 0.5) * PARALLAX).toFixed(1)}px`);
      }
    };

    const stop = onScrollFrame(read);
    return () => {
      stop();
      for (const name of ['--flow-in', '--flow-out']) root.style.removeProperty(name);
      cards.forEach((card) => card.style.removeProperty('--pc-y'));
    };
  }, []);

  return (
    <Tag ref={ref as React.Ref<HTMLDivElement>} id={id} aria-labelledby={labelledBy} className={className}>
      {children}
    </Tag>
  );
}
