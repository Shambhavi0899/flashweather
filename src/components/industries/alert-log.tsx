'use client';

import { useEffect, useRef, useState } from 'react';

import { Motion } from '@/components/motion';

/** The filter's fade-out before the rows swap; the fade-in is CSS. */
const SWAP_MS = 140;
/** How long the illustrative export "builds" before its file chip appears. */
const EXPORT_MS = 900;

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * An industry table as an interactive alert log (construction's "Downtime you
 * can defend"), classes ial-*. Chips filter the rows by one column, each row
 * slides a detail line out under itself on hover (or tap), and the export
 * button builds an illustrative PDF chip: no file is made.
 *
 * The server renders every row, so crawlers and no-JS readers get the full
 * log. Cells arrive already rendered (the template's status badges) and are
 * only placed here.
 */
export function AlertLog({
  columns,
  cells,
  filterValues,
  allLabel,
  details,
  exportLabel,
  fileName,
  footer,
}: {
  columns: string[];
  /** Rendered cells, row by row. */
  cells: React.ReactNode[][];
  /** Each row's value in the filter column. */
  filterValues: string[];
  allLabel: string;
  details: string[];
  exportLabel: string;
  fileName: string;
  footer?: string;
}) {
  const sites = [...new Set(filterValues)];
  /** The pressed chip, which moves at once; `shown` follows it after the fade-out. */
  const [site, setSite] = useState<string | null>(null);
  const [shown, setShown] = useState<string | null>(null);
  /** Rows fade out, swap while invisible, then fade back in (a CSS transition). */
  const [fading, setFading] = useState(false);
  const [exporting, setExporting] = useState<'busy' | 'done' | undefined>();
  const swapTimer = useRef(0);
  const swapFrame = useRef(0);
  const exportTimer = useRef(0);

  useEffect(
    () => () => {
      clearTimeout(swapTimer.current);
      cancelAnimationFrame(swapFrame.current);
      clearTimeout(exportTimer.current);
    },
    [],
  );

  const count = site === null ? filterValues.length : filterValues.filter((v) => v === site).length;
  const siteLabel = site ?? allLabel;

  const choose = (next: string | null) => {
    if (next === site) return;
    setSite(next);
    // The file chip named the old filter.
    clearTimeout(exportTimer.current);
    setExporting(undefined);
    clearTimeout(swapTimer.current);
    cancelAnimationFrame(swapFrame.current);
    if (reducedMotion()) {
      setShown(next);
      setFading(false);
      return;
    }
    setFading(true);
    swapTimer.current = window.setTimeout(() => {
      setShown(next);
      // Two frames: rows that were display:none must paint at opacity 0 first,
      // or they would skip the fade-in.
      swapFrame.current = requestAnimationFrame(() => {
        swapFrame.current = requestAnimationFrame(() => setFading(false));
      });
    }, SWAP_MS);
  };

  const exportLog = () => {
    if (exporting === 'busy') return;
    setExporting('busy');
    clearTimeout(exportTimer.current);
    exportTimer.current = window.setTimeout(() => setExporting('done'), EXPORT_MS);
  };

  return (
    <Motion className="motion ial mt-10" replay={false} threshold={0.2}>
      <div className="ial-rise ial-bar">
        <div role="group" aria-label="Filter the log by site" className="ial-chips">
          {[null, ...sites].map((value) => (
            <button
              key={value ?? 'all'}
              type="button"
              aria-pressed={site === value}
              className="ial-chip"
              onClick={() => choose(value)}
            >
              {value ?? allLabel}
            </button>
          ))}
          <p aria-live="polite" className="ial-count">
            {count} {count === 1 ? 'entry' : 'entries'}
          </p>
        </div>
        <div className="ial-export">
          <p role="status" className="ial-file-slot">
            {exporting === 'done' && (
              <span className="ial-file">
                <svg aria-hidden viewBox="0 0 16 16" className="ial-file-icon">
                  <path d="M4 1.5h5.5L13 5v9.5H4z M9.5 1.5V5H13" />
                </svg>
                {fileName} · {siteLabel} · PDF
                <span aria-hidden className="ial-file-tick">
                  ✓
                </span>
                <span className="sr-only">ready. Illustrative, no file is downloaded.</span>
              </span>
            )}
          </p>
          <button type="button" className="ial-button" aria-busy={exporting === 'busy'} onClick={exportLog}>
            {exporting === 'busy' && <span aria-hidden className="ial-spinner" />}
            {exportLabel}
          </button>
        </div>
      </div>

      <div className="ial-rise ial-frame mt-4 overflow-hidden rounded-md border border-border bg-neutral-0">
        <div className="relative overflow-x-auto">
          <table className="ial-table w-full min-w-[1120px] border-collapse text-left" data-fading={fading || undefined}>
            <thead className="bg-surface-raised">
              <tr>
                {columns.map((col) => (
                  <th key={col} scope="col" className="px-6 py-[14px] text-micro font-semibold tracking-label text-text-muted">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            {cells.map((row, r) => (
              // One tbody per entry, so the row and its detail line hover as one.
              // tabIndex -1 lets a tap open the detail line without adding tab stops.
              <tbody
                key={r}
                tabIndex={-1}
                hidden={shown !== null && filterValues[r] !== shown}
                className="ial-entry"
              >
                <tr className="border-t border-border align-top">
                  {row.map((cell, c) =>
                    c === 0 ? (
                      <th key={c} scope="row" className="px-6 pt-[18px] pb-[18px] text-left text-caption font-normal">
                        {cell}
                      </th>
                    ) : (
                      <td
                        key={c}
                        className={`px-6 pt-[18px] pb-[18px] text-body-s leading-5 ${c === 1 ? 'text-text' : 'text-text-muted'}`}
                      >
                        {cell}
                      </td>
                    ),
                  )}
                </tr>
                <tr>
                  <td colSpan={columns.length} className="ial-detail-cell">
                    <div className="ial-detail">
                      <p className="ial-detail-line">{details[r]}</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
        {footer && (
          <p className="border-t border-border bg-surface-sunken px-6 py-[14px] text-caption text-text-muted">
            {/* The footer's "6 of 14 entries" follows the filter. */}
            {footer.replace(/\d+(?= of \d+ entries)/, String(count))}
          </p>
        )}
      </div>
    </Motion>
  );
}
