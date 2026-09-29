import Link from 'next/link';

import { SectionHeader } from '@/components/products/section-header';
import { productPaths } from '@/content/products';

import { AskHail } from './ask-hail';
import { agentExamples } from './content';

/**
 * Two illustrative Flash Agent exchanges over FlashHail cells, one about
 * last night and one about the next hour, on a shared time slider
 * (ask-hail.tsx).
 */
export function AskFlash() {
  return (
    <section aria-labelledby="hail-ask-flash-heading" className="bg-brand-navy-deep">
      <div className="container-page flex flex-col gap-12 py-20 lg:py-[112px]">
        <SectionHeader
          size="md"
          id="hail-ask-flash-heading"
          tone="dark"
          label="Ask Flash · Flash Agent · Illustrative example · not live weather"
          heading="Ask where the hail will be, and where it was."
          aside={
            <div className="flex flex-col gap-3">
              <p className="text-body text-[#C9D1E3]">
                Flash Agent reads the same FlashHail cells and the same five-minute run as this page, then answers or
                acts in the tools you already run. A person confirms before anything changes; every action is logged.
              </p>
              <Link
                href={productPaths.agent}
                className="inline-flex min-h-11 items-center text-body-s leading-5 font-medium text-viz-gold hover:underline"
              >
                How Flash Agent works <span aria-hidden>&nbsp;→</span>
              </Link>
            </div>
          }
        />

        <AskHail past={agentExamples[0]} next={agentExamples[1]} />
      </div>
    </section>
  );
}
