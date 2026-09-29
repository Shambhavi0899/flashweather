'use client';

import { useEffect, useRef } from 'react';

import type { ProductLayerId } from '@/content/products';
import { onScrollFrame } from '@/lib/scroll';

/** A group is current once its top has passed this far down the screen. */
const LINE = 0.45;

/**
 * The scrollspy for the product layers: sets `data-active` to the id of the
 * current `[data-layer-group]`, the last one whose top has passed 45% of the
 * screen. The rail's plate and name follow it in CSS (styles/products.css,
 * `pl-*`). It reads on the shared scroll frame (lib/scroll), so it moves in
 * the same frame as Lenis, and does nothing while the section is off screen.
 *
 * `initial` is the server's answer, so without JavaScript the rail names the
 * first group. The rail tracks with reduced motion too: it is a position,
 * not an animation.
 */
export function LayerSpy({
  initial,
  className,
  children,
}: {
  initial: ProductLayerId;
  className: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const groups = [...root.querySelectorAll<HTMLElement>('[data-layer-group]')];

    const read = () => {
      const vh = window.innerHeight;
      const box = root.getBoundingClientRect();
      if (box.bottom < 0 || box.top > vh) return;
      let current = groups[0];
      for (const group of groups) if (group.getBoundingClientRect().top <= vh * LINE) current = group;
      const id = current?.dataset.layerGroup;
      if (id && root.dataset.active !== id) root.dataset.active = id;
    };

    return onScrollFrame(read);
  }, []);

  return (
    <div ref={ref} data-active={initial} className={className}>
      {children}
    </div>
  );
}
