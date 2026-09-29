'use client';

import { useEffect, useRef } from 'react';

/** How far the button travels at most, and how much of the pointer's offset it takes. */
const REACH = 6;
const PULL = 0.2;

/**
 * A button that leans a few pixels towards the mouse while it is hovered.
 * Like <Tilt>, it only reports where the pointer is, as `--mag-x` and
 * `--mag-y` in pixels; global CSS (styles/finale.css) moves the button and
 * eases it. This wrapper is what listens, because it holds still while the
 * button moves. With reduced motion, or with no mouse, nothing is set.
 */
export function Magnetic({ className, children }: { className: string; children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const area = ref.current;
    if (
      !area ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    ) {
      return;
    }

    let frame = 0;
    let x = 0;
    let y = 0;
    const apply = () => {
      frame = 0;
      area.style.setProperty('--mag-x', `${x.toFixed(1)}px`);
      area.style.setProperty('--mag-y', `${y.toFixed(1)}px`);
    };
    const pull = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const box = area.getBoundingClientRect();
      const reach = (n: number) => Math.min(REACH, Math.max(-REACH, n * PULL));
      x = reach(event.clientX - (box.left + box.width / 2));
      y = reach(event.clientY - (box.top + box.height / 2));
      frame ||= requestAnimationFrame(apply);
    };
    const settle = () => {
      x = 0;
      y = 0;
      frame ||= requestAnimationFrame(apply);
    };

    area.addEventListener('pointermove', pull);
    area.addEventListener('pointerleave', settle);
    return () => {
      cancelAnimationFrame(frame);
      area.removeEventListener('pointermove', pull);
      area.removeEventListener('pointerleave', settle);
      area.style.removeProperty('--mag-x');
      area.style.removeProperty('--mag-y');
    };
  }, []);

  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  );
}
