'use client';

import { useEffect, useRef } from 'react';

import { Motion } from '@/components/motion';
import { onScrollFrame } from '@/lib/scroll';

/**
 * The Weather Command Center's "Why teams run operations from the Command
 * Center": the four feature tiles glide together into one dashboard window
 * as the section scrolls in, and each panel runs one small live detail
 * (styles/wcc-features.css, wcw-*).
 *
 * Assembly is scrubbed on the shared scroll loop, so it moves with Lenis:
 * `--wcw-t` goes 0 (scattered) → 1 (docked). From 768px the whole window
 * shares one t; below it the panels are stacked and each gets its own, so
 * they dock one by one as they are reached. The markup is the docked window,
 * which is what reduced motion and a browser without JavaScript see.
 *
 * The details only use figures from the copy: 99.6% (panel 02), the 18-hour
 * future radar (panel 03) and the 10-day outlook the overview names (04).
 */

type Item = { title: string; body: string };

/** Future radar hours, from "18-hour future radar"; wcc-features.css holds the same 18. */
const HOURS = 18;
/** The outlook's days, from "a 10-day outlook"; wcc-features.css sizes the highlight for 10. */
const DAYS = 10;

/** Where the window's top is (share of the viewport) when it starts to dock, and how far it rises to finish. */
const FROM = 0.92;
const SPAN = 0.5;
/** Stacked panels dock over a shorter rise, each on its own. */
const STACK_SPAN = 0.32;

const settle = (t: number) => t * t * (3 - 2 * t);
const progress = (top: number, vh: number, span: number) =>
  settle(Math.min(1, Math.max(0, (vh * FROM - top) / (vh * span))));

export function CommandCenterWindow({ items }: { items: Item[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const list = root?.querySelector<HTMLElement>('.wcw-panels');
    if (!root || !list || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const panels = [...list.querySelectorAll<HTMLElement>('.wcw-panel')];
    const stacked = window.matchMedia('(width < 768px)');

    let last = '';
    const read = () => {
      const vh = window.innerHeight;
      // The list itself never moves, so its box is the untransformed layout.
      const box = list.getBoundingClientRect();
      root.toggleAttribute('data-inview', box.bottom > 0 && box.top < vh);

      const each = stacked.matches
        ? panels.map((panel) => progress(box.top + panel.offsetTop, vh, STACK_SPAN))
        : null;
      const frame = each ? each[0] : progress(box.top, vh, SPAN);
      const key = `${frame.toFixed(3)}|${each?.map((t) => t.toFixed(3)).join() ?? ''}`;
      if (key === last) return;
      last = key;

      root.style.setProperty('--wcw-t', frame.toFixed(3));
      panels.forEach((panel, i) => {
        if (each) panel.style.setProperty('--wcw-t', each[i].toFixed(3));
        else panel.style.removeProperty('--wcw-t');
      });
    };

    const stop = onScrollFrame(read);
    return () => {
      stop();
      root.removeAttribute('data-inview');
      root.style.removeProperty('--wcw-t');
      panels.forEach((panel) => panel.style.removeProperty('--wcw-t'));
    };
  }, []);

  const details = [<Hazards key="hazards" />, <Accuracy key="accuracy" body={items[1]?.body} />, <Radar key="radar" />, <Outlook key="outlook" />];

  return (
    <div ref={ref} className="wcw">
      <WindowFrame title="Weather Command Center">
        <ul className="wcw-panels">
          {items.map((item, i) => (
            <Motion
              as="li"
              key={item.title}
              className={`motion wcw-panel wcw-p${i + 1}`}
              count={i === 1 ? accuracyOf(item.body) : undefined}
              replay={false}
              // Whole panel on screen: the details start as it docks, not as it peeks in.
              threshold={0.95}
            >
              <div className="wcw-tile">
                <span aria-hidden className="text-micro font-extrabold tracking-[0.13em] text-viz-gold">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div aria-hidden className="wcw-viz">
                  {details[i]}
                </div>
                <h3 className="text-h4 leading-h4 font-extrabold tracking-display text-text-on-dark">{item.title}</h3>
                <p className="wcw-body mt-2 text-[15px] leading-6 text-pretty">{item.body}</p>
              </div>
            </Motion>
          ))}
        </ul>
      </WindowFrame>
    </div>
  );
}

/**
 * A dashboard window: a slim title bar with a live dot, and whatever it
 * holds filling the body. Inside CommandCenterWindow its chrome fades in
 * with the assembly; anywhere else it is simply drawn.
 */
export function WindowFrame({
  title,
  className = '',
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`wcw-frame ${className}`}>
      <div aria-hidden className="wcw-bar">
        <span className="wcw-live" />
        {title}
      </div>
      {children}
    </div>
  );
}

