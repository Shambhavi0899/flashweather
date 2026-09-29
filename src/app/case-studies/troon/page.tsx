import Image from 'next/image';
import Link from 'next/link';

import { BOLT_PATH } from '@/components/bolt-path';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ButtonLink } from '@/components/button';
import { HeroBackground, HeroSection, HeroWords } from '@/components/hero/hero';
import { PortfolioMap } from '@/components/case-study/portfolio-map';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { IllustrativeChip, Kicker, SectionHeading } from '@/components/why-flash/section-heading';
import { troon } from '@/content/case-studies';
import { DEMO_HREF } from '@/content/navigation';
import { links, whyFlashPages } from '@/content/why-flash';
import { buildMetadata } from '@/lib/seo/metadata';

const page = whyFlashPages.troon;

export const metadata = buildMetadata({
  title: page.title,
  description: page.description,
  path: page.path,
});

const cardShadow = 'shadow-[0_1px_2px_#0B13220D,0_12px_32px_#0B13220F]';

/** Related reading: the design's four, plus the rest of the Why Flash section. */
const related = [
  ...troon.related,
  { kind: 'Explainer', title: whyFlashPages.predictionVsSensors.label, href: whyFlashPages.predictionVsSensors.path },
  { kind: 'Method', title: whyFlashPages.accuracyMethod.label, href: whyFlashPages.accuracyMethod.path },
];

