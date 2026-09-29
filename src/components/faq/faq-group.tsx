import Image from 'next/image';
import Link from 'next/link';

import type { FaqGroup as FaqGroupData } from '@/content/faq';

import { AlertLog } from './alert-log';
import { FaqAccordion } from './faq-accordion';

/**
 * One objection group: the photo header, number, H2 and short answer on the
 * left; the two questions on the right as the site's <FaqAccordion>, every
 * answer in the server HTML. Each answer ends on the page that proves it.
 */
export function FaqGroup({ group }: { group: FaqGroupData }) {
  const headingId = `${group.id}-heading`;

  return (
    <section
      id={group.id}
      aria-labelledby={headingId}
      className="scroll-mt-6 border-t border-border bg-neutral-0"
    >
      <div className="container-page flex flex-col gap-10 py-16 lg:flex-row lg:gap-12 lg:py-[88px]">
        <div className="flex flex-col gap-5 lg:w-[440px] lg:shrink xl:shrink-0">
          <div className="relative h-[150px] overflow-hidden rounded-lg bg-brand-navy">
            <Image
              src={group.header.image}
              alt={group.header.alt}
              fill
              sizes="(min-width: 1024px) 440px, calc(100vw - 32px)"
              className={`object-cover ${group.header.imageClassName ?? ''}`}
            />
            <div aria-hidden className="faq-group-header-grade absolute inset-0" />
            <p className="absolute top-4 left-[18px] text-[10px] leading-3 font-extrabold tracking-[0.13em] text-viz-gold uppercase">
              {group.header.eyebrow}
            </p>
            <p className="absolute right-[18px] bottom-4 left-[18px] text-[15px] leading-5 font-extrabold tracking-heading text-text-on-dark">
              {group.header.caption}
            </p>
          </div>

          <p aria-hidden className="text-[48px] leading-[48px] font-bold tracking-[-0.04em] text-neutral-300 lg:text-[64px] lg:leading-16">
            {group.number}
          </p>
          <h2
            id={headingId}
            className="text-[28px] leading-[34px] font-extrabold tracking-[-0.03em] text-text lg:text-[34px] lg:leading-10"
          >
            {group.heading}
          </h2>
          <p className="max-w-[400px] text-[15px] leading-6 text-pretty text-text-muted">{group.shortAnswer}</p>
        </div>

        <div className="flex min-w-0 flex-col gap-10 lg:w-[760px] lg:shrink">
          <FaqAccordion
            flush
            row="py-8"
            question="text-h4 leading-h4 font-semibold tracking-heading text-pretty text-text"
            answer="mt-3 text-[17px] leading-h4 text-pretty text-text"
            faqs={group.items.map((item) => ({
              question: item.question,
              answer: item.answer,
              after: (
                <p className="mt-1 text-body-s leading-5 font-medium">
                  <Link
                    href={item.source.href}
                    className="inline-flex min-h-11 items-center text-brand-blue hover:underline"
                  >
                    Source <span aria-hidden>→</span> {item.source.label}
                  </Link>
                </p>
              ),
            }))}
          />
          {group.showAlertLog && <AlertLog />}
        </div>
      </div>
    </section>
  );
}
