'use client';

import { useEffect, useRef } from 'react';

import { onScrollFrame } from '@/lib/scroll';

/** The answer streams in over this long, however many words. */
const ANSWER_MS = 1000;
/** A card plays once its top edge is this far up the screen... */
const TRIGGER = 0.75;
/** ...and, after the first, once the page has scrolled this much further (in screen heights) since the one before. */
const STAGGER = 0.25;

/**
 * Plays the Ask Flash cards on the Lightning page (ask-flash.tsx): the answer
 * streams in, then the action lands in the tool. The cards arrive finished
 * (server-rendered), so without JavaScript or with reduced motion each simply
 * shows its final state.
 *
 * A playing card gets `data-chat` (play | done) and `data-steps`, the steps
 * reached, which the `ask-*` rules in styles/products.css key off; each card
 * lists its own steps and their start times in `data-ask-steps`
 * ("tool@1150 move@1750 ..."), and it is done at the last one. The answer's
 * words arrive one by one (`is-in`) on the home page's `chat-word` rules, and
 * Replay shows on its `chat-replay` rule.
 *
 * Cards play in document order, on the shared scroll loop (so in step with
 * Lenis): each once its top reaches TRIGGER, and each after the first only
 * once the page has scrolled STAGGER further than when the one before it
 * started. Side by side, the second card waits for that extra scroll; stacked,
 * it is already that far down. A card scrolled past before the script runs
 * stays finished.
 */
export function AskFlashPlayer({ className, children }: { className: string; children: React.ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = [...root.querySelectorAll<HTMLElement>('[data-ask-card]')];
    const frames = new Map<HTMLElement, number>();

    /** Back to the finished state. */
    const settle = (card: HTMLElement) => {
      cancelAnimationFrame(frames.get(card) ?? 0);
      frames.delete(card);
      delete card.dataset.chat;
      delete card.dataset.steps;
      card.querySelectorAll('.chat-word.is-in').forEach((w) => w.classList.remove('is-in'));
    };

    /** At the start of its play: the question alone, everything else waiting. */
    const hold = (card: HTMLElement) => {
      card.dataset.chat = 'play';
      card.dataset.steps = '';
    };

    const play = (card: HTMLElement) => {
      settle(card);
      hold(card);
      const words = [...card.querySelectorAll<HTMLElement>('.chat-word')];
      const perWord = ANSWER_MS / Math.max(1, words.length);
      const steps = (card.dataset.askSteps ?? '')
        .split(' ')
        .filter(Boolean)
        .map((step) => {
          const [name, at] = step.split('@');
          return { name, at: Number(at) };
        });
      const done = Math.max(ANSWER_MS, ...steps.map((step) => step.at));
      let shown = 0;
      const start = performance.now();

      const tick = (now: number) => {
        const t = now - start;
        const due = Math.min(words.length, Math.floor(t / perWord) + 1);
        for (; shown < due; shown++) words[shown].classList.add('is-in');
        const reached = steps
          .filter((step) => t >= step.at)
          .map((step) => step.name)
          .join(' ');
        if (card.dataset.steps !== reached) card.dataset.steps = reached;
        if (t >= done) {
          card.dataset.chat = 'done';
          frames.delete(card);
          return;
        }
        frames.set(card, requestAnimationFrame(tick));
      };
      frames.set(card, requestAnimationFrame(tick));
    };

    // Cards already above the screen stay finished; the rest wait.
    let next = 0;
    while (next < cards.length && cards[next].getBoundingClientRect().bottom < 0) next++;
    cards.slice(next).forEach(hold);
    let lastStart = -Infinity;

    const read = () => {
      while (next < cards.length) {
        const card = cards[next];
        if (card.getBoundingClientRect().top > window.innerHeight * TRIGGER) return;
        if (window.scrollY < lastStart + window.innerHeight * STAGGER) return;
        lastStart = window.scrollY;
        next++;
        play(card);
      }
    };
    const stop = onScrollFrame(read);

    const onClick = (event: MouseEvent) => {
      const card = (event.target as HTMLElement).closest('[data-chat-replay]')?.closest<HTMLElement>('[data-ask-card]');
      if (card) play(card);
    };
    root.addEventListener('click', onClick);

    return () => {
      stop();
      root.removeEventListener('click', onClick);
      cards.forEach(settle);
    };
  }, []);

  return (
    <ul ref={ref} className={className}>
      {children}
    </ul>
  );
}