export default function TroonCaseStudyPage() {
  return (
    <>
      <SiteHeader tone="dark" />
      <main id="main">
        {/* Hero */}
        <HeroSection theme="dark" className="relative overflow-hidden bg-brand-navy">
          <HeroBackground storm>
            <Image
              src={troon.hero.src}
              alt={troon.hero.alt}
              fill
              preload
              sizes="100vw"
              className="object-cover opacity-55"
            />
          </HeroBackground>
          <div aria-hidden className="case-study-hero-grade absolute inset-0" />
          <div className="container-page relative flex flex-col gap-10 pt-10 pb-20 lg:pb-[104px]">
            {/* No /case-studies/ index exists yet, so the trail stops at the page itself. */}
            <Breadcrumbs
              tone="dark"
              className="hero-crumbs"
              trail={[
                { name: 'Home', path: '/' },
                { name: 'Case study: Troon', path: page.path },
              ]}
            />
            <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
              <div className="hero-copy flex flex-col gap-7 lg:w-[680px] lg:shrink xl:shrink-0">
                <p className="hero-eyebrow text-micro font-semibold tracking-label text-viz-gold uppercase">
                  {troon.eyebrow}
                </p>
                <h1 className="text-[38px] leading-[44px] font-extrabold tracking-[-0.05em] text-text-on-dark md:text-[60px] md:leading-16">
                  <HeroWords text={troon.headline} />
                </h1>
                <p className="hero-lede text-body-l text-[#C9D1E3] md:text-[19px]">{troon.intro}</p>
                <div className="hero-ctas flex flex-col gap-3 pt-1 sm:flex-row sm:gap-[14px]">
                  <ButtonLink href={DEMO_HREF} variant="gold" className="px-[30px]">
                    Book a demo
                  </ButtonLink>
                  <ButtonLink href={links.pricing.href} variant="outline-dark" className="px-[30px]">
                    See pricing
                  </ButtonLink>
                </div>
                <p className="hero-support text-caption leading-5 text-[#8F9AB8]">{troon.productsLine}</p>
              </div>

              <figure className="hero-visual hero-visual-side flex grow flex-col gap-5 rounded-[20px] border border-white/10 bg-[#040818B8] p-6 shadow-[0_30px_80px_#00000073] md:p-8">
                <span aria-hidden className="h-[2px] w-10 bg-viz-gold" />
                <blockquote className="text-[20px] leading-[30px] font-medium tracking-heading text-text-on-dark md:text-[22px] md:leading-[32px]">
                  <p>“{troon.heroQuote.quote}”</p>
                </blockquote>
                <figcaption className="flex flex-col gap-1">
                  <span className="text-[15px] leading-5 font-semibold text-text-on-dark">{troon.heroQuote.name}</span>
                  <span className="text-body-s leading-5 text-[#C9D1E3]">{troon.heroQuote.role}</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </HeroSection>

        {/* Facts + narrative */}
        <section aria-label="The Troon rollout" className="bg-neutral-0">
          <div className="container-page flex flex-col gap-12 py-20 lg:flex-row lg:items-start lg:gap-16 lg:py-28">
            <aside aria-label="At a glance" className="rounded-lg bg-surface-sunken px-7 pt-7 pb-3 lg:w-[360px] lg:shrink xl:shrink-0">
              <p className="pb-2 text-[11px] leading-[14px] font-semibold tracking-label text-text-muted uppercase">
                At a glance
              </p>
              <dl>
                {troon.atAGlance.map((fact, i) => (
                  <div
                    key={fact.label}
                    className={`flex flex-col gap-1 py-[14px] ${i < troon.atAGlance.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    <dt className="text-[10px] leading-3 font-semibold tracking-label text-text-muted uppercase">
                      {fact.label}
                    </dt>
                    <dd className="text-body leading-6 font-medium text-text">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </aside>

            <div className="flex flex-col gap-10 lg:w-narrow lg:shrink xl:shrink-0">
              {troon.narrative.map((block, b) => (
                <div key={block.heading} className="flex flex-col gap-4">
                  <h2 className="text-[26px] leading-[32px] font-extrabold tracking-[-0.03em] text-text md:text-h2 md:leading-h2">
                    {block.heading}
                  </h2>
                  {block.paragraphs.map((p) =>
                    b === troon.narrative.length - 1 ? (
                      <p key={p.slice(0, 24)} className="text-body text-text">
                        {p.split('the Flash API')[0]}
                        <Link href={links.api.href} className="font-semibold text-brand-blue hover:underline">
                          the Flash API
                        </Link>
                        {p.split('the Flash API')[1]}
                      </p>
                    ) : (
                      <p key={p.slice(0, 24)} className="text-body text-text">
                        {p}
                      </p>
                    ),
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it reaches superintendents */}
        <section aria-labelledby="two-screens" className="bg-brand-navy">
          <div className="container-page flex flex-col gap-12 py-20 lg:py-28">
            <div className="flex flex-col gap-[14px]">
              <Kicker tone="dark">How it reaches superintendents</Kicker>
              {/* A section label in the design's type, not an outline heading. */}
              <p
                id="two-screens"
                className="max-w-[820px] text-[28px] leading-[34px] font-extrabold tracking-[-0.03em] text-text-on-dark md:text-h1 md:leading-h1"
              >
                One forecast, two screens, the same call.
              </p>
              <p className="max-w-narrow text-[17px] leading-h4 text-text-on-dark-muted">
                The general manager watches the portfolio; the superintendent and the crew carry the same cell in their
                pocket. Both read the same 1×1 km forecast, refreshed every 2 minutes, so a horn never sounds for a
                different reason than the app.
              </p>
            </div>
            <ul className="grid gap-6 lg:grid-cols-2">
              {troon.screens.map((screen) => (
                <li
                  key={screen.badge}
                  className="flex flex-col overflow-hidden rounded-lg border border-white/10 bg-[#040818B8]"
                >
                  <div className="relative aspect-[612/330] bg-brand-navy-deep">
                    <Image
                      src={screen.image.src}
                      alt={screen.image.alt}
                      fill
                      sizes="(min-width: 1440px) 612px, (min-width: 1024px) 46vw, 100vw"
                      className="object-cover"
                    />
                    <div aria-hidden className="case-study-screen-grade absolute inset-0" />
                    <p className="absolute top-4 left-4 flex h-6 items-center rounded-[12px] bg-[#040818C7] px-[10px] text-[10px] leading-3 font-extrabold tracking-[0.13em] text-viz-gold uppercase">
                      {screen.badge}
                    </p>
                    <h3 className="absolute bottom-4 left-4 text-body leading-body-s font-extrabold tracking-heading text-white">
                      {screen.caption}
                    </h3>
                  </div>
                  <div className="flex flex-col gap-2 px-6 pt-5 pb-6">
                    <p className="text-micro font-bold tracking-[0.13em] text-text-on-dark-muted uppercase">{screen.role}</p>
                    <p className="text-[15px] leading-6 text-neutral-300">{screen.body}</p>
                    <Link
                      href={screen.link.href}
                      className="inline-flex min-h-11 items-center text-body-s font-semibold text-viz-gold hover:underline"
                    >
                      {screen.link.label}&nbsp;<span aria-hidden>→</span>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
            <p className="text-micro leading-caption text-text-on-dark-muted">
              Product imagery. Illustrative example, not live weather.
            </p>
          </div>
        </section>

        {/* Portfolio map */}
        <div className="bg-neutral-0 pt-20 pb-20 lg:pt-0">
          <div className="container-page">
            <PortfolioMap alt={troon.map.alt} log={troon.map.log} />
          </div>
        </div>

        {/* Ask Flash */}
        <section aria-labelledby="just-asks" className="bg-brand-navy">
          <div className="container-page flex flex-col gap-12 py-20 lg:flex-row lg:items-center lg:gap-16 lg:py-[104px]">
            <div className="flex flex-col gap-[18px] lg:w-panel lg:shrink xl:shrink-0">
              <SectionHeading id="just-asks" kicker="Ask Flash · Flash Agent" tone="dark">
                What happens when the general manager just asks?
              </SectionHeading>
              <p className="text-body text-[#C9D1E3]">{troon.agent.body}</p>
              <Link
                href={links.agent.href}
                className="inline-flex min-h-11 items-center text-body-s leading-caption font-semibold text-viz-gold hover:underline"
              >
                See Flash Agent&nbsp;<span aria-hidden>→</span>
              </Link>
            </div>

            <figure
              aria-label="Illustrative Flash Agent conversation, not live weather"
              className="flex grow flex-col gap-[14px] rounded-[20px] border border-white/10 bg-[#040818B8] p-5 md:p-7"
            >
              <IllustrativeChip tone="dark" />
              <div className="flex justify-end">
                <p className="max-w-panel rounded-t-lg rounded-br-xs rounded-bl-lg bg-white/8 px-[18px] py-[14px] text-[15px] leading-body-s text-white">
                  {troon.agent.question}
                </p>
              </div>
              <div className="flex gap-3">
                <span aria-hidden className="bg-gold-metallic flex size-8 shrink-0 items-center justify-center rounded-full">
                  <svg width="12" height="16" viewBox="0 0 26 34">
                    <path d={BOLT_PATH} fill="#070D26" />
                  </svg>
                </span>
                <div className="flex max-w-[560px] flex-col gap-[10px]">
                  <p className="text-[15px] leading-[23px] text-[#DCE2F0]">{troon.agent.answer}</p>
                  <ul className="flex flex-wrap gap-2">
                    {troon.agent.actions.map((action) => (
                      <li
                        key={action}
                        className="flex h-[26px] items-center rounded-sm border border-[#128A5E80] bg-[#128A5E2E] px-[10px] text-micro font-medium text-[#5FD3A3]"
                      >
                        {action}
                      </li>
                    ))}
                    <li className="flex h-[26px] items-center rounded-sm border border-white/15 px-[10px] text-micro font-medium text-text-on-dark-muted">
                      {troon.agent.source}
                    </li>
                  </ul>
                </div>
              </div>
              <div
                aria-hidden
                className="mt-[6px] flex items-center gap-3 rounded-full border border-white/12 py-[10px] pr-[10px] pl-4"
              >
                <span className="grow text-[15px] leading-caption text-[#6F7A99]">Ask about any property, any day…</span>
                <span className="bg-gold-button flex h-[34px] items-center rounded-full px-4 text-caption leading-micro font-extrabold text-brand-navy">
                  Ask
                </span>
              </div>
            </figure>
          </div>
        </section>

        {/* Scope of deployment */}
        <section aria-labelledby="in-numbers" className="border-t border-border bg-surface-sunken">
          <div className="container-page flex flex-col gap-8 py-20 lg:py-28">
            <div className="flex flex-col gap-3">
              <SectionHeading id="in-numbers" kicker="Scope of deployment" className="max-w-[900px]">
                What is running today, in numbers we can stand behind
              </SectionHeading>
              <p className="max-w-narrow text-[15px] leading-body-s text-text-muted">
                These are deployment facts, not outcome percentages. Flash publishes no downtime or loss figures for
                Troon; the per-event log is the evidence.
              </p>
            </div>
            <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {troon.stats.map((stat) => (
                <div
                  key={stat.value}
                  className={`flex flex-col-reverse justify-end gap-2 rounded-[20px] border border-border bg-neutral-0 p-6 ${cardShadow}`}
                >
                  <dt className="text-[15px] leading-body-s text-text-muted">{stat.label}</dt>
                  <dd className="text-display-m leading-display-m font-bold tracking-[-0.03em] text-text">{stat.value}</dd>
                </div>
              ))}
            </dl>
            <p className="text-body-s text-text-muted">
              How 99.6% is scored:{' '}
              <Link href={whyFlashPages.accuracyMethod.path} className="font-semibold text-brand-blue hover:underline">
                the accuracy method
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Proof bar */}
        <section aria-label="Trusted on the field" className="border-y border-border bg-neutral-0">
          <div className="container-page flex flex-col lg:flex-row">
            <div className="flex flex-col justify-center gap-2 border-b border-border py-7 lg:w-[204px] lg:shrink xl:shrink-0 lg:border-r lg:border-b-0 lg:pr-8">
              <p className="text-[11px] leading-[14px] font-semibold tracking-label text-text-muted uppercase">
                Trusted on the field
              </p>
              <p className="text-body-s text-text">Named customers, named use.</p>
            </div>
            <ul className="grid grow sm:grid-cols-2 lg:grid-cols-4">
              {troon.proof.map((item, i) => (
                <li
                  key={item.name}
                  className={`flex flex-col justify-center gap-[6px] border-border py-7 lg:px-8 ${
                    i < troon.proof.length - 1 ? 'border-b sm:border-b-0 lg:border-r' : ''
                  } ${i === troon.proof.length - 1 ? 'lg:pr-0' : ''}`}
                >
                  <p className="text-h4 leading-6 font-bold tracking-[0.02em] text-brand-navy uppercase">{item.name}</p>
                  <p className="text-caption text-text-muted">{item.use}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Testimonials */}
        <section aria-labelledby="in-their-words" className="bg-surface-sunken">
          <div className="container-page flex flex-col gap-7 py-20 lg:py-28">
            <SectionHeading id="in-their-words" kicker="In their words · Golf customers" className="max-w-[900px]">
              What golf operators say about running Flash
            </SectionHeading>
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
              <div className="relative h-[360px] shrink-0 overflow-hidden rounded-lg bg-neutral-900 lg:h-[548px] lg:w-[472px]">
                <Image
                  src={troon.testimonialPhoto.src}
                  alt={troon.testimonialPhoto.alt}
                  fill
                  sizes="(min-width: 1024px) 472px, 100vw"
                  className="object-cover"
                />
                <div aria-hidden className="case-study-photo-grade absolute inset-0" />
                <div className="absolute inset-x-5 bottom-5 flex flex-col gap-[6px]">
                  <p className="text-micro font-bold tracking-[0.13em] text-viz-gold uppercase">The call before the horn</p>
                  <p className="text-[15px] leading-body-s text-white">
                    Play is cleared on a forecast, not on a flash that already landed.
                  </p>
                </div>
              </div>
              <ul className="flex grow flex-col gap-6">
                {troon.testimonials.map((t) => (
                  <li key={t.name + t.quote.slice(0, 12)}>
                    <figure className={`flex flex-col gap-5 rounded-[20px] border border-border bg-neutral-0 p-6 md:p-8 ${cardShadow}`}>
                      <span aria-hidden className="h-[3px] w-10 bg-brand-blue" />
                      <blockquote className="text-h4 leading-body-l text-text">
                        <p>“{t.quote}”</p>
                      </blockquote>
                      <figcaption className="flex flex-col gap-[2px]">
                        <span className="text-[15px] leading-body-s font-semibold text-text">{t.name}</span>
                        <span className="text-body-s leading-5 text-text-muted">{t.role}</span>
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Other sports */}
        <section aria-labelledby="same-standard" className="bg-brand-navy">
          <div className="container-page flex flex-col gap-7 py-20 lg:py-28">
            <SectionHeading id="same-standard" kicker="Same standard, other sports" tone="dark" className="max-w-[960px]">
              The same lightning decision standard runs game days and championships
            </SectionHeading>
            <ul className="grid gap-10 lg:grid-cols-2 lg:gap-6">
              {troon.otherSports.map((item) => (
                <li key={item.name} className="flex flex-col gap-2 border-t border-border-on-dark pt-5">
                  <div className="relative mb-2 aspect-[612/188] overflow-hidden rounded-[12px] bg-brand-navy-deep">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      sizes="(min-width: 1440px) 612px, (min-width: 1024px) 46vw, 100vw"
                      className="object-cover"
                    />
                    <div aria-hidden className="case-study-card-grade absolute inset-0" />
                  </div>
                  <h3 className="text-body leading-6 font-bold tracking-heading text-text-on-dark uppercase md:text-h4 md:leading-[26px]">
                    {item.name}
                  </h3>
                  <p className="text-[15px] leading-body-s text-text-on-dark-muted">{item.body}</p>
                  <Link
                    href={links.schools.href}
                    className="inline-flex min-h-11 items-center text-body-s leading-5 font-semibold text-text-on-dark hover:underline"
                  >
                    Schools &amp; athletics&nbsp;<span aria-hidden>→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Related */}
        <nav aria-label="Related reading" className="bg-neutral-0">
          <div className="container-page flex flex-col gap-6 py-20 lg:py-28">
            <Kicker>Related · Keep reading</Kicker>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item.href} className="border-t-2 border-border-strong pt-5">
                  <Link href={item.href} className="group flex flex-col gap-[6px]">
                    <span className="text-[10px] leading-3 font-semibold tracking-label text-text-muted uppercase">
                      {item.kind}
                    </span>
                    <span className="text-body-l leading-body font-semibold text-text group-hover:text-brand-blue">
                      {item.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="flex flex-wrap gap-x-6 border-t border-border pt-4">
              {[links.commandCenter, links.api, links.agent, links.schools].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center text-body-s font-semibold text-brand-blue hover:underline"
                  >
                    {item.label === 'API offerings' ? 'API offerings and integrations' : item.label}&nbsp;
                    <span aria-hidden>→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

      </main>
      <SiteFooter />
    </>
  );
}
