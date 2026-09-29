import { notFound } from 'next/navigation';

import {
  ProductFeatures,
  ProductOverview,
  ProductPageHero,
  ProductRelated,
} from '@/components/products/detail/product-page-sections';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { getProductPage, productPagePath, productPages } from '@/content/product-pages';
import { productsCrumb } from '@/content/products';
import { JsonLd, productSchema, softwareApplicationSchema } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';

/**
 * One template, six pages: the secondary products, driven by
 * content/product-pages.ts. The hand-built product pages (lightning, hail,
 * heat, API, Flash Agent) are static siblings, which Next serves ahead of
 * this dynamic segment.
 */

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return productPages.map((page) => ({ slug: page.slug }));
}

/** Unknown slugs 404 rather than render an empty shell. */
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const page = getProductPage(slug);
  if (!page) return {};

  return buildMetadata({
    title: page.title,
    description: page.description,
    path: productPagePath(page.slug),
  });
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const page = getProductPage(slug);
  if (!page) notFound();

  const path = productPagePath(page.slug);
  const trail = [...productsCrumb, { name: page.name, path }];
  const schema =
    page.schema.type === 'software'
      ? softwareApplicationSchema({
          name: page.name,
          description: page.description,
          path,
          category: page.schema.category,
          operatingSystem: page.schema.operatingSystem,
        })
      : productSchema({ name: page.name, description: page.description, path, image: page.heroImage.src });

  return (
    <>
      <SiteHeader tone="dark" />
      <main id="main">
        <JsonLd schema={schema} />
        <ProductPageHero page={page} trail={trail} />
        <ProductOverview page={page} />
        <ProductFeatures page={page} />
        <ProductRelated page={page} />
      </main>
      <SiteFooter
        eyebrow="Live demo · Your sites on the map"
        heading="Make the call before the weather does"
        body="Discover purpose-built weather tools designed to help teams act earlier and operate with confidence. Choose the product that fits your operations and scale weather intelligence across your teams."
      />
    </>
  );
}
