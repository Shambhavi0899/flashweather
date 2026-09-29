import Image from 'next/image';
import Link from 'next/link';

import { coverage, otherMentions } from '@/content/press';

/**
 * "Where FlashHail was covered": the two trade pieces and the "Also" line.
 * The publications are named but the design gives no article URL, so they are
 * text rather than a guess. Each card links to the Flash page that explains
 * the product the coverage is about.
 */
export function PressCoverage() {
  return (
    <section id="coverage" aria-labelledby="coverage-heading" className="scroll-mt-6 border-t border-border bg-neutral-0">
      <div className="container-page flex flex-col gap-10 py-16 lg:py-[112px]">
        <h2
          id="coverage-heading"
          className="text-[30px] leading-[36px] font-extrabold tracking-[-0.03em] text-text md:text-h1 md:leading-h1"
        >
          Where FlashHail was covered
        </h2>

        <ul className="grid gap-12 lg:grid-cols-2 lg:gap-0">
          {coverage.map((item, i) => (
            <li
              key={item.outlet}
              className={`flex flex-col gap-[14px] ${
                i === 0 ? 'lg:pr-12' : 'border-t border-border pt-12 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12'
              }`}
            >
              <figure className="flex flex-col gap-2">
                <div className="relative aspect-[576/230] overflow-hidden rounded-lg border border-border bg-brand-navy">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(min-width: 1440px) 576px, (min-width: 1024px) 45vw, calc(100vw - 32px)"
                    className={item.image.fit === 'contain' ? 'object-contain' : 'object-cover'}
                  />
                </div>
                <figcaption className="text-micro text-text-muted">{item.image.caption}</figcaption>
              </figure>
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-micro font-semibold tracking-label text-brand-blue uppercase">{item.outlet}</span>
                <span className="text-caption text-text-subtle">{item.beat}</span>
              </p>
              <h3 className="text-[22px] leading-[30px] font-semibold tracking-heading text-pretty text-text md:text-h3 md:leading-h3">
                {item.headline}
              </h3>
              <p className="text-[17px] leading-h4 text-pretty text-text-muted">{item.summary}</p>
              <p className="flex flex-wrap gap-x-5 gap-y-1 text-body-s leading-5 font-medium">
                <span className="text-text-muted">Coverage in {item.outlet} · {item.domain}</span>
                <Link href="/products/hail-prediction/" className="text-brand-blue hover:underline">
                  How FlashHail works <span aria-hidden>→</span>
                </Link>
              </p>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3 border-t border-border pt-6 md:flex-row md:items-center md:gap-10">
          <p className="shrink-0 text-micro font-semibold tracking-label text-text-subtle uppercase">Also</p>
          <ul className="flex flex-col gap-2 md:flex-row md:flex-wrap md:gap-x-10">
            {otherMentions.map((mention) => (
              <li key={mention.text} className="text-body-s leading-5 text-text">
                {mention.href ? (
                  <a href={mention.href} rel="noopener" className="hover:underline">
                    {mention.text} <span aria-hidden>↗</span>
                  </a>
                ) : (
                  mention.text
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
