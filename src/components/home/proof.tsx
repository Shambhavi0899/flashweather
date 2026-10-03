import Image from 'next/image';

import { ScrubQuote } from '@/components/finale/scrub-quote';
import { Motion } from '@/components/motion';
import { SiteLink } from '@/components/site-link';
import { VideoPlayer } from '@/components/video-player';
import { proofCards, proofVideo, testimonial } from '@/content/home';

/**
 * "Does it hold up in the field?": the customer clip with Ryan Coll's pull
 * quote under it (<VideoPlayer>, 57% from lg), the two proof cards stacked
 * beside them (43%, sized to end level with the quote), and, under a rule,
 * the written testimonial from a different club. The first of the page's
 * closing sections; the blue band and the footer follow it
 * (styles/finale.css).
 *
 * Motion, on the shared .motion system: the heading rises; then the clip,
 * the quote, the cards and the testimonial fade up in that order, the cards
 * with their photo settling from 1.05 to 1 and their figure counting up.
 * While a card is on screen its photo keeps moving a little (`ambient`).
 * The testimonial is read in by the scroll (<ScrubQuote>). The markup is
 * the final frame.
 */
export function Proof() {
  return (
    <section aria-labelledby="proof-heading" className="bg-surface-sunken">
      <div className="container-page flex flex-col gap-10 pt-20 lg:gap-12 lg:pt-[120px]">
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

        <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-8">
          {/* The clip, and the quote filling what is left under it. */}
          <div className="flex flex-col gap-6 lg:w-[57%] lg:shrink-0">
            <Motion replay={false} threshold={0.25} className="motion">
              <div className="fin-fade">
                <VideoPlayer clip={proofVideo} sizes="(min-width: 1440px) 712px, (min-width: 1024px) 57vw, 100vw" />
              </div>
            </Motion>
            <Motion replay={false} threshold={0.5} className="motion flex grow flex-col justify-center">
              <figure className="fin-fade flex flex-col gap-3 px-1 lg:px-2">
                <span aria-hidden className="proof-quote-mark">
                  “
                </span>
                <blockquote className="text-[19px] leading-[29px] font-medium text-pretty text-text md:text-[22px] md:leading-[33px]">
                  {proofVideo.quote}
                </blockquote>
                <figcaption className="text-caption leading-5 text-text-muted">{proofVideo.attribution}</figcaption>
              </figure>
            </Motion>
          </div>

          <ul className="flex flex-col gap-6 lg:min-w-0 lg:flex-1">
            {proofCards.map((card) => (
              <Motion
                as="li"
                key={card.title}
                count={card.figure}
                replay={false}
                threshold={0.25}
                className="motion proof-card flex min-w-0 lg:flex-1"
              >
                <SiteLink
                  href={card.link.href}
                  className={`proof-link group flex w-full flex-col overflow-hidden rounded-[20px] ${
                    card.dark ? 'bg-brand-navy' : 'border border-border bg-neutral-0'
                  }`}
                >
                  <div className="relative h-[150px] shrink-0 overflow-hidden lg:h-[112px]">
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
                    {card.ambient === 'flash' && (
                      <span aria-hidden className="proof-flash motion-loop absolute inset-0" />
                    )}
                    <span aria-hidden className="home-proof-grade absolute inset-0" />
                    <p className="absolute top-4 right-5 left-5 text-[11px] leading-4 font-semibold tracking-[0.16em] text-viz-gold uppercase sm:left-7 md:leading-[14px] md:font-extrabold md:tracking-[0.13em]">
                      {card.tag}
                    </p>
                    <p className="absolute bottom-3 left-5 text-[34px] leading-[40px] font-extrabold tracking-[-0.05em] text-text-on-dark sm:left-7 sm:text-[40px] sm:leading-[44px]">
                      <span data-count>{card.figure}</span>
                    </p>
                  </div>
                  <div className="flex grow flex-col justify-between gap-4 px-5 pt-5 pb-6 sm:px-7">
                    <div className="flex flex-col gap-3">
                      <h3
                        className={`text-[17px] leading-6 font-bold tracking-heading md:text-[19px] md:leading-[26px] ${
                          card.dark ? 'text-text-on-dark' : 'text-text'
                        }`}
                      >
                        {card.title}
                      </h3>
                      <p
                        className={`text-[13px] leading-[19px] md:text-body-s md:leading-[21px] ${
                          card.dark ? 'text-text-on-dark-muted' : 'text-text-muted'
                        }`}
                      >
                        {card.body}
                      </p>
                    </div>
                    <p
                      className={`text-caption leading-5 font-bold group-hover:underline ${
                        card.dark ? 'text-text-on-dark' : 'text-brand-blue'
                      }`}
                    >
                      {card.link.label}{' '}
                      <span aria-hidden className="proof-arrow">
                        →
                      </span>
                    </p>
                  </div>
                </SiteLink>
              </Motion>
            ))}
          </ul>
        </div>
      </div>

      {/* The testimonial is the moment the section ends on: centred, large,
          with room around it. */}
      <div className="container-page pt-16 pb-24 lg:pt-20 lg:pb-[152px]">
        <Motion replay={false} threshold={0.3} className="motion border-t border-border-strong pt-14 lg:pt-20">
          <ScrubQuote
            quote={testimonial.quote}
            attribution={testimonial.attribution}
            className="fin-fade mx-auto flex max-w-[1040px] flex-col items-center gap-8 text-center lg:gap-10"
            quoteClassName="text-[26px] leading-[36px] font-medium tracking-display text-pretty text-text sm:text-[32px] sm:leading-[44px] lg:text-display-m lg:leading-[58px]"
          >
            <p className="text-[11px] leading-[14px] font-semibold tracking-[0.16em] text-text-muted uppercase">
              Testimonial
            </p>
          </ScrubQuote>
        </Motion>
      </div>
    </section>
  );
}
