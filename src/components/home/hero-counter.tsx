'use client';

import { useEffect, useRef } from 'react';

/** When the 01—03 counter starts cycling, and how often it moves on. */
const CYCLE_START = 2400;
const CYCLE_MS = 5000;

/**
 * The home hero's product cards, and the 01—03 counter over them: one
 * `[data-hero-card]` at a time gets `data-active`, and `[data-hero-counter]`
 * its number. It holds while the hero is off screen (`data-offscreen`, from
 * <HeroMotion>). With reduced motion it does not run.
 */
export function HeroCounter({ className, children }: { className: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const hero = root.closest('.hero-fx');
    const cards = [...root.querySelectorAll<HTMLElement>('[data-hero-card]')];
    const counter = root.querySelector<HTMLElement>('[data-hero-counter]');

    let active = 0;
    let cycle = 0;
    const show = (i: number) => {
      active = i;
      cards.forEach((card, n) => card.toggleAttribute('data-active', n === i));
      if (counter) counter.textContent = String(i + 1).padStart(2, '0');
    };
    const start = window.setTimeout(() => {
      show(0);
      cycle = window.setInterval(() => {
        if (!hero?.hasAttribute('data-offscreen') && !document.hidden) show((active + 1) % cards.length);
      }, CYCLE_MS);
    }, CYCLE_START);

    return () => {
      clearTimeout(start);
      clearInterval(cycle);
      cards.forEach((card) => card.removeAttribute('data-active'));
      if (counter) counter.textContent = '01';
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
