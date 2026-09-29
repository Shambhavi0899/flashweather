'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

import type { Card } from '@/content/industries';

/**
 * The construction notification chain, "Who hears the lightning alert, in
 * what order, and how" (styles/alert-chain.css, ac-*).
 *
 * A connector line runs through the steps, left → right from 1280px and top
 * → bottom under it. The first time the steps scroll in, a gold pulse runs
 * the line once, about 3s: each step it reaches lifts, its photo brightens
 * and its channel chip lights with a check; steps ahead of it stay dimmed.
 * Clicking a step (or hovering it with a mouse, once the run is over) sends
 * the pulse there. Replay reruns it.
 *
 * The pulse sits at a position along the chain counted in steps (2.5 is
 * halfway from step 3 to step 4) and is placed from the measured node
 * centres, so the one path works in both directions. Server HTML, no
 * JavaScript and reduced motion get every step lit and no pulse.
 */

/** The pulse fades in on step 1, holds, then takes one leg per step. */
const APPEAR_MS = 200;
const HOLD_MS = 250;
const LEG_MS = 560;
/** A click or hover jump: quicker, and a little longer the further it goes. */
const JUMP_MS = 320;
const JUMP_PER_STEP_MS = 90;
const JUMP_MAX_MS = 640;

type Phase = 'idle' | 'playing' | 'done';
type Point = { x: number; y: number };

const noMotion = '(prefers-reduced-motion: reduce)';
function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia(noMotion);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
const easeOut = (t: number) => 1 - (1 - t) ** 3;

