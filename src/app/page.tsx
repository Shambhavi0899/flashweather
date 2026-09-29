import { AgentSection } from '@/components/home/agent-section';
import { Catalogue } from '@/components/home/catalogue';
import { Comparison } from '@/components/home/comparison';
import { Hero } from '@/components/home/hero';
import { HowItWorks } from '@/components/home/how-it-works';
import { Industries } from '@/components/home/industries';
import { Numbers } from '@/components/home/numbers';
import { Products } from '@/components/home/products';
import { Proof } from '@/components/home/proof';
import { SeeWhatsComing } from '@/components/home/see-whats-coming';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { heroImage } from '@/content/home';
import { JsonLd, breadcrumbSchema, productSchema } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';

const title = 'AI weather intelligence platform';
const description =
  'Flash predicts lightning up to 60 minutes out at 99.6% accuracy and hail 55 minutes ahead, at 1km × 1km, so outdoor crews clear, cover and resume on time.';

/**
 * Organization and WebSite are asserted once, in the root layout. The home
 * page adds the platform as a Product and a one-item BreadcrumbList, as the
 * design's SEO panel lists.
 */
export const metadata = buildMetadata({ title, description, path: '/' });

export default function Home() {
  return (
    <>
      <SiteHeader tone="dark" />
      <main id="main">
        <JsonLd
          schema={productSchema({
            name: 'Flash weather intelligence platform',
            description,
            path: '/',
            image: heroImage.src,
          })}
        />
        {/* The root of every trail. Called directly rather than through
            <Breadcrumbs>: a visible one-item "Home" crumb on the home page
            is noise for screen readers. */}
        <JsonLd schema={breadcrumbSchema([{ name: 'Home', path: '/' }])} />

        <Hero />
        <Numbers />
        <AgentSection />
        <Comparison />
        <SeeWhatsComing />
        <Catalogue />
        <Industries />
        <Products />
        <HowItWorks />
        <Proof />
      </main>
      <SiteFooter />
    </>
  );
}