/** "99.6% accuracy on a 1x1 km grid" -> "99.6%". */
function accuracyOf(body: string) {
  return body.match(/\d+(?:\.\d+)?%/)?.[0];
}

/* ------------------------------------------------------------------ */
/* The four details                                                    */
/* ------------------------------------------------------------------ */

/** The site's line icons: a 24 grid, 1.5 stroke, round caps (as faq-accordion.tsx). */
const CLOUD = 'M7.2 14.5a3.7 3.7 0 0 1-.4-7.38 5.2 5.2 0 0 1 10 1.03 3.2 3.2 0 0 1 .4 6.35H7.2Z';

const HAZARDS = [
  { id: 'bolt', path: <path d="M15.7 2.5 4.7 13.5h5l-1.4 8 11-12h-5.7l2.1-7Z" /> },
  {
    id: 'hail',
    path: (
      <>
        <path d={CLOUD} />
        <circle cx="8.5" cy="18.6" r="1.1" />
        <circle cx="12" cy="20.2" r="1.1" />
        <circle cx="15.5" cy="18.6" r="1.1" />
      </>
    ),
  },
  {
    id: 'heat',
    path: (
      <>
        <path d="M14.5 13.6V5.5a2.5 2.5 0 0 0-5 0v8.1a4.5 4.5 0 1 0 5 0Z" />
        <path d="M12 8.5v6.2" />
        <circle cx="12" cy="17" r="1.6" />
      </>
    ),
  },
  { id: 'wind', path: <path d="M3.5 9h10a2.5 2.5 0 1 0-2.5-2.5M3.5 13h14a2.5 2.5 0 1 1-2.5 2.5M3.5 17h6" /> },
  {
    id: 'rain',
    path: (
      <>
        <path d={CLOUD} />
        <path d="m9 17.5-1 2.5M13 17.5l-1 2.5M17 17.5l-1 2.5" />
      </>
    ),
  },
];

function Hazards() {
  return (
    <>
      <div className="wcw-hazards">
        {HAZARDS.map((hazard, i) => (
          <span key={hazard.id} className={`wcw-haz motion-loop wcw-i${i} ${i === 0 ? 'wcw-haz-bolt' : ''}`}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {hazard.path}
            </svg>
          </span>
        ))}
      </div>
      <p className="wcw-caption">Lightning · hail · heat · wind · rain</p>
    </>
  );
}

function Accuracy({ body }: { body?: string }) {
  const value = body ? accuracyOf(body) : undefined;
  if (!value) return null;
  return (
    <>
      <p className="wcw-acc" data-count>
        {value}
      </p>
      <div className="wcw-acc-track">
        <div className="wcw-acc-fill" />
      </div>
    </>
  );
}

function Radar() {
  return (
    <div className="wcw-radar-row">
      <div className="wcw-radar">
        <span className="wcw-echo wcw-echo-a" />
        <span className="wcw-echo wcw-echo-b" />
        <span className="wcw-sweep motion-loop" />
        <svg viewBox="0 0 88 88" fill="none" stroke="rgb(255 255 255 / 0.14)" strokeWidth="1">
          <circle cx="44" cy="44" r="43.5" />
          <circle cx="44" cy="44" r="29" />
          <circle cx="44" cy="44" r="14.5" />
          <circle cx="44" cy="44" r="1.5" fill="rgb(255 255 255 / 0.5)" stroke="none" />
        </svg>
      </div>
      <div className="wcw-clock">
        <div className="wcw-ticks">
          <div className="wcw-tick-strip motion-loop">
            {Array.from({ length: HOURS + 1 }, (_, h) => (
              <span key={h}>{h === 0 ? 'Now' : `+${h} h`}</span>
            ))}
          </div>
        </div>
        <span className="text-micro leading-micro text-text-on-dark-muted">of {HOURS} h ahead</span>
      </div>
    </div>
  );
}

function Outlook() {
  return (
    <>
      <div className="wcw-days">
        {Array.from({ length: DAYS }, (_, d) => (
          <span key={d} className="wcw-day" />
        ))}
        <span className="wcw-day-hl motion-loop" />
      </div>
      <p className="wcw-day-labels">
        <span className="wcw-day-today">Today</span>
        <span>Day {DAYS}</span>
      </p>
    </>
  );
}
