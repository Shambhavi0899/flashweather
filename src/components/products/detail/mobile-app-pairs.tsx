'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { Motion } from '@/components/motion';
import type { Product } from '@/content/products';

/**
 * "Products that pair with Flash Mobile App": the three product cards, each
 * with an "On your phone" strip saying what that product sends to the phone.
 *
 * From 768px the strip slides up out of the photo's bottom edge on hover,
 * focus or tap. While nobody has touched the section, each card's strip shows
 * once, one after another, as it comes into view; anything the reader does
 * first ends it. Below 768px, and with reduced motion, every strip is simply
 * shown. The motion is CSS (styles/mobile-app-pairs.css, mpp-*).
 */

/** What reaches the phone from each pairing product, by product id. */
const ON_PHONE: Record<string, string> = {
  'weather-command-center': 'Same sites and alerts, synced',
  'flash-lightning-suite': 'Predictive lightning push alerts',
  'flash-weather-shield': 'Siren status and All Clear on your phone',
};

/** When the first strip shows after the cards scroll in, how long each stays, and the gap. */
const AUTO_START_MS = 1100;
const AUTO_SHOW_MS = 1800;
const AUTO_GAP_MS = 250;

/** The strips hide and play only here; elsewhere they are always shown. */
const PLAYS = '(min-width: 768px) and (prefers-reduced-motion: no-preference)';

export function MobileAppPairs({ products }: { products: (Product & { href: string })[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const root = useRef<HTMLUListElement>(null);
  const touched = useRef(false);

  const take = () => {
    touched.current = true;
  };

  // Idle and in view: show each strip once, in turn. Leaving the view pauses
  // the run; coming back resumes it from the same card.
  useEffect(() => {
    const list = root.current;
    if (!list || !window.matchMedia(PLAYS).matches) return;
    const ids = products.map((product) => product.id);
    let timer = 0;
    let step = 0;
    // Once the reader has hovered or tapped, the strips are theirs: the run
    // stops without closing whatever they opened.
    const next = (delay: number) => {
      timer = window.setTimeout(() => {
        if (touched.current || step >= ids.length) return;
        setOpen(ids[step]);
        timer = window.setTimeout(() => {
          if (touched.current) return;
          setOpen(null);
          step++;
          next(AUTO_GAP_MS);
        }, AUTO_SHOW_MS);
      }, delay);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        clearTimeout(timer);
        if (touched.current) return;
        if (!entry.isIntersecting) return setOpen(null);
        next(step ? AUTO_GAP_MS : AUTO_START_MS);
      },
      { threshold: 0.35 },
    );
    observer.observe(list);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [products]);

  return (
    <ul ref={root} className="mpp">
      {products.map((product) => {
        const line = ON_PHONE[product.id];
        const isOpen = open === product.id;
        return (
          <Motion as="li" key={product.id} replay={false} threshold={0.2} className="motion mpp-item flex">
            <article
              className="pc mpp-card"
              data-open={isOpen ? '' : undefined}
              onPointerEnter={(event) => {
                if (event.pointerType !== 'mouse') return;
                take();
                setOpen(null);
              }}
              onClick={(event) => {
                // The link handles its own clicks; a mouse already shows the strip on hover.
                if ((event.target as Element).closest('a')) return;
                const pointer = (event.nativeEvent as PointerEvent).pointerType;
                if (pointer === 'mouse') return;
                take();
                setOpen(isOpen ? null : product.id);
              }}
            >
              <div className="mpp-media">
                <div className="pc-photo absolute inset-0">
                  <Image
                    src={product.image.src}
                    alt={product.image.alt}
                    fill
                    sizes="(min-width: 1440px) 400px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex grow flex-col gap-2.5 px-6 pt-[22px] pb-[26px]">
                <p className="text-[11px] leading-[14px] font-bold tracking-[0.13em] text-[#8F9AB8] uppercase">
                  {product.category}
                </p>
                <h3 className="text-h4 leading-body font-extrabold text-text-on-dark">{product.name}</h3>
                <p className="text-body-s leading-[21px] text-text-on-dark-muted">{product.summary}</p>
                <Link
                  href={product.href}
                  className="pc-link mt-auto inline-flex min-h-11 items-center pt-1 text-caption font-bold text-viz-gold hover:underline"
                >
                  {product.name} <span aria-hidden>&nbsp;→</span>
                </Link>
              </div>
              {line && (
                <p className="mpp-strip">
                  <span className="mpp-strip-in">
                    <span aria-hidden className="mpp-phone">
                      <svg viewBox="0 0 14 20" fill="none">
                        <rect x="0.75" y="0.75" width="12.5" height="18.5" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M5 16.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <span className="mpp-pulse" />
                    </span>
                    <span className="mpp-copy">
                      <span className="mpp-label">On your phone</span>
                      <span className="mpp-line">{line}</span>
                    </span>
                  </span>
                </p>
              )}
            </article>
          </Motion>
        );
      })}
    </ul>
  );
}
