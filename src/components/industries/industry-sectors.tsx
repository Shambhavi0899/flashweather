import Image from 'next/image';
import Link from 'next/link';

import { Motion } from '@/components/motion';
import { industryPath, industrySectors, sectorHazards, sectorIndustries } from '@/content/industries';

const HEADING_ID = 'all-industries';

/**
 * "Built for the person who has to make the call.": every vertical, grouped
 * into three sector panels. Each panel is a photo header with the sector's
 * name, the hazards its industries watch as tags right under the photo, then
 * its industries as rows (name, one line, arrow, each the link to that
 * industry's page). Every row is the same height, so rows line up across the
 * three panels. The panels fade up as they scroll in (<Motion>); the rows
 * come with them and are always visible.
 */
export function IndustrySectors() {
  return (
    <section aria-labelledby={HEADING_ID} className="bg-neutral-0">
      <div className="container-page flex flex-col gap-10 py-16 md:py-24 xl:gap-12 xl:py-[120px]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="flex max-w-narrow flex-col gap-4">
            <p className="text-[11px] leading-[14px] font-semibold tracking-label-wide text-text-muted">
              ONE PAGE PER BUYER
            </p>
            <h2
              id={HEADING_ID}
              className="text-[28px] leading-[34px] font-extrabold tracking-[-0.04em] text-text md:text-h2 md:leading-h2"
            >
              Built for the person who has to make the call.
            </h2>
          </div>
          <p className="max-w-[380px] text-body text-text-muted">
            Each page answers one buyer’s search, links to its product, a case study, the comparison and pricing.
          </p>
        </div>

        <div className="isec-list">
          {industrySectors.map((sector) => {
            const rows = sectorIndustries(sector);
            const titleId = `sector-${sector.id}`;
            return (
              <Motion key={sector.id} replay={false} threshold={0.15} className="motion isec-panel">
                <article aria-labelledby={titleId} className="isec-card">
                  <header className="isec-head" data-tone={sector.tone}>
                    <Image
                      src={sector.image.src}
                      alt=""
                      fill
                      sizes="(min-width: 1440px) 400px, (min-width: 1024px) 33vw, 100vw"
                      quality={75}
                    />
                    <h3 id={titleId} className="isec-name">
                      {sector.name}
                    </h3>
                    <p className="isec-count">{rows.length} industries</p>
                  </header>

                  <ul aria-label={`Hazards covered in ${sector.name}`} className="isec-tags">
                    {sectorHazards(sector).map((hazard) => (
                      <li key={hazard} className="isec-tag">
                        {hazard}
                      </li>
                    ))}
                  </ul>

                  <ul className="isec-rows">
                    {rows.map((industry) => (
                      <li key={industry.slug} className="isec-row">
                        <Link href={industryPath(industry.slug)} className="isec-link">
                          <div className="isec-copy">
                            <h4 className="isec-title">{industry.name}</h4>
                            <p className="isec-line">
                              {industry.card?.line ?? industry.card?.summary ?? industry.headline}
                            </p>
                          </div>
                          <span aria-hidden className="isec-arrow">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.75"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 12h14M13 6l6 6-6 6" />
                            </svg>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </article>
              </Motion>
            );
          })}
        </div>
      </div>
    </section>
  );
}
