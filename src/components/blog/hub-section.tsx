import Link from 'next/link';

import { getPost, type Hub } from '@/content/blog';

import { PhotoPanel } from './photo-panel';

/**
 * A topic hub on the blog index: a question as the H2, three article cards.
 *
 * A card links only when its article exists in `posts`. Cards for articles
 * not yet published render as plain titles -- the index never links to a URL
 * that would 404.
 */
export function HubSection({ hub, tone }: { hub: Hub; tone: 'white' | 'sunken' }) {
  return (
    <section
      id={hub.id}
      aria-labelledby={`${hub.id}-heading`}
      className={tone === 'white' ? 'bg-neutral-0' : 'bg-surface-sunken'}
    >
      <div className="container-page flex flex-col gap-10 pt-16 pb-14 md:pt-24 md:pb-20">
        <div className="flex flex-col gap-3">
          <p className="text-micro font-bold tracking-[0.13em] text-text-muted uppercase">{hub.eyebrow}</p>
          <h2
            id={`${hub.id}-heading`}
            className="text-[30px] leading-[36px] font-extrabold tracking-[-0.03em] text-text md:text-h1 md:leading-h1"
          >
            {hub.heading}
          </h2>
          <p className="text-body text-text-muted">{hub.intro}</p>
        </div>
        <ul className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {hub.cards.map((card) => {
            const post = card.slug ? getPost(card.slug) : undefined;
            const href = post ? `/resources/blog/${post.slug}/` : undefined;
            return (
              <li
                key={card.title}
                className="relative flex flex-col gap-[10px] border-t border-border-strong pt-5"
              >
                <PhotoPanel
                  image={card.image}
                  sizes="(min-width: 1024px) 394px, (min-width: 768px) 50vw, 100vw"
                  badge={card.badge}
                  overlay={card.overlay}
                  className="aspect-[394/222] w-full"
                />
                <h3 className="text-body-l leading-body font-semibold tracking-heading text-text">
                  {href ? (
                    <Link href={href} className="after:absolute after:inset-0 hover:text-brand-blue">
                      {card.title}
                    </Link>
                  ) : (
                    card.title
                  )}
                </h3>
                <p className="text-body-s text-text-muted">{card.summary}</p>
                <p className="pt-1 text-caption text-text-muted">{card.byline}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
