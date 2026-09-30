'use client';

import Image from 'next/image';
import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';

import { BOLT_PATH } from '@/components/bolt-path';

/** The app's own screens, one per phone (public/app). `width`/`height` are each file's. */
const SCREENS = '/app';

const PHONES = [
  {
    key: 'lightning-probability',
    width: 430,
    height: 956,
    label: 'Lightning Probability',
    alt: 'The Flash mobile app showing 1-hour lightning probability around San Antonio, Texas, from 1–20% to 80–100%',
  },
  {
    key: 'future-radar',
    width: 424,
    height: 956,
    label: 'Future Radar',
    alt: 'The Flash mobile app showing 18-hour future radar over Louisiana and Mississippi with a timeline slider',
  },
  {
    key: 'live-radar',
    width: 424,
    height: 956,
    label: 'Live Radar',
    alt: 'The Flash mobile app showing current radar over Louisiana with a heavy storm cell near the coast',
  },
  {
    key: '7-day-forecast',
    width: 426,
    height: 938,
    label: '7-Day Forecast',
    alt: 'The Flash mobile app showing the hourly forecast and a 7-day daily forecast with highs, lows, rain chance and wind',
  },
] as const;

/** How long a mouse has to rest on a phone or a label before it comes forward. */
const HOVER_MS = 140;
/** After a person picks a phone, the cycle waits this long before it plays on. */
const IDLE_MS = 5000;
/** The fan-in and the labels are done (styles/mobile-app-hero.css): selection takes over. */
const INTRO_MS = 1450;
/** The push notification lands this long after the intro, once. */
const NOTICE_MS = 500;
/** A swipe on the one-phone layout moves on past this many pixels. */
const SWIPE_PX = 40;

/** Motion is on unless the reader asks for less; the server renders the still lineup. */
const MOTION = '(prefers-reduced-motion: no-preference)';
const subscribe = (notify: () => void) => {
  const query = window.matchMedia(MOTION);
  query.addEventListener('change', notify);
  return () => query.removeEventListener('change', notify);
};
const matches = () => window.matchMedia(MOTION).matches;
/** Below sm the lineup is one phone at a time (styles/mobile-app-hero.css). */
const ONE_UP = '(width < 640px)';

/**
 * The Mobile App hero's four phones: Lightning Probability, Future Radar,
 * Live Radar and the 7-Day Forecast, cut from the app's product lineup.
 *
 * The motion is CSS (styles/mobile-app-hero.css) on the hero's timings:
 *   intro   right after the headline, in 600ms, the phones fan out from a
 *           tilted stack in the centre to their places and settle
 *           straight; the labels rise under them
 *   select  the labels are tabs. The selected phone scales up and comes
 *           forward, the others dim and sit back. Hover (mouse) or click a
 *           label or a phone to bring it forward
 *   cycle   the selected label's bar fills over 2.5s and the next phone takes
 *           over. It holds while the pointer is on the lineup, while a key
 *           has focus in it, while the hero is off screen, while the
 *           notification is up, and for 5s after a person picks
 *   notice  once, 500ms after the intro: a push notification drops onto the
 *           front phone, holds 2.5s, and leaves
 *   float   each phone drifts 3px, out of step with the others
 *
 * Below sm it is one phone at a time: swipe, or tap the dots. With reduced
 * motion the lineup is still, Lightning Probability forward, and there is no
 * notification. Without JavaScript the phones fan in and stay level.
 *
 * A screenshot that fails to load is hidden (`data-failed`), so the phone
 * shows its dark display and never a broken-image icon.
 */
