import type { HeatPolicy } from '@/content/heat-policies';

/**
 * The hero's illustrative 6-hour WBGT outlook, as inline SVG so its labels
 * are real text. Geometry follows the design: 82–92 °F over 140px, one
 * point per hour, the policy threshold as a dashed viz-gold line.
 */
const TOP = 20;
const BOTTOM = 160;
const MIN = 82;
const MAX = 92;
const X0 = 20;
const STEP = 56;

const y = (value: number) => BOTTOM - ((value - MIN) / (MAX - MIN)) * (BOTTOM - TOP);

export function OutlookChart({ outlook }: { outlook: HeatPolicy['outlook'] }) {
  const points = outlook.points.map((point, i) => ({ ...point, x: X0 + i * STEP, y: y(point.value) }));
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y.toFixed(1)}`).join(' ');
  const threshold = y(outlook.threshold);
  const warning = y(89.9);

  return (
    <figure className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-[20px] border border-border-on-dark bg-brand-navy-deep shadow-[0_1px_2px_#0B13220D,0_24px_48px_#0B132229]">
        <div className="flex items-center justify-between border-b border-border-on-dark px-6 py-4">
          <p className="text-[11px] leading-[14px] font-semibold tracking-[0.12em] text-text-on-dark-muted uppercase">
            {outlook.title}
          </p>
          <p className="flex items-center gap-[6px] text-[11px] leading-[14px] font-medium text-neutral-500">
            <span aria-hidden className="size-[6px] rounded-full bg-alert-clear" />
            {outlook.time}
          </p>
        </div>
        <div className="px-6 pt-4 pb-1">
          <svg viewBox="0 0 336 184" role="img" aria-label={outlook.alt} className="h-auto w-full">
            <rect x="0" y={TOP} width="300" height={warning - TOP} fill="#C22E22" opacity="0.1" />
            <rect x="0" y={warning} width="300" height={threshold - warning} fill="#D9722B" opacity="0.14" />
            {[160, 132, 104, 76, 48, 20].map((line) => (
              <line key={line} x1="0" y1={line} x2="300" y2={line} stroke="#1C2340" />
            ))}
            <line x1="0" y1={threshold} x2="300" y2={threshold} stroke="#E6BA2D" strokeDasharray="4 4" />
            <text x="306" y={threshold + 4} fontSize="11" fontWeight="600" fill="#E6BA2D">
              {outlook.threshold.toFixed(1)}
            </text>
            <text x="306" y="164" fontSize="10" fill="#8A93A8">
              {MIN}
            </text>
            <text x="306" y="24" fontSize="10" fill="#8A93A8">
              {MAX}
            </text>
            <path d={path} fill="none" stroke="#0B63CE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {points.map((p, i) =>
              i === outlook.peak ? (
                <circle key={p.label} cx={p.x} cy={p.y} r="6" fill="#E6BA2D" stroke="#040818" strokeWidth="2" />
              ) : (
                <circle key={p.label} cx={p.x} cy={p.y} r="3.5" fill="#FFFFFF" />
              ),
            )}
            {points.map((p, i) => (
              <text
                key={p.label}
                x={p.x}
                y="180"
                textAnchor="middle"
                fontSize="11"
                fontWeight={i === outlook.peak ? 600 : 400}
                fill={i === outlook.peak ? '#FFFFFF' : '#8A93A8'}
              >
                {p.label}
              </text>
            ))}
          </svg>
        </div>
        <div className="flex flex-col gap-2 px-6 pt-3 pb-5">
          <ul className="flex flex-wrap items-center gap-2">
            {outlook.chips.map((chip, i) => (
              <li
                key={chip}
                className={`flex h-6 items-center rounded-sm border border-border-on-dark bg-neutral-900 px-[10px] text-micro font-medium ${
                  i === 0 ? 'text-white' : 'text-[#C9D1E3]'
                }`}
              >
                {chip}
              </li>
            ))}
          </ul>
          <p className="text-caption leading-[19px] text-text-on-dark-muted">{outlook.caption}</p>
        </div>
      </div>
      <figcaption className="text-micro leading-caption font-semibold tracking-[0.08em] text-[#8F9AB8] uppercase">
        {outlook.disclaimer}
      </figcaption>
    </figure>
  );
}
