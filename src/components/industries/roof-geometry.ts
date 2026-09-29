/**
 * Geometry for the roofing size-class drawing: one roof slope in section, eave
 * and gutter bottom left, rising to a stepped cutaway top right that shows the
 * layers (shingles over underlayment over decking over the rafter). A pipe
 * boot, a box vent and a skylight sit on the slope.
 *
 * Everything is computed once, in viewBox units, from two coordinates: `s`
 * runs up the slope from the eave and `d` runs into the roof (negative is
 * above the deck). The component only places these paths, and the Paper board
 * is drawn from the same numbers. No imports, so a script can run it as is.
 */


const PITCH = (22 * Math.PI) / 180;
const COS = Math.cos(PITCH);
const SIN = Math.sin(PITCH);

/** Where the deck's top line meets the eave's plumb cut. */
const EAVE_X = 72;
const EAVE_Y = 304;

/** Depths into the roof. Shingle butts stand at `top`, each course thins to `low`. */
const D = { top: -11, low: -5, base: 0, felt: 1.75, deck: 3.5, deckBase: 17, rafter: 44 };

/** Course exposure along the slope. */
const EXPOSURE = 24;

/** The stepped cutaway: each layer stops a little further up than the one over it. */
const END = { shingles: 418, felt: 440, deck: 464 };

const PIPE_S = 92;
const VENT = { a: 180, b: 216 };
const SKY = { a: 270, b: 330, curb: 6 };

type Pt = [number, number];

