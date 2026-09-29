import { Breadcrumbs } from '@/components/breadcrumbs';
import { BuildWithAgent, Integrations } from '@/components/products/api/agent-and-integrations';
import { ApiHero } from '@/components/products/api/api-hero';
import { apiPath, faqLinks, faqs } from '@/components/products/api/content';
import { Endpoints, Parameters, RateLimits, Webhooks } from '@/components/products/api/reference-sections';
import { ProductFaq } from '@/components/products/product-faq';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { productsCrumb } from '@/content/products';
import { JsonLd, productSchema } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';

const description =
  'Flash Weather API: 100+ parameters per 1 km cell as JSON, lightning risk to hail lead time, WBGT and frost, with webhooks that fire before the weather.';

export const metadata = buildMetadata({
  title: 'Weather API for lightning, hail and heat',
  description,
  path: apiPath,
});

export default function ApiOfferingsPage() {
  return (
    <>
      <SiteHeader tone="dark" />
      <main id="main">
        <Breadcrumbs trail={[...productsCrumb, { name: 'Flash API', path: apiPath }]} className="sr-only" />
        <JsonLd
          schema={productSchema({
            name: 'Flash Weather API',
            description,
            path: apiPath,
            image: '/images/products/flash-weather-api-integration-visual.png',
          })}
        />
        <ApiHero />
        <Endpoints />
        <Parameters />
        <Webhooks />
        <RateLimits />
        <BuildWithAgent />
        <Integrations />
        <ProductFaq
          labelEmphasis="strong"
          heading="What do developers ask before they integrate?"
          intro="The four questions from every integration call, answered with the same numbers as the rest of the site."
          faqs={faqs}
          links={faqLinks}
        />
      </main>
      <SiteFooter eyebrow="Book a demo · No sensors to install" />
    </>
  );
}
