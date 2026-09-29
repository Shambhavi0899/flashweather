import type { BasemapShape } from '../lightning/map-layers';
import { PROFILE, type Blob } from '../lightning/risk-model';

/*
 * The two mini maps in the Hail page's Ask Flash cards (ask-hail.tsx), as
 * pure numbers so the server renders the same final frame the browser ends
 * on. Both are drawn on the Lightning maps' basemap (lightning/map-layers.tsx);
 * what is hail's own is the swath: long, narrow soft blobs laid along a
 * track, banded by size class rather than by probability.
 *
 * `hailAt` combines the blobs the way the picture does (1 − Π(1 − aᵢ)), so
 * the streets that light up in the past card and the lots that turn red in
 * the forecast card are exactly the ones the drawn 1.00 in band covers.
 * Illustrative places, not real geometry.
 */

/* ------------------------------------------------------------ The ramp */

/**
 * Hail size bands, lowest first: an icy trace under the severe threshold,
 * then the size classes' own colours (severe gold, damaging orange) and a
 * burnt orange for 1.50 in. `from` is the swath's opacity a band starts at.
 */
export const HAIL_BANDS = [
  { id: 'trace', from: 0.12, color: '#3D5873', alpha: 0.6, legend: null },
  { id: 'severe', from: 0.3, color: '#E6BA2D', alpha: 1, legend: '0.75' },
  { id: 'damaging', from: 0.55, color: '#D9722B', alpha: 1, legend: '1.00' },
  { id: 'large', from: 0.75, color: '#A93F1C', alpha: 1, legend: '1.50' },
] as const;

/** The swath opacity where the 1.00 in class starts: the streets and lots that count. */
export const ONE_INCH = 0.55;

/** A swath opacity as a size, to the nearest quarter inch, for the street list. */
export function sizeAt(a: number) {
  const inches = 1 + (0.5 * (a - ONE_INCH)) / (0.75 - ONE_INCH);
  return (Math.round(Math.min(1.5, Math.max(1, inches)) * 4) / 4).toFixed(2);
}

function profile(r: number) {
  for (let i = 1; i < PROFILE.length; i++) {
    const [a, pa] = PROFILE[i - 1];
    const [b, pb] = PROFILE[i];
    if (r <= b) return pa + ((pb - pa) * (r - a)) / (b - a);
  }
  return 0;
}

/** The swath's opacity at a point: every blob's profile there, combined as the drawing composites them. */
export function hailAt(blobs: readonly Blob[], x: number, y: number) {
  let clear = 1;
  for (const blob of blobs) {
    const t = (blob.angle * Math.PI) / 180;
    const dx = x - blob.x;
    const dy = y - blob.y;
    const u = (dx * Math.cos(t) + dy * Math.sin(t)) / blob.rx;
    const v = (-dx * Math.sin(t) + dy * Math.cos(t)) / blob.ry;
    const r = Math.hypot(u, v);
    if (r < 1) clear *= 1 - blob.strength * profile(r);
  }
  return 1 - clear;
}

/* ------------------------------------------------------------- Tracks */

type Point = [number, number];

function track(points: Point[]) {
  const segments = points.slice(1).map((b, i) => {
    const a = points[i];
    const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
    return { a, dx: (b[0] - a[0]) / length, dy: (b[1] - a[1]) / length, length };
  });
  const length = segments.reduce((sum, seg) => sum + seg.length, 0);
  /** A point `s` px along the track and its heading, running on past either end. */
  const along = (s: number) => {
    let rest = s;
    for (const [i, seg] of segments.entries()) {
      if (rest <= seg.length || i === segments.length - 1) {
        return { x: seg.a[0] + seg.dx * rest, y: seg.a[1] + seg.dy * rest, dx: seg.dx, dy: seg.dy };
      }
      rest -= seg.length;
    }
    throw new Error('unreachable');
  };
  return { length, along };
}

/** A blob `u` px along the heading and `v` across it (positive: right of travel), from a point on a track. */
function blobAt(
  c: { x: number; y: number; dx: number; dy: number },
  u: number,
  v: number,
  rx: number,
  ry: number,
  strength: number,
): Blob {
  return {
    x: c.x + c.dx * u - c.dy * v,
    y: c.y + c.dy * u + c.dx * v,
    rx,
    ry,
    angle: (Math.atan2(c.dy, c.dx) * 180) / Math.PI,
    strength,
  };
}

/** A small seeded generator, so the server and the browser draw the same streets. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/* ------------------------------------------------ Card 1: last night */

/** Last night's map: 360 × 270, the Alpharetta end of a storm's swath. */
export const PAST = { width: 360, height: 270 };

const PAST_TRACK = track([
  [-40, 240],
  [110, 184],
  [230, 124],
  [410, 40],
]);

/**
 * Last night's swath, in the order it fell: blobs every 18 px along the
 * track, strengthening to a 1.50 in core past the middle and tailing off.
 * `at` is where along the paint (0 → 1) each one lands.
 */
