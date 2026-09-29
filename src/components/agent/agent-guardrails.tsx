'use client';

import { useEffect, useRef } from 'react';

import { agentGuardrailRun, agentGuardrails, type Guardrail } from '@/content/agent';

/**
 * The run's timing, in ms. The card fades in over the first slot and that
 * guardrail checks in at FIRST_LIGHT_MS; each later guardrail takes a move
 * (MOVE_MS, the .agr-card transform transition), a check-in (CHECK_MS, the
 * .agr-status transitions) and a pause (GAP_MS) before the next move, so the
 * first three are checked in about 1.5s and the card reaches the last one.
 */
const FIRST_LIGHT_MS = 150;
const MOVE_MS = 250;
const CHECK_MS = 200;
const GAP_MS = 150;
/** How long the last guardrail waits for a person before the example confirms itself. */
const IDLE_MS = 3000;
const ARMED = '(prefers-reduced-motion: no-preference)';

function GuardrailIcon({ icon }: { icon: Guardrail['icon'] }) {
  const common = { fill: 'none', stroke: '#AEB8C7', strokeWidth: 1.5, strokeLinecap: 'round' as const };
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className="agr-icon shrink-0">
      {icon === 'lock' && (
        <>
          <rect x="5" y="11" width="14" height="9" rx="2" {...common} />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" {...common} />
        </>
      )}
      {icon === 'target' && (
        <>
          <circle cx="12" cy="12" r="8" {...common} />
          <circle cx="12" cy="12" r="3" {...common} />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" {...common} />
        </>
      )}
      {icon === 'doc' && (
        <>
          <path d="M7 4h7l4 4v12H7z" {...common} strokeLinejoin="round" />
          <path d="M14 4v4h4M9.5 13h5M9.5 16h5" {...common} />
        </>
      )}
      {icon === 'check' && (
        <>
          <circle cx="12" cy="12" r="9" {...common} />
          <path d="M8 12.5l2.5 2.5L16 9.5" {...common} strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="agr-check">
      <circle cx="8" cy="8" r="8" />
      <path d="M4.6 8.3l2.2 2.2 4.6-4.9" />
    </svg>
  );
}

/**
 * The four guardrails with one proposed action passing through them: the Heat
 * page's Thursday practice move. When the list scrolls in, the action card
 * docks over each guardrail in turn and that guardrail lights up with a green
 * check and what it checked; at the last one it stops on "Waiting for a
 * person" with a Confirm button. Confirming (or 3s without a click) turns the
 * card green, done and logged, checks the last guardrail and offers Replay.
 *
 * The card sits in the last guardrail's slot in the markup, finished: that is
 * the still state (no JavaScript, reduced motion), every check shown and the
 * action done. Armed, the script lifts it out of flow and moves it slot to
 * slot by measured offsets (--agr-x/--agr-y on the list), so it travels left
 * to right across the row on wide screens and top to bottom where the
 * guardrails stack. States are attributes drawn by styles/agent-guardrails.css:
 * `data-armed` and `data-phase` (run | waiting | done) on the root,
 * `data-lit` on each guardrail.
 */
export function AgentGuardrails() {
  const ref = useRef<HTMLDivElement>(null);
  const run = agentGuardrailRun;
  const last = agentGuardrails.length - 1;

  useEffect(() => {
    const root = ref.current;
    const list = root?.querySelector<HTMLElement>('.agr-list');
    const card = root?.querySelector<HTMLElement>('.agr-card');
    const confirm = root?.querySelector<HTMLButtonElement>('.agr-confirm');
    const replay = root?.querySelector<HTMLButtonElement>('.agr-replay');
    const live = root?.querySelector<HTMLElement>('.agr-live');
    if (!root || !list || !card || !confirm || !replay || !live) return;
    if (!window.matchMedia(ARMED).matches) return;

    const rails = [...list.querySelectorAll<HTMLElement>('.agr-rail')];
    const slots = rails.map((rail) => rail.querySelector<HTMLElement>('.agr-slot')!);
    let timers: number[] = [];
    let step = 0;

    // The card's place over a slot, relative to the list (its positioned ancestor once lifted).
    const place = () => {
      const box = list.getBoundingClientRect();
      const slot = slots[step].getBoundingClientRect();
      list.style.setProperty('--agr-x', `${slot.left - box.left}px`);
      list.style.setProperty('--agr-y', `${slot.top - box.top}px`);
      list.style.setProperty('--agr-w', `${slot.width}px`);
    };
    const moveTo = (next: number) => {
      step = next;
      place();
    };
    const light = (upTo: number) => rails.forEach((rail, i) => rail.toggleAttribute('data-lit', i <= upTo));
    const later = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    const clear = () => {
      timers.forEach(clearTimeout);
      timers = [];
    };

    const finish = () => {
      clear();
      light(last);
      root.dataset.phase = 'done';
      live.textContent = run.done;
      // Confirm is about to hide; keep a keyboard user's place on the button that replaces it.
      if (document.activeElement === confirm) replay.focus();
    };

    const start = () => {
      clear();
      light(-1);
      moveTo(0);
      root.dataset.phase = 'run';
      root.setAttribute('data-hidden', '');
      live.textContent = '';
      // No delay: commit the hidden jump back to the first slot, then fade in.
      void root.offsetWidth;
      root.removeAttribute('data-hidden');
      let at = FIRST_LIGHT_MS;
      rails.forEach((_, i) => {
        if (i > 0) {
          const move = at;
          later(move, () => moveTo(i));
          at = move + MOVE_MS;
        }
        if (i < last) {
          later(at, () => light(i));
          at += CHECK_MS + GAP_MS;
        }
      });
      later(at, () => {
        root.dataset.phase = 'waiting';
        live.textContent = run.waiting;
        later(IDLE_MS, finish);
      });
    };

    // Armed: hold the start (card lifted, nothing lit) until the list scrolls in.
    root.setAttribute('data-armed', '');
    root.setAttribute('data-hidden', '');
    root.dataset.phase = 'run';
    light(-1);
    place();

    const sizer = new ResizeObserver(place);
    sizer.observe(list);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        start();
      },
      { threshold: 0.2 },
    );
    // The guardrails block, a fifth of it in view: on a wide screen that is
    // the top of the row; stacked on a phone, about the first guardrail,
    // where the card starts.
    observer.observe(root);

    const onConfirm = () => {
      if (root.dataset.phase === 'waiting') finish();
    };
    const onReplay = () => {
      start();
      confirm.focus({ preventScroll: true });
    };
    confirm.addEventListener('click', onConfirm);
    replay.addEventListener('click', onReplay);

    return () => {
      clear();
      observer.disconnect();
      sizer.disconnect();
      confirm.removeEventListener('click', onConfirm);
      replay.removeEventListener('click', onReplay);
      root.removeAttribute('data-armed');
      root.removeAttribute('data-hidden');
      delete root.dataset.phase;
      rails.forEach((rail) => rail.removeAttribute('data-lit'));
      ['--agr-x', '--agr-y', '--agr-w'].forEach((name) => list.style.removeProperty(name));
    };
  }, [run, last]);

  return (
    <div ref={ref} className="agr">
      <div className="agr-bar">
        <p className="agr-note">{run.note}</p>
        <button
          type="button"
          className="agr-replay flex h-9 cursor-pointer items-center gap-2 rounded-full border border-white/20 px-4 text-micro font-bold text-[#C9D1E3] hover:border-white/40 hover:text-text-on-dark"
        >
          <span aria-hidden>↻</span> Replay
        </button>
      </div>
      <ol className="agr-list">
        {agentGuardrails.map((g, i) => (
          <li key={g.title} className="agr-rail">
            <div className="agr-slot">
              {i === last && (
                <article className="agr-card" aria-label={`${run.label}: ${run.action} · ${run.tool}`}>
                  <p className="agr-card-label">{run.label}</p>
                  <p className="agr-card-title">
                    {run.action}
                    <span className="agr-card-tool">{run.tool}</span>
                  </p>
                  <div className="agr-card-foot">
                    <button
                      type="button"
                      className="agr-confirm bg-gold-button flex min-h-11 cursor-pointer items-center rounded-full px-5 text-caption leading-4 font-extrabold text-brand-navy"
                    >
                      {run.confirm}
                    </button>
                    <p className="agr-done">
                      <Check />
                      {run.done}
                    </p>
                  </div>
                </article>
              )}
            </div>
            <p className="agr-status">
              <Check />
              <span className="agr-status-text">{run.checks[i]}</span>
              {i === last && <span className="agr-status-wait">{run.waiting}</span>}
            </p>
            <GuardrailIcon icon={g.icon} />
            <h3 className="text-body-l leading-6 font-semibold tracking-heading text-text-on-dark">{g.title}</h3>
            <p className="text-[15px] leading-[23px] text-[#C9D1E3]">{g.body}</p>
          </li>
        ))}
      </ol>
      <p aria-live="polite" className="agr-live sr-only" />
    </div>
  );
}
