import Link from 'next/link';

import { partners } from '@/content/press';

/**
 * "What each partner does with Flash". Audit finding: the old partners page
 * was a wall of logos linking out to partner homepages, which sent visitors
 * away. Each row here says what the partner does and links to the Flash page
 * that explains that work -- an internal link, not an exit.
 */
export function PartnerList() {
  return (
    <section id="partners" aria-labelledby="partners-heading" className="scroll-mt-6 bg-neutral-0">
      <div className="container-page flex flex-col gap-8 py-16 lg:py-[112px]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <h2
            id="partners-heading"
            className="text-[30px] leading-[36px] font-extrabold tracking-[-0.03em] text-text md:text-h1 md:leading-h1"
          >
            What each partner does with Flash
          </h2>
          <p className="max-w-[400px] text-[15px] leading-6 text-pretty text-text-muted lg:shrink-0">
            Each row links to the Flash page that explains the work, not only to the partner&apos;s own site.
          </p>
        </div>

        <ul className="flex flex-col border-b border-border">
          {partners.map((partner) => (
            <li
              key={partner.name}
              className="flex flex-col gap-3 border-t border-border py-6 md:grid md:grid-cols-[220px_1fr] md:gap-x-8 lg:flex lg:flex-row lg:items-start"
            >
              <h3 className="text-h4 leading-h4 font-semibold tracking-heading text-text lg:w-[220px] lg:shrink xl:shrink-0 xl:w-[300px]">
                {partner.name}
              </h3>
              <p className="text-[17px] leading-h4 text-pretty text-text lg:min-w-0 lg:flex-1 xl:max-w-[640px]">{partner.work}</p>
              <p className="text-body-s leading-5 font-medium md:col-start-2 lg:w-[180px] lg:shrink xl:shrink-0 lg:text-right xl:w-auto xl:flex-1">
                <Link href={partner.link.href} className="inline-flex min-h-11 items-center lg:min-h-6 text-brand-blue hover:underline">
                  {partner.link.label}&nbsp;<span aria-hidden>→</span>
                </Link>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