export function MobileAppPhones() {
  const motion = useSyncExternalStore(subscribe, matches, () => false);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  /** The phone the notification landed on, while it is up; -1 before, null after. */
  const [notice, setNotice] = useState<number | null>(-1);
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const hover = useRef(0);
  const idle = useRef(0);
  const swipe = useRef<{ x: number; y: number; dx: number; dragging: boolean } | null>(null);
  const swiped = useRef(false);
  const activeRef = useRef(active);
  const base = useId();

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  // With motion, the selection waits for the fan-in, and the notification comes 500ms after it.
  useEffect(() => {
    if (!motion) return;
    const done = window.setTimeout(() => setReady(true), INTRO_MS);
    const drop = window.setTimeout(() => setNotice(activeRef.current), INTRO_MS + NOTICE_MS);
    return () => {
      clearTimeout(done);
      clearTimeout(drop);
    };
  }, [motion]);

  // A screenshot that failed before React was listening: hide it now.
  useEffect(() => {
    root.current?.querySelectorAll<HTMLImageElement>('.mph-shot').forEach((img) => {
      if (img.complete && img.naturalWidth === 0) img.setAttribute('data-failed', '');
    });
  }, []);

  useEffect(
    () => () => {
      clearTimeout(hover.current);
      clearTimeout(idle.current);
    },
    [],
  );

  const count = PHONES.length;
  const step = (from: number, by: number) => (from + by + count) % count;

  /** A person is choosing: the cycle holds until they have left it alone for 5s. */
  const hold = () => {
    const el = root.current;
    if (!el) return;
    el.setAttribute('data-hold', '');
    clearTimeout(idle.current);
    idle.current = window.setTimeout(() => el.removeAttribute('data-hold'), IDLE_MS);
  };

  const pick = (i: number, focus = false) => {
    setActive(i);
    hold();
    if (focus) tabs.current[i]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const by = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (by) pick(step(active, by), true);
    else if (event.key === 'Home') pick(0, true);
    else if (event.key === 'End') pick(count - 1, true);
    else return;
    event.preventDefault();
  };

  /** Mouse only: resting on a phone or a label brings it forward, after a beat. */
  const hoverProps = (i: number) => ({
    onPointerEnter: (event: React.PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      clearTimeout(hover.current);
      hover.current = window.setTimeout(() => pick(i), HOVER_MS);
    },
    onPointerLeave: () => clearTimeout(hover.current),
  });

  /* One phone at a time: the phones follow a horizontal drag, and a drag
     past 40px moves one phone on. Vertical drags stay the page's. */
  const setDrag = (px: number | null) => {
    const el = root.current;
    if (!el) return;
    if (px === null) {
      el.removeAttribute('data-dragging');
      el.style.removeProperty('--mph-drag');
    } else {
      el.setAttribute('data-dragging', '');
      el.style.setProperty('--mph-drag', `${Math.round(px)}px`);
    }
  };

  const stageProps = {
    onPointerDown: (event: React.PointerEvent) => {
      if (event.pointerType === 'mouse' || !window.matchMedia(ONE_UP).matches) return;
      swipe.current = { x: event.clientX, y: event.clientY, dx: 0, dragging: false };
      swiped.current = false;
    },
    onPointerMove: (event: React.PointerEvent) => {
      const s = swipe.current;
      if (!s) return;
      const dx = event.clientX - s.x;
      const dy = event.clientY - s.y;
      if (!s.dragging) {
        if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
          swipe.current = null;
          return;
        }
        if (Math.abs(dx) < 8) return;
        s.dragging = true;
      }
      // Past either end the drag gives, but only a little.
      const atEnd = (dx > 0 && active === 0) || (dx < 0 && active === count - 1);
      s.dx = dx;
      setDrag(atEnd ? dx / 3 : dx);
    },
    onPointerUp: () => {
      const s = swipe.current;
      swipe.current = null;
      if (!s?.dragging) return;
      swiped.current = true;
      setDrag(null);
      if (s.dx <= -SWIPE_PX && active < count - 1) pick(active + 1);
      else if (s.dx >= SWIPE_PX && active > 0) pick(active - 1);
    },
    onPointerCancel: () => {
      swipe.current = null;
      setDrag(null);
    },
  };

  const tabId = (i: number) => `${base}-tab-${i}`;
  const panelId = (i: number) => `${base}-panel-${i}`;

  return (
    <div
      ref={root}
      data-ready={ready ? '' : undefined}
      data-notify={notice !== null && notice >= 0 ? '' : undefined}
      className="mph w-full max-w-[680px]"
    >
      <div className="mph-stage" {...stageProps}>
        {PHONES.map((phone, i) => (
          <div
            key={phone.key}
            role="tabpanel"
            id={panelId(i)}
            aria-labelledby={tabId(i)}
            aria-hidden={active !== i}
            data-rel={i - active}
            data-on={active === i ? '' : undefined}
            className="mph-slot"
            onClick={() => {
              if (swiped.current) swiped.current = false;
              else pick(i);
            }}
            {...hoverProps(i)}
          >
            <div className="mph-float">
              <div className="mph-phone">
                <div className="mph-screen">
                  <Image
                    src={`${SCREENS}/app-screen-${phone.key}.png`}
                    alt={phone.alt}
                    width={phone.width}
                    height={phone.height}
                    quality={90}
                    preload={i === 0}
                    loading={i === 0 ? undefined : 'eager'}
                    sizes="(min-width: 1280px) 200px, (min-width: 640px) 30vw, 60vw"
                    draggable={false}
                    className="mph-shot"
                    onError={(event) => event.currentTarget.setAttribute('data-failed', '')}
                  />
                </div>
                {notice === i && (
                  <p
                    aria-hidden
                    className="mph-notice"
                    onAnimationEnd={(event) => {
                      if (event.animationName === 'mph-notice') setNotice(null);
                    }}
                  >
                    <span className="mph-notice-head">
                      <span className="mph-notice-icon">
                        <svg viewBox="0 0 26 34">
                          <path d={BOLT_PATH} />
                        </svg>
                      </span>
                      <span className="mph-notice-app">Flash</span>
                      <span className="mph-notice-time">now</span>
                    </span>
                    <span className="mph-notice-body">
                      <svg viewBox="0 0 26 34" className="mph-notice-bolt">
                        <path d={BOLT_PATH} />
                      </svg>
                      Lightning predicted near you{"\u00a0·\u00a022\u00a0min"}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p aria-hidden className="mph-caption">
        {PHONES[active].label}
      </p>

      <div role="tablist" aria-label="Flash mobile app screens" className="mph-tabs" onKeyDown={onKeyDown}>
        {PHONES.map((phone, i) => (
          <button
            key={phone.key}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={tabId(i)}
            aria-selected={active === i}
            aria-controls={panelId(i)}
            tabIndex={active === i ? 0 : -1}
            className="mph-tab"
            onClick={() => pick(i)}
            {...hoverProps(i)}
          >
            <span className="mph-tab-label">{phone.label}</span>
            <span
              aria-hidden
              className="mph-progress"
              onAnimationEnd={(event) => {
                if (event.animationName === 'mph-progress') setActive(step(i, 1));
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
