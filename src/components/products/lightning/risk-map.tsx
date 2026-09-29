'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { BOLT_PATH } from '@/components/bolt-path';

import { hero } from './content';
import { BasemapOver, BasemapUnder, MapDefs, StormField, Town, type BasemapShape } from './map-layers';
import {
  BANDS,
  CELL,
  COLS,
  H,
  ROWS,
  TRACK,
  W,
  cellId,
  clockAt,
  placeLabels,
  probabilityAt,
  siteCall,
  statusLabel,
  stormBlobs,
  strikePoint,
  timeLabel,
  worse,
  type Box,
  type Status,
} from './risk-model';

/** One pass, Now → +60, while it plays on its own. */
const LOOP_MS = 8000;
/** How long it holds on +60 before it starts again from Now. */
const HOLD_MS = 700;
/** After the last touch, key or pointer move, it plays on its own again. */
const IDLE_MS = 5000;
/** It starts once the hero's visual has come in (styles/hero.css, --hero-visual-at + 0.7s, and a beat). */
const START_MS = 1800;
/** The frame the server renders, and the one reduced motion keeps. */
const STILL_AT = 30;
/** How long an alert toast stays up. */
const TOAST_MS = 2200;
/** How quickly the map catches up with the scrubber when a person moves it (time constant). */
const EASE_MS = 90;
/** A lens's radius around its site, map px: a little over two 1 km cells. */
const LENS = 26;

/* ------------------------------------------------------------- Basemap */
/* Drawn in the Weather Command Center's style, in map px: county lines, a
   few roads, a river and a lake. Illustrative, not a real place. */

const BASEMAP: BasemapShape = {
  countyLines: [
    'M0 96H122V150H206V58H330V0',
    'M206 150V246H138V330',
    'M122 150L118 250H0',
    'M330 58L336 176H452V330',
    'M452 176H570',
    'M336 176L330 262H206',
  ],
  roads: [
    'M-10 176C90 164 170 196 262 170S430 120 580 128',
    'M252 -10C246 70 272 150 236 340',
    'M30 340C80 270 58 200 108 130S170 40 150 -10',
    'M340 330C380 260 460 230 580 236',
  ],
  river: 'M-10 292C70 280 120 306 198 294S300 272 350 300S430 330 460 340',
  lake: 'M468 26C492 12 536 20 540 42C544 64 508 74 486 64C466 56 456 38 468 26Z',
};

const LEGEND = BANDS.filter((band) => band.legend);

/* Before the browser has measured them: the labels' sizes and what they
   keep clear of (the site panel, the disclaimer), in map px, as at 572px. */
const FIRST_LAYOUT = {
  sizes: { practice: [132, 26], stadium: [86, 26] } as Record<string, [number, number]>,
  avoid: [
    { x: 283, y: 262, w: 277, h: 58 },
    { x: 14, y: 292, w: 246, h: 24 },
  ] as Box[],
};

type Toast = { id: number; site: string; status: Status };

/**
 * The hero's forecast map, as a small working demo of the product. The
 * scrubber drives everything (risk-model.ts): the storm, drawn as a soft
 * probability field in the app's bands, rides the track and reshapes; the
 * clock runs; each site's call follows its schedule, GO → CAUTION → NO-GO,
 * with a pulse on its pin and an "Alert sent" toast at the top of the map;
 * and the site panel keeps every site's call, countdown and, once the storm
 * has passed, its all-clear. The 1 km grid shows only where it matters: a
 * lens round each site with its own cell outlined in gold, and faintly over
 * the whole map while it is pointed at. Hovering the map reads out the cell
 * under the pointer.
 *
 * Playing: after the hero's intro it runs Now → +60 in 8s, on a loop, while
 * the hero is on screen (HeroMotion's `data-offscreen`) and the tab is
 * visible. Any touch, key or pointer move over it hands it to the person;
 * it plays on again after 5s idle. Pause holds it until Play. When a person
 * moves the scrubber the map eases to the new minute rather than jumping.
 *
 * The scrubber is a native range input laid over the drawn track, so arrow
 * keys, Home/End, Page Up/Down and touch dragging all work as on any slider.
 * With reduced motion nothing plays, flashes or eases: the map rests on +30
 * and the scrubber still moves it.
 *
 * The server renders the +30 frame, so the card is complete, and its text
 * crawlable, without JavaScript.
 */
