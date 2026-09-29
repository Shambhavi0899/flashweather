import { Breadcrumbs } from '@/components/breadcrumbs';
import {
  ContactHeroBand,
  OtherWaysIn,
  VerifiedDetails,
  WhatHappensNext,
  WhereWeAre,
} from '@/components/contact/contact-sections';
import { DemoForm } from '@/components/contact/demo-form';
import { HeroSection, HeroWords } from '@/components/hero/hero';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { INDUSTRIES, ROLES } from '@/lib/demo-request';
import { JsonLd, webPageSchema } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';
import { site } from '@/lib/seo/site';

const PATH = '/contact/';
const DESCRIPTION =
  "Book a Flash Weather AI demo. We load your sites, replay last season's strikes against our predictions and show the alert log you would have had.";

export const metadata = buildMetadata({
  title: 'Book a demo: lightning and hail alerts',
  description: DESCRIPTION,
  path: PATH,
});

export default function ContactPage() {
  return (
    <>
      <SiteHeader tone="dark" />
      <main id="main">
        <JsonLd
          schema={webPageSchema({ type: 'ContactPage', name: 'Contact and book a demo', description: DESCRIPTION, path: PATH })}
        />
        <Breadcrumbs
          className="sr-only"
          trail={[
            { name: 'Home', path: '/' },
            { name: 'Contact', path: PATH },
          ]}
        />

        <HeroSection theme="dark" labelledBy="contact-heading" className="relative bg-neutral-0">
          <ContactHeroBand />
          <div className="container-page relative grid gap-12 pb-16 lg:grid-cols-[minmax(0,592px)_minmax(0,592px)] lg:justify-between lg:gap-x-16 lg:gap-y-16 lg:py-24">
            <div
              className="-mx-4 contact-intro-band px-4 pt-12 pb-12 md:-mx-10 md:px-10 lg:col-start-1 lg:row-start-1 lg:mx-0 lg:h-[368px] lg:p-0"
            >
              {/* The copy leads the scroll inside the band, so the band itself holds still. */}
              <div className="hero-copy flex flex-col gap-6">
                <p className="hero-eyebrow text-micro font-semibold tracking-label text-viz-gold">
                  CONTACT · BOOK A DEMO
                </p>
                <h1
                  id="contact-heading"
                  className="text-[40px] leading-[44px] font-extrabold tracking-[-0.03em] text-text-on-dark md:text-[48px] md:leading-[52px] xl:text-[54px] xl:leading-[58px]"
                >
                  <HeroWords text="Book a demo — we'll load your sites before the call." />
                </h1>
                <p className="hero-lede text-body-l leading-[29px] text-pretty text-[#C9D1E3]">
                  Tell us where you operate and who needs the alert. On the call you see your own sites on the map,
                  not a sample account, and you leave with the alert log your team would have received last season.
                </p>
              </div>
            </div>

            <div className="hero-visual hero-visual-side hero-visual-still flex flex-col gap-[18px] rounded-[20px] border border-border bg-neutral-0 p-5 shadow-[0_1px_2px_#0B13220D,0_24px_48px_#0B132224] sm:p-9 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
              <div className="flex flex-col gap-1">
                <p className="text-[22px] leading-h4 font-semibold tracking-heading text-text">Book a demo</p>
                <p className="text-body-s leading-5 text-text-muted">
                  We reply within one business day and load your sites before the call.
                </p>
              </div>
              <DemoForm roles={ROLES} industries={INDUSTRIES} email={site.salesEmail} />
            </div>

            <div className="hero-support lg:col-start-1 lg:row-start-2">
              <WhatHappensNext />
            </div>
          </div>
        </HeroSection>

        <VerifiedDetails />
        <OtherWaysIn />
        <WhereWeAre />
      </main>
      <SiteFooter />
    </>
  );
}
