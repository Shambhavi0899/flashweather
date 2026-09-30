import { IllustrativeChip } from '@/components/why-flash/section-heading';
import { PortfolioMapMotion } from './portfolio-map-motion';

type LogEntry = { time: string; entry: string; property: string };

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

/** The five properties: the pin, and where its label sits (`end`: right-aligned, left of the pin). */
const PINS = [
  { id: '0398', cx: 312, cy: 168, x: 326, y: 172, end: false, label: 'Property 0398 · Clear' },
  { id: '0412', cx: 648, cy: 216, x: 514, y: 220, end: true, label: 'Property 0412 · Warning · horns 14:21' },
  { id: '0421', cx: 740, cy: 96, x: 754, y: 100, end: false, label: 'Property 0421 · Clear' },
  { id: '0433', cx: 1128, cy: 336, x: 1114, y: 340, end: true, label: 'Property 0433 · Advisory · 38 min' },
  { id: '0407', cx: 456, cy: 372, x: 470, y: 376, end: false, label: 'Property 0407 · Clear' },
];
/** The property the log is open on: its label is the bold one, with a leader to the pin. */
const OPEN = '0412';

/**
 * The Weather Command Center portfolio map (troon-golf-portfolio-flash-
 * weather-command-center-map.png in the design), rebuilt in SVG and HTML so
 * the event log is text. Illustrative, not live weather.
 *
 * The markup is the design's frame. The motion and the pin / entry
 * highlights are portfolio-map-motion.tsx and
 * styles/case-study-portfolio-map.css.
 */
export function PortfolioMap({ alt, log }: { alt: string; log: LogEntry[] }) {
  return (
    <PortfolioMapMotion
      label={alt}
      className="pmap overflow-hidden rounded-lg bg-brand-navy lg:relative lg:aspect-[1248/440]"
    >
      <figcaption className="flex flex-col gap-1 p-5 lg:absolute lg:top-6 lg:left-6 lg:z-10 lg:p-0">
        <span className="text-[11px] leading-[14px] font-semibold tracking-label text-text-on-dark uppercase">
          Portfolio view · All properties · 60-min lead
        </span>
        <span className="text-micro text-text-on-dark-muted">Refreshed 2 minutes ago · role: General Manager</span>
      </figcaption>

      <div className="pmap-map relative h-[260px] sm:h-[320px] lg:absolute lg:inset-0 lg:h-auto">
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
          {PINS.map((pin) => {
            // The hover target runs from the pin across its label (~5.4 units a character).
            const reach = pin.label.length * 5.4 + 8;
            const left = pin.end ? pin.x - reach : pin.cx - 16;
            const right = pin.end ? pin.cx + 16 : pin.x + reach;
            return (
              <g key={pin.id} className="pmap-pin" data-pin data-property={pin.id}>
                <rect x={left} y={pin.cy - 16} width={right - left} height="32" fill="transparent" />
                {/* One pulse per log entry, in the entry's turn. */}
                {log.map((item, i) =>
                  item.property === pin.id ? (
                    <circle
                      key={item.time}
                      className="pmap-pulse"
                      style={{ '--i': i } as React.CSSProperties}
                      cx={pin.cx}
                      cy={pin.cy}
                      r="7"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                  ) : null,
                )}
                <circle className="pmap-ring" cx={pin.cx} cy={pin.cy} r="12" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx={pin.cx} cy={pin.cy} r="6" fill="#FFFFFF" stroke="var(--color-brand-navy)" strokeWidth="2" />
                {pin.id === OPEN && <path d="M640 216H522" fill="none" stroke="#FFFFFFCC" />}
                <text
                  className="pmap-label"
                  x={pin.x}
                  y={pin.y}
                  textAnchor={pin.end ? 'end' : undefined}
                  fontSize="11"
                  fontWeight={pin.id === OPEN ? 700 : undefined}
                  fill={pin.id === OPEN ? '#FFFFFF' : 'var(--color-text-on-dark-muted)'}
                  {...F}
                >
                  {pin.label}
                </text>
              </g>
            );
          })}
        </svg>
        {/* Below lg the map is cropped and its labels are small, so a highlighted pin gets a label it can be read by. */}
        {PINS.map((pin) => (
          <span
            key={pin.id}
            aria-hidden
            className="pmap-chip"
            data-property={pin.id}
            style={{ '--x': pin.cx, '--y': pin.cy } as React.CSSProperties}
          >
            {pin.label}
          </span>
        ))}
      </div>

      <div
        data-pmap-log
        className="m-5 flex flex-col gap-[10px] rounded-md border border-border-on-dark bg-brand-navy-deep px-[18px] py-4 lg:absolute lg:top-6 lg:right-6 lg:m-0 lg:w-[320px]"
      >
        <p className="text-[10px] leading-3 font-semibold tracking-label text-text-on-dark-muted uppercase">
          Event log · Property 0412
        </p>
        <ol className="flex flex-col gap-[10px]">
          {log.map((item, i) => (
            <li key={item.time} className="pmap-row" style={{ '--i': i } as React.CSSProperties}>
              <button type="button" className="pmap-entry" data-entry data-property={item.property} aria-pressed="false">
                <time className="w-[44px] shrink-0 text-[11px] leading-caption font-semibold text-text-on-dark">
                  {item.time}
                </time>
                <span className="pmap-entry-text text-caption">{item.entry}</span>
                <span className="sr-only">. Highlight Property {item.property} on the map.</span>
              </button>
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
    </PortfolioMapMotion>
  );
}
