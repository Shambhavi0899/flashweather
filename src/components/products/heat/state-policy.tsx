'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { ButtonLink } from '@/components/button';

import type { PolicyState } from './policy-states';
import { MAP_H, MAP_W, stateShapes } from './state-map';

/** How long a mouse has to rest on a state before its card comes up. */
const HOVER_MS = 140;

/**
 * "Which state heat policy applies to you?": the policy card and the states
 * that pick it. Georgia is shown first: its GHSA bands as a heat bar, gold
 * to red, with each band's rule under its stretch of the bar. A sibling
 * state shows its name, its association and its page (a link once the page
 * is published); no thresholds are shown for a state we have not written up.
 *
 * The states are a small flat map from 768px and a row of chips below it,
 * both a radio group: click, a resting mouse (map), or the arrow keys.
 *
 * Motion is CSS (styles/heat-states.css) on the section's .motion block: the
 * bar fills left to right as the section scrolls in and each rule rises as
 * its band fills, then the photo's caption fades in. Reduced motion shows it
 * all at once.
 */
export function StatePolicyPicker({
  states,
  bands,
}: {
  states: PolicyState[];
  bands: { temp: string; rule: string }[];
}) {
  const [active, setActive] = useState(0);
  const hover = useRef(0);
  const radios = useRef<Record<string, (HTMLElement | SVGElement | null)[]>>({ map: [], chips: [] });

  useEffect(() => () => clearTimeout(hover.current), []);

  const onKeyDown = (group: 'map' | 'chips') => (event: React.KeyboardEvent) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    let next = -1;
    if (step) next = (active + step + states.length) % states.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = states.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    radios.current[group][next]?.focus();
  };

  const georgia = states[0];

  return (
    <div className="hst">
      <div className="hst-cards">
        <article data-on={active === 0 ? '' : undefined} className="hst-card hst-card-lead">
          <h3 className="text-h4 leading-h4 font-semibold text-text">
            {georgia.name} · {georgia.association}
          </h3>
          <ol className="hst-bands">
            {bands.map((band, i) => (
              <li key={band.temp} className="hst-band" data-band={i}>
                <span aria-hidden className="hst-seg" />
                <span className="hst-temp">{band.temp} °F</span>
                <span className="hst-rule">{band.rule}</span>
              </li>
            ))}
          </ol>
          {georgia.href && (
            <ButtonLink href={georgia.href} variant="blue" size="sm" className="self-start">
              Read the Georgia policy
            </ButtonLink>
          )}
        </article>

        {states.slice(1).map((state, i) => (
          <article key={state.slug} data-on={active === i + 1 ? '' : undefined} className="hst-card hst-card-sibling">
            <svg aria-hidden viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="hst-card-shape">
              <path d={stateShapes[state.slug]?.d} />
            </svg>
            <p className="text-micro font-semibold tracking-label text-text-muted uppercase">{state.association}</p>
            <h3 className="text-h3 leading-h3 font-semibold text-text">{state.name}</h3>
            {state.href ? (
              <Link href={state.href} className="text-body-s leading-5 font-medium text-brand-blue hover:underline">
                Sibling page <span aria-hidden>→</span>
              </Link>
            ) : (
              <p className="text-body-s leading-5 text-text-muted">Sibling page · not published yet</p>
            )}
          </article>
        ))}
      </div>

      <div className="hst-pick">
        <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="hst-map" role="radiogroup" aria-label="Choose a state">
          {states.map((state, i) => {
            const shape = stateShapes[state.slug];
            if (!shape) return null;
            const [abbr, x, y] = shape.label;
            return (
              <g
                key={state.slug}
                ref={(el) => {
                  radios.current.map[i] = el;
                }}
                role="radio"
                aria-checked={active === i}
                aria-label={`${state.name} · ${state.association}`}
                tabIndex={active === i ? 0 : -1}
                data-on={active === i ? '' : undefined}
                className="hst-state"
                onClick={() => setActive(i)}
                onKeyDown={onKeyDown('map')}
                onPointerEnter={(event) => {
                  if (event.pointerType !== 'mouse') return;
                  clearTimeout(hover.current);
                  hover.current = window.setTimeout(() => setActive(i), HOVER_MS);
                }}
                onPointerLeave={() => clearTimeout(hover.current)}
              >
                <path d={shape.d} className="hst-shape" />
                <text x={x} y={y} className="hst-abbr">
                  {abbr}
                </text>
              </g>
            );
          })}
        </svg>

        <div role="radiogroup" aria-label="Choose a state" className="hst-chips">
          {states.map((state, i) => (
            <button
              key={state.slug}
              ref={(el) => {
                radios.current.chips[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={active === i}
              tabIndex={active === i ? 0 : -1}
              className="hst-chip"
              onClick={() => setActive(i)}
              onKeyDown={onKeyDown('chips')}
            >
              {state.name} · {state.association}
            </button>
          ))}
        </div>

        <ul className="hst-links">
          <li>
            <Link href={georgia.href ?? '/'} className="text-body-s leading-5 font-medium text-brand-blue hover:underline">
              Georgia heat policy <span aria-hidden>→</span>
            </Link>
          </li>
          <li>
            <Link href="/industries-we-serve/schools/" className="text-body-s leading-5 font-medium text-brand-blue hover:underline">
              Schools &amp; athletics <span aria-hidden>→</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
