'use client';

import { useEffect, useId, useRef, useState } from 'react';

import type { IndustrySection } from '@/content/industries';
import { rankedStreets, swathCells, swathClass, type SwathCell, type SwathTone } from '@/content/roofing-swath';

import { Motion } from '../motion';
import { Illustrative, Section, SectionHeading, isDark, toneBg } from './primitives';

type Figure = Extract<IndustrySection, { type: 'figure' }>;
/** A legend key's filter: one size class, or the cells with no hail. */
type Filter = SwathTone | 'none';

/*
 * The Roofing page's swath report, drawn live instead of the exported PNG so
 * its cells can answer back. Geometry is the Paper "Swath map panel"
 * (784 x 480, 98 px cells), the drawing the PNG was exported from; cell data
 * is content/roofing-swath.ts. Styles: styles/industry-swath.css (swr-*).
 *
 *   reveal    once, on one <Motion> block: cells paint in along the storm's
 *             track, south-west to north-east, each passing up through the
 *             lighter classes to its own, as the storm crossed it
 *   tooltip   hover a cell (tap on touch, arrow keys once the map has focus)
 *             for its street, size class, largest stone and time
 *   filter    the legend keys are toggle buttons: one class stays, the rest dim
 *   rank      "Rank canvassing list" slides the top five streets in beside
 *             the map (under it below 1280 px); hovering one lights its cells
 *
 * The markup is the finished report: without JS or with reduced motion every
 * cell is painted and nothing moves.
 */

const W = 784;
const H = 480;
const CELL = 98;
const GRID = 'M98 0V480M196 0V480M294 0V480M392 0V480M490 0V480M588 0V480M686 0V480M0 98H784M0 196H784M0 294H784M0 392H784';

const cellFill: Record<SwathTone, string> = {
  advisory: 'var(--color-viz-gold)',
  watch: 'var(--color-alert-watch)',
  warning: 'var(--color-alert-warning)',
};

const shown = (cell: SwathCell, filter: Filter | null) => filter === null || filter === cell.tone;

const cellLabel = (cell: SwathCell) => {
  const size = swathClass[cell.tone];
  return `${cell.street} · ${size.threshold} · ${size.name} · max ${cell.max} in at ${cell.time}`;
};

/** The nearest shown cell from `from` in one direction, or `from` itself at the edge. */
function step(from: number, dx: number, dy: number, filter: Filter | null) {
  const a = swathCells[from];
  let best = from;
  let bestScore = Infinity;
  swathCells.forEach((b, i) => {
    const along = (b.col - a.col) * dx + (b.row - a.row) * dy;
    if (i === from || along <= 0 || !shown(b, filter)) return;
    const across = Math.abs((b.col - a.col) * dy) + Math.abs((b.row - a.row) * dx);
    const score = along + across * 2;
    if (score < bestScore) {
      bestScore = score;
      best = i;
    }
  });
  return best;
}

const keys: Record<string, [number, number]> = {
  ArrowRight: [1, 0],
  ArrowLeft: [-1, 0],
  ArrowDown: [0, 1],
  ArrowUp: [0, -1],
};

