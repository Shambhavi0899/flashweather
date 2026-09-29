/**
 * The unit of measure (flash-hit-definition-1km-cell-60-minute-window-
 * diagram.svg in the design): a flagged 1 km cell with a strike inside it.
 */
const F = { fontFamily: 'var(--font-manrope), system-ui, sans-serif' } as const;
const gold = 'var(--color-viz-gold)';

export function HitDiagram() {
  return (
    <div className="flex items-center justify-center rounded-md bg-brand-navy p-4 md:w-[280px] md:shrink-0">
      <svg
        viewBox="0 0 248 170"
        role="img"
        aria-label="Diagram of the unit of measure: a 1 by 1 km grid cell flagged Advisory or higher, a one-hour window, and a cloud-to-ground strike inside it counted as a hit"
        className="h-auto w-full max-w-[248px]"
      >
        <path
          d="M4 4H244M4 44H244M4 84H244M4 124H244M4 164H244M4 4V164M44 4V164M84 4V164M124 4V164M164 4V164M204 4V164M244 4V164"
          fill="none"
          stroke="#1C2340"
        />
        <rect x="84" y="44" width="40" height="40" fill={gold} opacity="0.3" />
        <rect x="124" y="84" width="40" height="40" fill={gold} opacity="0.3" />
        <rect x="164" y="44" width="40" height="40" fill={gold} opacity="0.3" />
        <rect x="124" y="44" width="40" height="40" fill={gold} />
        <circle cx="150" cy="58" r="5" fill="#C22E22" stroke="#FFFFFF" strokeWidth="2" />
        <text x="128" y="79" fontSize="9" fontWeight="800" fill="#070D26" {...F}>
          HIT
        </text>
        <text x="10" y="18" fontSize="10" fontWeight="700" fill="#AEB8C7" {...F}>
          1 × 1 KM CELLS
        </text>
        <text x="10" y="156" fontSize="10" fontWeight="700" fill="#AEB8C7" {...F}>
          FLAGGED IN THE HOUR BEFORE THE STRIKE
        </text>
      </svg>
    </div>
  );
}
