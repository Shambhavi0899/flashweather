'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import type { CycleIndustry } from '@/content/industries-cycle';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * The Industries hub hero's photo card (styles/industries-cycle.css, `ihc-*`):
 * one vertical at a time, a link to its page. The server HTML is the first
 * industry, finished; that is also what reduced motion and a browser without
 * JavaScript keep.
 *
 * In view and idle, the card moves on every 2.5s. The clock is `.ihc-clock`'s
 * CSS animation, restarted per industry, and its `animationend` moves the
 * card on, so a hover (or keyboard focus) pauses the clock and the photo's
 * zoom together and the cycle resumes where it stopped. Photos are mounted
 * one ahead of the one on show, not all thirteen at once.
 */
export function IndustryCycle({ items, className = '' }: { items: CycleIndustry[]; className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const onRef = useRef(0);
  const [on, setOn] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  /** Photos up to this index are mounted. */
  const [reach, setReach] = useState(0);
  const count = items.length;

  useEffect(() => {
    const card = ref.current;
    if (!card || count < 2) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let inView = false;
    let hovered = false;

    const sync = () => {
      if (reduced.matches || !inView) {
        delete card.dataset.auto;
        return;
      }
      card.dataset.auto = hovered || card.matches(':focus-visible') ? 'paused' : 'run';
      // The next photo loads while this one is on show.
      setReach((r) => Math.max(r, Math.min(onRef.current + 1, count - 1)));
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { threshold: 0.4 },
    );
    observer.observe(card);

    const onAnimationEnd = (event: AnimationEvent) => {
      if (event.animationName !== 'ihc-tick') return;
      const from = onRef.current;
      const to = (from + 1) % count;
      onRef.current = to;
      setPrev(from);
      setOn(to);
      setReach((r) => Math.max(r, Math.min(to + 1, count - 1)));
    };
    const onEnter = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      hovered = true;
      sync();
    };
    const onLeave = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      hovered = false;
      sync();
    };

    card.addEventListener('animationend', onAnimationEnd);
    card.addEventListener('pointerenter', onEnter);
    card.addEventListener('pointerleave', onLeave);
    card.addEventListener('focusin', sync);
    card.addEventListener('focusout', sync);
    reduced.addEventListener('change', sync);

    return () => {
      observer.disconnect();
      card.removeEventListener('animationend', onAnimationEnd);
      card.removeEventListener('pointerenter', onEnter);
      card.removeEventListener('pointerleave', onLeave);
      card.removeEventListener('focusin', sync);
      card.removeEventListener('focusout', sync);
      reduced.removeEventListener('change', sync);
      delete card.dataset.auto;
    };
  }, [count]);

  const state = (i: number) => (i === on ? 'on' : i === prev ? 'prev' : undefined);
  const current = items[on];

  return (
    <Link ref={ref} href={current.href} className={`ihc ${className}`}>
      {items.map((item, i) =>
        i <= reach ? (
          <div key={item.slug} data-state={state(i)} className="ihc-slide">
            <Image
              src={item.image}
              alt=""
              fill
              preload={i === 0}
              sizes="(min-width: 1280px) 440px, (min-width: 1024px) 380px, (min-width: 608px) 560px, 100vw"
              quality={75}
              className="object-cover"
            />
          </div>
        ) : null,
      )}
      <div aria-hidden className="ihc-grade absolute inset-0" />

      <p aria-hidden className="ihc-count">
        {pad(on + 1)} <span className="ihc-count-total">/ {pad(count)}</span>
      </p>

      <div className="ihc-foot">
        <div className="ihc-texts">
          {items.map((item, i) => (
            <span key={item.slug} data-state={state(i)} aria-hidden={i !== on} className="ihc-text">
              <span className="ihc-name">{item.name}</span>
              <span className="ihc-line">{item.line}</span>
            </span>
          ))}
        </div>
        <span aria-hidden className="ihc-arrow">
          →
        </span>
      </div>

      <span key={on} aria-hidden className="ihc-clock" />
    </Link>
  );
}
