'use client';

import { useEffect, useRef } from 'react';

/** One strike every 5–9s; the first a little after the hero has loaded in. */
const GAP_MIN = 5000;
const GAP_MAX = 9000;
const FIRST_MIN = 2600;
const FIRST_MAX = 4200;
/** How long a bolt is on screen (`home-strike`, styles/home-hero-lightning.css). */
const STRIKE_MS = 300;
/** When, inside a strike, its one flicker comes back up. */
const FLICKER_AT = 140;
/** Now and then a second bolt follows the first. It does not flicker. */
const DOUBLE_CHANCE = 0.22;
const RESTRIKE_MIN = 380;
const RESTRIKE_MAX = 560;
/** Photosensitivity: never more than three flashes in any one second. */
const FLASH_LIMIT = 3;
const FLASH_WINDOW = 1000;

/** What a bolt may never cross, and how far it keeps from each (its glow reaches ~14px). */
const KEEP_OUT: [selector: string, pad: number][] = [
  ['h1 .hero-word', 22],
  ['.hero-lede', 24],
  ['.hero-ctas', 24],
  ['.hero-support', 24],
  ['.hero-surfaces', 26],
];

type Point = { x: number; y: number };
type Box = { left: number; top: number; right: number; bottom: number };

const between = (min: number, max: number) => min + Math.random() * (max - min);

/** A jagged line from a to b: each half's midpoint is pushed sideways, `depth` times over. */
function jag(a: Point, b: Point, sway: number, depth: number): Point[] {
  if (depth === 0) return [a, b];
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const push = between(-sway, sway);
  const mid = { x: (a.x + b.x) / 2 - dy * push, y: (a.y + b.y) / 2 + dx * push };
  return [...jag(a, mid, sway, depth - 1).slice(0, -1), ...jag(mid, b, sway, depth - 1)];
}

const toPath = (points: Point[]) =>
  points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('');

const length = (points: Point[]) => Math.hypot(points.at(-1)!.x - points[0].x, points.at(-1)!.y - points[0].y);

/** A fork off `from`, leaning `turn` radians away from the line towards `to`. */
function fork(from: Point, to: Point, turn: number, reach: number, depth: number) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x) + turn;
  const size = Math.hypot(to.x - from.x, to.y - from.y) * reach;
  return jag(from, { x: from.x + Math.cos(angle) * size, y: from.y + Math.sin(angle) * size }, 0.2, depth);
}

/**
 * One bolt inside `width`×`height` that starts in the clouds at the top,
 * stays between `minX` and `maxX`, and crosses none of `keepOut`: the main
 * channel, and the forks that fit. Null if there is no room for one.
 */
function planBolt(width: number, height: number, minX: number, maxX: number, keepOut: Box[]) {
  const clear = (points: Point[]) =>
    points.every(
      (p) =>
        p.x > minX &&
        p.x < maxX &&
        p.y < height - 24 &&
        !keepOut.some((box) => p.x > box.left && p.x < box.right && p.y > box.top && p.y < box.bottom),
    );

  // The sky between the columns can be a narrow lane: the later attempts
  // run straighter, so one still fits.
  const fits: Point[][] = [];
  for (let attempt = 0; attempt < 160 && fits.length < 6; attempt++) {
    const tight = attempt >= 60;
    const start = { x: between(minX, maxX), y: between(-24, height * 0.06) };
    const end = { x: start.x + between(-1, 1) * width * (tight ? 0.03 : 0.08), y: between(0.2, 0.84) * height };
    const channel = jag(start, end, tight ? 0.12 : 0.2, 5);
    if (clear(channel)) fits.push(channel);
  }
  if (!fits.length) return null;
  // The longer of two picks, so a long bolt shows whenever one fits.
  const pick = () => fits[Math.floor(Math.random() * fits.length)];
  const [one, two] = [pick(), pick()];
  const main = length(one) > length(two) ? one : two;
  const end = main.at(-1)!;

  const forks: Point[][] = [];
  const count = Math.round(between(2, 4));
  for (let n = 0; n < count; n++) {
    const from = main[Math.floor(between(4, main.length - 8))];
    const side = Math.random() < 0.5 ? -1 : 1;
    const branch = fork(from, end, side * between(0.3, 0.75), between(0.3, 0.6), 4);
    if (!clear(branch)) continue;
    forks.push(branch);
    if (Math.random() < 0.45) {
      const twig = fork(branch[Math.floor(branch.length / 2)], branch.at(-1)!, -side * between(0.35, 0.8), 0.9, 3);
      if (clear(twig)) forks.push(twig);
    }
  }
  return { main, forks };
}

/**
 * The home hero's lightning (styles/home-hero-lightning.css): a bolt drawn
 * new for every strike, in the sky between the headline and the cards, and
 * the clouds lighting up with it. `children` are the hero's grades: the sky
 * flash sits under them, so the copy's ground stays dark, and the bolt over
 * them.
 *
 * A bolt is planned against the copy and the cards as they are laid out at
 * that moment and never crosses them; where they are stacked (below lg)
 * there is no sky between them, so only the clouds flash. Strikes run while
 * the hero is on screen and the tab is visible. With reduced motion none of
 * this runs.
 */
