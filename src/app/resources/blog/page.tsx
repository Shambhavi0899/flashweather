import Image from 'next/image';
import Link from 'next/link';

import { HubSection } from '@/components/blog/hub-section';
import { LatestPosts } from '@/components/blog/latest-posts';
import { type PostView, cardHeadline, cardSummary, initialsOf } from '@/components/blog/post-view';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { HeroSection, HeroWords } from '@/components/hero/hero';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { formatDate, hubs, posts, startHere } from '@/content/blog';
import { JsonLd, blogSchema, webPageSchema } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';
import { site } from '@/lib/seo/site';

const path = '/resources/blog/';
const description =
  'Weather decisions, explained for the people who make them: lightning clearance, WBGT heat planning, hail readiness and accuracy, by Flash meteorologists.';

export const metadata = buildMetadata({
  title: 'Lightning safety resources and guides',
  description,
  path,
});

/** The featured article: the design features lightning prediction vs detection. */
const DESIGNED_FEATURE = 'lightning-prediction-vs-detection';
const featured: PostView | undefined = posts.find((post) => post.slug === DESIGNED_FEATURE) ?? posts[0];

/** The designed feature has its own card art; any other featured post shows its cover. */
const featuredImage =
  featured?.slug === DESIGNED_FEATURE
    ? {
        src: '/images/blog/lightning-prediction-vs-detection-cover.png',
        alt: `Long-exposure lightning bolt over a dark rural horizon in navy and indigo with one warm gold streak — cover for ${cardHeadline(featured)}`,
      }
    : featured && { src: featured.cover.src, alt: featured.cover.alt };

/** Posts the page would otherwise not reach: not featured, not on a hub card. */
const onHubs = new Set(hubs.flatMap((hub) => hub.cards.map((card) => card.slug)));
const latest: PostView[] = posts.filter((post) => post.slug !== featured?.slug && !onHubs.has(post.slug));