export const PAST_SWATH: (Blob & { at: number })[] = Array.from({ length: 27 }, (_, i) => {
  const s = i * 18;
  const k = s / PAST_TRACK.length;
  const c = PAST_TRACK.along(s);
  const peak = Math.exp(-(((k - 0.55) / 0.38) ** 2));
  return {
    ...blobAt(
      c,
      0,
      10 * Math.sin(s / 38) + 5 * Math.sin(s / 13),
      50 + 10 * Math.sin(s / 29),
      46 + 9 * Math.cos(s / 41),
      0.2 + 0.24 * peak,
    ),
    at: k,
  };
});

/** The swath's opacity at a point, once it has all fallen. */
export const pastHailAt = (x: number, y: number) => hailAt(PAST_SWATH, x, y);

/** Arterials and a creek, map px. County lines are the city limit. */
export const PAST_BASEMAP: BasemapShape = {
  countyLines: ['M0 58C70 50 120 70 176 52S300 20 360 34', 'M268 270C262 214 290 168 282 112S300 34 296 0'],
  roads: [
    'M-10 206C70 196 130 214 196 188S300 140 370 150',
    'M150 -10C156 60 140 120 162 180S150 250 158 280',
    'M-10 104C60 112 110 90 170 98S270 84 370 96',
    'M40 280C60 220 96 190 92 140S118 50 104 -10',
    'M226 280C232 230 250 196 244 150S262 60 256 -10',
  ],
  river: 'M-10 150C40 160 64 138 104 146S150 170 188 162S250 120 300 134S340 150 370 144',
  lake: 'M300 206C314 196 340 200 342 214C344 228 322 236 308 230C296 226 292 214 300 206Z',
};

/** Local streets: short curves and cul-de-sacs off the arterials, the kind a canvass walks. */
export type Street = { d: string; mid: Point; bulb?: Point };

const SEED = 11;

function localStreets(): Street[] {
  const rand = seeded(SEED);
  const streets: Street[] = [];
  // Neighbourhoods laid out on a loose jittered spread, never a lattice.
  for (let i = 0; i < 260; i++) {
    const x = 14 + rand() * 332;
    const y = 12 + rand() * 246;
    if (streets.some((s) => Math.hypot(s.mid[0] - x, s.mid[1] - y) < 22)) continue;
    const heading = rand() * Math.PI;
    const length = 18 + rand() * 16;
    const bend = (rand() - 0.5) * 18;
    const hx = (Math.cos(heading) * length) / 2;
    const hy = (Math.sin(heading) * length) / 2;
    const a: Point = [x - hx, y - hy];
    const b: Point = [x + hx, y + hy];
    const control: Point = [x - Math.sin(heading) * bend, y + Math.cos(heading) * bend];
    const culDeSac = rand() < 0.45;
    streets.push({
      d: `M${a[0].toFixed(1)} ${a[1].toFixed(1)}Q${control[0].toFixed(1)} ${control[1].toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`,
      mid: [x, y],
      bulb: culDeSac ? b : undefined,
    });
  }
  return streets;
}

const STREETS = localStreets();

/** How much of a street lies in the 1.00 in band, from samples along it. */
function inBand(street: Street) {
  const [, ax, ay, cx, cy, bx, by] = street.d
    .match(/M([\d.-]+) ([\d.-]+)Q([\d.-]+) ([\d.-]+) ([\d.-]+) ([\d.-]+)/)!
    .map(Number);
  let inside = 0;
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    const x = (1 - t) ** 2 * ax + 2 * (1 - t) * t * cx + t ** 2 * bx;
    const y = (1 - t) ** 2 * ay + 2 * (1 - t) * t * cy + t ** 2 * by;
    const a = pastHailAt(x, y);
    if (a >= ONE_INCH) inside++;
  }
  return { share: inside / 9, middle: pastHailAt(...street.mid) };
}

/** Street names for the list, in the order the streets light up. */
const STREET_NAMES = ['Webb Bridge Rd', 'Kimball Bridge Rd', 'Haynes Bridge Rd', 'Old Milton Pkwy', 'Canton St'];

/**
 * The streets that took 1.00 in or more: most of the street inside the
 * band, lit in the order the swath crossed them. The first five carry
 * names and sizes for the list beside the map.
 */
export const HIT_STREETS = STREETS.map((street) => ({ street, ...inBand(street) }))
  .filter((s) => s.share >= 2 / 3)
  .map((s) => ({ ...s.street, size: sizeAt(s.middle), along: projectPast(s.street.mid) }))
  .sort((a, b) => a.along - b.along)
  .map((s, i) => ({ ...s, name: STREET_NAMES[i] as string | undefined }));

/** The rest of the streets, drawn plain. */
export const OTHER_STREETS = STREETS.filter((street) => !HIT_STREETS.some((hit) => hit.d === street.d));

