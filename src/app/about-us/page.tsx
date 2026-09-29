import {
  AboutHero,
  NumbersSection,
  OriginSection,
  PrinciplesSection,
  TimelineSection,
  WorkWithUs,
} from '@/components/about/about-sections';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { TrustedStrip } from '@/components/pricing/trusted-strip';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { aboutCustomers, founder } from '@/content/about';
import { JsonLd, personSchema, webPageSchema } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';

const PATH = '/about-us/';
const DESCRIPTION =
  'Flash Weather AI: built by meteorologists in Canton, Georgia. 15+ prediction products on one 1×1 km grid, predicting lightning and hail before they strike.';

export const metadata = buildMetadata({
  title: 'About us: built by meteorologists',
  description: DESCRIPTION,
  path: PATH,
});

export default function AboutPage() {
  return (
    <>
      <SiteHeader tone="dark" />
      <main id="main">
        <JsonLd schema={webPageSchema({ type: 'AboutPage', name: 'About Flash Weather AI', description: DESCRIPTION, path: PATH })} />
        <JsonLd
          schema={personSchema({
            name: founder.name,
            jobTitle: founder.jobTitle,
            description: founder.description,
            path: PATH,
          })}
        />
        <Breadcrumbs
          className="sr-only"
          trail={[
            { name: 'Home', path: '/' },
            { name: 'About', path: PATH },
          ]}
        />
        <AboutHero />
        <OriginSection />
        <PrinciplesSection />
        <NumbersSection />
        <TimelineSection />
        <TrustedStrip customers={aboutCustomers} />
        <WorkWithUs />
      </main>
      <SiteFooter eyebrow="Book a demo · No sensors to install" />
    </>
  );
}
