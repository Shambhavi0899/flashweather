import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { FaqList } from '@/components/blog/faq-list';
import { PhotoPanel } from '@/components/blog/photo-panel';
import { TocDisclosure, TocSidebar } from '@/components/blog/toc';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { HeroBackground, HeroSection, HeroWords } from '@/components/hero/hero';
import { OutlookChart } from '@/components/heat-policy/outlook-chart';
import { PolicyRail } from '@/components/heat-policy/policy-rail';
import { ThresholdTable } from '@/components/heat-policy/threshold-table';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { getHeatPolicy, heatPolicies } from '@/content/heat-policies';
import { JsonLd, articleSchema, faqSchema, tableSchema } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';
import { absoluteUrl } from '@/lib/seo/site';

/**
 * One template, every state heat policy. A state is an entry in
 * `content/heat-policies.ts`.
 */

type Params = { state: string };

export function generateStaticParams(): Params[] {
  return heatPolicies.map((policy) => ({ state: policy.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { state } = await params;
  const policy = getHeatPolicy(state);
  if (!policy) return {};

  return buildMetadata({
    title: policy.title,
    description: policy.description,
    path: `/resources/state-heat-policies/${policy.slug}/`,
    type: 'article',
    modifiedTime: policy.verified,
  });
}

const h2 = 'text-[26px] leading-[32px] font-extrabold tracking-[-0.03em] text-text md:text-h2 md:leading-h2';

export default async function HeatPolicyPage({ params }: { params: Promise<Params> }) {
  const { state } = await params;
  const policy = getHeatPolicy(state);
  if (!policy) notFound();

  const path = `/resources/state-heat-policies/${policy.slug}/`;
  const toc = [
    { id: 'what-ghsa-requires', label: `What ${policy.association} requires` },
    { id: 'threshold-table', label: 'The threshold table' },
    { id: 'where-flash-fits', label: 'Where Flash fits' },
    { id: 'planning-day', label: 'A planning day' },
    { id: 'documentation', label: 'Documentation' },
    { id: 'other-states', label: 'Other states' },
    { id: 'sources', label: 'Sources' },
    { id: 'faq', label: 'FAQ' },
  ];
  const article = articleSchema({
    title: policy.headline,
    description: policy.description,
    path,
    published: policy.verified,
    modified: policy.verified,
  });

  return (
    <>
      <SiteHeader tone="dark" />
      <main id="main">
        <JsonLd
          schema={{
            ...(article as Record<string, unknown>),
            // The byline is the Flash Meteorology Desk, not a named person.
            author: { '@type': 'Organization', name: 'Flash Meteorology Desk', parentOrganization: { '@id': absoluteUrl('/#organization') } },
            citation: {
              '@type': 'CreativeWork',
              name: policy.ruleName,
              publisher: { '@type': 'Organization', name: policy.associationName, url: policy.associationUrl },
            },
          } as unknown as typeof article}
        />
        <JsonLd schema={tableSchema({ name: policy.table.heading, about: policy.table.caption, path })} />
        <JsonLd schema={faqSchema(policy.faqs)} />

        {/* Hero */}
        <HeroSection theme="dark" className="relative overflow-hidden border-b border-white/15 bg-brand-navy">
          <HeroBackground>
            <Image
              src={policy.hero.src}
              alt={policy.hero.alt}
              fill
              preload
              sizes="100vw"
              className="object-cover object-[50%_55%] opacity-90"
            />
          </HeroBackground>
          <div aria-hidden className="heat-policy-hero-grade-side absolute inset-0" />
          <div aria-hidden className="heat-policy-hero-grade-bottom absolute inset-0" />
          <div className="relative container-page flex flex-col gap-12 pt-12 pb-14 lg:flex-row lg:items-start lg:justify-between lg:gap-16 lg:pt-[88px] lg:pb-16">
            <div className="hero-copy flex max-w-[800px] flex-col">
              <Breadcrumbs
                tone="dark"
                className="hero-crumbs"
                trail={[
                  { name: 'Home', path: '/' },
                  { name: `${policy.state} heat policy`, path },
                ]}
              />
              <p className="hero-eyebrow mt-6 text-micro font-bold tracking-[0.13em] text-viz-gold uppercase">
                {policy.eyebrow}
              </p>
              <h1 className="mt-5 text-[34px] leading-[38px] font-extrabold tracking-[-0.04em] text-white sm:text-[42px] sm:leading-[46px] lg:text-[52px] lg:leading-[56px] lg:tracking-[-0.05em]">
                <HeroWords text={policy.headline} />
              </h1>
              <p className="hero-lede mt-5 max-w-[720px] text-body-l leading-h4 text-[#D1DBE8]">{policy.intro}</p>
              <p className="hero-support mt-5 text-caption text-text-on-dark-muted">{policy.byline}</p>
            </div>
            <div className="hero-visual hero-visual-side w-full max-w-[384px] shrink-0 lg:mt-14">
              <OutlookChart outlook={policy.outlook} />
            </div>
          </div>
        </HeroSection>

        <div className="mx-auto grid w-full max-w-page grid-cols-1 gap-12 px-4 pt-10 pb-20 md:px-10 md:pt-14 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-8 xl:grid-cols-[240px_minmax(0,760px)_280px] xl:px-12">
          <div className="hidden xl:block">
            <TocSidebar label="On this page" items={toc} />
          </div>

          <article className="flex min-w-0 flex-col gap-14">
            <TocDisclosure label="On this page" items={toc} />

            {/* What the association requires */}
            <section id="what-ghsa-requires" aria-labelledby="what-ghsa-requires-heading" className="flex scroll-mt-6 flex-col gap-4">
              <h2 id="what-ghsa-requires-heading" className={h2}>
                {policy.requires.heading}
              </h2>
              {policy.requires.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-body text-text">
                  {paragraph}
                </p>
              ))}
              <ul className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
                {policy.requires.cards.map((card) => (
                  <li key={card.title} className="flex flex-col gap-[6px] rounded-md bg-surface-sunken px-[18px] py-4">
                    <h3 className="text-body-s leading-5 font-semibold text-text">{card.title}</h3>
                    <p className="text-body-s text-text-muted">{card.body}</p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Threshold table */}
            <section id="threshold-table" aria-labelledby="threshold-table-heading" className="flex scroll-mt-6 flex-col gap-4">
              <h2 id="threshold-table-heading" className={h2}>
                {policy.table.heading}
              </h2>
              <p className="text-body text-text">{policy.table.intro}</p>
              <ThresholdTable table={policy.table} />
            </section>

            {/* Where Flash fits */}
            <section id="where-flash-fits" aria-labelledby="where-flash-fits-heading" className="flex scroll-mt-6 flex-col gap-6">
              <h2 id="where-flash-fits-heading" className={h2}>
                {policy.flashFits.heading}
              </h2>
              <p className="rounded-r-[12px] border-l-[3px] border-brand-blue bg-surface-sunken px-5 py-[22px] text-body-l leading-h4 font-medium text-text sm:px-7">
                {policy.flashFits.callout}
              </p>
              <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {policy.flashFits.points.map((point) => (
                  <li key={point.title} className="flex flex-col gap-2 border-t border-border-strong pt-4">
                    <h3 className="text-body leading-6 font-semibold text-text">{point.title}</h3>
                    <p className="text-body-s text-text-muted">{point.body}</p>
                    {point.link && (
                      <Link href={point.link.href} className="text-caption font-semibold text-brand-blue hover:underline">
                        {point.link.label} <span aria-hidden>→</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
              <p className="flex flex-col gap-1 pt-1 sm:flex-row sm:items-center sm:gap-3">
                <Link
                  href={policy.flashFits.link.href}
                  className="inline-flex min-h-11 items-center text-[15px] leading-body-s font-semibold text-brand-blue hover:underline"
                >
                  {policy.flashFits.link.label} <span aria-hidden>&nbsp;→</span>
                </Link>
                <span className="text-caption text-text-muted">{policy.flashFits.link.note}</span>
              </p>
            </section>

            {/* A planning day */}
            <section id="planning-day" aria-labelledby="planning-day-heading" className="flex scroll-mt-6 flex-col gap-4">
              <h2 id="planning-day-heading" className={h2}>
                {policy.planningDay.heading}
              </h2>
              <p className="text-micro leading-caption font-bold tracking-[0.13em] text-text-muted uppercase">
                {policy.planningDay.disclaimer}
              </p>
              <figure className="pt-[6px] pb-[10px]">
                <PhotoPanel
                  image={policy.planningDay.figure.image}
                  sizes="(min-width: 1024px) 760px, 100vw"
                  badge={policy.planningDay.figure.badge}
                  overlay={policy.planningDay.figure.overlay}
                  variant="figure"
                  className="aspect-[4/3] w-full sm:aspect-[760/260]"
                />
              </figure>
              <ol className="flex flex-col pt-1">
                {policy.planningDay.steps.map((step, i) => {
                  const last = i === policy.planningDay.steps.length - 1;
                  const dot =
                    step.tone === 'warning'
                      ? 'bg-alert-warning'
                      : step.tone === 'clear'
                        ? 'bg-alert-clear'
                        : 'bg-brand-blue';
                  return (
                    <li key={step.time} className="flex gap-4">
                      <p className="w-16 shrink-0 text-caption leading-body-s font-bold text-text sm:w-20">
                        <time>{step.time}</time>
                      </p>
                      <div
                        className={`relative grow pl-6 ${last ? 'border-l-2 border-transparent' : 'border-l-2 border-border pb-7'}`}
                      >
                        <span
                          aria-hidden
                          className={`absolute top-[5px] -left-[7px] size-3 rounded-full border-2 border-neutral-0 ${dot}`}
                        />
                        <p className="text-[15px] leading-body-s text-text">{step.text}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>

            {/* Documentation */}
            <section id="documentation" aria-labelledby="documentation-heading" className="flex scroll-mt-6 flex-col gap-4">
              <h2 id="documentation-heading" className={h2}>
                {policy.documentation.heading}
              </h2>
              <p className="text-body text-text">{policy.documentation.intro}</p>
              <ul className="flex flex-col border-t border-border">
                {policy.documentation.items.map((item) => (
                  <li key={item} className="flex items-start gap-[14px] border-b border-border py-[14px]">
                    <span aria-hidden className="mt-[2px] size-5 shrink-0 rounded-sm border-[1.5px] border-border-strong" />
                    <span className="text-[15px] leading-6 text-text">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Other states */}
            <section id="other-states" aria-labelledby="other-states-heading" className="flex scroll-mt-6 flex-col gap-4">
              <h2 id="other-states-heading" className={h2}>
                {policy.otherStates.heading}
              </h2>
              <p className="text-body text-text">{policy.otherStates.intro}</p>
              <figure className="pt-1 pb-2">
                <PhotoPanel
                  image={policy.otherStates.figure.image}
                  sizes="(min-width: 1024px) 760px, 100vw"
                  badge={policy.otherStates.figure.badge}
                  overlay={policy.otherStates.figure.overlay}
                  variant="figure"
                  className="aspect-[4/3] w-full sm:aspect-[760/200]"
                />
              </figure>
              <ul className="flex flex-wrap gap-[10px]">
                {policy.otherStates.states.map((other) => (
                  <li key={other.label}>
                    {other.href ? (
                      <Link
                        href={other.href}
                        className="flex h-11 items-center rounded-sm border border-border-strong px-4 text-body-s leading-5 font-medium text-text hover:bg-neutral-50"
                      >
                        {other.label}
                      </Link>
                    ) : (
                      <span className="flex h-9 items-center rounded-sm border border-border px-4 text-body-s leading-5 font-medium text-text-muted">
                        {other.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            {/* Sources */}
            <section id="sources" aria-labelledby="sources-heading" className="flex scroll-mt-6 flex-col gap-3">
              <h2 id="sources-heading" className={h2}>
                Sources
              </h2>
              <ol className="flex flex-col border-t border-border">
                {policy.sources.map((source, i) => (
                  <li key={source} className="flex gap-4 border-b border-border py-[14px]">
                    <span aria-hidden className="w-8 shrink-0 text-micro leading-6 font-semibold tracking-[0.1em] text-brand-blue">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[15px] leading-6 text-text">{source}</span>
                  </li>
                ))}
              </ol>
              <p className="text-caption text-text-muted">
                {policy.association} documents are published at{' '}
                <a href={policy.associationUrl} rel="noopener" className="font-semibold text-brand-blue hover:underline">
                  {policy.associationUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                </a>
                .
              </p>
            </section>

            <FaqList id="faq" heading="Frequently asked" faqs={policy.faqs} headingClassName={h2} />
          </article>

          <PolicyRail rail={policy.rail} />
        </div>

      </main>
      <SiteFooter />
    </>
  );
}
