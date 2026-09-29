import { Breadcrumbs } from '@/components/breadcrumbs';
import { AskFlash } from '@/components/products/hail/ask-flash';
import { hailFaqs, hailPage } from '@/components/products/hail/content';
import { HailHero } from '@/components/products/hail/hero';
import { PredictionVsTracking } from '@/components/products/hail/prediction-vs-tracking';
import { PressCoverage } from '@/components/products/hail/press-coverage';
import { SizeClasses } from '@/components/products/hail/size-classes';
import { SpecGrid } from '@/components/products/hail/spec-grid';
import { UseCases } from '@/components/products/hail/use-cases';
import { ProductFaq } from '@/components/products/product-faq';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { productsCrumb } from '@/content/products';
import { JsonLd, productSchema } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: hailPage.title,
  description: hailPage.description,
  path: hailPage.path,
});

export default function HailPredictionPage() {
  return (
    <>
      <SiteHeader tone="dark" />
      <main id="main">
        <JsonLd
          schema={productSchema({
            name: hailPage.schemaName,
            description: hailPage.description,
            path: hailPage.path,
            image: hailPage.heroImage,
          })}
        />
        <Breadcrumbs
          trail={[...productsCrumb, { name: hailPage.name, path: hailPage.path }]}
          className="sr-only"
        />
        <HailHero />
        <PredictionVsTracking />
        <SizeClasses />
        <UseCases />
        <PressCoverage />
        <SpecGrid />
        <AskFlash />
        <ProductFaq
          labelTone="muted-light"
          size="md"
          heading="What do roofers and fleet managers ask first?"
          intro="The questions that come up before a hail demo, answered with the numbers from the spec grid above."
          faqs={hailFaqs}
          links={[{ label: 'All questions', href: '/resources/frequently-asked-questions/' }]}
        />
      </main>
      <SiteFooter />
    </>
  );
}
