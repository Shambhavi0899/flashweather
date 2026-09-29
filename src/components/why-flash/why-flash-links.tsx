import Link from 'next/link';

import { type TextLink, type WhyFlashKey, whyFlashOrder, whyFlashPages } from '@/content/why-flash';

import { Kicker } from './section-heading';

/**
 * "More in Why Flash": the section's other pages, plus the page's own
 * outbound links. Every page in the section links to every other, so none of
 * them depends on the nav alone to be reached.
 */
export function WhyFlashLinks({
  current,
  extra = [],
  heading = 'More in Why Flash',
}: {
  current: WhyFlashKey;
  extra?: TextLink[];
  heading?: string;
}) {
  const pages = whyFlashOrder.filter((key) => key !== current).map((key) => whyFlashPages[key]);

  return (
    <nav aria-label={heading} className="border-t border-border bg-neutral-0">
      <div className="container-page flex flex-col gap-8 py-16 lg:py-20">
        <div className="flex flex-col gap-3">
          <Kicker>Keep reading</Kicker>
          {/* A label, not a heading: the page outline is the design's H2s. */}
          <p className="text-h3 leading-h3 font-extrabold tracking-[-0.02em] text-text md:text-[28px] md:leading-[34px]">
            {heading}
          </p>
        </div>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <li key={page.path} className="border-t-2 border-border-strong pt-5">
              <Link href={page.path} className="group flex flex-col gap-[6px]">
                <span className="text-body-l leading-body font-semibold text-text group-hover:text-brand-blue">
                  {page.label}
                  <span aria-hidden> →</span>
                </span>
                <span className="text-caption text-text-muted">{page.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
        {extra.length > 0 && (
          <ul className="flex flex-wrap gap-x-6 gap-y-1 border-t border-border pt-6">
            {extra.map((item) => (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center text-body-s font-semibold text-brand-blue hover:underline"
                >
                  {item.label}
                  <span aria-hidden>&nbsp;→</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}
