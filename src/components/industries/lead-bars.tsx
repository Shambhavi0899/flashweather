import type { StripLead } from '@/content/industries';

/**
 * A strip's warning lead times as slim bars, one per warning, each as long as
 * its minutes over the longest lead. The longest one's label is marked. The
 * bars grow in with the strip's stat column (a <Motion> in StripSection);
 * styles and timing in src/styles/lead-bars.css.
 */
export function LeadBars({ leads }: { leads: StripLead[] }) {
  const longest = Math.max(...leads.map((lead) => lead.minutes));

  return (
    <ul className="slb">
      {leads.map((lead) => (
        <li key={lead.tone} className="slb-row">
          <span className="slb-label" data-mark={lead.minutes === longest ? '' : undefined}>
            {`${lead.label} · up to ${lead.minutes} min`}
          </span>
          <svg aria-hidden className="slb-track">
            <rect
              className="slb-bar"
              data-tone={lead.tone}
              width={`${((lead.minutes / longest) * 100).toFixed(3)}%`}
              height="4"
              rx="2"
            />
          </svg>
        </li>
      ))}
    </ul>
  );
}