export function RiskMap() {
  const { map } = hero;
  const ref = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const scrubRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLTableElement>(null);
  const noteRef = useRef<HTMLSpanElement>(null);
  const labelRefs = useRef<Record<string, HTMLSpanElement | null>>({});

  const [t, setT] = useState(STILL_AT);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [motion, setMotion] = useState(false);
  const [hover, setHover] = useState<{ c: number; r: number } | null>(null);
  const [flash, setFlash] = useState<{ x: number; y: number; id: number } | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [layout, setLayout] = useState(FIRST_LAYOUT);
  /** The slider's value: the minute a person has asked for, which the map eases to. */
  const [goal, setGoal] = useState(STILL_AT);

  /** The minute the map is heading for, and the one it shows. */
  const target = useRef(STILL_AT);
  const shown = useRef(STILL_AT);
  const lastInput = useRef(-Infinity);
  const pausedRef = useRef(false);
  const motionRef = useRef(false);
  const toastTimer = useRef(0);
  const toastId = useRef(0);

  const m = Math.min(60, Math.round(t));
  const blobs = stormBlobs(t);
  const sites = map.sites.map((site) => ({
    ...site,
    status: siteCall(site.schedule, m),
    eta: Math.max(0, site.schedule.nogo - m),
    cleared: m >= site.schedule.passed,
  }));
  const slots = placeLabels(
    sites.map((site) => ({ pin: site.pin, size: layout.sizes[site.id] })),
    blobs,
    layout.avoid,
  );

  /** A person touched it: it is theirs until they have been idle for 5s. */
  const touched = useCallback(() => {
    lastInput.current = performance.now();
  }, []);

  /** Shows minute `next`; a site whose call gets worse on the way forward sends its alert. */
  const show = useCallback(
    (next: number) => {
      const from = Math.round(shown.current);
      const to = Math.round(next);
      shown.current = next;
      setT(next);
      if (to <= from) return;
      for (const site of map.sites) {
        const before = siteCall(site.schedule, from);
        const after = siteCall(site.schedule, to);
        if (worse(after, before)) {
          clearTimeout(toastTimer.current);
          setToast({ id: ++toastId.current, site: site.name, status: after });
          toastTimer.current = window.setTimeout(() => setToast(null), TOAST_MS);
        }
      }
    },
    [map.sites],
  );

  // The scrubber's drawn track follows the minute shown (--rm-t, 0 → 1).
  useEffect(() => {
    scrubRef.current?.style.setProperty('--rm-t', (t / 60).toFixed(4));
  }, [t]);

  // Measures the labels, the panel and the note in map px, so the labels
  // can be placed clear of each other and of both.
  useEffect(() => {
    const box = mapRef.current;
    if (!box) return;
    const measure = () => {
      const frame = box.getBoundingClientRect();
      const scale = frame.width / W;
      const inMap = (el: Element | null): Box | null => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        if (r.bottom <= frame.top || r.top >= frame.bottom) return null;
        return {
          x: (r.left - frame.left) / scale,
          y: (r.top - frame.top) / scale,
          w: r.width / scale,
          h: r.height / scale,
        };
      };
      const sizes: Record<string, [number, number]> = {};
      for (const [id, el] of Object.entries(labelRefs.current)) {
        if (el) sizes[id] = [el.offsetWidth / scale, el.offsetHeight / scale];
      }
      setLayout({
        sizes: { ...FIRST_LAYOUT.sizes, ...sizes },
        avoid: [inMap(panelRef.current), inMap(noteRef.current)].filter((b): b is Box => !!b),
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  // Playing on its own, easing after a person's move, and the strike flashes.
  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    motionRef.current = true;
    setMotion(true);
    const heroFx = root.closest('.hero-fx');
    const onScreen = () => !heroFx?.hasAttribute('data-offscreen') && !document.hidden;

    const started = performance.now();
    let frame = 0;
    let last = 0;
    let held = 0;
    let isPlaying = false;

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const dt = last ? Math.min(64, now - last) : 0;
      last = now;
      const play = onScreen() && !pausedRef.current && now - started > START_MS && now - lastInput.current > IDLE_MS;
      if (play !== isPlaying) {
        isPlaying = play;
        setPlaying(play);
        // Handed over: the slider starts from where the map is.
        if (!play) setGoal(Math.round(target.current));
      }
      if (play) {
        if (target.current >= 60) {
          held += dt;
          if (held < HOLD_MS) return;
          held = 0;
          target.current = 0;
        } else {
          target.current = Math.min(60, target.current + (dt * 60) / LOOP_MS);
        }
        show(target.current);
        return;
      }
      const gap = target.current - shown.current;
      if (Math.abs(gap) > 0.005) show(shown.current + gap * (1 - Math.exp(-dt / EASE_MS)));
      else if (gap !== 0) show(target.current);
    };
    frame = requestAnimationFrame(tick);

    // A strike, now and then, only in the red core.
    let flashTimer = 0;
    let flashId = 0;
    const strike = () => {
      flashTimer = window.setTimeout(strike, 700 + Math.random() * 700);
      if (!onScreen()) return;
      const point = strikePoint(stormBlobs(shown.current), Math.random());
      if (point) setFlash({ x: point[0], y: point[1], id: ++flashId });
    };
    flashTimer = window.setTimeout(strike, START_MS);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(flashTimer);
      clearTimeout(toastTimer.current);
    };
  }, [show]);

  const togglePause = () => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
    // Play starts at once, not after the idle wait.
    if (!pausedRef.current) lastInput.current = -Infinity;
  };

  /** The 1 km cell under the pointer, for the read-out. */
  const pointAt = (event: React.PointerEvent) => {
    touched();
    const svg = svgRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const x = ((event.clientX - r.left) / r.width) * W;
    const y = ((event.clientY - r.top) / r.height) * H;
    setHover({
      c: Math.min(COLS - 1, Math.max(0, Math.floor(x / CELL))),
      r: Math.min(ROWS - 1, Math.max(0, Math.floor(y / CELL))),
    });
  };
  const hoverP = hover ? probabilityAt(blobs, hover.c * CELL + CELL / 2, hover.r * CELL + CELL / 2) : 0;
  const tipWidth = 262;
  const tip = hover &&
    hoverP >= BANDS[1].from && {
      x: hover.c * CELL + CELL + 8 + tipWidth > W ? hover.c * CELL - 8 - tipWidth : hover.c * CELL + CELL + 8,
      y: Math.min(H - 32, Math.max(6, hover.r * CELL - 7)),
    };

  const grid = (x0: number, x1: number, y0: number, y1: number) => {
    const lines: string[] = [];
    for (let x = Math.ceil(x0 / CELL) * CELL; x <= x1; x += CELL) lines.push(`M${x} ${y0}V${y1}`);
    for (let y = Math.ceil(y0 / CELL) * CELL; y <= y1; y += CELL) lines.push(`M${x0} ${y}H${x1}`);
    return lines.join('');
  };

  return (
    <figure
      ref={ref}
      onPointerDown={touched}
      onKeyDown={touched}
      className="flex w-full max-w-[572px] flex-col overflow-clip rounded-[20px] border border-white/10 bg-[#040818B8] shadow-[0_30px_80px_#00000073]"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-white/8 px-4 py-[10px] sm:px-5">
        <div className="flex flex-col gap-[3px]">
          <p className="text-[11px] leading-[14px] font-semibold tracking-label text-[#8F9AB8] uppercase">
            {map.title}
          </p>
          <p className="flex items-center gap-[6px] text-[11px] leading-[14px] text-text-on-dark-muted">
            <span aria-hidden className="rm-live size-[6px] shrink-0 rounded-full bg-alert-clear" />
            {map.refreshed}
          </p>
        </div>
        {/* The app's ramp, band by band, named at each end. */}
        <div className="flex items-center gap-[7px]">
          <span aria-hidden className="text-[11px] leading-[14px] text-text-on-dark-muted">
            {LEGEND[0].legend}
          </span>
          <span aria-hidden className="flex h-2 overflow-hidden rounded-full">
            {LEGEND.map((band) => (
              <span key={band.id} className={`rm-swatch rm-swatch-${band.id} w-4`} />
            ))}
          </span>
          <span aria-hidden className="text-[11px] leading-[14px] text-text-on-dark-muted">
            {LEGEND[LEGEND.length - 1].legend}
          </span>
          <ul className="sr-only" aria-label="Legend: strike probability">
            {LEGEND.map((band) => (
              <li key={band.id}>
                {band.legend}: {Math.round(band.from * 100)}% and up
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative w-full" onPointerMove={touched}>
        {/* The map and what sits on it. Labels are placed in % of this box,
            which is exactly the map's 570×330 frame. */}
        <div ref={mapRef} className="rm-map relative w-full overflow-clip">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            className="block h-auto w-full"
            role="img"
            aria-label={map.alt}
            onPointerMove={pointAt}
            onPointerLeave={() => setHover(null)}
          >
            <defs>
              <MapDefs id="rm" width={W} height={H} />
              {sites.map((site) => (
                <clipPath key={site.id} id={`rm-lens-${site.id}`}>
                  <circle cx={site.pin[0]} cy={site.pin[1]} r={LENS} />
                </clipPath>
              ))}
            </defs>

            <BasemapUnder shape={BASEMAP} width={W} height={H} />
            <StormField id="rm" blobs={blobs} />
            <BasemapOver id="rm" shape={BASEMAP} width={W} height={H} />
            <polyline
              points={TRACK.map((p) => p.join(',')).join(' ')}
              fill="none"
              stroke="#3D8BFF"
              strokeWidth={1.6}
              strokeDasharray="6 4"
            />

            {map.towns.map((town) => (
              <Town key={town.name} name={town.name} at={town.at} />
            ))}

            {/* The full 1 km grid, faint, only while the map is pointed at. */}
            <path className="rm-grid" d={grid(0, W, 0, H)} pointerEvents="none" />

            {/* A strike: a burst of light and a bolt, in the red core. */}
            {flash && (
              <g key={flash.id} className="rm-flash" pointerEvents="none">
                <circle cx={flash.x} cy={flash.y} r={26} fill="url(#rm-burst)" />
                <path
                  d={BOLT_PATH}
                  transform={`translate(${flash.x - 7} ${flash.y - 10}) scale(0.55)`}
                  fill="#FFFFFF"
                />
              </g>
            )}

            {/* Each site's lens: its 1 km grid, and its own cell in gold. */}
            {sites.map((site) => {
              const [x, y] = site.pin;
              return (
                <g key={site.id} className={`rm-pin rm-status-${site.status}`} pointerEvents="none">
                  <g clipPath={`url(#rm-lens-${site.id})`}>
                    <rect
                      x={x - LENS}
                      y={y - LENS}
                      width={LENS * 2}
                      height={LENS * 2}
                      fill="#040818"
                      fillOpacity={0.45}
                    />
                    <path
                      d={grid(x - LENS, x + LENS, y - LENS, y + LENS)}
                      stroke="#FFFFFF"
                      strokeOpacity={0.3}
                      strokeWidth={0.8}
                    />
                  </g>
                  <rect
                    x={x - CELL / 2}
                    y={y - CELL / 2}
                    width={CELL}
                    height={CELL}
                    fill="none"
                    stroke="#E6BA2D"
                    strokeWidth={1.6}
                  />
                  <circle cx={x} cy={y} r={LENS} fill="none" stroke="#FFFFFF" strokeOpacity={0.45} strokeWidth={1.2} />
                  {/* Keyed on the call, so it pulses each time the call changes. */}
                  {motion && <circle key={site.status} className="rm-ring" cx={x} cy={y} r={LENS} />}
                  <circle cx={x} cy={y} r={3.6} className="rm-pin-dot" stroke="#FFFFFF" strokeWidth={1.4} />
                </g>
              );
            })}

            {hover && tip && (
              <g pointerEvents="none">
                <rect
                  x={hover.c * CELL}
                  y={hover.r * CELL}
                  width={CELL}
                  height={CELL}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth={1.2}
                />
                <g transform={`translate(${tip.x} ${tip.y})`}>
                  <rect width={tipWidth} height={26} rx={5} fill="#0B1322" stroke="#3A4460" />
                  <text x={10} y={17} className="rm-tip">
                    Cell {cellId(hover.c, hover.r)} · {Math.min(99, Math.round(hoverP * 100))}% strike probability ·{' '}
                    {m === 0 ? 'now' : `+${m} min`}
                  </text>
                </g>
              </g>
            )}
          </svg>

          {sites.map((site, i) => (
            <span
              key={site.id}
              ref={(el) => {
                labelRefs.current[site.id] = el;
              }}
              className={`rm-label rm-at-${site.id} rm-slot-${slots[i]} absolute flex h-[22px] items-center gap-[6px] rounded-sm border border-border-on-dark bg-neutral-900 px-2 text-[10px] leading-3 font-semibold whitespace-nowrap text-text-on-dark sm:h-[26px] sm:px-[10px] sm:text-micro sm:leading-micro`}
            >
              <span aria-hidden className={`rm-dot rm-status-${site.status} size-[7px] shrink-0 rounded-full`} />
              {site.name}
            </span>
          ))}

          {/* One alert at a time, at the top of the map, as a site's call gets worse. */}
          <div aria-live={playing ? 'off' : 'polite'} className="absolute inset-x-0 top-2 flex justify-center sm:top-3">
            {toast && (
              <p
                key={toast.id}
                className={`rm-toast rm-toast-${toast.status} flex h-[26px] items-center gap-[6px] rounded-full px-3 text-[10px] leading-3 font-bold whitespace-nowrap text-text-on-dark sm:text-[11px]`}
              >
                <svg width="8" height="10" viewBox="0 0 26 34" aria-hidden className="shrink-0">
                  <path d={BOLT_PATH} fill="currentColor" />
                </svg>
                {toast.site} · {statusLabel[toast.status]}
                <span className="font-semibold opacity-90">
                  · {map.alert.sent}
                  <span className="hidden sm:inline"> · {map.alert.channels}</span>
                </span>
              </p>
            )}
          </div>

          <span
            ref={noteRef}
            className="absolute bottom-2 left-2 flex h-6 items-center rounded-sm border border-border-on-dark bg-neutral-900/85 px-[10px] text-[10px] leading-[14px] text-text-on-dark-muted uppercase sm:bottom-[14px] sm:left-[14px] sm:text-[11px]"
          >
            {map.disclaimer}
          </span>
        </div>

        {/* Every site's call, countdown and all-clear: the one place they are
            read. Over the map's bottom-right corner from sm, under it on a
            phone. Announced when a person moves the scrubber, not while it
            plays on its own. */}
        <table
          ref={panelRef}
          aria-live={playing ? 'off' : 'polite'}
          className="rm-panel mx-3 mb-3 border-separate border-spacing-0 rounded-md border border-border-on-dark bg-[#0B1322E6] text-left sm:absolute sm:right-[10px] sm:bottom-[10px] sm:m-0"
        >
          <caption className="sr-only">Site calls at {timeLabel(m)}</caption>
          <thead className="sr-only">
            <tr>
              <th scope="col">Site</th>
              <th scope="col">Call</th>
              <th scope="col">First strike</th>
              <th scope="col">All-clear</th>
            </tr>
          </thead>
          <tbody>
            {sites.map((site) => (
              <tr key={site.id} className="text-[10px] leading-3 sm:text-[11px] sm:leading-[14px]">
                <th scope="row" className="py-[5px] pr-2 pl-[10px] font-semibold whitespace-nowrap text-text-on-dark">
                  {site.name}
                </th>
                <td className="py-[5px] pr-2">
                  <span className={`rm-badge rm-badge-${site.status}`}>{statusLabel[site.status]}</span>
                </td>
                <td className="py-[5px] pr-2 font-semibold whitespace-nowrap text-text-on-dark tabular-nums">
                  T–{site.eta}
                </td>
                <td className="rm-clear py-[5px] pr-[10px] whitespace-nowrap text-text-on-dark-muted tabular-nums">
                  All-clear {site.cleared ? clockAt(site.schedule.passed + 30) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <figcaption className="flex flex-col gap-2 border-t border-white/8 px-4 pt-3 pb-[14px] sm:px-5">
        <span className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <span className="text-[11px] leading-[14px] font-semibold tracking-label text-[#8F9AB8] uppercase">
              {map.scrubberLabel}
            </span>
            {motion && (
              <button
                type="button"
                onClick={togglePause}
                aria-pressed={paused}
                className="rm-play -my-1 flex h-6 items-center gap-[5px] rounded-full border border-white/16 px-2 text-[10px] leading-3 font-semibold text-text-on-dark-muted uppercase"
              >
                <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden className="shrink-0">
                  {paused ? (
                    <path d="M1 0.5 7.5 4 1 7.5z" fill="currentColor" />
                  ) : (
                    <path d="M1 0h2.2v8H1zM4.8 0H7v8H4.8z" fill="currentColor" />
                  )}
                </svg>
                {paused ? 'Play' : 'Pause'}
              </button>
            )}
          </span>
          <span className="text-micro font-semibold text-text-on-dark tabular-nums">{timeLabel(m)}</span>
        </span>
        <div ref={scrubRef} className="rm-scrub relative -my-2 h-8 w-full">
          <span aria-hidden className="absolute top-[15px] left-0 h-[2px] w-full bg-neutral-700" />
          <span aria-hidden className="rm-fill absolute top-[15px] left-0 h-[2px] bg-brand-blue-soft" />
          <span
            aria-hidden
            className="rm-thumb absolute top-2 size-4 -translate-x-1/2 rounded-full border-[3px] border-brand-blue-soft bg-white"
          />
          <input
            type="range"
            min={0}
            max={60}
            step={1}
            value={playing ? m : goal}
            aria-label="Forecast time"
            aria-valuetext={timeLabel(playing ? m : goal)}
            onChange={(event) => {
              touched();
              target.current = Number(event.target.value);
              setGoal(target.current);
              // With motion the map eases there (the loop above); without, it goes at once.
              if (!motionRef.current) show(target.current);
            }}
            className="rm-range absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </div>
        <span aria-hidden className="flex items-center justify-between">
          {map.ticks.map((tick, i) => (
            <span
              key={tick}
              className={`text-[11px] leading-[14px] ${Math.round(m / 15) === i ? 'text-text-on-dark' : 'text-text-on-dark-muted'}`}
            >
              {tick}
            </span>
          ))}
        </span>
      </figcaption>
    </figure>
  );
}
