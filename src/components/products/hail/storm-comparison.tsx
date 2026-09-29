'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';

import { onScrollFrame } from '@/lib/scroll';

import type { ChipPart } from './content';
import { HailStone } from './hail-stone';

/**
 * The two live modes; anything else is `still`. The same queries switch the
 * layout in styles/hail-comparison.css, so the two must match.
 */
const PIN = '(width >= 1024px) and (height >= 760px) and (prefers-reduced-motion: no-preference) and (scripting: enabled)';
const STACK = '(width < 1024px) and (prefers-reduced-motion: no-preference) and (scripting: enabled)';

type Mode = 'pin' | 'stack' | 'still';

const subscribe = (notify: () => void) => {
  const queries = [PIN, STACK].map((query) => window.matchMedia(query));
  queries.forEach((query) => query.addEventListener('change', notify));
  return () => queries.forEach((query) => query.removeEventListener('change', notify));
};
const currentMode = (): Mode =>
  window.matchMedia(PIN).matches ? 'pin' : window.matchMedia(STACK).matches ? 'stack' : 'still';

const clamp = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Where the cloud is along the rail (0 at –55 min, 0.25 at –30, 0.5 at
 * IMPACT, 0.75 at +1 h, 1 at +3 h) when each part switches on. The car's
 * drive, the stones and the dents are scrubbed from the same position in
 * hail-comparison.css, so keep the two in step.
 */
const AT = {
  prediction: 0.01,
  predictionPoints: [0.06, 0.19, 0.32],
  // –15 min.
  predictionChip: 0.375,
  tracking: 0.5,
  trackingPoints: [0.75, 0.86, 0.97],
  trackingChip: 0.99,
} as const;

/** The share of the scroll the cloud takes to reach +3 h; the rest holds the final frame. */
const RUN = 0.9;

type Column = { label: string; heading: string; points: readonly string[] };

/**
 * "Hail tracking or hail prediction?" on a shared storm timeline. A hail
 * cloud crosses –55 min → +3 h with the scroll: the prediction column
 * lights up from –55 and ends on its alert chip before the car is under
 * cover; the tracking column wakes at IMPACT and reports from +1 h.
 *
 * Desktop pins the stage while the cloud crosses; below 1024px the columns
 * stack (prediction first) under a sticky mini timeline. Reduced motion
 * and no JavaScript get the final frame: both columns at full strength.
 */
