'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

import { onScrollFrame, scrollToCentre, scrollToY } from '@/lib/scroll';

import type { TimelineStep } from './content';
import { CountdownFx } from './countdown-fx';

/**
 * The two live modes; anything else is `still`. The same queries switch the
 * layout in styles/lightning-countdown.css, so the two must match.
 */
const PIN = '(width >= 1024px) and (height >= 700px) and (prefers-reduced-motion: no-preference) and (scripting: enabled)';
const STACK = '(width < 1024px) and (prefers-reduced-motion: no-preference) and (scripting: enabled)';

type Mode = 'pin' | 'stack' | 'still';

const subscribe = (notify: () => void) => {
  const queries = [PIN, STACK].map((query) => window.matchMedia(query));
  queries.forEach((query) => query.addEventListener('change', notify));
  return () => queries.forEach((query) => query.removeEventListener('change', notify));
};
const currentMode = (): Mode =>
  window.matchMedia(PIN).matches ? 'pin' : window.matchMedia(STACK).matches ? 'stack' : 'still';

const clamp = (n: number, max: number) => Math.min(max, Math.max(0, n));

/** "T–60" → 60; "After" → null, the all-clear. */
const minutesOf = (time: string) => {
  const found = time.match(/\d+/);
  return found ? Number(found[0]) : null;
};

/** 3600 → "60:00". */
const format = (seconds: number) => {
  const whole = Math.ceil(seconds);
  return `${String(Math.floor(whole / 60)).padStart(2, '0')}:${String(whole % 60).padStart(2, '0')}`;
};

/** Where a step's scroll window starts, as a share of it: just inside, so the clock reads the step's own time. */
const INTO_STEP = 0.002;

/**
 * "How do teams use the 60 minutes?" as a countdown. On a desktop the stage
 * pins for 40vh of scroll per step while the page scrolls normally: the
 * clock runs from T–60:00 to T–00:00 with the scroll, each step's time
 * falling as its window opens, then reads ALL CLEAR on the last step, and
 * the rail under the dots fills in the steps' colours. Below 1024px the
 * steps stack and the clock sticks to the top of the section, reading the
 * time of the step that last entered view. Reduced motion (and no
 * JavaScript) gets every step at full strength and a still clock.
 */
export function Countdown({ steps, label, header }: { steps: TimelineStep[]; label: string; header: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const mode = useSyncExternalStore(subscribe, currentMode, () => 'still' as const);
  const live = mode !== 'still';
  const marks = steps.map((step) => minutesOf(step.time));
  const start = marks[0] ?? 60;

  useEffect(() => {
    // The root is the track: its height is the scroll the stage stays pinned for.
    const root = ref.current;
    const stage = root?.querySelector<HTMLElement>('.lc-stage');
    const digits = root?.querySelector<HTMLElement>('.lc-clock-digits');
    if (mode === 'still' || !root || !stage || !digits) return;
    const items = [...root.querySelectorAll<HTMLElement>('.lc-step')];
    const count = items.length;

    // The seconds left at `into` (0 → 1) of step `index`'s window: the step's
    // own time running down to the next one's. The strike window holds 0.
    const remaining = (index: number, into: number) => {
      const from = marks[index] ?? 0;
      const to = marks[index + 1] ?? from;
      return (from - (from - to) * into) * 60;
    };

    let shown = '';
    const read = () => {
      const vh = window.innerHeight;
      const box = root.getBoundingClientRect();
      // Overlay loops only run while the section is on screen.
      root.toggleAttribute('data-live', box.bottom > 0 && box.top < vh);

      let index = 0;
      let seconds: number;
      if (mode === 'pin') {
        const run = box.height - stage.offsetHeight;
        const along = clamp(-box.top / run, 1) * count;
        index = Math.min(count - 1, Math.floor(along));
        seconds = remaining(index, along - index);
        // The fill reaches each dot as its step's window opens.
        root.style.setProperty('--lc-fill', clamp(along / (count - 1), 1).toFixed(4));
      } else {
        items.forEach((item, i) => {
          if (item.getBoundingClientRect().top < vh * 0.6) index = i;
        });
        seconds = remaining(index, 0);
      }

      const text = format(seconds);
      if (text !== shown) digits.textContent = shown = text;
      setActive(index);
    };

    // On the shared scroll frame, so it keeps step with smooth scrolling.
    const stop = onScrollFrame(read);
    return () => {
      stop();
      root.style.removeProperty('--lc-fill');
      root.removeAttribute('data-live');
      digits.textContent = format(start * 60);
      setActive(0);
    };
    // `marks` is derived from `steps`, which is static content.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const goTo = (index: number) => {
    const root = ref.current;
    if (!root) return;
    if (mode === 'pin') {
      const stage = root.querySelector<HTMLElement>('.lc-stage');
      if (!stage) return;
      const rect = root.getBoundingClientRect();
      const run = rect.height - stage.offsetHeight;
      scrollToY(window.scrollY + rect.top + (run * (index + INTO_STEP)) / steps.length);
    } else {
      const target = root.querySelectorAll('.lc-step')[index];
      if (target) scrollToCentre(target);
    }
  };

  const clear = live && marks[active] === null;
  const stateOf = (i: number) => (!live ? undefined : i === active ? 'active' : i < active ? 'done' : 'next');

  return (
    <div ref={ref} className="lc-track">
      <div className="lc-stage container-page">
        <div className="lc-head">
          {header}
          <p aria-hidden className="lc-clock" data-phase={live ? active : 0} data-clear={clear ? '' : undefined}>
            <span className="lc-clock-dot" />
            <span className="lc-clock-face">
              <span className="lc-clock-time">
                <span className="lc-clock-sign">T–</span>
                <span className="lc-clock-digits">{format(start * 60)}</span>
              </span>
              <span className="lc-clock-clear">{steps[steps.length - 1].title}</span>
            </span>
          </p>
        </div>

        <div className="lc-steps-wrap">
          <span aria-hidden className="lc-rail">
            <span className="lc-rail-fill" />
          </span>
          <ol aria-label={label} className="lc-steps">
            {steps.map((step, i) => (
              <li
                key={step.time}
                className="lc-step"
                data-state={stateOf(i)}
                aria-current={live && i === active ? 'step' : undefined}
              >
                <div aria-hidden className="lc-marker">
                  <span className={`lc-dot ${step.dot}`}>
                    <svg className="lc-check" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5.2 4 7.5 8.5 2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
                <div className="lc-card">
                  <div className="lc-shot">
                    <Image
                      src={step.image.src}
                      alt={step.image.alt}
                      fill
                      sizes="(min-width: 1440px) 230px, (min-width: 1024px) 18vw, (min-width: 640px) 45vw, 100vw"
                      className="lc-photo object-cover"
                    />
                    <span aria-hidden className="products-photo-grade-15-82 absolute inset-0" />
                    <CountdownFx step={i} />
                    <span className="absolute bottom-[10px] left-3 text-[10px] leading-3 font-extrabold tracking-[0.13em] text-viz-gold uppercase">
                      {step.tag}
                    </span>
                  </div>
                  <div className="lc-copy">
                    <p className="text-[22px] leading-h4 font-bold tracking-heading text-text">{step.time}</p>
                    <h3 className="text-body leading-body-s font-semibold text-text">
                      {live ? (
                        <button type="button" className="lc-link" onClick={() => goTo(i)}>
                          {step.title}
                        </button>
                      ) : (
                        step.title
                      )}
                    </h3>
                    <p className="text-body-s text-pretty text-text-muted">{step.body}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
