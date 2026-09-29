import Link from 'next/link';

import { formatDate } from '@/content/blog';

import { PhotoPanel } from './photo-panel';
import { type PostView, cardHeadline, cardSummary } from './post-view';

/**
 * Every post the index does not already show: not the featured article and
 * not linked from a topic hub. News posts land here without any curation, so
 * a new entry in `posts` is always one click from the blog index. Renders
 * nothing when there is nothing left to list.
 */
export function LatestPosts({ posts }: { posts: PostView[] }) {
  if (posts.length === 0) return null;
  const sorted = [...posts].sort((a, b) => (a.published < b.published ? 1 : a.published > b.published ? -1 : 0));

  return (
    <section aria-labelledby="latest-heading" className="border-t border-border bg-neutral-0">
      <div className="container-page flex flex-col gap-10 pt-16 pb-14 md:pt-24 md:pb-20">
        <div className="flex flex-col gap-3">
          <p className="text-micro font-bold tracking-[0.13em] text-text-muted uppercase">Latest</p>
          <h2
            id="latest-heading"
            className="text-[30px] leading-[36px] font-extrabold tracking-[-0.03em] text-text md:text-h1 md:leading-h1"
          >
            News and notes from Flash
          </h2>
        </div>
        <ul className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {sorted.map((post) => (
            <li key={post.slug} className="relative flex flex-col gap-[10px] border-t border-border-strong pt-5">
              <PhotoPanel
                image={post.cover}
                alt=""
                sizes="(min-width: 1024px) 394px, (min-width: 768px) 50vw, 100vw"
                badge={post.category}
                className="aspect-[394/222] w-full"
              />
              <h3 className="text-body-l leading-body font-semibold tracking-heading text-text">
                <Link href={`/resources/blog/${post.slug}/`} className="after:absolute after:inset-0 hover:text-brand-blue">
                  {cardHeadline(post)}
                </Link>
              </h3>
              <p className="text-body-s text-text-muted">{cardSummary(post)}</p>
              <p className="pt-1 text-caption text-text-muted">
                {post.author} · <time dateTime={post.published}>{formatDate(post.published)}</time>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
