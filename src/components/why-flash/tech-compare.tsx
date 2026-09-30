'use client';

import { type KeyboardEvent, useEffect, useRef, useState } from 'react';

import { LinkifiedText } from '@/components/why-flash/linkified-text';
import { techColumns, techRows } from '@/content/why-flash';

/** The Flash column: spotlit on first view, and the phone's first tab. */
const FLASH = 2;
/** A row's rise plus its bars growing; the attribute is released after. */
const ROW_MS = 1300;

/**
 * "How do they compare on lead time, false alarms and cost?" as a real
 * table whose column headers are toggle buttons. Pressing one spotlights
 * that column and dims the other two; pressing the spotlit one again resets.
 * The Lead time row carries a slim relative bar per column, in its own
 * `aria-hidden` row so the three bars share a lane whatever the text length;
 * each criterion is a `<tbody>` so hover and the scroll-in cover both rows.
 *
 * Below 768px the headers give way to tabs above the table (the same state)
 * and each row shows the chosen column only. Styles: why-flash-compare.css.
 *
 * The markup is the finished table, Flash spotlit. The script holds each row
 * on its first frame (`data-anim="idle"`), plays it once as it scrolls in and
 * removes the attribute, so without JavaScript or with reduced motion the
 * rows and bars are simply there.
 */
export function TechCompare() {
  const [spot, setSpot] = useState<number | null>(FLASH);
  const tab = spot ?? FLASH;
  const ref = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rows = [...root.querySelectorAll<HTMLElement>('.tc-row')];
    const timers: number[] = [];
    for (const row of rows) row.dataset.anim = 'idle';

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const row = entry.target as HTMLElement;
          observer.unobserve(row);
          row.dataset.anim = 'run';
          timers.push(window.setTimeout(() => delete row.dataset.anim, ROW_MS));
        }
      },
      { threshold: 0.3 },
    );
    for (const row of rows) observer.observe(row);

    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
      for (const row of rows) delete row.dataset.anim;
    };
  }, []);

  // Tabs: arrow keys, Home and End move the selection and the focus together.
  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = techColumns.length - 1;
    const next =
      event.key === 'ArrowRight'
        ? (tab + 1) % techColumns.length
        : event.key === 'ArrowLeft'
          ? (tab + last) % techColumns.length
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    setSpot(next);
    tabs.current[next]?.focus();
  };

  const cellState = (c: number) => ({
    'data-spot': spot === c ? '' : undefined,
    'data-dim': spot !== null && spot !== c ? '' : undefined,
    'data-tab': tab === c ? '' : undefined,
  });

  return (
    <div ref={ref} className="tc">
      <div role="tablist" aria-label="Technology" className="tc-tabs">
        {techColumns.map((col, c) => (
          <button
            key={col}
            ref={(el) => {
              tabs.current[c] = el;
            }}
            id={`tc-tab-${c}`}
            type="button"
            role="tab"
            aria-selected={tab === c}
            aria-controls="tc-panel"
            tabIndex={tab === c ? 0 : -1}
            onClick={() => setSpot(c)}
            onKeyDown={onTabKey}
            className="tc-tab"
          >
            {col}
          </button>
        ))}
      </div>

      <div id="tc-panel" role="tabpanel" aria-labelledby={`tc-tab-${tab}`} className="tc-frame">
        <table className="tc-table">
          <caption className="sr-only">
            Detection network, electrostatic sensor and AI prediction (Flash) compared on what each measures, lead
            time, where it works, false-alarm behaviour, cost and install, and what each is best for.
          </caption>
          <thead>
            <tr>
              <th scope="col" className="tc-colhead tc-crit">
                <span className="tc-colname">Criterion</span>
              </th>
              {techColumns.map((col, c) => (
                <th key={col} scope="col" className="tc-colhead" {...cellState(c)}>
                  <button
                    type="button"
                    aria-pressed={spot === c}
                    onClick={() => setSpot(spot === c ? null : c)}
                    className="tc-toggle"
                  >
                    <span aria-hidden className="tc-dot" />
                    <span className="tc-colname">{col}</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          {techRows.map((row) => (
            <tbody key={row.criterion} className="tc-row">
              <tr>
                <th scope="row" className="tc-head">
                  {row.criterion}
                </th>
                {row.cells.map((cell, c) => (
                  <td key={c} className="tc-cell" data-bars={row.bars ? '' : undefined} {...cellState(c)}>
                    <span>
                      <LinkifiedText text={cell} links={row.links} />
                    </span>
                  </td>
                ))}
              </tr>
              {row.bars && (
                <tr aria-hidden className="tc-bars">
                  <td className="tc-crit" />
                  {row.bars.map((bar, c) => (
                    <td key={c} className="tc-cell tc-barcell" {...cellState(c)}>
                      <span className="tc-track">
                        <span className="tc-fill" data-reach={bar.reach} data-flash={c === FLASH ? '' : undefined} />
                      </span>
                      <span className="tc-barlabel" data-flash={c === FLASH ? '' : undefined}>
                        {bar.label}
                      </span>
                    </td>
                  ))}
                </tr>
              )}
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
}
