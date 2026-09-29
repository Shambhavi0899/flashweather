'use client';

import { useEffect, useRef } from 'react';

/**
 * A block that leans towards the mouse. It only reports where the pointer
 * is over its parent, as `--tilt-x` and `--tilt-y` from -1 to 1; global CSS
 * turns that into degrees and eases it. The parent is what listens, because
 * it holds still while the block leans. With reduced motion, or on a device
 * with no mouse, the variables are never set and the block stays square on.
 */
export function Tilt({ className, children }: { className: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const block = ref.current;
    const area = block?.parentElement;
    if (
      !block ||
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
      block.style.setProperty('--tilt-x', x.toFixed(3));
      block.style.setProperty('--tilt-y', y.toFixed(3));
    };
    const lean = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const box = area.getBoundingClientRect();
      x = Math.min(1, Math.max(-1, ((event.clientX - box.left) / box.width) * 2 - 1));
      y = Math.min(1, Math.max(-1, ((event.clientY - box.top) / box.height) * 2 - 1));
      frame ||= requestAnimationFrame(apply);
    };
    const settle = () => {
      x = 0;
      y = 0;
      frame ||= requestAnimationFrame(apply);
    };

    area.addEventListener('pointermove', lean);
    area.addEventListener('pointerleave', settle);
    return () => {
      cancelAnimationFrame(frame);
      area.removeEventListener('pointermove', lean);
      area.removeEventListener('pointerleave', settle);
      block.style.removeProperty('--tilt-x');
      block.style.removeProperty('--tilt-y');
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
