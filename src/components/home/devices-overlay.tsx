/**
 * Motion over the device mockup in <SeeWhatsComing>. The screenshot stays as
 * it is; this SVG sits on top in the image's own pixel space (898×501, the
 * same centre-crop as the image), so every mark scales with it, and each
 * screen's marks are clipped to that screen. Ambient loops (`motion-loop`)
 * run only while the block is in view; the phone gauge plays once on
 * scroll-in. Everything is drawn in global CSS (styles/home.css, `dev-*`).
 *
 * The gauge needs three "covers" the colour of the app's own panels: the bars
 * hide behind shrinking covers so the real bars appear to grow, and a patch
 * carries the counting number until the real "9.0" shows through. At rest
 * (no JS, reduced motion) the covers are gone and the screenshot is exact.
 */

/** Where lightning flashes on the laptop's storm cells, image px. */
const STRIKES = [
  [352, 172],
  [262, 166],
  [238, 302],
  [106, 266],
  [42, 322],
  [300, 288],
] as const;

/** The cells that glow: centre and radius. */
const HOTSPOTS = [
  [352, 170, 34],
  [262, 165, 30],
  [238, 300, 28],
  [110, 265, 24],
  [42, 322, 20],
] as const;

/** The forecast bars on the gauge phone: x, top, height (bottom sits at 406). */
const BARS = [
  [735, 395, 11],
  [750, 390, 16],
  [763, 387, 19],
  [777, 395, 11],
  [788, 392, 14],
  [802, 392, 14],
  [813, 393, 13],
  [827, 395, 11],
  [840, 395, 11],
  [852, 386, 20],
  [865, 392, 14],
  [878, 395, 11],
] as const;

export function DevicesOverlay() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 898 501"
      preserveAspectRatio="xMidYMid slice"
      className="dev pointer-events-none absolute inset-0 h-full w-full"
    >
      <defs>
        <clipPath id="dev-clip-laptop">
          <rect x="24" y="112" width="416" height="276" rx="4" />
        </clipPath>
        <clipPath id="dev-clip-phone1">
          <rect x="486" y="64" width="192" height="380" rx="22" />
        </clipPath>
        <clipPath id="dev-clip-phone2">
          <rect x="706" y="64" width="186" height="380" rx="22" />
        </clipPath>
        <radialGradient id="dev-glow">
          <stop offset="0" stopColor="#FFF4C2" stopOpacity="1" />
          <stop offset="0.35" stopColor="#F5C842" stopOpacity="0.6" />
          <stop offset="1" stopColor="#F5C842" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dev-hot">
          <stop offset="0" stopColor="#FFB13B" stopOpacity="0.55" />
          <stop offset="0.6" stopColor="#FF6A2A" stopOpacity="0.18" />
          <stop offset="1" stopColor="#FF6A2A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="dev-sweep" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#9FE7D8" stopOpacity="0" />
          <stop offset="0.75" stopColor="#9FE7D8" stopOpacity="0.05" />
          <stop offset="1" stopColor="#E8FFF9" stopOpacity="0.13" />
        </linearGradient>
        <radialGradient id="dev-band">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Laptop: pulsing hotspots, a radar sweep, and lightning on the cells. */}
      <g clipPath="url(#dev-clip-laptop)">
        {HOTSPOTS.map(([cx, cy, r], i) => (
          <circle key={i} className="dev-hot motion-loop" cx={cx} cy={cy} r={r} fill="url(#dev-hot)" />
        ))}
        <rect className="dev-sweep motion-loop" x="-70" y="112" width="70" height="276" fill="url(#dev-sweep)" />
        {STRIKES.map(([x, y], i) => (
          <g key={i} className="dev-strike motion-loop" transform={`translate(${x} ${y})`}>
            <circle r="12" fill="url(#dev-glow)" />
            <path d="M1.5-7 -3.5 1h3l-1.5 6 5.5-8h-3l2-6z" fill="#FFFBEA" />
          </g>
        ))}
      </g>

      {/* Radar phone: the storm band breathes and the scrubber runs. */}
      <g clipPath="url(#dev-clip-phone1)">
        <g transform="rotate(-48 568 258)">
          <ellipse className="dev-band motion-loop" cx="568" cy="258" rx="96" ry="26" fill="url(#dev-band)" />
        </g>
        <rect x="510" y="384" width="134" height="14" rx="7" fill="#000" />
        <rect x="517" y="390" width="115" height="2.5" rx="1.25" fill="#3A3F4A" />
        <rect className="dev-scrub-fill motion-loop" x="517" y="390" width="115" height="2.5" rx="1.25" fill="#5586CE" />
        <circle className="dev-scrub-knob motion-loop" cx="517" cy="391" r="5.5" fill="#FFFFFF" />
      </g>

      {/* Gauge phone, once on scroll-in: the needle swings Caution → Danger,
          the miles count up, the forecast bars grow. */}
      <g clipPath="url(#dev-clip-phone2)">
        {/* The app's own pointer hides under a panel-coloured cover until the
            swinging needle lands on it; both fade together. */}
        <path className="dev-count" d="M790 265h16l-8 18z" fill="#282C38" transform="rotate(21 798 332)" />
        <path className="dev-needle" d="M793 266h10l-5 13z" fill="#D9861F" />
        <g className="dev-count">
          <rect x="774" y="279" width="48" height="26" fill="#1C1F27" />
          <text
            data-count
            x="798"
            y="299"
            textAnchor="middle"
            fontFamily="var(--font-manrope), system-ui, sans-serif"
            fontSize="22"
            fontWeight="800"
            letterSpacing="-0.02em"
            fill="#F7F7F7"
          >
            9.0
          </text>
        </g>
        {BARS.map(([x, top, h], i) => (
          <rect key={i} className="dev-cover" x={x - 3} y={top - 3} width="12" height={h + 6} fill="#262A38" />
        ))}
      </g>
    </svg>
  );
}
