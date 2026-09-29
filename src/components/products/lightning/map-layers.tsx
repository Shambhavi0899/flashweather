import { BANDS, PROFILE, type Blob } from './risk-model';

/*
 * The drawing of the Lightning page's forecast maps, shared by the hero's
 * demo (risk-map.tsx) and the accuracy section's scoring run
 * (accuracy-scoring.tsx): the dark basemap in the Weather Command Center's
 * style, the storm as soft blobs that an SVG filter turns into the app's
 * stepped bands, and the burst a strike flashes with. Each map passes its
 * own `id` (the hero's is fixed, others use useId), so two maps on one page
 * never share a gradient or a filter.
 */

/** A basemap, in the map's own px: county lines, a few roads, a river and a lake. Illustrative, not a real place. */
export type BasemapShape = {
  countyLines: string[];
  roads: string[];
  river: string;
  lake: string;
};

/* The SVG filter that turns the storm's opacity into the product's bands: a
   discrete lookup, a hundred steps, so each band starts exactly at its `from`. */
const STEPS = 100;
const bandAt = (p: number) => [...BANDS].reverse().find((band) => p >= band.from);
const channel = (hex: string, i: number) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255;
const table = (pick: (band: (typeof BANDS)[number]) => number) =>
  Array.from({ length: STEPS }, (_, i) => {
    const band = bandAt(i / STEPS);
    return band ? pick(band).toFixed(3) : '0';
  }).join(' ');
const BAND_TABLES = {
  r: table((band) => channel(band.color, 0)),
  g: table((band) => channel(band.color, 1)),
  b: table((band) => channel(band.color, 2)),
  a: table((band) => band.alpha),
};

/** The map's gradients and the bands filter: `${id}-profile`, `-burst`, `-vignette`, `-bands`. */
export function MapDefs({ id, width, height }: { id: string; width: number; height: number }) {
  return (
    <>
      <radialGradient id={`${id}-profile`}>
        {PROFILE.map(([at, alpha]) => (
          <stop key={at} offset={at} stopColor="#FFFFFF" stopOpacity={alpha} />
        ))}
      </radialGradient>
      <radialGradient id={`${id}-burst`}>
        <stop offset={0} stopColor="#FFFFFF" stopOpacity={0.95} />
        <stop offset={0.35} stopColor="#F0DE7E" stopOpacity={0.55} />
        <stop offset={1} stopColor="#F0DE7E" stopOpacity={0} />
      </radialGradient>
      <radialGradient id={`${id}-vignette`} cx="50%" cy="45%" r="75%">
        <stop offset={0.55} stopColor="#000000" stopOpacity={0} />
        <stop offset={1} stopColor="#000000" stopOpacity={0.5} />
      </radialGradient>
      <filter
        id={`${id}-bands`}
        x={0}
        y={0}
        width={width}
        height={height}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        {/* The storm's opacity into every channel, then each step of it to its band's colour, then softened. */}
        <feColorMatrix type="matrix" values="0 0 0 1 0  0 0 0 1 0  0 0 0 1 0  0 0 0 1 0" />
        <feComponentTransfer>
          <feFuncR type="discrete" tableValues={BAND_TABLES.r} />
          <feFuncG type="discrete" tableValues={BAND_TABLES.g} />
          <feFuncB type="discrete" tableValues={BAND_TABLES.b} />
          <feFuncA type="discrete" tableValues={BAND_TABLES.a} />
        </feComponentTransfer>
        <feGaussianBlur stdDeviation={1.4} />
      </filter>
    </>
  );
}

/** Under the storm: the ground (`groundOpacity` below 1 lets a photo show through), the lake, the river, the roads. */
export function BasemapUnder({
  shape,
  width,
  height,
  groundOpacity = 1,
}: {
  shape: BasemapShape;
  width: number;
  height: number;
  groundOpacity?: number;
}) {
  return (
    <>
      <rect width={width} height={height} fill="#0F1216" fillOpacity={groundOpacity} />
      <path d={shape.lake} fill="#142130" />
      <path d={shape.river} fill="none" stroke="#1A2A38" strokeWidth={3} strokeLinecap="round" />
      <g fill="none" stroke="#2A313B" strokeWidth={1.2}>
        {shape.roads.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </>
  );
}

/** The storm: soft blobs, banded by the filter. */
export function StormField({ id, blobs, className }: { id: string; blobs: Blob[]; className?: string }) {
  return (
    <g filter={`url(#${id}-bands)`} className={className}>
      {blobs.map((blob, i) => (
        <ellipse
          key={i}
          cx={blob.x}
          cy={blob.y}
          rx={blob.rx}
          ry={blob.ry}
          transform={`rotate(${blob.angle.toFixed(2)} ${blob.x.toFixed(1)} ${blob.y.toFixed(1)})`}
          fill={`url(#${id}-profile)`}
          opacity={blob.strength}
        />
      ))}
    </g>
  );
}

/** Over the storm, as in the app: roads dark, county lines light, then the vignette. */
export function BasemapOver({
  id,
  shape,
  width,
  height,
}: {
  id: string;
  shape: BasemapShape;
  width: number;
  height: number;
}) {
  return (
    <>
      <g fill="none" stroke="#05070A" strokeOpacity={0.55} strokeWidth={1.2}>
        {shape.roads.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g fill="none" stroke="#AEB8C7" strokeOpacity={0.3}>
        {shape.countyLines.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <rect width={width} height={height} fill={`url(#${id}-vignette)`} pointerEvents="none" />
    </>
  );
}

/** A place label: a dot and its name (`.rm-town`, styles/products.css). */
export function Town({ name, at }: { name: string; at: [number, number] }) {
  return (
    <g className="rm-town">
      <circle cx={at[0]} cy={at[1]} r={2} />
      <text x={at[0] + 6} y={at[1] + 3}>
        {name.toUpperCase()}
      </text>
    </g>
  );
}
