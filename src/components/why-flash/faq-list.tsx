import { FaqAccordion } from '@/components/faq/faq-accordion';
import type { Faq } from '@/content/why-flash';

import { LinkifiedText } from './linkified-text';

/**
 * The comparison pages' FAQ, as the site's <FaqAccordion>. Every answer is in
 * the HTML whatever is open, which is what FAQPage schema requires.
 */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <FaqAccordion
      className="flex flex-col border-t border-border"
      row="py-[22px]"
      question="text-body-l leading-body font-bold text-text"
      answer="mt-3 max-w-[820px] text-body text-text-muted"
      faqs={faqs.map((faq) => ({
        question: faq.question,
        answer: <LinkifiedText text={faq.answer} links={faq.links} />,
      }))}
    />
  );
}
