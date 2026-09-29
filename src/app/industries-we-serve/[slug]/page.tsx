import { notFound } from 'next/navigation';

import { AgentSection } from '@/components/home/agent-section';
import { IndustryFaq } from '@/components/industries/industry-faq';
import { IndustryHero } from '@/components/industries/industry-hero';
import { IndustryRelated, IndustryRisks, IndustrySiblings } from '@/components/industries/industry-links';
import { IndustrySections } from '@/components/industries/sections';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { getIndustry, industries, industryPath } from '@/content/industries';
import { hubAgentTab, industryAgentTab } from '@/content/industry-agent-tabs';
import { JsonLd, faqSchema, serviceSchema, softwareApplicationSchema } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';

/**
 * One template, thirteen pages.
 *
 * This is the programmatic-SEO surface: each vertical gets its own URL, its
 * own title, its own description and its own FAQ schema, because "lightning
 * safety for golf courses" and "hail alerts for roofers" are different
 * searches that a single Industries page would rank for neither of.
 *
 * Every section below is driven by the entry in content/industries.ts and is
 * optional: a designed vertical fills hero, sections, related and cta; a
 * lighter one renders from headline, intro, risks and faqs alone. Every page
 * shows the home page's Flash Agent section, opened on its own crew's tab.
 */

type Params = { slug: string };

/** Statically renders all thirteen at build time. */
export function generateStaticParams(): Params[] {
  return industries.map((industry) => ({ slug: industry.slug }));
}

/**
 * Unknown slugs 404 rather than render an empty shell. A soft 404 -- a page
 * that returns 200 with nothing on it -- is indexed, and then competes.
 */
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return {};

  return buildMetadata({
    title: industry.title,
    description: industry.description,
    path: industryPath(industry.slug),
  });
}

export default async function IndustryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  const path = industryPath(industry.slug);
  const trail = [
    { name: 'Home', path: '/' },
    { name: 'Industries', path: '/industries-we-serve/' },
    { name: industry.name, path },
  ];

  return (
    <>
      <SiteHeader tone={industry.hero?.theme === 'light' ? 'light' : 'dark'} />
      <main id="main">
        <JsonLd
          schema={serviceSchema({
            name: industry.title,
            description: industry.description,
            path,
            industry: industry.name,
          })}
        />
        {industry.software && (
          <JsonLd
            schema={softwareApplicationSchema({
              name: industry.software.name,
              description: industry.software.description,
              path: industry.software.path,
            })}
          />
        )}
        {/* Built from the same list the visible FAQ renders, so it only asserts what the page shows. */}
        {industry.faqs.length > 0 && <JsonLd schema={faqSchema(industry.faqs)} />}

        {/* Exactly one h1, inside the hero; the breadcrumb (visible + BreadcrumbList) sits above it. */}
        <IndustryHero industry={industry} trail={trail} />

        <AgentSection defaultTab={industryAgentTab[industry.slug] ?? hubAgentTab} />

        {industry.sections ? <IndustrySections sections={industry.sections} /> : <IndustryRisks industry={industry} />}

        <IndustryFaq industry={industry} />
        <IndustryRelated industry={industry} />
        <IndustrySiblings industry={industry} />

      </main>
      <SiteFooter
        {...(industry.cta?.eyebrow ? { eyebrow: industry.cta.eyebrow } : {})}
        {...(industry.cta?.heading ? { heading: industry.cta.heading } : {})}
        {...(industry.cta?.body ? { body: industry.cta.body } : {})}
      />
    </>
  );
}
