import Image from 'next/image';
import Link from 'next/link';

import { BOLT_PATH } from '@/components/bolt-path';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ButtonLink } from '@/components/button';
import { HeroSection } from '@/components/hero/hero';
import { Logo } from '@/components/logo';
import { Motion } from '@/components/motion';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { AlertClock } from '@/components/why-flash/alert-clock';
import { ComparisonTable } from '@/components/why-flash/comparison-table';
import { DetectionFitProvider, FitCases, FitSummary } from '@/components/why-flash/detection-fit';
import { FaqList } from '@/components/why-flash/faq-list';
import { OptionCards } from '@/components/why-flash/option-cards';
import { IllustrativeChip, Kicker, SectionHeading } from '@/components/why-flash/section-heading';
import { WhyFlashLinks } from '@/components/why-flash/why-flash-links';
import { DEMO_HREF } from '@/content/navigation';
import {
  agenticSteps,
  clockCards,
  everyoneElseFaqs,
  links,
  summaryStrip,
  WHY_FLASH_HOME,
  whyFlashPages,
} from '@/content/why-flash';
import { JsonLd, faqSchema } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';
import { site } from '@/lib/seo/site';

const page = whyFlashPages.everyoneElse;

/** "Report an error" in the method note: a correction email with its subject filled in. */
const REPORT_ERROR_HREF = `mailto:${site.email}?subject=${encodeURIComponent('Comparison correction: Everyone else vs Flash')}`;

export const metadata = buildMetadata({
  title: page.title,
  description: page.description,
  path: page.path,
});

