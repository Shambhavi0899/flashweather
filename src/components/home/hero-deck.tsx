'use client';

import { useEffect, useRef } from 'react';

/** When the cycle starts: after the deck has assembled. */
const CYCLE_START = 1500;
/** A card that has left the front is out of sight this long after. */
const SWAP_SETTLE = 600;
/** A swipe has settled once the stage has not scrolled for this long. */
const SCROLL_SETTLE = 120;

/**
 * The home hero's product deck (styles/home-hero-deck.css). One card is open
 * at a time: each `[data-deck-card]` gets its `data-depth` (0 is the front),
 * the cards behind go `inert` and the open card's tab is selected. The markup arrives with the first card open, so without
 * JavaScript that is what shows.
 *
 * A card opens from its tab (click, or the arrow keys, Home and End), from a
 * click on a card behind, from a swipe where the stage scrolls (below lg),
 * and on its own once the open tab's gold line has filled. That line is a
 * CSS animation and its end is the clock, so everything that pauses the
 * cycle (hover, keyboard focus, a finger on the stage, the hero off screen)
 * is a CSS rule; the one thing set here is `data-hold` while the stage is
 * touched. `data-cycle` starts the line, and reduced motion never gets it,
 * so there nothing moves by itself and the tabs still switch cards.
 *
 * A card whose visual is the Flash Agent chat (`.hero-deck-chat`, an
 * <AgentChat autoPlay={false}>) plays it each time it comes forward, and is
 * put back on the chat's opening state once it is behind again, so it never
 * arrives empty.
 */
export function HeroDeck({ className, children }: { className: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const stage = root?.querySelector<HTMLElement>('[data-deck-stage]');
    if (!root || !stage) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const stacked = window.matchMedia('(min-width: 1024px)');

    const cards = [...root.querySelectorAll<HTMLElement>('[data-deck-card]')];
    const tabs = [...root.querySelectorAll<HTMLElement>('[role="tab"]')];

    let active = 0;
    let rest = 0;
    const chat = (card: HTMLElement, event: 'chat:play' | 'chat:hold') =>
      card.querySelector('.hero-deck-chat')?.dispatchEvent(new Event(event));
    const holdOthers = () => cards.forEach((card, n) => n !== active && chat(card, 'chat:hold'));

    /** Where the stage scrolls to for a card: the card centred. */
    const leftFor = (card: HTMLElement) => card.offsetLeft - (stage.clientWidth - card.offsetWidth) / 2;

    const show = (i: number, scroll: ScrollBehavior | false = reduced ? 'auto' : 'smooth') => {
      const changed = i !== active;
      active = i;
      cards.forEach((card, n) => {
        card.dataset.depth = String((n - i + cards.length) % cards.length);
        card.querySelector('[data-deck-body]')?.toggleAttribute('inert', n !== i);
      });
      tabs.forEach((tab, n) => {
        tab.setAttribute('aria-selected', String(n === i));
        tab.tabIndex = n === i ? 0 : -1;
      });
      if (scroll && !stacked.matches) stage.scrollTo({ left: leftFor(cards[i]), behavior: scroll });
      if (changed) {
        chat(cards[i], 'chat:play');
        clearTimeout(rest);
        rest = window.setTimeout(holdOthers, SWAP_SETTLE);
      }
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const tab = target.closest<HTMLElement>('[role="tab"]');
      const card = target.closest<HTMLElement>('[data-deck-card]');
      if (tab) show(tabs.indexOf(tab));
      else if (card && card.dataset.depth !== '0' && stacked.matches) show(cards.indexOf(card));
    };

    const onKey = (event: KeyboardEvent) => {
      if (!(event.target as HTMLElement).closest('[role="tab"]')) return;
      const last = tabs.length - 1;
      const moves: Record<string, number> = {
        ArrowRight: active === last ? 0 : active + 1,
        ArrowLeft: active === 0 ? last : active - 1,
        Home: 0,
        End: last,
      };
      const to = moves[event.key];
      if (to === undefined) return;
      event.preventDefault();
      show(to);
      tabs[to].focus();
    };

    // The open tab's line has filled: on to the next card.
    const onFilled = (event: AnimationEvent) => {
      if ((event.target as HTMLElement).hasAttribute('data-deck-fill')) show((active + 1) % cards.length);
    };

    // Below lg the stage scrolls; once a swipe settles, the card nearest its centre is the open one.
    let settle = 0;
    const onScroll = () => {
      clearTimeout(settle);
      settle = window.setTimeout(() => {
        if (stacked.matches) return;
        const nearest = cards.reduce(
          (best, card, n) =>
            Math.abs(leftFor(card) - stage.scrollLeft) < Math.abs(leftFor(cards[best]) - stage.scrollLeft) ? n : best,
          0,
        );
        if (nearest !== active) show(nearest, false);
      }, SCROLL_SETTLE);
    };
    const hold = () => root.setAttribute('data-hold', '');
    const release = () => root.removeAttribute('data-hold');

    // Across the breakpoint the open card stays open: in the stack nothing is scrolled.
    const onLayout = () => stage.scrollTo({ left: stacked.matches ? 0 : leftFor(cards[active]), behavior: 'auto' });

    root.addEventListener('click', onClick);
    root.addEventListener('keydown', onKey);
    root.addEventListener('animationend', onFilled);
    stage.addEventListener('scroll', onScroll, { passive: true });
    stage.addEventListener('touchstart', hold, { passive: true });
    stage.addEventListener('touchend', release);
    stage.addEventListener('touchcancel', release);
    stacked.addEventListener('change', onLayout);

    holdOthers();
    const start = reduced ? 0 : window.setTimeout(() => root.setAttribute('data-cycle', ''), CYCLE_START);

    return () => {
      clearTimeout(start);
      clearTimeout(settle);
      root.removeEventListener('click', onClick);
      root.removeEventListener('keydown', onKey);
      root.removeEventListener('animationend', onFilled);
      stage.removeEventListener('scroll', onScroll);
      stage.removeEventListener('touchstart', hold);
      stage.removeEventListener('touchend', release);
      stage.removeEventListener('touchcancel', release);
      stacked.removeEventListener('change', onLayout);
      root.removeAttribute('data-cycle');
      root.removeAttribute('data-hold');
      show(0, 'auto');
      clearTimeout(rest);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
