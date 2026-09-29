import { ProductFaq } from '@/components/products/product-faq';
import { LightningAccuracy } from '@/components/products/lightning/accuracy';
import { LightningAskFlash } from '@/components/products/lightning/ask-flash';
import { faq, lightningPage } from '@/components/products/lightning/content';
import { LightningHero } from '@/components/products/lightning/hero';
import { LightningIndustries } from '@/components/products/lightning/industries';
import { LightningSpecs } from '@/components/products/lightning/spec-table';
import { LightningTimeline } from '@/components/products/lightning/timeline';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { JsonLd, productSchema } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: lightningPage.title,
  description: lightningPage.description,
  path: lightningPage.path,
});

export default function LightningPredictionPage() {
  return (
    <>
      <SiteHeader tone="dark" />
      <main id="main">
        <JsonLd
          schema={productSchema({
            name: lightningPage.productName,
            description: lightningPage.description,
            path: lightningPage.path,
            image: lightningPage.heroImage,
          })}
        />
        <LightningHero />
        <LightningSpecs />
        <LightningTimeline />
        <LightningAskFlash />
        <LightningAccuracy />
        <LightningIndustries />
        <ProductFaq labelTone="muted-light" size="md" heading={faq.heading} intro={faq.intro} faqs={faq.faqs} links={faq.links} />
      </main>
      <SiteFooter />
    </>
  );
}
