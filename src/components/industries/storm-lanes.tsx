'use client';

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';

import type { IndustrySection } from '@/content/industries';
import { onScrollFrame } from '@/lib/scroll';

type Step = Extract<IndustrySection, { type: 'timeline' }>['steps'][number];

/**
 * A timeline row as swimlanes (styles/industry-storm-lanes.css, swl-*): the
 * times across the top, one lane per team, each step a compact card in its
 * lane at its time, and a step with `lane: 'all'` a red marker across every
 * lane. Clicking a card opens its full copy, one at a time.
 *
 * From 1024px a thin "now" line runs left → right, scrubbed by the scroll
 * while the board passes through view (the shared scroll loop, so it moves
 * in Lenis's frame); each card pops in as the line reaches it and stays.
 * Under 1024px the lanes fold into one list, each card tagged with its lane,
 * and cards pop in as they scroll into view. Server HTML, no JavaScript and
 * reduced motion get every card and no line. The same queries switch the
 * layout in the stylesheet, so the two must match.
 */
const LANES = '(width >= 1024px) and (prefers-reduced-motion: no-preference) and (scripting: enabled)';
const LIST = '(width < 1024px) and (prefers-reduced-motion: no-preference) and (scripting: enabled)';

type Mode = 'lanes' | 'list' | 'still';

const subscribe = (notify: () => void) => {
  const queries = [LANES, LIST].map((query) => window.matchMedia(query));
  queries.forEach((query) => query.addEventListener('change', notify));
  return () => queries.forEach((query) => query.removeEventListener('change', notify));
};
const currentMode = (): Mode =>
  window.matchMedia(LANES).matches ? 'lanes' : window.matchMedia(LIST).matches ? 'list' : 'still';

/** The line sets off when the board's top reaches 75% down the screen and arrives when it reaches 20%. */
const START = 0.75;
const END = 0.2;
/** How far past a card's left edge the line is when the card pops in. */
const REACH = 8;
/** Cards that scroll in together in the list pop in this far apart. */
const LIST_STAGGER_MS = 90;

const clamp = (n: number) => Math.min(1, Math.max(0, n));

export function StormLanes({ lanes, steps, label }: { lanes: string[]; steps: Step[]; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const [open, setOpen] = useState<number | null>(null);
  const mode = useSyncExternalStore(subscribe, currentMode, () => 'still' as const);

  useEffect(() => {
    const root = ref.current;
    if (!root || mode === 'still') return;
    const events = [...root.querySelectorAll<HTMLElement>('.swl-event')];

    if (mode === 'list') {
      const observer = new IntersectionObserver(
        (entries) => {
          let order = 0;
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const event = entry.target as HTMLElement;
            event.style.setProperty('--swl-delay', `${order++ * LIST_STAGGER_MS}ms`);
            event.dataset.on = '';
            observer.unobserve(event);
          });
        },
        { threshold: 0.3 },
      );
      events.filter((event) => !('on' in event.dataset)).forEach((event) => observer.observe(event));
      return () => observer.disconnect();
    }

    const ticks = [...root.querySelectorAll<HTMLElement>('.swl-tick')];
    events.forEach((event) => event.style.removeProperty('--swl-delay'));
    let shown = '';
    const read = () => {
      const top = root.getBoundingClientRect().top;
      const height = window.innerHeight;
      const progress = clamp((height * START - top) / (height * (START - END)));
      const value = progress.toFixed(4);
      if (value === shown) return;
      shown = value;
      root.style.setProperty('--swl-p', value);
      // offsetLeft ignores the cards' pop-in scale, so the reach is the laid-out edge.
      const x = progress * root.clientWidth;
      events.forEach((event) => {
        if (x >= event.offsetLeft + REACH) event.dataset.on = '';
      });
      ticks.forEach((tick) => tick.toggleAttribute('data-past', x >= tick.offsetLeft + REACH));
    };
    const stop = onScrollFrame(read);
    return () => {
      stop();
      root.style.removeProperty('--swl-p');
    };
  }, [mode]);

  return (
    <div ref={ref} className="swl" data-mode={mode}>
      <div aria-hidden className="swl-axis">
        {steps.map((step) => (
          <p key={step.time} className="swl-tick" data-warn={step.tone === 'warning' ? '' : undefined}>
            <span className="swl-tick-time">{step.time}</span>
            <span className="swl-tick-dot" />
          </p>
        ))}
      </div>

      {lanes.map((lane, i) => (
        <p key={lane} aria-hidden className="swl-lane" data-lane={i}>
          <span className="swl-lane-dot" />
          {lane}
        </p>
      ))}

      <ol className="swl-events" aria-label={label}>
        {steps.map((step, i) => {
          const lane = step.lane ?? 0;
          const isOpen = open === i;
          return (
            <li
              key={step.time}
              className="swl-event"
              data-col={i + 1}
              data-lane={lane}
              data-open={isOpen ? '' : undefined}
            >
              <div className="swl-card">
                <h3>
                  <button
                    type="button"
                    id={`${id}-e${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`${id}-b${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="swl-button"
                  >
                    <span className="swl-meta">
                      <span className="swl-time">{step.time}</span>
                      <span className="swl-tag">
                        <span aria-hidden className="swl-tag-dot" />
                        {lane === 'all' ? 'All teams' : lanes[lane]}
                      </span>
                    </span>
                    <span className="swl-title">{step.title}</span>
                    <span aria-hidden className="swl-mark">
                      <svg width="10" height="10" viewBox="0 0 10 10">
                        <path d="M5 1v8M1 5h8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>
                </h3>
                <div id={`${id}-b${i}`} role="region" aria-labelledby={`${id}-e${i}`} className="swl-panel">
                  <div className="swl-body">
                    <p>{step.body}</p>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div aria-hidden className="swl-now">
        <span className="swl-now-pill">Now</span>
      </div>
    </div>
  );
}
