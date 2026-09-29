import type { BasemapShape } from './map-layers';
import { probabilityAt, type Blob } from './risk-model';

/*
 * The accuracy section's scoring map (accuracy-scoring.tsx), in its own
 * 600×600 px space. The card draws it `slice`, portrait on phones and as tall
 * as the text column from 1024px, so only its edges are ever cut: what
 * matters sits inside x 70–530, y 90–510, clear of the tags at the top and
 * the tally at the bottom. Pure numbers, so the server and the browser draw
 * the same frame.
 */

export const MAP = { width: 600, height: 600 };

export const BASEMAP: BasemapShape = {
  countyLines: [
    'M0 132H150V236H262V96H412V0',
    'M262 236V392H170V600',
    'M150 236L144 420H0',
    'M412 96L420 300H600',
    'M420 300L412 450H262V392',
    'M412 450V600',
  ],
  roads: [
    'M-10 300C110 284 200 330 310 300S500 236 610 250',
    'M290 -10C282 110 318 230 276 380S300 520 288 610',
    'M40 610C100 500 70 400 130 290S210 110 180 -10',
    'M420 610C460 520 540 470 610 480',
  ],
  river: 'M-10 500C80 486 150 516 240 502S360 470 420 506S520 548 560 610',
  lake: 'M470 60C500 42 552 52 556 80C560 108 516 120 490 108C466 98 456 74 470 60Z',
};

/**
 * The forecast: one squall line across the middle, on the hero's profile and
 * bands (risk-model.ts), held still. A long main body, a trailing lobe, a
 * leading bulge, an intense core and a flank cell that breaks the outline.
 */
export const FORECAST: Blob[] = [
  { x: 300, y: 286, rx: 196, ry: 96, angle: -26, strength: 0.97 },
  { x: 186, y: 344, rx: 96, ry: 60, angle: -12, strength: 0.55 },
  { x: 408, y: 226, rx: 84, ry: 52, angle: -34, strength: 0.4 },
  { x: 312, y: 280, rx: 62, ry: 38, angle: -26, strength: 0.9 },
  { x: 236, y: 222, rx: 58, ry: 28, angle: -48, strength: 0.34 },
];

/** A fixed pseudo-random sequence, so the server and the client draw the same strikes. */
function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };
}

export type Strike = { x: number; y: number; hit: boolean };

/**
 * 24 strikes inside the forecast, most of them in its warmer bands, none
 * closer than 26px to another, and one that landed outside it, two thirds of
 * the way through.
 */
export const STRIKES: Strike[] = (() => {
  const random = seeded(11);
  const hits: Strike[] = [];
  for (let tries = 0; hits.length < 24 && tries < 5000; tries++) {
    const x = 110 + random() * 380;
    const y = 150 + random() * 280;
    const p = probabilityAt(FORECAST, x, y);
    const clear = hits.every((s) => Math.hypot(s.x - x, s.y - y) >= 26);
    if (p >= 0.45 && clear) hits.push({ x, y, hit: true });
  }
  const miss: Strike = { x: 468, y: 402, hit: false };
  return [...hits.slice(0, 16), miss, ...hits.slice(16)];
})();

/** Three place labels, away from the storm's core. Illustrative. */
export const TOWNS: { name: string; at: [number, number] }[] = [
  { name: 'Cedar Falls', at: [104, 178] },
  { name: 'Westover', at: [438, 150] },
  { name: 'Harlan', at: [176, 462] },
];
