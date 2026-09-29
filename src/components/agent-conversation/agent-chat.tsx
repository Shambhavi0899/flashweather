'use client';

import { useEffect, useRef } from 'react';

import { scrollToCentre, scrollToY } from '@/lib/scroll';

/**
 * Plays Flash Agent conversations: the one interaction every agent interface
 * on the site shares. The panel is <AgentConversation> (./agent-conversation.tsx)
 * or a smaller card that uses the same `chat-*` hooks (the home hero, the
 * platform exchange, the Lightning spec card). The panels arrive finished
 * (server-rendered, every tab in the HTML), so without JavaScript or with
 * reduced motion each one simply shows its final state.
 *
 * One timeline per play, driven here and drawn by global CSS (styles/home.css):
 * the panel gets `data-chat` (play | done) and `data-steps`, the list of steps
 * reached (typing sent thinking badge chart chips actions), which the `chat-*`
 * rules key off (styles/agent-conversation.css). A panel without a
 * `.chat-chart` skips the chart step. The two things CSS cannot schedule are done here as text and
 * class changes: the query typing into the composer, and the answer's words
 * arriving one by one (`is-in`).
 *
 * With tabs (radios inside the wrapper), the open tab's panel plays when it
 * scrolls in (after `startDelay` ms, if given), and picking a tab cancels
 * whatever is playing and plays that one. A tab's panel is the one whose
 * `data-chat-for` names the radio's id, or else the panel at the radio's
 * index; a tab with no panel just stops the playback. Without tabs, every
 * panel is held empty and they play one after the other, never together.
 * Replay plays the panel again, and so does hovering a finished panel that
 * carries `data-chat-hover`.
 *
 * A question chip (`[data-chat-ask]`, its text in the attribute) types that
 * question into the open panel's composer and leaves it there, unsent: the
 * panel settles, the text types in, and the panel gets `data-asked`, which
 * shows the panel's ask note. `data-chat-ask-tab` names a tab radio to open
 * first, silently, so that tab's answer is shown finished, not replayed. This
 * also works with reduced motion, where the text simply appears. A chip for a
 * question a tab answers (`[data-chat-tab]`, the radio's id) opens that tab
 * instead, which plays its conversation, and brings the tabs into view.
 *
 * It also keeps the stage (`[data-chat-stage]`) at the open panel's height,
 * measured, so a tab change eases between two content heights (the
 * transition is in CSS), and scrolls the picked tab into view where the tab
 * row scrolls (below lg).
 */

/** Step start times, ms from the moment the query is sent (the dots show thinking → badge, ~0.8s). */
const AFTER_SEND = { thinking: 350, badge: 1150, answer: 1300 } as const;
const ANSWER_MS = 1300; // the whole answer streams in this long, however many words
const CHART_MS = 1100; // bars grow / lines draw, then limits and labels fade
const CHIPS_MS = 400;
const ACTIONS_MS = 600;

/** Where a tab row scrolled into view sits: clear of the fixed header. */
const TAB_ROW_OFFSET = 112;

/** Type at ~22ms a character, kept between 0.9s and 1.7s. */
const typeDuration = (text: string) => Math.min(1700, Math.max(900, text.length * 22));

