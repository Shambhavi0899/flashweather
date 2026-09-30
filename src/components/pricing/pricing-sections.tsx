import Image from 'next/image';
import Link from 'next/link';

import { Breadcrumbs } from '@/components/breadcrumbs';
import { ButtonLink } from '@/components/button';
import { HeroBackground, HeroSection, HeroWords } from '@/components/hero/hero';
import { FaqAccordion } from '@/components/faq/faq-accordion';
import { Bolt } from '@/components/logo';
import { Motion } from '@/components/motion';
import { LinkedText } from '@/components/pricing/linked-text';
import { PlanFit } from '@/components/pricing/plan-fit';
import { QuoteBuilder } from '@/components/pricing/quote-builder';
import { SensorCostFigure } from '@/components/pricing/sensor-cost-figure';
import { SurfaceFocus } from '@/components/pricing/surface-focus';
import { PortfolioCard } from '@/components/pricing/portfolio-card';
import { DEMO_HREF } from '@/content/navigation';
import {
  alwaysIncluded,
  includedSurfaces,
  portfolioSites,
  pricingFaqs,
  quoteFactors,
  sensorComparison,
} from '@/content/pricing';

const h2 = 'text-[32px] leading-[38px] font-extrabold tracking-[-0.03em] md:text-h1 md:leading-h1';
const eyebrow = 'text-micro font-bold tracking-[0.13em] uppercase';

export function PricingHero() {
  return (
    <HeroSection theme="dark" className="relative overflow-hidden bg-brand-navy">
      <HeroBackground storm>
        <Image
          src="/images/pricing/flash-pricing-hero-lightning-over-open-ground.png"
          alt="Cloud-to-ground lightning striking open ground at dusk, the risk Flash Weather AI prices per site rather than per sensor"
          fill
          preload
          sizes="100vw"
          className="object-cover object-[50%_45%] opacity-90"
        />
      </HeroBackground>
      <div aria-hidden className="pricing-hero-grade-left absolute inset-0" />
      <div aria-hidden className="pricing-hero-grade-bottom absolute inset-0" />

      <div className="container-page relative flex flex-col gap-12 pt-12 pb-16 lg:flex-row lg:items-center lg:gap-16 lg:pt-[104px] lg:pb-[88px]">
        <div className="hero-copy flex flex-col lg:w-[640px] lg:shrink xl:shrink-0">
          <Breadcrumbs
            tone="dark"
            className="hero-crumbs"
            trail={[
              { name: 'Home', path: '/' },
              { name: 'Pricing', path: '/pricing/' },
            ]}
          />
          <p className={`hero-eyebrow mt-7 text-viz-gold ${eyebrow}`}>Pricing · Per site · Software only</p>
          <h1 className="mt-5 text-[40px] leading-[44px] font-extrabold tracking-[-0.05em] text-text-on-dark md:text-[52px] md:leading-[56px] xl:text-[60px] xl:leading-16">
            <HeroWords text="Pricing that scales by sites, not by sensors." />
          </h1>
          <p className="hero-lede mt-6 max-w-[600px] text-[17px] leading-[28px] text-pretty text-[#D1DBE8] md:text-[19px] md:leading-body-l">
            Every plan is software only — no hardware to buy, install or maintain. You pay per site per year; every
            user at that site is included, and so is every parameter Flash predicts.
          </p>
          <div className="hero-ctas mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={DEMO_HREF} variant="gold" className="h-12 rounded-full px-[26px]">
              Get a quote
            </ButtonLink>
            <ButtonLink href={DEMO_HREF} variant="outline-dark" className="h-12 rounded-full px-[26px]">
              Book a demo
            </ButtonLink>
          </div>
          <p className="hero-support mt-7 text-caption text-text-on-dark-muted">Trusted by Troon · Big 12 · Syngenta · NAIA</p>
        </div>

        <PortfolioCard sites={portfolioSites} quoteHref={DEMO_HREF} />
      </div>
    </HeroSection>
  );
}

export function PlansSection() {
  return (
    <section aria-labelledby="plans-heading" className="border-t border-border bg-neutral-0">
      <div className="container-page flex flex-col gap-12 pt-16 pb-16 lg:pt-24 lg:pb-[112px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="flex max-w-narrow flex-col gap-4">
            <p className={`${eyebrow} text-brand-blue`}>Plans</p>
            <h2 id="plans-heading" className={`${h2} text-text`}>
              Which plan fits how many sites you run?
            </h2>
          </div>
          <p className="text-[15px] leading-6 text-text-muted lg:w-[380px] lg:shrink xl:shrink-0 lg:text-right">
            All three are quoted per site, per year. No setup fee, no hardware line item, no per-user seats.
          </p>
        </div>
        <PlanFit />
      </div>
    </section>
  );
}

