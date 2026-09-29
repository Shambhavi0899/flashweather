import type { HeatPolicy, ThresholdBand } from '@/content/heat-policies';

/** Row edge colour on the Flash alert scale. */
const edge: Record<ThresholdBand['tone'], string> = {
  clear: 'border-l-alert-clear',
  advisory: 'border-l-alert-advisory',
  watch: 'border-l-alert-watch',
  warning: 'border-l-alert-warning',
  extreme: 'border-l-brand-navy',
};

/**
 * The association's WBGT bands as a real table: a crawler and a screen
 * reader get rows and headers, not a picture of one. Wide on phones, so it
 * scrolls inside its own wrapper rather than widening the page.
 */
export function ThresholdTable({ table }: { table: HeatPolicy['table'] }) {
  const cell = 'px-4 py-[14px] align-top text-body-s';
  return (
    <div className="flex flex-col gap-3">
      <div className="relative overflow-x-auto rounded-md border border-border" tabIndex={0} role="region" aria-label={table.heading}>
        <table className="w-full min-w-[640px] border-collapse text-left">
          <caption className="sr-only">{table.caption}</caption>
          <thead className="bg-surface-sunken">
            <tr className="border-b border-l-4 border-border border-l-border">
              {table.columns.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="px-4 py-3 text-micro font-bold tracking-[0.13em] text-text-muted uppercase"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.bands.map((band) => (
              <tr key={band.range} className={`border-b border-l-4 border-border last:border-b-0 ${edge[band.tone]}`}>
                <th scope="row" className={`${cell} w-[146px] font-bold whitespace-nowrap text-text`}>
                  {band.range}
                </th>
                <td className={`${cell} w-[206px] text-text`}>{band.activity}</td>
                <td className={`${cell} w-[190px] ${band.mutedRest ? 'text-text-muted' : 'text-text'}`}>{band.rest}</td>
                <td className={`${cell} ${band.mutedEquipment ? 'text-text-muted' : 'text-text'}`}>{band.equipment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-micro leading-caption text-text-muted">{table.note}</p>
    </div>
  );
}
