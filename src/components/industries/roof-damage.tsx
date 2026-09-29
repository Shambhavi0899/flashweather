'use client';

import { useEffect, useId, useRef, useState } from 'react';

import * as roof from './roof-geometry';
import type { DamageLevel } from './roof-geometry';

/** How long the idle cycle rests on each class. */
const CYCLE_MS = 2600;
/** The pause after the section scrolls in before the cycle's first step. */
const FIRST_STEP_MS = 700;

const LEVELS: DamageLevel[] = ['severe', 'damaging', 'destructive'];

/** Stagger slots the CSS knows (`.rdm-i0` … `.rdm-i9`). */
const slot = (i: number) => `rdm-i${Math.min(i, 9)}`;

/**
 * The roofing size-class table, made selectable beside a roof cross-section
 * (classes rdm-*). Picking a row draws that class's damage on the roof, marks
 * fading in and cracks drawing in, numbered to a legend under the drawing, and
 * lights the row's "What Flash sends" cell and its channel chips.
 *
 * Idle and in view, it steps through the three classes once and comes to rest
 * on the default row. Hover or focus pauses the cycle; picking a row ends it.
 * Reduced motion: no cycle and no transitions, the default row selected.
 *
 * The server renders the default row selected and every row's copy and chips,
 * so crawlers and no-JS readers get the whole table. Cells arrive already
 * rendered (the template's hail rings) and are only placed here.
 */
