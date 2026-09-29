import { FaqAccordion } from '@/components/faq/faq-accordion';

/**
 * An article's FAQ, as the site's <FaqAccordion>. Every answer is in the
 * HTML whatever is open, so the text always matches the FAQPage schema.
 */
export function FaqList({
  id,
  heading,
  faqs,
  headingClassName = 'text-[28px] leading-[36px]',
}: {
  id: string;
  heading: string;
  faqs: { question: string; answer: string }[];
  headingClassName?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="flex scroll-mt-6 flex-col gap-2">
      <h2 id={`${id}-heading`} className={`pb-2 font-extrabold tracking-[-0.03em] text-text ${headingClassName}`}>
        {heading}
      </h2>
      <FaqAccordion
        className="flex flex-col border-t border-border-strong"
        row="py-[18px]"
        question="text-body leading-[22px] font-semibold text-text md:text-body-l md:leading-body"
        answer="mt-2 text-[15px] leading-6 text-text-muted sm:pr-12"
        faqs={faqs}
      />
    </section>
  );
}