export function AlertChain({ cards }: { cards: Card[] }) {
  const still = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(noMotion).matches,
    () => true,
  );
  const last = cards.length - 1;
  const [phase, setPhase] = useState<Phase>('idle');
  /** The last step the pulse has reached; every step up to it is lit. */
  const [reached, setReached] = useState(-1);
  /** Reduced motion: the step picked by click, highlighted without a pulse. */
  const [picked, setPicked] = useState(-1);

  const lit = still ? last : reached;
  const current = still ? picked : reached;

  const root = useRef<HTMLDivElement>(null);
  const points = useRef<Point[]>([]);
  const pos = useRef(0);
  const reachedRef = useRef(-1);
  const phaseRef = useRef<Phase>('idle');
  const run = useRef(0);
  const frame = useRef(0);
  const timer = useRef(0);

  const setPhaseBoth = (next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  };

  /** Put the pulse (and the fill behind it) at `at` steps along the chain. */
  const place = (at: number) => {
    pos.current = at;
    const block = root.current;
    const pts = points.current;
    if (!block || pts.length < 2) return;
    const i = Math.min(Math.max(Math.floor(at), 0), pts.length - 2);
    const t = at - i;
    block.style.setProperty('--ac-x', `${(pts[i].x + (pts[i + 1].x - pts[i].x) * t).toFixed(1)}px`);
    block.style.setProperty('--ac-y', `${(pts[i].y + (pts[i + 1].y - pts[i].y) * t).toFixed(1)}px`);
  };

  /** Place the pulse and light every step it has reached. */
  const step = (at: number) => {
    place(at);
    const r = Math.floor(at + 0.001);
    if (r !== reachedRef.current) {
      reachedRef.current = r;
      setReached(r);
    }
  };

  const stop = () => {
    run.current += 1;
    cancelAnimationFrame(frame.current);
    clearTimeout(timer.current);
    return run.current;
  };

  /** Move the pulse to `to`; resolves false if another run took over. */
  const tween = (to: number, ms: number, ease: (t: number) => number, id: number) =>
    new Promise<boolean>((resolve) => {
      const from = pos.current;
      const start = performance.now();
      const tick = (now: number) => {
        if (id !== run.current) return resolve(false);
        const t = Math.min(1, (now - start) / ms);
        step(from + (to - from) * ease(t));
        if (t < 1) frame.current = requestAnimationFrame(tick);
        else resolve(true);
      };
      frame.current = requestAnimationFrame(tick);
    });

  const wait = (ms: number, id: number) =>
    new Promise<boolean>((resolve) => {
      timer.current = window.setTimeout(() => resolve(id === run.current), ms);
    });

  const play = async () => {
    const id = stop();
    reachedRef.current = -1;
    setReached(-1);
    place(0);
    setPhaseBoth('playing');
    if (!(await wait(APPEAR_MS, id))) return;
    step(0);
    if (!(await wait(HOLD_MS, id))) return;
    for (let k = 1; k <= last; k++) if (!(await tween(k, LEG_MS, easeInOut, id))) return;
    setPhaseBoth('done');
  };

  const jump = (k: number) => {
    if (still) {
      setPicked(k);
      return;
    }
    const id = stop();
    if (phaseRef.current === 'idle') place(0);
    setPhaseBoth('done');
    const ms = Math.min(JUMP_MAX_MS, JUMP_MS + JUMP_PER_STEP_MS * Math.abs(k - pos.current));
    void tween(k, ms, easeOut, id);
  };

  // Measure the nodes, keep them measured, and run once on first sight.
  useEffect(() => {
    const block = root.current;
    const list = block?.querySelector('ol');
    if (!block || !list || still) return;

    const measure = () => {
      const boxes = [...block.querySelectorAll('.ac-node')].map((node) => node.getBoundingClientRect());
      const [first] = boxes;
      points.current = boxes.map((b) => ({
        x: b.left + b.width / 2 - (first.left + first.width / 2),
        y: b.top + b.height / 2 - (first.top + first.height / 2),
      }));
      place(pos.current);
    };
    const resize = new ResizeObserver(measure);
    resize.observe(block);

    let started = false;
    const sight = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started && phaseRef.current === 'idle') {
          started = true;
          void play();
        }
      },
      { rootMargin: '0px 0px -30% 0px' },
    );
    sight.observe(list);

    return () => {
      resize.disconnect();
      sight.disconnect();
      stop();
      block.style.removeProperty('--ac-x');
      block.style.removeProperty('--ac-y');
    };
    // `play` and `place` are rebuilt every render; this only needs to rerun when motion is switched.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [still]);

  return (
    <div ref={root} className="ac" data-phase={still ? 'still' : phase}>
      <ol className="ac-steps">
        {cards.map((card, i) => (
          <li
            key={card.title ?? i}
            className="ac-step"
            data-state={i <= lit ? 'lit' : 'pending'}
            data-current={i === current ? '' : undefined}
            aria-current={i === current ? 'step' : undefined}
            onPointerEnter={(event) => {
              if (event.pointerType === 'mouse' && phaseRef.current === 'done' && i !== reachedRef.current) jump(i);
            }}
          >
            <span aria-hidden className="ac-node" />
            {i === 0 && (
              <span aria-hidden className="ac-origin">
                <span className="ac-fill" />
                <span className="ac-pulse bg-gold-metallic" />
              </span>
            )}
            <article className="ac-card">
              {card.image && (
                <div className="ac-photo">
                  <Image
                    src={card.image.src}
                    alt={card.image.alt}
                    fill
                    sizes="(min-width: 1280px) 216px, (min-width: 640px) 220px, 100vw"
                    quality={75}
                    className="object-cover"
                  />
                  <div aria-hidden className="industry-photo-grade absolute inset-0" />
                  {card.imageEyebrow && (
                    <p className="absolute right-3 bottom-[10px] left-3 text-micro font-bold tracking-[0.13em] text-viz-gold">
                      {card.imageEyebrow}
                    </p>
                  )}
                </div>
              )}
              <div className="ac-copy">
                {card.kicker && (
                  <p className="text-[11px] leading-[14px] font-bold tracking-[0.16em] text-text-muted xl:min-h-[28px]">
                    {card.kicker}
                  </p>
                )}
                <h3 className="text-[19px] leading-[25px] font-bold tracking-display text-text">
                  <button type="button" className="ac-hit" onClick={() => jump(i)}>
                    {card.title}
                  </button>
                </h3>
                <p className="text-body-s text-text-muted">{card.body}</p>
                {card.meta && (
                  <p className="ac-chip">
                    <svg aria-hidden className="ac-check" viewBox="0 0 12 12">
                      <path d="M2.5 6.4 4.9 8.8 9.6 3.6" pathLength={1} />
                    </svg>
                    {card.meta}
                  </p>
                )}
              </div>
            </article>
          </li>
        ))}
      </ol>
      <div className="ac-foot">
        <button type="button" className="ac-replay" onClick={() => void play()}>
          <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4.4h4.4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Replay
        </button>
      </div>
    </div>
  );
}
