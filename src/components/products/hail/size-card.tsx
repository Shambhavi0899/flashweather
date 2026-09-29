'use client';

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';

import { type SizeClassKey, heroSizeClasses, sizeClassTone } from './content';
import { HailStone } from './hail-stone';
import { ImpactArt } from './impact-art';

/** How long a mouse has to rest on a class before it is selected. */
const HOVER_MS = 80;
/** After a person picks a class, the cycle waits this long without input before it plays on. */
const IDLE_MS = 3000;
/** The cycle starts this long after the last stone has landed (styles/hail-hero.css). */
const LANDED_MS = 800;
/** The class selected with reduced motion, without JavaScript, and on the server. */
const STILL: SizeClassKey = 'damaging';

const STONES: Record<SizeClassKey, { rings: number; seed: number; irregularity: number }> = {
  severe: { rings: 2, seed: 3, irregularity: 0.025 },
  damaging: { rings: 3, seed: 11, irregularity: 0.03 },
  destructive: { rings: 5, seed: 5, irregularity: 0.05 },
};

/** Motion is on unless the reader asks for less; the server renders the still card. */
const MOTION = '(prefers-reduced-motion: no-preference)';
const subscribe = (notify: () => void) => {
  const query = window.matchMedia(MOTION);
  query.addEventListener('change', notify);
  return () => query.removeEventListener('change', notify);
};
const matches = () => window.matchMedia(MOTION).matches;

const ALT =
  'Illustrative hailstones drawn to scale for the severe, damaging and destructive size classes FlashHail alerts on, each on the outline of its National Weather Service size comparison: a penny, a quarter and a hen egg';

/**
 * The hero's "Hail size classes · to scale" card. The stones are drawn to
 * scale (0.75, 1.00 and 2.00 in: 90, 120 and 240 units of a 516-unit row),
 * each resting on a faint, to-scale outline of its NWS comparison.
 *
 * The motion is CSS (styles/hail-hero.css) on the hero's own timings:
 *   intro   as the headline lands, the stones fall in smallest first,
 *           all down within a second, settle with a small squash and a puff
 *           of ice, and each class's labels rise as its stone lands
 *   cycle   one class is active at a time: its stone glows in the class's
 *           colour, the others dim, and the empty corner above the small
 *           stones previews what it does. The active tab's bar fills over
 *           2.5s and, when it ends, the next class takes over, as the
 *           Products role picker does. The bar holds while the hero is off
 *           screen, while a key has focus in the card, and for 3s after a
 *           person picks a class (hover, click, or the arrow keys on the
 *           tabs).
 *
 * The classes are ARIA tabs and the previews their panels. With reduced
 * motion, or before JavaScript, the card shows Damaging, still.
 */
