'use client';

import { useEffect, useRef, useState } from 'react';

import type { SensorComparisonRow } from '@/content/pricing';

/** The last row starts at about 1.5s and takes 0.45s; the figure is released after it. */
const FIGURE_MS = 2300;

/**
 * The cost-of-ownership table with two slim bars beside it. As the figure
 * scrolls into view the rows arrive one by one, and each cost row stacks a
 * labelled block onto the Sensor-based bar; the Flash bar stays a flat line,
 * "Software only". A row with `short` (Coverage) stacks nothing and shows as
 * a caption under each bar. Hovering a row lights its block
 * (styles/pricing-sensor-cost.css).
 *
 * The markup is the finished figure. The script holds it on the first frame
 * (`data-anim="idle"`), runs it on sight and then removes the attribute, so
 * without JavaScript or with reduced motion the full stack is simply there.
 */
export function SensorCostFigure({ rows }: { rows: SensorComparisonRow[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let timer = 0;
    root.dataset.anim = 'idle';
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        root.dataset.anim = 'run';
        timer = window.setTimeout(() => delete root.dataset.anim, FIGURE_MS);
      },
      { threshold: 0.35 },
    );
    observer.observe(root);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
      delete root.dataset.anim;
    };
  }, []);

  const costs = rows.filter((r) => !r.short);
  const reach = rows.find((r) => r.short);
  const on = (item: string) => (active === item ? '' : undefined);
  const hover = (item: string) => ({
    onMouseEnter: () => setActive(item),
    onMouseLeave: () => setActive(null),
  });

  return (
    <div ref={ref} className="sc" data-active={active ?? undefined}>
      {/* The table below says all of this; the bars are one picture of it. */}
      <div
        role="img"
        aria-label={`Sensor-based system: ${costs.length} line items stacked, ${costs
          .map((r) => r.item.toLowerCase())
          .join(', ')}. Flash: none, software only.`}
        className="sc-bars"
      >
        <p className="sc-note">One block per line item. Blocks count items, not dollars.</p>
        <div className="sc-chart">
          <div data-bar="sensor" className="sc-bar">
            <div className="sc-stack">
              {costs.map((r) => (
                <div key={r.item} data-on={on(r.item)} className="sc-block" {...hover(r.item)}>
                  <span className="sc-fill" />
                  <span className="sc-label">{r.item}</span>
                </div>
              ))}
            </div>
            <div className="sc-legend">
              <span className="sc-name">Sensor-based</span>
              {reach?.short && (
                <span data-on={on(reach.item)} className="sc-reach">
                  {reach.short.sensor}
                </span>
              )}
            </div>
          </div>
          <div data-bar="flash" className="sc-bar">
            <div className="sc-flat">
              <span className="sc-flat-label">Software only</span>
              <span className="sc-flat-line" />
            </div>
            <div className="sc-legend">
              <span className="sc-name">Flash</span>
              {reach?.short && (
                <span data-on={on(reach.item)} className="sc-reach">
                  {reach.short.flash}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="sc-frame relative overflow-x-auto rounded-[20px] border border-white/10 bg-[#040818B8]">
        <table className="sc-table w-full min-w-[640px] text-left">
          <caption className="sr-only">Line items on a sensor-based system compared with Flash</caption>
          <thead>
            <tr className="border-b border-white/8 text-micro font-semibold tracking-label">
              <th scope="col" className="sc-col-item px-6 py-4 font-semibold text-text-on-dark-muted">
                LINE ITEM
              </th>
              <th scope="col" className="sc-col-flash px-6 py-4 font-semibold text-text-on-dark">
                FLASH
              </th>
              <th scope="col" className="px-6 py-4 font-semibold text-text-on-dark-muted">
                SENSOR-BASED SYSTEM
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.item}
                data-on={on(r.item)}
                className="sc-row border-b border-white/8 align-top last:border-b-0"
                {...hover(r.item)}
              >
                <th scope="row" className="px-6 py-[22px] text-body font-semibold text-text-on-dark">
                  {r.item}
                </th>
                <td className="px-6 py-[22px] text-body text-text-on-dark">{r.flash}</td>
                <td className="px-6 py-[22px] text-body text-text-on-dark-muted">{r.sensor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
