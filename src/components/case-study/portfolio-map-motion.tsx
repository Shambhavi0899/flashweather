'use client';

import { useEffect, useRef } from 'react';

type Mark = HTMLElement | SVGElement;

/**
 * The portfolio map's figure (portfolio-map.tsx, styles/case-study-portfolio-map.css).
 *
 * Scroll-in: `data-anim` is idle (the log entries held back) until the log is
 * in view, then run: the entries come in in time order and each one's pin
 * pulses with it. With reduced motion `data-anim` is never set, so every
 * entry is simply there and nothing pulses.
 *
 * Highlight: a mouse over a log entry, or keyboard focus on it, marks that
 * entry and its property's pin with `data-on`; a mouse over a pin marks the
 * pin and every entry of that property. A click or tap holds the highlight
 * (the entry's aria-pressed) until it is pressed again, another one is, or
 * Escape. `data-active` on the figure says a highlight is showing.
 */
export function PortfolioMapMotion({
  label,
  className,
  children,
}: {
  label: string;
  className: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const figure = ref.current;
    if (!figure) return;
    const marks = [...figure.querySelectorAll<Mark>('[data-property]')];
    const sources = marks.filter((mark) => mark.matches('[data-entry], [data-pin]'));

    let hover: Mark | null = null;
    let held: Mark | null = null;

    const render = () => {
      const source = hover ?? held;
      figure.toggleAttribute('data-active', Boolean(source));
      for (const mark of marks) {
        // From an entry, only that entry lights; from a pin, all of its entries do.
        const on =
          source?.matches('[data-entry]') && mark.matches('[data-entry]')
            ? mark === source
            : mark.dataset.property === source?.dataset.property;
        mark.toggleAttribute('data-on', Boolean(source) && on);
        if (mark.matches('[data-entry]')) mark.setAttribute('aria-pressed', String(mark === held));
      }
    };

    const controller = new AbortController();
    const { signal } = controller;
    const leave = (mark: Mark) => {
      if (hover === mark) hover = null;
      render();
    };

    for (const mark of sources) {
      mark.addEventListener(
        'pointerenter',
        (event) => {
          if ((event as PointerEvent).pointerType !== 'mouse') return;
          hover = mark;
          render();
        },
        { signal },
      );
      mark.addEventListener('pointerleave', () => leave(mark), { signal });
      // A tap focuses the entry too; only keyboard focus should act as a hover.
      mark.addEventListener(
        'focus',
        () => {
          if (!mark.matches(':focus-visible')) return;
          hover = mark;
          render();
        },
        { signal },
      );
      mark.addEventListener('blur', () => leave(mark), { signal });
      mark.addEventListener(
        'click',
        () => {
          held = held === mark ? null : mark;
          render();
        },
        { signal },
      );
    }
    figure.addEventListener(
      'keydown',
      (event) => {
        if (event.key !== 'Escape' || !held) return;
        held = null;
        render();
      },
      { signal },
    );

    const cleanup = () => {
      controller.abort();
      hover = held = null;
      render();
    };

    const log = figure.querySelector('[data-pmap-log]');
    if (!log || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return cleanup;

    figure.dataset.anim = 'idle';
    const play = () => {
      figure.dataset.anim = 'run';
      observer.disconnect();
    };
    // The whole log in view puts the pins above or beside it in view too.
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && play(), { threshold: 0.9 });
    observer.observe(log);
    // Reached by keyboard before it scrolled in: never leave focus on a hidden entry.
    figure.addEventListener('focusin', play, { signal });

    return () => {
      cleanup();
      observer.disconnect();
      delete figure.dataset.anim;
    };
  }, []);

  return (
    <figure ref={ref} aria-label={label} className={className}>
      {children}
    </figure>
  );
}
