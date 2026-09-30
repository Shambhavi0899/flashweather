import Image from 'next/image';
import Link from 'next/link';

import { Breadcrumbs } from '@/components/breadcrumbs';
import { HeroBackground, HeroSection, HeroWords } from '@/components/hero/hero';
import { Motion } from '@/components/motion';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { HitDiagram } from '@/components/why-flash/hit-diagram';
import { OnThisPage } from '@/components/why-flash/on-this-page';
import { IllustrativeChip, Kicker } from '@/components/why-flash/section-heading';
import { WhyFlashLinks } from '@/components/why-flash/why-flash-links';
import { DEMO_HREF } from '@/content/navigation';
import {
  WHY_FLASH_HOME,
  accuracyFacts,
  accuracySections,
  links,
  notCovered,
  reproduceSteps,
  reviewer,
  scoreSteps,
  whyFlashPages,
  workedExample,
} from '@/content/why-flash';
import { JsonLd, datasetSchema, techArticleSchema } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';

const page = whyFlashPages.accuracyMethod;
const H1 = 'How Flash measures 99.6% lightning-prediction accuracy';

export const metadata = buildMetadata({
  title: page.title,
  description: page.description,
  path: page.path,
  type: 'article',
});

const h2 = 'scroll-mt-24 text-[26px] leading-[32px] font-extrabold tracking-[-0.03em] text-text md:text-[30px] md:leading-[36px]';

const resultTone = {
  Hit: 'bg-alert-clear',
  'False alarm': 'bg-alert-watch',
  Miss: 'bg-alert-warning',
} as const;

function Steps({ items }: { items: string[] }) {
  return (
    <ol className="flex flex-col gap-4">
      {items.map((text, i) => (
        <li key={text.slice(0, 24)} className="flex items-start gap-4">
          <span aria-hidden className="w-8 shrink-0 pt-[3px] text-micro font-bold text-brand-blue">
            {String(i + 1).padStart(2, '0')}
          </span>
          <p className="text-body text-text">{text}</p>
        </li>
      ))}
    </ol>
  );
}