export function SwathReportSection({ id, section }: { id: string; section: Figure }) {
  const dark = isDark(section.tone);
  const panelId = useId();
  const [filter, setFilter] = useState<Filter | null>(null);
  const [open, setOpen] = useState(false);
  /** The cell whose tooltip shows. */
  const [active, setActive] = useState<number | null>(null);
  /** The ranked street under the pointer: its cells light up. */
  const [hot, setHot] = useState<string | null>(null);
  /** The map's one tab stop (roving tabindex). */
  const [tab, setTab] = useState(0);
  const cells = useRef<(SVGRectElement | null)[]>([]);

  // Tapping anywhere off a cell closes its tooltip.
  useEffect(() => {
    if (active === null) return;
    const close = (event: PointerEvent) => {
      if (!(event.target instanceof Element && event.target.closest('.swr-cell'))) setActive(null);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [active]);

  const pick = (next: Filter) => {
    const value = filter === next ? null : next;
    setFilter(value);
    if (active !== null && !shown(swathCells[active], value)) setActive(null);
  };

  // A filtered-out cell can't hold the tab stop: hand it to the first shown one.
  const tabStop = shown(swathCells[tab], filter) ? tab : swathCells.findIndex((cell) => shown(cell, filter));

  const onKey = (event: React.KeyboardEvent, i: number) => {
    let next = i;
    if (event.key in keys) next = step(i, ...keys[event.key], filter);
    else if (event.key === 'Home') next = swathCells.findIndex((cell) => shown(cell, filter));
    else if (event.key === 'End') next = swathCells.findLastIndex((cell) => shown(cell, filter));
    else if (event.key === 'Escape') return setActive(null);
    else return;
    event.preventDefault();
    setTab(next);
    setActive(next);
    cells.current[next]?.focus();
  };

  const tip = active === null ? null : swathCells[active];
  const lit = swathCells.map((cell, i) => i === active || cell.street === hot);

  return (
    <Section id={id} tone={section.tone}>
      <div className="swr flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-16">
        {/* Below lg this column dissolves so the map can sit between the heading and the legend. */}
        <div className="swr-copy flex flex-col gap-5 max-lg:contents lg:w-[400px] lg:shrink xl:shrink-0">
          <SectionHeading id={id} heading={section.heading} intro={section.intro} dark={dark} />
          <div
            role="group"
            aria-label="Show one size class on the map"
            className="swr-keys flex flex-col pt-1 max-lg:order-2"
            data-filtering={filter === null ? undefined : ''}
          >
            {section.legend.map((item) => {
              const value: Filter = item.tone === 'none' ? 'none' : (item.tone as SwathTone);
              return (
                <button
                  key={item.label}
                  type="button"
                  className="swr-key"
                  aria-pressed={filter === value}
                  onClick={() => pick(value)}
                >
                  <span
                    aria-hidden
                    className={`swr-swatch ${item.tone === 'none' ? 'border border-neutral-600' : toneBg[item.tone]}`}
                  />
                  <span className={`text-body-s leading-5 ${item.tone === 'none' ? 'text-text-on-dark-muted' : 'text-neutral-0'}`}>
                    {item.label}
                  </span>
                  <svg aria-hidden viewBox="0 0 12 12" className="swr-key-clear">
                    <path d="M3 3l6 6M9 3l-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 max-lg:order-3">
            <button
              type="button"
              className="swr-rank-button"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpen((value) => !value)}
            >
              <svg aria-hidden viewBox="0 0 16 16" className="size-4">
                <path d="M2 4h12M2 8h8.5M2 12h5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              Rank canvassing list
            </button>
            {section.caption && <p className="text-caption text-text-on-dark-muted">{section.caption}</p>}
          </div>
          {section.illustrative && <Illustrative dark={dark} className="max-lg:order-3" />}
        </div>

        <figure className="min-w-0 grow basis-0 max-lg:order-1 max-lg:mt-5">
          <div className="swr-view" data-open={open ? '' : undefined}>
            <Motion className="motion swr-map" replay={false} threshold={0.4}>
              <div
                className="swr-stage"
                data-filter={filter ?? undefined}
                data-hot={hot === null ? undefined : ''}
              >
                <svg
                  viewBox={`0 0 ${W} ${H}`}
                  className="swr-svg"
                  role="group"
                  aria-label={`${section.image.alt}. Arrow keys move between cells.`}
                >
                  {swathCells.map((cell, i) => (
                    <rect
                      key={`${cell.col}-${cell.row}`}
                      ref={(el) => {
                        cells.current[i] = el;
                      }}
                      className="swr-cell"
                      x={cell.col * CELL}
                      y={cell.row * CELL}
                      width={CELL}
                      height={CELL}
                      fill={cellFill[cell.tone]}
                      data-tone={cell.tone}
                      data-step={cell.step}
                      data-hot={cell.street === hot ? '' : undefined}
                      role="img"
                      aria-label={cellLabel(cell)}
                      tabIndex={i === tabStop ? 0 : -1}
                      onPointerEnter={() => setActive(i)}
                      onPointerLeave={(event) => event.pointerType === 'mouse' && setActive(null)}
                      onFocus={() => {
                        setTab(i);
                        setActive(i);
                      }}
                      onBlur={() => setActive(null)}
                      onKeyDown={(event) => onKey(event, i)}
                    />
                  ))}
                  <path d={GRID} fill="none" stroke="var(--color-border-on-dark)" />
                  <path d="M0 250H784" fill="none" stroke="var(--color-neutral-700)" strokeWidth={2} />
                  <path d="M420 0V480" fill="none" stroke="var(--color-neutral-700)" strokeWidth={2} />
                  <path d="M0 400L784 60" fill="none" stroke="var(--color-neutral-700)" strokeWidth={1.5} />
                  <path
                    d="M150 430L300 262L420 208L560 150L700 118"
                    fill="none"
                    stroke="var(--color-neutral-0)"
                    strokeWidth={1.5}
                    strokeDasharray="5 5"
                  />
                  <circle cx={330} cy={250} r={12} fill="none" stroke="var(--color-neutral-0)" strokeWidth={1.5} />
                  <circle cx={330} cy={250} r={5} fill="var(--color-neutral-0)" />
                  {swathCells.map(
                    (cell, i) =>
                      lit[i] && (
                        <rect
                          key={`ring-${cell.col}-${cell.row}`}
                          className="swr-ring"
                          x={cell.col * CELL + 1}
                          y={cell.row * CELL + 1}
                          width={CELL - 2}
                          height={CELL - 2}
                        />
                      ),
                  )}
                </svg>

                <span aria-hidden className="swr-chip">
                  HAIL SWATH REPORT · TUE 23 SEP 2026 · 1 KM CELLS
                </span>
                <span aria-hidden className="swr-label swr-label-elm">
                  Elm St
                </span>
                <span aria-hidden className="swr-label swr-label-peachtree">
                  Peachtree Rd
                </span>
                <span aria-hidden className="swr-label swr-label-strong swr-label-site">
                  Job site · 4120 Elm St
                </span>
                <span aria-hidden className="swr-label swr-label-strong swr-label-peak">
                  2.00 in · 16:12
                </span>
                <span aria-hidden className="swr-label swr-label-route">
                  canvass route
                </span>
                <span aria-hidden className="swr-footnote">
                  1 cell = 1 km · size class per cell · timestamps in export
                </span>

                {tip && (
                  <div aria-hidden className="swr-tip" data-col={tip.col} data-row={tip.row}>
                    <p className="swr-tip-title">
                      <strong>{tip.street}</strong> · {swathClass[tip.tone].threshold} · {swathClass[tip.tone].name}
                    </p>
                    <p className="swr-tip-meta">
                      <span aria-hidden className={`swr-tip-dot ${toneBg[tip.tone]}`} />
                      Max {tip.max} in · hail at {tip.time}
                    </p>
                  </div>
                )}
              </div>
            </Motion>

            <div id={panelId} className="swr-panel" inert={!open}>
              <div className="swr-panel-inner">
                <p className="swr-panel-eyebrow">NEXT AM · CANVASSING LIST</p>
                <p className="swr-panel-title">Top 5 streets by max hail size</p>
                <ol className="swr-ranks">
                  {rankedStreets.map((street, i) => (
                    <li
                      key={street.street}
                      className="swr-rank"
                      onPointerEnter={() => setHot(street.street)}
                      onPointerLeave={() => setHot(null)}
                    >
                      <span className="swr-rank-n">{i + 1}</span>
                      <span className="flex min-w-0 grow flex-col">
                        <span className="swr-rank-street">{street.street}</span>
                        <span className="swr-rank-sub">{swathClass[street.tone].action}</span>
                      </span>
                      <span className="swr-badge" data-tone={street.tone}>
                        <span aria-hidden className={`swr-badge-dot ${toneBg[street.tone]}`} />
                        {street.max} in
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </figure>
      </div>
    </Section>
  );
}
