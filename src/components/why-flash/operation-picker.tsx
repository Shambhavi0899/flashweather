'use client';

import { useEffect, useRef, useState } from 'react';

/** How long the old scenario takes to fade out before the new one fades in. */
const FADE_MS = 140;

/**
 * "An hour of warning changes how you run everything.": the industry chips and
 * the paragraph they drive. The chips are a radio group (click, or the arrow
 * keys, Home and End); the picked industry's scenario sits between the
 * paragraph's fixed opening and its All Clear close. Golf is picked first, so
 * the server HTML is the Golf paragraph.
 *
 * A pick fades the scenario out and the new one in (styles/resources.css).
 * With reduced motion it swaps at once. Below 768px the chips are one row
 * that scrolls sideways.
 */
export function OperationPicker({
  lead,
  close,
  audiences,
}: {
  lead: string;
  close: string;
  audiences: { name: string; scenario: string }[];
}) {
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(0);
  const [fading, setFading] = useState(false);
  const timer = useRef(0);
  const chips = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const select = (next: number) => {
    setActive(next);
    clearTimeout(timer.current);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(next);
      setFading(false);
      return;
    }
    setFading(true);
    timer.current = window.setTimeout(() => {
      setShown(next);
      setFading(false);
    }, FADE_MS);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    let next = -1;
    if (step) next = (active + step + audiences.length) % audiences.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = audiences.length - 1;
    else return;
    event.preventDefault();
    select(next);
    chips.current[next]?.focus();
  };

  return (
    <>
      <div role="radiogroup" aria-label="Choose an operation" className="wfo-chips">
        {audiences.map((audience, i) => (
          <button
            key={audience.name}
            ref={(el) => {
              chips.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active === i}
            tabIndex={active === i ? 0 : -1}
            className="wfo-chip"
            onClick={() => select(i)}
            onKeyDown={onKeyDown}
          >
            {audience.name}
          </button>
        ))}
      </div>
      <p className="text-body-l text-pretty text-text-muted">
        {lead}{' '}
        <span aria-live="polite" data-fading={fading ? '' : undefined} className="wfo-scenario">
          {audiences[shown].scenario}
        </span>{' '}
        {close}
      </p>
    </>
  );
}
