import { alertLogExample } from '@/content/faq';

const timeTone = {
  advisory: 'text-viz-gold',
  warning: 'text-alert-warning',
  clear: 'text-alert-clear',
} as const;

/**
 * The illustrative alert-log export in the audit-file group, rebuilt as a
 * real table so the rows are text a crawler can read. Labelled as an
 * illustrative example, not live weather, exactly as the design does.
 */
export function AlertLog() {
  const log = alertLogExample;
  return (
    <figure className="flex flex-col gap-[10px]">
      <div className="relative overflow-x-auto rounded-lg bg-brand-navy px-6 pt-5 pb-2">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <caption className="border-b border-border-on-dark pb-[14px] text-left">
            <span className="flex items-center justify-between gap-4">
              <span className="text-[11px] leading-[16px] font-semibold tracking-[0.16em] text-viz-gold uppercase">
                {log.label}
              </span>
              <span className="shrink-0 text-micro text-text-on-dark-muted">{log.exportNote}</span>
            </span>
          </caption>
          <thead>
            <tr className="text-[11px] leading-[16px] font-semibold tracking-label text-text-on-dark-muted uppercase">
              <th scope="col" className="w-[84px] pt-3 pr-4 pb-2 font-semibold">
                Time
              </th>
              <th scope="col" className="pt-3 pr-4 pb-2 font-semibold">
                Event
              </th>
              <th scope="col" className="w-[116px] pt-3 pr-4 pb-2 font-semibold">
                Channel
              </th>
              <th scope="col" className="w-[162px] pt-3 pb-2 font-semibold">
                Acknowledged
              </th>
            </tr>
          </thead>
          <tbody className="text-body-s leading-5">
            {log.rows.map((row) => (
              <tr key={row.time} className="border-t border-border-on-dark align-top">
                <th scope="row" className={`py-[10px] pr-4 font-semibold ${timeTone[row.tone]}`}>
                  {row.time}
                </th>
                <td className="py-[10px] pr-4 text-text-on-dark">{row.event}</td>
                <td className="py-[10px] pr-4 text-text-on-dark-muted">{row.channel}</td>
                <td className="py-[10px] text-text-on-dark-muted">{row.acknowledged}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className="sr-only">{log.caption}</figcaption>
    </figure>
  );
}
