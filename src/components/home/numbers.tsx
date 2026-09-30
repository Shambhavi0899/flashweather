import Link from 'next/link';

import { StatTile } from '@/components/stats/stat-tile';
import { stats } from '@/content/home';

/**
 * The five headline numbers, each with the small diagram the design draws
 * above it, on the hero's navy (`stats-dark` recolours the diagrams for it,
 * styles/home.css). The tile, its diagrams and their motion are the shared
 * <StatTile> (components/stats/stat-tile.tsx), which the Lightning page's
 * spec tiles use too.
 */
export function Numbers() {
  return (
    <section id="numbers" aria-label="Flash in numbers" className="stats-dark scroll-mt-4 bg-brand-navy">
      <dl className="container-page grid grid-cols-1 gap-y-10 py-14 lg:py-16 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat, i) => (
          <StatTile
            key={stat.id}
            diagram={stat.id}
            value={stat.value}
            className={`gap-4 sm:px-6 lg:border-r lg:border-l-0 lg:border-white/12 lg:px-6 lg:last:border-r-0 lg:last:pr-0 ${
              i % 2 === 0 ? 'sm:pl-0' : 'sm:border-l sm:border-white/12'
            } ${i === 0 ? 'lg:pl-0' : ''}`}
            valueClassName={`text-[34px] leading-9 font-extrabold tracking-[-0.03em] md:text-[46px] md:leading-12 md:tracking-[-0.05em] ${
              stat.id === 'products' ? 'text-[#6f9bff]' : 'text-text-on-dark'
            }`}
          >
            {/* The label is the term, the number its value; CSS puts the label last. */}
            <dt className="order-last text-caption text-text-on-dark-muted md:leading-[19px]">
              {stat.href ? (
                <Link href={stat.href} className="underline-offset-4 hover:text-text-on-dark hover:underline">
                  {stat.label}
                </Link>
              ) : (
                stat.label
              )}
            </dt>
          </StatTile>
        ))}
      </dl>
    </section>
  );
}
