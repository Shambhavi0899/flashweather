import { useId } from 'react';

/**
 * One hailstone, drawn: clear ice at the rim, milky growth rings round an
 * opaque core, a highlight and the light it focuses on its far side. It
 * fills its box (the stone's widest point touches the edges), so the
 * caller's CSS sizes it; at ~10px the rings thin out to shading and the
 * highlight and outline carry it.
 *
 * `rings` is how many growth layers it has (bigger stones have more),
 * `seed` changes its lumps so a group of stones is not identical, and
 * `irregularity` how lumpy it is (0 is a circle). `.hail-stone-tint` is a
 * layer in `currentColor`, off until the caller's CSS shows it.
 *
 * Gradient ids come from useId, so any number of stones share a page.
 */
export function HailStone({
  className,
  rings = 3,
  seed = 0,
  irregularity = 0.03,
}: {
  className?: string;
  rings?: number;
  seed?: number;
  irregularity?: number;
}) {
  const id = useId();
  const { outline, layers, bubbles } = stoneShape(rings, seed, irregularity);

  return (
    <svg aria-hidden viewBox="-50 -50 100 100" className={className}>
      <defs>
        <radialGradient id={`${id}-body`} cx="0.4" cy="0.36" r="0.72">
          <stop offset="0" stopColor="#F5F9FF" stopOpacity="0.95" />
          <stop offset="0.45" stopColor="#D5E2F4" stopOpacity="0.8" />
          <stop offset="0.8" stopColor="#9DB5D6" stopOpacity="0.58" />
          <stop offset="1" stopColor="#6E8AB4" stopOpacity="0.78" />
        </radialGradient>
        <radialGradient id={`${id}-core`}>
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.7" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-shine`}>
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="0.55" stopColor="#FFFFFF" stopOpacity="0.25" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      <path d={outline} fill={`url(#${id}-body)`} />
      {layers.map((layer, i) => (
        <path
          key={i}
          d={layer}
          fill={i % 2 ? '#A9BEDD' : '#FFFFFF'}
          fillOpacity={i % 2 ? 0.1 : 0.16}
          stroke="#FFFFFF"
          strokeOpacity="0.22"
          strokeWidth="0.6"
        />
      ))}
      <circle cx="-4" cy="-6" r="12" fill={`url(#${id}-core)`} />
      {bubbles.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#FFFFFF" fillOpacity="0.45" />
      ))}
      <ellipse cx="16" cy="25" rx="17" ry="9" transform="rotate(-30 16 25)" fill={`url(#${id}-shine)`} opacity="0.35" />
      <ellipse cx="-17" cy="-21" rx="14" ry="8" transform="rotate(-38 -17 -21)" fill={`url(#${id}-shine)`} />
      <circle cx="-21" cy="-25" r="2.6" fill="#FFFFFF" fillOpacity="0.95" />
      <path d={outline} className="hail-stone-tint" fill="currentColor" opacity="0" />
      <path
        d={outline}
        fill="none"
        stroke={`url(#${id}-rim)`}
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/* ------------------------------------------------------------ Geometry */

type Shape = { outline: string; layers: string[]; bubbles: [number, number, number][] };

const shapes = new Map<string, Shape>();

/** The stone's paths, the same on the server and in the browser. */
function stoneShape(rings: number, seed: number, irregularity: number): Shape {
  const key = `${rings}:${seed}:${irregularity}`;
  const cached = shapes.get(key);
  if (cached) return cached;

  // The outline only dips inward from r 50, so the stone touches its box.
  const outline = blob(0, 0, 50, irregularity, seed, true);
  // Growth layers step in towards a core a little up and to the left.
  const layers = Array.from({ length: rings }, (_, k) => {
    const f = 0.84 - (k * 0.6) / Math.max(1, rings);
    return blob(-4 * (1 - f), -6 * (1 - f), 50 * f, irregularity * 1.6, seed + k + 1, false);
  });
  const random = mulberry(seed + 7);
  const bubbles = Array.from({ length: 5 }, (): [number, number, number] => {
    const angle = random() * Math.PI * 2;
    const distance = 8 + random() * 22;
    return [
      round(Math.cos(angle) * distance - 3),
      round(Math.sin(angle) * distance - 4),
      round(0.8 + random() * 0.9),
    ];
  });

  const shape = { outline, layers, bubbles };
  shapes.set(key, shape);
  return shape;
}

/** A closed, softly lumpy outline round (cx, cy), as a smooth path. */
function blob(cx: number, cy: number, r: number, irregularity: number, seed: number, inward: boolean) {
  const random = mulberry(seed);
  const phases = [random(), random(), random()].map((p) => p * Math.PI * 2);
  const n = 36;
  const points = Array.from({ length: n }, (_, i) => {
    const angle = (i / n) * Math.PI * 2;
    // -1 to 1: three soft lobes, five smaller ones, seven smaller still.
    const wave =
      Math.sin(3 * angle + phases[0]) * 0.5 + Math.sin(5 * angle + phases[1]) * 0.3 + Math.sin(7 * angle + phases[2]) * 0.2;
    const radius = inward ? r * (1 - irregularity * (0.5 + 0.5 * wave)) : r * (1 + irregularity * wave * 0.5);
    return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius];
  });
  // Catmull-Rom through the points, as cubic Béziers.
  let d = `M${round(points[0][0])} ${round(points[0][1])}`;
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [-1, 0, 1, 2].map((o) => points[(i + o + n) % n]);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${round(c1[0])} ${round(c1[1])} ${round(c2[0])} ${round(c2[1])} ${round(p2[0])} ${round(p2[1])}`;
  }
  return `${d}Z`;
}

/** A small seeded random, so the lumps are the same on every render. */
function mulberry(seed: number) {
  let a = (seed * 2654435761) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}
