/**
 * The closing band's backdrop: a faint map with a portfolio of sites on it,
 * and a storm band that crosses them. Decorative, so it is hidden from
 * assistive tech; the band's copy says what it shows.
 *
 * The markup is the still frame: six pins on the map, no storm. The motion
 * is in styles/finale.css, on the shared .motion system: the pins pop in one
 * by one, then the storm drifts across and each pin turns gold as it passes.
 *
 * Each pin's `--at` in the stylesheet is the moment the storm's centre line
 * reaches it, so a pin moved here needs its time moved there:
 *   at = (x + 0.2493 * y + 160) / 53.33 seconds
 * (the storm leans 14 degrees and covers 960 units in 18 seconds).
 */
const pins = [
  { x: 170, y: 130 },
  { x: 300, y: 112 },
  { x: 452, y: 150 },
  { x: 228, y: 262 },
  { x: 372, y: 236 },
  { x: 486, y: 296 },
];

/** The 1 km grid: a line every 40 units, both ways. */
const grid = [
  ...Array.from({ length: 10 }, (_, i) => `M0 ${40 * (i + 1)}H640`),
  ...Array.from({ length: 15 }, (_, i) => `M${40 * (i + 1)} 0V440`),
].join('');

export function SiteMap({ className }: { className: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 640 440"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      fill="none"
    >
      <defs>
        <linearGradient id="cta-storm-fill" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.17" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path d={grid} stroke="#FFFFFF" strokeOpacity="0.055" />
      {/* A river, two roads and a ring road. */}
      <path
        d="M-10 318C70 300 120 346 196 330S330 250 410 274s130 84 240 60"
        stroke="#FFFFFF"
        strokeOpacity="0.07"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <g stroke="#FFFFFF" strokeOpacity="0.13" strokeWidth="1.5" strokeLinecap="round">
        <path d="M-10 70C90 96 170 60 262 108s190 70 388 24" />
        <path d="M118 -10c-16 96 40 150 34 236s-60 130-44 224" />
        <path d="M540 -10c-30 80-96 110-104 196s50 150 40 264" />
        <path d="M196 190c40-52 150-60 206-18s46 116-14 140-150 6-186-34-34-56-6-88z" strokeOpacity="0.09" />
      </g>

      <g className="cta-storm motion-loop">
        <rect x="-110" y="-120" width="220" height="700" fill="url(#cta-storm-fill)" transform="skewX(-14)" />
      </g>

      <g>
        {pins.map((pin) => (
          <g key={`${pin.x},${pin.y}`} className="cta-pin">
            <circle
              className="cta-pin-ping motion-loop"
              cx={pin.x}
              cy={pin.y}
              r="9"
              stroke="var(--color-viz-gold)"
              strokeWidth="1.5"
            />
            <circle cx={pin.x} cy={pin.y} r="9" stroke="#FFFFFF" strokeOpacity="0.32" />
            <circle cx={pin.x} cy={pin.y} r="3.5" fill="#FFFFFF" fillOpacity="0.85" />
            <circle className="cta-pin-gold motion-loop" cx={pin.x} cy={pin.y} r="4.5" fill="var(--color-viz-gold)" />
          </g>
        ))}
      </g>
    </svg>
  );
}
