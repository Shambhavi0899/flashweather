'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

import type { IndustrySection, ScoreboardCell } from '@/content/industries';
import { onScrollFrame } from '@/lib/scroll';

type Timeline = Extract<IndustrySection, { type: 'timeline' }>;

/**
 * A column timeline with a scoreboard (styles/industry-scoreboard.css, sb-*):
 * the board and the photo card pinned on the left while the entries scroll
 * past on the right, the board showing the state of the entry in view. Each
 * value that changes flips like a split-flap board. Under 1024px the board is
 * a compact bar pinned under the header.
 *
 * The entry in view is the last one whose top has crossed a line across the
 * screen, read on the shared scroll loop. Server HTML, no JavaScript and
 * reduced motion get the final state, every entry in full and nothing
 * pinned. The same queries switch the layout in the stylesheet, so the two
 * must match.
 */
const LIVE = '(prefers-reduced-motion: no-preference) and (scripting: enabled)';

type Mode = 'live' | 'still';

const subscribe = (notify: () => void) => {
  const query = window.matchMedia(LIVE);
  query.addEventListener('change', notify);
  return () => query.removeEventListener('change', notify);
};
const currentMode = (): Mode => (window.matchMedia(LIVE).matches ? 'live' : 'still');

/** The line an entry crosses to become the one in view, as a share of the screen's height. */
const LINE = 0.5;
/** How much scroll the last entry gets before the board lets go. */
const LAST_ROOM = 56;
/** The line never sits lower than this share of the screen. */
const LINE_MAX = 0.8;

export function PracticeScoreboard({
  scoreboard,
  steps,
  label,
  media,
}: {
  scoreboard: NonNullable<Timeline['scoreboard']>;
  steps: Timeline['steps'];
  label: string;
  media?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mode = useSyncExternalStore(subscribe, currentMode, () => 'still' as const);
  const last = steps.length - 1;
  const [inView, setInView] = useState(0);
  /** The first reading places the board; only a change after it flips. */
  const [placed, setPlaced] = useState(false);
  const live = mode === 'live';
  const active = live ? inView : last;

  useEffect(() => {
    const root = ref.current;
    if (!root || mode !== 'live') return;
    const entries = [...root.querySelectorAll<HTMLElement>('.sb-step')];
    const list = root.querySelector<HTMLElement>('.sb-steps');
    if (!list || entries.length === 0) return;

    const read = () => {
      const height = window.innerHeight;
      // Whichever is pinned: the column from 1024px, the bar under it.
      const pinned = [...root.querySelectorAll<HTMLElement>('.sb-stick, .sb-bar')].find(
        (element) => getComputedStyle(element).position === 'sticky',
      );
      let line = height * LINE;
      if (pinned) {
        // Where the last entry's top is when the pinned board lets go: it has to cross the line before that.
        const release = parseFloat(getComputedStyle(pinned).top) + pinned.offsetHeight;
        const lastTop = release - (list.offsetHeight - entries[entries.length - 1].offsetTop + list.offsetTop);
        line = Math.min(height * LINE_MAX, Math.max(line, lastTop + LAST_ROOM));
      }
      let index = 0;
      entries.forEach((entry, i) => {
        if (entry.getBoundingClientRect().top <= line) index = i;
      });
      setInView(index);
      setPlaced(true);
    };
    const stop = onScrollFrame(read);
    return () => {
      stop();
      setPlaced(false);
    };
  }, [mode]);

  const state = scoreboard.states[active];
  /** The note is a lamp on the board: always there, lit by the state that carries it. */
  const note = scoreboard.states.find((entry) => entry.note)?.note;
  const flips = live && placed;

  return (
    <div ref={ref} className="sb" data-mode={mode}>
      <div className="sb-stick">
        <div className="sb-bar">
          <div className="sb-board" role="group" aria-label={`${scoreboard.title} scoreboard`}>
            <p className="sb-title">{scoreboard.title}</p>
            <dl className="sb-rows">
              {scoreboard.rows.map((row, i) => {
                const cell: ScoreboardCell = i === 0 ? steps[active].time : (state.cells[i - 1] ?? '');
                const toned = typeof cell === 'string' ? null : cell;
                return (
                  <div key={row} className="sb-row" data-row={i}>
                    <dt className="sb-label">{row}</dt>
                    <dd className="sb-value" data-tone={toned?.tone}>
                      {toned && <span aria-hidden className="sb-lamp" />}
                      <Flap text={toned ? toned.text : (cell as string)} compact={toned?.compact} flips={flips} />
                    </dd>
                  </div>
                );
              })}
            </dl>
            {note && (
              <p className="sb-note" data-on={state.note ? '' : undefined} aria-hidden={state.note ? undefined : true}>
                <svg aria-hidden className="sb-check" viewBox="0 0 16 16">
                  <path
                    d="M4.5 8.3l2.3 2.3 4.7-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="sb-note-text">{note}</span>
              </p>
            )}
          </div>
        </div>
        {media}
      </div>

      <ol className="sb-steps" aria-label={label}>
        {steps.map((step, i) => (
          <li
            key={step.time}
            className="sb-step"
            data-tone={step.tone ?? 'info'}
            data-state={i === active ? 'active' : i < active ? 'past' : 'next'}
          >
            <p className="sb-step-time text-body-s font-semibold text-text lg:text-body lg:leading-[26px]">{step.time}</p>
            <span aria-hidden className="sb-step-rail">
              <span className="sb-step-dot" />
              {i < last && <span className="sb-step-line" />}
            </span>
            <div className="sb-step-copy">
              <h3 className="text-body-s leading-body-s font-semibold text-text md:text-body lg:text-body-l lg:leading-[26px]">
                {step.title}
              </h3>
              <p className="text-body-s text-text-muted lg:text-body">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * One value on the board. When its text changes (and `flips` is on) the old
 * text's top leaf falls away over the new one and the new bottom leaf lands
 * over the old: three leaves laid over the value, gone once the last lands.
 */
function Flap({ text, compact, flips }: { text: string; compact?: string; flips: boolean }) {
  const [shown, setShown] = useState({ text, compact, was: null as null | { text: string; compact?: string } });
  if (shown.text !== text) {
    setShown({ text, compact, was: flips ? { text: shown.text, compact: shown.compact } : null });
  }
  const { was } = shown;
  /** The landing leaf is the last to finish. */
  const settle = (event: React.AnimationEvent) => {
    if (event.animationName === 'sb-leaf-land') setShown((now) => (now.was ? { ...now, was: null } : now));
  };

  return (
    <span className="sb-flap" data-flip={was ? '' : undefined}>
      <span className="sb-flap-now">
        <FlapText text={text} compact={compact} />
      </span>
      {was && (
        <span key={text} aria-hidden onAnimationEnd={settle}>
          <span className="sb-flap-leaf" data-leaf="was-bottom">
            <FlapText text={was.text} compact={was.compact} />
          </span>
          <span className="sb-flap-leaf" data-leaf="was-top">
            <FlapText text={was.text} compact={was.compact} />
          </span>
          <span className="sb-flap-leaf" data-leaf="now-bottom">
            <FlapText text={text} compact={compact} />
          </span>
        </span>
      )}
    </span>
  );
}

/** The text, or the full text from 1024px and the compact one on the bar under it. */
function FlapText({ text, compact }: { text: string; compact?: string }) {
  if (!compact) return text;
  return (
    <>
      <span className="sb-full">{text}</span>
      <span className="sb-compact">{compact}</span>
    </>
  );
}