export function AgentChat({
  className,
  startDelay = 0,
  children,
}: {
  className: string;
  /** Hold the first play this long after it scrolls in, as the home hero does. */
  startDelay?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const panels = [...root.querySelectorAll<HTMLElement>('[data-chat-panel]')];
    const radios = [...root.querySelectorAll<HTMLInputElement>('input[type="radio"]')];
    const linked = panels.some((panel) => panel.dataset.chatFor);
    const panelFor = (radio?: HTMLInputElement) =>
      !radio
        ? undefined
        : linked
          ? panels.find((panel) => panel.dataset.chatFor === radio.id)
          : panels[radios.indexOf(radio)];
    const stage = root.querySelector<HTMLElement>('[data-chat-stage]');
    const tabs = root.querySelector<HTMLElement>('[data-chat-tabs]');

    // The stage follows the open panel's height: set once now, again whenever
    // that panel's content reflows (fonts, viewport), and on every tab change.
    const sizer = new ResizeObserver(([entry]) => {
      stage?.style.setProperty('--chat-height', `${entry.target.getBoundingClientRect().height}px`);
    });
    const follow = (panel?: HTMLElement) => {
      sizer.disconnect();
      if (panel) sizer.observe(panel);
    };

    // Below lg the tab row scrolls; keep the picked tab centred in it.
    const reveal = (radio?: HTMLInputElement) => {
      const label = radio?.closest<HTMLElement>('label');
      if (!tabs || !label || tabs.scrollWidth <= tabs.clientWidth) return;
      tabs.scrollTo({ left: label.offsetLeft - (tabs.clientWidth - label.offsetWidth) / 2, behavior: 'smooth' });
    };

    let frame = 0;
    let playing: HTMLElement | null = null;
    // Without tabs, the panels still to play after this one, in order.
    let queue: HTMLElement[] = [];
    let seen = false;
    let delayed = 0;

    /** Back to the finished state: every attribute and class the play added, removed. */
    const settle = (panel: HTMLElement) => {
      delete panel.dataset.chat;
      delete panel.dataset.steps;
      panel.removeAttribute('data-typing');
      panel.removeAttribute('data-asked');
      panel.querySelectorAll('.chat-word.is-in').forEach((w) => w.classList.remove('is-in'));
      panel.querySelectorAll<HTMLElement>('[data-chat-typed], [data-chat-asked-live]').forEach((el) => {
        el.textContent = '';
      });
    };

    // Stopping early (a Replay mid-sequence) shows the panels still waiting finished.
    const cancel = () => {
      cancelAnimationFrame(frame);
      queue.forEach(settle);
      queue = [];
      if (playing) settle(playing);
      playing = null;
    };

    const play = (panel?: HTMLElement) => {
      cancel();
      if (!panel) return;
      settle(panel); // a finished or earlier-played panel starts from zero too
      playing = panel;

      const typed = panel.querySelector<HTMLElement>('[data-chat-typed]');
      const text = typed?.dataset.text ?? '';
      const words = [...panel.querySelectorAll<HTMLElement>('.chat-word')];
      const typeMs = typeDuration(text);
      const sent = typeMs + 150;
      const at = {
        thinking: sent + AFTER_SEND.thinking,
        badge: sent + AFTER_SEND.badge,
        answer: sent + AFTER_SEND.answer,
      };
      const hasChart = Boolean(panel.querySelector('.chat-chart'));
      const chart = at.answer + ANSWER_MS * 0.6;
      const chips = hasChart ? chart + CHART_MS : at.answer + ANSWER_MS;
      const actions = chips + CHIPS_MS;
      const done = actions + ACTIONS_MS;
      const perWord = ANSWER_MS / Math.max(1, words.length);

      panel.dataset.chat = 'play';
      panel.dataset.steps = '';
      panel.setAttribute('data-typing', '');
      let shownWords = 0;
      const start = performance.now();

      const tick = (now: number) => {
        const t = now - start;
        const steps: string[] = [];
        if (t < sent) {
          const chars = Math.round(text.length * Math.min(1, t / typeMs));
          if (typed && typed.textContent?.length !== chars) typed.textContent = text.slice(0, chars);
        } else {
          steps.push('sent');
          if (panel.hasAttribute('data-typing')) {
            panel.removeAttribute('data-typing');
            if (typed) typed.textContent = '';
          }
        }
        if (t >= at.thinking) steps.push('thinking');
        if (t >= at.badge) steps.push('badge');
        if (t >= at.answer) {
          const due = Math.min(words.length, Math.floor((t - at.answer) / perWord) + 1);
          for (; shownWords < due; shownWords++) words[shownWords].classList.add('is-in');
        }
        if (hasChart && t >= chart) steps.push('chart');
        if (t >= chips) steps.push('chips');
        if (t >= actions) steps.push('actions');
        const list = steps.join(' ');
        if (panel.dataset.steps !== list) panel.dataset.steps = list;

        if (t >= done) {
          panel.dataset.chat = 'done';
          playing = null;
          const [next, ...rest] = queue;
          queue = [];
          if (next) {
            play(next);
            queue = rest;
          }
          return;
        }
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const checked = () => radios.find((r) => r.checked);
    const current = () => (radios.length ? panelFor(checked()) : panels[0]);

    /** A question chip: open its tab without a replay, then type the question in, unsent. */
    const ask = (chip: HTMLElement) => {
      seen = true; // nothing may start playing over the asked question
      const radio = radios.find((r) => r.id === chip.dataset.chatAskTab);
      if (radio && !radio.checked) {
        radio.checked = true; // no change event, so the worked answer does not replay
        follow(panelFor(radio));
        reveal(radio);
      }
      const panel = panels.find((p) => p.checkVisibility());
      const typed = panel?.querySelector<HTMLElement>('[data-chat-typed]');
      if (!panel || !typed) return;
      cancel();
      panels.forEach(settle); // the open panel, and any still held for a first play

      const text = chip.dataset.chatAsk ?? '';
      const live = panel.querySelector<HTMLElement>('[data-chat-asked-live]');
      const finish = () => {
        typed.textContent = text;
        panel.setAttribute('data-asked', '');
        if (live) live.textContent = `Typed into the Flash Agent chat bar: ${text}`;
      };

      const composer = typed.closest<HTMLElement>('.chat-composer') ?? typed;
      const box = composer.getBoundingClientRect();
      const offScreen = box.top < 0 || box.bottom > window.innerHeight;
      if (reduced) {
        if (offScreen) composer.scrollIntoView({ block: 'center' });
        return finish();
      }
      if (offScreen) scrollToCentre(composer);
      panel.setAttribute('data-typing', ''); // stays on after typing: the caret keeps blinking
      const typeMs = typeDuration(text);
      const start = performance.now();
      const tick = (now: number) => {
        const t = now - start;
        typed.textContent = text.slice(0, Math.round(text.length * Math.min(1, t / typeMs)));
        if (t < typeMs) frame = requestAnimationFrame(tick);
        else finish();
      };
      frame = requestAnimationFrame(tick);
    };
    /** A chip for a question a tab answers: open that tab (its change event plays it) and show it. */
    const open = (chip: HTMLElement) => {
      const radio = radios.find((r) => r.id === chip.dataset.chatTab);
      if (!radio) return;
      if (!radio.checked) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
      }
      const row = tabs ?? root;
      const top = row.getBoundingClientRect().top;
      if (top >= 0 && top < window.innerHeight * 0.5) return;
      const y = window.scrollY + top - TAB_ROW_OFFSET;
      if (reduced) window.scrollTo(0, y);
      else scrollToY(y);
    };
    const onAsk = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const chip = target.closest<HTMLElement>('[data-chat-ask]');
      if (chip) return ask(chip);
      const tab = target.closest<HTMLElement>('[data-chat-tab]');
      if (tab) open(tab);
    };
    root.addEventListener('click', onAsk);

    // Reduced motion: nothing plays; the panels stay finished and only a question chip acts.
    // A tab change still clears a question a chip typed in, so no tab opens on another's leftovers.
    if (reduced) {
      const onTab = () => panels.forEach(settle);
      root.addEventListener('change', onTab);
      return () => {
        root.removeEventListener('click', onAsk);
        root.removeEventListener('change', onTab);
        panels.forEach(settle);
      };
    }

    follow(current());
    reveal(checked());

    /** The first play: the open tab's panel, or every panel in turn. */
    const start = () => {
      if (radios.length) return play(current());
      play(panels[0]);
      queue = panels.slice(1);
    };

    // Hold what will play at the start until it scrolls in -- unless it is
    // already on screen, where it simply plays. Side-by-side panels all wait.
    const hold = (panel: HTMLElement) => {
      panel.dataset.chat = 'play';
      panel.dataset.steps = '';
    };
    const first = current();
    if (first && (startDelay > 0 || first.getBoundingClientRect().top > window.innerHeight)) hold(first);
    if (!radios.length) panels.slice(1).forEach(hold);

    // Watch the panel itself where it is known: a tab group can be much
    // taller than its conversation (a question list above it on a phone).
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !seen) {
          seen = true;
          observer.disconnect();
          if (startDelay > 0) delayed = window.setTimeout(start, startDelay);
          else start();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(first ?? root);

    const onChange = (event: Event) => {
      const radio = event.target as HTMLInputElement;
      if (radio.checked) {
        seen = true;
        clearTimeout(delayed);
        const panel = panelFor(radio);
        // A panel still held empty for its first play (the tab changed before
        // it scrolled in) is released too, so no tab ever opens on a blank panel.
        panels.forEach((other) => {
          if (other !== panel) settle(other);
        });
        follow(panel);
        reveal(radio);
        play(panel);
      }
    };
    const onClick = (event: MouseEvent) => {
      const button = (event.target as HTMLElement).closest('[data-chat-replay]');
      if (button) play(button.closest<HTMLElement>('[data-chat-panel]') ?? undefined);
    };
    // pointerenter, not over: it fires once per visit, not per child crossed.
    const hoverPanels = panels.filter((panel) => panel.hasAttribute('data-chat-hover'));
    const onEnter = (event: PointerEvent) => {
      const panel = event.currentTarget as HTMLElement;
      if (event.pointerType === 'mouse' && panel.dataset.chat === 'done') play(panel);
    };
    root.addEventListener('change', onChange);
    root.addEventListener('click', onClick);
    hoverPanels.forEach((panel) => panel.addEventListener('pointerenter', onEnter));

    return () => {
      observer.disconnect();
      root.removeEventListener('click', onAsk);
      root.removeEventListener('change', onChange);
      root.removeEventListener('click', onClick);
      hoverPanels.forEach((panel) => panel.removeEventListener('pointerenter', onEnter));
      clearTimeout(delayed);
      cancel();
      sizer.disconnect();
      stage?.style.removeProperty('--chat-height');
      panels.forEach(settle);
    };
  }, [startDelay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

