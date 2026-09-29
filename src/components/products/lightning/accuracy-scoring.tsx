'use client';

import Image from 'next/image';
import { useEffect, useId, useRef } from 'react';

import { BOLT_PATH } from '@/components/bolt-path';
import { Motion } from '@/components/motion';
import { SectionLabel } from '@/components/products/section-header';
import { scrollToCentre } from '@/lib/scroll';

import { BASEMAP, FORECAST, MAP, STRIKES, TOWNS } from './accuracy-map';
import type { accuracy } from './content';
import { BasemapOver, BasemapUnder, MapDefs, StormField, Town } from './map-layers';

type Copy = typeof accuracy;

/**
 * The loop, in ms, in three stages that are the method's three steps:
 * Predict (the forecast area glows in), Observe (the strikes land), Score
 * (each strike gets its ring, the tally counts up). A hold, then everything
 * fades and it starts again.
 */
const FORECAST_AT = 200;
const OBSERVE_AT = 2000;
const SCORE_AT = 6400;
const STAGES = [0, OBSERVE_AT, SCORE_AT];
const STRIKE_AT = (i: number) => OBSERVE_AT + 200 + i * 150;
const CHECK_AT = (i: number) => SCORE_AT + 200 + i * 110;
/** The tally runs from the first check to just after the last, frame by frame. */
const COUNT_FROM = CHECK_AT(0);
const COUNT_TO = CHECK_AT(STRIKES.length - 1) + 110;
const FADE_AT = COUNT_TO + 2600;
const CYCLE = FADE_AT + 1000;
/** Wait for the visual's own rise before the first run. */
const FIRST_DELAY = 1700;

const stageAt = (t: number) => (t >= SCORE_AT ? 2 : t >= OBSERVE_AT ? 1 : 0);
const format = (n: number) => n.toLocaleString('en-US');
/** The small bolt a strike lands as: BOLT_PATH (26×34) at 0.4, centred. */
const BOLT = `translate(-5.2 -6.8) scale(0.4)`;

/**
 * "Ground truth" as a scoring run, on the hero map's basemap and bands
 * (map-layers.tsx), and the method steps it plays out. The forecast area
 * glows in (Predict), the strikes that actually landed drop in one by one as
 * small bolts with a flash (Observe), then each one inside the forecast gets
 * a green check ring, the one outside a grey ring, while the tally counts up
 * to the real totals behind 99.6% (Score). It loops slowly while on screen.
 *
 * The step for the stage that is playing is at full strength with a gold
 * number and the line filled down to it; the others step back. A step is a
 * button: it jumps the run to its stage, scrolling the visual into view first
 * where it is off screen (phones, where the steps come after it).
 *
 * The two blocks are separate grid items (styles/lightning-accuracy.css
 * places them). The markup is the final frame: with reduced motion or no
 * JavaScript, and whenever the run is paused off screen, the visual is the
 * finished tally and every step is shown.
 */
