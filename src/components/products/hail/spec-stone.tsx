import { useId } from 'react';

/**
 * A hailstone cut in half: an icy core and eight growth rings, one per
 * spec, core → outside in the list's order. Real stones grow in layers of
 * milky and clear ice, a little off centre and lumpier the bigger they
 * get, so the rings alternate in tone, drift from the core and grow less
 * round outwards. They share one set of lumps, so no two rings cross.
 *
 * The paths are worked out once, the same on the server and in the
 * browser. Drawn in a 400-unit box centred on 0.
 */
export const RING_COUNT = 8;

const CORE = 36;
const STEP = 18;
const SEGMENTS = 64;

/** The core's pull: it sits up and left of the stone's centre. */
const OFFSET: [number, number] = [-7, -9];
const PHASES = [0.6, 2.1, 4.4];

type Point = [number, number];

function outline(k: number) {
  const r = CORE + k * STEP;
  const drift = 1 - k / RING_COUNT;
  const [cx, cy] = [OFFSET[0] * drift, OFFSET[1] * drift];
  const lump = 0.012 + 0.0045 * k;
  const points: Point[] = Array.from({ length: SEGMENTS }, (_, i) => {
    const a = (i / SEGMENTS) * Math.PI * 2;
    const wave =
      0.55 * Math.sin(3 * a + PHASES[0] + k * 0.12) +
      0.3 * Math.sin(5 * a + PHASES[1] - k * 0.08) +
      0.15 * Math.sin(8 * a + PHASES[2] + k * 0.2);
    const radius = r * (1 + lump * wave);
    return [cx + Math.cos(a) * radius, cy + Math.sin(a) * radius];
  });
  return smooth(points);
}

/** Catmull-Rom through the points, as one closed run of cubic Béziers. */
function smooth(points: Point[]) {
  const n = points.length;
  const at = (i: number) => points[(i + n) % n];
  let d = `M${round(points[0][0])} ${round(points[0][1])}`;
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    d += `C${round(p1[0] + (p2[0] - p0[0]) / 6)} ${round(p1[1] + (p2[1] - p0[1]) / 6)} ${round(
      p2[0] - (p3[0] - p1[0]) / 6,
    )} ${round(p2[1] - (p3[1] - p1[1]) / 6)} ${round(p2[0])} ${round(p2[1])}`;
  }
  return `${d}Z`;
}

const round = (n: number) => Math.round(n * 10) / 10;

/** Outline 0 is the core; outline k the outer edge of ring k. */
const OUTLINES = Array.from({ length: RING_COUNT + 1 }, (_, k) => outline(k));

/** Where each ring's number sits: halfway across the ring, due east of its centre. */
const NUMBERS = Array.from({ length: RING_COUNT }, (_, i) => {
  const k = i + 1;
  const drift = 1 - (k - 0.5) / RING_COUNT;
  return { x: round(OFFSET[0] * drift + CORE + (k - 0.5) * STEP), y: round(OFFSET[1] * drift) };
});

const BUBBLES: [number, number, number][] = [
  [-18, -14, 2.4],
  [4, -22, 1.6],
  [-2, 6, 2],
  [-24, 8, 1.4],
  [12, -6, 1.2],
];

export function SpecStone({
  label,
  active,
  onPoint,
  onTap,
}: {
  label: string;
  /** The highlighted ring, 0-based (spec order), or null. */
  active: number | null;
  onPoint: (ring: number | null) => void;
  onTap: (ring: number) => void;
}) {
  const id = useId();

  return (
    <svg role="img" aria-label={label} viewBox="-200 -200 400 400" className="hs-stone" fill="none">
      <defs>
        <radialGradient id={`${id}-core`} cx="0.42" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="0.6" stopColor="#E3ECF8" stopOpacity="0.82" />
          <stop offset="1" stopColor="#B9CBE4" stopOpacity="0.7" />
        </radialGradient>
        <radialGradient id={`${id}-shade`} cx="0.36" cy="0.32" r="0.78">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.16" />
          <stop offset="0.55" stopColor="#FFFFFF" stopOpacity="0.03" />
          <stop offset="1" stopColor="#040818" stopOpacity="0.32" />
        </radialGradient>
        <radialGradient id={`${id}-glint`}>
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.5" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(18 0.5 0.5)">
          <stop offset="0.36" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.22" />
          <stop offset="0.64" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <path d={OUTLINES[RING_COUNT]} />
        </clipPath>
        <filter id={`${id}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g className="hs-rings">
        {Array.from({ length: RING_COUNT }, (_, i) => (
          <path
            key={i}
            d={`${OUTLINES[i + 1]}${OUTLINES[i]}`}
            fillRule="evenodd"
            className={`hs-ring hs-k${i + 1}`}
            data-tone={i % 2 ? 'clear' : 'milky'}
            data-active={active === i ? '' : undefined}
            filter={active === i ? `url(#${id}-glow)` : undefined}
            onPointerEnter={(event) => event.pointerType === 'mouse' && onPoint(i)}
            onPointerLeave={(event) => event.pointerType === 'mouse' && onPoint(null)}
            onClick={() => onTap(i)}
          />
        ))}
      </g>
      {/* Light from the top left, shade to the bottom right, over every ring. */}
      <path d={OUTLINES[RING_COUNT]} fill={`url(#${id}-shade)`} className="hs-shade" />
      {Array.from({ length: RING_COUNT }, (_, i) => (
        <path key={i} d={OUTLINES[i + 1]} pathLength={1} className={`hs-edge hs-k${i + 1}`} />
      ))}

      <g className="hs-core">
        <path d={OUTLINES[0]} fill={`url(#${id}-core)`} />
        {BUBBLES.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} className="hs-bubble" />
        ))}
      </g>

      {NUMBERS.map((n, i) => (
        <text
          key={i}
          x={n.x}
          y={n.y}
          className={`hs-number hs-k${i + 1}`}
          data-active={active === i ? '' : undefined}
          textAnchor="middle"
          dominantBaseline="central"
        >
          {i + 1}
        </text>
      ))}

      <ellipse
        cx="-92"
        cy="-104"
        rx="46"
        ry="18"
        transform="rotate(-38 -92 -104)"
        fill={`url(#${id}-glint)`}
        className="hs-glint"
      />
      <g clipPath={`url(#${id}-clip)`}>
        <rect x="-200" y="-200" width="400" height="400" fill={`url(#${id}-shine)`} className="hs-shimmer motion-loop" />
      </g>
    </svg>
  );
}
