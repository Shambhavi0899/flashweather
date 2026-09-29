import Image from 'next/image';
import Link from 'next/link';

import { Breadcrumbs } from '@/components/breadcrumbs';
import { ButtonLink } from '@/components/button';
import { HeroBackground, HeroSection, HeroWords } from '@/components/hero/hero';
import { FaqAccordion } from '@/components/faq/faq-accordion';
import { Bolt } from '@/components/logo';
import { LinkedText } from '@/components/pricing/linked-text';
import { DEMO_HREF } from '@/content/navigation';
import {
  alwaysIncluded,
  includedSurfaces,
  plans,
  portfolioSites,
  pricingFaqs,
  quoteFactors,
  sensorComparison,
  type Plan,
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

        <PortfolioMock />
      </div>
    </HeroSection>
  );
}

/** The per-site portfolio view, rebuilt in HTML so its text is crawlable. */
function PortfolioMock() {
  return (
    <figure className="hero-visual hero-visual-side min-w-0 lg:w-[544px] lg:shrink xl:shrink-0">
      <figcaption className="sr-only">
        Flash Weather AI portfolio view listing sites with their users, predicted parameters and live status, priced
        per site per year
      </figcaption>
      <div className="overflow-hidden rounded-[20px] border border-border-on-dark bg-brand-navy-deep shadow-[0_1px_2px_#0B13220D,0_24px_48px_#0B132229]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-on-dark px-6 py-[18px]">
          <p className="text-micro font-semibold tracking-label text-text-on-dark-muted">PORTFOLIO · PER SITE, PER YEAR</p>
          <p className="flex items-center gap-2 text-micro font-medium text-neutral-500">
            <span aria-hidden className="size-[6px] rounded-full bg-alert-clear" />
            Live · refreshed 09:42
          </p>
        </div>
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[440px] text-left">
            <thead>
              <tr className="border-b border-border-on-dark text-[11px] leading-[14px] font-semibold tracking-[0.12em] text-neutral-500">
                <th scope="col" className="w-[204px] py-3 pr-4 pl-6 font-semibold">
                  SITE
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold">
                  PARAMETERS
                </th>
                <th scope="col" className="py-3 pr-6 text-right font-semibold">
                  STATUS
                </th>
              </tr>
            </thead>
            <tbody>
              {portfolioSites.map((s) => (
                <tr key={s.name} className="border-b border-border-on-dark">
                  <th scope="row" className="py-[14px] pr-4 pl-6 font-normal">
                    <span className="block text-body-s leading-caption font-medium text-text-on-dark">{s.name}</span>
                    <span className="block text-micro text-neutral-500">{s.meta}</span>
                  </th>
                  <td className="py-[14px] pr-4">
                    <ul className="flex flex-wrap gap-[6px]">
                      {s.params.map((p) => (
                        <li
                          key={p}
                          className="flex h-[22px] items-center rounded-sm border border-border-on-dark bg-neutral-900 px-2 text-[11px] leading-[14px] font-medium text-[#C9D1E3]"
                        >
                          {p}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td
                    className={`py-[14px] pr-6 text-right text-micro font-medium ${
                      s.status === 'Live' ? 'text-[#3FBF8C]' : 'text-text-on-dark-muted'
                    }`}
                  >
                    {s.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 bg-white/3 px-6 py-4 text-caption">
          <span className="text-text-on-dark-muted">Every site · every user included · one renewal date</span>
          <span className="font-semibold text-text-on-dark">Add a site →</span>
        </div>
      </div>
    </figure>
  );
}

function Check() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden className="mt-[2px] shrink-0">
      <circle cx="10" cy="10" r="10" fill="var(--color-neutral-100)" />
      <path
        d="M6 10.5l2.6 2.6L14 7.5"
        fill="none"
        stroke="var(--color-brand-blue)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlanColumn({ plan, index }: { plan: Plan; index: number }) {
  const last = index === plans.length - 1;
  return (
    <li
      className={`flex flex-col gap-7 lg:px-8 ${index === 0 ? 'lg:pl-0' : ''} ${last ? 'lg:pr-0' : 'lg:border-r lg:border-border'} ${
        plan.featured ? 'border-t-2 border-gold-on-light pt-10' : 'border-t border-border pt-[41px]'
      }`}
    >
      <div className="flex flex-col gap-3">
        <p className={`${eyebrow} ${plan.featured ? 'text-text' : 'text-text-muted'}`}>{plan.eyebrow}</p>
        <h3 className="text-[28px] leading-[34px] font-extrabold tracking-[-0.03em] text-text">{plan.name}</h3>
        <p className="text-body text-text-muted">{plan.audience}</p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-body-l leading-body font-semibold text-text">{plan.basis}</p>
        <p className="text-body-s text-text-muted">{plan.basisNote}</p>
      </div>
      <ButtonLink
        href={DEMO_HREF}
        variant={plan.featured ? 'gold' : 'outline-light'}
        className="h-12 self-start rounded-full px-[26px]"
      >
        Get a quote<span className="sr-only"> for {plan.name}</span>
      </ButtonLink>
      <div className="flex flex-col gap-3 pt-1">
        <p className={`${eyebrow} text-text-muted`}>{plan.includesLabel}</p>
        <ul className="flex flex-col gap-3">
          {plan.includes.map((item) => (
            <li key={item} className="flex items-start gap-3 text-[15px] leading-6 text-text">
              <Check />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </li>
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
        <ul className="grid gap-12 lg:grid-cols-3 lg:gap-0">
          {plans.map((plan, i) => (
            <PlanColumn key={plan.id} plan={plan} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}

export function QuoteFactorsSection() {
  return (
    <section aria-labelledby="quote-heading" className="bg-surface-sunken">
      <div className="container-page flex flex-col gap-10 py-16 lg:flex-row lg:gap-16 lg:py-[112px]">
        <div className="flex flex-col gap-4 lg:w-[400px] lg:shrink xl:shrink-0">
          <p className={`${eyebrow} text-brand-blue`}>Quote factors</p>
          <h2 id="quote-heading" className={`${h2} text-text`}>
            How is your quote calculated?
          </h2>
          <p className="text-body text-text-muted">
            Five inputs set the number. Sites drive it; the other four only apply if you use them, and any of them can
            be added later in the year.
          </p>
        </div>
        <ol className="flex grow flex-col border-t border-border-strong">
          {quoteFactors.map((f, i) => (
            <li key={f.name} className="flex flex-col gap-2 border-b border-border py-6 md:flex-row md:gap-6">
              <span aria-hidden className="text-micro leading-body font-semibold tracking-label text-brand-blue md:w-12 md:shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-body-l leading-body font-semibold text-text md:w-[220px] md:shrink-0">{f.name}</h3>
              <p className="grow text-body text-text-muted">{f.body}</p>
            </li>
          ))}
        </ol>
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

        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-12">
          <div className="relative aspect-[640/300] w-full overflow-hidden rounded-lg border border-border-on-dark bg-brand-navy lg:w-[640px] lg:shrink xl:shrink-0">
            <Image
              src="/images/pricing/flash-devices-command-center-mobile-app.png"
              alt="Weather Command Center on a laptop beside the Flash mobile app, the surfaces included with every site licence"
              fill
              sizes="(min-width: 1024px) 640px, 100vw"
              className="object-cover"
            />
            <div aria-hidden className="pricing-included-grade absolute inset-0" />
            <p className="absolute top-[18px] left-5 flex h-6 items-center rounded-[12px] bg-[#040818C7] px-[10px] text-[10px] leading-3 font-extrabold tracking-[0.13em] text-viz-gold">
              INCLUDED AT EVERY SITE
            </p>
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
                      className="flex min-h-[30px] items-center rounded-[15px] bg-neutral-100 px-3 py-1 text-micro font-bold text-neutral-700 hover:bg-neutral-200"
                    >
                      {s.label}
                    </Link>
                  ) : (
                    <span className="flex min-h-[30px] items-center rounded-[15px] bg-neutral-100 px-3 py-1 text-micro font-bold text-neutral-700">
                      {s.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {alwaysIncluded.map((a) => (
            <li key={a.title} className="flex flex-col gap-2 border-t border-border-strong pt-5">
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
        </ul>

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
            className="flex min-h-[44px] shrink-0 items-center text-body-s leading-5 font-semibold text-[#C9D1E3] hover:text-text-on-dark"
          >
            See the catalogue <span aria-hidden>&nbsp;→</span>
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

        <div className="relative overflow-x-auto rounded-[20px] border border-white/10 bg-[#040818B8]">
          <table className="w-full min-w-[640px] text-left">
            <caption className="sr-only">Line items on a sensor-based system compared with Flash</caption>
            <thead>
              <tr className="border-b border-white/8 text-micro font-semibold tracking-label">
                <th scope="col" className="px-7 py-4 font-semibold text-text-on-dark-muted lg:w-[320px]">
                  LINE ITEM
                </th>
                <th scope="col" className="px-7 py-4 font-semibold text-text-on-dark lg:w-[464px]">
                  FLASH
                </th>
                <th scope="col" className="px-7 py-4 font-semibold text-text-on-dark-muted">
                  SENSOR-BASED SYSTEM
                </th>
              </tr>
            </thead>
            <tbody>
              {sensorComparison.map((r) => (
                <tr key={r.item} className="border-b border-white/8 last:border-b-0">
                  <th scope="row" className="px-7 py-[22px] text-body font-semibold text-text-on-dark">
                    {r.item}
                  </th>
                  <td className="px-7 py-[22px] text-body text-text-on-dark">{r.flash}</td>
                  <td className="px-7 py-[22px] text-body text-text-on-dark-muted">{r.sensor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
