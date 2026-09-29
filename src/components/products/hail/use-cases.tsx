import Link from 'next/link';

import { Motion } from '@/components/motion';
import { SectionHeader } from '@/components/products/section-header';

import { carriedSizeClass, heroSizeClasses, sizeClassTone } from './content';
import { UseCaseCards } from './use-case-cards';

/**
 * "Who moves first when the cell is forecast?": the badge carries down the
 * class the size-class table marks, and the four use cases are flip cards
 * (use-case-cards.tsx, styles/hail-use-cases.css) that show who moves on it.
 * The heading and the badge rise in; the cards deal out after them.
 */
export function UseCases() {
  const carried = heroSizeClasses.find((c) => c.key === carriedSizeClass);

  return (
    <section aria-labelledby="hail-use-cases-heading" className="bg-surface-sunken">
      <div className="container-page flex flex-col gap-8 py-20 lg:py-[120px]">
        <Motion replay={false} threshold={0.2} className="motion huc-head flex flex-col gap-8">
          <SectionHeader
            size="md"
            labelTone="muted-light"
            id="hail-use-cases-heading"
            label="Use cases"
            heading="Who moves first when the cell is forecast?"
            aside={
              <Link
                href="/industries-we-serve/"
                className="inline-flex min-h-11 items-center text-body-s leading-5 font-semibold text-brand-blue hover:underline lg:justify-end"
              >
                All industries <span aria-hidden>&nbsp;→</span>
              </Link>
            }
          />
          {carried && (
            <div className="flex border-t border-border-strong pt-8">
              <p className="huc-badge">
                <span aria-hidden className={`size-2.5 shrink-0 rounded-full ${sizeClassTone[carried.key].dot}`} />
                <span>
                  Showing who moves on{' '}
                  <strong>
                    {carried.size} {carried.label.toUpperCase()}
                  </strong>{' '}
                  hail
                </span>
              </p>
            </div>
          )}
        </Motion>
        <UseCaseCards sizeClass={carriedSizeClass} />
      </div>
    </section>
  );
}
