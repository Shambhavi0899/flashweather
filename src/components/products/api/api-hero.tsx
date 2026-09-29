import Image from 'next/image';

import { ButtonLink } from '@/components/button';
import { HeroBackground, HeroSection, HeroWords } from '@/components/hero/hero';
import { DEMO_HREF } from '@/content/navigation';
import { site } from '@/lib/seo/site';

import { CodeBody, CodeHeader, CodeWindow } from './code-block';
import { heroResponse, heroWebhook, images } from './content';

/**
 * Hero: the H1 and pitch on the left, an illustrative GET response and the
 * webhook it triggers on the right, over the dimmed map photograph.
 */
export function ApiHero() {
  return (
    <HeroSection theme="dark" labelledBy="api-hero-heading" className="relative isolate overflow-hidden bg-brand-navy">
      <HeroBackground layer="-z-20">
        <Image
          src={images.hero.src}
          alt={images.hero.alt}
          fill
          preload
          quality={75}
          sizes="100vw"
          className="object-cover opacity-60"
        />
      </HeroBackground>
      <div aria-hidden className="products-hero-grade absolute inset-0 -z-10" />

      <div className="container-page flex flex-col gap-14 pt-16 pb-16 lg:pt-[120px] lg:pb-[112px] xl:flex-row xl:items-center">
        <div className="hero-copy flex flex-col gap-7 xl:w-[560px] xl:shrink-0">
          <p className="hero-eyebrow text-micro font-bold tracking-[0.13em] text-viz-gold uppercase">
            Flash API · REST and webhooks · Same run as the app
          </p>
          <h1
            id="api-hero-heading"
            className="text-[44px] leading-[48px] font-extrabold tracking-[-0.05em] text-text-on-dark md:text-[60px] md:leading-[64px] lg:text-display-xl lg:leading-display-xl"
          >
            <HeroWords text="The weather API that fires before the weather arrives." />
          </h1>
          <p className="hero-lede max-w-[540px] text-body-l text-pretty text-[#C9D1E3] lg:text-[19px]">
            One GET returns over 100 parameters for any 1 km cell — lightning risk, hail lead time, WBGT, gusts, rain
            rate and frost probability — with forecasts out to 180 hours, refreshed every 2 minutes. Subscribe a
            webhook and your PA system, scheduler or dashboard hears about the storm before it lands.
          </p>
          <div className="hero-ctas flex flex-col gap-[14px] pt-1 sm:flex-row sm:items-center">
            <ButtonLink href={DEMO_HREF} variant="gold">
              Get API access
            </ButtonLink>
            <ButtonLink href={site.apiDocsUrl} variant="outline-dark">
              Read the developer docs
            </ButtonLink>
          </div>
          <p className="hero-support text-caption leading-5 text-[#8F9AB8]">
            For construction, schools, golf, utilities and the tools they already run · same model run as the Command
            Center and Flash Agent · no hardware
          </p>
        </div>

        <div className="hero-visual flex min-w-0 grow basis-0 flex-col gap-3">
          <p className="text-[11px] leading-[14px] font-bold tracking-label text-viz-gold uppercase">
            Illustrative example · Not live weather
          </p>
          <CodeWindow
            className="shadow-[0_30px_80px_#00000073]"
            header={
              <CodeHeader method={heroResponse.method} tone="green" url={heroResponse.url} status={heroResponse.status} />
            }
          >
            <CodeBody code={heroResponse.code} className="pt-4 pb-[18px]" />
          </CodeWindow>
          <CodeWindow header={<CodeHeader method="WEBHOOK" tone="gold" url={heroWebhook.label} />}>
            <CodeBody code={heroWebhook.code} className="pt-[14px]" />
          </CodeWindow>
        </div>
      </div>
    </HeroSection>
  );
}