export function RoofDamageTable({
  columns,
  highlight,
  cells,
  names,
  levels,
  damage,
  channels,
  defaultRow,
}: {
  columns: string[];
  /** Index of the brand-blue column (What Flash sends). */
  highlight?: number;
  /** Rendered cells, row by row: size class, what it does, what Flash sends. */
  cells: React.ReactNode[][];
  /** Each row's class as words, "≥1.00 in Damaging". */
  names: string[];
  levels: DamageLevel[];
  damage: string[][];
  channels: string[][];
  defaultRow: number;
}) {
  const [selected, setSelected] = useState(defaultRow);
  /** The legend only announces changes a reader asked for, not the idle cycle. */
  const [announce, setAnnounce] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const stopCycle = useRef<() => void>(() => {});
  const id = useId();
  const figureId = `${id}-roof`;
  const classCount = levels.length;

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Every class once, in table order, then back to rest on the default.
    const steps = [...Array(classCount).keys(), defaultRow];
    let step = 0;
    let timer = 0;
    let inView = false;
    let hovered = false;
    let focused = false;
    let stopped = false;

    const schedule = (delay: number) => {
      clearTimeout(timer);
      if (stopped || !inView || hovered || focused || step >= steps.length) return;
      timer = window.setTimeout(() => {
        setSelected(steps[step]);
        step += 1;
        schedule(CYCLE_MS);
      }, delay);
    };

    stopCycle.current = () => {
      stopped = true;
      clearTimeout(timer);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) schedule(step === 0 ? FIRST_STEP_MS : CYCLE_MS);
        else clearTimeout(timer);
      },
      { threshold: 0.4 },
    );
    observer.observe(root);

    const onEnter = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      hovered = true;
      clearTimeout(timer);
    };
    const onLeave = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      hovered = false;
      schedule(CYCLE_MS);
    };
    const onFocusIn = () => {
      focused = true;
      clearTimeout(timer);
    };
    const onFocusOut = (event: FocusEvent) => {
      if (root.contains(event.relatedTarget as Node | null)) return;
      focused = false;
      schedule(CYCLE_MS);
    };
    root.addEventListener('pointerenter', onEnter);
    root.addEventListener('pointerleave', onLeave);
    root.addEventListener('focusin', onFocusIn);
    root.addEventListener('focusout', onFocusOut);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      root.removeEventListener('pointerenter', onEnter);
      root.removeEventListener('pointerleave', onLeave);
      root.removeEventListener('focusin', onFocusIn);
      root.removeEventListener('focusout', onFocusOut);
    };
  }, [classCount, defaultRow]);

  const choose = (row: number) => {
    stopCycle.current();
    setAnnounce(true);
    setSelected(row);
  };

  /** Up and down move between the rows' buttons and select as they go. */
  const onKeyDown = (event: React.KeyboardEvent, row: number) => {
    const delta = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = (row + delta + cells.length) % cells.length;
    choose(next);
    buttons.current[next]?.focus();
  };

  const level = levels[selected];

  return (
    <div ref={rootRef} className="rdm">
      <figure id={figureId} className="rdm-figure" data-level={level}>
        <div className="rdm-figure-head">
          <p className="rdm-eyebrow">Roof cross-section</p>
          <p className="rdm-state">
            <span aria-hidden className="rdm-state-dot" />
            {names[selected]}
          </p>
        </div>

        <svg aria-hidden viewBox={roof.viewBox} className="rdm-svg">
          {LEVELS.map((l) => (
            <g key={l} className="rdm-hail" data-for={l}>
              {roof.hail[l].map((stone, i) => (
                <g key={i} className={slot(i)}>
                  <path d={stone.streak} className="rdm-streak" />
                  <circle cx={stone.cx} cy={stone.cy} r={stone.r} className="rdm-stone" />
                </g>
              ))}
            </g>
          ))}

          {roof.rafter.map((d, i) => (
            <path key={i} d={d} className="rdm-rafter" />
          ))}
          {roof.deck.map((d, i) => (
            <path key={i} d={d} className="rdm-deck" />
          ))}
          {roof.deckSeams.map((d, i) => (
            <path key={i} d={d} className="rdm-seam" />
          ))}
          {roof.felt.map((d, i) => (
            <path key={i} d={d} className="rdm-felt" />
          ))}
          {roof.shingles.map((d, i) => (
            <path key={i} d={d} className="rdm-shingles" />
          ))}
          <path d={roof.fascia} className="rdm-part" />
          <path d={roof.dripEdge} className="rdm-metal" />
          <path d={roof.gutter} className="rdm-part rdm-metal" />
          <path d={roof.pipe} className="rdm-part" />
          <path d={roof.pipeRim} className="rdm-rim" />
          <path d={roof.bootFlange} className="rdm-flange" />
          <path d={roof.bootCollar} className="rdm-part rdm-metal" />
          <path d={roof.ventFlange} className="rdm-flange" />
          <path d={roof.vent} className="rdm-part rdm-metal" />
          <path d={roof.ventSeam} className="rdm-seam" />
          {roof.curbs.map((d, i) => (
            <path key={i} d={d} className="rdm-part" />
          ))}
          <path d={roof.glass} className="rdm-glass" />
          <path d={roof.glassGlint} className="rdm-glint" />
          {roof.flashing.map((d, i) => (
            <path key={i} d={d} className="rdm-flashing" />
          ))}

          {roof.labels.map((label) => (
            <g key={label.text} className="rdm-label">
              {label.leader && <path d={label.leader} className="rdm-leader" />}
              <text x={label.x} y={label.y} textAnchor={label.anchor}>
                {label.text}
              </text>
            </g>
          ))}

          {LEVELS.map((l) => (
            <g key={l} className="rdm-damage" data-for={l}>
              {roof.damage[l].shapes.map((shape, i) => (
                <path
                  key={i}
                  d={shape.d}
                  pathLength={shape.kind === 'crack' ? 1 : undefined}
                  className={`rdm-${shape.kind} ${slot(i)}`}
                />
              ))}
              {roof.damage[l].pins.map((pin) => (
                <g key={pin.n} className="rdm-pin">
                  <circle cx={pin.x} cy={pin.y} r={10} />
                  <text x={pin.x} y={pin.y}>
                    {pin.n}
                  </text>
                </g>
              ))}
            </g>
          ))}
        </svg>

        <figcaption aria-live={announce ? 'polite' : 'off'} className="rdm-legend">
          <span className="sr-only">What {names[selected]} hail does to the roof: </span>
          {/* Keyed by row, so the list replays its fade-in on every change. */}
          <ol key={selected} className="rdm-legend-list">
            {damage[selected].map((item, i) => (
              <li key={item} className={`rdm-legend-item ${slot(i)}`}>
                <span aria-hidden className="rdm-legend-n">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>
        </figcaption>
      </figure>

      <div className="rdm-frame">
        <table className="rdm-table">
          <thead>
            <tr>
              {columns.map((col, c) => (
                <th key={col} scope="col" className={c === highlight ? 'rdm-col rdm-col-flash' : 'rdm-col'}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cells.map((row, r) => (
              <tr key={r} className="rdm-row" data-level={levels[r]} data-selected={r === selected || undefined}>
                <th scope="row" className="rdm-class">
                  <button
                    ref={(el) => {
                      buttons.current[r] = el;
                    }}
                    type="button"
                    aria-pressed={r === selected}
                    aria-controls={figureId}
                    className="rdm-pick"
                    onClick={() => choose(r)}
                    onKeyDown={(event) => onKeyDown(event, r)}
                  >
                    {row[0]}
                    <span className="sr-only">: show on the roof</span>
                  </button>
                </th>
                <td className="rdm-does" data-label={columns[1]}>
                  {row[1]}
                </td>
                <td className="rdm-sends" data-label={columns[2]}>
                  {row[2]}
                  <ul aria-label="Sent as" className="rdm-chips">
                    {channels[r].map((channel, i) => (
                      <li key={channel} className={`rdm-chip ${slot(i)}`}>
                        {channel}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
