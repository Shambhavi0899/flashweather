import Link from 'next/link';

import { Breadcrumbs } from '@/components/breadcrumbs';
import { HeroSection, HeroWords } from '@/components/hero/hero';
import { Eyebrow } from '@/components/eyebrow';
import { PostCard } from '@/components/resources/post-card';
import { ResourceCard } from '@/components/resources/resource-card';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { posts } from '@/content/blog';
import { RESOURCES_PATH, resourceCards, resourcesPage } from '@/content/resources';
import { JsonLd, itemListSchema, webPageSchema } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: resourcesPage.title,
  description: resourcesPage.description,
  path: RESOURCES_PATH,
});

/** The newest posts first; only posts that exist in content/blog.ts. */
const latestPosts = [...posts].sort((a, b) => b.published.localeCompare(a.published)).slice(0, 3);

/**
 * The resources hub: every reading, reference and media destination on one
 * page, then the latest posts. Links to each, so none depends on the nav alone.
 */
export default function ResourcesPage() {
  return (
    <>
      <SiteHeader tone="light" />
      <main id="main">
        <JsonLd
          schema={webPageSchema({
            type: 'CollectionPage',
            name: resourcesPage.title,
            description: resourcesPage.description,
            path: RESOURCES_PATH,
          })}
        />
        <JsonLd schema={itemListSchema(resourceCards.map((card) => ({ name: card.title, path: card.href })))} />

        <HeroSection theme="light" className="resources-hero overflow-hidden border-b border-border">
          <div className="hero-copy container-page flex flex-col gap-5 pt-10 pb-14 md:pt-14 md:pb-20">
            <Breadcrumbs
              tone="light"
              className="hero-crumbs"
              trail={[
                { name: 'Home', path: '/' },
                { name: 'Resources', path: RESOURCES_PATH },
              ]}
            />
            <Eyebrow tone="light" className="hero-eyebrow pt-6">
              Resources · Blog · FAQ · Video
            </Eyebrow>
            <h1 className="max-w-[900px] text-[40px] leading-[44px] font-extrabold tracking-[-0.05em] text-text md:text-[56px] md:leading-[60px] lg:text-[64px] lg:leading-[68px]">
              <HeroWords text={resourcesPage.headline} tone="light" />
            </h1>
            <p className="hero-lede max-w-narrow text-[17px] leading-[28px] text-pretty text-text-muted md:text-[19px] md:leading-body-l">
              {resourcesPage.intro}
            </p>
          </div>
        </HeroSection>

        <section aria-labelledby="all-resources" className="bg-surface-sunken">
          <div className="container-page flex flex-col gap-10 py-16 md:py-20 lg:py-24">
            <h2
              id="all-resources"
              className="text-[28px] leading-[34px] font-extrabold tracking-[-0.04em] text-text md:text-h2 md:leading-h2"
            >
              Guides, answers and media
            </h2>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {resourceCards.map((card) => (
                <li key={card.href}>
                  <ResourceCard card={card} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {latestPosts.length > 0 && (
          <section aria-labelledby="latest-posts" className="bg-neutral-0">
            <div className="container-page flex flex-col gap-10 py-16 md:py-20 lg:py-24">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
                <h2
                  id="latest-posts"
                  className="text-[28px] leading-[34px] font-extrabold tracking-[-0.04em] text-text md:text-h2 md:leading-h2"
                >
                  Latest from the blog
                </h2>
                <Link
                  href="/resources/blog/"
                  className="inline-flex min-h-11 items-center text-body-s font-bold text-brand-blue hover:underline"
                >
                  All articles<span aria-hidden>&nbsp;→</span>
                </Link>
              </div>
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {latestPosts.map((post) => (
                  <li key={post.slug}>
                    <PostCard post={post} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

      </main>
      <SiteFooter />
    </>
  );
}
