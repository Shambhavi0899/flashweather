import Image from 'next/image';
import Link from 'next/link';

import { BOLT_PATH } from '@/components/bolt-path';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ButtonLink } from '@/components/button';
import { HeroBackground, HeroSection, HeroWords } from '@/components/hero/hero';
import { Eyebrow } from '@/components/eyebrow';
import { HubRuns } from '@/components/resources/hub-runs';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { whyFlashOrder, whyFlashPages } from '@/content/why-flash';
import {
  WHY_FLASH_HUB_PATH,
  category,
  closing,
  comparison,
  deeper,
  everyday,
  hero,
  operation,
  receipts,
  whyFlashCtas,
  whyFlashHub,
} from '@/content/why-flash-hub';
import { JsonLd, itemListSchema } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: whyFlashHub.title,
  description: whyFlashHub.description,
  path: WHY_FLASH_HUB_PATH,
});

const deepPages = whyFlashOrder.map((key) => whyFlashPages[key]);

const h2 =
  'text-[30px] leading-[36px] font-extrabold tracking-[-0.04em] md:text-[40px] md:leading-[46px] lg:text-[44px] lg:leading-[50px]';

/**
 * The Why Flash hub: the live page's argument, verbatim, then a card into
 * each page of the section. Every page under /why-flash/ links back here
 * through its breadcrumb.
 */
