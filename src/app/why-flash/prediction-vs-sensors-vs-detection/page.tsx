import Image from 'next/image';
import Link from 'next/link';

import { BOLT_PATH } from '@/components/bolt-path';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ButtonLink } from '@/components/button';
import { HeroBackground, HeroSection, HeroWords } from '@/components/hero/hero';
import { Motion } from '@/components/motion';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { FaqList } from '@/components/why-flash/faq-list';
import { Glossary } from '@/components/why-flash/glossary';
import { MeasureLabel, MeasureMarks } from '@/components/why-flash/measure-overlay';
import { SafetyStack } from '@/components/why-flash/safety-stack';
import { Kicker, SectionHeading } from '@/components/why-flash/section-heading';
import { TechCompare } from '@/components/why-flash/tech-compare';
import { TechnologyFigure } from '@/components/why-flash/technology-figure';
import { WhyFlashLinks } from '@/components/why-flash/why-flash-links';
import { DEMO_HREF } from '@/content/navigation';
import {
  WHY_FLASH_HOME,
  glossary,
  guidanceParagraphs,
  links,
  predictionFaqs,
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
                // The site's wave reveal (styles/parameter-card.css); hovering a
                // card draws what it sees over its image (styles/why-flash-measures.css).
                <Motion as="li" key={tech.name} replay={false} threshold={0.2} className="motion scroll-flow-card flex">
                  <article className="pc wfm flex w-full flex-col gap-3">
                    <div className="relative flex flex-col gap-2">
                      <div className="relative aspect-[384/216] overflow-hidden rounded-[12px] bg-neutral-900">
                        <div className="pc-photo absolute inset-0">
                          <Image
                            src={tech.image.src}
                            alt={tech.image.alt}
                            fill
                            sizes="(min-width: 1440px) 384px, (min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                            className="object-cover"
                          />
                        </div>
                        <div aria-hidden className="why-flash-photo-grade absolute inset-0" />
                        <MeasureMarks kind={tech.sees.kind} />
                        <p className="absolute bottom-4 left-4 text-micro font-bold tracking-[0.13em] text-viz-gold uppercase">
                          {tech.tag}
                        </p>
                      </div>
                      <MeasureLabel kind={tech.sees.kind} label={tech.sees.label} />
                    </div>
                    <h3 className="text-h3 leading-h3 font-bold text-text">{tech.name}</h3>
                    <p className="text-body text-text-muted">{tech.body}</p>
                  </article>
                </Motion>
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
            <TechCompare />
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
            <SafetyStack />
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
            <Glossary terms={glossary} />
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
