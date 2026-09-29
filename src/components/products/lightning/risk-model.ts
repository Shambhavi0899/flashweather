/**
 * The storm in the hero's forecast map (risk-map.tsx), as a function of the
 * scrubber's minute. Pure numbers, no React, so the server renders the same
 * +30 frame the browser starts from.
 *
 * The map is a 570×330 frame at 12px to 1 km, about 47 × 27 km. The storm is
 * soft blobs riding the blue track: a long main body, a trailing lobe, a
 * leading bulge, a small intense cell at the heart that strengthens as it
 * goes, and two flank cells that break up the outline. Each blob follows one radial profile (PROFILE), with a broad soft
 * shoulder and a compact core, the shape of a squall line in the app. The map
 * draws each blob as a radial gradient of that profile; an SVG filter turns
 * their combined opacity into the product's stepped bands. `probabilityAt`
 * combines them the same way (1 − Π(1 − aᵢ)), so a hover and the picture
 * always agree.
 *
 * Speed, start and the site spots are tuned so the bands reach the sites in
 * one clear order: yellow at Practice Field B near +9 and orange at +18, then
 * the Stadium's orange at +31. The sites' calls follow the schedule in
 * content.ts, which this matches.
 */

export const W = 570;
export const H = 330;
/** One 1 km cell, in map px. */
export const CELL = 12;
export const COLS = Math.ceil(W / CELL);
export const ROWS = Math.ceil(H / CELL);

/** The storm's forecast track, drawn as the blue line. */
export const TRACK: [number, number][] = [
  [0, 250],
  [110, 236],
  [200, 214],
  [290, 190],
  [380, 150],
  [470, 118],
  [570, 80],
];

/** Where the storm's centre starts on the track (px along it), and how far it moves a minute. */
const START = 36;
const SPEED = 10;
/** The main body's radii, along and across the track. */
const REACH = 230;
const WIDTH = 110;

/**
 * One blob's opacity from its centre (0) to its edge (1): a flat core, a
 * quick drop to the orange level, then a long soft shoulder out to nothing.
 * The gradient's stops in risk-map.tsx are these points.
 */
export const PROFILE: [number, number][] = [
  [0, 1],
  [0.2, 0.95],
  [0.35, 0.66],
  [0.7, 0.45],
  [0.88, 0.2],
  [1, 0],
];

function profile(r: number) {
  for (let i = 1; i < PROFILE.length; i++) {
    const [a, pa] = PROFILE[i - 1];
    const [b, pb] = PROFILE[i];
    if (r <= b) return pa + ((pb - pa) * (r - a)) / (b - a);
  }
  return 0;
}

/**
 * The bands, lowest first: the grey haze a storm casts on the basemap, then
 * the product's teal, yellow, orange and red. `from` is the strike
 * probability a band starts at; `legend` is its name in the legend.
 */
export const BANDS = [
  { id: 'haze', from: 0.08, color: '#3A4757', alpha: 0.55, legend: null },
  { id: 'low', from: 0.2, color: '#12858A', alpha: 1, legend: 'Low' },
  { id: 'elevated', from: 0.45, color: '#E0B62A', alpha: 1, legend: 'Elevated' },
  { id: 'high', from: 0.65, color: '#DE7A14', alpha: 1, legend: 'High' },
  { id: 'severe', from: 0.82, color: '#D22E16', alpha: 1, legend: 'Severe' },
] as const;

/** The part of the storm a strike can flash in: the red core. */
const STRIKE_AT = 0.82;

const segments = TRACK.slice(1).map((b, i) => {
  const a = TRACK[i];
  const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
  return { a, dx: (b[0] - a[0]) / length, dy: (b[1] - a[1]) / length, length };
});

/** A point on the track, and its direction there, `s` px along it (running on past either end). */
function along(s: number) {
  if (s < 0) {
    const first = segments[0];
    return { x: first.a[0] + first.dx * s, y: first.a[1] + first.dy * s, dx: first.dx, dy: first.dy };
  }
  let rest = s;
  for (const seg of segments) {
    if (rest <= seg.length) return { x: seg.a[0] + seg.dx * rest, y: seg.a[1] + seg.dy * rest, dx: seg.dx, dy: seg.dy };
    rest -= seg.length;
  }
  const last = segments[segments.length - 1];
  const end = TRACK[TRACK.length - 1];
  return { x: end[0] + last.dx * rest, y: end[1] + last.dy * rest, dx: last.dx, dy: last.dy };
}

