'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Motion } from '@/components/motion';
import { linkKind } from '@/content/link-kinds';

import { SectionHeading } from './primitives';

const LIST_ID = 'keep-reading-cards';

/** A mouse has to travel this far before a press becomes a drag, not a click. */
const DRAG_START = 6;
/** How far ahead a release is projected from its speed, in ms. */
const THROW_MS = 180;
/** If `scrollend` never comes, the row snaps again after this long. */
const SETTLE_MS = 700;

/**
 * The related links as one row of cards that scrolls sideways and snaps card
 * by card: swipe on touch, drag with a mouse, or use the two arrow buttons
 * beside the heading. Each card is one link: a type tag read from where it
 * points (content/link-kinds.ts) unless the link names its own `kind`, the
 * title and "Read →". `children` sit under the row, on the page gutter.
 * Styles: `kr-*` in styles/industry-keep-reading.css.
 */
export function KeepReading({
  id,
  related,
  children,
}: {
  id: string;
  related: { heading: string; intro?: string; links: { title: string; href: string; kind?: string }[] };
  children?: React.ReactNode;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [ends, setEnds] = useState({ start: true, end: false });

  /** Where the row can rest: each card's own position, up to the end of the row. */
  const stops = useCallback(() => {
    const row = scroller.current;
    if (!row) return [0];
    const items = Array.from(row.querySelectorAll<HTMLElement>('.kr-item'));
    const max = row.scrollWidth - row.clientWidth;
    const first = items[0]?.offsetLeft ?? 0;
    return [...new Set(items.map((item) => Math.max(0, Math.min(max, item.offsetLeft - first))))];
  }, []);

  const scrollTo = useCallback((left: number) => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    scroller.current?.scrollTo({ left, behavior: still ? 'auto' : 'smooth' });
  }, []);

  const step = (direction: -1 | 1) => {
    const row = scroller.current;
    if (!row) return;
    const all = stops();
    const here = nearest(all, row.scrollLeft);
    scrollTo(all[Math.max(0, Math.min(all.length - 1, here + direction))]);
  };

  useEffect(() => {
    const row = scroller.current;
    if (!row) return;

    // The arrows: off at the end they point to.
    let frame = 0;
    const measure = () => {
      frame = 0;
      const max = row.scrollWidth - row.clientWidth;
      const start = row.scrollLeft <= 1;
      const end = row.scrollLeft >= max - 1;
      setEnds((was) => (was.start === start && was.end === end ? was : { start, end }));
    };
    const onScroll = () => {
      frame ||= requestAnimationFrame(measure);
    };
    row.addEventListener('scroll', onScroll, { passive: true });
    // Also reports once as it starts observing, which is the first measure.
    const resize = new ResizeObserver(onScroll);
    resize.observe(row);

    // Mouse drag. Touch and trackpads scroll the row natively.
    let press: { x: number; left: number; pointer: number } | null = null;
    let dragging = false;
    let dragged = false;
    let settle = 0;
    let trail: { x: number; t: number }[] = [];

    const release = () => {
      clearTimeout(settle);
      row.removeEventListener('scrollend', release);
      delete row.dataset.dragging;
    };

    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      release();
      press = { x: event.clientX, left: row.scrollLeft, pointer: event.pointerId };
      trail = [{ x: event.clientX, t: event.timeStamp }];
    };
    const onMove = (event: PointerEvent) => {
      if (!press || event.pointerId !== press.pointer) return;
      const dx = event.clientX - press.x;
      if (!dragging) {
        if (Math.abs(dx) < DRAG_START) return;
        dragging = true;
        row.dataset.dragging = '';
        row.setPointerCapture(event.pointerId);
      }
      row.scrollLeft = press.left - dx;
      trail.push({ x: event.clientX, t: event.timeStamp });
      if (trail.length > 5) trail.shift();
    };
    const onUp = (event: PointerEvent) => {
      if (!press || event.pointerId !== press.pointer) return;
      press = null;
      if (!dragging) return;
      dragging = false;
      dragged = true;
      window.setTimeout(() => (dragged = false));

      // Rest on the card the throw was heading for.
      const from = trail[0];
      const to = trail[trail.length - 1];
      const speed = to.t > from.t ? (to.x - from.x) / (to.t - from.t) : 0;
      const all = stops();
      const target = all[nearest(all, row.scrollLeft - speed * THROW_MS)];
      if (Math.abs(target - row.scrollLeft) < 1) return release();
      row.addEventListener('scrollend', release);
      settle = window.setTimeout(release, SETTLE_MS);
      scrollTo(target);
    };
    // A drag that ends over a card must not follow its link.
    const onClick = (event: MouseEvent) => {
      if (!dragged) return;
      event.preventDefault();
      event.stopPropagation();
    };
    // The browser's own link drag would cancel the pointer.
    const onDragStart = (event: DragEvent) => event.preventDefault();

    row.addEventListener('pointerdown', onDown);
    row.addEventListener('pointermove', onMove);
    row.addEventListener('pointerup', onUp);
    row.addEventListener('pointercancel', onUp);
    row.addEventListener('click', onClick, true);
    row.addEventListener('dragstart', onDragStart);

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      release();
      row.removeEventListener('scroll', onScroll);
      row.removeEventListener('pointerdown', onDown);
      row.removeEventListener('pointermove', onMove);
      row.removeEventListener('pointerup', onUp);
      row.removeEventListener('pointercancel', onUp);
      row.removeEventListener('click', onClick, true);
      row.removeEventListener('dragstart', onDragStart);
    };
  }, [scrollTo, stops]);

  return (
    <section aria-labelledby={id} className="kr bg-surface-sunken py-16 md:py-24 xl:py-28">
      <div className="container-page kr-head">
        <SectionHeading id={id} heading={related.heading} intro={related.intro} introSize="small" />
        <div className="kr-nav">
          <ArrowButton label="Previous links" direction={-1} off={ends.start} onStep={step} />
          <ArrowButton label="Next links" direction={1} off={ends.end} onStep={step} />
        </div>
      </div>
      <Motion className="motion kr-row" replay={false} threshold={0.25}>
        {/* Sideways gestures stay with the row; up and down still scrolls the page. */}
        <div ref={scroller} className="kr-scroller" data-lenis-prevent-horizontal>
          <ul id={LIST_ID} className="kr-list">
            {related.links.map((link) => (
              <li key={link.href} className="kr-item">
                <Link href={link.href} className="kr-card">
                  <span className="kr-tag">{link.kind ?? linkKind(link.href)}</span>
                  <span className="kr-title">{link.title}</span>
                  <span className="kr-read">
                    Read
                    <span aria-hidden className="kr-arrow">
                      →
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Motion>
      {children && <div className="container-page kr-more">{children}</div>}
    </section>
  );
}

function ArrowButton({
  label,
  direction,
  off,
  onStep,
}: {
  label: string;
  direction: -1 | 1;
  off: boolean;
  onStep: (direction: -1 | 1) => void;
}) {
  return (
    <button
      type="button"
      className="kr-btn"
      aria-label={label}
      aria-controls={LIST_ID}
      aria-disabled={off}
      onClick={() => !off && onStep(direction)}
    >
      <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d={direction < 0 ? 'M13 8H3m0 0 4.5-4.5M3 8l4.5 4.5' : 'M3 8h10m0 0L8.5 3.5M13 8l-4.5 4.5'}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

/** The index of the stop closest to `left`. */
function nearest(stops: number[], left: number) {
  return stops.reduce((best, stop, i) => (Math.abs(stop - left) < Math.abs(stops[best] - left) ? i : best), 0);
}
