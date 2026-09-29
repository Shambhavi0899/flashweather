'use client';

import { useEffect, useId, useRef, useSyncExternalStore } from 'react';

import { BOLT_PATH } from '@/components/bolt-path';
import { onScrollFrame } from '@/lib/scroll';

import { BasemapOver, BasemapUnder, MapDefs, Town } from '../lightning/map-layers';
import {
  HAIL_BANDS,
  HIT_STREETS,
  LOTS,
  LOTS_SCORED,
  NEXT,
  NEXT_BASEMAP,
  NEXT_TRACK_PATH,
  OTHER_STREETS,
  PAST,
  PAST_BASEMAP,
  PAST_SWATH,
  PAST_TOWNS,
  clock,
  nextCell,
  nextShift,
} from './ask-hail-map';

export type AgentExample = {
  persona: string;
  question: string;
  answer: string;
  action: string;
  meta: string[];
};

/*
 * One value drives the section: `v`, the slider, from −1 (last night)
 * through 0 (Now) to +1 (60 minutes ahead). The past card plays over the
 * left half, the forecast card over the right half:
 *
 *   past (u = v + 1)   swath paints to PAINT_END, streets light STREETS_FROM → STREETS_TO, chip at PAST_CHIP
 *   next (u = v)       the cell rides its track 0 → 1, each lot is called at its `score`, chip at LOTS_SCORED
 *
 * The markup is the finished frame (v = +1: both cards complete), which is
 * what the server, no JavaScript and reduced motion show. Live, the script
 * sets the swath's opacities, the cell's shift and `data-on` on each piece;
 * CSS holds back only what is not `data-on`, and only under `[data-live]`.
 */
const PAINT_END = 0.58;
const STREETS_FROM = 0.62;
const STREETS_TO = 0.9;
const PAST_CHIP = 0.95;

/** Last night's clock across the left half: the storm's hour, 21:40 → 22:40. */
const NIGHT_FROM = 21 * 60 + 40;

/** Scroll-in sweep and replays: leg lengths, ms. */
const REWIND_MS = 900;
const PAST_MS = 5600;
const NEXT_MS = 5000;
/** How long the cards stay in and out of focus after the slider stops. */
const FOCUS_HOLD_MS = 1600;

