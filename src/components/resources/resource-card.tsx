import Link from 'next/link';

import type { ResourceCard as Card } from '@/content/resources';

/**
 * One destination on the resources hub. The whole card is the link; an
 * external destination (YouTube, the app stores) says so with ↗ and opens
 * with rel="noopener".
 */
export function ResourceCard({ card }: { card: Card }) {
  const className =
    'resources-card group flex h-full flex-col gap-3 rounded-lg border border-border bg-neutral-0 p-6 transition hover:border-brand-blue md:p-7';
  const content = (
    <>
      <span className="text-micro font-bold tracking-label-wide text-gold-on-light uppercase">{card.kind}</span>
      <h3 className="text-h4 leading-h4 font-extrabold tracking-heading text-text md:text-h3 md:leading-h3">
        {card.title}
      </h3>
      <p className="grow text-body text-text-muted">{card.body}</p>
      <span className="inline-flex min-h-11 items-center gap-2 text-body-s font-bold text-brand-blue group-hover:underline">
        {card.cta}
        <span aria-hidden>{card.external ? '↗' : '→'}</span>
      </span>
    </>
  );

  return card.external ? (
    <a href={card.href} rel="noopener" className={className}>
      {content}
    </a>
  ) : (
    <Link href={card.href} className={className}>
      {content}
    </Link>
  );
}