export function QuoteFactorsSection() {
  return (
    <section aria-labelledby="quote-heading" className="bg-surface-sunken">
      <div className="container-page flex flex-col gap-10 py-16 lg:gap-14 lg:py-[112px]">
        <div className="flex max-w-[640px] flex-col gap-4">
          <p className={`${eyebrow} text-brand-blue`}>Quote factors</p>
          <h2 id="quote-heading" className={`${h2} text-text`}>
            How is your quote calculated?
          </h2>
          <p className="text-body text-text-muted">
            Five inputs set the number. Sites drive it; the other four only apply if you use them, and any of them can
            be added later in the year.
          </p>
        </div>
        <QuoteBuilder factors={quoteFactors} />
      </div>
    </section>
  );
}

export function AlwaysIncludedSection() {
  return (
    <section aria-labelledby="included-heading" className="bg-neutral-0">
      <div className="container-page flex flex-col gap-10 pt-16 pb-16 lg:pt-24 lg:pb-[112px]">
        <div className="flex items-center gap-4">
          <p className={`${eyebrow} shrink-0 text-text-muted`}>Always included · Every plan</p>
          <div aria-hidden className="h-px grow bg-border" />
        </div>

        {/* A chip zooms the photo to its surface (surface-focus.tsx, styles/pricing-surfaces.css). */}
        <SurfaceFocus className="psf flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-12">
          <div className="relative aspect-[640/300] w-full overflow-hidden rounded-lg border border-border-on-dark bg-brand-navy lg:w-[640px] lg:shrink xl:shrink-0">
            <Image
              src="/images/pricing/flash-devices-command-center-mobile-app.png"
              alt="Weather Command Center on a laptop beside the Flash mobile app, the surfaces included with every site licence"
              fill
              sizes="(min-width: 1024px) 1200px, 190vw"
              className="psf-image object-cover"
            />
            <div aria-hidden className="pricing-included-grade absolute inset-0" />
            <p className="absolute top-[18px] left-5 flex h-6 items-center rounded-[12px] bg-[#040818C7] px-[10px] text-[10px] leading-3 font-extrabold tracking-[0.13em] text-viz-gold">
              INCLUDED AT EVERY SITE
            </p>
            {includedSurfaces.map((s) => (
              <span key={s.id} aria-hidden className="psf-label" data-surface-label={s.id}>
                {s.label}
              </span>
            ))}
            <p className="absolute right-5 bottom-4 left-5 text-[15px] leading-5 font-extrabold text-text-on-dark">
              Command Center, mobile app and API — one licence
            </p>
          </div>
          <div className="flex grow flex-col gap-[18px]">
            <h3
              id="included-heading"
              className="text-[28px] leading-[34px] font-extrabold tracking-[-0.03em] text-text md:text-[34px] md:leading-h2"
            >
              Every surface, one subscription.
            </h3>
            <p className="text-[17px] leading-h4 text-text-muted">
              A site licence covers the Weather Command Center on the desk, the Flash mobile app in the crew&apos;s
              pocket and the same 1×1 km forecast through the API. No per-seat maths, no surface you have to buy twice.
            </p>
            <ul className="flex flex-wrap gap-2">
              {includedSurfaces.map((s) => (
                <li key={s.label}>
                  {s.href ? (
                    <Link
                      href={s.href}
                      data-surface={s.id}
                      className="psf-chip flex min-h-[30px] items-center rounded-[15px] bg-neutral-100 px-3 py-1 text-micro font-bold text-neutral-700 hover:bg-neutral-200 data-[on]:bg-neutral-200"
                    >
                      {s.label}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      data-surface={s.id}
                      aria-pressed="false"
                      className="psf-chip flex min-h-[30px] items-center rounded-[15px] bg-neutral-100 px-3 py-1 text-micro font-bold text-neutral-700 hover:bg-neutral-200 data-[on]:bg-neutral-200"
                    >
                      {s.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </SurfaceFocus>

        {/* The five items fade up once, in turn (styles/pricing-surfaces.css). */}
        <Motion as="ul" replay={false} threshold={0.2} className="motion grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {alwaysIncluded.map((a) => (
            <li key={a.title} className="psf-rise flex flex-col gap-2 border-t border-border-strong pt-5">
              <h4 className="text-[17px] leading-6 font-semibold text-text">
                {a.href ? (
                  <Link href={a.href} className="hover:underline">
                    {a.title}
                  </Link>
                ) : (
                  a.title
                )}
              </h4>
              <p className="text-body-s text-text-muted">{a.body}</p>
            </li>
          ))}
        </Motion>

        <div className="mt-2 flex flex-col gap-5 rounded-[20px] border border-border-on-dark bg-brand-navy-deep px-6 py-[26px] md:flex-row md:items-center md:justify-between md:gap-8 md:px-8">
          <div className="flex items-start gap-5 md:items-center">
            <Bolt className="mt-1 h-6 w-[18px] md:mt-0" />
            <p className="text-body-l leading-h4 font-medium text-text-on-dark">
              Every plan includes the full parameter catalogue — lightning, hail, heat and WBGT, wind, rain, frost,
              agronomy.
            </p>
          </div>
          <Link
            href="/products/"
            className="psf-catalogue flex min-h-[44px] shrink-0 items-center text-body-s leading-5 font-semibold text-[#C9D1E3] hover:text-text-on-dark"
          >
            See the catalogue <span aria-hidden className="psf-arrow">&nbsp;→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function SensorCostSection() {
  return (
    <section aria-labelledby="sensor-heading" className="bg-brand-navy">
      <div className="container-page flex flex-col gap-12 py-16 lg:py-[112px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="flex max-w-narrow flex-col gap-4">
            <p className={`${eyebrow} text-viz-gold`}>Cost of ownership</p>
            <h2 id="sensor-heading" className={`${h2} text-text-on-dark`}>
              What does a sensor-based system cost you that Flash doesn&apos;t?
            </h2>
          </div>
          <p className="text-[15px] leading-6 text-text-on-dark-muted lg:w-[360px] lg:shrink xl:shrink-0 lg:text-right">
            No dollar figures — every sensor vendor quotes differently. These are the line items that appear on a
            sensor invoice and never on ours.
          </p>
        </div>

        <div className="relative flex min-h-[250px] overflow-hidden rounded-lg border border-border-on-dark bg-brand-navy-deep">
          <Image
            src="/images/pricing/flash-rooftop-sensor-mast-storm-sky-cost-of-ownership.png"
            alt="A rooftop weather sensor mast with an anemometer under an approaching storm shelf cloud, the hardware a sensor-based system needs at every site"
            fill
            sizes="(min-width: 1440px) 1248px, 100vw"
            className="object-cover object-[50%_42%]"
          />
          <div aria-hidden className="pricing-sensor-grade absolute inset-0" />
          <p className="absolute top-[22px] left-[26px] flex h-6 items-center rounded-[12px] bg-[#040818CC] px-[11px] text-[10px] leading-3 font-extrabold tracking-[0.13em] text-viz-gold">
            WHAT A SENSOR NETWORK ASKS OF YOU
          </p>
          <div className="relative mt-auto flex max-w-narrow flex-col gap-1 p-[26px] pt-20">
            <p className="text-[22px] leading-[28px] font-extrabold tracking-[-0.03em] text-text-on-dark md:text-[26px] md:leading-[32px]">
              One mast per site, and it only sees what already happened.
            </p>
            <p className="text-body-s text-text-on-dark-muted">
              Flash predicts the same storm ahead of time, everywhere on the 1×1 km grid, with nothing on the roof.
            </p>
          </div>
        </div>

        <SensorCostFigure rows={sensorComparison} />

        <Link
          href="/why-flash/prediction-vs-sensors-vs-detection/"
          className="flex min-h-[44px] items-center self-start text-body-s font-semibold text-[#C9D1E3] hover:text-text-on-dark"
        >
          Prediction vs sensors vs detection <span aria-hidden>&nbsp;→</span>
        </Link>
      </div>
    </section>
  );
}

export function PricingFaq() {
  return (
    <section aria-labelledby="pricing-faq-heading" className="bg-surface-sunken">
      <div className="container-page flex flex-col gap-10 py-16 lg:flex-row lg:items-start lg:gap-16 lg:py-[112px]">
        <div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:w-[400px] lg:shrink xl:shrink-0">
          <p className={`${eyebrow} text-brand-blue`}>Pricing FAQ</p>
          <h2 id="pricing-faq-heading" className={`${h2} text-text`}>
            What do buyers ask before they sign?
          </h2>
          <p className="text-body text-text-muted">
            Contract length, pilots, sensors, free tiers — answered here so the quote call is about your sites, not the
            fine print.
          </p>
        </div>
        <FaqAccordion
          className="flex grow basis-0 flex-col border-t border-border-strong"
          row="py-6"
          question="text-h4 leading-h4 font-semibold tracking-heading text-text"
          answer="mt-[10px] text-body text-text-muted md:pr-16"
          faqs={pricingFaqs.map((f) => ({
            question: f.question,
            answer: <LinkedText text={f.answer} link={f.link} />,
            icon: f.icon,
          }))}
        />
      </div>
    </section>
  );
}
