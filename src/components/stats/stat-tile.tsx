import { useId } from 'react';

import { Motion } from '@/components/motion';

/**
 * One headline number with the small diagram the design draws above it: the
 * home page's stats strip (components/home/numbers.tsx) and the Lightning
 * page's spec tiles (components/products/lightning/spec-table.tsx) are both
 * built from it, so the diagrams and their motion stay one set.
 *
 * Motion: <Motion> plays the diagram's draw-in and counts the number up when
 * the tile scrolls in, and replays on hover. The `stat-*` classes in the
 * diagrams are the hooks for the keyframes in styles/home.css; the markup
 * itself is the final frame. Their colours are the `--stat-*` variables set
 * on `.stat-card` there, so a dark section can swap them. The diagrams are
 * decorative: the number and its
 * label carry the meaning, in text.
 *
 * It renders a `<dt>`/`<dd>` group, so it sits inside a `<dl>`. `children`
 * are the tile's own `<dt>` and any further `<dd>`s; place them with `order-*`
 * (the diagram is first, the number is `valueClassName`'s to place).
 */
export function StatTile({
  diagram,
  value,
  className,
  valueClassName,
  children,
}: {
  diagram: StatDiagramId;
  value: string;
  className: string;
  valueClassName: string;
  children: React.ReactNode;
}) {
  return (
    <Motion count={value} className={`motion stat-card flex flex-col ${className}`}>
      <StatDiagram id={diagram} />
      {children}
      <dd className={valueClassName}>
        <span data-count>{value}</span>
      </dd>
    </Motion>
  );
}

export type StatDiagramId = 'accuracy' | 'hail' | 'lightning' | 'refresh' | 'resolution' | 'products';

const svgProps = { viewBox: '0 0 216 72', className: 'h-[72px] w-[216px] max-w-full shrink-0', 'aria-hidden': true } as const;
const label = { fontFamily: 'Manrope', fontWeight: 700 } as const;

/** The small bolt the lead line starts from (and, for lightning, ends on). */
const leadBolt = (x: number) => `M${x} 39l-2 5h2.5l-1.5 5 4.5-6.5h-2.6l1.6-3.5z`;

