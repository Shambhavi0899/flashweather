'use client';

import Link from 'next/link';
import { useEffect, useRef, useSyncExternalStore } from 'react';

import { Motion } from '@/components/motion';
import { DEMO_HREF } from '@/content/navigation';
import { planFit, plans, type Plan } from '@/content/pricing';

/**
 * "Which plan fits how many sites you run?": the "Best fit for" control and
 * the three plan cards it badges (styles/pricing-plans.css, `plan-*`).
 *
 * The control is a radio group (click, or the arrow keys, Home and End).
 * "A portfolio" is picked first, so the server HTML badges Portfolio, and so
 * does the page without JavaScript. One badge slides to the picked card; it
 * is decoration, so the picked card says "Best fit" to assistive tech itself
 * and a polite live line names the pick.
 *
 * The pick is kept for the sections after this one, which read it with
 * `usePlanFit()`. It is in-page state only: it lasts for the visit and is
 * back to the first pick on a fresh load.
 */

let picked: string = planFit.initial;
const listeners = new Set<() => void>();
const subscribe = (onChange: () => void) => {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
};
const pick = (plan: string) => {
  if (plan === picked) return;
  picked = plan;
  for (const listener of listeners) listener();
};

/** The id of the plan the reader picked as their best fit. For the sections after the plans. */
export function usePlanFit() {
  return useSyncExternalStore(
    subscribe,
    () => picked,
    () => planFit.initial,
  );
}

export function PlanFit() {
  const plan = usePlanFit();
  const index = Math.max(
    0,
    plans.findIndex((p) => p.id === plan),
  );

  return (
    <>
      <PlanFitControl plan={plan} />
      <p aria-live="polite" className="sr-only">
        {planFit.badge}: {plans[index].name}
      </p>
      <Motion className="motion plan-motion" replay={false} threshold={0.1}>
        <div className="plan-list" data-pick={index}>
          <span aria-hidden className="plan-badge">
            <span className="plan-badge-pill">
              <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden>
                <path d="M6 0 L0.5 7 H4.5 L3.5 12 L9.5 4.5 H5.5 Z" fill="currentColor" />
              </svg>
              {planFit.badge}
            </span>
          </span>
          <ul className="plan-cards">
            {plans.map((p, i) => (
              <PlanCard key={p.id} plan={p} picked={i === index} />
            ))}
          </ul>
        </div>
      </Motion>
    </>
  );
}

function PlanFitControl({ plan }: { plan: string }) {
  const track = useRef<HTMLDivElement>(null);
  const segments = useRef<(HTMLButtonElement | null)[]>([]);
  const { options } = planFit;
  const active = Math.max(
    0,
    options.findIndex((option) => option.plan === plan),
  );

  // The thumb sits under the checked segment. Segments size to their labels, so it is measured.
  useEffect(() => {
    const group = track.current;
    const segment = segments.current[active];
    if (!group || !segment) return;
    const place = () => {
      group.style.setProperty('--plan-thumb-x', `${segment.offsetLeft}px`);
      group.style.setProperty('--plan-thumb-w', `${segment.offsetWidth}px`);
      if ('thumb' in group.dataset) return;
      void group.offsetWidth; // commit the position first, so the thumb appears in place
      group.dataset.thumb = '';
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(group);
    return () => observer.disconnect();
  }, [active]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    let next = -1;
    if (step) next = (active + step + options.length) % options.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = options.length - 1;
    else return;
    event.preventDefault();
    pick(options[next].plan);
    segments.current[next]?.focus();
  };

  return (
    <div className="plan-pick">
      <p id="plan-fit-label" className="plan-pick-label">
        {planFit.label}
      </p>
      <div ref={track} role="radiogroup" aria-labelledby="plan-fit-label" className="plan-segs">
        <span aria-hidden className="plan-thumb" />
        {options.map((option, i) => (
          <button
            key={option.plan}
            ref={(el) => {
              segments.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active === i}
            tabIndex={active === i ? 0 : -1}
            data-label={option.label}
            className="plan-seg"
            onClick={() => pick(option.plan)}
            onKeyDown={onKeyDown}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Check() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden className="mt-[2px] shrink-0">
      <circle cx="10" cy="10" r="10" fill="var(--color-neutral-100)" />
      <path
        d="M6 10.5l2.6 2.6L14 7.5"
        fill="none"
        stroke="var(--color-brand-blue)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const eyebrow = 'text-micro font-bold tracking-[0.13em] uppercase';

function PlanCard({ plan, picked }: { plan: Plan; picked: boolean }) {
  return (
    <li className="plan-card" data-picked={picked || undefined}>
      <div className="plan-head flex flex-col gap-3">
        <p className={`${eyebrow} ${plan.featured ? 'text-text' : 'text-text-muted'}`}>
          {picked && <span className="sr-only">{planFit.badge}. </span>}
          {plan.eyebrow}
        </p>
        <h3 className="text-[28px] leading-[34px] font-extrabold tracking-[-0.03em] text-text">{plan.name}</h3>
        <p className="text-body text-text-muted">{plan.audience}</p>
      </div>
      <div className="plan-basis flex flex-col gap-1">
        <p className="text-body-l leading-body font-semibold text-text">{plan.basis}</p>
        <p className="text-body-s text-text-muted">{plan.basisNote}</p>
      </div>
      <Link href={DEMO_HREF} className="plan-cta">
        Get a quote<span className="sr-only"> for {plan.name}</span>
        <span aria-hidden className="plan-arrow">
          →
        </span>
      </Link>
      <div className="flex flex-col gap-3 pt-1">
        <p className={`${eyebrow} text-text-muted`}>{plan.includesLabel}</p>
        <ul className="flex flex-col gap-3">
          {plan.includes.map((item) => (
            <li key={item} className="flex items-start gap-3 text-[15px] leading-6 text-text">
              <Check />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