export default function AccuracyMethodPage() {
  return (
    <>
      <SiteHeader tone="dark" />
      <main id="main">
        <JsonLd
          schema={techArticleSchema({
            title: H1,
            description: page.description,
            path: page.path,
            author: { name: reviewer.name, jobTitle: 'Founder and Chief Meteorologist' },
          })}
        />
        <JsonLd
          schema={datasetSchema({
            name: 'Flash lightning-prediction validation dataset',
            description:
              'Per-cell record of Flash lightning flags matched to independent cloud-to-ground strike records, used to compute the published 99.6% one-hour lightning-prediction accuracy.',
            path: page.path,
            variables: [
              'cell id',
              'cell centroid',
              'flag timestamp',
              'alert level',
              'matched ground-truth strike timestamp or none',
            ],
            howToObtain: 'Email support@flashweather.ai with the subject “Validation dataset”.',
            format: 'text/csv',
          })}
        />

        {/* Hero */}
        <HeroSection theme="dark" className="relative overflow-hidden bg-brand-navy-deep">
          <HeroBackground>
            <Image
              src="/images/why-flash/flash-open-plain-clearing-storm-scoring-area.jpg"
              alt="A wide aerial view of an open plain at first light under a dissipating storm, the hero backdrop for how Flash scores its lightning-prediction accuracy cell by cell"
              fill
              preload
              sizes="100vw"
              className="object-cover"
            />
          </HeroBackground>
          <div aria-hidden className="why-flash-accuracy-hero-grade absolute inset-0" />
          <div className="hero-copy container-page relative flex flex-col gap-6 pt-10 pb-16 lg:pb-24">
            <Breadcrumbs
              tone="dark"
              className="hero-crumbs"
              trail={[
                { name: 'Home', path: '/' },
                { name: 'Why Flash', path: WHY_FLASH_HOME },
                { name: 'Accuracy method', path: page.path },
              ]}
            />
            <Kicker tone="dark" className="hero-eyebrow pt-2">
              Accuracy method · How 99.6% is scored
            </Kicker>
            <h1 className="max-w-narrow text-[36px] leading-[42px] font-extrabold tracking-[-0.05em] text-text-on-dark md:text-display-l md:leading-display-l">
              <HeroWords text={H1} />
            </h1>
            <p className="hero-lede max-w-narrow text-body-l text-neutral-300 md:text-[19px]">
              99.6% is Flash&rsquo;s lightning-prediction accuracy on the one-hour window: the share of cloud-to-ground
              strikes that landed inside a 1×1 km cell Flash had already flagged during the preceding hour, scored
              against an independent record of where lightning actually struck.
            </p>
            <dl className="hero-support flex flex-wrap gap-[10px] pt-2">
              {accuracyFacts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex flex-col gap-1 rounded-sm border border-white/10 bg-[#040818B8] px-[14px] py-[10px]"
                >
                  <dt className="text-[10px] leading-3 font-bold tracking-[0.13em] text-text-on-dark-muted uppercase">
                    {fact.label}
                  </dt>
                  <dd className="text-body-s leading-caption font-bold text-text-on-dark">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </HeroSection>

        {/* Document body */}
        <div className="bg-neutral-0">
          <div className="container-page flex flex-col gap-12 py-16 lg:flex-row lg:gap-24 lg:py-20">
            <OnThisPage items={accuracySections} />

            <article className="flex min-w-0 flex-col gap-14 lg:w-narrow lg:shrink xl:shrink-0">
              <Motion replay={false} threshold={0.15} className="motion">
                <section aria-labelledby="summary" className="wam-rise flex flex-col gap-4">
                  <h2 id="summary" className={h2}>
                    Summary
                  </h2>
                  <p className="text-body text-text">
                    This page is the single source for the accuracy figure Flash publishes. Any other page that quotes
                    99.6% links here, and the figure is always printed with its window and its ground truth.
                  </p>
                  <p className="text-body text-text">
                    Read plainly, 99.6% is a hit rate on the one-hour window: of the cloud-to-ground strikes recorded by
                    the ground-truth network, 99.6% landed inside a cell Flash had already flagged at Advisory or higher
                    during the previous hour. It is not a claim about exact strike points, about intra-cloud lightning, or
                    about sites outside our coverage, and the sections below say so.
                  </p>
                </section>
              </Motion>

              <Motion replay={false} threshold={0.15} className="motion">
                <section aria-labelledby="ground-truth" className="wam-rise flex flex-col gap-4">
                  <h2 id="ground-truth" className={h2}>
                    Ground truth
                  </h2>
                  <p className="text-body text-text">
                    Every score on this page is computed against cloud-to-ground (CG) strike records from an independent
                    national lightning-detection network, the same kind of reference most U.S. safety programmes use. The
                    network reports a located CG stroke within seconds of it happening; we treat each located stroke as
                    one ground-truth event. Flash never scores itself against its own output.
                  </p>
                  <p className="text-body text-text">
                    Intra-cloud flashes are excluded from both the forecast target and the score. They do not reach the
                    ground, and counting them would flatter the hit rate.
                  </p>
                </section>
              </Motion>

              <Motion replay={false} threshold={0.15} className="motion">
                <section aria-labelledby="unit-of-measure" className="wam-rise flex flex-col gap-5">
                  <h2 id="unit-of-measure" className={h2}>
                    Unit of measure
                  </h2>
                  <div className="flex flex-col gap-6 md:flex-row">
                    <div className="flex flex-col gap-3 rounded-md border-l-[3px] border-brand-blue bg-surface-sunken px-6 py-5 md:min-w-0 md:flex-1">
                      <p className="text-[11px] leading-[14px] font-bold tracking-[0.13em] text-text-muted uppercase">
                        One hit, defined
                      </p>
                      <p className="text-body font-semibold text-text">
                        A hit is a CG strike inside a 1×1 km cell that Flash flagged at Advisory or higher within the
                        preceding hour.
                      </p>
                      <p className="text-body-s text-text-muted">
                        A miss is a CG strike in a cell with no flag in that window. A false alarm is a flagged cell-window
                        with no CG strike inside it. An all-clear is correct when no CG strike follows it within the
                        return-to-play window your policy sets.
                      </p>
                    </div>
                    <HitDiagram />
                  </div>
                  <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-caption text-text-muted">
                    <li className="flex items-center gap-2">
                      <span aria-hidden className="size-3 shrink-0 rounded-sm bg-alert-clear" />
                      Clear
                    </li>
                    <li className="flex items-center gap-2">
                      <span aria-hidden className="size-3 shrink-0 rounded-sm bg-viz-gold" />
                      Advisory · counts as flagged
                    </li>
                    <li className="flex items-center gap-2">
                      <span aria-hidden className="size-3 shrink-0 rounded-sm bg-alert-watch" />
                      Watch
                    </li>
                    <li className="flex items-center gap-2">
                      <span aria-hidden className="size-3 shrink-0 rounded-sm bg-alert-warning" />
                      Warning
                    </li>
                  </ul>
                </section>
              </Motion>

              <Motion replay={false} threshold={0.15} className="motion">
                <section aria-labelledby="how-the-score-is-built" className="wam-rise flex flex-col gap-4">
                  <h2 id="how-the-score-is-built" className={h2}>
                    How the score is built
                  </h2>
                  <p className="text-body text-text">
                    Every flag Flash issues and every ground-truth strike are placed on the same 1×1 km grid, on the same
                    clock. Each event is then classified by the definitions above, and the score is read off. The
                    arithmetic is fixed before the data arrives, so nobody can move the goalposts after the fact.
                  </p>
                  <Steps items={scoreSteps} />
                  <p className="flex items-center gap-3 rounded-md bg-surface-sunken px-5 py-4 text-body-s leading-5 text-text-muted">
                    <span aria-hidden className="size-2 shrink-0 rounded-xs bg-brand-blue" />
                    Only the one-hour window is scored. The 6-hour outlook is planning guidance and is not scored here.
                  </p>
                </section>
              </Motion>

              <Motion replay={false} threshold={0.15} className="motion">
                <section aria-labelledby="worked-example" className="wam-rise flex flex-col gap-4">
                  <h2 id="worked-example" className={h2}>
                    Worked example
                  </h2>
                  <div>
                    <IllustrativeChip />
                  </div>
                  <p className="text-body text-text">
                    Three cells on one made-up afternoon. The times exist only to show the arithmetic; they do not
                    describe a real storm or a real site.
                  </p>
                  <div className="relative overflow-x-auto rounded-md border border-border">
                    <table className="w-full min-w-[620px] border-collapse text-left">
                      <caption className="sr-only">
                        Illustrative worked example of three 1 km cells on one afternoon: a flagged cell with a strike
                        counted as a hit, a flagged cell with no strike counted as a false alarm, and an unflagged cell
                        with a strike counted as a miss. Not live weather.
                      </caption>
                      <thead className="bg-surface-sunken">
                        <tr className="border-b border-border">
                          {['Cell', 'Flash flag', 'Ground-truth strike', 'Result'].map((h) => (
                            <th
                              key={h}
                              scope="col"
                              className="px-5 py-3 text-[11px] leading-[14px] font-bold tracking-[0.13em] text-text-muted uppercase"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {workedExample.map((row, i) => (
                          <tr key={row.cell} className={i < workedExample.length - 1 ? 'border-b border-border' : ''}>
                            <th scope="row" className="px-5 py-[14px] text-[15px] leading-body-s font-bold text-text">
                              {row.cell}
                            </th>
                            <td className="px-5 py-[14px] text-[15px] leading-body-s text-text">{row.flag}</td>
                            <td className="px-5 py-[14px] text-[15px] leading-body-s text-text">{row.strike}</td>
                            <td className="px-5 py-[14px]">
                              <span
                                className={`inline-flex h-6 items-center rounded-xs px-[10px] text-[11px] leading-[14px] font-extrabold tracking-[0.1em] text-white uppercase ${resultTone[row.result]}`}
                              >
                                {row.result}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[15px] leading-body-s text-text-muted">
                    Over the real scoring period, hits divided by hits plus misses is the published 99.6%. The false-alarm
                    count is reviewed beside it and never folded into it.
                  </p>
                </section>
              </Motion>

              <Motion replay={false} threshold={0.15} className="motion">
                <section aria-labelledby="what-it-does-not-cover" className="wam-rise flex flex-col gap-4">
                  <h2 id="what-it-does-not-cover" className={h2}>
                    What it does not cover
                  </h2>
                  <ul className="flex flex-col gap-4">
                    {notCovered.map((item) => (
                      <li key={item.slice(0, 24)} className="flex items-start gap-[14px]">
                        <span aria-hidden className="relative top-[9px] size-2 shrink-0 rounded-xs bg-brand-blue" />
                        <p className="text-body text-text">{item}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              </Motion>

              <Motion replay={false} threshold={0.15} className="motion">
                <section aria-labelledby="reproduce-it" className="wam-rise flex flex-col gap-4">
                  <h2 id="reproduce-it" className={h2}>
                    Reproduce it
                  </h2>
                  <p className="text-body text-text">
                    Anyone can re-run the score. Request the validation dataset and compute the figure yourself; the
                    definitions above fix the arithmetic before the data arrives.
                  </p>
                  <Steps items={reproduceSteps} />
                  <p className="text-body-s text-text-muted">
                    <a
                      href="mailto:support@flashweather.ai?subject=Validation%20dataset"
                      className="font-semibold text-brand-blue hover:underline"
                    >
                      Request the validation dataset
                    </a>
                  </p>
                </section>
              </Motion>

              <Motion replay={false} threshold={0.15} className="motion">
                <section aria-labelledby="reviewer" className="wam-rise flex flex-col gap-4">
                  <h2 id="reviewer" className={h2}>
                    Reviewer
                  </h2>
                  <div className="flex flex-col gap-6 rounded-lg border border-border bg-surface-sunken p-6 sm:flex-row">
                    <div className="relative aspect-[200/232] w-full shrink-0 overflow-hidden rounded-[12px] bg-neutral-900 sm:w-[200px]">
                      <Image
                        src="/images/why-flash/flash-weather-radar-dome-dawn-reviewer.jpg"
                        alt="A weather radar dome on a low hill at dawn beneath a clearing storm sky, shown beside the reviewer who signs off the accuracy method"
                        fill
                        sizes="(min-width: 480px) 200px, 100vw"
                        className="object-cover"
                      />
                      <div aria-hidden className="why-flash-reviewer-grade absolute inset-0" />
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-4">
                        <span
                          aria-hidden
                          className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-navy text-body-l leading-body-s font-extrabold text-white"
                        >
                          {reviewer.initials}
                        </span>
                        <div className="flex flex-col gap-[2px]">
                          <p className="text-body-l leading-6 font-extrabold tracking-heading text-text">{reviewer.name}</p>
                          <p className="text-[15px] leading-body-s text-text-muted">{reviewer.role}</p>
                        </div>
                      </div>
                      <p className="text-[15px] leading-body-s text-text">{reviewer.bio}</p>
                      <p className="flex items-center gap-4 pt-1 text-[11px] leading-[14px] font-bold tracking-[0.13em] text-text-muted uppercase">
                        <span aria-hidden className="h-px w-10 shrink-0 bg-border-strong sm:w-[160px]" />
                        Reviewed · Current method
                      </p>
                      <p className="text-body-s leading-5 text-text-muted">
                        Questions about the method:{' '}
                        <a href="mailto:support@flashweather.ai" className="font-semibold text-brand-blue hover:underline">
                          support@flashweather.ai
                        </a>{' '}
                        · phone on request via the{' '}
                        <Link href={DEMO_HREF} className="font-semibold text-brand-blue hover:underline">
                          demo form
                        </Link>
                      </p>
                    </div>
                  </div>
                </section>
              </Motion>
            </article>
          </div>
        </div>

        <WhyFlashLinks current="accuracyMethod" extra={[links.lightning, links.hail, links.api, links.contact]} />

      </main>
      <SiteFooter eyebrow="Book a demo · No sensors to install" />
    </>
  );
}