export default function BlogIndexPage() {
  return (
    <>
      <SiteHeader tone="light" />
      <main id="main">
        <JsonLd
          schema={webPageSchema({ type: 'CollectionPage', name: 'Flash Weather AI blog', description, path })}
        />
        <JsonLd
          schema={blogSchema({
            name: 'Flash Weather AI blog',
            description,
            path,
            posts: posts.map((post) => ({
              headline: post.headline,
              path: `/resources/blog/${post.slug}/`,
              published: post.published,
              modified: post.modified,
              author: post.author,
            })),
          })}
        />

        {/* Hero */}
        <HeroSection theme="light" className="overflow-hidden bg-neutral-0">
          <div className="hero-copy container-page pt-12 pb-12 md:pt-[88px] md:pb-14">
            <Breadcrumbs
              tone="light"
              className="hero-crumbs"
              trail={[
                { name: 'Home', path: '/' },
                { name: 'Blog', path },
              ]}
            />
            <p className="hero-eyebrow mt-6 text-micro font-bold tracking-[0.13em] text-brand-blue uppercase">
              Resources · Blog
            </p>
            <h1 className="mt-5 max-w-[1000px] text-[40px] leading-[44px] font-extrabold tracking-[-0.05em] text-text md:text-[56px] md:leading-[60px] lg:text-[64px] lg:leading-[68px]">
              <HeroWords text="Weather decisions, explained for the people who make them." tone="light" />
            </h1>
            <p className="hero-lede mt-6 max-w-narrow text-[17px] leading-[28px] text-text-muted md:text-[19px] md:leading-body-l">
              Written by Flash meteorologists for the athletic trainer, the superintendent, the safety officer and the
              adjuster — the calls you make in the 60 minutes before a storm and the hours before a heat day.
            </p>
            <nav aria-label="Blog topics" className="hero-ctas mt-9">
              <ul className="flex flex-wrap gap-[10px]">
                {hubs.map((hub, i) => (
                  <li key={hub.id}>
                    <a
                      href={`#${hub.id}`}
                      className={`flex h-11 items-center rounded-full px-[18px] text-body-s leading-caption font-medium transition ${
                        i === 0
                          ? 'bg-brand-navy text-white hover:bg-neutral-800'
                          : 'border border-border-strong text-text hover:bg-neutral-50'
                      }`}
                    >
                      {hub.eyebrow}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </HeroSection>

        {/* Featured article */}
        {featured && featuredImage && (
          <section aria-labelledby="featured-heading" className="border-t border-border bg-surface-sunken">
            <div className="container-page grid grid-cols-1 gap-8 pt-12 pb-16 lg:grid-cols-[minmax(0,704px)_minmax(0,1fr)] lg:gap-12 lg:pt-16 lg:pb-24">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-brand-navy shadow-[0_1px_2px_#0B13220D,0_24px_48px_#0B132229] sm:aspect-[704/420]">
                <Image
                  src={featuredImage.src}
                  alt={featuredImage.alt}
                  fill
                  preload
                  sizes="(min-width: 1440px) 704px, (min-width: 1024px) 55vw, 100vw"
                  className="object-cover opacity-85"
                />
                <div aria-hidden className="blog-featured-grade absolute inset-0" />
                <div className="relative flex h-full flex-col justify-between p-4 sm:px-8 sm:pt-7 sm:pb-8">
                  <div className="flex items-center justify-between gap-3">
                    <p className="flex min-h-[26px] items-center rounded-sm border border-white/10 bg-[#040818B8] px-[10px] text-[11px] leading-[14px] font-bold tracking-[0.13em] text-white uppercase">
                      Featured{featured.category && <> · {featured.category}</>}
                    </p>
                    {featured.readingMinutes ? (
                      <p className="flex min-h-[26px] items-center rounded-sm border border-white/10 bg-[#040818B8] px-[10px] text-[11px] leading-[14px] font-semibold tracking-label text-[#C9D1E3] uppercase">
                        {featured.readingMinutes} min read
                      </p>
                    ) : null}
                  </div>
                  <p
                    aria-hidden
                    className="hidden max-w-[560px] rounded-lg border border-white/10 bg-[#040818B8] px-[26px] py-[22px] text-[30px] leading-[36px] font-extrabold tracking-[-0.03em] text-white sm:block"
                  >
                    {cardHeadline(featured)}
                  </p>
                </div>
              </div>

              <div className="relative flex flex-col justify-center gap-4 lg:pb-7">
                <p className="text-micro font-bold tracking-[0.13em] text-brand-blue uppercase">Featured article</p>
                <h3
                  id="featured-heading"
                  className="text-[24px] leading-[30px] font-extrabold tracking-[-0.03em] text-text md:text-[28px] md:leading-[36px]"
                >
                  <Link href={`/resources/blog/${featured.slug}/`} className="hover:text-brand-blue">
                    {cardHeadline(featured)}
                  </Link>
                </h3>
                <p className="text-body text-text-muted">{cardSummary(featured)}</p>
                <div className="flex items-center gap-3 pt-1">
                  <span
                    aria-hidden
                    className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-navy text-micro font-bold text-white"
                  >
                    {initialsOf(featured)}
                  </span>
                  <div className="flex flex-col gap-[2px]">
                    <p className="text-[15px] leading-5 font-semibold text-text">{featured.author}</p>
                    <p className="text-caption text-text-muted">
                      {featured.authorRole && <>{featured.authorRole} · </>}
                      {featured.modified ? 'Updated' : 'Published'}{' '}
                      <time dateTime={featured.modified ?? featured.published}>
                        {formatDate(featured.modified ?? featured.published)}
                      </time>
                      {featured.readingMinutes ? <> · {featured.readingMinutes} min read</> : null}
                    </p>
                  </div>
                </div>
                <p className="pt-2">
                  <Link
                    href={`/resources/blog/${featured.slug}/`}
                    className="inline-flex min-h-11 items-center text-[15px] leading-body-s font-semibold text-brand-blue hover:underline"
                  >
                    Read the article <span aria-hidden>&nbsp;→</span>
                  </Link>
                </p>
              </div>
            </div>
          </section>
        )}

        <LatestPosts posts={latest} />

        {hubs.map((hub, i) => (
          <HubSection key={hub.id} hub={hub} tone={i % 2 === 0 ? 'white' : 'sunken'} />
        ))}

        {/* Start here */}
        <section aria-labelledby="start-here-heading" className="bg-brand-navy">
          <div className="container-page flex flex-col gap-12 py-20 md:py-[112px]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
              <div className="flex flex-col gap-3">
                <p className="text-micro font-bold tracking-[0.13em] text-viz-gold uppercase">Start here</p>
                <h2
                  id="start-here-heading"
                  className="text-[30px] leading-[36px] font-extrabold tracking-[-0.03em] text-white md:text-h1 md:leading-h1"
                >
                  Three pages every buyer reads first
                </h2>
              </div>
              <p className="max-w-[360px] text-[15px] leading-6 text-text-on-dark-muted lg:text-right">
                Evergreen, dated, and reviewed against the accuracy method. Read these before any vendor call.
              </p>
            </div>
            <ul className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
              {startHere.map((item) => (
                <li key={item.href} className="relative flex flex-col gap-[10px] border-t border-white/15 pt-5">
                  <p className="text-micro font-semibold tracking-label text-text-on-dark-muted">{item.number}</p>
                  <h3 className="text-h4 leading-h4 font-semibold tracking-heading text-white">{item.title}</h3>
                  <p className="text-[15px] leading-6 text-text-on-dark-muted">{item.body}</p>
                  <p className="pt-[6px]">
                    <Link
                      href={item.href}
                      className="text-body-s leading-5 font-semibold text-white after:absolute after:inset-0 hover:underline"
                    >
                      {item.cta} <span aria-hidden>→</span>
                    </Link>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Newsletter */}
        <section aria-labelledby="field-notes-heading" className="border-t border-border bg-neutral-0">
          <div className="container-page flex flex-col gap-8 py-16 lg:flex-row lg:items-center lg:gap-16 lg:py-20">
            <div className="flex max-w-[560px] flex-col gap-2 lg:shrink-0">
              <p className="text-micro font-bold tracking-[0.13em] text-text-muted uppercase">Field notes · Monthly</p>
              <p id="field-notes-heading" className="text-h3 leading-h3 font-semibold tracking-heading text-text">
                One email a month from the meteorology desk.
              </p>
              <p className="text-[15px] leading-6 text-text-muted">
                What changed in the model, what the season taught us, which policy pages we updated. No promotions.
              </p>
            </div>
            <div className="lg:grow">
              <a
                href={`mailto:${site.email}?subject=${encodeURIComponent('Subscribe to Field notes')}`}
                className="inline-flex h-12 items-center justify-center rounded-full bg-brand-blue px-[26px] text-body-s leading-caption font-extrabold tracking-[0.02em] text-white hover:bg-brand-blue-hover"
              >
                Subscribe
              </a>
            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
