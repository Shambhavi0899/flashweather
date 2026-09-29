import Link from 'next/link';

import type { HubRun } from '@/content/why-flash-hub';

/** A paragraph's runs: plain text, bold, or an internal link. */
export function HubRuns({ runs }: { runs: HubRun[] }) {
  return (
    <>
      {runs.map((run, i) => {
        if (typeof run === 'string') return <span key={i}>{run}</span>;
        if ('href' in run) {
          return (
            <Link key={i} href={run.href} className="font-bold text-brand-blue underline underline-offset-[3px]">
              {run.text}
            </Link>
          );
        }
        return (
          <strong key={i} className="font-bold">
            {run.text}
          </strong>
        );
      })}
    </>
  );
}