const smooth = (from: number, to: number, x: number) => {
  const k = Math.min(1, Math.max(0, (x - from) / (to - from)));
  return k * k * (3 - 2 * k);
};

export type Blob = {
  /** Centre, map px. */
  x: number;
  y: number;
  /** Radii along and across its heading, map px: the profile's edge. */
  rx: number;
  ry: number;
  /** Heading, degrees. */
  angle: number;
  /** Peak probability: the blob's opacity. */
  strength: number;
};

/** The storm's blobs at minute `t`. */
export function stormBlobs(t: number): Blob[] {
  const c = along(START + SPEED * t);
  const grow = smooth(0, 30, t);
  const wobble = Math.sin(t / 6);
  const sway = Math.cos(t / 9);
  const heading = Math.atan2(c.dy, c.dx);
  // A blob `u` px along the track and `v` px across it (positive: right of travel).
  const at = (u: number, v: number, rx: number, ry: number, strength: number, turn = 0): Blob => ({
    x: c.x + c.dx * u - c.dy * v,
    y: c.y + c.dy * u + c.dx * v,
    rx,
    ry,
    angle: ((heading + turn) * 180) / Math.PI,
    strength,
  });
  return [
    at(0, 0, REACH, WIDTH, 0.97),
    at(-REACH * 0.55, WIDTH * 0.35 + 10 * wobble, REACH * 0.45, WIDTH * 0.6, 0.55, 0.25 * wobble),
    at(REACH * 0.3, -WIDTH * 0.45 - 8 * wobble, REACH * 0.35, WIDTH * 0.45, 0.35, -0.3),
    at(REACH * 0.05, 12 * wobble, 46 + 10 * grow, 30 + 6 * grow, 0.2 + 0.75 * grow),
    // Breaks up the outline: a cell trailing on the left flank, and a tongue
    // on the right flank that swings with the storm.
    at(-REACH * 0.85, -WIDTH * 0.35 - 8 * sway, 58, 38, 0.5, 0.6),
    at(-REACH * 0.15, WIDTH * 0.8 + 6 * wobble, 64, 24, 0.32, 0.55 + 0.2 * sway),
  ];
}

/** Strike probability at map point (x, y) among these blobs. */
export function probabilityAt(blobs: Blob[], x: number, y: number) {
  let clear = 1;
  for (const b of blobs) {
    const a = (b.angle * Math.PI) / 180;
    const ox = x - b.x;
    const oy = y - b.y;
    const u = ox * Math.cos(a) + oy * Math.sin(a);
    const v = -ox * Math.sin(a) + oy * Math.cos(a);
    const r = Math.hypot(u / b.rx, v / b.ry);
    if (r < 1) clear *= 1 - b.strength * profile(r);
  }
  return 1 - clear;
}

/** Where to flash a strike: a random point in the red core, or null while there is none. */
export function strikePoint(blobs: Blob[], pick: number): [number, number] | null {
  const hot: [number, number][] = [];
  for (let y = CELL / 2; y < H; y += CELL) {
    for (let x = CELL / 2; x < W; x += CELL) {
      if (probabilityAt(blobs, x, y) >= STRIKE_AT) hot.push([x, y]);
    }
  }
  return hot.length ? hot[Math.floor(pick * hot.length)] : null;
}

/** The grid's cell numbers run on from 2200, row by row. */
export const cellId = (c: number, r: number) => 2200 + r * COLS + c;

export type Status = 'go' | 'caution' | 'nogo';
export const statusLabel: Record<Status, string> = { go: 'GO', caution: 'CAUTION', nogo: 'NO-GO' };
const RANK: Record<Status, number> = { go: 0, caution: 1, nogo: 2 };
/** Whether `a` is a worse call than `b`. */
export const worse = (a: Status, b: Status) => RANK[a] > RANK[b];

/** A site's schedule, minutes from now (content.ts): CAUTION, NO-GO, and when the storm has passed it. */
export type Schedule = { caution: number; nogo: number; passed: number };

