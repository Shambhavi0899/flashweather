'use client';

import { useEffect, useRef } from 'react';

/** Before, During, After: the order the three mechanisms play in. */
const ORDER = ['prediction', 'meter', 'detection'];
/** How far apart the three start in the hero's sequence; each runs ~1.4s. */
const STEP_MS = 1300;

/**
 * The hero figure's panels (styles/why-flash-tech-figure.css). Each card's
 * `data-anim` is idle (held on its first frame), run, or reset (one reflow
 * with no animation, so it can restart); `--tech-at` delays its run.
 *
 * From lg, where the cards sit side by side, they play once as one ~4s
 * sequence: after the headline has landed (the hero's CSS clock) and once
 * the figure is in view. Below lg the cards stack and each plays as it
 * scrolls in. A mouse over a card that has played replays it. With reduced
 * motion none of this runs and the cards are their static final frame.
 */
export function TechnologyFigureMotion({ className, children }: { className: string; children: React.ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cards = [...list.querySelectorAll<HTMLElement>('[data-tech]')];
    const sequence = window.matchMedia('(width >= 1024px)').matches;

    const play = (card: HTMLElement, at: number) => {
      card.style.setProperty('--tech-at', `${at}ms`);
      card.dataset.anim = 'reset';
      void card.getBoundingClientRect(); // commit the reset so the animations restart
      card.dataset.anim = 'run';
    };

    // The headline has landed when the hero's gold shimmer starts. The hero's
    // visual began its own animation when the hero did, so its clock says
    // how long ago that was. Once that animation is gone, the hero is done.
    const root = getComputedStyle(document.documentElement);
    const landsAt = toMs(root.getPropertyValue('--hero-shimmer-at'));
    const lift = list.closest('.hero-visual')?.getAnimations().find((a) => a instanceof CSSAnimation);
    const elapsed = lift ? Number(lift.currentTime ?? 0) : Infinity;
    let ready = false;
    const waiting = new Set<HTMLElement>();

    const start = (target: HTMLElement) => {
      if (target === list) ORDER.forEach((key, i) => play(list.querySelector(`[data-tech='${key}']`)!, i * STEP_MS));
      else play(target, 0);
    };

    for (const card of cards) card.dataset.anim = 'idle';

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = entry.target as HTMLElement;
          observer.unobserve(target);
          if (ready) start(target);
          else waiting.add(target);
        }
      },
      { threshold: sequence ? 0.35 : 0.4 },
    );
    if (sequence) observer.observe(list);
    else cards.forEach((card) => observer.observe(card));

    const gate = window.setTimeout(
      () => {
        ready = true;
        waiting.forEach(start);
        waiting.clear();
      },
      Math.max(0, landsAt - elapsed),
    );

    const replay = (event: PointerEvent) => {
      const card = event.currentTarget as HTMLElement;
      if (event.pointerType === 'mouse' && card.dataset.anim === 'run') play(card, 0);
    };
    cards.forEach((card) => card.addEventListener('pointerenter', replay));

    return () => {
      observer.disconnect();
      clearTimeout(gate);
      for (const card of cards) {
        card.removeEventListener('pointerenter', replay);
        delete card.dataset.anim;
        card.style.removeProperty('--tech-at');
      }
    };
  }, []);

  return (
    <ul ref={ref} className={className}>
      {children}
    </ul>
  );
}

/** A CSS time ("1450ms", "1.2s") in milliseconds. */
function toMs(time: string) {
  const value = parseFloat(time);
  if (Number.isNaN(value)) return 0;
  return time.trim().endsWith('ms') ? value : value * 1000;
}