const r = (n: number) => Math.round(n * 10) / 10;
const fmt = (pts: Pt[]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${r(x)} ${r(y)}`).join(' ');

/** A point `s` up the slope and `d` into the roof. */
export const at = (s: number, d: number): Pt => [EAVE_X + s * COS + d * SIN, EAVE_Y - s * SIN + d * COS];

/** How far up the slope a plumb (vertical) line at `x` crosses depth `d`. */
const sAtX = (x: number, d: number) => (x - EAVE_X - d * SIN) / COS;

/** A cut through the layers: plumb at an x, or square to the slope at an s. */
type Cut = { x: number } | { s: number };
const cutAt = (cut: Cut, d: number): Pt => at('s' in cut ? cut.s : sAtX(cut.x, d), d);

/** A layer band from cut `a` to cut `b`, between depths `d1` and `d2`. */
const band = (a: Cut, b: Cut, d1: number, d2: number) =>
  `${fmt([cutAt(a, d1), cutAt(b, d1), cutAt(b, d2), cutAt(a, d2)])} Z`;

/** A line along the slope at depth `d`. */
const along = (a: Cut, b: Cut, d: number) => fmt([cutAt(a, d), cutAt(b, d)]);

/** A path from slope coordinates. */
const path = (pts: [number, number][]) => fmt(pts.map(([s, d]) => at(s, d)));

const eave: Cut = { x: EAVE_X };
const pipeX = at(PIPE_S, D.top)[0];
const PIPE_HALF = 6;

// ---------------------------------------------------------------------------
// Shingles: a sawtooth whose butt faces look down the slope

const firstButt = sAtX(EAVE_X, D.top);
const butts: number[] = [];
for (let s = firstButt; s < END.shingles - 4; s += EXPOSURE) butts.push(s);

/** The shingle surface's depth at `s`: `top` at a butt, thinning to `low` just under the next. */
const surface = (s: number) => {
  const i = Math.max(0, butts.findLastIndex((b) => b <= s));
  const t = Math.min(1, (s - butts[i]) / EXPOSURE);
  return D.top + (D.low - D.top) * t;
};

/** Courses from `from` to `to` as one closed band (sawtooth over the base line). */
function shingleBand(from: number, to: number) {
  const pts: [number, number][] = [[from, surface(from)]];
  for (const b of butts) {
    if (b <= from || b >= to) continue;
    pts.push([b, D.low], [b, D.top]);
  }
  pts.push([to, surface(to)], [to, D.base], [from, D.base]);
  // The eave end is a plumb cut like the deck's.
  return `${fmt(pts.map(([s, d]) => at(s, d)))} Z`;
}

export const shingles = [shingleBand(firstButt, SKY.a - 8), shingleBand(SKY.b + 8, END.shingles)];

// ---------------------------------------------------------------------------
// Underlayment, decking, rafter

const pipeL: Cut = { x: pipeX - PIPE_HALF - 1 };
const pipeR: Cut = { x: pipeX + PIPE_HALF + 1 };
const ventHoleA: Cut = { s: VENT.a + 11 };
const ventHoleB: Cut = { s: VENT.b - 11 };
const skyA: Cut = { s: SKY.a + SKY.curb };
const skyB: Cut = { s: SKY.b - SKY.curb };

export const felt = [
  along(eave, pipeL, D.felt),
  along(pipeR, ventHoleA, D.felt),
  along(ventHoleB, { s: SKY.a }, D.felt),
  along({ s: SKY.b }, { s: END.felt }, D.felt),
];

export const deck = [
  band(eave, pipeL, D.deck, D.deckBase),
  band(pipeR, ventHoleA, D.deck, D.deckBase),
  band(ventHoleB, skyA, D.deck, D.deckBase),
  band(skyB, { s: END.deck }, D.deck, D.deckBase),
];

/** Butt joints between deck sheets. */
export const deckSeams = [150, 380].map((s) => path([[s, D.deck], [s, D.deckBase]]));

export const rafter = [band(eave, skyA, D.deckBase, D.rafter), band(skyB, { s: END.deck }, D.deckBase, D.rafter)];

// ---------------------------------------------------------------------------
// Eave: fascia, drip edge, gutter

const eaveY = (d: number) => at(sAtX(EAVE_X, d), d)[1];
export const fascia = `M${EAVE_X - 8} ${r(eaveY(D.deck))} H${EAVE_X} V${r(eaveY(D.rafter) - 12)} H${EAVE_X - 8} Z`;
export const dripEdge = fmt([
  [EAVE_X + 2, eaveY(D.base) - 1],
  [EAVE_X - 11, eaveY(D.base) + 2],
  [EAVE_X - 11, eaveY(D.base) + 7],
]);
const gTop = eaveY(D.deck) + 4;
export const gutter = `M${EAVE_X - 8} ${r(gTop)} V${r(gTop + 24)} Q${EAVE_X - 8} ${r(gTop + 29)} ${EAVE_X - 13} ${r(
  gTop + 29,
)} H${EAVE_X - 26} Q${EAVE_X - 31} ${r(gTop + 29)} ${EAVE_X - 32} ${r(gTop + 24)} L${EAVE_X - 35} ${r(gTop + 2)} H${
  EAVE_X - 30
}`;

// ---------------------------------------------------------------------------
// Pipe and boot

const surfaceAtX = (x: number) => {
  // Solve for the surface depth at a plumb line; two passes are plenty on a 5-unit tooth.
  let d = D.top;
  for (let i = 0; i < 3; i++) d = surface(sAtX(x, d));
  return at(sAtX(x, d), d)[1];
};
const pipeTop = surfaceAtX(pipeX) - 34;
const pipeBottom = at(PIPE_S, D.rafter)[1] + 8;
export const pipe = `M${r(pipeX - PIPE_HALF)} ${r(pipeTop)} H${r(pipeX + PIPE_HALF)} V${r(pipeBottom)} H${r(
  pipeX - PIPE_HALF,
)} Z`;
export const pipeRim = `M${r(pipeX - PIPE_HALF - 1.5)} ${r(pipeTop)} H${r(pipeX + PIPE_HALF + 1.5)}`;
const bootL = surfaceAtX(pipeX - 13);
const bootR = surfaceAtX(pipeX + 13);
const collarTop = surfaceAtX(pipeX) - 14;
export const bootFlange = path([
  [PIPE_S - 22, surface(PIPE_S - 22) - 1.5],
  [PIPE_S + 22, surface(PIPE_S + 22) - 1.5],
]);
export const bootCollar = fmt([
  [pipeX - 13, bootL - 1.5],
  [pipeX - PIPE_HALF - 1.5, collarTop],
  [pipeX + PIPE_HALF + 1.5, collarTop],
  [pipeX + 13, bootR - 1.5],
]);

// ---------------------------------------------------------------------------
// Box vent

const ventFoot = D.top - 1;
export const vent = `${path([
  [VENT.a, ventFoot],
  [VENT.a + 4, -27],
  [VENT.b - 6, -29],
  [VENT.b, ventFoot],
])} Z`;
export const ventSeam = path([
  [VENT.a + 6, -23],
  [VENT.b - 5, -24.5],
]);
export const ventFlange = path([
  [VENT.a - 8, ventFoot],
  [VENT.b + 8, ventFoot],
]);

// ---------------------------------------------------------------------------
// Skylight: curb, glass, flashing

const GLASS = { top: -30, base: -25 };
export const curbs = [
  band({ s: SKY.a }, { s: SKY.a + SKY.curb }, GLASS.base, D.deck),
  band({ s: SKY.b - SKY.curb }, { s: SKY.b }, GLASS.base, D.deck),
];
export const glass = band({ s: SKY.a - 3 }, { s: SKY.b + 3 }, GLASS.top, GLASS.base);
export const glassGlint = path([
  [SKY.a + 8, GLASS.top + 1.8],
  [SKY.a + 26, GLASS.top + 1.8],
]);
/** Apron flashing below the curb, head flashing above it. */
export const flashing = [
  path([
    [SKY.a - 14, surface(SKY.a - 14) - 1.5],
    [SKY.a - 1.5, surface(SKY.a - 8) - 1.5],
    [SKY.a - 1.5, -19],
  ]),
  path([
    [SKY.b + 1.5, -19],
    [SKY.b + 1.5, surface(SKY.b + 8) - 1.5],
    [SKY.b + 16, surface(SKY.b + 16) - 1.5],
  ]),
];

// ---------------------------------------------------------------------------
// Labels

type Label = { text: string; x: number; y: number; anchor: 'start' | 'middle' | 'end'; leader?: string };

const layerLabel = (text: string, s: number, d: number, y: number): Label => {
  const [x, py] = at(s, d);
  return { text, x: r(x - 6), y, anchor: 'end', leader: `M${r(x)} ${r(py)} V${y - 4} H${r(x - 4)}` };
};

export const labels: Label[] = [
  layerLabel('SHINGLES', END.shingles - 10, surface(END.shingles - 10), 100),
  layerLabel('UNDERLAYMENT', (END.shingles + END.felt) / 2 + 2, D.felt - 1, 78),
  layerLabel('DECKING', (END.felt + END.deck) / 2 + 2, D.deck, 56),
  { text: 'SKYLIGHT', x: r(at((SKY.a + SKY.b) / 2, GLASS.top)[0] - 12), y: r(at((SKY.a + SKY.b) / 2, GLASS.top)[1] - 20), anchor: 'middle' },
  { text: 'VENT', x: r(at((VENT.a + VENT.b) / 2, -29)[0]), y: r(at((VENT.a + VENT.b) / 2, -29)[1] - 26), anchor: 'middle' },
  { text: 'PIPE BOOT', x: r(pipeX), y: r(pipeTop - 14), anchor: 'middle' },
  { text: 'GUTTER', x: EAVE_X - 20, y: r(gTop + 43), anchor: 'middle' },
];

// ---------------------------------------------------------------------------
// Damage, per size class

export type DamageLevel = 'severe' | 'damaging' | 'destructive';

/**
 * `mark` (a stroke), `dot` and `fill` (a solid shape) fade in; `crack` draws
 * in (pathLength 1); `hole` is filled with the card's ground so it cuts
 * through the layers under it, then outlined.
 */
export type DamageShape = { kind: 'mark' | 'dot' | 'fill' | 'crack' | 'hole'; d: string };
export type Pin = { n: number; x: number; y: number };

/** A small dent: an arc pressed into the surface at `s`. */
const dent = (s: number, depth = 2.6): string => {
  const d = surface(s);
  const [x1, y1] = at(s - 5, surface(s - 5));
  const [cx, cy] = at(s, d + depth * 2);
  const [x2, y2] = at(s + 5, surface(s + 5));
  return `M${r(x1)} ${r(y1)} Q${r(cx)} ${r(cy)} ${r(x2)} ${r(y2)}`;
};

/** A bare patch on a course (granules gone), plus loose granules above it. */
const granuleLoss = (s: number): DamageShape[] => [
  { kind: 'mark', d: path([[s - 7, surface(s - 7) - 0.2], [s + 7, surface(s + 7) - 0.2]]) },
  ...[
    [-5, -4.5],
    [-1, -7],
    [3, -5],
    [7, -8.5],
  ].map(([ds, dd]) => {
    const [x, y] = at(s + ds, surface(s + ds) + dd);
    return { kind: 'dot' as const, d: `M${r(x)} ${r(y)} h0.01` };
  }),
];

/** A fracture through one course, from the surface to the mat. */
const shingleCrack = (s: number): DamageShape => ({
  kind: 'crack',
  d: path([
    [s - 3, surface(s - 3) - 0.3],
    [s, surface(s) + 3],
    [s - 2.5, surface(s) + 5.5],
    [s + 1, D.base - 0.5],
  ]),
});

/** A jagged puncture through shingles, underlayment and deck. */
const puncture = (s: number): DamageShape[] => [
  {
    kind: 'hole',
    d: `${path([
      [s - 6, surface(s - 6) - 0.5],
      [s - 1, surface(s) + 2],
      [s + 5, surface(s + 5) - 0.5],
      [s + 7, D.base + 1],
      [s + 4, D.deck + 3],
      [s + 6.5, D.deckBase + 0.8],
      [s + 1, D.deck + 8],
      [s - 3, D.deckBase + 0.8],
      [s - 6.5, D.deck + 4],
      [s - 4, D.base],
    ])} Z`,
  },
  // Splinters hanging under the deck, and water finding its way in.
  { kind: 'crack', d: path([[s + 5, D.deckBase], [s + 7.5, D.deckBase + 7]]) },
  { kind: 'crack', d: path([[s - 4, D.deckBase], [s - 7, D.deckBase + 6]]) },
  ...[16, 28].map((drop) => {
    const [x, y] = at(s, D.deckBase + drop);
    return {
      kind: 'fill' as const,
      d: `M${r(x)} ${r(y - 4)} Q${r(x + 2.6)} ${r(y)} ${r(x)} ${r(y + 1.6)} Q${r(x - 2.6)} ${r(y)} ${r(x)} ${r(y - 4)} Z`,
    };
  }),
];

const pinAt = (n: number, s: number, lift: number): Pin => {
  const [x, y] = at(s, surface(s) - lift);
  return { n, x: r(x), y: r(y) };
};

const ventTop = (s: number, dd = 0) => at(s, -29 + ((s - VENT.a) / (VENT.b - VENT.a)) * 2 + dd);

export const damage: Record<DamageLevel, { shapes: DamageShape[]; pins: Pin[] }> = {
  severe: {
    shapes: [
      ...granuleLoss(132),
      ...granuleLoss(372),
      { kind: 'mark', d: dent(56) },
      { kind: 'mark', d: dent(246) },
      { kind: 'mark', d: dent(404) },
      // A soft-metal dent in the vent cap.
      {
        kind: 'mark',
        d: (() => {
          const [x1, y1] = ventTop(194);
          const [cx, cy] = ventTop(198, 4);
          const [x2, y2] = ventTop(202);
          return `M${r(x1)} ${r(y1)} Q${r(cx)} ${r(cy)} ${r(x2)} ${r(y2)}`;
        })(),
      },
      // Dents along the gutter's front face and sole.
      { kind: 'mark', d: `M${EAVE_X - 34} ${r(gTop + 8)} Q${EAVE_X - 30} ${r(gTop + 11)} ${EAVE_X - 33.3} ${r(gTop + 15)}` },
      { kind: 'mark', d: `M${EAVE_X - 25} ${r(gTop + 29)} Q${EAVE_X - 21} ${r(gTop + 25)} ${EAVE_X - 17} ${r(gTop + 29)}` },
    ],
    pins: [pinAt(1, 132, 20), pinAt(2, 246, 18), { n: 3, x: EAVE_X - 52, y: r(gTop + 10) }],
  },
  damaging: {
    shapes: [
      shingleCrack(64),
      shingleCrack(146),
      shingleCrack(244),
      shingleCrack(398),
      // Vent cap split across its top.
      {
        kind: 'crack',
        d: fmt([ventTop(192, -0.3), ventTop(196, 5), ventTop(199, 3), ventTop(203, 10), ventTop(206, 16.5)]),
      },
      // Boot collar split from the rim down to the flange.
      {
        kind: 'crack',
        d: fmt([
          [pipeX - PIPE_HALF - 2, collarTop + 1],
          [pipeX - PIPE_HALF - 5, collarTop + 5],
          [pipeX - PIPE_HALF - 3.5, collarTop + 8],
          [pipeX - PIPE_HALF - 7, bootL - 3],
        ]),
      },
    ],
    pins: [pinAt(1, 146, 20), { n: 2, x: r(ventTop(212)[0] + 14), y: r(ventTop(212)[1] - 14) }, { n: 3, x: r(pipeX - 26), y: r(collarTop - 10) }],
  },
  destructive: {
    shapes: [
      ...puncture(236),
      ...puncture(376),
      // The pane smashed through the middle; shards dropped into the light well.
      {
        kind: 'hole',
        d: `${path([
          [SKY.a + 15, GLASS.top - 0.5],
          [SKY.a + 19, GLASS.top + 2],
          [SKY.a + 17, GLASS.base + 0.5],
          [SKY.a + 33, GLASS.base + 0.5],
          [SKY.a + 30, GLASS.top + 2.5],
          [SKY.a + 34, GLASS.top - 0.5],
        ])} Z`,
      },
      { kind: 'crack', d: path([[SKY.a + 34, GLASS.top + 1], [SKY.a + 41, GLASS.top + 3.5], [SKY.a + 45, GLASS.base - 0.5]]) },
      ...[
        [SKY.a + 20, -12],
        [SKY.a + 30, 2],
        [SKY.a + 24, 22],
      ].map(([s, d]) => {
        const [x, y] = at(s, d);
        return { kind: 'fill' as const, d: `M${r(x)} ${r(y)} l5 -2 l-2 5 Z` };
      }),
      // Head flashing torn up off the curb.
      {
        kind: 'crack',
        d: path([
          [SKY.b + 1.5, -19],
          [SKY.b + 6, -26],
          [SKY.b + 18, -24],
        ]),
      },
    ],
    pins: [
      // Under the deck, beside the water coming through.
      { n: 1, x: r(at(250, 56)[0]), y: r(at(250, 56)[1]) },
      pinAt(2, SKY.a - 12, 30),
      pinAt(3, SKY.b + 28, 22),
    ],
  },
};

/** Cropped to the drawing: the page's margin is the card's padding, not empty viewBox. */
export const viewBox = '6 18 546 338';

// ---------------------------------------------------------------------------
// Hail in the sky over the slope, drawn at each class's threshold size

/** Radius per class in viewBox units, in proportion to 0.75, 1.00 and 2.00 in. */
const HAIL_R: Record<DamageLevel, number> = { severe: 4.5, damaging: 6, destructive: 12 };

/** Where the stones hang, and how far each has fallen along its streak. */
const HAIL_AT: Pt[] = [
  [112, 64],
  [178, 36],
  [236, 92],
  [150, 128],
  [292, 44],
];

/** Wind-blown fall: the streak trails up and to the left of each stone. */
const STREAK: Pt = [-0.42, -0.91];

export const hail: Record<DamageLevel, { cx: number; cy: number; r: number; streak: string }[]> = Object.fromEntries(
  (Object.keys(HAIL_R) as DamageLevel[]).map((level) => [
    level,
    HAIL_AT.map(([x, y]) => {
      const radius = HAIL_R[level];
      const from: Pt = [x + STREAK[0] * (radius + 3), y + STREAK[1] * (radius + 3)];
      const to: Pt = [x + STREAK[0] * (radius + 22), y + STREAK[1] * (radius + 22)];
      return { cx: x, cy: y, r: radius, streak: fmt([from, to]) };
    }),
  ]),
) as Record<DamageLevel, { cx: number; cy: number; r: number; streak: string }[]>;
