import Image from 'next/image';
import Link from 'next/link';

import { type Post, formatDate } from '@/content/blog';

/** A post on the resources hub: cover, category, headline, byline and date. */
export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/resources/blog/${post.slug}/`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-neutral-0 transition hover:border-brand-blue"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-brand-navy">
        <Image
          src={post.cover.src}
          alt={post.cover.alt}
          fill
          sizes="(min-width: 1440px) 400px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          className="object-cover transition duration-300 group-hover:scale-[1.02]"
        />
        <div aria-hidden className="resources-post-grade absolute inset-0" />
        <span className="absolute bottom-3 left-3 flex min-h-[26px] items-center rounded-sm border border-white/10 bg-[#040818B8] px-[10px] text-[11px] leading-[14px] font-bold tracking-[0.13em] text-white uppercase">
          {post.category}
        </span>
      </div>
      <div className="flex grow flex-col gap-3 p-6">
        <h3 className="text-body-l leading-body font-extrabold tracking-heading text-text group-hover:text-brand-blue">
          {post.shortHeadline}
        </h3>
        <p className="mt-auto text-caption text-text-muted">
          {post.author} · <time dateTime={post.published}>{formatDate(post.published)}</time> · {post.readingMinutes}{' '}
          min read
        </p>
      </div>
    </Link>
  );
}