export function SizeCard() {
  const motion = useSyncExternalStore(subscribe, matches, () => false);
  /** The class a person or the cycle has picked; until then the smallest with motion, Damaging without. */
  const [picked, setPicked] = useState<SizeClassKey | null>(null);
  const [landed, setLanded] = useState(false);
  const card = useRef<HTMLElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const hover = useRef(0);
  const idle = useRef(0);
  const base = useId();

  const active = picked ?? (motion ? 'severe' : STILL);
  // With motion, no class is shown as selected until the stones are down.
  const intro = motion && !landed && !picked;

  useEffect(() => {
    if (!motion) return;
    // The stones fall on CSS time, from the first paint: what is left of the longest fall.
    const falls = (card.current?.getAnimations({ subtree: true }) ?? []).filter(
      (animation) => animation instanceof CSSAnimation && animation.animationName === 'hail-drop',
    );
    const left = falls.map(
      (fall) => Number(fall.effect?.getComputedTiming().endTime ?? 0) - Number(fall.currentTime ?? 0),
    );
    const done = window.setTimeout(() => setLanded(true), Math.max(0, ...left) + LANDED_MS);
    return () => clearTimeout(done);
  }, [motion]);

  useEffect(
    () => () => {
      clearTimeout(hover.current);
      clearTimeout(idle.current);
    },
    [],
  );

  /** A person is choosing: the cycle holds until they have left it alone for 3s. */
  const hold = () => {
    const el = card.current;
    if (!el) return;
    el.setAttribute('data-hold', '');
    clearTimeout(idle.current);
    idle.current = window.setTimeout(() => el.removeAttribute('data-hold'), IDLE_MS);
  };

  const pick = (key: SizeClassKey, focus = false) => {
    setPicked(key);
    hold();
    if (focus) tabs.current[heroSizeClasses.findIndex((c) => c.key === key)]?.focus();
  };

  const next = (key: SizeClassKey, step: number) => {
    const i = heroSizeClasses.findIndex((c) => c.key === key);
    return heroSizeClasses[(i + step + heroSizeClasses.length) % heroSizeClasses.length].key;
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (step) pick(next(active, step), true);
    else if (event.key === 'Home') pick(heroSizeClasses[0].key, true);
    else if (event.key === 'End') pick(heroSizeClasses[heroSizeClasses.length - 1].key, true);
    else return;
    event.preventDefault();
  };

  /** Mouse only: resting on a stone or a tab picks it, after a beat. */
  const hoverProps = (key: SizeClassKey) => ({
    onPointerEnter: (event: React.PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      clearTimeout(hover.current);
      hover.current = window.setTimeout(() => pick(key), HOVER_MS);
    },
    onPointerLeave: () => clearTimeout(hover.current),
  });

  const tabId = (key: SizeClassKey) => `${base}-tab-${key}`;
  const panelId = (key: SizeClassKey) => `${base}-panel-${key}`;

  return (
    <figure
      ref={card}
      data-intro={intro ? '' : undefined}
      className="hail-card flex w-full max-w-[572px] flex-col overflow-clip rounded-[20px] border border-white/10 bg-[#040818C7] p-5 shadow-[0_30px_80px_#00000073] backdrop-blur-md sm:p-7"
      onPointerMove={() => {
        if (card.current?.hasAttribute('data-hold')) hold();
      }}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <p className="text-[11px] leading-[14px] font-semibold tracking-label text-[#8F9AB8] uppercase">
          Hail size classes · to scale
        </p>
        <p className="text-micro text-text-on-dark-muted uppercase">Illustrative example · not live weather</p>
      </div>

      <div className="hail-stage">
        <svg role="img" aria-label={ALT} viewBox="0 0 516 276" className="hail-pads">
          <Penny cx={45} />
          <Quarter cx={183} />
          <HenEgg cx={396} />
        </svg>

        {heroSizeClasses.map((c) => (
          <div
            key={c.key}
            aria-hidden
            data-class={c.key}
            data-on={active === c.key ? '' : undefined}
            className="hail-slot"
            onClick={() => pick(c.key)}
            {...hoverProps(c.key)}
          >
            <span className="hail-shadow" />
            <span className="hail-halo" />
            <span className="hail-drop">
              <HailStone className="hail-stone" {...STONES[c.key]} />
            </span>
            <span className="hail-puff">
              {Array.from({ length: 7 }, (_, i) => (
                <span key={i} />
              ))}
            </span>
          </div>
        ))}

        {heroSizeClasses.map((c) => (
          <span key={c.key} aria-hidden data-class={c.key} className="hail-compare">
            {c.comparison}
          </span>
        ))}

        <div className="hail-preview">
          {heroSizeClasses.map((c) => (
            <div
              key={c.key}
              role="tabpanel"
              id={panelId(c.key)}
              aria-labelledby={tabId(c.key)}
              data-class={c.key}
              data-on={active === c.key ? '' : undefined}
              className="hail-impact"
            >
              <p className="hail-impact-caption">
                <span className={sizeClassTone[c.key].onDark}>{c.impact.surface}</span>
                <span className="hail-impact-mark"> · {c.impact.mark}</span>
              </p>
              <ImpactArt kind={c.key} />
            </div>
          ))}
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Hail size classes"
        className="grid grid-cols-3 gap-3 border-t border-white/10"
        onKeyDown={onKeyDown}
      >
        {heroSizeClasses.map((c, i) => (
          <button
            key={c.key}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={tabId(c.key)}
            aria-selected={active === c.key}
            aria-controls={panelId(c.key)}
            tabIndex={active === c.key ? 0 : -1}
            data-class={c.key}
            className="hail-tab flex flex-col gap-1 pt-4 text-left"
            onClick={() => pick(c.key)}
            {...hoverProps(c.key)}
          >
            <span className="hail-tab-size text-h4 leading-h4 font-bold tracking-display text-white sm:text-h3">{c.size}</span>
            <span className={`text-[11px] leading-[14px] font-bold tracking-label uppercase ${sizeClassTone[c.key].onDark}`}>
              {c.label}
            </span>
            <span className="text-micro text-text-on-dark-muted">{c.note}</span>
            <span
              aria-hidden
              className="hail-progress"
              onAnimationEnd={(event) => {
                if (event.animationName === 'hail-progress') setPicked(next(c.key, 1));
              }}
            />
          </button>
        ))}
      </div>
    </figure>
  );
}

/* ------------------------------------------------ The NWS comparisons */
/* Faint outlines on the ground line (y 236), to the stones' scale, seen
   from a little above: a coin is an ellipse with a rim and an edge. */

const GROUND = 236;

/** A coin of radius `r` (units), seen from a little above. */
function Coin({ cx, r, reeded = false }: { cx: number; r: number; reeded?: boolean }) {
  const ry = r * 0.2;
  const edge = 3;
  return (
    <g className="hail-pad">
      <path
        d={`M${cx - r} ${GROUND}v${edge}A${r} ${ry} 0 0 0 ${cx + r} ${GROUND + edge}v${-edge}`}
        className="hail-pad-line"
      />
      {reeded && (
        <path
          d={`M${cx - r} ${GROUND + edge / 2}A${r} ${ry} 0 0 0 ${cx + r} ${GROUND + edge / 2}`}
          className="hail-pad-reeding"
          strokeWidth={edge}
        />
      )}
      <ellipse cx={cx} cy={GROUND} rx={r} ry={ry} className="hail-pad-line" />
      <ellipse cx={cx} cy={GROUND} rx={r - 5} ry={ry - 1.2} className="hail-pad-rim" />
    </g>
  );
}

function Penny({ cx }: { cx: number }) {
  return <Coin cx={cx} r={45} />;
}

/** NWS puts a quarter at 1.00 in. */
function Quarter({ cx }: { cx: number }) {
  return <Coin cx={cx} r={60} reeded />;
}

/** A hen egg on its side, 2.00 in long, blunt end to the right. */
function HenEgg({ cx }: { cx: number }) {
  const n = 48;
  const points = Array.from({ length: n }, (_, i) => {
    const t = (i / n) * Math.PI * 2;
    // An egg's profile: the half-width swells towards the blunt end.
    const x = cx + 120 * Math.cos(t);
    const y = GROUND + 16 * Math.sin(t) * (1 + 0.4 * Math.cos(t));
    return `${Math.round(x * 10) / 10} ${Math.round(y * 10) / 10}`;
  });
  return (
    <g className="hail-pad">
      <path d={`M${points.join('L')}Z`} className="hail-pad-line" />
    </g>
  );
}