export function StormComparison({
  header,
  ticks,
  impact,
  tracking,
  prediction,
  predictionChip,
  trackingChip,
  predictionScene,
  trackingScene,
}: {
  header: React.ReactNode;
  ticks: readonly string[];
  impact: number;
  tracking: Column;
  prediction: Column;
  predictionChip: readonly ChipPart[];
  trackingChip: readonly ChipPart[];
  predictionScene: string;
  trackingScene: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mode = useSyncExternalStore(subscribe, currentMode, () => 'still' as const);

  useEffect(() => {
    const root = ref.current;
    const stage = root?.querySelector<HTMLElement>('.hc-stage');
    const columns = root?.querySelector<HTMLElement>('.hc-columns');
    if (mode === 'still' || !root || !stage || !columns) return;
    const parts = [...root.querySelectorAll<HTMLElement>('[data-at]')].map((el) => ({
      el,
      at: Number(el.dataset.at),
    }));
    root.toggleAttribute('data-live', true);

    let shown = '';
    const read = () => {
      const vh = window.innerHeight;
      let along: number;
      if (mode === 'pin') {
        // The root is the track: its extra height is the scroll the stage stays pinned for.
        const box = root.getBoundingClientRect();
        along = clamp(-box.top / (box.height - stage.offsetHeight));
      } else {
        // Stacked, the cloud crosses as the columns pass the reading line.
        const box = columns.getBoundingClientRect();
        along = clamp((vh * 0.62 - box.top) / box.height);
      }
      const u = clamp(along / RUN).toFixed(4);
      if (u === shown) return;
      shown = u;
      root.style.setProperty('--hc-u', u);
      const at = Number(u);
      parts.forEach((part) => part.el.toggleAttribute('data-on', at >= part.at));
    };

    // On the shared scroll frame, so it keeps step with smooth scrolling.
    const stop = onScrollFrame(read);
    return () => {
      stop();
      root.style.removeProperty('--hc-u');
      root.removeAttribute('data-live');
      parts.forEach((part) => part.el.removeAttribute('data-on'));
    };
  }, [mode]);

  const last = ticks.length - 1;

  return (
    <div ref={ref} className="hc-track">
      <div className="hc-stage container-page">
        {header}

        <div aria-hidden className="hc-timeline">
          <div className="hc-run">
            <span className="hc-rail">
              <span className="hc-rail-fill" />
            </span>
            <ol className="hc-ticks">
              {ticks.map((tick, i) => (
                <li
                  key={tick}
                  className="hc-tick"
                  data-at={(i / last).toFixed(3)}
                  data-side={i < impact ? 'before' : i === impact ? 'impact' : 'after'}
                >
                  <span className="hc-tick-dot" />
                  <span className="hc-tick-label">{tick}</span>
                </li>
              ))}
            </ol>
            <span className="hc-cloud">
              <StormCloud />
            </span>
          </div>
        </div>

        <div className="hc-columns">
          <div className="hc-col hc-col-tracking" data-at={AT.tracking}>
            <h3 className="text-micro font-semibold tracking-label text-text-muted uppercase">{tracking.label}</h3>
            <p className="text-[22px] leading-body-l font-semibold text-text-muted">{tracking.heading}</p>
            <ul className="hc-points">
              {tracking.points.map((point, i) => (
                <li key={point} className="hc-point" data-at={AT.trackingPoints[i]}>
                  <span aria-hidden className="hc-point-dot bg-neutral-400" />
                  <span className="text-body leading-6 text-text-muted">{point}</span>
                </li>
              ))}
            </ul>
            <figure className="hc-scene">
              <Chip parts={trackingChip} at={AT.trackingChip} tone="tracking" />
              <div role="img" aria-label={trackingScene} className="hc-art hc-art-tracking">
                <TrackingArt />
                {TRACKING_STONES.map((stone, i) => (
                  <HailStone key={i} rings={1} seed={i + 11} className={`hc-stone ${stone}`} />
                ))}
              </div>
            </figure>
          </div>

          <div className="hc-col hc-col-prediction" data-at={AT.prediction}>
            <h3 className="text-micro font-semibold tracking-label text-brand-blue uppercase">{prediction.label}</h3>
            <p className="text-[22px] leading-body-l font-semibold text-text">{prediction.heading}</p>
            <ul className="hc-points">
              {prediction.points.map((point, i) => (
                <li key={point} className="hc-point" data-at={AT.predictionPoints[i]}>
                  <span aria-hidden className="hc-point-dot bg-brand-blue" />
                  <span className="text-body leading-6 text-text">{point}</span>
                </li>
              ))}
            </ul>
            <figure className="hc-scene">
              <Chip parts={predictionChip} at={AT.predictionChip} tone="prediction" />
              <div role="img" aria-label={predictionScene} className="hc-art hc-art-prediction">
                <PredictionArt />
                {PREDICTION_STONES.map((stone, i) => (
                  <HailStone key={i} rings={1} seed={i + 1} className={`hc-stone ${stone}`} />
                ))}
              </div>
            </figure>
          </div>
        </div>
      </div>
    </div>
  );
}

/** The alert each column ends on. The prediction one is what the size-class table below picks up. */
function Chip({ parts, at, tone }: { parts: readonly ChipPart[]; at: number; tone: 'prediction' | 'tracking' }) {
  return (
    <p className="hc-chip" data-at={at} data-tone={tone}>
      <span aria-hidden className="hc-chip-dot" />
      {parts.map((part, i) => (
        <span key={part.text} className="hc-chip-part" data-tone={part.tone}>
          {i > 0 && (
            <span aria-hidden className="hc-chip-sep">
              ·
            </span>
          )}
          {part.text}
        </span>
      ))}
    </p>
  );
}

/*
 * The stones, by landing spot. Each class sets the stone's --x, --y (where
 * its bottom lands, as a share of the art box) and --at (when it starts to
 * fall) in hail-comparison.css. `hc-hit` stones strike something and melt
 * away; the rest stay on the ground.
 */
const PREDICTION_STONES = [
  'hc-p1',
  'hc-p2',
  'hc-p3',
  'hc-p4',
  'hc-p5',
  'hc-p6',
  'hc-p7',
  'hc-hit hc-p8',
  'hc-hit hc-p9',
  'hc-hit hc-p10',
];
const TRACKING_STONES = [
  'hc-t1',
  'hc-t2',
  'hc-t3',
  'hc-t4',
  'hc-t5',
  'hc-t6',
  'hc-hit hc-t7',
  'hc-hit hc-t8',
  'hc-hit hc-t9',
  'hc-hit hc-t10',
];

/** A parked car, side on, 124 × 46, its wheels on y = 46. Dents are the caller's. */
function Car({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <path
        className="hc-car-body"
        d="M4 30Q4 22 12 21L30 19 44 7Q48 4 54 4H84Q90 4 94 8L106 19 116 21Q122 22 122 30V36Q122 38 120 38H6Q4 38 4 36Z"
      />
      <path className="hc-car-glass" d="M37 19 47 9.5Q49 7.5 53 7.5H64V19Z" />
      <path className="hc-car-glass" d="M68 7.5H83Q87 7.5 89.5 10L98 19H68Z" />
      {children}
      <g className="hc-wheel">
        <circle cx="28" cy="38" r="8" />
        <circle className="hc-hub" cx="28" cy="38" r="3" />
        <path className="hc-spoke" d="M28 32.5V35" />
      </g>
      <g className="hc-wheel">
        <circle cx="98" cy="38" r="8" />
        <circle className="hc-hub" cx="98" cy="38" r="3" />
        <path className="hc-spoke" d="M98 32.5V35" />
      </g>
    </>
  );
}

/** Carport on the left, an open bay on the right; the car drives from the bay under cover. */
function PredictionArt() {
  return (
    <svg className="hc-art-svg" viewBox="0 0 480 110" fill="none">
      <path className="hc-ground" d="M0 100H480" />
      <path className="hc-bay" d="M268 100V94M452 100V94" />
      <path className="hc-carport-post" d="M42 36V100M217 30V100" />
      <path className="hc-carport-roof" d="M28 30 232 23V29L28 36Z" />
      <g className="hc-drive">
        <g transform="translate(298 54)">
          <Car />
        </g>
      </g>
    </svg>
  );
}

/** One car in the open; a dent shows on the panel under each stone that hits. */
function TrackingArt() {
  return (
    <svg className="hc-art-svg" viewBox="0 0 480 110" fill="none">
      <path className="hc-ground" d="M0 100H480" />
      <path className="hc-bay" d="M148 100V94M332 100V94" />
      <g transform="translate(178 54)">
        <Car>
          <ellipse className="hc-dent hc-dent-1" cx="56" cy="25" rx="5" ry="2.2" />
          <ellipse className="hc-dent hc-dent-2" cx="78" cy="27" rx="4.4" ry="2" />
          <ellipse className="hc-dent hc-dent-3" cx="108" cy="27" rx="4.6" ry="2.1" />
          <ellipse className="hc-dent hc-dent-4" cx="18" cy="27.5" rx="4.6" ry="2.1" />
        </Car>
      </g>
    </svg>
  );
}

/** The storm on the timeline: a cloud with hail under it. */
function StormCloud() {
  return (
    <svg viewBox="1 4 22 23" fill="none" className="hc-cloud-svg">
      <path className="hc-cloud-body" d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      <circle className="hc-cloud-hail" cx="8.5" cy="22.6" r="1.25" />
      <circle className="hc-cloud-hail" cx="13" cy="25" r="1.25" />
      <circle className="hc-cloud-hail" cx="17.5" cy="22.4" r="1.25" />
    </svg>
  );
}
