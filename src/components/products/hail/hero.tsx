import Image from 'next/image';

import { ButtonLink } from '@/components/button';
import { HeroBackground, HeroSection, HeroWords } from '@/components/hero/hero';
import { DEMO_HREF } from '@/content/navigation';

import { hailPage } from './content';
import { SizeCard } from './size-card';

/**
 * Hero: the H1, the CTAs and the to-scale size-class card, over the hail
 * render. The render is blurred and dimmed (its own headline is baked into
 * the image) so nothing reads through the copy or the card.
 */
export function HailHero() {
  return (
    <HeroSection theme="dark" labelledBy="hail-hero-heading" className="relative isolate overflow-clip bg-brand-navy-deep">
      <HeroBackground layer="-z-20">
        <Image
          src={hailPage.heroImage}
          alt=""
          fill
          preload
          sizes="100vw"
          className="products-hail-backdrop object-cover opacity-40"
        />
      </HeroBackground>
      <div aria-hidden className="products-hero-grade absolute inset-0 -z-10" />

      <div className="container-page flex flex-col gap-12 pt-24 pb-20 md:pt-28 md:pb-24 lg:flex-row lg:items-center lg:gap-14 lg:pt-[152px] lg:pb-[112px]">
        <div className="hero-copy flex flex-col gap-7 lg:w-[540px] lg:shrink xl:shrink-0 xl:w-[620px]">
          <p className="hero-eyebrow text-micro font-semibold tracking-label text-viz-gold uppercase">
            Flash hail prediction · FlashHail engine
          </p>
          <h1
            id="hail-hero-heading"
            className="text-[44px] leading-[48px] font-extrabold tracking-[-0.05em] text-text-on-dark md:text-[60px] md:leading-[64px] xl:text-display-xl xl:leading-display-xl"
          >
            <HeroWords text="Hail prediction up to 55 minutes before impact — not a report after it lands." />
          </h1>
          <p className="hero-lede max-w-[580px] text-[17px] leading-[28px] text-pretty text-[#C9D1E3] md:text-[19px] md:leading-body-l">
            Hail-tracking tools tell you where hail fell. FlashHail forecasts the cell, the size class and the arrival
            window, refreshed every five minutes, so crews, fleets and adjusters act before the stones do.
          </p>
          <div className="hero-ctas flex flex-col gap-[14px] pt-1 sm:flex-row sm:items-center">
            <ButtonLink href={DEMO_HREF} variant="gold" className="tracking-normal">
              Book a demo
            </ButtonLink>
            <ButtonLink href="/pricing/" variant="outline-dark" className="tracking-normal">
              See pricing
            </ButtonLink>
          </div>
          <p className="hero-support text-caption leading-5 text-[#8F9AB8]">
            Covered by Carrier Management and Automotive Fleet · no sensors, no installation
          </p>
        </div>

        <div className="hero-visual hero-visual-side flex min-w-0 grow basis-0 lg:justify-end xl:justify-start">
          <SizeCard />
        </div>
      </div>
    </HeroSection>
  );
}
