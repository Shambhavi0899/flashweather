'use client';

import Image from 'next/image';
import { Fragment, useEffect, useRef } from 'react';

import { Motion } from '@/components/motion';
import { SectionLabel } from '@/components/products/section-header';
import type { ProductPage } from '@/content/product-pages';
import { onScrollFrame } from '@/lib/scroll';

type Tiers = { free: string[]; premium: string[]; price: string };

/** How long the section sits idle, in view, before it shows Premium by itself. */
const IDLE_MS = 3000;

/**
 * "What does the Flash mobile app do?" with a Free / Premium toggle above the
 * phones. The copy is unchanged; its features are marked where they stand.
 * Under Free the Premium-only ones carry a lock and step back to the body
 * colour. Premium opens the locks one by one, lights those features up and
 * highlights the price. The state is two native radios read by CSS
 * (`:has(:checked)` in styles/mobile-app-tiers.css), so it works by keyboard,
 * without JavaScript and with reduced motion.
 *
 * Scrolling in (one Motion block): the text fades up, the phones come into
 * focus, then the toggle appears. Left idle in view for 3s it switches to
 * Premium once, unless the reader has already used the toggle.
 */
export function MobileAppTiers({
  overview,
}: {
  overview: Pick<ProductPage['overview'], 'heading' | 'image'> & { paragraphs: string[]; tiers: Tiers };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { heading, image, paragraphs, tiers } = overview;

  useEffect(() => {
    const root = ref.current;
    const premium = root?.querySelector<HTMLInputElement>('input[value="premium"]');
    const watched = root?.querySelector<HTMLElement>('[data-watch]');
    if (!root || !premium || !watched || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let timer = 0;
    let inView = false;
    let done = false;
    // The idle clock only runs once the toggle is on screen: its scroll-in has
    // finished, or it has none (no Motion run). A paused animation is still waiting.
    const toggle = root.querySelector<HTMLElement>('.mat-toggle');
    const shown = () => !toggle || toggle.getAnimations().every((animation) => animation.playState === 'finished');

    const stop = () => {
      done = true;
      clearTimeout(timer);
    };
    // Any input restarts the idle clock; the scroll loop covers Lenis and native scroll alike.
    const restart = () => {
      clearTimeout(timer);
      if (done || !inView || !shown()) return;
      timer = window.setTimeout(() => {
        if (!premium.checked) premium.checked = true;
        stop();
      }, IDLE_MS);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.intersectionRatio >= 0.6;
        restart();
      },
      { threshold: 0.6 },
    );
    observer.observe(watched);
    const release = onScrollFrame(restart);
    const inputs = ['pointerdown', 'keydown'] as const;
    inputs.forEach((type) => window.addEventListener(type, restart, { passive: true }));
    // A reader who reaches the toggle has chosen; it never switches on its own after that.
    root.addEventListener('change', stop);
    root.addEventListener('focusin', stop);
    toggle?.addEventListener('animationend', restart);

    return () => {
      stop();
      toggle?.removeEventListener('animationend', restart);
      observer.disconnect();
      release();
      inputs.forEach((type) => window.removeEventListener(type, restart));
      root.removeEventListener('change', stop);
      root.removeEventListener('focusin', stop);
    };
  }, []);

  return (
    <section aria-labelledby="product-overview-heading" className="bg-surface">
      <div ref={ref}>
        <Motion replay={false} threshold={0.2} className="motion mat container-page py-20 lg:py-[120px]">
          <div className="mat-head flex flex-col gap-6">
            <SectionLabel tone="muted-light">Product overview</SectionLabel>
            <h2
              id="product-overview-heading"
              className="text-[32px] leading-[38px] font-extrabold tracking-[-0.03em] text-text md:text-[36px] md:leading-[42px] lg:text-[40px] lg:leading-[46px]"
            >
              {heading}
            </h2>
          </div>

          <div className="mat-body flex flex-col gap-5">
            {paragraphs.map((paragraph) => {
              const parts = markTiers(paragraph, tiers);
              return (
                <p
                  key={paragraph.slice(0, 40)}
                  data-watch={parts.some((part) => part.kind === 'premium') || undefined}
                  className="text-body leading-body text-pretty text-text-muted"
                >
                  {parts.map((part, i) => (
                    <Fragment key={i}>{renderPart(part)}</Fragment>
                  ))}
                </p>
              );
            })}
          </div>

          <div className="mat-stage flex min-w-0 flex-col gap-5">
            <fieldset className="mat-toggle">
              <legend className="sr-only">Show the features in</legend>
              <div className="mat-switch">
                <span aria-hidden className="mat-thumb" />
                <label className="mat-option">
                  <input type="radio" name="mat-tier" value="free" defaultChecked className="sr-only" />
                  Free
                </label>
                <label className="mat-option">
                  <input type="radio" name="mat-tier" value="premium" className="sr-only" />
                  Premium
                </label>
              </div>
            </fieldset>

            <figure className="mat-figure flex flex-col gap-[10px]">
              <div className="relative aspect-video w-full overflow-clip rounded-lg border border-border">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1440px) 620px, (min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="text-micro leading-caption text-text-subtle">{image.caption}</figcaption>
            </figure>
          </div>
        </Motion>
      </div>
    </section>
  );
}

/** A run of a paragraph; `order` numbers the Premium features, for the unlock stagger. */
type Part = { kind: 'text' | 'free' | 'premium' | 'price'; text: string; order: number };

/** Splits a paragraph around the tier phrases it contains, in reading order. */
function markTiers(text: string, tiers: Tiers): Part[] {
  const phrases = [
    ...tiers.free.map((phrase) => ({ phrase, kind: 'free' as const, order: 0 })),
    ...tiers.premium.map((phrase, order) => ({ phrase, kind: 'premium' as const, order })),
    { phrase: tiers.price, kind: 'price' as const, order: 0 },
  ]
    .map((mark) => ({ ...mark, at: text.indexOf(mark.phrase) }))
    .filter((mark) => mark.at >= 0)
    .sort((a, b) => a.at - b.at);

  const parts: Part[] = [];
  let cursor = 0;
  for (const mark of phrases) {
    if (mark.at < cursor) continue; // overlaps an earlier phrase
    if (mark.at > cursor) parts.push({ kind: 'text', text: text.slice(cursor, mark.at), order: 0 });
    parts.push({ kind: mark.kind, text: mark.phrase, order: mark.order });
    cursor = mark.at + mark.phrase.length;
  }
  if (cursor < text.length) parts.push({ kind: 'text', text: text.slice(cursor), order: 0 });
  return parts;
}

function renderPart(part: Part) {
  if (part.kind === 'text') return part.text;
  if (part.kind === 'price') return <mark className="mat-price">{part.text}</mark>;
  if (part.kind === 'free') return <span className="mat-feat">{part.text}</span>;

  // The lock stays on the line with the phrase's first word.
  const space = part.text.indexOf(' ');
  const first = space < 0 ? part.text : part.text.slice(0, space);
  const rest = space < 0 ? '' : part.text.slice(space);
  return (
    <span className="mat-feat mat-locked" data-i={part.order}>
      <span className="whitespace-nowrap">
        <LockBadge />
        {first}
      </span>
      {rest}
    </span>
  );
}

/** A small padlock; its shackle lifts and swings open under Premium. */
function LockBadge() {
  return (
    <span aria-hidden className="mat-lock">
      <svg viewBox="0 0 16 16" className="mat-lock-icon">
        <path className="mat-shackle" d="M5.25 7.25V5.5a2.75 2.75 0 0 1 5.5 0v1.75" />
        <rect className="mat-lock-body" x="3.5" y="7.25" width="9" height="6.5" rx="1.5" />
      </svg>
    </span>
  );
}
