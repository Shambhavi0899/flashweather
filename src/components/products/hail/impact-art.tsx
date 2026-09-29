import { useId } from 'react';

import type { SizeClassKey } from './content';

/*
 * The impact previews on the hail hero's size-class card (size-card.tsx),
 * one per class, each 240 × 80: light marks on a roof shingle, dents in a
 * car panel, cracks across glass. The drawings are finished as they stand;
 * the motion (styles/hail-hero.css) pops the marks and draws the cracks in
 * each time the class becomes active. Accents are `currentColor`, which the
 * card sets to the class's colour.
 */

export function ImpactArt({ kind }: { kind: SizeClassKey }) {
  const id = useId();
  return (
    <svg aria-hidden viewBox="0 0 240 80" className="hail-impact-art">
      <defs>
        <clipPath id={`${id}-clip`}>
          <rect width="240" height="80" rx="8" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        {kind === 'severe' && <Shingle id={id} />}
        {kind === 'damaging' && <CarPanel id={id} />}
        {kind === 'destructive' && <Glass id={id} />}
      </g>
      <rect
        x="0.5"
        y="0.5"
        width="239"
        height="79"
        rx="7.5"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.12"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/* ------------------------------------------------------------- Severe */

/** Courses of asphalt shingle, lowest first so each course laps the one below. */
const COURSES = [56, 36, 16, -4];
const SHINGLE_MARKS: [number, number][] = [
  [38, 22],
  [128, 27],
  [92, 49],
  [206, 35],
  [170, 60],
  [60, 66],
];

function Shingle({ id }: { id: string }) {
  return (
    <>
      <defs>
        <pattern id={`${id}-granule`} width="5" height="5" patternUnits="userSpaceOnUse">
          <rect width="5" height="5" fill="#2A3142" />
          <circle cx="1" cy="1" r="0.7" fill="#3B4459" />
          <circle cx="3.6" cy="2.4" r="0.6" fill="#1D2331" />
          <circle cx="2" cy="4" r="0.5" fill="#465069" />
        </pattern>
        <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.08" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="240" height="80" fill="#161B27" />
      {COURSES.map((y, row) => (
        <g key={y}>
          <rect y={y} width="240" height="24" fill={`url(#${id}-granule)`} />
          {Array.from({ length: 7 }, (_, k) => (
            <rect key={k} x={(row % 2 ? 20 : 0) + k * 40 - 1} y={y + 9} width="1.6" height="15" fill="#0B0E15" />
          ))}
          <rect y={y + 24} width="240" height="3" fill="#000000" fillOpacity="0.35" />
        </g>
      ))}
      <rect width="240" height="80" fill={`url(#${id}-sheen)`} />
      <g className="hail-marks">
        {SHINGLE_MARKS.map(([x, y]) => (
          <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
            <g className="hail-mark">
              <circle r="3.6" className="hail-ping" fill="none" stroke="currentColor" strokeWidth="1" />
              <ellipse rx="2.7" ry="2.1" fill="#0B0F17" stroke="#6E788E" strokeOpacity="0.6" strokeWidth="0.6" />
              <circle cx="-0.8" cy="-0.6" r="0.8" fill="#7D869A" fillOpacity="0.55" />
            </g>
          </g>
        ))}
      </g>
    </>
  );
}

/* ----------------------------------------------------------- Damaging */

const DENTS: [number, number, number][] = [
  [44, 52, 7],
  [96, 22, 5.5],
  [132, 58, 8.5],
  [180, 36, 6],
  [214, 62, 5],
];

function CarPanel({ id }: { id: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-paint`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2A3858" />
          <stop offset="0.36" stopColor="#5B6F98" />
          <stop offset="0.5" stopColor="#A3B5D8" />
          <stop offset="0.62" stopColor="#4E6189" />
          <stop offset="1" stopColor="#1C263E" />
        </linearGradient>
        {/* Concave, lit from above: the upper wall in shadow. */}
        <radialGradient id={`${id}-dent`} cx="0.45" cy="0.36" r="0.6">
          <stop offset="0" stopColor="#081020" stopOpacity="0.75" />
          <stop offset="0.7" stopColor="#081020" stopOpacity="0.2" />
          <stop offset="1" stopColor="#081020" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="240" height="80" fill={`url(#${id}-paint)`} />
      <path d="M0 29C60 25 180 25 240 30" fill="none" stroke="#FFFFFF" strokeOpacity="0.35" />
      <path d="M0 31C60 27 180 27 240 32" fill="none" stroke="#081020" strokeOpacity="0.45" strokeWidth="1.2" />
      <path d="M0 45C70 41 170 41 240 47V53C170 48 70 48 0 52Z" fill="#FFFFFF" fillOpacity="0.1" />
      <g className="hail-marks">
        {DENTS.map(([x, y, r]) => (
          <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
            <g className="hail-mark">
              <circle r={r * 1.7} className="hail-ping" fill="none" stroke="currentColor" strokeWidth="1" />
              <ellipse rx={r} ry={r * 0.78} fill={`url(#${id}-dent)`} />
              <path
                d={`M${-r * 0.9} ${r * 0.2}A${r} ${r * 0.78} 0 0 0 ${r * 0.9} ${r * 0.1}`}
                fill="none"
                stroke="#FFFFFF"
                strokeOpacity="0.55"
                strokeWidth="0.8"
              />
            </g>
          </g>
        ))}
      </g>
    </>
  );
}

/* -------------------------------------------------------- Destructive */

const IMPACTS: [number, number][] = [
  [72, 38],
  [172, 46],
];

function Glass({ id }: { id: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-pane`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0E2233" />
          <stop offset="0.5" stopColor="#18364B" />
          <stop offset="1" stopColor="#0A1723" />
        </linearGradient>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor="currentColor" stopOpacity="0.7" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="240" height="80" fill={`url(#${id}-pane)`} />
      <path d="M150 0H176L96 80H70Z" fill="#FFFFFF" fillOpacity="0.06" />
      <path d="M188 0L108 80" stroke="#FFFFFF" strokeOpacity="0.1" strokeWidth="0.8" />
      {IMPACTS.map(([x, y], n) => (
        <g key={n} className="hail-crack">
          <circle cx={x} cy={y} r="12" className="hail-crack-glow" fill={`url(#${id}-glow)`} />
          {CRACKS[n].lines.map((d, i) => (
            <path key={i} d={d} pathLength="1" className="hail-crack-line" />
          ))}
          {CRACKS[n].rings.map((d, i) => (
            <path key={i} d={d} pathLength="1" className="hail-crack-ring" />
          ))}
          <circle cx={x} cy={y} r="1.6" fill="#FFFFFF" fillOpacity="0.9" />
        </g>
      ))}
    </>
  );
}

/** Radial cracks from each impact, jagged, and the broken rings between them. */
const CRACKS = IMPACTS.map(([x, y], n) => {
  const random = seeded(n + 3);
  const count = 8;
  const angles = Array.from({ length: count }, (_, j) => ((j + random() * 0.5) / count) * Math.PI * 2);
  const lines = angles.map((angle) => {
    const length = 20 + random() * 26;
    let d = `M${x} ${y}`;
    let a = angle;
    for (let s = 1; s <= 4; s++) {
      a += (random() - 0.5) * 0.5;
      const r = (length * s) / 4;
      d += `L${round(x + Math.cos(a) * r)} ${round(y + Math.sin(a) * r)}`;
    }
    return d;
  });
  const rings = [7, 15].map((r, k) => {
    let d = '';
    angles.forEach((angle, j) => {
      if ((j + k) % 3 === 2) return; // a broken ring, not a circle
      const next = angles[(j + 1) % count] + (j === count - 1 ? Math.PI * 2 : 0);
      const mid = (angle + next) / 2;
      const rr = r * (0.9 + random() * 0.25);
      d += `M${round(x + Math.cos(angle) * r)} ${round(y + Math.sin(angle) * r)}`;
      d += `L${round(x + Math.cos(mid) * rr)} ${round(y + Math.sin(mid) * rr)}`;
      d += `L${round(x + Math.cos(next) * r)} ${round(y + Math.sin(next) * r)}`;
    });
    return d;
  });
  return { lines, rings };
});

function seeded(seed: number) {
  let a = seed * 9301 + 49297;
  return () => {
    a = (a * 9301 + 49297) % 233280;
    return a / 233280;
  };
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}