export function AccuracyScoring({ copy }: { copy: Copy }) {
  const ref = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLOListElement>(null);
  const figureId = useId();
  const mapId = useId();
  const { image, scoring, method } = copy;

  useEffect(() => {
    const root = ref.current;
    const list = stepsRef.current;
    if (!root || !list || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const forecast = root.querySelector<SVGElement>('.la-forecast');
    const strikes = [...root.querySelectorAll<SVGElement>('.la-strike')];
    const steps = [...list.querySelectorAll<HTMLButtonElement>('.la-step-button')];
    const scored = root.querySelector<HTMLElement>('[data-tally="scored"]');
    const inside = root.querySelector<HTMLElement>('[data-tally="inside"]');
    if (!forecast || !scored || !inside) return;

    let frame = 0;
    let timer = 0;
    let start = 0;
    let counted = -1;
    let stage = -1;
    let running = false;
    /** The stage a click asked for while the visual was off screen. */
    let pending = 0;

    // Counts with the Score stage, frame by frame: 0 before it, the totals after.
    const tally = (t: number) => {
      const progress = Math.min(1, Math.max(0, (t - COUNT_FROM) / (COUNT_TO - COUNT_FROM)));
      const count = Math.round(scoring.scored.total * progress);
      if (count === counted) return;
      counted = count;
      scored.textContent = format(count);
      inside.textContent = format(Math.round(scoring.inside.total * progress));
    };

    const showStage = (next: number) => {
      if (next === stage) return;
      stage = next;
      list.dataset.stage = String(next);
      steps.forEach((step, i) => {
        if (i === next) step.setAttribute('aria-current', 'step');
        else step.removeAttribute('aria-current');
      });
    };

    // `still`: a strike that lands in this pass is already there, with no pop
    // or flash (a jump past it). One that is taken back loses the mark.
    const land = (el: Element, on: boolean, still: boolean) => {
      if (on && !el.hasAttribute('data-on') && still) el.setAttribute('data-still', '');
      if (!on) el.removeAttribute('data-still');
      el.toggleAttribute('data-on', on);
    };

    const draw = (t: number, still = false) => {
      forecast.toggleAttribute('data-on', t >= FORECAST_AT);
      strikes.forEach((strike, i) => {
        land(strike, t >= STRIKE_AT(i), still);
        strike.toggleAttribute('data-scored', t >= CHECK_AT(i));
      });
      tally(t);
      root.toggleAttribute('data-fading', t >= FADE_AT);
      showStage(stageAt(t));
    };

    const reset = () => {
      root.removeAttribute('data-fading');
      forecast.removeAttribute('data-on');
      strikes.forEach((el) => {
        el.removeAttribute('data-on');
        el.removeAttribute('data-still');
        el.removeAttribute('data-scored');
      });
      counted = -1;
      tally(0);
    };

    const tick = (now: number) => {
      const t = now - start;
      if (t >= CYCLE) {
        reset();
        start = now;
        draw(0);
      } else {
        draw(t);
      }
      frame = requestAnimationFrame(tick);
    };

    /** Starts the run at a stage: what came before it is simply there. */
    const runFrom = (next: number) => {
      start = performance.now() - STAGES[next];
      draw(STAGES[next], true);
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      frame = 0;
    };

    /** Off screen, or unmounted: back to the markup's own finished frame. */
    const finish = () => {
      stop();
      reset();
      root.removeAttribute('data-live');
      list.removeAttribute('data-live');
      delete list.dataset.stage;
      stage = -1;
      steps.forEach((step) => step.removeAttribute('aria-current'));
      scored.textContent = format(scoring.scored.total);
      inside.textContent = format(scoring.inside.total);
    };

    // Runs only while on screen; each return starts a fresh run.
    let seen = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (running) return;
          running = true;
          root.setAttribute('data-live', '');
          list.setAttribute('data-live', '');
          reset();
          const from = pending;
          pending = 0;
          timer = window.setTimeout(() => runFrom(from), seen ? 300 : FIRST_DELAY);
          seen = true;
        } else if (running) {
          running = false;
          finish();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(root);

    const onClick = (event: MouseEvent) => {
      const step = (event.target as Element).closest('.la-step-button');
      const next = steps.indexOf(step as HTMLButtonElement);
      if (next < 0) return;
      const box = root.getBoundingClientRect();
      if (box.top < 0 || box.bottom > window.innerHeight) scrollToCentre(root);
      if (running) {
        clearTimeout(timer);
        runFrom(next);
      } else {
        pending = next;
      }
    };
    list.addEventListener('click', onClick);

    return () => {
      observer.disconnect();
      list.removeEventListener('click', onClick);
      finish();
    };
  }, [scoring]);

  return (
    <>
      <Motion className="motion la-block la-visual" replay={false} threshold={0.2}>
        <figure id={figureId} className="la-figure">
          <div ref={ref} className="la-score">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1440px) 664px, (min-width: 1024px) 46vw, 100vw"
              className="la-photo object-cover"
            />
            <svg
              aria-hidden
              className="la-map"
              viewBox={`0 0 ${MAP.width} ${MAP.height}`}
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <MapDefs id={mapId} width={MAP.width} height={MAP.height} />
              </defs>
              <BasemapUnder shape={BASEMAP} width={MAP.width} height={MAP.height} groundOpacity={0.9} />
              <g className="la-forecast">
                <StormField id={mapId} blobs={FORECAST} />
              </g>
              <BasemapOver id={mapId} shape={BASEMAP} width={MAP.width} height={MAP.height} />
              {TOWNS.map((town) => (
                <Town key={town.name} name={town.name} at={town.at} />
              ))}
              <g>
                {STRIKES.map(({ x, y, hit }, i) => (
                  <g
                    key={i}
                    className={`la-strike ${hit ? 'la-hit' : 'la-miss'}`}
                    transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}
                  >
                    <circle className="la-strike-flash" r="20" fill={`url(#${mapId}-burst)`} />
                    <circle className="la-ring" r="10" />
                    {/* Placed by its group, so the landing animation's transform cannot move it. */}
                    <g transform={BOLT}>
                      <path className="la-bolt" d={BOLT_PATH} />
                    </g>
                    {hit && (
                      // Positioned by the outer group, so the pop's scale cannot move it.
                      <g transform="translate(8 -8)">
                        <g className="la-check">
                          <circle className="la-check-disc" r="4.6" />
                          <path className="la-check-mark" d="M-2 0.2 -0.5 1.7 2.1 -1.2" />
                        </g>
                      </g>
                    )}
                  </g>
                ))}
              </g>
            </svg>
            <span aria-hidden className="la-scrim" />
            <span className="la-tag">{image.tag}</span>
            <span className="la-illustrative">{scoring.illustrative}</span>
            <div className="la-bottom">
              <p className="la-tally">
                {scoring.scored.label}:{' '}
                <span className="la-tally-value" data-tally="scored">
                  {format(scoring.scored.total)}
                </span>
                {' · '}
                {scoring.inside.label}:{' '}
                <span className="la-tally-value la-tally-inside" data-tally="inside">
                  {format(scoring.inside.total)}
                </span>
              </p>
              <p className="la-overlay">{image.overlay}</p>
            </div>
          </div>
          <figcaption className="text-micro leading-caption text-text-subtle">{image.caption}</figcaption>
        </figure>
      </Motion>

      <Motion className="motion la-block la-method" replay={false} threshold={0.2}>
        <SectionLabel tone="muted-light">{method.label}</SectionLabel>
        <ol ref={stepsRef} className="la-steps">
          {method.steps.map((step) => (
            <li key={step.number} className="la-step">
              <button type="button" className="la-step-button" aria-controls={figureId}>
                <span className="la-step-number">{step.number}</span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-body leading-body-s font-semibold text-text">{step.title}</span>
                  <span className="text-body-s leading-5 text-pretty text-text-muted">{step.body}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </Motion>
    </>
  );
}