export default function EveryoneElseVsFlashPage() {
  return (
    <>
      <SiteHeader tone="light" />
      <main id="main">
        <JsonLd schema={faqSchema(everyoneElseFaqs)} />

        {/* Hero */}
        <HeroSection theme="light" className="overflow-hidden border-b border-border bg-neutral-0">
          <div className="hero-copy container-page flex flex-col gap-10 pt-10 pb-16 lg:pb-24">
            <Breadcrumbs
              tone="light"
              className="hero-crumbs"
              trail={[
                { name: 'Home', path: '/' },
                { name: 'Why Flash', path: WHY_FLASH_HOME },
                { name: page.label, path: page.path },
              ]}
            />

            <div className="flex flex-col gap-8 lg:gap-10">
              <Kicker className="hero-eyebrow">Why Flash · Everyone else vs Flash · Prediction, not detection</Kicker>

              <h1 className="flex flex-col gap-[2px] text-[48px] leading-[52px] font-extrabold tracking-[-0.065em] sm:text-[72px] sm:leading-[78px] lg:text-[108px] lg:leading-[112px]">
                <span className="flex flex-wrap items-center gap-x-[30px] gap-y-2">
                  <span className="hero-word relative text-[#B7C0CF]">
                    Reactive.
                    <svg
                      viewBox="0 0 470 70"
                      aria-hidden
                      className="pointer-events-none absolute top-[23%] -left-[2.5%] h-auto w-[105%]"
                    >
                      <path
                        d="M10 56 C 120 50, 300 36, 458 22"
                        fill="none"
                        stroke="var(--color-viz-gold)"
                        strokeWidth="15"
                        strokeLinecap="round"
                      />
                      <path
                        d="M20 66 C 150 60, 310 46, 420 38"
                        fill="none"
                        stroke="var(--color-viz-gold)"
                        strokeWidth="5"
                        strokeLinecap="round"
                        opacity="0.5"
                      />
                    </svg>
                  </span>
                  {/* Sticker labels: decorative, their text lives in CSS so it stays out of the heading. */}
                  <span
                    aria-hidden
                    className="hero-support hidden -rotate-4 items-center gap-2 rounded-[8px] border border-border-strong bg-neutral-0 px-[14px] py-[10px] text-micro font-extrabold tracking-[0.13em] text-text-muted shadow-[0_8px_20px_#0B13221A] after:content-['EVERYONE_ELSE'] sm:inline-flex"
                  >
                    <span className="size-[10px] rounded-full bg-neutral-400" />
                  </span>
                </span>
                <span className="flex flex-wrap items-center gap-x-[30px] gap-y-2">
                  <span>
                    <span className="hero-word hero-word-1 text-brand-navy">We&rsquo;re</span>{' '}
                    <span className="hero-word hero-word-2 text-brand-blue">proactive.</span>
                  </span>
                  <span
                    aria-hidden
                    className="hero-support hidden rotate-3 items-center rounded-[8px] bg-brand-navy px-[18px] py-3 shadow-[0_12px_28px_#070D2647] sm:inline-flex"
                  >
                    <Logo variant="dark" size="tag" link={false} alt="" />
                  </span>
                </span>
              </h1>

              <div className="hero-lede flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
                <p className="max-w-[640px] text-body-l text-text-muted">
                  Detection tools tell you where lightning was. Flash tells you where it will be, up to an hour before,
                  one kilometre at a time. That is the difference between reacting and deciding. No vendor is named on
                  this page: the left column is what detection-based tools and hourly forecasts do by design.
                </p>
                <ul className="flex shrink-0 flex-wrap items-center gap-x-7 gap-y-2 pb-1 text-[11px] leading-[14px] font-extrabold tracking-[0.13em]">
                  <li className="flex items-center gap-2 text-text-muted">
                    <span aria-hidden className="size-[10px] shrink-0 rounded-full bg-neutral-400" />
                    DETECTS · AFTER
                  </li>
                  <li className="flex items-center gap-2 text-brand-navy">
                    <svg width="10" height="14" viewBox="0 0 26 34" aria-hidden className="shrink-0">
                      <path d={BOLT_PATH} fill="var(--color-gold-on-light)" />
                    </svg>
                    PREDICTS · UP TO 60 MIN BEFORE
                  </li>
                </ul>
              </div>
            </div>

            <div className="hero-ctas flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-[14px]">
              <ButtonLink href={DEMO_HREF} variant="gold" className="px-[30px]">
                Book a demo
              </ButtonLink>
              <ButtonLink href={whyFlashPages.accuracyMethod.path} variant="outline-light" className="px-[30px]">
                Read the accuracy method
              </ButtonLink>
              <p className="text-caption text-text-subtle sm:pl-[10px]">
                For golf, construction, sports, schools, roofing and agriculture. Nothing to install. No vendor is named
                on this page.
              </p>
            </div>
          </div>
        </HeroSection>

        {/* Summary strip */}
        <section aria-label="Summary: everyone else vs Flash" className="border-y border-border bg-surface-sunken">
          <dl className="container-page grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
            {summaryStrip.map((item, i) => (
              <div
                key={item.label}
                className={`flex flex-col gap-3 lg:px-6 ${i === 0 ? 'lg:pl-0' : ''} ${
                  i < summaryStrip.length - 1 ? 'lg:border-r lg:border-border' : 'lg:pr-0'
                }`}
              >
                <dt className="text-[11px] leading-[14px] font-bold tracking-[0.13em] text-text-muted uppercase">
                  {item.label}
                </dt>
                <dd className="flex items-start gap-[10px]">
                  <span className="w-[100px] shrink-0 text-[10px] leading-5 font-extrabold tracking-[0.12em] text-text-muted">
                    EVERYONE ELSE
                  </span>
                  <span className="text-[15px] leading-5 text-text-muted">{item.else}</span>
                </dd>
                <dd className="flex items-start gap-[10px]">
                  <span className="w-[100px] shrink-0 text-[10px] leading-5 font-extrabold tracking-[0.12em] text-brand-blue">
                    FLASH
                  </span>
                  <span className="text-[15px] leading-5 text-text">{item.flash}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Side by side */}
        <section aria-labelledby="side-by-side" className="bg-surface-sunken">
          <div className="container-page flex flex-col gap-10 py-20 lg:py-28">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
              <SectionHeading id="side-by-side" kicker="Capability by capability" size="lg" className="max-w-narrow">
                Which does what? Everyone else and Flash, side by side.
              </SectionHeading>
              <div className="flex flex-col gap-[14px] lg:w-[380px] lg:shrink xl:shrink-0">
                <p className="text-body text-text-muted">
                  Left column: what detection-based lightning tools and hourly forecasts do by design. Right column:
                  what Flash does, with the numbers published on flashweather.ai.
                </p>
                <div>
                  <IllustrativeChip />
                </div>
              </div>
            </div>

            <ComparisonTable />

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href={whyFlashPages.predictionVsSensors.path}
                className="inline-flex min-h-11 items-center text-body-s leading-caption font-bold text-brand-blue hover:underline"
              >
                Read the full explainer: prediction vs sensors vs detection&nbsp;<span aria-hidden>→</span>
              </Link>
              <p className="text-caption leading-micro text-text-subtle">Generic comparison with detection-based tools. No vendor named.</p>
            </div>
          </div>
        </section>

        {/* Photo band */}
        <div className="relative h-[420px] overflow-hidden bg-brand-navy">
          <Image
            src="/images/why-flash/flash-storm-cell-open-ground-lightning-lead-time.jpg"
            alt="A towering storm cell building over open flat ground with a distant rain shaft, used to introduce where each alert sits on the clock"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div aria-hidden className="why-flash-photo-grade absolute inset-0" />
          <div className="container-page relative flex h-full flex-col justify-end pb-9">
            <div className="flex max-w-[820px] flex-col gap-3">
              <Kicker tone="dark">The hour before</Kicker>
              <p className="text-[24px] leading-[30px] font-extrabold tracking-[-0.03em] text-text-on-dark md:text-[30px] md:leading-[36px]">
                A detection alert starts its clock at the first strike. Flash starts yours up to 60 minutes earlier.
              </p>
            </div>
          </div>
        </div>

        {/* The clock */}
        <section aria-labelledby="the-clock" className="bg-brand-navy">
          <div className="container-page flex flex-col gap-10 py-20 lg:py-28">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-12">
              <SectionHeading id="the-clock" kicker="The clock" tone="dark" size="lg" className="lg:w-narrow lg:shrink xl:shrink-0">
                Where each alert sits on the clock
              </SectionHeading>
              <p className="text-body text-text-on-dark-muted lg:w-panel lg:shrink xl:shrink-0 lg:pt-[38px]">
                Detection can only report a strike after it has been located. Flash flags the cell in the hour before
                it. Both are useful; only one of them gives you time.
              </p>
            </div>

            {/* The dial sits between the cards from xl (Detection left, Flash right, each beside its
                markers) and above them below xl. One Motion block, so the sweep can light the cards. */}
            <Motion className="motion eec flex flex-wrap gap-6 xl:flex-nowrap xl:items-center xl:gap-10" replay={false}>
              <AlertClock className="w-full xl:order-2 xl:w-auto xl:shrink-0" />
              {clockCards.map((card) => (
                <div
                  key={card.key}
                  data-kind={card.key}
                  className={`eec-card flex w-full flex-col gap-4 rounded-[20px] border border-white/10 bg-[#040818B8] p-6 md:p-7 lg:w-[calc(50%-12px)] xl:w-auto xl:min-w-0 xl:flex-1 ${
                    card.key === 'flash' ? 'xl:order-3' : 'xl:order-1'
                  }`}
                >
                  <h3 className="text-[11px] leading-[14px] font-bold tracking-[0.13em] text-text-on-dark-muted uppercase">
                    {card.label}
                  </h3>
                  <p className="text-body-l leading-h4 text-text-on-dark">{card.lead}</p>
                  <div aria-hidden className="h-px bg-border-on-dark" />
                  <p className="text-[11px] leading-[14px] font-bold tracking-[0.13em] text-viz-gold uppercase">
                    On site, that means
                  </p>
                  <p className="text-body text-text-on-dark">{card.onSite}</p>
                </div>
              ))}
            </Motion>
          </div>
        </section>

        {/* When detection fits, then the options: the self-check's selection carries into the next section. */}
        <DetectionFitProvider>
          <section aria-labelledby="detection-fit" className="bg-neutral-0">
            <div className="container-page flex flex-col gap-12 py-20 lg:flex-row lg:items-start lg:gap-20 lg:py-28">
              <div className="fit-intro flex flex-col gap-3 lg:w-[408px] lg:shrink xl:shrink-0">
                <SectionHeading id="detection-fit" kicker="Honest answer" size="lg">
                  When is a detection-based tool the better fit?
                </SectionHeading>
                <p className="text-[15px] leading-body-s text-text-muted">
                  Three cases where we would tell you to keep the sensor, and what Flash does beside it.
                </p>
                <FitSummary optionsHref="#your-options" />
              </div>
              <div className="flex flex-col lg:-mt-5 lg:w-narrow lg:shrink xl:shrink-0">
                <FitCases />
              </div>
            </div>
          </section>

          {/* Alternatives */}
          <section aria-labelledby="your-options" className="border-t border-border bg-surface-sunken">
            <div className="container-page flex flex-col gap-8 py-20 lg:py-28">
              <SectionHeading id="your-options" kicker="Your options" size="lg" className="max-w-[900px]">
                Detection, prediction or do it yourself: which one fits your site?
              </SectionHeading>

              <OptionCards />

              <div className="flex flex-col gap-8 border-t border-border pt-10 lg:flex-row lg:items-start lg:gap-20">
                <div className="flex flex-col gap-[10px] lg:w-[408px] lg:shrink xl:shrink-0">
                  <Kicker>The agentic approach</Kicker>
                  <h3 className="text-h3 leading-h3 font-extrabold tracking-display text-text">
                    Everyone else vs the agentic approach
                  </h3>
                  <p className="text-[17px] leading-h4 text-text-muted">
                    A dashboard, whoever makes it, still needs someone to open it, read the alert and make the call.
                  </p>
                </div>
                <div className="flex flex-col gap-6 lg:w-narrow lg:shrink xl:shrink-0">
                  <Motion as="ol" className="motion agf" label="How Flash Agent works" replay={false} threshold={0.5}>
                    {agenticSteps.map((step, i) => (
                      <li key={step.label} className="agf-step" style={{ '--agf-i': i } as React.CSSProperties}>
                        <div aria-hidden className="agf-rail">
                          <span className="agf-dot" />
                          <span className="agf-line" />
                        </div>
                        <div className="agf-copy">
                          <p className="text-micro font-bold tracking-[0.13em] text-brand-blue uppercase">
                            {step.label}
                          </p>
                          <p
                            className={`text-body leading-body ${i === 0 ? 'font-semibold text-text' : 'text-text-muted'}`}
                          >
                            {step.body}
                          </p>
                        </div>
                      </li>
                    ))}
                  </Motion>
                  <div className="flex flex-wrap gap-x-7">
                    <Link
                      href={links.agent.href}
                      className="inline-flex min-h-11 items-center text-body-s leading-caption font-bold text-brand-blue hover:underline"
                    >
                      See Flash Agent&nbsp;<span aria-hidden>→</span>
                    </Link>
                    <Link
                      href={links.integrations.href}
                      className="inline-flex min-h-11 items-center text-body-s leading-caption font-bold text-brand-blue hover:underline"
                    >
                      Integrations&nbsp;<span aria-hidden>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </DetectionFitProvider>

        {/* Method note */}
        <section aria-labelledby="honest-comparison" className="bg-neutral-0">
          <Motion
            className="motion container-page flex flex-col gap-10 py-20 lg:flex-row lg:items-start lg:gap-20 lg:py-28"
            replay={false}
            threshold={0.2}
          >
            <SectionHeading
              id="honest-comparison"
              kicker="How this page is written"
              size="lg"
              className="wfh-rise lg:w-[408px] lg:shrink xl:shrink-0"
            >
              How we keep this comparison honest
            </SectionHeading>
            <div className="flex flex-col gap-5 text-body text-text lg:w-narrow lg:shrink xl:shrink-0">
              <p className="wfh-rise" data-step="1">
                No vendor is named on this page. “Everyone else” means the two things most operations run today: a
                detection-based lightning tool that alerts on strikes already located, and an hourly forecast issued
                for a county or a city. The left column describes what those do by design, not what any one product
                promises.
              </p>
              <p className="wfh-rise" data-step="1">
                Every Flash figure on this page comes from flashweather.ai and is defined on the{' '}
                <Link href={whyFlashPages.accuracyMethod.path} className="font-semibold text-brand-blue hover:underline">
                  Accuracy Method
                </Link>{' '}
                page: what is scored, on what window and against what ground truth. The clock times in the table are
                illustrative, not live weather.
              </p>
              <p className="wfh-rise" data-step="1">
                If you build a detection tool and think a row is unfair, write to{' '}
                <a href="mailto:support@flashweather.ai" className="font-semibold text-brand-blue hover:underline">
                  support@flashweather.ai
                </a>
                . We will read it, and change the row if it is wrong.
              </p>
              <dl className="wfh-rise flex flex-col pt-1" data-step="2">
                <div className="flex flex-col gap-1 border-y border-border py-[14px] sm:flex-row sm:gap-4">
                  <dt className="w-32 shrink-0 text-micro leading-body-s font-bold tracking-[0.08em] text-text">
                    FLASH FIGURES
                  </dt>
                  <dd className="wfh-cell text-[15px] leading-body-s text-text-muted">
                    <span className="min-w-0 grow">
                      Defined and scored in the{' '}
                      <Link
                        href={whyFlashPages.accuracyMethod.path}
                        className="font-semibold text-brand-blue hover:underline"
                      >
                        accuracy method
                      </Link>{' '}
                      · product specifications on{' '}
                      <Link href={links.lightning.href} className="font-semibold text-brand-blue hover:underline">
                        {links.lightning.label}
                      </Link>{' '}
                      and{' '}
                      <Link href={links.hail.href} className="font-semibold text-brand-blue hover:underline">
                        {links.hail.label}
                      </Link>
                    </span>
                    <span className="wfh-badge-slot">
                      <Link href={whyFlashPages.accuracyMethod.path} className="wfh-badge" data-tone="scored">
                        Scored · see method
                      </Link>
                    </span>
                  </dd>
                </div>
                <div className="flex flex-col gap-1 border-b border-border py-[14px] sm:flex-row sm:gap-4">
                  <dt className="w-32 shrink-0 text-micro leading-body-s font-bold tracking-[0.08em] text-text">
                    EVERYONE ELSE
                  </dt>
                  <dd className="wfh-cell text-[15px] leading-body-s text-text-muted">
                    <span className="min-w-0 grow">
                      Described by category only: detection-based tools and hourly forecasts. No vendor&rsquo;s page is
                      quoted.
                    </span>
                    <span className="wfh-badge-slot">
                      <span className="wfh-badge">No vendor named</span>
                    </span>
                  </dd>
                </div>
              </dl>
              <div className="wfh-rise" data-step="3">
                <ButtonLink href={REPORT_ERROR_HREF} variant="outline-light" size="sm" className="wfh-report">
                  Report an error
                </ButtonLink>
              </div>
            </div>
          </Motion>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq" className="border-t border-border bg-surface-sunken">
          <div className="container-page flex flex-col gap-8 py-20 lg:py-28">
            <SectionHeading id="faq" kicker="FAQ" size="lg" className="max-w-[900px]">
              Questions buyers ask before choosing between detection and prediction
            </SectionHeading>
            <FaqList faqs={everyoneElseFaqs} />
          </div>
        </section>

        <WhyFlashLinks current="everyoneElse" extra={[links.lightning, links.hail, links.pricing]} />
      </main>
      <SiteFooter eyebrow="Book a demo · No sensors to install" />
    </>
  );
}
