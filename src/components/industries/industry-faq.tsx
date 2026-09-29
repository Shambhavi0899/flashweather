import Link from 'next/link';

import { FaqAccordion } from '@/components/faq/faq-accordion';
import type { Industry } from '@/content/industries';

import { Section, SectionHeading } from './primitives';

const ID = 'faq-heading';

const type = {
  question: 'text-body-l font-semibold text-text md:text-h4',
  answer: 'mt-2 max-w-[820px] text-body text-pretty text-text-muted',
};

/**
 * The visible FAQ. It renders exactly `industry.faqs` -- the same list the
 * FAQPage schema is built from -- so the schema never asserts a question the
 * page does not show. The questions are the site's <FaqAccordion> in every
 * layout; 'split' sets the heading beside them and holds it in view on
 * desktop, the others set it above.
 */
export function IndustryFaq({ industry }: { industry: Industry }) {
  const faqs = industry.faqs;
  if (faqs.length === 0) return null;

  const heading = industry.faq?.heading ?? `Questions about Flash for ${industry.name.toLowerCase()}`;
  const layout = industry.faq?.layout ?? 'numbered';
  const link = industry.faq?.link;

  if (layout === 'split') {
    return (
      <Section id={ID}>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:w-[400px] lg:shrink xl:shrink-0">
            <SectionHeading id={ID} heading={heading} intro={industry.faq?.intro}>
              {link && (
                <Link href={link.href} className="text-body-s font-semibold text-brand-blue hover:underline">
                  {link.label} →
                </Link>
              )}
            </SectionHeading>
          </div>
          <FaqAccordion flush className="flex grow basis-0 flex-col" row="py-6" {...type} faqs={faqs} />
        </div>
      </Section>
    );
  }

  return (
    <Section id={ID}>
      <SectionHeading id={ID} heading={heading} intro={industry.faq?.intro} />
      <FaqAccordion
        className={`mt-10 flex flex-col border-t border-border ${layout === 'numbered' ? 'max-w-[1000px]' : ''}`}
        row="py-6"
        {...type}
        faqs={faqs}
      />
    </Section>
  );
}