export function StatDiagram({ id }: { id: StatDiagramId }) {
  // Clip ids are per diagram: the same diagram can appear twice on a page
  // (the Lightning spec tiles and its accuracy stats), and a url(#id) that
  // resolved to the other copy would draw in with that copy, not this one.
  const clip = useId();
  switch (id) {
    case 'accuracy':
      return (
        <svg {...svgProps}>
          <circle cx="36" cy="36" r="29" fill="none" stroke="var(--stat-track)" strokeWidth="9" />
          <circle
            className="stat-acc-ring"
            cx="36"
            cy="36"
            r="29"
            transform="rotate(-90 36 36)"
            fill="none"
            stroke="var(--stat-blue)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray="181.5 182.2"
          />
          <g className="stat-acc-dot">
            <circle cx="36" cy="7" r="4" fill="var(--color-viz-gold)" />
          </g>
          <text x="84" y="31" fontSize="11" letterSpacing="1.2" fill="var(--stat-muted)" {...label}>
            ONE-HOUR WINDOW
          </text>
          <rect x="84" y="40" width="120" height="8" rx="4" fill="var(--stat-track)" />
          <clipPath id={clip}>
            <rect className="stat-acc-bar" x="84" y="40" width="120" height="8" />
          </clipPath>
          <rect x="84" y="40" width="119.5" height="8" rx="4" fill="var(--stat-blue)" clipPath={`url(#${clip})`} />
        </svg>
      );
    case 'hail':
    case 'lightning': {
      // One lead line, alert to impact: hail ends on a stone, lightning on a strike.
      const hail = id === 'hail';
      return (
        <svg {...svgProps}>
          <line x1="14" y1="44" x2="202" y2="44" stroke="var(--stat-rule)" strokeWidth="2" />
          <clipPath id={clip}>
            <rect className="stat-hail-lead" x="14" y="40" width="188" height="8" />
          </clipPath>
          <line
            x1="14"
            y1="44"
            x2="202"
            y2="44"
            stroke="var(--stat-blue)"
            strokeWidth="2"
            strokeDasharray="4 4"
            clipPath={`url(#${clip})`}
          />
          <circle cx="14" cy="44" r="7" fill="var(--color-viz-gold)" />
          <path d={leadBolt(12)} fill="#070D26" />
          <circle className="stat-hail-ping" cx="202" cy="44" r="7" fill="none" stroke="#C22E22" strokeWidth="2" />
          <g className="stat-hail-stone">
            <circle cx="202" cy="44" r="7" fill="#C22E22" />
            {hail ? <circle cx="202" cy="44" r="2.5" fill="#FFFFFF" /> : <path d={leadBolt(200)} fill="#FFFFFF" />}
          </g>
          <path d="M14 30 L14 22 L202 22 L202 30" fill="none" stroke="var(--stat-ink)" strokeWidth="1.5" />
          <text x="108" y="14" textAnchor="middle" fontSize="11" letterSpacing="1.2" fill="var(--stat-ink)" {...label}>
            {hail ? '55 MIN OF LEAD' : '60 MIN OF LEAD'}
          </text>
          <text x="14" y="66" fontSize="10" fill="var(--stat-muted)" {...label}>
            ALERT SENT
          </text>
          <text x="202" y="66" textAnchor="end" fontSize="10" fill="var(--stat-muted)" {...label}>
            {hail ? 'FIRST STONE' : 'FIRST STRIKE'}
          </text>
        </svg>
      );
    }
    case 'refresh':
      return (
        <svg {...svgProps}>
          <line x1="10" y1="40" x2="206" y2="40" stroke="var(--stat-track)" strokeWidth="2" />
          <g className="stat-ref-dots">
            {[12, 31, 50, 69, 88, 107, 126, 145, 164, 183].map((cx) => (
              <circle key={cx} className="motion-loop" cx={cx} cy="40" r="4" fill="var(--stat-blue)" />
            ))}
          </g>
          <g className="stat-ref-end motion-loop">
            <circle cx="202" cy="40" r="9" fill="none" stroke="var(--color-viz-gold)" strokeWidth="2" />
            <circle cx="202" cy="40" r="4" fill="var(--color-viz-gold)" />
          </g>
          <text x="12" y="18" fontSize="11" letterSpacing="1.2" fill="var(--stat-ink)" {...label}>
            A NEW FORECAST EVERY 2 MIN
          </text>
          <text x="12" y="64" fontSize="10" fill="var(--stat-muted)" {...label}>
            :00
          </text>
          <text x="107" y="64" textAnchor="middle" fontSize="10" fill="var(--stat-muted)" {...label}>
            :10
          </text>
          <text x="202" y="64" textAnchor="end" fontSize="10" fill="var(--stat-muted)" {...label}>
            :20
          </text>
        </svg>
      );
    case 'resolution': {
      const shade: Record<string, string> = { '28,24': 'var(--stat-tint-1)', '48,24': 'var(--stat-tint-2)', '28,44': 'var(--stat-tint-2)', '68,44': 'var(--stat-tint-1)' };
      return (
        <svg {...svgProps}>
          {[4, 24, 44].flatMap((y) =>
            [8, 28, 48, 68, 88, 108].map((x) => (
              <rect
                key={`${x},${y}`}
                className={x === 48 && y === 44 ? 'stat-res-site' : undefined}
                x={x}
                y={y}
                width="18"
                height="18"
                fill={x === 48 && y === 44 ? 'var(--color-viz-gold)' : (shade[`${x},${y}`] ?? 'var(--stat-cell)')}
              />
            )),
          )}
          <rect
            className="stat-res-scan"
            x="8"
            y="4"
            width="18"
            height="18"
            fill="var(--stat-blue)"
            fillOpacity="0.22"
            stroke="var(--stat-blue)"
            strokeWidth="1.5"
          />
          <rect
            className="stat-res-halo motion-loop"
            x="48"
            y="44"
            width="18"
            height="18"
            fill="none"
            stroke="var(--color-viz-gold)"
            strokeWidth="2"
          />
          <path
            className="stat-res-pointer"
            d="M57 41 L57 34 L140 34"
            pathLength="1"
            fill="none"
            stroke="var(--stat-ink)"
            strokeWidth="1.5"
          />
          <text x="144" y="38" fontSize="11" fill="var(--stat-ink)" {...label}>
            YOUR SITE
          </text>
          <text x="144" y="54" fontSize="10" fill="var(--stat-muted)" {...label}>
            ONE 1 KM CELL
          </text>
        </svg>
      );
    }
    case 'products':
      return (
        <svg {...svgProps}>
          {/* Same staircase, scaled to 42 tall so the tallest bar tops out at
              y=24, clear of the label's baseline at 16. */}
          <g className="stat-bars">
            <rect x="8" y="55" width="22" height="11" rx="2" fill="var(--stat-tint-2)" />
            <rect x="36" y="50" width="22" height="16" rx="2" fill="var(--stat-tint-2)" />
            <rect x="64" y="44" width="22" height="22" rx="2" fill="var(--stat-tint-3)" />
            <rect x="92" y="39" width="22" height="27" rx="2" fill="var(--stat-tint-3)" />
            <rect x="120" y="33" width="22" height="33" rx="2" fill="var(--stat-blue)" />
            <rect x="148" y="28" width="22" height="38" rx="2" fill="var(--stat-blue)" />
            <rect x="176" y="24" width="22" height="42" rx="2" fill="var(--color-viz-gold)" />
          </g>
          <text x="8" y="16" fontSize="10" letterSpacing="0.4" fill="var(--stat-ink)" {...label}>
            LIGHTNING · HAIL · HEAT · WIND
          </text>
        </svg>
      );
  }
}
