import {
  AlwaysIncludedSection,
  PlansSection,
  PricingFaq,
  PricingHero,
  QuoteFactorsSection,
  SensorCostSection,
} from '@/components/pricing/pricing-sections';
import { TrustedStrip } from '@/components/pricing/trusted-strip';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { pricingFaqs, trustedCustomers } from '@/content/pricing';
import { JsonLd, faqSchema } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';

/*
 * Schema: BreadcrumbList (via <Breadcrumbs> in the hero) and FAQPage. No
 * Product or Offer: every plan is quoted, so there is no public price, and a
 * Product with no offers, review or rating fails Google's product rich-result
 * checks just as an Offer with no price does.
 */
export const metadata = buildMetadata({
  title: 'Pricing: per-site plans, no hardware',
  description:
    'Lightning and hail prediction priced per site per year, no sensors to buy or maintain. Compare Single Site, Portfolio and Enterprise plans, then get a quote.',
  path: '/pricing/',
});

export default function PricingPage() {
  return (
    <>
      <SiteHeader tone="dark" />
      <main id="main">
        <JsonLd schema={faqSchema(pricingFaqs.map(({ question, answer }) => ({ question, answer })))} />
        <PricingHero />
        <PlansSection />
        <QuoteFactorsSection />
        <AlwaysIncludedSection />
        <SensorCostSection />
        <TrustedStrip
          customers={trustedCustomers}
          rise
          photo={{
            src: '/images/pricing/flash-golf-fairway-rain-trusted-customers-golf.webp',
            alt: 'A golf fairway under heavy rain, the kind of site Troon, the Big 12, Syngenta and the NAIA license by site with Flash',
            eyebrow: 'On the ground',
            caption: 'Play stops before the first strike, not after it',
          }}
        />
        <PricingFaq />
      </main>
      <SiteFooter />
    </>
  );
}