export function HeroLightning({ children }: { children: React.ReactNode }) {
  const skyRef = useRef<HTMLDivElement>(null);
  const boltRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const sky = skyRef.current;
    const bolt = boltRef.current;
    const hero = sky?.closest<HTMLElement>('[data-hero]');
    if (!sky || !bolt || !hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const mains = bolt.querySelectorAll('[data-bolt="main"]');
    const forks = bolt.querySelectorAll('[data-bolt="forks"]');

    let onScreen = true;
    let next = 0;
    let restrike = 0;
    let clear = 0;
    let lastStrike = 0;
    const live = () => onScreen && !document.hidden;

    // Every flash, as it is scheduled: a strike is two (it flickers once), a
    // second bolt one. A strike that would make a fourth in a second is dropped.
    let flashes: number[] = [];
    const book = (times: number[]) => {
      const all = [...flashes.filter((t) => t > times[0] - 2 * FLASH_WINDOW), ...times].sort((a, b) => a - b);
      const safe = all.every((t, i) => all.slice(i).filter((u) => u - t < FLASH_WINDOW).length <= FLASH_LIMIT);
      if (safe) flashes = all;
      return safe;
    };

    const strike = (kind: 'flicker' | 'once') => {
      const now = performance.now();
      if (!book(kind === 'flicker' ? [now, now + FLICKER_AT] : [now])) return;

      const frame = hero.getBoundingClientRect();
      const copy = hero.querySelector('.hero-copy')?.getBoundingClientRect();
      const cards = hero.querySelector('.hero-surfaces')?.getBoundingClientRect();
      const keepOut = KEEP_OUT.flatMap(([selector, pad]) =>
        [...hero.querySelectorAll(selector)].map((el) => {
          const box = el.getBoundingClientRect();
          return {
            left: box.left - frame.left - pad,
            top: box.top - frame.top - pad,
            right: box.right - frame.left + pad,
            bottom: box.bottom - frame.top + pad,
          };
        }),
      );
      // The sky between the two columns; none when they are stacked.
      const sideBySide = copy && cards && cards.left - copy.left > 480;
      const plan = sideBySide
        ? planBolt(
            frame.width,
            frame.height,
            copy.left - frame.left + (cards.left - copy.left) * 0.3,
            cards.left - frame.left,
            keepOut,
          )
        : null;

      if (plan) {
        bolt.setAttribute('viewBox', `0 0 ${frame.width.toFixed(0)} ${frame.height.toFixed(0)}`);
        mains.forEach((path) => path.setAttribute('d', toPath(plan.main)));
        forks.forEach((path) => path.setAttribute('d', plan.forks.map(toPath).join('')));
        bolt.setAttribute('data-strike', kind);
      }
      // The clouds light up round the bolt, or somewhere in the sky without one.
      const at = plan ? plan.main[0].x / frame.width : between(0.5, 0.8);
      sky.style.setProperty('--strike-x', `${(at * 100).toFixed(1)}%`);
      sky.setAttribute('data-strike', '');

      clearTimeout(clear);
      clear = window.setTimeout(() => {
        bolt.removeAttribute('data-strike');
        sky.removeAttribute('data-strike');
      }, STRIKE_MS);
    };

    const schedule = (delay: number) => {
      clearTimeout(next);
      next = window.setTimeout(() => {
        if (!live()) return;
        lastStrike = performance.now();
        strike('flicker');
        if (Math.random() < DOUBLE_CHANCE) {
          restrike = window.setTimeout(() => live() && strike('once'), between(RESTRIKE_MIN, RESTRIKE_MAX));
        }
        schedule(between(GAP_MIN, GAP_MAX));
      }, delay);
    };

    // Off screen or in a hidden tab nothing is scheduled; back in view the
    // next strike is still at least a full gap after the last one.
    const sync = () => {
      clearTimeout(next);
      clearTimeout(restrike);
      if (!live()) return;
      const sinceLast = lastStrike ? performance.now() - lastStrike : Infinity;
      schedule(Math.max(between(FIRST_MIN, FIRST_MAX), GAP_MIN - sinceLast));
    };

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    observer.observe(hero);
    document.addEventListener('visibilitychange', sync);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      clearTimeout(next);
      clearTimeout(restrike);
      clearTimeout(clear);
      bolt.removeAttribute('data-strike');
      sky.removeAttribute('data-strike');
    };
  }, []);

  return (
    <>
      <div ref={skyRef} aria-hidden className="home-sky absolute inset-0 -z-10" />
      {children}
      <svg
        ref={boltRef}
        aria-hidden
        preserveAspectRatio="none"
        className="home-strike absolute inset-0 -z-10 size-full"
      >
        <g className="home-strike-glow">
          <path data-bolt="main" />
          <path data-bolt="forks" />
        </g>
        <g className="home-strike-core">
          <path data-bolt="main" />
          <path data-bolt="forks" />
        </g>
      </svg>
    </>
  );
}
