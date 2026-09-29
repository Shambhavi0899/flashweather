'use client';

import { useEffect, useRef } from 'react';

import type { TableCell } from '@/content/industries';

/** The column sequence ends at about 2.5s; the blocks are released after it. */
const TABLE_MS = 2800;
const CARD_MS = 1400;

/**
 * A YES / NO comparison table that fills in once as it scrolls into view:
 * questions, then the first answer column top to bottom, then the
 * highlighted (Flash) column, then the closing line. A row where only the
 * highlighted column says YES is marked `data-gold`. Below 768px each row is
 * a card and plays on its own (styles/industry-verdict-table.css).
 *
 * The markup is the finished table. The script holds it on the first frame
 * (`data-anim="idle"`), runs it on sight and then removes the attribute, so
 * without JavaScript or with reduced motion the table is simply there.
 */
export function VerdictTable({
  columns,
  rows,
  highlight,
  summary,
}: {
  columns: string[];
  rows: TableCell[][];
  /** Index of the Flash column. */
  highlight: number;
  summary?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = [...root.querySelectorAll<HTMLElement>('[data-vt-card]')];
    const blocks = [root, ...cards];
    const timers: number[] = [];
    for (const block of blocks) block.dataset.anim = 'idle';

    // CSS picks the driver by width: the table's own state from 768px, each
    // card's below. Both are set, so a resize needs no script.
    const watch = (targets: HTMLElement[], threshold: number, ms: number) => {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const block = entry.target as HTMLElement;
            observer.unobserve(block);
            block.dataset.anim = 'run';
            timers.push(window.setTimeout(() => delete block.dataset.anim, ms));
          }
        },
        { threshold },
      );
      for (const target of targets) observer.observe(target);
      return observer;
    };
    const table = watch([root], 0.35, TABLE_MS);
    const each = watch(cards, 0.5, CARD_MS);

    return () => {
      table.disconnect();
      each.disconnect();
      timers.forEach(clearTimeout);
      for (const block of blocks) delete block.dataset.anim;
    };
  }, []);

  // "Policy compliance uses the sensor. Planning uses Flash." -> two sentences; the last carries the emphasis.
  const sentences = summary?.match(/[^.!?]+[.!?]+/g)?.map((s) => s.trim()) ?? (summary ? [summary] : []);

  return (
    <div ref={ref} className="vt vt-frame mt-10 overflow-hidden rounded-md border border-border bg-neutral-0">
      <table role="table" className="vt-table w-full border-collapse text-left md:min-w-[640px]">
        <thead role="rowgroup" className="bg-surface-raised">
          <tr role="row">
            {columns.map((col, i) => (
              <th
                key={col}
                role="columnheader"
                scope="col"
                className={`px-6 py-[14px] text-micro font-semibold tracking-label ${
                  i === highlight ? 'text-brand-blue' : 'text-text-muted'
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody role="rowgroup">
          {rows.map((row, r) => {
            const gold = row.every((cell, c) => c === 0 || (isVerdict(cell) && cell.yes === (c === highlight)));
            return (
              <tr key={r} role="row" data-vt-card data-gold={gold ? '' : undefined} className="vt-row">
                {row.map((cell, c) =>
                  c === 0 ? (
                    <th key={c} role="rowheader" scope="row" className="vt-head">
                      {text(cell)}
                    </th>
                  ) : (
                    // data-label: the column's name over the answer on a card, from CSS, so the page says it once.
                    <td
                      key={c}
                      role="cell"
                      data-label={columns[c]}
                      data-flash={c === highlight ? '' : undefined}
                      className="vt-cell"
                    >
                      <span className="vt-answer">
                        {isVerdict(cell) && (
                          <span data-yes={cell.yes ? '' : undefined} className="vt-mark">
                            {cell.yes ? 'YES' : 'NO'}
                          </span>
                        )}
                        <span className="vt-text">{text(cell)}</span>
                      </span>
                    </td>
                  ),
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      {sentences.length > 0 && (
        <p data-vt-card className="vt-summary">
          {sentences.map((sentence, i) => (
            <span key={i} className={i === sentences.length - 1 && i > 0 ? 'vt-say vt-say-strong' : 'vt-say'}>
              {sentence}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

type Verdict = Extract<TableCell, { kind: 'verdict' }>;

function isVerdict(cell: TableCell): cell is Verdict {
  return typeof cell !== 'string' && cell.kind === 'verdict';
}

function text(cell: TableCell): string {
  if (typeof cell === 'string') return cell;
  return cell.kind === 'hail' ? cell.title : cell.text;
}
