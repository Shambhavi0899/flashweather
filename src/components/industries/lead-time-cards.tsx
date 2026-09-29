'use client';

import { useEffect, useId, useRef, useState } from 'react';

/** The sweep the slider plays once when the cards scroll in, ms. */
const SWEEP_MS = 2000;
/** Ticks the slider can show: every flip point must be one of these (styles/industry-lead-time.css). */
export type LeadTimeMark = { at: number; label: string };

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/**
 * A "warning lead time" slider over a row of cards. Each card that carries a
 * flip point (`[data-flip-at]`, set by the cards section from `flipAt`) turns
 * over when the slider reaches it: its red problem label fades out, its photo
 * title fades in with a green check, and its photo comes up from dimmed to
 * full brightness. The cards flip at different minutes, so dragging the
 * slider reads as the warning buying back one problem after another.
 *
 * The markup is the finished state: the slider at its maximum and every card
 * turned over, which is what no JavaScript and reduced motion get. Otherwise
 * the section is armed at 0 and, the first time it scrolls in, the slider
 * sweeps 0 → max in about two seconds; after that (or as soon as it is
 * touched) it is the reader's. It is a native range input, so keyboard and
 * assistive tech work as they would on any slider.
 */
export function LeadTimeCards({
  label,
  max,
  marks,
  children,
}: {
  label: string;
  max: number;
  marks: LeadTimeMark[];
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inputId = useId();
  const [value, setValue] = useState(max);
  const sweep = useRef(0);

  // Flip the cards and fill the track for the current value.
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    root.style.setProperty('--ilt-fill', `${(value / max) * 100}%`);
    root.querySelectorAll<HTMLElement>('[data-flip-at]').forEach((card) => {
      card.toggleAttribute('data-on', value >= Number(card.dataset.flipAt));
    });
  }, [value, max]);

  // Arm at 0 and sweep once on the first scroll-in, unless motion is unwelcome.
  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    root.setAttribute('data-armed', '');
    setValue(0);

    const play = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / SWEEP_MS);
        setValue(Math.round(ease(t) * max));
        if (t < 1) sweep.current = requestAnimationFrame(tick);
        else sweep.current = 0;
      };
      sweep.current = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        play();
      },
      { threshold: 0.35 },
    );
    observer.observe(root);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(sweep.current);
      root.removeAttribute('data-armed');
    };
  }, [max]);

  // The reader takes over: stop the sweep where it is.
  const takeOver = () => {
    cancelAnimationFrame(sweep.current);
    sweep.current = 0;
  };

  return (
    <div ref={ref} className="ilt">
      <div className="ilt-control">
        <div className="ilt-head">
          <label htmlFor={inputId} className="ilt-label">
            {label}
          </label>
          <output htmlFor={inputId} className="ilt-value" aria-hidden>
            {value} min
          </output>
        </div>
        <div className="ilt-slider">
          <input
            id={inputId}
            type="range"
            min={0}
            max={max}
            step={1}
            value={value}
            aria-valuetext={`${value} minutes of warning`}
            onPointerDown={takeOver}
            onKeyDown={takeOver}
            onChange={(event) => {
              takeOver();
              setValue(Number(event.target.value));
            }}
            className="ilt-input"
          />
          <ul aria-hidden className="ilt-marks">
            <li className="ilt-mark ilt-mark-end" data-at="0">
              0 min
            </li>
            {marks.map((mark) => (
              <li key={mark.at} className="ilt-mark" data-at={mark.at} data-on={value >= mark.at || undefined}>
                <span className="ilt-mark-min">{mark.at} min</span>
                <span className="ilt-mark-label">{mark.label}</span>
              </li>
            ))}
            <li className="ilt-mark ilt-mark-end" data-at={max}>
              {max} min
            </li>
          </ul>
        </div>
      </div>
      {children}
    </div>
  );
}
