import Image from 'next/image';

import { testimonials } from '@/content/press';

/**
 * "What do the people running the sites say?" -- the quotes the migration
 * dropped, reinstated verbatim, under the golf-course photo band.
 */
export function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="scroll-mt-6 border-t border-border bg-surface-sunken"
    >
      <div className="container-page flex flex-col gap-8 py-16 lg:py-[112px]">
        <h2
          id="testimonials-heading"
          className="text-[30px] leading-[36px] font-extrabold tracking-[-0.03em] text-text md:text-h1 md:leading-h1"
        >
          What do the people running the sites say?
        </h2>

        <div className="relative h-[240px] overflow-hidden rounded-lg bg-brand-navy">
          <Image
            src="/images/press/flash-weather-golf-course-storm-sky-testimonials.webp"
            alt="A golf fairway under a dark rain sky, the photograph heading the quotes from the people who run the sites"
            fill
            sizes="(min-width: 1440px) 1248px, calc(100vw - 32px)"
            className="object-cover object-[50%_55%]"
          />
          <div aria-hidden className="press-testimonials-grade absolute inset-0" />
          <p className="absolute top-6 left-5 text-[11px] leading-[14px] font-extrabold tracking-[0.13em] text-viz-gold uppercase md:left-7">
            In the field
          </p>
          <p className="absolute right-5 bottom-[26px] left-5 max-w-[720px] text-[20px] leading-[26px] font-extrabold tracking-[-0.03em] text-text-on-dark md:left-7 md:text-h3 md:leading-body-l">
            The people making the call are outside, with a sky like this over them.
          </p>
        </div>

        <ul className="grid gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <li key={t.name}>
              <figure className="flex h-full flex-col justify-between gap-6 rounded-[20px] border border-border bg-neutral-0 p-6 shadow-[0_1px_2px_#0B13220D,0_12px_32px_#0B13220F] md:p-9">
                <blockquote className="text-[18px] leading-[28px] font-medium tracking-heading text-pretty text-text md:text-h4 md:leading-body-l">
                  <p>“{t.quote}”</p>
                </blockquote>
                <figcaption className="flex flex-col gap-[2px]">
                  <span className="text-body leading-body-s font-semibold text-text">{t.name}</span>
                  <span className="text-body-s leading-5 text-text-muted">{t.role}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
