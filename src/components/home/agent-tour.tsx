'use client';

import { useEffect, useRef } from 'react';

/** How long a finished conversation stays up before the tour moves on. */
const DWELL_MS = 3000;
/** How long after the visitor's last move the tour takes over again. */
const IDLE_MS = 10000;

/**
 * The tour of "Ask the question your crew actually asks" (agent-section.tsx,
 * styles/agent-tour.css). It sits inside the section's <AgentChat>, which
 * still plays every conversation; this only decides which one is next, and
 * keeps the question list in step.
 *
 * The tour: when the open tab's conversation starts playing (`chat:playing`
 * from <AgentChat>, which carries the play's length), a gold line under that
 * tab starts filling, over the play plus three seconds. When it is full the
 * next tab opens, which plays its conversation, and so on round the five and
 * back to the first. It starts wherever the section opens: the first tab on
 * the home page, an industry page's own tab there.
 *
 * The line is the clock, so holding the line holds the tour: it pauses while
 * the conversation is off screen or the browser tab is hidden, and picks up
 * with three seconds left if the conversation finished meanwhile.
 *
 * A click on a tab or a question, a tab picked from the keyboard, or Replay
 * stops the tour (`data-tour="off"`: the open tab's line is simply gold).
 * Ten seconds after the visitor's last move in the section it takes over
 * again from the open tab: it moves on after three seconds if that tab's own
 * conversation is what is showing, and plays it first if not.
 *
 * The list: the open tab's first question is the one its conversation
 * answers, and is marked (`aria-current`) whenever that tab opens or plays.
 * A click on it plays the conversation again. Every other question has no
 * prepared answer; <AgentChat> types it into the composer, unsent, under the
 * demo note (`data-chat-ask`), and here it is marked and the conversation
 * above it dimmed (`data-asking`), since that is not its answer.
 *
 * With reduced motion there is no tour and no line; the clicks work the same.
 */
export function AgentTour({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const radios = [...root.querySelectorAll<HTMLInputElement>('input[type="radio"]')];
    const panels = [...root.querySelectorAll<HTMLElement>('[data-chat-panel]')];
    const lists = [...root.querySelectorAll<HTMLElement>('[data-tour-list]')];
    const stage = root.querySelector<HTMLElement>('[data-chat-stage]') ?? root;

    const open = () => radios.find((radio) => radio.checked) ?? radios[0];
    const panelOf = (radio: HTMLInputElement) => panels[radios.indexOf(radio)];
    const listOf = (radio: HTMLInputElement) => lists.find((list) => list.dataset.tourList === radio.value);
    const firstOf = (radio: HTMLInputElement) => listOf(radio)?.querySelector<HTMLElement>('[data-tour-query]');

    /** Mark one question of its list, and bring it into view where the list scrolls (below lg). */
    const mark = (query?: HTMLElement | null) => {
      const list = query?.closest<HTMLElement>('[data-tour-list]');
      if (!query || !list) return;
      list.querySelectorAll('[aria-current]').forEach((other) => other.removeAttribute('aria-current'));
      query.setAttribute('aria-current', 'true');
      root.toggleAttribute('data-asking', query.hasAttribute('data-chat-ask'));
      if (list.scrollWidth > list.clientWidth) {
        const item = query.parentElement ?? query;
        list.scrollTo({
          left: item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2,
          behavior: reduced ? 'auto' : 'smooth',
        });
      }
    };

    let touring = !reduced;
    let byTour = false;
    let line: Animation | null = null;
    let playMs = 0; // the conversation's share of the line
    let idle = 0;
    let lastMove = 0;
    let visible = false;

    const held = () => !visible || document.hidden;
    const show = () => {
      root.dataset.tour = touring ? 'on' : 'off';
    };
    const dropLine = () => {
      line?.cancel();
      line = null;
    };

    const next = () => {
      if (!touring) return;
      const radio = radios[(radios.indexOf(open()) + 1) % radios.length];
      byTour = true;
      radio.checked = true;
      radio.dispatchEvent(new Event('change', { bubbles: true })); // <AgentChat> plays it
      byTour = false;
    };

    /** The open tab's line: a conversation of `ms`, then the dwell, then the next tab. */
    const runLine = (ms: number) => {
      dropLine();
      const fill = open().closest('label')?.querySelector<HTMLElement>('[data-tour-fill]');
      if (!fill) return;
      playMs = ms;
      line = fill.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], {
        duration: ms + DWELL_MS,
        easing: 'linear',
        fill: 'forwards',
      });
      line.onfinish = next;
      if (held()) line.pause();
    };

    /** Hold or release the line. A conversation that finished while it was held leaves just the dwell. */
    const sync = () => {
      if (!line) return;
      if (held()) return line.pause();
      if (panelOf(open())?.dataset.chat === 'done' && Number(line.currentTime) < playMs) line.currentTime = playMs;
      line.play();
    };

    const resume = () => {
      touring = true;
      show();
      const radio = open();
      const first = firstOf(radio);
      const showingFirst =
        first?.getAttribute('aria-current') === 'true' &&
        !root.hasAttribute('data-asking') &&
        panelOf(radio)?.dataset.chat !== 'play';
      if (showingFirst) return runLine(0);
      mark(first);
      root.dispatchEvent(new Event('chat:play', { bubbles: true })); // plays, then `chat:playing` starts the line
    };

    const takeOver = () => {
      touring = false;
      dropLine();
      show();
      clearTimeout(idle);
      if (!reduced) idle = window.setTimeout(resume, IDLE_MS);
    };

    const onPlaying = (event: Event) => {
      mark(firstOf(open()));
      if (touring) runLine(Number((event as CustomEvent<number>).detail) || 0);
    };
    const onChange = (event: Event) => {
      const radio = event.target as HTMLInputElement;
      if (!radio.checked) return;
      dropLine();
      mark(firstOf(radio));
      if (!byTour) takeOver();
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const query = target.closest<HTMLElement>('[data-tour-query]');
      if (query) {
        takeOver();
        mark(query);
        // The answered question plays its conversation again; <AgentChat> types the others in.
        if (!query.hasAttribute('data-chat-ask')) root.dispatchEvent(new Event('chat:play', { bubbles: true }));
      } else if (target.closest('label, [data-chat-replay]')) {
        takeOver();
      }
    };
    /** While the visitor is in control, any move in the section pushes the tour's return back. */
    const onMove = () => {
      const now = performance.now();
      if (touring || now - lastMove < 500) return;
      lastMove = now;
      clearTimeout(idle);
      if (!reduced) idle = window.setTimeout(resume, IDLE_MS);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.3 },
    );
    observer.observe(stage);

    show();
    root.addEventListener('chat:playing', onPlaying);
    root.addEventListener('change', onChange);
    root.addEventListener('click', onClick);
    root.addEventListener('pointermove', onMove, { passive: true });
    root.addEventListener('keydown', onMove);
    root.addEventListener('touchstart', onMove, { passive: true });
    document.addEventListener('visibilitychange', sync);

    return () => {
      observer.disconnect();
      clearTimeout(idle);
      dropLine();
      root.removeEventListener('chat:playing', onPlaying);
      root.removeEventListener('change', onChange);
      root.removeEventListener('click', onClick);
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('keydown', onMove);
      root.removeEventListener('touchstart', onMove);
      document.removeEventListener('visibilitychange', sync);
      root.removeAttribute('data-tour');
      radios.forEach((radio) => mark(firstOf(radio)));
      root.removeAttribute('data-asking');
    };
  }, []);

  return (
    <div ref={ref} className="agent-tour contents">
      {children}
    </div>
  );
}
