'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

import { onScrollFrame } from '@/lib/scroll';

/**
 * How the section runs. The grid is three columns from 1024px, which is
 * where the line has a gutter to run down; styles/home.css switches on the
 * same width, so the two must match.
 *   line   desktop, with motion: the line follows the scroll and lights a
 *          row of cards as it reaches it
 *   still  desktop, reduced motion: the whole line, drawn, nothing moving
 *   stack  below 1024px, with motion: no line, each card reveals as it
 *          scrolls in
 *   off    below 1024px with reduced motion, and the server: plain markup
 */
type Mode = 'line' | 'still' | 'stack' | 'off';

const WIDE = '(min-width: 1024px)';
const REDUCED = '(prefers-reduced-motion: reduce)';

const subscribe = (notify: () => void) => {
  const queries = [WIDE, REDUCED].map((query) => window.matchMedia(query));
  queries.forEach((query) => query.addEventListener('change', notify));
  return () => queries.forEach((query) => query.removeEventListener('change', notify));
};
const mode = (): Mode => {
  const reduced = window.matchMedia(REDUCED).matches;
  if (window.matchMedia(WIDE).matches) return reduced ? 'still' : 'line';
  return reduced ? 'off' : 'stack';
};

/** Where on the screen the tip of the line sits, from the top. */
const TIP = 0.8;
/** The corner the line turns with. */
const BEND = 10;

const clamp = (n: number) => Math.min(1, Math.max(0, n));

type Shape = {
  width: number;
  height: number;
  /** The line from the source down the gutter to the last row. */
  trunk: string;
  /** Per row, the runs that leave the trunk for each card's node. */
  rows: string[][];
};

type Track = {
  /** Where the line starts, from the top of the block. */
  top: number;
  /** From the source down to the first row's level. */
  lead: number;
  /** The sideways run from under the source to the gutter. */
  jog: number;
  length: number;
  /** How much line is drawn when it reaches each row. */
  rows: number[];
};

/** An element's box inside `root`, as laid out: transforms do not count. */
function boxIn(root: HTMLElement, element: HTMLElement) {
  let x = 0;
  let y = 0;
  for (let node: HTMLElement | null = element; node && node !== root; node = node.offsetParent as HTMLElement | null) {
    x += node.offsetLeft;
    y += node.offsetTop;
  }
  return { x, y, width: element.offsetWidth, height: element.offsetHeight };
}

/**
 * "One engine feeds every channel": the Flash Agent band and the product
 * grid, joined by a thin gold line. The line leaves the band's last step
 * (`[data-flow-source]`), runs down the grid's last gutter as the page
 * scrolls, and at each row sends a run to the node on every card's top edge;
 * the row's cards reveal as it arrives (`data-on`, styles/home.css).
 *
 * The line is measured from the layout and drawn as SVG behind the cards.
 * It reads on the shared scroll frame (lib/scroll), so it keeps step with
 * smooth scrolling. The markup is the finished section: without JavaScript
 * nothing is hidden and there is no line.
 */
