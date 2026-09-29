import Image from 'next/image';

import { Breadcrumbs } from '@/components/breadcrumbs';
import { ButtonLink } from '@/components/button';
import { HeroBackground, HeroSection, HeroWords } from '@/components/hero/hero';
import { PartnerList } from '@/components/press/partner-list';
import { PressCoverage } from '@/components/press/press-coverage';
import { PressKit } from '@/components/press/press-kit';
import { Testimonials } from '@/components/press/testimonials';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { PRESS_PATH, heroStats, pressFiles } from '@/content/press';
import { JsonLd, webPageSchema } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';
import { site } from '@/lib/seo/site';

const title = 'Press coverage and partners';
const description =
  'The 55-minute FlashHail warning, as covered by Carrier Management and Automotive Fleet, plus the press kit and what Troon, Big 12 and NAIA do with Flash.';

export const metadata = buildMetadata({ title, description, path: PRESS_PATH });

export default function PressAndPartnersPage() {
  return (
    <>
      <SiteHeader tone="dark" />
      <main id="main">
        <JsonLd schema={webPageSchema({ type: 'WebPage', name: title, description, path: PRESS_PATH })} />
        <Breadcrumbs
          className="sr-only"
          trail={[
            { name: 'Home', path: '/' },
            { name: 'Press & partners', path: PRESS_PATH },
          ]}
        />

        {/* Hero */}
        <HeroSection theme="dark" className="relative overflow-hidden bg-brand-navy">
          <HeroBackground storm>
            <Image
              src="/images/press/flash-weather-press-hero-fleet-lot-hail-sky.png"
              alt="Rows of parked vehicles in an open lot under a bruised hail sky, the photograph graded behind the Press and Partners headline"
              fill
              preload
              sizes="100vw"
              className="object-cover object-[55%_45%] opacity-80"
            />
          </HeroBackground>
          <div aria-hidden className="press-hero-grade-left absolute inset-0" />
          <div aria-hidden className="press-hero-grade-bottom absolute inset-0" />
          <div className="container-page relative flex flex-col gap-12 pt-14 pb-16 lg:flex-row lg:items-end lg:gap-16 lg:pt-[112px] lg:pb-20">
            <div className="hero-copy flex max-w-[832px] flex-col gap-6 lg:gap-[28px]">
              <p className="hero-eyebrow text-micro font-semibold tracking-label text-viz-gold uppercase">Press &amp; partners</p>
              <h1 className="text-[36px] leading-[42px] font-extrabold tracking-[-0.04em] text-text-on-dark md:text-display-m md:leading-display-m xl:text-display-l xl:leading-display-l xl:tracking-[-0.05em]">
                <HeroWords text="Coverage, partners, and what each partner actually does with Flash." />
              </h1>
              <p className="hero-lede max-w-[720px] text-[17px] leading-[28px] text-pretty text-[#C9D1E3] md:text-[19px] md:leading-body-l">
                Trade coverage of the FlashHail launch, a press kit served from our own domain, and a partner list
                that explains the work instead of sending you to someone else&apos;s homepage.
              </p>
              <div className="hero-ctas flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap sm:items-center">
                <ButtonLink href={pressFiles.kitZip} variant="gold" className="rounded-full">
                  Download press kit
                </ButtonLink>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex h-[54px] items-center justify-center rounded-full border border-white/45 px-[22px] text-body-s leading-caption font-extrabold tracking-[0.02em] text-text-on-dark transition hover:bg-white/8"
                >
                  Contact press · {site.email}
                </a>
              </div>
            </div>
            <dl className="hero-visual hero-visual-side flex flex-col gap-6 border-l border-white/20 pl-6 lg:w-[352px] lg:shrink xl:shrink-0 lg:pl-8">
              {heroStats.map((stat) => (
                <div key={stat.value} className="flex flex-col-reverse gap-1">
                  <dt className="text-body-s leading-5 text-neutral-400">{stat.label}</dt>
                  <dd className="text-[32px] leading-10 font-bold tracking-display text-text-on-dark md:text-[36px]">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </HeroSection>

        <PressCoverage />
        <PressKit />
        <PartnerList />
        <Testimonials />

      </main>
      <SiteFooter eyebrow="Book a demo · No sensors to install" />
    </>
  );
}
