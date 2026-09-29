'use client';

import { useEffect, useRef } from 'react';

import { Motion } from '@/components/motion';

/**
 * Plays the harness diagram's loop (styles/agent-harness.css, hl-*): the
 * cards rise left to right as the block scrolls in, then a request token
 * runs chip → harness → engine → harness → chip once. Hovering the harness
 * card replays the loop (not the cards).
 *
 * The timeline is CSS on one <Motion> block; this only measures the token's
 * waypoints (below) into --hl-x0…y7 whenever the layout changes. Positions are
 * summed from offsetLeft/offsetTop, which ignore the cards' rise transform,
 * and the token lives inside the block, so it scrolls with the page (and
 * Lenis) without being told.
 */
/**
 * The token's stops, in keyframe order (--hl-x0…y7). It rides the left
 * gutter of each card, 14px outside the element it visits; the arrows it
 * crosses through their middle.
 */
const WAYPOINTS: { selector: string; gutter: boolean }[] = [
  { selector: '.hl-chip', gutter: true },
  { selector: '.hl-arrow-1', gutter: false },
  { selector: '.hl-c1', gutter: true },
  { selector: '.hl-c2', gutter: true },
  { selector: '.hl-arrow-2', gutter: false },
  { selector: '.hl-engine-dl', gutter: true },
  { selector: '.hl-c3', gutter: true },
  { selector: '.hl-c4', gutter: true },
];

export function HarnessLoop({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const block = ref.current?.querySelector<HTMLElement>('.hl');
    if (!block || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const token = block.querySelector<HTMLElement>('.hl-token');
    const harness = block.querySelector<HTMLElement>('.hl-harness');
    const points = WAYPOINTS.map(({ selector, gutter }) => ({ el: block.querySelector<HTMLElement>(selector), gutter }));

    const measure = () => {
      points.forEach(({ el, gutter }, i) => {
        if (!el) return;
        let x = 0;
        let y = 0;
        let node: HTMLElement | null = el;
        while (node && node !== block) {
          x += node.offsetLeft;
          y += node.offsetTop;
          node = node.offsetParent as HTMLElement | null;
        }
        // A harness row centres on its tick (first line), not the whole row.
        y += el.classList.contains('hl-check') ? 22 : el.offsetHeight / 2;
        x += gutter ? -14 : el.offsetWidth / 2;
        block.style.setProperty(`--hl-x${i}`, `${Math.round(x)}px`);
        block.style.setProperty(`--hl-y${i}`, `${Math.round(y)}px`);
      });
    };
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(block);

    const replay = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || block.dataset.anim !== 'run') return;
      // Not while a loop (or its delay before the first one) is still running.
      if (token?.getAnimations().some((a) => a.playState === 'running')) return;
      block.dataset.loop = 'reset';
      void block.getBoundingClientRect(); // commit the reset so the loop restarts
      block.dataset.loop = 'go';
    };
    harness?.addEventListener('pointerenter', replay);

    return () => {
      resize.disconnect();
      harness?.removeEventListener('pointerenter', replay);
      delete block.dataset.loop;
      for (let i = 0; i < WAYPOINTS.length; i++) {
        block.style.removeProperty(`--hl-x${i}`);
        block.style.removeProperty(`--hl-y${i}`);
      }
    };
  }, []);

  return (
    <div ref={ref}>
      <Motion className="motion hl relative" replay={false} threshold={0.5}>
        {children}
        <span aria-hidden className="hl-token" />
      </Motion>
    </div>
  );
}
