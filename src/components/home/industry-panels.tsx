'use client';

import { useEffect, useRef } from 'react';

/** Hovering a panel opens it after this long, so a pointer crossing the row does not open every panel on its way. */
const HOVER_INTENT_MS = 90;

/**
 * The behaviour of the industry panels in <Industries>. The panels arrive
 * finished: a radio group, one panel open, shown by `:has(:checked)` rules
 * (styles/home.css, `ind-*`), so every panel is in the server HTML, a click
 * or tap opens one and the arrow keys move between them without JavaScript.
 *
 * What is added here:
 *   hover     a mouse over a panel opens it
 *   follow    a mouse click on a closed panel, and Enter on a focused one,
 *             go to the panel's link (an open panel is covered by the link
 *             itself; a tap on a closed one opens it first)
 *   advance   idle and in view, the open panel gives way to the next every
 *             5s. The clock is the gold bar's own CSS animation: it runs
 *             while the wrapper carries `data-auto="run"`, holds on
 *             `paused`, and its `animationend` opens the next panel, so the
 *             bar and the change cannot drift apart. The bar is only drawn
 *             in the row layout (lg and up); the accordion below it never
 *             advances on its own.
 *
 * Hover and keyboard focus pause the advance. A panel picked by click, tap
 * or key stays open until the section has scrolled away and back. With
 * reduced motion there is no advance and no bar.
 */
export function IndustryPanels({
  className,
  labelledBy,
  children,
}: {
  className: string;
  /** The id of the heading that names the group. */
  labelledBy: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const radios = [...root.querySelectorAll<HTMLInputElement>('input[type="radio"]')];
    const panels = radios.map((radio) => radio.closest<HTMLElement>('[data-panel]'));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    let inView = false;
    let hovered = false;
    let picked = false;
    let intent = 0;

    const sync = () => {
      if (reduced.matches || picked || !inView) delete root.dataset.auto;
      else root.dataset.auto = hovered || root.matches(':has(:focus-visible)') ? 'paused' : 'run';
    };

    const open = (index: number) => {
      const radio = radios[index];
      if (radio) radio.checked = true;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (!inView) picked = false;
        sync();
      },
      { threshold: 0.4 },
    );
    observer.observe(root);

    const onAnimationEnd = (event: AnimationEvent) => {
      if (event.animationName !== 'ind-progress') return;
      open((radios.findIndex((radio) => radio.checked) + 1) % radios.length);
    };

    // Only a person's own choice fires `change`; opening a panel from here does not.
    const onChange = () => {
      picked = true;
      sync();
    };

    const onEnter = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      hovered = true;
      sync();
    };
    const onLeave = () => {
      hovered = false;
      clearTimeout(intent);
      sync();
    };
    // A mouse click on a closed panel, or Enter on a focused one, follows the panel's link.
    // A tap on a closed panel only opens it; open, the link itself covers the panel.
    let pointer = '';
    const onPointerDown = (event: PointerEvent) => {
      pointer = event.pointerType;
    };
    const follow = (from: EventTarget | null) =>
      (from as HTMLElement).closest('[data-panel]')?.querySelector<HTMLElement>('[data-panel-link]')?.click();
    const onClick = (event: MouseEvent) => {
      if (pointer !== 'mouse' || !(event.target instanceof HTMLLabelElement)) return;
      event.preventDefault();
      follow(event.target);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' || !(event.target instanceof HTMLInputElement)) return;
      event.preventDefault();
      follow(event.target);
    };
    const onPanelEnter = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const index = panels.indexOf(event.currentTarget as HTMLElement);
      clearTimeout(intent);
      intent = window.setTimeout(() => open(index), HOVER_INTENT_MS);
    };

    root.addEventListener('animationend', onAnimationEnd);
    root.addEventListener('change', onChange);
    root.addEventListener('pointerenter', onEnter);
    root.addEventListener('pointerleave', onLeave);
    root.addEventListener('focusin', sync);
    root.addEventListener('focusout', sync);
    root.addEventListener('pointerdown', onPointerDown);
    root.addEventListener('click', onClick);
    root.addEventListener('keydown', onKeyDown);
    panels.forEach((panel) => panel?.addEventListener('pointerenter', onPanelEnter));
    reduced.addEventListener('change', sync);

    return () => {
      observer.disconnect();
      clearTimeout(intent);
      root.removeEventListener('animationend', onAnimationEnd);
      root.removeEventListener('change', onChange);
      root.removeEventListener('pointerenter', onEnter);
      root.removeEventListener('pointerleave', onLeave);
      root.removeEventListener('focusin', sync);
      root.removeEventListener('focusout', sync);
      root.removeEventListener('pointerdown', onPointerDown);
      root.removeEventListener('click', onClick);
      root.removeEventListener('keydown', onKeyDown);
      panels.forEach((panel) => panel?.removeEventListener('pointerenter', onPanelEnter));
      reduced.removeEventListener('change', sync);
      delete root.dataset.auto;
    };
  }, []);

  return (
    <div ref={ref} role="radiogroup" aria-labelledby={labelledBy} className={className}>
      {children}
    </div>
  );
}
