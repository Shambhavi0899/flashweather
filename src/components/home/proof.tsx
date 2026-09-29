import Image from 'next/image';
import Link from 'next/link';

import { ScrubQuote } from '@/components/finale/scrub-quote';
import { Motion } from '@/components/motion';
import { proofCards, testimonial } from '@/content/home';

/**
 * "Does it hold up in the field?": two proof cards, then the testimonial.
 * The first of the page's closing sections; the blue band and the footer
 * follow it (styles/finale.css).
 *
 * Motion, on the shared .motion system: the heading rises, the cards fade up
 * one after the other with their photo settling from 1.05 to 1, and each
 * card's figure counts up. While a card is on screen its photo keeps moving
 * a little (`ambient`). The testimonial is read in by the scroll
 * (<ScrubQuote>). The markup is the final frame.
 */
export function Proof() {
  return (
    <section aria-labelledby="proof-heading" className="bg-surface-sunken">
      <div className="container-page flex flex-col gap-12 pt-20 lg:pt-[120px]">
        <Motion replay={false} threshold={0.6} className="motion flex max-w-[820px] flex-col gap-4">
          <p className="fin-rise text-[11px] leading-[14px] font-semibold tracking-label-wide text-text-muted uppercase">
            Proof
          </p>
          <h2
            id="proof-heading"
            className="fin-rise text-[28px] leading-[34px] font-extrabold tracking-[-0.04em] text-text md:text-h2 md:leading-h2"
          >
            Does it hold up in the field?
          </h2>
        </Motion>

        <ul className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {proofCards.map((card) => (
            <Motion
              as="li"
              key={card.title}
              count={card.figure}
              replay={false}
              threshold={0.25}
              className="motion proof-card min-w-0"
            >
              <Link
                href={card.link.href}
                className={`proof-link group flex h-full flex-col overflow-hidden rounded-[20px] ${
                  card.dark ? 'bg-brand-navy' : 'border border-border bg-neutral-0'
                }`}
              >
                <div className="relative h-[210px] shrink-0 overflow-hidden">
                  <span className="proof-zoom absolute inset-0">
                    <span className={`proof-ambient-${card.ambient} motion-loop absolute inset-0`}>
                      <Image
                        src={card.image.src}
                        alt={card.image.alt}
                        fill
                        sizes="(min-width: 1440px) 608px, (min-width: 1024px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </span>
                  </span>
                  {card.ambient === 'flash' && <span aria-hidden className="proof-flash motion-loop absolute inset-0" />}
                  <span aria-hidden className="home-proof-grade absolute inset-0" />
                  <p className="absolute top-6 right-5 left-5 text-[11px] leading-4 font-semibold tracking-[0.16em] text-viz-gold uppercase sm:left-10 md:leading-[14px] md:font-extrabold md:tracking-[0.13em]">
                    {card.tag}
                  </p>
                  <p className="absolute bottom-[18px] left-5 text-[44px] leading-[50px] font-extrabold tracking-[-0.05em] text-text-on-dark sm:left-10 sm:text-display-l sm:leading-display-l">
                    <span data-count>{card.figure}</span>
                  </p>
                </div>
                <div className="flex grow flex-col justify-between gap-7 px-5 pt-7 pb-9 sm:px-10">
                  <div className="flex flex-col gap-3">
                    <h3
                      className={`text-h4 leading-[26px] font-semibold tracking-heading md:text-h3 md:leading-h3 md:font-bold md:tracking-normal ${
                        card.dark ? 'text-text-on-dark' : 'text-text'
                      }`}
                    >
                      {card.title}
                    </h3>
                    <p
                      className={`text-body-s leading-5 md:text-[15px] md:leading-6 ${
                        card.dark ? 'text-text-on-dark-muted' : 'text-text-muted'
                      }`}
                    >
                      {card.body}
                    </p>
                  </div>
                  <p
                    className={`text-body-s leading-5 font-medium group-hover:underline md:leading-caption md:font-bold ${
                      card.dark ? 'text-text-on-dark' : 'text-brand-blue'
                    }`}
                  >
                    {card.link.label}{' '}
                    <span aria-hidden className="proof-arrow">
                      →
                    </span>
                  </p>
                </div>
              </Link>
            </Motion>
          ))}
        </ul>
      </div>

      {/* The testimonial is the moment the section ends on: centred, large,
          with room around it. */}
      <div className="container-page pt-16 pb-24 lg:pt-24 lg:pb-[152px]">
        <div className="border-t border-border-strong pt-16 lg:pt-24">
          <ScrubQuote
            quote={testimonial.quote}
            attribution={testimonial.attribution}
            className="mx-auto flex max-w-[1040px] flex-col items-center gap-8 text-center lg:gap-10"
            quoteClassName="text-[26px] leading-[36px] font-medium tracking-display text-pretty text-text sm:text-[32px] sm:leading-[44px] lg:text-display-m lg:leading-[58px]"
          >
            <p className="text-[11px] leading-[14px] font-semibold tracking-[0.16em] text-text-muted uppercase">
              Testimonial
            </p>
          </ScrubQuote>
        </div>
      </div>
    </section>
  );
}
