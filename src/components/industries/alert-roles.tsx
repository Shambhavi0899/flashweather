'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

import type { Card } from '@/content/industries';

/**
 * The Schools & Athletics role cards, "Who gets the alert, and on which
 * channel" (styles/industry-alert-roles.css, arl-*).
 *
 * Each card carries the alert its role receives as a message bubble labelled
 * with the channel, and the card's chip for that channel is highlighted while
 * the bubble shows. From 768px the bubble sits on the photo and is hidden
 * until the card is hovered, tapped or focused. The first time the cards
 * scroll in, untouched, the bubbles show once, card by card, then hide.
 *
 * Server HTML, no JavaScript and reduced motion get every bubble visible and
 * nothing moving; under 768px the bubbles sit under the photos, always
 * visible (both are CSS, so the script never has to know the width).
 */

/** How long each card's bubble shows in the idle run. */
const SHOW_MS = 1200;

const noMotion = '(prefers-reduced-motion: reduce)';
function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia(noMotion);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

const sameChannel = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

export function AlertRoles({ cards }: { cards: Card[] }) {
  const still = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(noMotion).matches,
    () => true,
  );
  const ref = useRef<HTMLUListElement>(null);
  /** The card the reader is on: hovered, tapped or focused. */
  const [picked, setPicked] = useState(-1);
  /** The card the idle run is showing. */
  const [auto, setAuto] = useState(-1);
  /** Set by the first real interaction: the idle run stops, or never starts. */
  const touched = useRef(false);
  const running = useRef(false);
  /** Where the mouse last was, to tell a real move from a scroll under a resting cursor. */
  const mouse = useRef<{ x: number; y: number } | null>(null);
  /** What the last press was made with, for the click that follows it. */
  const press = useRef('');

  // The idle run: once, the first time the cards are in view and untouched.
  useEffect(() => {
    const root = ref.current;
    if (!root || still) return;
    let timer = 0;
    const step = (i: number) => {
      if (touched.current || i >= cards.length) {
        running.current = false;
        setAuto(-1);
        return;
      }
      setAuto(i);
      timer = window.setTimeout(() => step(i + 1), SHOW_MS);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (touched.current) return;
        running.current = true;
        step(0);
      },
      { threshold: 0.35 },
    );
    observer.observe(root);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
      running.current = false;
    };
  }, [still, cards.length]);

  const pick = (i: number) => {
    touched.current = true;
    setAuto(-1);
    setPicked(i);
  };

  const indexOf = (target: EventTarget) =>
    Number((target as Element).closest<HTMLElement>('[data-role]')?.dataset.role ?? -1);

  const shown = picked >= 0 ? picked : auto;

  return (
    <ul
      ref={ref}
      className="arl"
      data-armed={still ? undefined : ''}
      onPointerMove={(event) => {
        if (still || event.pointerType !== 'mouse') return;
        const was = mouse.current;
        mouse.current = { x: event.clientX, y: event.clientY };
        // During the idle run a scroll under a resting cursor must not stop it.
        const moved = was !== null && (was.x !== event.clientX || was.y !== event.clientY);
        if (running.current && !moved) return;
        const i = indexOf(event.target);
        if (i < 0) {
          // Between two cards: nothing to show, and not a reason to stop the run.
          if (picked >= 0) setPicked(-1);
        } else if (i !== picked) pick(i);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== 'mouse') return;
        mouse.current = null;
        if (touched.current) setPicked(-1);
      }}
      onPointerDown={(event) => {
        press.current = event.pointerType;
      }}
    >
      {cards.map((card, i) => {
        const on = shown === i;
        return (
          <li key={card.imageTitle ?? i} className="arl-item" data-role={i}>
            <article className="arl-card" data-on={on ? '' : undefined}>
              <div className="arl-stage">
                <div className="arl-photo">
                  {card.image && (
                    <Image
                      src={card.image.src}
                      alt={card.image.alt}
                      fill
                      sizes="(min-width: 1440px) 232px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      quality={75}
                      className="object-cover"
                    />
                  )}
                  <div aria-hidden className="industry-photo-grade absolute inset-0" />
                  {card.imageEyebrow && <p className="arl-eyebrow">{card.imageEyebrow}</p>}
                  <h3 className="arl-title">{card.imageTitle}</h3>
                </div>
                {card.alert && (
                  <p className="arl-bubble">
                    <span className="arl-label">
                      {card.imageTitle} · <span className="arl-channel">{card.alert.channel}</span>
                    </span>
                    <span className="arl-text">{card.alert.text}</span>
                  </p>
                )}
              </div>
              <div className="arl-copy">
                <p className="arl-body">{card.body}</p>
                {card.tags && (
                  <ul aria-label="Channels" className="arl-chips">
                    {card.tags.map((tag) => (
                      <li
                        key={tag}
                        className="arl-chip"
                        data-match={card.alert && sameChannel(tag, card.alert.channel) ? '' : undefined}
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {card.alert && (
                <button
                  type="button"
                  className="arl-hit"
                  aria-pressed={on}
                  aria-label={`Alert for ${card.imageTitle}`}
                  onClick={() => {
                    // A mouse is already on the card; a tap or a key turns it on and off.
                    pick(press.current !== 'mouse' && picked === i ? -1 : i);
                    press.current = '';
                  }}
                  onFocus={(event) => {
                    if (event.target.matches(':focus-visible')) pick(i);
                  }}
                  onBlur={() => setPicked((now) => (now === i ? -1 : now))}
                />
              )}
            </article>
          </li>
        );
      })}
    </ul>
  );
}
