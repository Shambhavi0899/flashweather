import Image from 'next/image';
import Link from 'next/link';

import { HeroBackground } from '@/components/hero/hero';
import { site } from '@/lib/seo/site';

const h2 = 'text-[32px] leading-[38px] font-extrabold tracking-[-0.03em] text-text md:text-h1 md:leading-h1';

/**
 * The navy band behind the headline, with the Command Center map graded into
 * it. On desktop it spans the top half of the hero and the form card sits
 * across its edge; on mobile it sits behind the headline block only.
 */
export function ContactHeroBand() {
  return (
    <div
      aria-hidden
      className="contact-hero-band absolute inset-x-0 top-0 hidden h-[512px] overflow-hidden lg:block"
    >
      <HeroBackground>
        <Image
          src="/images/contact/flash-weather-command-center-map-hero-backdrop.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[50%_40%] opacity-48"
        />
      </HeroBackground>
      <div className="contact-hero-grade-left absolute inset-0" />
      <div className="contact-hero-grade-bottom absolute inset-0" />
    </div>
  );
}

const nextSteps = [
  'We map your sites: every field, course, yard or roof as 1 km cells, with the thresholds your policy already names.',
  "We replay last season's strikes against Flash's predictions for those cells, so you see real lead times rather than a demo storm.",
  'You see the alert log your team would have received: who would have been told, when, and by which channel.',
];

