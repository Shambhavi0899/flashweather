import Image from 'next/image';
import Link from 'next/link';

import { Motion } from '@/components/motion';
import { SectionHeader, SectionLabel } from '@/components/products/section-header';
import { productPaths } from '@/content/products';

import {
  type SpecRow,
  type Verdict,
  decisionLinks,
  decisions,
  deliverySpecs,
  forecastSpecs,
  parameters,
  policyImage,
  wbgtBands,
} from './content';
import { AgentRule } from './agent-rule';
import { AudiencePicker } from './audiences';
import { NoonBanner } from './noon-banner';
import { georgiaBands, policyStates } from './policy-states';
import { Sparkline } from './sparkline';
import { SpecThermometer } from './spec-thermometer';
import { StatePolicyPicker } from './state-policy';

/** Four equal columns on desktop, divided by hairlines; a stacked list below. */
const columnClass =
  'flex flex-col gap-[14px] border-border py-6 first:pt-0 last:pb-0 max-lg:border-t max-lg:first:border-t-0 lg:py-0 lg:px-10 lg:first:pl-0 lg:last:pr-0 lg:[&:not(:first-child)]:border-l';

/* ---------------- What it predicts ---------------- */

export function PredictsSection() {
  return (
    <section aria-labelledby="predicts-heading" className="border-t border-border bg-surface-sunken">
      <div className="container-page flex flex-col gap-12 py-20 lg:gap-14 lg:py-[120px]">
        <SectionHeader
          id="predicts-heading"
          labelEmphasis="strong"
          label="What it predicts · Four heat parameters · One grid"
          heading="What does Flash predict for heat?"
          aside={
            <p>
              Four parameters per 1 km cell, from the same engine and the same run as the lightning and hail products.
              Hourly across a 6-hour outlook, refreshed every 2 minutes.
            </p>
          }
        />
        <div className="flex flex-col gap-7 border-t border-border pt-10">
          <p className="text-micro font-semibold tracking-label text-text-muted uppercase">
            Illustrative · Practice Field B · Now → 6 pm
          </p>
          <ul className="hsp grid lg:grid-cols-4">
            {parameters.map((item, i) => (
              <Motion as="li" key={item.title} className={`motion hsp-col ${columnClass}`} replay={false}>
                <Sparkline id={`hsp-${i}`} title={item.title} values={item.outlook} />
                <p className="text-micro font-semibold tracking-label text-text-subtle uppercase">{item.meta}</p>
                <h3 className="text-[22px] leading-body-l font-semibold text-text">{item.title}</h3>
                <p className="text-[15px] leading-6 text-pretty text-text-muted">{item.body}</p>
              </Motion>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Forecast vs measurement ---------------- */

const verdictTone: Record<Verdict['tone'], string> = {
  strong: 'text-text',
  muted: 'text-text-subtle',
  blue: 'text-brand-blue',
};

/** The verdict that gets the stamp; "Supports." and "Cannot." stay plain. */
const DECIDES = 'Decides.';

function VerdictCell({ verdict, label }: { verdict: Verdict; label: string }) {
  return (
    <td className="hd-cell flex flex-col gap-[2px] lg:table-cell lg:pr-8 lg:align-top">
      <span className="text-micro font-semibold tracking-label text-text-subtle uppercase lg:hidden">{label}</span>
      <span className={`block text-[15px] leading-body-s font-semibold ${verdictTone[verdict.tone]}`}>
        {verdict.verdict === DECIDES ? (
          <span className="hd-stamp">
            <CheckMark />
            {verdict.verdict}
          </span>
        ) : (
          verdict.verdict
        )}
      </span>
      <span className="block text-body-s leading-5 text-text-muted">{verdict.detail}</span>
    </td>
  );
}

/** The green check beside "Decides."; its stroke draws in as the stamp lands. */
function CheckMark() {
  return (
    <svg aria-hidden viewBox="0 0 14 14" className="hd-check size-[14px]">
      <path
        d="M2.5 7.4 5.6 10.4 11.5 3.8"
        pathLength={1}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DecisionSection() {
  return (
    <section aria-labelledby="decision-heading" className="bg-neutral-0">
      <div className="container-page flex flex-col gap-12 py-20 lg:py-[120px]">
        <SectionHeader
          id="decision-heading"
          labelEmphasis="strong"
          label="Forecast vs measurement · The schools rule"
          heading="Forecast or measurement: which one decides?"
          aside={
            <p>
              GHSA and most state policies read the meter on the field. Flash does not replace it. Policy compliance
              uses the sensor; planning uses Flash.
            </p>
          }
        />

        <table className="hd-table w-full border-collapse text-left">
          <caption className="sr-only">Which decisions the on-site sensor makes and which the Flash forecast makes</caption>
          <thead className="max-lg:sr-only">
            <tr className="border-b border-border-strong">
              <th scope="col" className="w-[320px] pb-[14px] text-micro font-semibold tracking-label text-text-muted uppercase">
                The decision
              </th>
              <th scope="col" className="w-[420px] pb-[14px] text-micro font-semibold tracking-label text-text-muted uppercase">
                Your on-site sensor
              </th>
              <th scope="col" className="pb-[14px] text-micro font-semibold tracking-label text-brand-blue-soft uppercase">
                Flash forecast
              </th>
            </tr>
          </thead>
          <tbody>
            {decisions.map((row) => (
              <Motion
                as="tr"
                key={row.decision}
                replay={false}
                className="motion hd-row flex flex-col gap-4 border-b border-border py-[22px] lg:table-row lg:py-0 lg:[&>*]:py-[22px]"
              >
                <th scope="row" className="hd-cell text-[17px] leading-6 font-medium text-text lg:pr-6 lg:align-top">
                  {row.decision}
                </th>
                <VerdictCell verdict={row.sensor} label="Your on-site sensor" />
                <VerdictCell verdict={row.flash} label="Flash forecast" />
              </Motion>
            ))}
          </tbody>
        </table>

        <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6">
          {decisionLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-body-s leading-5 font-medium text-brand-blue hover:underline">
                {link.label} <span aria-hidden>→</span>
              </Link>
            </li>
          ))}
        </ul>

        <NoonBanner />
      </div>
    </section>
  );
}

/* ---------------- Who it is for ---------------- */

export function AudiencesSection() {
  return (
    <section aria-labelledby="audiences-heading" className="border-t border-border bg-surface-sunken">
      <div className="container-page flex flex-col gap-12 py-20 lg:py-[120px]">
        <SectionHeader
          id="audiences-heading"
          labelEmphasis="strong"
          label="Who it is for · Heat safety software for four jobs"
          heading="Who plans with the WBGT outlook?"
          aside={
            <p>
              Anyone who has to decide hours before the heat arrives, and prove afterwards that the decision was made on
              the numbers.
            </p>
          }
        />
        <AudiencePicker />
      </div>
    </section>
  );
}

/* ---------------- Ask Flash ---------------- */

export function AskFlashSection() {
  return (
    <section aria-labelledby="ask-flash-heading" className="bg-brand-navy-deep">
      <div className="container-page flex flex-col gap-12 py-20 lg:py-28">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="flex max-w-[640px] flex-col gap-5">
            <SectionLabel tone="dark" emphasis="strong">
              Flash Agent · Illustrative example · Not live weather
            </SectionLabel>
            <h2
              id="ask-flash-heading"
              className="text-[32px] leading-[38px] font-extrabold tracking-[-0.03em] text-text-on-dark lg:text-h1 lg:leading-h1"
            >
              Ask Flash about Thursday&rsquo;s practice.
            </h2>
          </div>
          <div className="flex flex-col gap-3 lg:w-panel lg:shrink xl:shrink-0">
            <p className="text-body text-pretty text-[#C9D1E3]">
              Flash Agent reads the same WBGT cells and the same run as this page, then answers or acts in the calendar
              and the phones your staff already use. A person confirms before anything moves; every action is logged.
            </p>
            <Link href={productPaths.agent} className="text-body-s leading-5 font-medium text-viz-gold hover:underline">
              How Flash Agent works <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        <AgentRule />
      </div>
    </section>
  );
}

/* ---------------- State heat policies ---------------- */

export function StatePoliciesSection() {
  return (
    <section aria-labelledby="state-policy-heading" className="border-t border-border bg-surface-sunken">
      <Motion
        replay={false}
        threshold={0.3}
        className="motion hst-section container-page flex flex-col gap-12 py-20 lg:flex-row lg:items-start lg:gap-24 lg:py-[120px]"
      >
        <div className="flex flex-col gap-5 lg:w-[460px] lg:shrink xl:shrink-0">
          <SectionLabel emphasis="strong">State policy · GHSA and its siblings</SectionLabel>
          <h2
            id="state-policy-heading"
            className="text-[32px] leading-[38px] font-extrabold tracking-[-0.03em] text-text lg:text-display-m lg:leading-display-m"
          >
            Which state heat policy applies to you?
          </h2>
          <p className="text-body text-pretty text-text-muted">
            Flash ships the GHSA activity bands at 82, 87, 90 and 92 °F WBGT by default and lets you set your own
            state&rsquo;s or district&rsquo;s thresholds per field. Georgia&rsquo;s policy is written up in full; the
            sibling pages follow the same format.
          </p>
          <div className="relative isolate flex h-[240px] items-end overflow-hidden rounded-lg p-[22px]">
            <Image
              src={policyImage.src}
              alt={policyImage.alt}
              fill
              sizes="(min-width: 1024px) 460px, 100vw"
              className="-z-20 object-cover"
            />
            <div aria-hidden className="products-photo-grade-15-88 absolute inset-0 -z-10" />
            <p className="hst-caption max-w-[400px] text-[15px] leading-body-s font-extrabold tracking-heading text-white">
              Your state sets the bands. Flash ships them.
            </p>
          </div>
        </div>

        <div className="grow basis-0">
          <StatePolicyPicker states={policyStates()} bands={georgiaBands()} />
        </div>
      </Motion>
    </section>
  );
}

/* ---------------- Spec table ---------------- */

function SpecTable({ heading, rows }: { heading: string; rows: SpecRow[] }) {
  return (
    <table className="w-full grow basis-0 border-collapse text-left">
      <thead>
        <tr className="border-b border-border-strong">
          <th scope="col" className="w-[140px] pr-4 pb-[14px] text-micro font-semibold tracking-label text-text-muted uppercase md:w-[220px]">
            {heading}
          </th>
          <th scope="col" className="pb-[14px] text-micro font-semibold tracking-label text-text-muted uppercase">
            Value
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <Motion as="tr" key={row.label} className="motion hsx-row border-b border-border" replay={false}>
            <th scope="row" className="py-[18px] pr-4 align-top text-[15px] leading-body-s font-medium text-text">
              {row.label}
            </th>
            <td className="py-[18px] align-top text-[15px] leading-body-s text-text-muted">
              {row.value}
              {row.link && (
                <>
                  {' '}
                  <Link href={row.link.href} className="font-medium whitespace-nowrap text-brand-blue hover:underline">
                    {row.link.label} <span aria-hidden>→</span>
                  </Link>
                </>
              )}
              {row.heatBar && (
                // The value above already says the numbers; the bar only draws them.
                <span aria-hidden className="hsx-bands">
                  {wbgtBands.map((band, i) => (
                    <span key={band.value} className="hsx-band">
                      <span className="hsx-seg" />
                      <span className="hsx-temp">
                        {band.value}
                        {i === wbgtBands.length - 1 && ' °F'}
                      </span>
                    </span>
                  ))}
                </span>
              )}
            </td>
          </Motion>
        ))}
      </tbody>
    </table>
  );
}

export function SpecSection() {
  return (
    <section aria-labelledby="spec-heading" className="bg-neutral-0">
      <div className="container-page flex flex-col gap-12 py-20 lg:py-[120px]">
        <SectionHeader
          id="spec-heading"
          labelEmphasis="strong"
          label="Specifications · One set of numbers"
          heading="What exactly does the heat model deliver?"
          aside={
            <p>
              The same figures appear on the pricing page and in the order form. Scoring method for every parameter:{' '}
              <Link href="/why-flash/accuracy-method/" className="font-medium text-brand-blue hover:underline">
                accuracy method
              </Link>
              .
            </p>
          }
        />
        <SpecThermometer>
          <div className="flex flex-col gap-12 lg:flex-row">
            <SpecTable heading="Forecast" rows={forecastSpecs} />
            <SpecTable heading="Delivery" rows={deliverySpecs} />
          </div>
        </SpecThermometer>
      </div>
    </section>
  );
}