export default function WhyFlashPage() {
  return (
    <>
      <SiteHeader tone="dark" />
      <main id="main">
        <JsonLd schema={itemListSchema(deepPages.map((page) => ({ name: page.label, path: page.path })))} />

        {/* Hero */}
        <HeroSection theme="dark" className="relative overflow-hidden bg-brand-navy">
          <HeroBackground storm>
            <Image
              src="/images/why-flash/flash-storm-shelf-cloud-before-first-strike.jpg"
              alt=""
              fill
              preload
              sizes="100vw"
              className="object-cover opacity-60"
            />
          </HeroBackground>
          <div aria-hidden className="why-flash-hub-hero-grade absolute inset-0" />
          <div className="hero-copy container-page relative flex flex-col gap-6 pt-10 pb-20 lg:pb-[120px]">
            <Breadcrumbs
              tone="dark"
              className="hero-crumbs"
              trail={[
                { name: 'Home', path: '/' },
                { name: 'Why Flash', path: WHY_FLASH_HUB_PATH },
              ]}
            />
            <h1 className="flex max-w-[1100px] flex-col gap-5 pt-6 lg:pt-14">
              <span className="hero-eyebrow text-micro font-bold tracking-label-wide text-viz-gold uppercase">
                {hero.kicker}
              </span>{' '}
              <span className="text-[38px] leading-[44px] font-extrabold tracking-[-0.05em] text-text-on-dark md:text-display-l md:leading-display-l lg:text-display-xl lg:leading-display-xl">
                <HeroWords text={hero.headline} />
              </span>
            </h1>
            <p className="hero-lede max-w-[720px] text-body-l text-pretty text-[#C9D1E3] md:text-[19px]">{hero.body}</p>
            <div className="hero-ctas flex flex-col gap-3 pt-2 sm:flex-row sm:gap-[14px]">
              <ButtonLink href={whyFlashCtas.demo.href} variant="gold" className="px-[30px]">
                {whyFlashCtas.demo.label}
              </ButtonLink>
              <ButtonLink href={whyFlashCtas.app.href} variant="outline-dark" className="px-[30px]" icon="↗">
                {whyFlashCtas.app.label}
              </ButtonLink>
            </div>
          </div>
        </HeroSection>

        {/* Three kinds of weather tools */}
        <section aria-labelledby="three-kinds" className="bg-neutral-0">
          <div className="container-page flex flex-col gap-10 py-20 lg:gap-14 lg:py-28">
            <div className="flex max-w-[980px] flex-col gap-4">
              <Eyebrow tone="light">{category.kicker}</Eyebrow>
              <h2 id="three-kinds" className={`${h2} text-text`}>
                {category.heading}
              </h2>
            </div>
            <ol className="grid gap-6 lg:grid-cols-3">
              {category.kinds.map((kind) => (
                <li
                  key={kind.name}
                  className={`flex flex-col gap-4 rounded-lg p-7 md:p-8 ${
                    kind.flash ? 'why-flash-hub-flash-card text-text-on-dark' : 'border border-border bg-surface-sunken'
                  }`}
                >
                  {kind.flash && (
                    <svg width="22" height="29" viewBox="0 0 26 34" aria-hidden className="shrink-0">
                      <path d={BOLT_PATH} fill="var(--color-viz-gold)" />
                    </svg>
                  )}
                  <h3
                    className={`text-h3 leading-h3 font-extrabold tracking-heading ${
                      kind.flash ? 'text-text-on-dark' : 'text-text'
                    }`}
                  >
                    {kind.name}
                  </h3>
                  <p className={`text-body ${kind.flash ? 'text-[#C9D1E3]' : 'text-text-muted'}`}>{kind.body}</p>
                </li>
              ))}
            </ol>
            <p className="max-w-[900px] text-body-l font-semibold text-pretty text-text md:text-[22px] md:leading-[32px]">
              {category.closing}
            </p>
          </div>
        </section>

        {/* Everyone else vs Flash */}
        <section aria-labelledby="reacts-predicts" className="bg-brand-navy">
          <div className="container-page flex flex-col gap-10 py-20 lg:gap-14 lg:py-28">
            <div className="flex max-w-[900px] flex-col gap-4">
              <Eyebrow>{comparison.kicker}</Eyebrow>
              <h2 id="reacts-predicts" className={`${h2} text-text-on-dark`}>
                {comparison.heading}
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-5 rounded-lg border border-white/12 p-7 md:p-8">
                <h3 className="text-micro font-bold tracking-label-wide text-text-on-dark-muted uppercase">
                  {comparison.others.label}
                </h3>
                <ul className="flex flex-col">
                  {comparison.others.rows.map((row) => (
                    <li
                      key={row}
                      className="flex gap-3 border-t border-white/10 py-4 text-body text-text-on-dark-muted first:border-t-0 first:pt-0"
                    >
                      <span aria-hidden className="w-4 shrink-0 font-bold text-neutral-500">
                        ×
                      </span>
                      {row}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="why-flash-hub-win-card flex flex-col gap-5 rounded-lg p-7 md:p-8">
                <h3 className="font-logo text-caption font-bold tracking-label-wide text-viz-gold uppercase">
                  {comparison.flash.label}
                </h3>
                <ul className="flex flex-col">
                  {comparison.flash.rows.map((row) => (
                    <li
                      key={row}
                      className="flex gap-3 border-t border-white/10 py-4 text-body font-semibold text-text-on-dark first:border-t-0 first:pt-0"
                    >
                      <span aria-hidden className="w-4 shrink-0 font-bold text-viz-gold">
                        ✓
                      </span>
                      {row}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-body-l font-semibold text-text-on-dark">{comparison.tagline}</p>
          </div>
        </section>

        {/* The receipts */}
        <section aria-labelledby="receipts" className="bg-surface-sunken">
          <div className="container-page flex flex-col gap-10 py-20 lg:gap-14 lg:py-28">
            <div className="flex max-w-[900px] flex-col gap-4">
              <Eyebrow tone="light">{receipts.kicker}</Eyebrow>
              <h2 id="receipts" className={`${h2} text-text`}>
                {receipts.heading}
              </h2>
            </div>
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-3">
              {receipts.stats.map((stat) => (
                <div key={stat.value} className="flex flex-col-reverse gap-2 bg-neutral-0 p-5 md:p-8">
                  <dt className="text-body-s text-text-muted">{stat.label}</dt>
                  <dd className="text-[34px] leading-[40px] font-extrabold tracking-display text-brand-navy md:text-display-m md:leading-display-m">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="flex max-w-[900px] flex-col gap-5">
              <p className="text-body-l text-pretty text-text">
                <HubRuns runs={receipts.proof} />
              </p>
              <p className="text-body text-pretty text-text-muted">{receipts.founder}</p>
            </div>
          </div>
        </section>

        {/* For your operation */}
        <section aria-labelledby="for-your-operation" className="bg-neutral-0">
          <div className="container-page grid gap-12 py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16 lg:py-28">
            <div className="flex flex-col gap-6">
              <Eyebrow tone="light">{operation.kicker}</Eyebrow>
              <h2 id="for-your-operation" className={`${h2} text-text`}>
                {operation.heading}
              </h2>
              <p className="text-body-l text-pretty text-text-muted">{operation.body}</p>
              <dl className="grid grid-cols-2 gap-6 border-y border-border py-6">
                {operation.outcomes.map((outcome) => (
                  <div key={outcome.value} className="flex flex-col-reverse gap-1">
                    <dt className="text-body-s text-text-muted">{outcome.label}</dt>
                    <dd className="text-[30px] leading-[36px] font-extrabold tracking-display text-brand-blue md:text-[36px] md:leading-[42px]">
                      {outcome.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="text-body text-text">{operation.outcomeNote}</p>
              <ul aria-label="Who it is for" className="flex flex-wrap gap-2">
                {operation.audiences.map((audience) => (
                  <li
                    key={audience}
                    className="flex min-h-9 items-center rounded-full border border-border-strong px-4 text-body-s font-medium text-text"
                  >
                    {audience}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-6">
              <ul className="flex flex-col rounded-lg border border-border">
                {operation.products.map((product) => (
                  <li key={product.name} className="border-t border-border p-6 first:border-t-0">
                    <p className="text-body text-text-muted">
                      {product.href ? (
                        <Link href={product.href} className="font-bold text-brand-blue hover:underline">
                          {product.name}
                        </Link>
                      ) : (
                        <strong className="font-bold text-text">{product.name}</strong>
                      )}{' '}
                      – {product.body}
                    </p>
                  </li>
                ))}
              </ul>
              <div>
                <ButtonLink href={whyFlashCtas.demo.href} variant="blue" className="px-[30px]">
                  {whyFlashCtas.demo.label}
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>

        {/* For everyday life */}
        <section aria-labelledby="for-everyday-life" className="why-flash-hub-everyday">
          <div className="container-page flex flex-col gap-6 py-20 lg:py-28">
            <Eyebrow>{everyday.kicker}</Eyebrow>
            <h2 id="for-everyday-life" className={`${h2} max-w-[900px] text-text-on-dark`}>
              {everyday.heading}
            </h2>
            <p className="max-w-[760px] text-body-l text-pretty text-[#C9D1E3]">{everyday.body}</p>
            <div>
              <ButtonLink href={whyFlashCtas.app.href} variant="gold" className="px-[30px]" icon="↗">
                {whyFlashCtas.app.label}
              </ButtonLink>
            </div>
          </div>
        </section>

        {/* Into the section */}
        <section aria-labelledby="go-deeper" className="bg-neutral-0">
          <div className="container-page flex flex-col gap-10 py-20 lg:py-28">
            <div className="flex max-w-[900px] flex-col gap-4">
              <Eyebrow tone="light">{deeper.kicker}</Eyebrow>
              <h2 id="go-deeper" className={`${h2} text-text`}>
                {deeper.heading}
              </h2>
            </div>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {deepPages.map((page) => (
                <li key={page.path}>
                  <Link
                    href={page.path}
                    className="group flex h-full flex-col gap-3 rounded-lg border border-border bg-surface-sunken p-6 transition hover:border-brand-blue"
                  >
                    <h3 className="text-h4 leading-h4 font-extrabold tracking-heading text-text group-hover:text-brand-blue">
                      {page.label}
                    </h3>
                    <p className="grow text-body-s text-text-muted">{page.blurb}</p>
                    <span className="inline-flex min-h-11 items-center text-body-s font-bold text-brand-blue">
                      Read<span aria-hidden>&nbsp;→</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      {/* The hub closes on its own line; the band carries it. */}
      <SiteFooter heading={closing.heading} body={closing.body} />
    </>
  );
}
