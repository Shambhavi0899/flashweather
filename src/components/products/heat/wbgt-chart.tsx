'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';

import { BOLT_PATH } from '@/components/bolt-path';

import { wbgtBands, wbgtBelowRule, wbgtChartAlt, wbgtOutlook } from './content';

/**
 * The hero's illustrative six-hour WBGT outlook, rebuilt as inline SVG from
 * the design's own geometry so every number in it is text a crawler reads.
 * Chart marks on this dark ground use viz-gold and the alert colours.
 *
 * The markup is the finished chart. Its motion (styles/heat-outlook.css) is
 * on the hero's timings: the band lines draw in (CSS), then this script
 * raises the bars one by one like thermometer liquid, each coloured by the
 * band its top has reached and counting up to its value; the 4 pm peak
 * lands with the caption (CSS). After that the Now reading drifts by 0.1 °F
 * every few seconds, while the hero is on screen. Hovering a bar shows its
 * time, WBGT and the band's practice rule. With reduced motion only the
 * tooltip is live.
 */

const W = 552;
const H = 284;
const BASELINE = 250;
const BAR_WIDTH = 40;
const BAR_START = 24;
const BAR_STEP = 59;
/** The design's scale: the 82 and 87 lines are 67px apart. */
const PX_PER_DEGREE = (170 - 103) / 5;
/** What the baseline reads, which the values count up from. */
const BASE_DEGREES = 82 - (BASELINE - 170) / PX_PER_DEGREE;
/** How often the Now reading moves, and how long it takes to. */
const DRIFT_MIN = 3000;
const DRIFT_MAX = 5000;
const DRIFT_MS = 500;

const bandStroke = { gold: 'stroke-viz-gold', watch: 'stroke-alert-watch', warning: 'stroke-alert-warning' };
const bandFill = { gold: 'fill-viz-gold', watch: 'fill-alert-watch', warning: 'fill-alert-warning' };

type Band = 'sensor' | 'below' | 'gold' | 'watch';
/** The bar colour for a reading: white under 82, gold to 87, orange above. */
const bandOf = (degrees: number): Exclude<Band, 'sensor'> =>
  degrees >= 87 ? 'watch' : degrees >= 82 ? 'gold' : 'below';
/** The GHSA rule for a reading. */
const ruleOf = (degrees: number) => [...wbgtBands].reverse().find((b) => degrees >= b.value)?.rule ?? wbgtBelowRule;

const BARS = wbgtOutlook.map((bar, i) => ({
  ...bar,
  degrees: Number(bar.value),
  x: BAR_START + i * BAR_STEP,
  cx: BAR_START + i * BAR_STEP + BAR_WIDTH / 2,
  band: (bar.tone === 'sensor' ? 'sensor' : bandOf(Number(bar.value))) as Band,
}));
const PEAK = BARS.reduce((top, bar, i) => (bar.degrees > BARS[top].degrees ? i : top), 0);
/** The bars above 87, where the heat shimmers. */
const HOT = BARS.filter((bar) => bar.degrees > 87);

/** A CSS time in ms: the build may write 2200ms as 2.2s. */
const ms = (value: string) => {
  const n = parseFloat(value) || 0;
  return value.trim().endsWith('ms') ? n : n * 1000;
};
const easeOut = (p: number) => 1 - (1 - p) ** 3;
const yOf = (degrees: number) => BASELINE - (degrees - BASE_DEGREES) * PX_PER_DEGREE;

