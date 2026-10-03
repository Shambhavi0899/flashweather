'use client';

import { useEffect, useRef } from 'react';

/** How long a counted-up number takes; the diagrams run ~1-1.5s. */
const COUNT_MS = 1200;

/**
 * Scroll-in, replay-on-hover motion for one block of SVG diagrams (a stats
 * card, a table row). The markup arrives finished, so without JavaScript or
 * with reduced motion the block simply shows its end state.
 *
 * The element's `data-anim` drives the keyframes in global CSS:
 *   idle   every animation held on its first frame, waiting to scroll in
 *   run    playing
 *   reset  no animation, for one reflow, so a hover can replay from zero
 * Blocks that scroll in together are staggered in document order: each gets
 * `data-delay` 0, 1, 2... which CSS turns into `--motion-delay` using the
 * block's own `--motion-stagger`. A hover replays with no delay.
 *
 * `count` names the finished text of a `[data-count]` element inside the
 * block, which then counts up from zero with the diagrams, or later by the
 * block's `--motion-count-delay` if CSS sets one. `replay={false}`
 * plays the block once, with no hover replay. A `[data-motion-replay]`
 * button inside the block replays it on click either way (CSS keeps such a
 * button hidden until the block has `data-anim`). `label` names the block for
 * assistive tech (a list's aria-label). `threshold` is how much of the block
 * must be in view before it plays (0.35 unless given).
 */
export function Motion({
  as: Tag = 'div',
  id,
  label,
  className,
  count,
  replay: replayOnHover = true,
  threshold = 0.35,
  children,
}: {
  as?: 'div' | 'tr' | 'ol' | 'ul' | 'li' | 'h1' | 'h2' | 'figcaption';
  id?: string;
  label?: string;
  className: string;
  count?: string;
  replay?: boolean;
  threshold?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const block = ref.current;
    if (!block || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const number = count ? block.querySelector<HTMLElement>('[data-count]') : null;

    // "99.6%" -> ["", "99.6", "%"]: numbers count, everything else is kept, and
    // each number keeps its own decimals.
    const parts = count?.split(/(\d+(?:\.\d+)?)/) ?? [];
    const render = (progress: number) =>
      parts
        .map((part, i) => (i % 2 ? (Number(part) * progress).toFixed(part.split('.')[1]?.length ?? 0) : part))
        .join('');

    let frame = 0;
    let timer = 0;
    let played = false;

    const countUp = (delay: number) => {
      if (!number) return;
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      number.textContent = render(0);
      timer = window.setTimeout(() => {
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / COUNT_MS);
          number.textContent = render(1 - (1 - t) ** 4); // ease-out
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      }, delay);
    };

    const play = (order: number) => {
      played = true;
      block.dataset.delay = String(order);
      block.dataset.anim = 'reset';
      void block.getBoundingClientRect(); // commit the reset so the animations restart
      block.dataset.anim = 'run';
      const style = getComputedStyle(block);
      countUp(toMs(style.getPropertyValue('--motion-delay')) + toMs(style.getPropertyValue('--motion-count-delay')));
    };

    // Hold the draw-in until the block scrolls in. A number is only zeroed if
    // the block is still below the fold, so nobody sees it flash to 0.
    block.dataset.anim = 'idle';
    if (number && block.getBoundingClientRect().top > window.innerHeight) number.textContent = render(0);

    // data-inview also pauses ambient loops while the block is off screen,
    // or the tab is hidden.
    let inView = false;
    const syncInView = () => block.toggleAttribute('data-inview', inView && !document.hidden);
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        syncInView();
        if (entry.isIntersecting && !played) enqueue(block, play);
      },
      { threshold },
    );
    observer.observe(block);
    document.addEventListener('visibilitychange', syncInView);

    const replay = (event: PointerEvent) => {
      if (replayOnHover && event.pointerType === 'mouse' && played) play(0);
    };
    block.addEventListener('pointerenter', replay);

    const replayClick = (event: MouseEvent) => {
      if (played && (event.target as Element).closest('[data-motion-replay]')) play(0);
    };
    block.addEventListener('click', replayClick);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', syncInView);
      block.removeEventListener('pointerenter', replay);
      block.removeEventListener('click', replayClick);
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      if (number && count) number.textContent = count;
      delete block.dataset.anim;
    };
  }, [count, replayOnHover, threshold]);

  return (
    // The element union keeps the ref typed as the shared HTMLElement.
    <Tag
      ref={
        ref as React.Ref<
          HTMLDivElement &
            HTMLTableRowElement &
            HTMLOListElement &
            HTMLUListElement &
            HTMLLIElement &
            HTMLHeadingElement
        >
      }
      id={id}
      aria-label={label}
      className={className}
    >
      {children}
    </Tag>
  );
}

/** A CSS time ("0.9s", "250ms") in milliseconds. */
function toMs(time: string) {
  const value = parseFloat(time);
  if (Number.isNaN(value)) return 0;
  return time.trim().endsWith('ms') ? value : value * 1000;
}

/**
 * Blocks that scroll in during the same frame play as one staggered group,
 * in document order, so a row reached on its own starts at once.
 */
let queue: { block: HTMLElement; play: (order: number) => void }[] = [];

function enqueue(block: HTMLElement, play: (order: number) => void) {
  if (!queue.length) {
    requestAnimationFrame(() => {
      const group = queue.sort((a, b) =>
        a.block.compareDocumentPosition(b.block) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
      );
      queue = [];
      group.forEach((item, order) => item.play(order));
    });
  }
  queue.push({ block, play });
}
