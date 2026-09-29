import { Breadcrumbs } from '@/components/breadcrumbs';
import { ProductFaq } from '@/components/products/product-faq';
import { faqLinks, heatFaqs, heatPage, heroImage } from '@/components/products/heat/content';
import { HeatHero } from '@/components/products/heat/hero';
import {
  AskFlashSection,
  AudiencesSection,
  DecisionSection,
  PredictsSection,
  SpecSection,
  StatePoliciesSection,
} from '@/components/products/heat/sections';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { productsCrumb } from '@/content/products';
import { JsonLd, productSchema } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: heatPage.title,
  description: heatPage.description,
  path: heatPage.path,
});

export default function HeatWbgtPage() {
  return (
    <>
      <SiteHeader tone="dark" />
      <main id="main">
        <JsonLd
          schema={productSchema({
            name: 'Flash Heat and WBGT',
            description: heatPage.description,
            path: heatPage.path,
            image: heroImage.src,
          })}
        />
        <Breadcrumbs
          trail={[...productsCrumb, { name: heatPage.name, path: heatPage.path }]}
          className="sr-only"
        />
        <HeatHero />
        <PredictsSection />
        <DecisionSection />
        <AudiencesSection />
        <AskFlashSection />
        <StatePoliciesSection />
        <SpecSection />
        <ProductFaq
          labelEmphasis="strong"
          heading="What do athletic directors ask before they switch?"
          intro="The four questions that come up on every heat demo, answered with the same numbers as the spec table above."
          faqs={heatFaqs}
          links={faqLinks}
        />
      </main>
      <SiteFooter eyebrow="Book a demo · No sensors to install" />
    </>
  );
}
