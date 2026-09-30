import Link from 'next/link';

import { Motion } from '@/components/motion';

/**
 * The hub's figures as a printed receipt: a header, one dotted-leader line per
 * figure, then a footer into the accuracy method. Each strip of paper is its
 * own segment, so on scroll-in the slip prints downward a line at a time
 * (styles/why-flash-receipt.css). The markup is the printed slip.
 */
export function Receipt({
  title,
  stats,
  verified,
  method,
}: {
  title: string;
  stats: { value: string; label: string }[];
  verified: string;
  method: { text: string; href: string };
}) {
  return (
    <Motion className="motion wfr" replay={false} threshold={0.3}>
      <div className="wfr-paper">
        <p className="wfr-seg wfr-head">{title}</p>
        <dl className="wfr-lines">
          {stats.map((stat) => (
            <div key={stat.value} className="wfr-seg wfr-line">
              <dt>{stat.label}</dt>
              <dd>{stat.value}</dd>
            </div>
          ))}
        </dl>
        <p className="wfr-seg wfr-foot">
          {verified} ·{' '}
          <Link href={method.href} className="wfr-method">
            {method.text} <span aria-hidden>→</span>
          </Link>
        </p>
      </div>
    </Motion>
  );
}
