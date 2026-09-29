import Image from 'next/image';

import { Breadcrumbs } from '@/components/breadcrumbs';
import { ButtonLink } from '@/components/button';
import { HeroBackground, HeroSection, HeroWords } from '@/components/hero/hero';
import { DEMO_HREF } from '@/content/navigation';

import { hero, lightningPage, lightningTrail } from './content';
import { RiskMap } from './risk-map';

/**
 * Navy hero: the product slide as a blurred, darkened texture under a
 * left-weighted grade, copy left, the working forecast map right.
 */
export function LightningHero() {
  return (
    <HeroSection theme="dark" labelledBy="lightning-hero-heading" className="relative isolate overflow-clip bg-brand-navy">
      <HeroBackground layer="-z-20">
        <Image
          src={lightningPage.heroImage}
          alt=""
          fill
          preload
          sizes="100vw"
          className="products-lightning-backdrop object-cover opacity-40"
        />
      </HeroBackground>
      <div aria-hidden className="products-hero-grade absolute inset-0 -z-10" />

      <div className="container-page flex flex-col gap-12 pt-24 pb-20 lg:flex-row lg:items-center lg:gap-[56px] lg:pt-[152px] lg:pb-[112px]">
        <div className="hero-copy flex flex-col gap-6 lg:w-[520px] lg:shrink xl:shrink-0 lg:gap-[28px] xl:w-[620px]">
          <Breadcrumbs trail={lightningTrail} className="sr-only" />
          <p className="hero-eyebrow text-micro font-semibold tracking-label text-viz-gold uppercase">{hero.eyebrow}</p>
          <h1
            id="lightning-hero-heading"
            className="text-[40px] leading-[44px] font-extrabold tracking-[-0.05em] text-text-on-dark sm:text-[52px] sm:leading-[56px] xl:text-display-xl xl:leading-display-xl"
          >
            <HeroWords text={hero.heading} />
          </h1>
          <p className="hero-lede max-w-[580px] text-[17px] leading-[28px] text-pretty text-[#C9D1E3] sm:text-[19px] sm:leading-body-l">
            {hero.body}
          </p>
          <div className="hero-ctas flex flex-col gap-[14px] pt-1 sm:flex-row sm:items-center">
            <ButtonLink href={DEMO_HREF} variant="gold" className="tracking-normal">
              Book a demo
            </ButtonLink>
            <ButtonLink href="/pricing/" variant="outline-dark" className="tracking-normal">
              See pricing
            </ButtonLink>
          </div>
          <p className="hero-support text-caption leading-5 text-[#8F9AB8]">{hero.footnote}</p>
        </div>

        <div className="hero-visual hero-visual-side flex min-w-0 grow basis-0 justify-center lg:justify-start">
          <RiskMap />
        </div>
      </div>
    </HeroSection>
  );
}
