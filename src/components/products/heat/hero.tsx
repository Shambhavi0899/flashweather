import Image from 'next/image';

import { ButtonLink } from '@/components/button';
import { HeroBackground, HeroSection, HeroWords } from '@/components/hero/hero';
import { DEMO_HREF } from '@/content/navigation';

import { heroImage } from './content';
import { WbgtChart } from './wbgt-chart';

/** Hero: photo under a navy grade, the H1 on the left, the WBGT outlook on the right. */
export function HeatHero() {
  return (
    <HeroSection theme="dark" labelledBy="heat-hero-heading" className="relative isolate overflow-hidden bg-brand-navy">
      <HeroBackground layer="-z-20">
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          fill
          preload
          sizes="100vw"
          className="object-cover object-[50%_42%]"
        />
      </HeroBackground>
      {/* The design's grade: near-opaque navy on the copy side, lifting towards the right. */}
      <div
        aria-hidden
        className="products-heat-hero-grade absolute inset-0 -z-10"
      />

      <div className="container-page flex flex-col gap-12 pt-16 pb-16 lg:flex-row lg:items-center lg:gap-14 lg:pt-[104px] lg:pb-24">
        <div className="hero-copy flex flex-col gap-7 lg:w-[600px] lg:shrink xl:shrink-0">
          <p className="hero-eyebrow text-micro font-bold tracking-[0.13em] text-viz-gold uppercase">
            Flash heat and WBGT · Six-hour outlook · 1 km cells
          </p>
          <h1
            id="heat-hero-heading"
            className="text-[38px] leading-[44px] font-extrabold tracking-[-0.05em] text-text-on-dark md:text-[48px] md:leading-[54px] xl:text-display-l xl:leading-display-l"
          >
            <HeroWords text="WBGT and heat forecasts six hours ahead — planned beside your on-site sensor, not instead of it." />
          </h1>
          <p className="hero-lede max-w-[560px] text-[17px] leading-h4 text-pretty text-[#C9D1E3] md:text-[19px] md:leading-body-l">
            Flash forecasts wet-bulb globe temperature, heat index, air temperature and dew point for every 1 km cell,
            hourly across a 6-hour outlook and refreshed every 2 minutes. Your sensor still makes the policy call. Flash
            tells you at noon what it will read at 4 pm.
          </p>
          <div className="hero-ctas flex flex-wrap items-center gap-[14px] pt-1">
            <ButtonLink href={DEMO_HREF} variant="gold">
              Book a demo
            </ButtonLink>
            <ButtonLink href="/pricing/" variant="outline-dark">
              See pricing
            </ButtonLink>
          </div>
          <p className="hero-support text-caption leading-5 text-[#8F9AB8]">
            No hardware · runs beside any WBGT meter you already own · For schools, athletics, construction, events and
            utilities
          </p>
        </div>

        <div className="hero-visual hero-visual-side min-w-0 grow basis-0">
          <WbgtChart />
        </div>
      </div>
    </HeroSection>
  );
}
