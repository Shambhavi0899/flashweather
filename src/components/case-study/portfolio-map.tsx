import { IllustrativeChip } from '@/components/why-flash/section-heading';

type LogEntry = { time: string; entry: string };

const F = { fontFamily: 'var(--font-manrope), system-ui, sans-serif' } as const;
const gold = 'var(--color-viz-gold)';

// The design's 48px grid over a 1248×440 panel.
const GRID = [
  ...Array.from({ length: 25 }, (_, i) => `M${48 * (i + 1)} 0V440`),
  ...Array.from({ length: 9 }, (_, i) => `M0 ${48 * (i + 1)}H1248`),
].join('');

const ring = [
  [528, 192],
  [720, 192],
  [624, 96],
  [624, 288],
  [576, 144],
  [672, 144],
  [576, 240],
  [672, 240],
];
const watch = [
  [576, 192],
  [672, 192],
  [624, 144],
  [624, 240],
];

/**
 * The Weather Command Center portfolio map (troon-golf-portfolio-flash-
 * weather-command-center-map.png in the design), rebuilt in SVG and HTML so
 * the event log is text. Illustrative, not live weather.
 */
export function PortfolioMap({ alt, log }: { alt: string; log: LogEntry[] }) {
  return (
    <figure aria-label={alt} className="overflow-hidden rounded-lg bg-brand-navy lg:relative lg:aspect-[1248/440]">
      <figcaption className="flex flex-col gap-1 p-5 lg:absolute lg:top-6 lg:left-6 lg:z-10 lg:p-0">
        <span className="text-[11px] leading-[14px] font-semibold tracking-label text-text-on-dark uppercase">
          Portfolio view · All properties · 60-min lead
        </span>
        <span className="text-micro text-text-on-dark-muted">Refreshed 2 minutes ago · role: General Manager</span>
      </figcaption>

      <div className="relative h-[260px] sm:h-[320px] lg:absolute lg:inset-0 lg:h-auto">
        <svg viewBox="0 0 1248 440" preserveAspectRatio="xMidYMid slice" aria-hidden className="size-full">
          <path d={GRID} fill="none" stroke="var(--color-border-on-dark)" />
          <path d="M380 340L600 226" fill="none" stroke="#FFFFFF99" strokeWidth="1.5" strokeDasharray="4 4" />
          {ring.map(([x, y]) => (
            <rect key={`r${x}-${y}`} x={x} y={y} width="48" height="48" fill={gold} opacity="0.3" />
          ))}
          {watch.map(([x, y]) => (
            <rect key={`w${x}-${y}`} x={x} y={y} width="48" height="48" fill="var(--color-alert-watch)" opacity="0.55" />
          ))}
          <rect x="624" y="192" width="48" height="48" fill="var(--color-alert-warning)" />
          <rect x="1104" y="312" width="48" height="48" fill={gold} opacity="0.5" />
          {[
            [312, 168],
            [648, 216],
            [740, 96],
            [1128, 336],
            [456, 372],
          ].map(([cx, cy]) => (
            <circle key={`p${cx}`} cx={cx} cy={cy} r="6" fill="#FFFFFF" stroke="var(--color-brand-navy)" strokeWidth="2" />
          ))}
          <path d="M640 216H522" fill="none" stroke="#FFFFFFCC" />
          <text x="326" y="172" fontSize="11" fill="var(--color-text-on-dark-muted)" {...F}>
            Property 0398 · Clear
          </text>
          <text x="514" y="220" textAnchor="end" fontSize="11" fontWeight="700" fill="#FFFFFF" {...F}>
            Property 0412 · Warning · horns 14:21
          </text>
          <text x="754" y="100" fontSize="11" fill="var(--color-text-on-dark-muted)" {...F}>
            Property 0421 · Clear
          </text>
          <text x="1114" y="340" textAnchor="end" fontSize="11" fill="var(--color-text-on-dark-muted)" {...F}>
            Property 0433 · Advisory · 38 min
          </text>
          <text x="470" y="376" fontSize="11" fill="var(--color-text-on-dark-muted)" {...F}>
            Property 0407 · Clear
          </text>
        </svg>
      </div>

      <div className="m-5 flex flex-col gap-[10px] rounded-md border border-border-on-dark bg-brand-navy-deep px-[18px] py-4 lg:absolute lg:top-6 lg:right-6 lg:m-0 lg:w-[320px]">
        <p className="text-[10px] leading-3 font-semibold tracking-label text-text-on-dark-muted uppercase">
          Event log · Property 0412
        </p>
        <ol className="flex flex-col gap-[10px]">
          {log.map((item) => (
            <li key={item.time} className="flex gap-3">
              <time className="w-[44px] shrink-0 text-[11px] leading-caption font-semibold text-text-on-dark">
                {item.time}
              </time>
              <span className="text-caption text-text-on-dark-muted">{item.entry}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 px-5 pb-5 lg:absolute lg:inset-x-6 lg:bottom-5 lg:p-0">
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-micro text-text-on-dark-muted">
          {[
            ['bg-alert-clear', 'Clear'],
            ['bg-viz-gold', 'Advisory'],
            ['bg-alert-watch', 'Watch'],
            ['bg-alert-warning', 'Warning · 1 km cell'],
          ].map(([swatch, label]) => (
            <li key={label} className="flex items-center gap-[6px]">
              <span aria-hidden className={`size-[10px] shrink-0 rounded-full ${swatch}`} />
              {label}
            </li>
          ))}
        </ul>
        <IllustrativeChip tone="dark" />
      </div>
    </figure>
  );
}
