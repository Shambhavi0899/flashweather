import Link from 'next/link';

import { FaqAccordion } from '@/components/faq/faq-accordion';
import { productPaths, type Faq } from '@/content/products';
import { JsonLd, faqSchema } from '@/lib/seo/jsonld';

import { SectionLabel, type LabelEmphasis, type LabelTone } from './section-header';

/**
 * The FAQ block the products pages close on: heading and links on the left,
 * the questions on the right. Emits FAQPage schema from the same array it
 * renders, so the schema can only ever describe questions that are visible.
 *
 * The questions are the site's <FaqAccordion>, and the left column holds in
 * view on desktop while that list scrolls. `ask` closes the list on the row
 * that leads to Flash Agent.
 */
export function ProductFaq({
  heading,
  intro,
  faqs,
  links = [],
  label = 'FAQ',
  labelTone = 'light',
  labelEmphasis,
  size = 'lg',
  ask = false,
}: {
  heading: string;
  intro?: string;
  faqs: Faq[];
  links?: { label: string; href: string }[];
  label?: string;
  labelTone?: LabelTone;
  labelEmphasis?: LabelEmphasis;
  /**
   * 'lg' is the design's 44px heading with a 16/26 intro and medium links;
   * 'md' its 40px one, with a 15/24 intro and semibold links.
   */
  size?: 'lg' | 'md';
  ask?: boolean;
}) {
  const md = size === 'md';
  return (
    <section aria-labelledby="faq-heading" className="border-t border-border bg-surface-sunken">
      <JsonLd schema={faqSchema(faqs)} />
      <div className="container-page flex flex-col gap-12 py-20 lg:flex-row lg:items-start lg:gap-24 lg:py-[120px]">
        <div className="flex flex-col gap-5 lg:sticky lg:top-24 lg:w-[400px] lg:shrink xl:shrink-0">
          <SectionLabel tone={labelTone} emphasis={labelEmphasis}>
            {label}
          </SectionLabel>
          <h2
            id="faq-heading"
            className={`text-[32px] leading-[38px] font-extrabold tracking-[-0.03em] text-text ${
              md ? 'lg:text-h1 lg:leading-h1' : 'lg:text-display-m lg:leading-display-m'
            }`}
          >
            {heading}
          </h2>
          {intro && (
            <p className={`text-pretty text-text-muted ${md ? 'text-[15px] leading-6' : 'text-body'}`}>{intro}</p>
          )}
          {links.length > 0 && (
            <ul className="flex flex-col gap-2 pt-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-body-s leading-5 text-brand-blue hover:underline ${
                      md ? 'font-semibold' : 'font-medium'
                    }`}
                  >
                    {link.label} <span aria-hidden>→</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <FaqAccordion
          flush
          className="flex grow basis-0 flex-col"
          ask={ask ? productPaths.agent : undefined}
          faqs={faqs.map((faq) => ({
            question: faq.question,
            answer: faq.answer,
            icon: faq.icon,
            after: faq.link && (
              <Link
                href={faq.link.href}
                className="mt-3 inline-block text-body-s leading-5 font-semibold text-brand-blue hover:underline"
              >
                {faq.link.label} <span aria-hidden>→</span>
              </Link>
            ),
          }))}
        />
      </div>
    </section>
  );
}
