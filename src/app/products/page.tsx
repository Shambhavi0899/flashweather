import { Breadcrumbs } from '@/components/breadcrumbs';
import { PlatformHero } from '@/components/products/platform/platform-hero';
import {
  AgentSection,
  CustomerProof,
  PredictionCatalogue,
  ProductGrid,
  StartByRole,
} from '@/components/products/platform/platform-sections';
import { ProductFaq } from '@/components/products/product-faq';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { platformFaqs, productPaths, products, productsCrumb } from '@/content/products';
import { JsonLd, itemListSchema, productSchema, softwareApplicationSchema } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';

const description =
  'Lightning, hail and heat predicted on a 1 km grid every 2 minutes, delivered by app, API and Command Center, so every crew acts on the same call.';

export const metadata = buildMetadata({
  title: 'AI weather intelligence platform',
  description,
  path: productPaths.index,
});

/** The product pages and anchors the index exists to point at, in page order. */
const itemList = [
  ...products.map((product) => ({
    name: product.name,
    path: product.href ?? `${productPaths.index}#${product.id}`,
  })),
  { name: 'Flash Agent', path: productPaths.agent },
];

export default function ProductsPage() {
  return (
    <>
      <SiteHeader tone="dark" />
      <main id="main">
        <JsonLd
          schema={productSchema({
            name: 'Flash Weather AI platform',
            description,
            path: productPaths.index,
            image: '/images/products/flash-storm-cell-open-ground-platform-hero.png',
          })}
        />
        <JsonLd
          schema={softwareApplicationSchema({
            name: 'Flash Weather AI',
            description:
              'Lightning, hail, heat and WBGT, wind, rain and frost predictions on a 1 km grid, refreshed every 2 minutes, in the Weather Command Center, the mobile app, the API and Flash Agent.',
            path: productPaths.index,
          })}
        />
        <JsonLd schema={itemListSchema(itemList)} />
        <Breadcrumbs trail={productsCrumb} className="sr-only" />

        <PlatformHero />
        <PredictionCatalogue />
        <ProductGrid />
        <AgentSection />
        <StartByRole />
        <CustomerProof />
        <ProductFaq
          ask
          heading="What do buyers ask before they sign?"
          intro="The objections we hear on every demo, answered here so nobody has to book a call to find out."
          faqs={platformFaqs}
          links={[
            { label: 'All questions', href: '/resources/frequently-asked-questions/' },
            { label: 'How we measure 99.6%', href: '/why-flash/accuracy-method/' },
            { label: 'Plans and pricing', href: '/pricing/' },
          ]}
        />
      </main>
      <SiteFooter />
    </>
  );
}
