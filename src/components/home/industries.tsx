import { Motion } from '@/components/motion';
import { industryCards } from '@/content/home';

import { IndustryPanelList } from './industry-panel-list';

/**
 * "Built for the person who has to make the call": six photo panels, one open
 * (<IndustryPanelList>, shared with the Lightning page). Each shows who makes
 * the call, the call, Flash Agent's verdict with its line, and the link to
 * that industry's page; the card summaries are not shown. <Motion> plays the
 * scroll-in.
 */
export function Industries() {
  return (
    <section aria-labelledby="industries-heading" className="bg-neutral-0">
      <Motion
        replay={false}
        threshold={0.2}
        className="motion ind container-page flex flex-col gap-12 py-20 lg:py-[120px]"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="ind-head flex max-w-narrow flex-col gap-4">
            <p className="text-[11px] leading-[14px] font-semibold tracking-label-wide text-text-muted uppercase">
              Industries · six entry points, six canonical pages
            </p>
            <h2
              id="industries-heading"
              className="text-[28px] leading-[34px] font-extrabold tracking-[-0.03em] text-text md:text-h2 md:leading-h2 md:tracking-[-0.04em]"
            >
              Built for the person who has to make the call.
            </h2>
          </div>
          <p className="ind-intro max-w-[380px] text-body leading-body text-pretty text-text-muted">
            Each page answers one buyer&rsquo;s search, links to its product, a case study, the comparison and pricing.
          </p>
        </div>

        <IndustryPanelList
          name="industry"
          labelledBy="industries-heading"
          panels={industryCards.map((card) => ({ ...card, body: undefined, linkLabel: `See Flash for ${card.linkName}` }))}
        />
      </Motion>
    </section>
  );
}