export function WhatHappensNext() {
  return (
    <section aria-labelledby="next-heading" className="flex flex-col gap-5">
      <h2 id="next-heading" className="text-[22px] leading-h4 font-extrabold tracking-[-0.03em] text-text">
        What happens next
      </h2>
      <ol className="flex flex-col gap-5">
        {nextSteps.map((step, i) => (
          <li key={step} className="flex items-start gap-4">
            <span aria-hidden className="w-10 shrink-0 text-body-l leading-h4 font-bold text-brand-blue">
              {String(i + 1).padStart(2, '0')}
            </span>
            <p className="text-[17px] leading-h4 text-text">{step}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function VerifiedDetails() {
  const details = [
    {
      label: 'Email',
      value: (
        <a href={`mailto:${site.email}`} className="hover:underline">
          {site.email}
        </a>
      ),
      note: 'Sales, support and press. Answered within one business day.',
    },
    { label: 'Headquarters', value: 'Canton, Georgia', note: 'Atlanta metro · Flash Scientific Technology Inc.' },
    { label: 'Hours', value: 'Mon–Fri 8am–6pm ET', note: 'Storm-day support around the clock on enterprise plans.' },
    {
      label: 'Phone',
      value: 'Request a call-back on the form',
      note: 'No public switchboard. A meteorologist calls you at the time you pick.',
    },
  ];
  return (
    <section aria-labelledby="details-heading" className="border-y border-border bg-surface-sunken">
      <div className="container-page flex flex-col gap-7 py-14 lg:py-[72px]">
        <h2
          id="details-heading"
          className="text-[26px] leading-[32px] font-extrabold tracking-[-0.03em] text-text md:text-[28px] md:leading-[34px]"
        >
          Verified contact details
        </h2>
        <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {details.map((d, i) => (
            <div
              key={d.label}
              className={`flex flex-col gap-2 lg:px-6 ${i === 0 ? 'lg:pl-0' : 'lg:border-l lg:border-border'} ${
                i === details.length - 1 ? 'lg:pr-0' : ''
              }`}
            >
              <dt className="text-micro font-semibold tracking-label text-text-subtle uppercase">{d.label}</dt>
              <dd className="flex flex-col gap-2">
                <span className="text-body-l leading-body font-semibold text-text">{d.value}</span>
                <span className="text-body-s leading-[21px] text-text-muted">{d.note}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function OtherWaysIn() {
  const rows = [
    {
      who: 'Existing customers',
      what: 'Support desk for alert routing, user changes and horn, SMS or API integrations.',
      link: { label: site.email, href: `mailto:${site.email}` },
    },
    {
      who: 'Press',
      what: 'Logo files, boilerplate, founder bio and the fact sheet, all self-hosted.',
      link: { label: 'Press & partners', href: '/press-and-partners/' },
    },
    {
      who: 'Partnerships',
      what: 'Distribution, integration and data partnerships, with what each current partner does with Flash.',
      link: { label: 'Press & partners', href: '/press-and-partners/' },
    },
    {
      who: 'Developers',
      what: 'Flash API reference, webhooks and the 1 km cell model for lightning and hail predictions.',
      link: { label: 'Flash API offerings', href: '/products/api-offerings/' },
    },
  ];
  return (
    <section aria-labelledby="ways-heading" className="bg-neutral-0">
      <div className="container-page flex flex-col gap-7 py-16 lg:py-[112px]">
        <h2 id="ways-heading" className={h2}>
          Other ways in
        </h2>
        <ul className="flex flex-col border-b border-border">
          {rows.map((r) => (
            <li key={r.who} className="flex flex-col gap-2 border-t border-border py-5 lg:flex-row lg:items-center lg:gap-8">
              <h3 className="text-h4 leading-h4 font-semibold tracking-heading text-text lg:w-[260px] lg:shrink xl:shrink-0">
                {r.who}
              </h3>
              <p className="text-[17px] leading-h4 text-text-muted lg:w-[520px] lg:shrink xl:shrink-0">{r.what}</p>
              {r.link.href.startsWith('mailto:') ? (
                <a
                  href={r.link.href}
                  className="flex min-h-[44px] items-center text-body-s leading-5 font-medium text-brand-blue hover:underline"
                >
                  {r.link.label}
                </a>
              ) : (
                <Link
                  href={r.link.href}
                  className="flex min-h-[44px] items-center text-body-s leading-5 font-medium text-brand-blue hover:underline"
                >
                  {r.link.label} <span aria-hidden>&nbsp;→</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** The HQ map, drawn as inline SVG the way the design draws it. */
function HqMap() {
  return (
    <figure className="flex flex-col gap-[10px] lg:w-[640px] lg:shrink xl:shrink-0">
      <div className="relative aspect-[640/340] w-full overflow-hidden rounded-lg bg-brand-navy">
        <svg
          viewBox="0 0 640 340"
          role="img"
          aria-label="Map of the Atlanta metro with a pin on Canton, Georgia, where Flash Weather AI is headquartered"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M40 0V340M80 0V340M120 0V340M160 0V340M200 0V340M240 0V340M280 0V340M320 0V340M360 0V340M400 0V340M440 0V340M480 0V340M520 0V340M560 0V340M600 0V340M0 40H640M0 80H640M0 120H640M0 160H640M0 200H640M0 240H640M0 280H640M0 320H640"
            fill="none"
            stroke="var(--color-border-on-dark)"
          />
          <path d="M0 214C120 222 250 180 640 112" fill="none" stroke="var(--color-neutral-800)" strokeWidth="2" />
          <path
            d="M150 270C220 250 300 222 350 192S400 162 418 146"
            fill="none"
            stroke="var(--color-neutral-600)"
            strokeWidth="2.5"
          />
          <rect x="400" y="120" width="40" height="40" fill="var(--color-viz-gold)" stroke="var(--color-viz-gold)" />
          <circle cx="420" cy="140" r="22" fill="none" stroke="var(--color-viz-gold)" strokeWidth="1.5" />
          <circle cx="420" cy="140" r="6" fill="var(--color-viz-gold)" stroke="var(--color-neutral-0)" strokeWidth="2" />
          <circle cx="150" cy="270" r="4" fill="var(--color-neutral-400)" />
          <text x="452" y="138" fontSize="12" fontWeight="600" letterSpacing="0.96" fill="#FFFFFF">
            CANTON, GA
          </text>
          <text x="452" y="154" fontSize="12" fill="var(--color-text-on-dark-muted)">
            Flash Scientific Technology Inc.
          </text>
          <text x="162" y="274" fontSize="11" fontWeight="600" letterSpacing="0.88" fill="var(--color-text-on-dark-muted)">
            ATLANTA
          </text>
        </svg>
        <p className="absolute top-4 left-4 rounded-sm bg-brand-navy-deep px-[10px] py-[6px] text-[10px] leading-[14px] font-semibold tracking-[0.12em] text-text-on-dark-muted">
          1 KM GRID · ATLANTA METRO
        </p>
      </div>
    </figure>
  );
}

export function WhereWeAre() {
  return (
    <section aria-labelledby="where-heading" className="border-t border-border bg-surface-sunken">
      <div className="container-page flex flex-col gap-12 py-16 lg:flex-row lg:items-center lg:gap-16 lg:py-[112px]">
        <HqMap />
        <div className="flex min-w-0 flex-col gap-4 lg:w-[544px] lg:shrink xl:shrink-0">
          <h2 id="where-heading" className={h2}>
            Where we are
          </h2>
          <p className="text-[17px] leading-h4 text-text-muted">
            Flash Scientific Technology Inc. is headquartered in Canton, Georgia, in the Atlanta metro. Most demos run
            remotely with your sites loaded in advance; on-site visits are by appointment through the form.
          </p>
          <p className="text-[17px] leading-h4 text-text-muted">
            Founded by{' '}
            <Link href="/about-us/" className="font-medium text-brand-blue hover:underline">
              Jason Deese
            </Link>
            , a former NOAA National Weather Service forecaster. Coverage: continental U.S., Canada and Mexico.
          </p>
          <div className="relative mt-2 flex aspect-[544/280] w-full overflow-hidden rounded-lg bg-brand-navy-deep">
            <Image
              src="/images/contact/flash-weather-ai-canton-georgia-office-storm-sky.png"
              alt="Wooded north Georgia foothills under a clearing storm sky at first light, with a low-rise office lit at the edge of the treeline, beside the Where we are and support details"
              fill
              sizes="(min-width: 1024px) 544px, 100vw"
              className="object-cover"
            />
            <div aria-hidden className="contact-office-grade absolute inset-0" />
            <p className="absolute top-[18px] left-5 text-[10px] leading-3 font-extrabold tracking-[0.13em] text-viz-gold">
              CANTON, GEORGIA
            </p>
            <p className="absolute right-5 bottom-[18px] left-5 max-w-[420px] text-[17px] leading-body-s font-extrabold tracking-display text-text-on-dark">
              Support answers from the same building the forecasts come from.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
