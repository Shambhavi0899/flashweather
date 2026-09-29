'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

import { Motion } from '@/components/motion';
import { SectionLabel } from '@/components/products/section-header';
import type { ProductPage, TourStop } from '@/content/product-pages';
import { onScrollFrame, scrollToCentre } from '@/lib/scroll';

/** Where a stop becomes the current one: its top crosses this share of the viewport. */
const READING_LINE = 0.6;
/** The sync runs only where the screenshot is sticky and motion is welcome. */
const ARMED = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';

const stopId = (stop: TourStop) => `wcc-tour-${stop.spot}`;

/**
 * "What is the Weather Command Center?" as a guided tour of its screenshot.
 * The overview text runs down the left in short stops; the screenshot sits
 * sticky on the right, with one hotspot per stop on the area of the UI that
 * stop describes (areas are placed in styles/wcc-tour.css).
 *
 * While a stop crosses the reading line it is the current one: its text is at
 * full strength and the others step back to 40%, and its hotspot glows and
 * pulses with its label while the rest of the screenshot dims. A hotspot is a
 * button that scrolls its stop to the middle of the screen.
 *
 * The markup is the still state: with reduced motion or no JavaScript every
 * stop is at full strength and every hotspot is drawn, unpulsed, with its
 * label. Phones have no sticky screenshot; each stop opens with a close-up of
 * its own area instead.
 */
export function CommandCenterTour({
  overview,
}: {
  overview: Pick<ProductPage['overview'], 'heading' | 'image'> & { tour: TourStop[] };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { heading, image, tour } = overview;

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const stops = [...root.querySelectorAll<HTMLElement>('.wct-stop')];
    const spots = [...root.querySelectorAll<HTMLElement>('.wct-screen .wct-spot')];
    const media = window.matchMedia(ARMED);
    let current = -1;
    let release = () => {};

    const show = (next: number) => {
      if (next === current) return;
      current = next;
      stops.forEach((stop, i) => stop.toggleAttribute('data-on', i === next));
      spots.forEach((spot) => spot.toggleAttribute('data-on', spot.dataset.spot === tour[next]?.spot));
    };

    // The last stop whose top has crossed the reading line; the first until one has.
    const read = () => {
      const line = window.innerHeight * READING_LINE;
      let next = 0;
      stops.forEach((stop, i) => {
        if (stop.getBoundingClientRect().top <= line) next = i;
      });
      show(next);
    };

    const arm = () => {
      release();
      release = () => {};
      if (media.matches) {
        root.setAttribute('data-armed', '');
        release = onScrollFrame(read);
      } else {
        root.removeAttribute('data-armed');
        show(-1);
      }
    };
    arm();
    media.addEventListener('change', arm);

    return () => {
      media.removeEventListener('change', arm);
      release();
      root.removeAttribute('data-armed');
      show(-1);
    };
  }, [tour]);

  const goTo = (stop: TourStop) => {
    const target = document.getElementById(stopId(stop));
    if (target) scrollToCentre(target);
  };

  // The whole-screen spot goes first, so the smaller spots inside it sit on top.
  const spotOrder = [...tour].sort((a, b) => Number(b.spot === 'screen') - Number(a.spot === 'screen'));

  return (
    <section aria-labelledby="product-overview-heading" className="bg-surface">
      <div ref={ref} className="container-page wct">
        <div className="wct-text">
          <Motion className="motion wct-head" replay={false}>
            <SectionLabel tone="muted-light">Product overview</SectionLabel>
            <h2
              id="product-overview-heading"
              className="text-[32px] leading-[38px] font-extrabold tracking-[-0.03em] text-text md:text-[36px] md:leading-[42px] lg:text-[40px] lg:leading-[46px]"
            >
              {heading}
            </h2>
          </Motion>

          <ol className="wct-stops">
            {tour.map((stop, i) => (
              <Motion key={stop.spot} as="li" id={stopId(stop)} className="motion wct-stop" replay={false}>
                {/* Phones: a close-up of this stop's area, in place of the sticky screenshot. */}
                <div aria-hidden className="wct-view wct-crop" data-spot={stop.spot}>
                  <div className="wct-stage">
                    <Image src={image.src} alt="" fill sizes="280vw" className="object-cover" />
                    <span className="wct-spot" data-spot={stop.spot}>
                      <span className="wct-pulse motion-loop" />
                    </span>
                  </div>
                </div>
                <div className="wct-title">
                  <span aria-hidden className="wct-number">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-h4 leading-h4 font-extrabold tracking-display text-text">{stop.lead}</h3>
                </div>
                <p className="text-body leading-body text-pretty text-text-muted">{stop.body}</p>
              </Motion>
            ))}
          </ol>
        </div>

        <Motion className="motion wct-media" replay={false} threshold={0.1}>
          <div className="wct-sticky">
            <figure className="wct-figure">
              <div className="wct-view wct-screen">
                <div className="wct-stage">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1440px) 1200px, 92vw"
                    className="object-cover"
                  />
                  {spotOrder.map((stop) => (
                    <button
                      key={stop.spot}
                      type="button"
                      className="wct-spot"
                      data-spot={stop.spot}
                      aria-controls={stopId(stop)}
                      aria-label={`${stop.label}: ${stop.lead}`}
                      onClick={() => goTo(stop)}
                    >
                      <span className="wct-pulse motion-loop" />
                      <span className="wct-spot-label">{stop.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <figcaption className="text-micro leading-caption text-text-subtle">{image.caption}</figcaption>
            </figure>
          </div>
        </Motion>
      </div>
    </section>
  );
}
