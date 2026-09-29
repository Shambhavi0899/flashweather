import Link from 'next/link';

import { IndustryPanelList } from '@/components/home/industry-panel-list';
import { Motion } from '@/components/motion';
import { SectionHeader } from '@/components/products/section-header';

import { industries } from './content';

/**
 * The three verticals that make the lightning call, as the home page's
 * expanding panels (<IndustryPanelList>, `ind-*` in styles/home.css): one open
 * at a time, each showing the role, their call, Flash Agent's verdict, the
 * summary and the link to its industry page. Hover, click and the arrow keys
 * open a panel; in view and idle it advances every 5s along a gold bar,
 * paused on hover. Below lg it is a vertical accordion. <Motion> plays the
 * scroll-in: the heading rises, then the panels slide up in turn.
 */
export function LightningIndustries() {
  return (
    <section aria-labelledby="industries-heading" className="bg-brand-navy">
      <Motion replay={false} threshold={0.2} className="motion container-page flex flex-col gap-10 py-20 lg:py-[120px]">
        <SectionHeader
          id="industries-heading"
          size="md"
          labelTone="muted-dark"
          tone="dark"
          label={industries.label}
          heading={industries.heading}
          className="ind-headrow"
          aside={
            <Link
              href={industries.allLink.href}
              className="text-body-s font-semibold text-text-on-dark hover:underline lg:block lg:text-right"
            >
              {industries.allLink.label} <span aria-hidden>→</span>
            </Link>
          }
        />

        <IndustryPanelList name="lightning-industry" labelledBy="industries-heading" panels={industries.cards} />
      </Motion>
    </section>
  );
}