/**
 * A site's call at minute `m`. Once NO-GO it stays NO-GO until its
 * all-clear, 30 minutes after the storm has passed, which falls after the
 * hour: within the map's window a site never turns back.
 */
export function siteCall(schedule: Schedule, m: number): Status {
  if (m >= schedule.nogo) return 'nogo';
  if (m >= schedule.caution) return 'caution';
  return 'go';
}

/** The clock at "Now", in minutes after midnight: 14:36, so +30 is 15:06. */
const NOW = 14 * 60 + 36;

export function clockAt(m: number) {
  const total = Math.round(NOW + m);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

/** "Now · 14:36", "+30 min · 15:06". */
export const timeLabel = (m: number) => (m === 0 ? `Now · ${clockAt(0)}` : `+${m} min · ${clockAt(m)}`);

/* ---------------------------------------------------------------- Labels */

export type Box = { x: number; y: number; w: number; h: number };
export type Slot = 'e' | 'w' | 'n' | 's' | 'ne' | 'nw' | 'se' | 'sw';

/** Where a label sits against its pin, as a box in map px; the CSS for each slot (products.css) does the same sums. */
const LENS = 32;
const CORNER = 24;
function slotBox(slot: Slot, [x, y]: [number, number], w: number, h: number): Box {
  switch (slot) {
    case 'e':
      return { x: x + LENS, y: y - h / 2, w, h };
    case 'w':
      return { x: x - LENS - w, y: y - h / 2, w, h };
    case 'n':
      return { x: x - w / 2, y: y - LENS - h, w, h };
    case 's':
      return { x: x - w / 2, y: y + LENS, w, h };
    case 'ne':
      return { x: x + CORNER, y: y - CORNER - h, w, h };
    case 'nw':
      return { x: x - CORNER - w, y: y - CORNER - h, w, h };
    case 'se':
      return { x: x + CORNER, y: y + CORNER, w, h };
    case 'sw':
      return { x: x - CORNER - w, y: y + CORNER, w, h };
  }
}

/** Slots in order of preference: beside the pin reads best, then below, above, the corners. */
const SLOTS: Slot[] = ['e', 'w', 's', 'n', 'se', 'sw', 'ne', 'nw'];

const overlap = (a: Box, b: Box) =>
  Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) *
  Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));

/**
 * Picks each site's label slot: inside the map, clear of the other sites'
 * pins and labels and of the fixed chrome (`avoid`: the panel, the
 * disclaimer), and away from the storm's core. Sites are placed in order,
 * each against the ones before. Plain scoring, so it gives the same answer
 * on the server and in the browser.
 */
export function placeLabels(
  sites: { pin: [number, number]; size: [number, number] }[],
  blobs: Blob[],
  avoid: Box[],
): Slot[] {
  const placed: Box[] = sites.map(({ pin }) => ({ x: pin[0] - 10, y: pin[1] - 10, w: 20, h: 20 }));
  return sites.map(({ pin, size }, i) => {
    let best: Slot = 'e';
    let bestScore = Infinity;
    SLOTS.forEach((slot, rank) => {
      const box = slotBox(slot, pin, size[0], size[1]);
      const outside =
        Math.max(0, 4 - box.x) +
        Math.max(0, box.x + box.w - (W - 4)) +
        Math.max(0, 4 - box.y) +
        Math.max(0, box.y + box.h - (H - 4));
      let hits = 0;
      placed.forEach((other, j) => {
        if (j !== i) hits += overlap(box, other);
      });
      for (const block of avoid) hits += overlap(box, block);
      // The storm under the label: probability sampled over it, the core counting most.
      let storm = 0;
      for (const fx of [0.1, 0.5, 0.9]) {
        for (const fy of [0.2, 0.8]) {
          const p = probabilityAt(blobs, box.x + box.w * fx, box.y + box.h * fy);
          storm += p >= 0.65 ? p * 2 : p * 0.4;
        }
      }
      const score = outside * 400 + hits * 4 + storm * 40 + rank * 3;
      if (score < bestScore) {
        bestScore = score;
        best = slot;
      }
    });
    placed.push(slotBox(best, pin, size[0], size[1]));
    return best;
  });
}
