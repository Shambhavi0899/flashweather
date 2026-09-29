import Image from 'next/image';
import Link from 'next/link';

import { BOLT_PATH } from '@/components/bolt-path';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ButtonLink } from '@/components/button';
import { HeroBackground, HeroSection, HeroWords } from '@/components/hero/hero';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { FaqList } from '@/components/why-flash/faq-list';
import { LinkifiedText } from '@/components/why-flash/linkified-text';
import { Kicker, SectionHeading } from '@/components/why-flash/section-heading';
import { TechnologyFigure } from '@/components/why-flash/technology-figure';
import { WhyFlashLinks } from '@/components/why-flash/why-flash-links';
import { DEMO_HREF } from '@/content/navigation';
import {
  WHY_FLASH_HOME,
  glossary,
  guidanceParagraphs,
  links,
  predictionFaqs,
  safetyStack,
  techColumns,
  techRows,
  technologies,
  whyFlashPages,
} from '@/content/why-flash';
import { JsonLd, definedTermSetSchema, faqSchema } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';

const page = whyFlashPages.predictionVsSensors;

export const metadata = buildMetadata({
  title: page.title,
  description: page.description,
  path: page.path,
});

export default function PredictionVsSensorsPage() {
  return (
    <>
      <SiteHeader tone="dark" />
      <main id="main">
        <JsonLd schema={faqSchema(predictionFaqs)} />
        <JsonLd
          schema={definedTermSetSchema({
            name: 'Terms you will meet in every lightning-safety policy',
            path: page.path,
            terms: glossary,
          })}
        />

        {/* Hero */}
        <HeroSection theme="dark" className="relative overflow-hidden bg-brand-navy">
          <HeroBackground storm>
            <Image
              src="/images/why-flash/prediction-vs-sensors-vs-detection-storm-hero.jpg"
              alt=""
              fill
              preload
              sizes="100vw"
              className="object-cover opacity-55"
            />
          </HeroBackground>
          <div aria-hidden className="why-flash-hero-grade absolute inset-0" />
          <div className="hero-copy container-page relative flex flex-col gap-6 pt-10 pb-20 lg:pb-[104px]">
            <Breadcrumbs
              tone="dark"
              className="hero-crumbs"
              trail={[
                { name: 'Home', path: '/' },
                { name: 'Why Flash', path: WHY_FLASH_HOME },
                { name: 'Prediction vs sensors vs detection', path: page.path },
              ]}
            />
            <Kicker tone="dark" className="hero-eyebrow pt-2">
              Source of truth · Explainer
            </Kicker>
            <h1 className="max-w-[1120px] text-[34px] leading-[40px] font-extrabold tracking-[-0.05em] text-text-on-dark md:text-display-m md:leading-display-m lg:text-display-l lg:leading-display-l">
              <HeroWords text="AI lightning prediction vs electrostatic sensors vs detection networks: what each can and can’t tell you." />
            </h1>
            <p className="hero-lede max-w-narrow text-body-l text-[#C9D1E3] md:text-[19px]">
              Three technologies are sold under the word “lightning”. One reports a strike after it has happened, one
              reads the electric field at a single mast, and one forecasts where the next strike is likely. Here is
              what each measures, how far ahead it can see, and where it belongs in a safety plan.
            </p>
            <div className="hero-ctas flex flex-col gap-3 sm:flex-row sm:gap-[14px]">
              <ButtonLink href={DEMO_HREF} variant="gold" className="px-[30px]">
                Book a demo
              </ButtonLink>
              <ButtonLink href={whyFlashPages.accuracyMethod.path} variant="outline-dark" className="px-[30px]">
                Read the accuracy method
              </ButtonLink>
            </div>
            <div className="hero-visual">
              <TechnologyFigure />
            </div>
          </div>
        </HeroSection>

        {/* Definitions */}
        <section aria-labelledby="what-each-measures" className="bg-neutral-0">
          <div className="container-page flex flex-col gap-10 py-20 lg:py-28">
            <SectionHeading id="what-each-measures" kicker="Definitions" className="max-w-[900px]">
              What does each technology actually measure?
            </SectionHeading>
            <ul className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
              {technologies.map((tech) => (
                <li key={tech.name} className="flex flex-col gap-3">
                  <div className="relative aspect-[384/216] overflow-hidden rounded-[12px] bg-neutral-900">
                    <Image
                      src={tech.image.src}
                      alt={tech.image.alt}
                      fill
                      sizes="(min-width: 1440px) 384px, (min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                      className="object-cover"
                    />
                    <div aria-hidden className="why-flash-photo-grade absolute inset-0" />
                    <p className="absolute bottom-4 left-4 text-micro font-bold tracking-[0.13em] text-viz-gold uppercase">
                      {tech.tag}
                    </p>
                  </div>
                  <h3 className="text-h3 leading-h3 font-bold text-text">{tech.name}</h3>
                  <p className="text-body text-text-muted">{tech.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Comparison table */}
        <section aria-labelledby="compare" className="bg-surface-sunken">
          <div className="container-page flex flex-col gap-8 py-20 lg:py-28">
            <SectionHeading id="compare" kicker="Side by side" className="max-w-[1100px]">
              How do they compare on lead time, false alarms and cost?
            </SectionHeading>
            <div className="relative overflow-x-auto rounded-md border border-border bg-neutral-0">
              <table className="w-full min-w-[860px] border-collapse text-left">
                <caption className="sr-only">
                  Detection network, electrostatic sensor and AI prediction (Flash) compared on what each measures, lead
                  time, where it works, false-alarm behaviour, cost and install, and what each is best for.
                </caption>
                <thead className="bg-surface-raised">
                  <tr className="border-b border-border">
                    <th scope="col" className="w-[19%] px-5 py-[14px] text-micro font-semibold tracking-label text-text-muted uppercase">
                      Criterion
                    </th>
                    {techColumns.map((col, i) => (
                      <th
                        key={col}
                        scope="col"
                        className={`w-[27%] px-5 py-[14px] text-micro font-semibold tracking-label uppercase ${
                          i === 2 ? 'text-brand-blue' : 'text-text-muted'
                        }`}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {techRows.map((row, r) => (
                    <tr key={row.criterion} className={r < techRows.length - 1 ? 'border-b border-border' : ''}>
                      <th scope="row" className="px-5 py-4 align-top text-[15px] leading-body-s font-semibold text-text">
                        {row.criterion}
                      </th>
                      {row.cells.map((cell, c) => (
                        <td key={c} className="px-5 py-4 align-top text-[15px] leading-body-s text-text">
                          <LinkifiedText text={cell} links={row.links} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Guidance note */}
        <section aria-labelledby="guidance" className="bg-neutral-0">
          <div className="container-page flex flex-col gap-10 py-20 lg:flex-row lg:items-start lg:gap-20 lg:py-28">
            <SectionHeading id="guidance" kicker="Read this before you buy" className="lg:w-[408px] lg:shrink xl:shrink-0">
              Why does athletic-safety guidance warn about “lightning prediction” devices?
            </SectionHeading>
            <div className="flex flex-col gap-4 text-body text-text lg:w-narrow lg:shrink xl:shrink-0">
              {guidanceParagraphs.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
              <ul className="flex flex-wrap gap-x-8 pt-2">
                {[
                  { label: 'Read the Accuracy Method', href: whyFlashPages.accuracyMethod.path },
                  links.georgia,
                  links.schools,
                  {
                    label: 'Blog: prediction vs detection',
                    href: '/resources/blog/lightning-prediction-vs-detection/',
                  },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="inline-flex min-h-11 items-center text-[15px] leading-body-s font-semibold text-brand-blue hover:underline"
                    >
                      {l.label}&nbsp;<span aria-hidden>→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Recommended stack */}
        <section aria-labelledby="what-to-run" className="bg-brand-navy">
          <div className="container-page flex flex-col gap-10 py-20 lg:py-28">
            <div className="flex flex-col gap-3">
              <SectionHeading id="what-to-run" kicker="Use them together" tone="dark" className="max-w-[900px]">
                What should a safety officer actually run?
              </SectionHeading>
              <p className="max-w-narrow text-body text-text-on-dark-muted">
                Not one or the other. Each does one job well, and a written policy can name all three.
              </p>
            </div>
            <figure
              aria-label="Three-step diagram of the recommended stack: Flash prediction for the 60 minutes before a storm, a detection feed to confirm strikes, and a sideline WBGT sensor for policy readings"
            >
              <ol className="grid gap-10 lg:grid-cols-3 lg:gap-6">
                {safetyStack.map((item) => (
                  <li key={item.step} className="flex flex-col gap-[14px] border-t border-border-on-dark pt-6">
                    <p aria-hidden className="text-display-m leading-display-m font-bold tracking-[-0.03em] text-neutral-600">
                      {item.step}
                    </p>
                    <p
                      className={`text-[11px] leading-[14px] font-semibold tracking-label uppercase ${
                        item.gold ? 'text-viz-gold' : 'text-text-on-dark-muted'
                      }`}
                    >
                      {item.when}
                    </p>
                    <h3 className="text-h4 leading-h4 font-bold text-text-on-dark">{item.name}</h3>
                    <p className="text-[15px] leading-body-s text-text-on-dark-muted">{item.body}</p>
                  </li>
                ))}
              </ol>
            </figure>
            <div className="flex flex-col gap-3 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:gap-[14px]">
              <span aria-hidden className="bg-gold-metallic flex size-7 shrink-0 items-center justify-center rounded-full">
                <svg width="12" height="16" viewBox="0 0 26 34">
                  <path d={BOLT_PATH} fill="#070D26" />
                </svg>
              </span>
              <p className="grow text-[17px] leading-body text-[#DCE2F0]">
                Flash Agent answers from the same cells and acts in your tools.
              </p>
              <Link
                href={links.agent.href}
                className="inline-flex min-h-11 shrink-0 items-center text-body-s leading-caption font-semibold text-viz-gold hover:underline"
              >
                See Flash Agent&nbsp;<span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Glossary */}
        <section aria-labelledby="glossary" className="bg-neutral-0">
          <div className="container-page flex flex-col gap-8 py-20 lg:py-28">
            <SectionHeading id="glossary" kicker="Glossary" className="max-w-[900px]">
              Terms you will meet in every lightning-safety policy
            </SectionHeading>
            <dl className="grid gap-x-12 lg:grid-cols-2">
              {[glossary.slice(0, 4), glossary.slice(4)].map((column, c) => (
                <div key={c} className="flex flex-col">
                  {column.map((item, i) => (
                    <div
                      key={item.term}
                      className={`flex flex-col gap-1 border-b border-border py-4 sm:flex-row sm:gap-5 ${
                        i === column.length - 1 ? (c === 1 ? 'border-b-0' : 'lg:border-b-0') : ''
                      }`}
                    >
                      <dt className="text-body leading-body-s font-semibold text-text sm:w-[180px] sm:shrink-0">
                        {item.term}
                      </dt>
                      <dd className="text-[15px] leading-body-s text-text-muted">{item.definition}</dd>
                    </div>
                  ))}
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq" className="border-t border-border bg-surface-sunken">
          <div className="container-page flex flex-col gap-8 py-20 lg:py-28">
            <SectionHeading id="faq" kicker="FAQ" className="max-w-[900px]">
              Questions safety officers ask about prediction, sensors and detection
            </SectionHeading>
            <FaqList faqs={predictionFaqs} />
          </div>
        </section>

        <WhyFlashLinks current="predictionVsSensors" extra={[links.lightning, links.schools, links.pricing]} />

      </main>
      <SiteFooter eyebrow="Book a demo · No sensors to install" />
    </>
  );
}
