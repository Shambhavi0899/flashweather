import Image from 'next/image';
import { notFound } from 'next/navigation';

import { ArticleBlocks } from '@/components/blog/article-blocks';
import { ArticleRail } from '@/components/blog/article-rail';
import { FaqList } from '@/components/blog/faq-list';
import { TocDisclosure, TocSidebar } from '@/components/blog/toc';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { HeroSection, HeroWords } from '@/components/hero/hero';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { type PostView, cardHeadline, initialsOf } from '@/components/blog/post-view';
import { formatDate, getPost, posts } from '@/content/blog';
import { JsonLd, articleSchema, faqSchema } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';

/**
 * One template, every post. A post is an entry in `content/blog.ts`; its
 * body is structured data rendered by `ArticleBlocks`.
 *
 * The template reads the post as a `PostView`, so everything past the
 * headline, cover, author and body is optional: a plain news post renders
 * without the FAQ, sources, review note or badge, and nothing empty is drawn.
 */

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return posts.map((post) => ({ slug: post.slug }));
}

/** Unknown slugs 404 rather than render an empty, indexable shell. */
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/resources/blog/${post.slug}/`,
    type: 'article',
    publishedTime: post.published,
    modifiedTime: post.modified,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const found = getPost(slug);
  if (!found) notFound();
  const post: PostView = found;

  const path = `/resources/blog/${post.slug}/`;
  const sections = post.sections ?? [];
  const faqs = post.faqs ?? [];
  const faqId = 'frequently-asked';
  const toc = [
    ...sections.flatMap((section) =>
      section.heading ? [{ id: section.id, label: section.tocLabel ?? section.heading }] : [],
    ),
    ...(faqs.length > 0 ? [{ id: faqId, label: 'Frequently asked' }] : []),
  ];
  /** A contents list earns its place from two entries up. */
  const showToc = toc.length > 1;
  const initials = initialsOf(post);
  const readNext = posts
    .filter((other) => other.slug !== post.slug)
    .slice(0, 3)
    .map((other) => ({ title: cardHeadline(other), href: `/resources/blog/${other.slug}/` }));

  return (
    <>
      <SiteHeader tone="light" />
      <main id="main">
        <JsonLd
          schema={articleSchema({
            title: post.headline,
            description: post.description,
            path,
            published: post.published,
            modified: post.modified,
            author: post.author,
          })}
        />
        {faqs.length > 0 && <JsonLd schema={faqSchema(faqs)} />}

        <HeroSection as="header" theme="light" className="overflow-hidden border-b border-border bg-neutral-0">
          <div className="hero-copy container-page pt-10 pb-10 md:pt-[72px] md:pb-12">
            <Breadcrumbs
              tone="light"
              className="hero-crumbs"
              trail={[
                { name: 'Home', path: '/' },
                { name: 'Blog', path: '/resources/blog/' },
                { name: post.title, path },
              ]}
            />
            {post.category && (
              <p className="hero-eyebrow mt-5 inline-flex h-[30px] items-center rounded-full bg-brand-navy px-[14px] text-caption leading-micro font-medium text-white">
                {post.category}
              </p>
            )}
            <h1 className="mt-5 max-w-[1000px] text-[34px] leading-[38px] font-extrabold tracking-[-0.03em] text-text sm:text-[42px] sm:leading-[46px] lg:text-[52px] lg:leading-[56px] lg:tracking-[-0.05em]">
              <HeroWords text={post.headline} tone="light" />
            </h1>
            <div className="hero-lede mt-7 flex items-center gap-4">
              <span
                aria-hidden
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-navy text-micro font-bold text-white md:text-caption md:leading-micro"
              >
                {initials}
              </span>
              <div className="flex flex-col gap-[3px]">
                <p className="text-[15px] leading-5 font-semibold text-text">
                  {post.author}
                  {post.authorRole && (
                    <span className="block text-caption font-normal text-text-muted md:inline md:text-[15px] md:leading-5 md:font-semibold md:text-text">
                      <span className="sr-only md:not-sr-only">, </span>
                      {post.authorRole}
                    </span>
                  )}
                </p>
                <p className="text-caption text-text-muted">
                  {post.reviewNote && <>{post.reviewNote} · </>}
                  Published <time dateTime={post.published}>{formatDate(post.published)}</time>
                  {post.modified && (
                    <>
                      {' '}
                      · Updated <time dateTime={post.modified}>{formatDate(post.modified)}</time>
                    </>
                  )}
                  {post.readingMinutes ? <> · {post.readingMinutes} min read</> : null}
                </p>
              </div>
            </div>
            <div className="hero-visual hero-visual-still relative mt-9 aspect-[16/10] overflow-hidden rounded-[20px] bg-brand-navy shadow-[0_1px_2px_#0B13220D,0_24px_48px_#0B132224] sm:aspect-[1248/380]">
              <Image
                src={post.cover.src}
                alt={post.cover.alt}
                fill
                preload
                sizes="(min-width: 1440px) 1248px, 100vw"
                className="object-cover opacity-90"
              />
              <div aria-hidden className="blog-cover-grade absolute inset-0" />
              {post.coverBadge && (
                <p className="absolute bottom-4 left-4 flex min-h-[26px] items-center rounded-sm border border-white/10 bg-[#040818B8] px-[10px] py-1 text-[11px] leading-[14px] font-bold tracking-[0.13em] text-[#C9D1E3] uppercase sm:bottom-7 sm:left-8">
                  {post.coverBadge}
                </p>
              )}
            </div>
          </div>
        </HeroSection>

        <div className="mx-auto grid w-full max-w-page grid-cols-1 gap-12 px-4 pt-10 pb-20 md:px-10 md:pt-14 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-9 xl:grid-cols-[240px_minmax(0,720px)_280px] xl:px-16">
          <div className="hidden xl:block">{showToc && <TocSidebar label="In this article" items={toc} />}</div>

          <article className="flex min-w-0 flex-col gap-12">
            {showToc && <TocDisclosure label="In this article" items={toc} />}

            {post.lead && <p className="text-body-l text-pretty text-text">{post.lead}</p>}

            {sections.map((section) =>
              section.heading ? (
                <section
                  key={section.id}
                  id={section.id}
                  aria-labelledby={`${section.id}-heading`}
                  className="flex scroll-mt-6 flex-col gap-4"
                >
                  <h2
                    id={`${section.id}-heading`}
                    className="text-[26px] leading-[32px] font-extrabold tracking-[-0.03em] text-text sm:text-[28px] sm:leading-[36px]"
                  >
                    {section.heading}
                  </h2>
                  <ArticleBlocks blocks={section.blocks} />
                </section>
              ) : (
                <div key={section.id} id={section.id} className="flex scroll-mt-6 flex-col gap-4">
                  <ArticleBlocks blocks={section.blocks} />
                </div>
              ),
            )}

            {faqs.length > 0 && (
              <FaqList
                id={faqId}
                heading="Frequently asked"
                faqs={faqs}
                headingClassName="text-[26px] leading-[32px] sm:text-[28px] sm:leading-[36px]"
              />
            )}

            <section
              aria-label="About the author"
              className="flex flex-col gap-5 rounded-lg bg-surface-sunken p-6 sm:flex-row sm:items-start"
            >
              <span
                aria-hidden
                className="flex size-16 shrink-0 items-center justify-center rounded-full bg-brand-navy text-body-s leading-caption font-bold text-text-on-dark md:text-body-l md:leading-[22px]"
              >
                {initials}
              </span>
              <div className="flex grow flex-col gap-[6px]">
                <p className="text-[15px] leading-5 font-semibold text-text md:text-body-l md:leading-body">{post.author}</p>
                {post.authorRole && (
                  <p className="text-caption text-text-muted md:text-body-s md:leading-5">{post.authorRole}, Flash Weather AI</p>
                )}
                {post.authorBio && <p className="pt-1 text-caption text-text md:text-[15px] md:leading-6">{post.authorBio}</p>}
              </div>
              {post.authorFigure && (
                <figure className="flex w-full shrink-0 flex-col gap-2 sm:w-[236px]">
                  <div className="relative aspect-[236/150] overflow-hidden rounded-[14px] border border-border-on-dark bg-brand-navy">
                    <Image
                      src={post.authorFigure.image.src}
                      alt={post.authorFigure.image.alt}
                      fill
                      sizes="(min-width: 480px) 236px, 100vw"
                      className="object-cover"
                    />
                    <div aria-hidden className="blog-figure-grade absolute inset-0" />
                    <figcaption className="absolute bottom-3 left-[14px] text-micro font-extrabold text-white">
                      {post.authorFigure.label}
                    </figcaption>
                  </div>
                </figure>
              )}
            </section>
          </article>

          <ArticleRail readNext={readNext} sources={post.sources ?? []} showProducts={!post.noPromotion} />
        </div>

      </main>
      <SiteFooter cta={!post.noPromotion} />
    </>
  );
}