const clamp = (n: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const glide = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

const streetAt = (i: number) => STREETS_FROM + ((STREETS_TO - STREETS_FROM) * i) / (HIT_STREETS.length - 1);
const NAMED = HIT_STREETS.filter((street) => street.name);
const MORE = HIT_STREETS.length - NAMED.length;

/** The slider's reading, shown over the thumb and read out as its value. */
function reading(v: number) {
  if (v < -0.005)
    return {
      short: `Last night · ${clock(NIGHT_FROM + (v + 1) * 60)}`,
      spoken: `Last night, ${clock(NIGHT_FROM + (v + 1) * 60)}`,
    };
  if (v > 0.005) {
    const minutes = Math.round(v * 60);
    return { short: `Now + ${minutes} min`, spoken: `${minutes} minutes from now` };
  }
  return { short: 'Now', spoken: 'Now' };
}

/** Motion is on unless reduced; the server (and no JavaScript) is the still, finished frame. */
const MOTION = '(prefers-reduced-motion: no-preference)';
type Mode = 'server' | 'live' | 'still';
const subscribe = (notify: () => void) => {
  const query = window.matchMedia(MOTION);
  query.addEventListener('change', notify);
  return () => query.removeEventListener('change', notify);
};
const currentMode = (): Mode => (window.matchMedia(MOTION).matches ? 'live' : 'still');

type Leg = { to: number; ms: number; curve: (t: number) => number; ready?: () => boolean };

/**
 * "Ask where the hail will be, and where it was.": a shared time slider over
 * the two Flash Agent cards. Left of Now, last night's swath paints across
 * Alpharetta and the streets that took an inch or more light up one by one
 * as their list fills in; right of Now, the forecast cell moves toward the
 * fleet's lots and each is called, red with its ETA or clear. The card on
 * the side being scrubbed comes into focus while the slider moves.
 *
 * On scroll into view the slider sweeps once, last night → +60; each card
 * has its own Replay. The slider is a native range input under the drawn
 * one, so arrows, Home/End, Page Up/Down and touch all work. On a phone it
 * sticks above the stacked cards, and the sweep waits at Now until the
 * forecast card is on screen.
 */
export function AskHail({ past, next }: { past: AgentExample; next: AgentExample }) {
  const ref = useRef<HTMLDivElement>(null);
  const replay = useRef<(side: 'past' | 'next') => void>(() => {});
  const mode = useSyncExternalStore(subscribe, currentMode, () => 'server' as const);
  const id = useId().replace(/:/g, '');

  useEffect(() => {
    const root = ref.current;
    const input = root?.querySelector<HTMLInputElement>('.ha-range');
    const readout = root?.querySelector<HTMLElement>('.ha-readout');
    const cell = root?.querySelector<SVGGElement>('.ha-cell');
    const cards = root?.querySelector<HTMLElement>('.ha-cards');
    const nextCard = root?.querySelector<HTMLElement>('.ha-card[data-side="next"]');
    if (mode === 'server' || !root || !input || !readout || !cell || !cards || !nextCard) return;

    const blobs = [...root.querySelectorAll<SVGEllipseElement>('.ha-blob')];
    const streets = [...root.querySelectorAll<SVGGElement>('.ha-hit')];
    const rows = [...root.querySelectorAll<HTMLElement>('.ha-row')];
    const lots = [...root.querySelectorAll<Element & { dataset: DOMStringMap }>('[data-lot]')];
    const pastChip = root.querySelector<HTMLElement>('.ha-card[data-side="past"] .ha-action');
    const nextChip = root.querySelector<HTMLElement>('.ha-card[data-side="next"] .ha-action');
    const live = mode === 'live';
    const stacked = window.matchMedia('(width < 1024px)');

    let v = live ? 0 : 1;
    let frame = 0;
    let focusTimer = 0;
    let legs: Leg[] = [];
    let waiting = false;
    let swept = !live;
    let resume = () => {};

    const on = (el: Element | null, yes: boolean) => el?.toggleAttribute('data-on', yes);

    const render = () => {
      const u1 = clamp(v + 1);
      const u2 = clamp(v);
      root.style.setProperty('--ha-t', ((v + 1) / 2).toFixed(4));
      input.value = String(Math.round(v * 100));
      const { short, spoken } = reading(v);
      readout.textContent = short;
      input.setAttribute('aria-valuetext', spoken);

      // Past: the paint runs a little past both ends so the first and last blobs fade in fully.
      const paint = (u1 / PAINT_END) * 1.1 - 0.05;
      blobs.forEach((blob, i) =>
        blob.setAttribute('opacity', (PAST_SWATH[i].strength * clamp((paint - PAST_SWATH[i].at) / 0.08)).toFixed(3)),
      );
      streets.forEach((street, i) => on(street, u1 >= streetAt(i)));
      rows.forEach((row) => on(row, u1 >= streetAt(Number(row.dataset.i))));
      on(pastChip, u1 >= PAST_CHIP);

      // Next: one shift for the whole cell; each lot is called when the 1.00 in band reaches it.
      const [dx, dy] = nextShift(u2);
      cell.setAttribute('transform', `translate(${dx.toFixed(1)} ${dy.toFixed(1)})`);
      lots.forEach((lot) => on(lot, u2 >= Number(lot.dataset.score)));
      on(nextChip, u2 >= LOTS_SCORED);
    };

    /** The side being scrubbed comes into focus, and stays so a moment after the slider stops. */
    const focus = () => {
      clearTimeout(focusTimer);
      root.dataset.focus = v < -0.01 ? 'past' : v > 0.01 ? 'next' : '';
      focusTimer = window.setTimeout(() => delete root.dataset.focus, FOCUS_HOLD_MS);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      legs = [];
      waiting = false;
      root.removeAttribute('data-playing');
    };

    /** Plays legs of the slider one after another; a leg with `ready` waits for it (checked on scroll). */
    const play = (next: Leg[]) => {
      stop();
      legs = next;
      root.toggleAttribute('data-playing', true);
      let from = v;
      let elapsed = 0;
      let last = 0;
      const tick = (now: number) => {
        const leg = legs[0];
        if (!leg) {
          stop();
          focus();
          return;
        }
        if (leg.ready && !leg.ready()) {
          waiting = true;
          frame = 0;
          last = 0;
          return;
        }
        // Frames are capped, so a hidden tab pauses the sweep rather than skipping it.
        elapsed += last ? Math.min(100, now - last) : 0;
        last = now;
        const t = leg.ms ? clamp(elapsed / leg.ms) : 1;
        v = from + (leg.to - from) * leg.curve(t);
        render();
        focus();
        if (t >= 1) {
          legs.shift();
          from = v;
          elapsed = 0;
        }
        frame = requestAnimationFrame(tick);
      };
      resume = () => {
        waiting = false;
        frame = requestAnimationFrame(tick);
      };
      resume();
    };

    /** Off screen, a sweep or replay jumps to where it was going. */
    const finish = () => {
      const end = legs.at(-1)?.to;
      stop();
      if (end !== undefined) v = end;
      render();
      clearTimeout(focusTimer);
      delete root.dataset.focus;
    };

    /** Glides from wherever the slider is, taking time in proportion to the distance. */
    const to = (target: number, ms: number, curve = ease): Leg => ({
      to: target,
      ms: ms * Math.abs(target - v),
      curve,
    });
    const hold = (at: number, ms: number): Leg => ({ to: at, ms, curve: () => 1 });

    const nextInView = () => {
      if (!stacked.matches) return true;
      return nextCard.getBoundingClientRect().top < window.innerHeight * 0.7;
    };

    replay.current = (side) => {
      swept = true;
      if (side === 'past') play([to(-1, REWIND_MS), hold(-1, 200), { to: 0, ms: PAST_MS, curve: glide }]);
      else play([to(0, REWIND_MS), hold(0, 200), { to: 1, ms: NEXT_MS, curve: glide }]);
    };

    const read = () => {
      const box = root.getBoundingClientRect();
      const vh = window.innerHeight;
      const onScreen = box.bottom > 0 && box.top < vh;
      if (frame || waiting) {
        if (!onScreen) finish();
        else if (waiting && legs[0]?.ready?.()) resume();
        return;
      }
      if (!swept && cards.getBoundingClientRect().top < vh * 0.72 && onScreen) {
        swept = true;
        play([
          to(-1, REWIND_MS),
          hold(-1, 250),
          { to: 0, ms: PAST_MS, curve: glide },
          hold(0, 350),
          { to: 1, ms: NEXT_MS, curve: glide, ready: nextInView },
        ]);
      }
    };

    /** A person takes the slider: the sweep stops for good and the value follows them. */
    const take = () => {
      swept = true;
      stop();
    };
    const onInput = () => {
      take();
      v = Number(input.value) / 100;
      render();
      focus();
    };
    input.addEventListener('pointerdown', take);
    input.addEventListener('keydown', take);
    input.addEventListener('input', onInput);

    // Scripted from here on, in both modes; only the live one sweeps, replays and animates.
    root.toggleAttribute('data-live', true);
    render();
    const unsubscribe = onScrollFrame(read);

    return () => {
      unsubscribe();
      stop();
      clearTimeout(focusTimer);
      input.removeEventListener('pointerdown', take);
      input.removeEventListener('keydown', take);
      input.removeEventListener('input', onInput);
      root.removeAttribute('data-live');
      delete root.dataset.focus;
      root.style.removeProperty('--ha-t');
      replay.current = () => {};
    };
  }, [mode]);

  return (
    <div ref={ref} className="ha">
      <div className="ha-time">
        <div className="ha-scrub">
          <span aria-hidden className="ha-rail" />
          <span aria-hidden className="ha-now-tick" />
          <span aria-hidden className="ha-fill" />
          <span aria-hidden className="ha-thumb" />
          <span aria-hidden className="ha-readout">
            {reading(1).short}
          </span>
          <input
            type="range"
            min={-100}
            max={100}
            step={1}
            defaultValue={100}
            disabled={mode === 'server'}
            aria-label="Hail timeline, from last night to the next 60 minutes"
            aria-valuetext={reading(1).spoken}
            className="ha-range"
          />
        </div>
        <p aria-hidden className="ha-ticks">
          <span>Last night</span>
          <span className="ha-tick-now">
            <span className="ha-arrow">←</span> Now <span className="ha-arrow">→</span>
          </span>
          <span>Next 60 min</span>
        </p>
      </div>

      <ul className="ha-cards flex flex-col gap-6 lg:flex-row">
        <Card side="past" example={past} live={mode === 'live'} onReplay={() => replay.current('past')}>
          <PastFigure id={`${id}p`} />
        </Card>
        <Card side="next" example={next} live={mode === 'live'} onReplay={() => replay.current('next')}>
          <NextFigure id={`${id}n`} />
        </Card>
      </ul>
    </div>
  );
}

/** One agent exchange: persona, question, answer, its map, then its chips (the action lands last). */
function Card({
  side,
  example,
  live,
  onReplay,
  children,
}: {
  side: 'past' | 'next';
  example: AgentExample;
  live: boolean;
  onReplay: () => void;
  children: React.ReactNode;
}) {
  return (
    <li
      className="ha-card flex grow basis-0 flex-col gap-4 rounded-[20px] border border-white/10 bg-[#040818B8] p-5 sm:p-7"
      data-side={side}
    >
      <div className="flex items-center gap-[10px]">
        <span className="bg-gold-metallic flex size-7 shrink-0 items-center justify-center rounded-full">
          <svg aria-hidden width="12" height="16" viewBox="0 0 26 34" className="shrink-0">
            <path d={BOLT_PATH} fill="#070D26" />
          </svg>
        </span>
        <p className="grow text-[11px] leading-[14px] font-semibold tracking-label text-[#8F9AB8] uppercase">
          {example.persona}
        </p>
        {live && (
          <button
            type="button"
            onClick={onReplay}
            aria-label={side === 'past' ? 'Replay where the hail was' : 'Replay where the hail will be'}
            className="ha-replay"
          >
            <svg aria-hidden width="10" height="10" viewBox="0 0 12 12" className="shrink-0">
              <path
                d="M2.2 6.6A3.9 3.9 0 1 0 3.4 3.1"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M1.6 1.4v2.9h2.9"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Replay
          </button>
        )}
      </div>
      <h3 className="text-body-l leading-body font-medium text-white">{example.question}</h3>
      <p className="text-[15px] leading-6 text-[#C9D1E3]">{example.answer}</p>
      {children}
      <ul className="mt-auto flex flex-wrap gap-2">
        {example.meta.map((m) => (
          <li
            key={m}
            className="flex min-h-6 items-center rounded-sm border border-white/14 px-[10px] text-micro font-medium text-text-on-dark-muted"
          >
            {m}
          </li>
        ))}
        <li className="ha-action flex min-h-6 items-center gap-[6px] rounded-sm border border-[#128A5E99] bg-[#128A5E29] px-[10px] text-micro font-semibold text-[#7FD1A8]">
          <svg aria-hidden width="10" height="10" viewBox="0 0 10 10" className="shrink-0">
            <path
              d="M1.8 5.2 4 7.3 8.2 2.8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {example.action}
        </li>
      </ul>
    </li>
  );
}

/* The swath's opacity into hail size bands: the same discrete lookup as the Lightning maps' filter, with hail's ramp. */
const STEPS = 100;
const bandAt = (a: number) => [...HAIL_BANDS].reverse().find((band) => a >= band.from);
const channel = (hex: string, i: number) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255;
const table = (pick: (band: (typeof HAIL_BANDS)[number]) => number) =>
  Array.from({ length: STEPS }, (_, i) => {
    const band = bandAt(i / STEPS);
    return band ? pick(band).toFixed(3) : '0';
  }).join(' ');
const HAIL_TABLES = {
  r: table((band) => channel(band.color, 0)),
  g: table((band) => channel(band.color, 1)),
  b: table((band) => channel(band.color, 2)),
  a: table((band) => band.alpha),
};

function HailDefs({ id, width, height }: { id: string; width: number; height: number }) {
  return (
    <defs>
      <MapDefs id={id} width={width} height={height} />
      <filter
        id={`${id}-hail`}
        x={0}
        y={0}
        width={width}
        height={height}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feColorMatrix type="matrix" values="0 0 0 1 0  0 0 0 1 0  0 0 0 1 0  0 0 0 1 0" />
        <feComponentTransfer>
          <feFuncR type="discrete" tableValues={HAIL_TABLES.r} />
          <feFuncG type="discrete" tableValues={HAIL_TABLES.g} />
          <feFuncB type="discrete" tableValues={HAIL_TABLES.b} />
          <feFuncA type="discrete" tableValues={HAIL_TABLES.a} />
        </feComponentTransfer>
        <feGaussianBlur stdDeviation={1.6} />
      </filter>
    </defs>
  );
}

/** The ramp under each map: the size classes the swath is drawn in. */
function Legend({ track }: { track?: boolean }) {
  return (
    <p aria-hidden className="ha-legend">
      <span>Hail size, in</span>
      {HAIL_BANDS.filter((band) => band.legend).map((band) => (
        <span key={band.id} className="ha-legend-item">
          <span className={`ha-swatch ha-swatch-${band.id}`} />
          {band.legend}
          {band.id === 'large' ? '+' : ''}
        </span>
      ))}
      {track && (
        <span className="ha-legend-item">
          <span className="ha-legend-track" />
          Track
        </span>
      )}
    </p>
  );
}

/** Last night: the swath over Alpharetta, the streets it put an inch or more on, and their list. */
function PastFigure({ id }: { id: string }) {
  const { width, height } = PAST;
  return (
    <figure className="ha-figure ha-figure-past">
      <div
        role="img"
        aria-label={`Illustrative map of last night's hail swath across Alpharetta, 1.00 to 1.50 inch hail in its core, with the ${HIT_STREETS.length} streets inside the 1.00 inch band highlighted`}
        className="ha-map ha-map-past"
      >
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid slice" className="ha-map-svg" aria-hidden>
          <HailDefs id={id} width={width} height={height} />
          <BasemapUnder shape={PAST_BASEMAP} width={width} height={height} />
          <g className="ha-local">
            {[...OTHER_STREETS, ...HIT_STREETS].map((street) => (
              <path key={street.d} d={street.d} />
            ))}
          </g>
          <g filter={`url(#${id}-hail)`}>
            {PAST_SWATH.map((blob, i) => (
              <ellipse
                key={i}
                className="ha-blob"
                cx={blob.x.toFixed(1)}
                cy={blob.y.toFixed(1)}
                rx={blob.rx.toFixed(1)}
                ry={blob.ry.toFixed(1)}
                transform={`rotate(${blob.angle.toFixed(2)} ${blob.x.toFixed(1)} ${blob.y.toFixed(1)})`}
                fill={`url(#${id}-profile)`}
                opacity={blob.strength.toFixed(3)}
              />
            ))}
          </g>
          <g className="ha-local-over">
            {[...OTHER_STREETS, ...HIT_STREETS].map((street) => (
              <path key={street.d} d={street.d} />
            ))}
          </g>
          <BasemapOver id={id} shape={PAST_BASEMAP} width={width} height={height} />
          {HIT_STREETS.map((street) => (
            <g key={street.d} className="ha-hit">
              <path className="ha-hit-casing" d={street.d} />
              <path className="ha-hit-line" d={street.d} pathLength={1} />
              {street.bulb && <circle className="ha-hit-bulb" cx={street.bulb[0]} cy={street.bulb[1]} r={2.4} />}
            </g>
          ))}
          {PAST_TOWNS.map((town) => (
            <Town key={town.name} name={town.name} at={town.at} />
          ))}
        </svg>
      </div>
      <div className="ha-list">
        <p className="ha-list-head">Streets over 1.00 in</p>
        <ol className="ha-rows">
          {NAMED.map((street, i) => (
            <li key={street.d} className="ha-row" data-i={i}>
              <span className={`ha-dot ha-size-${street.size.replace('.', '')}`} />
              <span className="ha-row-name">{street.name}</span>
              <span className="ha-row-size">{street.size} in</span>
            </li>
          ))}
          <li className="ha-row ha-row-more" data-i={HIT_STREETS.length - 1}>
            + {MORE} more · {HIT_STREETS.length} streets
          </li>
        </ol>
      </div>
      <figcaption className="ha-caption">
        <Legend />
      </figcaption>
    </figure>
  );
}

/** The next hour: the forecast cell on its track toward the fleet's three lots, each called as the band reaches it. */
function NextFigure({ id }: { id: string }) {
  const { width, height } = NEXT;
  const [dx, dy] = nextShift(1);
  const hits = LOTS.filter((lot) => lot.hit);
  return (
    <figure className="ha-figure ha-figure-next">
      <div
        role="img"
        aria-label={`Illustrative forecast map: a hail cell moving north-east toward three fleet lots. ${hits
          .map((lot) => `${lot.name}, ${lot.badge}`)
          .join('; ')}: inside the 1.00 inch window. ${LOTS.filter((lot) => !lot.hit)
          .map((lot) => lot.name)
          .join(', ')}: clear.`}
        className="ha-map ha-map-next"
      >
        <svg viewBox={`0 0 ${width} ${height}`} className="ha-map-svg" aria-hidden>
          <HailDefs id={id} width={width} height={height} />
          <BasemapUnder shape={NEXT_BASEMAP} width={width} height={height} />
          <path className="ha-track" d={NEXT_TRACK_PATH} />
          {/* The filter sits outside the moving group, so its region stays the map's. */}
          <g filter={`url(#${id}-hail)`}>
            <g className="ha-cell" transform={`translate(${dx.toFixed(1)} ${dy.toFixed(1)})`}>
              {nextCell(0).map((blob, i) => (
                <ellipse
                  key={i}
                  cx={blob.x.toFixed(1)}
                  cy={blob.y.toFixed(1)}
                  rx={blob.rx.toFixed(1)}
                  ry={blob.ry.toFixed(1)}
                  transform={`rotate(${blob.angle.toFixed(2)} ${blob.x.toFixed(1)} ${blob.y.toFixed(1)})`}
                  fill={`url(#${id}-profile)`}
                  opacity={blob.strength.toFixed(3)}
                />
              ))}
            </g>
          </g>
          <BasemapOver id={id} shape={NEXT_BASEMAP} width={width} height={height} />
          {LOTS.map((lot) => (
            <g key={lot.id} className="ha-pin" data-lot={lot.id} data-hit={lot.hit || undefined} data-score={lot.score}>
              <circle className="ha-pin-ping" cx={lot.at[0]} cy={lot.at[1]} r={9} />
              <circle className="ha-pin-ring" cx={lot.at[0]} cy={lot.at[1]} r={9} />
              <circle className="ha-pin-dot" cx={lot.at[0]} cy={lot.at[1]} r={4.5} />
            </g>
          ))}
        </svg>
        {LOTS.map((lot) => (
          <span
            key={lot.id}
            className={`ha-lot ha-lot-${lot.id}`}
            data-lot={lot.id}
            data-hit={lot.hit || undefined}
            data-score={lot.score}
          >
            <span className="ha-lot-name">{lot.name}</span>
            <span className="ha-badge">{lot.badge}</span>
          </span>
        ))}
      </div>
      <figcaption className="ha-caption">
        <Legend track />
      </figcaption>
    </figure>
  );
}