export function WbgtChart() {
  const ref = useRef<HTMLElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const now = useRef(BARS[0].degrees);
  const id = useId();
  /** The bar under the pointer, and its reading when the pointer arrived. */
  const [tip, setTip] = useState<{ i: number; degrees: number } | null>(null);

  // The tooltip sits over its bar's top, in % of the chart, before it paints.
  useLayoutEffect(() => {
    const el = tipRef.current;
    if (!el || !tip) return;
    const bar = BARS[tip.i];
    const top = yOf(tip.degrees);
    el.style.setProperty('--ho-x', `${((bar.cx / W) * 100).toFixed(2)}%`);
    el.style.setProperty('--ho-y', `${((top / H) * 100).toFixed(2)}%`);
  }, [tip]);

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const groups = [...root.querySelectorAll<SVGGElement>('.ho-bar')];
    const fills = groups.map((g) => g.querySelector<SVGRectElement>('.ho-fill')!);
    const values = groups.map((g) => g.querySelector<SVGTextElement>('.ho-value')!);
    const sensor = root.querySelector<HTMLElement>('[data-now]');
    const hero = root.closest('.hero-fx');
    const style = getComputedStyle(root);
    const barsAt = ms(style.getPropertyValue('--ho-bars-at'));
    const gap = ms(style.getPropertyValue('--ho-bar-gap'));
    const barMs = ms(style.getPropertyValue('--ho-bar-ms'));

    /** Puts bar `i` at `degrees`: its top, its value above it, its colour. */
    const place = (i: number, degrees: number, text = degrees.toFixed(1)) => {
      const top = yOf(degrees);
      fills[i].setAttribute('y', top.toFixed(1));
      fills[i].setAttribute('height', Math.max(0, BASELINE - top).toFixed(1));
      values[i].setAttribute('y', (top - 7).toFixed(1));
      values[i].textContent = text;
      groups[i].dataset.band = i === 0 ? 'sensor' : bandOf(degrees);
    };

    // The intro runs on the CSS clock: from when the hero's visual started
    // its own animation, so the bars follow the band lines whatever the
    // script's load time. Once that animation has finished it is gone, so a
    // script that hydrates late counts from the document's start (the first
    // load's timeline origin) and finds the bars already up.
    const visual = root.closest('.hero-visual');
    const lift = visual?.getAnimations().find((a) => a instanceof CSSAnimation);
    const clock = () => Number(document.timeline.currentTime ?? performance.now());
    const start = lift?.startTime != null ? Number(lift.startTime) : 0;

    let frame = 0;
    let driftTimer = 0;
    let driftFrame = 0;

    const drift = () => {
      driftTimer = window.setTimeout(
        () => {
          if (!document.hidden && !hero?.hasAttribute('data-offscreen')) {
            const base = BARS[0].degrees;
            const options = [base - 0.1, base, base + 0.1].filter((v) => Math.abs(v - now.current) > 0.05);
            const to = options[Math.floor(Math.random() * options.length)];
            const from = now.current;
            const began = clock();
            const step = () => {
              const p = Math.min(1, (clock() - began) / DRIFT_MS);
              const degrees = from + (to - from) * easeOut(p);
              place(0, degrees, to.toFixed(1));
              if (p < 1) driftFrame = requestAnimationFrame(step);
            };
            now.current = to;
            if (sensor) sensor.textContent = to.toFixed(1);
            driftFrame = requestAnimationFrame(step);
          }
          drift();
        },
        DRIFT_MIN + Math.random() * (DRIFT_MAX - DRIFT_MIN),
      );
    };

    const tick = () => {
      const t = clock() - start;
      let done = true;
      BARS.forEach((bar, i) => {
        const p = Math.min(1, Math.max(0, (t - barsAt - i * gap) / barMs));
        if (p < 1) done = false;
        // A bar's value shows once it starts to rise.
        groups[i].toggleAttribute('data-idle', p === 0);
        const eased = easeOut(p);
        place(i, BASE_DEGREES + (bar.degrees - BASE_DEGREES) * eased, p < 1 ? undefined : bar.value);
      });
      if (done) {
        root.removeAttribute('data-live');
        root.setAttribute('data-done', '');
        drift();
      } else {
        frame = requestAnimationFrame(tick);
      }
    };

    root.setAttribute('data-live', '');
    tick();

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(driftFrame);
      clearTimeout(driftTimer);
      root.removeAttribute('data-live');
      root.removeAttribute('data-done');
      groups.forEach((g) => g.removeAttribute('data-idle'));
      BARS.forEach((bar, i) => place(i, bar.degrees, bar.value));
      now.current = BARS[0].degrees;
      if (sensor) sensor.textContent = BARS[0].value;
    };
  }, []);

  return (
    <figure
      ref={ref}
      className="ho flex w-full flex-col overflow-hidden rounded-[20px] border border-border-on-dark bg-brand-navy-deep shadow-[0_1px_2px_#0B13220D,0_24px_60px_#0B13222E]"
    >
      <div className="flex flex-col gap-2 border-b border-border-on-dark px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] leading-[14px] font-semibold tracking-label text-[#8F9AB8] uppercase">
          Illustrative example · Not live weather
        </p>
        <p className="text-[11px] leading-[14px] font-medium text-[#7FD1A8]">
          <span aria-hidden className="ho-live inline-block">
            ●
          </span>{' '}
          Field B sensor <span data-now>{BARS[0].value}</span> °F · 12:40
        </p>
      </div>

      <div className="px-3 pt-[18px] sm:px-5">
        <div className="relative">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-labelledby={`${id}-title`}
            className="block h-auto w-full font-sans"
          >
            <title id={`${id}-title`}>{wbgtChartAlt}</title>
            <defs>
              <clipPath id={`${id}-hot`}>
                {HOT.map((bar) => (
                  <rect key={bar.hour} x={bar.x} y={bar.y} width={BAR_WIDTH} height={BASELINE - bar.y} rx="3" />
                ))}
              </clipPath>
              <pattern id={`${id}-waves`} width="40" height="16" patternUnits="userSpaceOnUse">
                <path
                  d="M0 8C10 6 10 6 20 8S30 10 40 8"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeOpacity="0.07"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <g className="ho-line">
              <line x1="20" y1={BASELINE} x2="432" y2={BASELINE} stroke="#1C2340" />
            </g>
            {wbgtBands.map((band) => (
              <g key={band.value} className="ho-line">
                <line
                  x1="20"
                  y1={band.y}
                  x2="432"
                  y2={band.y}
                  className={bandStroke[band.tone]}
                  strokeDasharray={band.solid ? undefined : '4 4'}
                  strokeWidth={band.solid ? 1.5 : 1}
                />
                <text x="440" y={band.y + 4} fontSize="11" fontWeight="600" className={bandFill[band.tone]}>
                  {band.label}
                </text>
              </g>
            ))}
            {BARS.map((bar, i) => (
              <g key={bar.hour} className="ho-bar" data-band={bar.band} data-peak={i === PEAK ? '' : undefined}>
                <rect className="ho-fill" x={bar.x} y={bar.y} width={BAR_WIDTH} height={BASELINE - bar.y} rx="3" />
                <text
                  className="ho-value"
                  x={bar.cx}
                  y={bar.y - 7}
                  fontSize="11"
                  fontWeight="700"
                  textAnchor="middle"
                  fill="#FFFFFF"
                >
                  {bar.value}
                </text>
                <text x={bar.cx} y="272" fontSize="11" textAnchor="middle" fill="#8F9AB8">
                  {bar.hour}
                </text>
              </g>
            ))}
            <g aria-hidden className="ho-shimmer" clipPath={`url(#${id}-hot)`}>
              <rect className="ho-shimmer-waves" x="0" y="60" width={W} height="220" fill={`url(#${id}-waves)`} />
            </g>
            <text x="440" y="272" fontSize="11" fill="#8F9AB8">
              6-hour outlook
            </text>
            {/* Hover targets, over everything: a bar's column, from the top band to the hour. */}
            {BARS.map((bar, i) => (
              <rect
                key={bar.hour}
                aria-hidden
                className="ho-hit"
                x={bar.x - 9}
                y="24"
                width={BAR_WIDTH + 18}
                height={H - 24}
                onPointerEnter={() => setTip({ i, degrees: i === 0 ? now.current : bar.degrees })}
                onPointerLeave={() => setTip((current) => (current?.i === i ? null : current))}
              />
            ))}
          </svg>
          {tip && (
            <div ref={tipRef} aria-hidden className="ho-tip">
              {BARS[tip.i].hour} · {tip.degrees.toFixed(1)} °F ·{' '}
              <span className="ho-tip-rule">{ruleOf(tip.degrees)}</span>
            </div>
          )}
        </div>
      </div>

      <figcaption className="ho-caption flex items-center gap-3 border-t border-border-on-dark px-5 pt-[14px] pb-[18px]">
        <span aria-hidden className="bg-gold-metallic flex size-7 shrink-0 items-center justify-center rounded-full">
          <BoltGlyph />
        </span>
        <span className="text-body-s leading-5 text-[#DCE2F0]">
          Peak 88.1 °F at 4:00 pm, under 87 after 5:20 pm. The policy call stays with your sensor; the plan is made at
          noon.
        </span>
      </figcaption>
    </figure>
  );
}

/** The small navy bolt the design sets inside a metallic disc. */
export function BoltGlyph() {
  return (
    <svg width="12" height="16" viewBox="0 0 26 34" aria-hidden className="shrink-0">
      <path d={BOLT_PATH} fill="#070D26" />
    </svg>
  );
}