export function PlatformFlow({ className, children }: { className: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const track = useRef<Track | null>(null);
  const [shape, setShape] = useState<Shape | null>(null);
  const [lit, setLit] = useState(0);
  const run = useSyncExternalStore(subscribe, mode, (): Mode => 'off');

  useEffect(() => {
    const root = ref.current;
    if (!root || run === 'off') return;
    const cells = [...root.querySelectorAll<HTMLElement>('[data-flow-cell]')];
    const source = root.querySelector<HTMLElement>('[data-flow-source]');
    if (!cells.length || !source) return;

    let rows: HTMLElement[][] = [];
    const light = (count: number) => {
      rows.slice(0, count).forEach((row) => row.forEach((cell) => cell.toggleAttribute('data-on', true)));
      setLit((before) => Math.max(before, count));
    };

    // The tip of the line stays level with one height on the screen. The
    // sideways run has no height of its own, so it is drawn with the lead.
    const read = () => {
      const line = track.current;
      if (!line) return;
      const past = window.innerHeight * TIP - root.getBoundingClientRect().top - line.top;
      const drawn = past <= line.lead ? (past / line.lead) * (line.lead + line.jog) : past + line.jog;
      root.style.setProperty('--platform-fill', clamp(drawn / line.length).toFixed(4));
      light(line.rows.filter((at) => drawn >= at).length);
    };

    // Rows are the cards that share a top; a card's column staggers it.
    const measure = () => {
      const boxes = cells.map((cell) => boxIn(root, cell));
      const tops = [...new Set(boxes.map((box) => box.y))].sort((a, b) => a - b);
      rows = tops.map((top) => cells.filter((_, i) => boxes[i].y === top));
      cells.forEach((cell, i) => {
        const column = rows[tops.indexOf(boxes[i].y)].indexOf(cell);
        if (cell.dataset.col !== String(column)) cell.dataset.col = String(column);
      });
      if (run === 'stack') return;

      const first = rows[0].map((cell) => boxes[cells.indexOf(cell)]);
      if (first.length < 2) return;
      const [before, last] = first.slice(-2);
      const gutter = Math.round((before.x + before.width + last.x) / 2);
      const gap = Math.round((last.x - before.x - before.width) / 2);

      const from = boxIn(root, source);
      const x = Math.round(from.x + from.width / 2);
      const top = from.y + from.height;
      const level = (row: number) => tops[row] - gap;
      const end = level(tops.length - 1);

      // Down from the source, across to the gutter, down the gutter.
      const side = Math.sign(gutter - x);
      const trunk = side
        ? `M${x} ${top}V${level(0) - BEND}Q${x} ${level(0)} ${x + side * BEND} ${level(0)}` +
          `H${gutter - side * BEND}Q${gutter} ${level(0)} ${gutter} ${level(0) + BEND}V${end}`
        : `M${x} ${top}V${end}`;

      // From the gutter along the row's level, down to each card's node.
      const runs = rows.map((row, r) =>
        row.map((cell) => {
          const box = boxes[cells.indexOf(cell)];
          const node = Math.round(box.x + box.width / 2);
          const turn = Math.sign(node - gutter) * Math.min(BEND, gap);
          return `M${gutter} ${level(r)}H${node - turn}Q${node} ${level(r)} ${node} ${level(r) + Math.abs(turn)}V${box.y}`;
        }),
      );

      const lead = level(0) - top;
      const jog = Math.abs(gutter - x);
      track.current = {
        top,
        lead,
        jog,
        length: lead + jog + end - level(0),
        rows: tops.map((_, r) => lead + jog + level(r) - level(0)),
      };
      setShape({ width: root.offsetWidth, height: root.offsetHeight, trunk, rows: runs });
      if (run === 'still') light(rows.length);
      else read();
    };

    root.dataset.flow = run;
    const resize = new ResizeObserver(measure);
    resize.observe(root);

    // Below the desktop grid there is no line: a card reveals as it scrolls in.
    const entering =
      run === 'stack'
        ? new IntersectionObserver(
            (entries) => {
              for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                entry.target.toggleAttribute('data-on', true);
                entering?.unobserve(entry.target);
              }
            },
            { threshold: 0.2 },
          )
        : null;
    cells.forEach((cell) => entering?.observe(cell));

    const stopReading = run === 'line' ? onScrollFrame(read) : undefined;
    return () => {
      stopReading?.();
      resize.disconnect();
      entering?.disconnect();
      track.current = null;
      delete root.dataset.flow;
      root.style.removeProperty('--platform-fill');
      cells.forEach((cell) => cell.removeAttribute('data-on'));
      setShape(null);
      setLit(0);
    };
  }, [run]);

  return (
    <div ref={ref} className={className}>
      {shape && (
        <svg
          aria-hidden
          className="platform-line"
          width={shape.width}
          height={shape.height}
          viewBox={`0 0 ${shape.width} ${shape.height}`}
          fill="none"
        >
          <defs>
            <linearGradient id="platform-gold" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={shape.width} y2={shape.height}>
              <stop offset="0" className="platform-gold-a" />
              <stop offset="0.4" className="platform-gold-b" />
              <stop offset="0.7" className="platform-gold-c" />
              <stop offset="1" className="platform-gold-d" />
            </linearGradient>
          </defs>
          <path className="platform-trunk" d={shape.trunk} pathLength={1} stroke="url(#platform-gold)" />
          {shape.rows.map((row, r) =>
            row.map((d, i) => (
              <path
                key={`${r}-${i}`}
                className="platform-run"
                data-on={r < lit ? '' : undefined}
                d={d}
                pathLength={1}
                stroke="url(#platform-gold)"
              />
            )),
          )}
        </svg>
      )}
      {children}
    </div>
  );
}