function projectPast([x, y]: Point) {
  // Distance along the track's overall heading is enough to order streets by when the swath reached them.
  const a = PAST_TRACK.along(0);
  const b = PAST_TRACK.along(PAST_TRACK.length);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return ((x - a.x) * dx + (y - a.y) * dy) / (dx * dx + dy * dy);
}

/** Place labels, map px. */
export const PAST_TOWNS: { name: string; at: Point }[] = [
  { name: 'Alpharetta', at: [190, 72] },
  { name: 'Milton', at: [74, 30] },
];

/* --------------------------------------------- Card 2: the next hour */

/** The forecast map: 480 × 270, three fleet lots north of Atlanta. */
export const NEXT = { width: 480, height: 270 };

const NEXT_TRACK = track([
  [-120, 330],
  [150, 190],
  [300, 104],
  [600, -40],
]);

/**
 * Where the cell's centre is along the track at the slider's Now (0) and how
 * far it moves by +60 (1), px. Solved so the 1.00 in band reaches Sandy
 * Springs at +25 (16:50) and Roswell at +50 (17:15), the answer's "from
 * 4:50 pm": moving a lot or reshaping the cell means solving again.
 */
const NEXT_START = 165.5;
const NEXT_RUN = 339.6;

/** The forecast cell at `u` (0 = Now, 1 = +60 min): a hail core, a longer trailing swath and a flank. */
export function nextCell(u: number): Blob[] {
  const c = NEXT_TRACK.along(NEXT_START + NEXT_RUN * u);
  return [
    blobAt(c, -74, 6, 112, 44, 0.34),
    blobAt(c, 0, 0, 82, 58, 0.72),
    blobAt(c, 16, -6, 36, 24, 0.38),
    blobAt(c, -30, 34, 48, 26, 0.24),
  ];
}

/** The cell's offset from its drawn (Now) position at `u`: the map moves one group, not four blobs. */
export function nextShift(u: number): Point {
  const a = NEXT_TRACK.along(NEXT_START);
  const b = NEXT_TRACK.along(NEXT_START + NEXT_RUN * u);
  return [b.x - a.x, b.y - a.y];
}

/** The track, drawn dashed ahead of the cell. */
export const NEXT_TRACK_PATH = 'M-120 330L150 190L300 104L600 -40';

/** Hail at a point at `u`. */
export const nextHailAt = (u: number, x: number, y: number) => hailAt(nextCell(u), x, y);

/** When the 1.00 in band first covers a point, as a share of the next hour; null if it never does. */
function firstHit([x, y]: Point) {
  for (let i = 0; i <= 600; i++) {
    const u = i / 600;
    if (nextHailAt(u, x, y) >= ONE_INCH) return u;
  }
  return null;
}

/** The clock at the slider's Now, minutes after midnight (16:25), for the lots' ETAs. */
export const NEXT_NOW = 16 * 60 + 25;

export const clock = (minutes: number) =>
  `${String(Math.floor(minutes / 60) % 24).padStart(2, '0')}:${String(Math.round(minutes % 60)).padStart(2, '0')}`;

/**
 * The fleet's lots, with where they sit on the map. A lot the 1.00 in band
 * reaches turns red at that moment (`at`, 0–1 of the hour) and shows its
 * ETA; the others are scored clear once the cell has gone by (`at` too).
 */
export const LOTS = (
  [
    { id: 'sandy', name: 'Sandy Springs', at: [168, 202] },
    { id: 'roswell', name: 'Roswell', at: [288, 90] },
    { id: 'norcross', name: 'Norcross', at: [410, 212] },
  ] as { id: string; name: string; at: Point }[]
).map((lot) => {
  const hit = firstHit(lot.at);
  return hit === null
    ? { ...lot, hit: false, score: 0.9, badge: 'Clear' }
    : { ...lot, hit: true, score: hit, badge: `ETA ${clock(NEXT_NOW + hit * 60)}` };
});

/** Once every lot has its call. */
export const LOTS_SCORED = Math.max(...LOTS.map((lot) => lot.score)) + 0.03;

export const NEXT_BASEMAP: BasemapShape = {
  countyLines: ['M0 150C80 140 140 160 200 150S330 128 480 140', 'M236 0C230 60 250 110 240 170S250 240 246 270'],
  roads: [
    'M204 -10C200 60 216 130 206 190S214 250 210 280',
    'M-10 238C80 230 140 250 220 236S360 250 490 240',
    'M-10 60C80 70 150 50 240 62S380 40 490 56',
    'M330 280C340 220 380 180 420 150S470 90 490 80',
    'M90 -10C100 60 80 120 110 170S100 240 120 280',
  ],
  // The river runs between the northern lots and the southern one.
  river: 'M-10 176C50 164 90 186 140 170S220 130 270 148S360 170 410 150S460 124 490 128',
  lake: 'M20 92C36 80 64 84 66 100C68 116 42 122 28 116C16 110 12 100 20 92Z',
};
