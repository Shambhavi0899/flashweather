'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { Motion } from '@/components/motion';

import { audiences } from './content';

/** How long a mouse has to rest on an audience before it is shown. */
const HOVER_MS = 140;
/** Below this width the audiences are a swipeable row, and the one in view is shown. */
const ROW = '(max-width: 1023.98px)';

/**
 * "Who plans with the WBGT outlook?": the photo is a stage for the four
 * audiences under it. The one shown has a gold bar over its column, its photo
 * on the stage (existing site photos; Utilities has none and keeps the field)
 * and a heat chip drawn from its copy pinned on the photo.
 *
 * Choosing: a mouse resting on a column (140ms), a click on it, or its
 * heading's button. Below 1024px the columns are a swipeable row, and the
 * card that settles in view is shown.
 *
 * Motion (styles/heat-audiences.css), on the shared .motion block, so it
 * waits until the section scrolls in:
 *   reveal  the photo focuses in (blur and scale settle), then the columns
 *           rise left to right
 *   cycle   while the block is in view and idle, the next audience comes up
 *           every 5s: the shown column's clock animation ends and moves it
 *           on. It holds while hovered, while a key has focus in it, and for
 *           good once a finger has swiped the row. With reduced motion there
 *           is no cycle and the swap is instant.
 */
export function AudiencePicker() {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLUListElement>(null);
  const hover = useRef(0);
  /** Set while the row is scrolled by code, so the scroll does not count as a swipe. */
  const steering = useRef(false);

  useEffect(() => () => clearTimeout(hover.current), []);

  // Below 1024px the card that settles in the row's view is the one shown.
  useEffect(() => {
    const list = row.current;
    if (!list) return;
    const cards = [...list.children] as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        if (!window.matchMedia(ROW).matches || steering.current) return;
        const seen = entries.filter((e) => e.isIntersecting && e.intersectionRatio >= 0.75);
        if (seen.length) setActive(cards.indexOf(seen[0].target as HTMLElement));
      },
      { root: list, threshold: 0.75 },
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  /** Shows audience `i`; below 1024px its card is brought into the row's view. */
  const show = (i: number) => {
    const next = (i + audiences.length) % audiences.length;
    setActive(next);
    const list = row.current;
    const card = list?.children[next] as HTMLElement | undefined;
    if (!list || !card || !window.matchMedia(ROW).matches) return;
    steering.current = true;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    list.scrollTo({ left: card.offsetLeft - (list.clientWidth - card.offsetWidth) / 2, behavior: still ? 'auto' : 'smooth' });
    window.setTimeout(() => (steering.current = false), 700);
  };

  return (
    <Motion replay={false} threshold={0.25} className="motion hau">
      <div ref={root} className="hau-stage">
        {audiences.map((item, i) => (
          <div key={item.title} aria-hidden={i !== active} data-on={i === active ? '' : undefined} className="hau-shot">
            <Image
              src={item.image.src}
              alt={i === active ? item.image.alt : ''}
              fill
              sizes="(min-width: 1440px) 1248px, 100vw"
              className="object-cover"
            />
            <p className="hau-chip">
              <span aria-hidden className="hau-chip-dot" />
              <span className="sr-only">{item.title}: </span>
              {item.chip}
            </p>
          </div>
        ))}
      </div>

      <ul
        ref={row}
        aria-label="Who plans with the WBGT outlook"
        className="hau-list"
        onTouchStart={() => root.current?.parentElement?.setAttribute('data-hold', '')}
      >
        {audiences.map((item, i) => (
          <li
            key={item.title}
            data-on={i === active ? '' : undefined}
            className="hau-col"
            onPointerEnter={(event) => {
              if (event.pointerType !== 'mouse') return;
              clearTimeout(hover.current);
              hover.current = window.setTimeout(() => setActive(i), HOVER_MS);
            }}
            onPointerLeave={() => clearTimeout(hover.current)}
            onClick={(event) => {
              if (!(event.target as HTMLElement).closest('a')) show(i);
            }}
          >
            <span aria-hidden className="hau-bar bg-gold-metallic" />
            <h3 className="text-h4 leading-h4 font-semibold text-text">
              <button type="button" aria-pressed={i === active} className="hau-pick">
                {item.title}
              </button>
            </h3>
            <p className="text-[15px] leading-6 text-pretty text-text-muted">{item.body}</p>
            <Link href={item.link.href} className="mt-auto text-body-s leading-5 font-medium text-brand-blue hover:underline">
              {item.link.label} <span aria-hidden>→</span>
            </Link>
            <span
              aria-hidden
              className="hau-clock"
              onAnimationEnd={(event) => {
                if (event.animationName === 'hau-clock') show(i + 1);
              }}
            />
          </li>
        ))}
      </ul>
    </Motion>
  );
}
