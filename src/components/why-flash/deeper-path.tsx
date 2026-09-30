import Link from 'next/link';

import { Motion } from '@/components/motion';
import { whyFlashOrder, whyFlashPages } from '@/content/why-flash';
import { deeper } from '@/content/why-flash-hub';

/**
 * "Go deeper" on the hub: the section's pages as four numbered steps, joined
 * by one thin line. Left to right from lg, a vertical line down the left edge
 * below it. On scroll the line draws once while the cards arrive in order;
 * hovering a card lifts it, turns its number gold and lights the segment that
 * leads to it. The markup is the finished state, so without JavaScript or
 * with reduced motion the line is simply there.
 */
export function DeeperPath() {
  return (
    <Motion as="ol" replay={false} threshold={0.25} className="motion wfp">
      {whyFlashOrder.map((key, i) => {
        const page = whyFlashPages[key];
        return (
          <li key={key} className="wfp-step">
            <span aria-hidden className="wfp-node" />
            {/* The segment from this step to the next; the last step has none. */}
            {i < whyFlashOrder.length - 1 && <span aria-hidden className="wfp-seg" />}
            <p className="wfp-label text-caption font-bold tracking-label text-text-muted uppercase">
              <span className="wfp-num">{String(i + 1).padStart(2, '0')}</span> {deeper.steps[key]}
            </p>
            <Link
              href={page.path}
              className="wfp-card flex grow flex-col gap-3 rounded-lg border border-border bg-surface-sunken p-6"
            >
              <h3 className="wfp-title text-h4 leading-h4 font-extrabold tracking-heading text-text">{page.label}</h3>
              <p className="grow text-body-s text-text-muted">{page.blurb}</p>
              <span className="inline-flex min-h-11 items-center text-body-s font-bold text-brand-blue">
                Read
                <span aria-hidden className="wfp-arrow">
                  &nbsp;→
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </Motion>
  );
}
