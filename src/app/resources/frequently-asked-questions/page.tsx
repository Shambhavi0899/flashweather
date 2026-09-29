import Image from 'next/image';

import { ButtonLink } from '@/components/button';
import { HeroBackground, HeroSection, HeroWords } from '@/components/hero/hero';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { AskFlashCard } from '@/components/faq/ask-flash-card';
import { FaqGroup } from '@/components/faq/faq-group';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { FAQ_PATH, allFaqs, faqGroups } from '@/content/faq';
import { DEMO_HREF } from '@/content/navigation';
import { JsonLd, faqSchema } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';
import { site } from '@/lib/seo/site';

export const metadata = buildMetadata({
  title: 'FAQ: accuracy, sensors, WBGT, pricing',
  description:
    'Straight answers on 99.6% lightning accuracy, sensors, WBGT, alert policy, audit logs and pricing for safety managers. Every answer links to its proof.',
  path: FAQ_PATH,
});

export default function FaqPage() {
  return (
    <>
      <SiteHeader tone="dark" />
      <main id="main">
        <JsonLd schema={faqSchema(allFaqs)} />
        <Breadcrumbs
          className="sr-only"
          trail={[
            { name: 'Home', path: '/' },
            { name: 'FAQ', path: FAQ_PATH },
          ]}
        />

        {/* Hero */}
        <HeroSection theme="dark" className="relative overflow-hidden bg-brand-navy">
          <HeroBackground storm>
            <Image
              src="/images/faq/flash-weather-faq-hero-lightning-storm-backdrop.png"
              alt="Lightning branching across a dark storm sky over open ground, the photograph graded behind the Flash FAQ headline"
              fill
              preload
              sizes="100vw"
              className="object-cover object-[60%_40%] opacity-80"
            />
          </HeroBackground>
          <div aria-hidden className="faq-hero-grade-left absolute inset-0" />
          <div aria-hidden className="faq-hero-grade-bottom absolute inset-0" />
          <div className="container-page relative flex flex-col gap-12 pt-14 pb-16 lg:flex-row lg:items-center lg:gap-16 lg:pt-[112px] lg:pb-20">
            <div className="hero-copy flex max-w-[784px] flex-col gap-6 lg:gap-[28px]">
              <p className="hero-eyebrow text-micro font-semibold tracking-label text-viz-gold uppercase">
                FAQ · For buyers · 18 answers, 9 objections
              </p>
              <h1 className="text-[34px] leading-[40px] font-extrabold tracking-[-0.04em] text-text-on-dark md:text-[44px] md:leading-[50px] xl:text-[54px] xl:leading-[58px] xl:tracking-[-0.05em]">
                <HeroWords text="The questions safety managers, athletic directors and superintendents actually ask — answered straight." />
              </h1>
              <p className="hero-lede max-w-[700px] text-[17px] leading-[28px] text-pretty text-[#C9D1E3] md:text-[19px] md:leading-body-l">
                Eighteen answers, organised by the objection behind them. Every answer links to the page that
                proves it: no unqualified numbers, no hardware to buy, no generic radius.
              </p>
              <div className="hero-ctas flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
                <ButtonLink href={DEMO_HREF} variant="gold" className="rounded-full">
                  Book a demo
                </ButtonLink>
                <ButtonLink href="/products/flash-agent/" variant="outline-dark" className="rounded-full">
                  Ask Flash instead
                </ButtonLink>
              </div>
            </div>
            <div className="hero-visual hero-visual-side w-full max-w-[400px] shrink-0">
              <AskFlashCard />
            </div>
          </div>
        </HeroSection>

        {/* Jump list */}
        <nav aria-label="On this page" className="border-y border-border bg-neutral-0">
          <div className="container-page flex flex-col gap-3 py-[18px] md:flex-row md:items-center md:gap-6">
            <p className="shrink-0 text-micro font-semibold tracking-label text-text-subtle uppercase">Jump to</p>
            <ul className="flex flex-wrap gap-2">
              {faqGroups.map((group) => {
                const agent = group.id === 'flash-agent';
                return (
                  <li key={group.id}>
                    <a
                      href={`#${group.id}`}
                      className={`flex h-11 items-center rounded-full border px-[14px] text-caption font-medium transition hover:bg-neutral-50 md:h-[34px] ${
                        agent ? 'border-brand-blue text-brand-blue' : 'border-border text-text'
                      }`}
                    >
                      {group.jumpLabel}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {faqGroups.map((group) => (
          <FaqGroup key={group.id} group={group} />
        ))}

        {/* The pre-migration app FAQ */}
        <section aria-labelledby="old-app-heading" className="border-t border-border bg-surface-sunken">
          <div className="container-page flex flex-col gap-[10px] py-16">
            <h2
              id="old-app-heading"
              className="text-[24px] leading-[30px] font-extrabold tracking-[-0.03em] text-text md:text-[28px] md:leading-[34px]"
            >
              Still on the old app questions?
            </h2>
            <p className="max-w-[800px] text-body text-pretty text-text-muted">
              Free vs premium, notifications and account questions for the Flash Mobile App now live in the app
              help centre. The old /faq/ address redirects here permanently (301), so nothing you bookmarked is
              lost.
            </p>
            <ButtonLink
              href={site.appDownloadUrl}
              variant="outline-light"
              size="sm"
              icon="↗"
              className="mt-[10px] self-start rounded-full"
            >
              Download the free app
            </ButtonLink>
          </div>
        </section>

      </main>
      <SiteFooter eyebrow="Book a demo · No sensors to install" />
    </>
  );
}
