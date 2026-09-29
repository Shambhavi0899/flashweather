import Image from 'next/image';
import Link from 'next/link';

import { ButtonLink } from '@/components/button';
import { HeroBackground, HeroSection, HeroWords } from '@/components/hero/hero';
import { LinkedText } from '@/components/pricing/linked-text';
import { companyNumbers, founder, milestones, principles, quotedCustomers } from '@/content/about';
import { DEMO_HREF } from '@/content/navigation';
import { site } from '@/lib/seo/site';

const h2 = 'text-[32px] leading-[38px] font-extrabold tracking-[-0.03em] md:text-h1 md:leading-h1';
const eyebrow = 'text-micro font-semibold tracking-label uppercase';

export function AboutHero() {
  return (
    <HeroSection theme="dark" className="relative overflow-hidden bg-brand-navy">
      <HeroBackground storm>
        <Image
          src="/images/about/flash-weather-ai-about-shelf-cloud-open-country.png"
          alt="A storm shelf cloud rolling over open country at dusk with distant rain shafts on a low horizon, graded into navy behind the About headline"
          fill
          preload
          sizes="100vw"
          className="object-cover object-[50%_55%]"
        />
      </HeroBackground>
      <div aria-hidden className="about-hero-grade-left absolute inset-0" />
      <div aria-hidden className="about-hero-grade-bottom absolute inset-0" />

      <div className="container-page relative flex flex-col gap-12 pt-14 pb-16 lg:flex-row lg:items-center lg:gap-16 lg:pt-[104px] lg:pb-[88px]">
        <div className="hero-copy flex flex-col gap-7 lg:w-[640px] lg:shrink xl:shrink-0">
          <p className={`hero-eyebrow ${eyebrow} text-viz-gold`}>About Flash Weather AI · Canton, Georgia</p>
          <h1 className="text-[40px] leading-[44px] font-extrabold tracking-[-0.05em] text-text-on-dark md:text-[50px] md:leading-[54px] xl:text-[58px] xl:leading-[62px]">
            <HeroWords text="Built by meteorologists who used to issue the warnings." />
          </h1>
          <p className="hero-lede text-[17px] leading-[28px] text-pretty text-[#C9D1E3] md:text-[19px] md:leading-body-l">
            Flash Weather AI is a weather-intelligence company: 15+ proprietary prediction products and over 100
            parameters on a 1 × 1 km grid, refreshed every 2 minutes, built by meteorologists who spent their careers
            at NOAA&apos;s National Weather Service deciding when to warn people.
          </p>
          <div className="hero-ctas flex flex-col gap-3 pt-1 sm:flex-row">
            <ButtonLink href={DEMO_HREF} variant="gold" className="h-12 rounded-full px-[26px]">
              Book a demo
            </ButtonLink>
            <ButtonLink href="/why-flash/accuracy-method/" variant="outline-dark" className="h-12 rounded-full px-[26px]">
              Read the accuracy method
            </ButtonLink>
          </div>
        </div>

        <div className="hero-visual hero-visual-side relative flex min-h-[520px] w-full flex-col justify-end overflow-hidden rounded-[20px] bg-brand-navy-deep p-4 sm:p-6 lg:h-[560px] lg:w-[544px] lg:shrink xl:shrink-0">
          <Image
            src="/images/about/flash-weather-ai-forecast-office-night.jpg"
            alt="A forecast office at night, rows of monitors glowing navy under one warm desk lamp — the working environment Flash's founder came from"
            fill
            sizes="(min-width: 1024px) 544px, 100vw"
            className="object-cover opacity-88"
          />
          <div aria-hidden className="about-founder-grade absolute inset-0" />
          <div className="relative flex flex-col gap-[14px] rounded-lg border border-white/10 bg-[#040818B8] px-6 py-[22px]">
            <p className="text-[11px] leading-4 font-semibold tracking-label text-viz-gold">FOUNDER</p>
            <div className="flex flex-col gap-1">
              <p className="text-[26px] leading-[32px] font-bold tracking-display text-text-on-dark">{founder.name}</p>
              <p className="text-body-s leading-5 text-[#C9D1E3]">{founder.jobTitle}</p>
            </div>
            <dl className="grid grid-cols-2 gap-y-3 border-t border-white/12 pt-[14px] sm:grid-cols-4">
              {founder.facts.map((f) => (
                <div key={f.value} className="flex flex-col-reverse gap-[2px] pr-2">
                  <dt className="text-micro text-text-on-dark-muted">{f.label}</dt>
                  <dd className="text-body-l leading-6 font-semibold text-text-on-dark">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </HeroSection>
  );
}

export function OriginSection() {
  return (
    <section aria-labelledby="origin-heading" className="border-t border-border bg-surface-sunken">
      <div className="container-page flex flex-col gap-10 py-16 lg:flex-row lg:gap-16 lg:py-[112px]">
        <div className="flex flex-col gap-5 lg:w-[400px] lg:shrink xl:shrink-0">
          <p className={`${eyebrow} text-brand-blue`}>The origin</p>
          <h2 id="origin-heading" className={`${h2} text-text`}>
            Flash started with a storm that arrived before the warning did.
          </h2>
        </div>
        <div className="flex min-w-0 flex-col gap-6 lg:w-[784px] lg:shrink xl:shrink-0">
          <p className="text-h4 leading-h3 text-text">
            Flash Weather AI was founded by Jason Deese after a personal experience with a storm. He had spent his
            career at NOAA&apos;s National Weather Service issuing the warnings; the company he started exists to put
            that forecast in the hands of the person who has to make the call — before the first strike, not after it.
          </p>
          <p className="text-[17px] leading-h4 text-text-muted">
            That is why Flash predicts rather than detects. FlashPredict forecasts where lightning will strike up to 60
            minutes ahead on 1 km cells, refreshed every 2 minutes;{' '}
            <Link href="/products/hail-prediction/" className="font-medium text-brand-blue hover:underline">
              FlashHail
            </Link>{' '}
            predicts hail up to 55 minutes before it reaches a site. No sensors to install — software only, delivered
            through the{' '}
            <Link href="/products/weather-command-center/" className="font-medium text-brand-blue hover:underline">
              Command Center
            </Link>
            , the mobile app, the{' '}
            <Link href="/products/api-offerings/" className="font-medium text-brand-blue hover:underline">
              API
            </Link>{' '}
            and Flash Agent.
          </p>
          <div className="flex flex-col gap-1 border-t border-border pt-6">
            <p className="text-[15px] leading-body-s font-medium text-text">
              Customer quotes from {quotedCustomers.slice(0, -1).join(', ')} and {quotedCustomers[quotedCustomers.length - 1]}.
            </p>
            <Link
              href="/press-and-partners/"
              className="flex min-h-[44px] items-center self-start text-body-s leading-5 font-medium text-brand-blue hover:underline"
            >
              Read them on Press &amp; Partners <span aria-hidden>&nbsp;→</span>
            </Link>
          </div>
          <div className="relative flex aspect-[784/300] min-h-[220px] w-full overflow-hidden rounded-lg bg-brand-navy-deep">
            <Image
              src="/images/about/flash-weather-ai-origin-storm-over-farmland.png"
              alt="A lightning bolt striking beyond a dark treeline over open farmland at night, illustrating the storm that arrived ahead of its warning and started Flash"
              fill
              sizes="(min-width: 1024px) 784px, 100vw"
              className="object-cover"
            />
            <div aria-hidden className="about-navy-fade-10-88 absolute inset-0" />
            <p className="absolute top-5 left-[22px] text-[11px] leading-[14px] font-extrabold tracking-[0.13em] text-viz-gold">
              THE STORM THAT STARTED IT
            </p>
            <p className="absolute right-[22px] bottom-[22px] left-[22px] max-w-[560px] text-body leading-body font-extrabold tracking-display text-text-on-dark md:text-h4 md:leading-body">
              The warning arrived after the storm did. Flash exists to reverse that order.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PrinciplesSection() {
  return (
    <section aria-labelledby="principles-heading" className="bg-neutral-0">
      <div className="container-page flex flex-col gap-12 py-16 lg:gap-14 lg:py-[112px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="flex max-w-[640px] flex-col gap-5">
            <p className={`${eyebrow} text-brand-blue`}>What we believe</p>
            <h2 id="principles-heading" className={`${h2} text-text`}>
              Three principles decide what Flash builds — and what it refuses to claim.
            </h2>
          </div>
          <p className="text-[17px] leading-h4 text-text-muted lg:w-[448px] lg:shrink xl:shrink-0">
            They are the reason every number on this site carries a qualifier, and the reason the forecast ends up in
            your calendar rather than on another dashboard.
          </p>
        </div>

        <div className="relative flex min-h-[240px] overflow-hidden rounded-lg bg-brand-navy-deep lg:h-[280px]">
          <Image
            src="/images/about/flash-weather-ai-principles-survey-post-grassland.png"
            alt="A weathered survey post standing alone in open grassland under a clearing storm sky at first light, heading the principles that govern how Flash states a forecast"
            fill
            sizes="(min-width: 1440px) 1248px, 100vw"
            className="object-cover object-[50%_55%]"
          />
          <div aria-hidden className="about-navy-fade-12-88 absolute inset-0" />
          <p className="absolute top-6 left-[28px] text-[11px] leading-[14px] font-extrabold tracking-[0.13em] text-viz-gold">
            WHAT WE BELIEVE
          </p>
          <p className="relative mt-auto max-w-narrow p-[28px] pb-[26px] text-body-l leading-body-l font-extrabold tracking-[-0.03em] text-text-on-dark md:text-h3 md:leading-body-l">
            A forecast is a promise about a place. Say which place, and say how sure you are.
          </p>
        </div>

        <ol className="grid gap-10 lg:grid-cols-3 lg:gap-0">
          {principles.map((p, i) => (
            <li key={p.title} className="flex flex-col gap-[14px] border-t border-border pt-8 lg:pr-10">
              <span aria-hidden className="text-caption leading-micro font-bold tracking-[0.08em] text-brand-blue">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-h3 leading-body-l font-bold tracking-display text-text">{p.title}</h3>
              <p className="text-body text-text-muted">
                <LinkedText text={p.body} link={p.link} className="font-medium text-brand-blue hover:underline" />
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function NumbersSection() {
  return (
    <section aria-labelledby="numbers-heading" className="bg-brand-navy">
      <div className="container-page flex flex-col gap-12 py-16 lg:py-[112px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="flex max-w-[640px] flex-col gap-5">
            <p className={`${eyebrow} text-viz-gold`}>The company in numbers</p>
            <h2 id="numbers-heading" className={`${h2} text-text-on-dark`}>
              Fact sheet only. No outcome claims.
            </h2>
          </div>
          <p className="text-[15px] leading-6 text-[#C9D1E3] lg:w-[448px] lg:shrink xl:shrink-0">
            Every figure below is on the approved fact sheet. Downtime and loss-reduction percentages are withheld until
            they can be sourced and dated.
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-5 lg:gap-0">
          {companyNumbers.map((n) => (
            <div key={n.value} className="flex flex-col-reverse gap-2 border-t border-white/14 pt-7 pb-2 lg:pr-6">
              <dt className="text-body-s leading-5 text-[#C9D1E3]">{n.label}</dt>
              <dd
                className={`text-[40px] leading-[44px] font-bold tracking-[-0.03em] md:text-display-l md:leading-display-l ${
                  n.gold ? 'text-gold-metallic' : 'text-text-on-dark'
                }`}
              >
                {n.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function TimelineSection() {
  return (
    <section aria-labelledby="timeline-heading" className="bg-neutral-0">
      <div className="container-page flex flex-col gap-12 py-16 lg:gap-14 lg:py-[112px]">
        <div className="flex max-w-[640px] flex-col gap-5">
          <p className={`${eyebrow} text-brand-blue`}>Timeline</p>
          <h2 id="timeline-heading" className={`${h2} text-text`}>
            Four milestones that matter.
          </h2>
        </div>
        <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {milestones.map((m) => (
            <li key={m.name} className="flex flex-col gap-4 lg:pr-8 lg:last:pr-0">
              <span aria-hidden className="flex items-center gap-[10px]">
                <span className={`size-3 shrink-0 rounded-full ${m.gold ? 'bg-viz-gold' : 'bg-brand-blue'}`} />
                <span className="h-px grow bg-border" />
              </span>
              <h3 className="text-[28px] leading-[34px] font-bold tracking-display text-text">{m.name}</h3>
              <p className="text-body-l leading-body font-semibold tracking-heading text-text">{m.title}</p>
              <p className="text-[15px] leading-6 text-text-muted">
                <LinkedText text={m.body} link={m.link} className="font-medium text-brand-blue hover:underline" />
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function WorkWithUs() {
  return (
    <section aria-label="Work with us and talk to us" className="border-t border-border bg-surface-sunken">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-2 lg:gap-0 lg:py-24">
        <div className="flex flex-col gap-4 lg:pr-16">
          <p className={`${eyebrow} text-brand-blue`}>Careers</p>
          <h2 className="text-[28px] leading-[34px] font-extrabold tracking-[-0.03em] text-text">Work with us</h2>
          <p className="text-[17px] leading-h4 text-text-muted">
            A small team of meteorologists and engineers in Canton, Georgia, in the Atlanta metro. Write to {site.email}{' '}
            with the role you would want to do and the sites you know best.
          </p>
          <a
            href={`mailto:${site.email}?subject=${encodeURIComponent('Working at Flash')}`}
            className="flex min-h-[44px] items-center self-start text-body-s leading-5 font-medium text-brand-blue hover:underline"
          >
            {site.email} <span aria-hidden>&nbsp;→</span>
          </a>
        </div>
        <div className="flex flex-col gap-4 border-border lg:border-l lg:pl-16">
          <p className={`${eyebrow} text-brand-blue`}>Contact</p>
          <h2 className="text-[28px] leading-[34px] font-extrabold tracking-[-0.03em] text-text">Talk to us</h2>
          <p className="text-[17px] leading-h4 text-text-muted">
            Press, partnerships and support all reach a person at {site.email}, answered within one business day.
            Phone: request on the demo form.
          </p>
          <div className="flex flex-wrap gap-x-6">
            <Link
              href={DEMO_HREF}
              className="flex min-h-[44px] items-center text-body-s leading-5 font-medium text-brand-blue hover:underline"
            >
              Book a demo <span aria-hidden>&nbsp;→</span>
            </Link>
            <Link
              href="/press-and-partners/"
              className="flex min-h-[44px] items-center text-body-s leading-5 font-medium text-brand-blue hover:underline"
            >
              Press &amp; Partners <span aria-hidden>&nbsp;→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
