'use client';

import { useEffect, useRef } from 'react';

/**
 * "Every surface, one subscription." (pricing-sections.tsx,
 * styles/pricing-surfaces.css): the row holding the devices photo and the
 * surface chips.
 *
 * A chip (`data-surface`) under the mouse or with keyboard focus puts its id
 * in the row's `data-focus`, which CSS turns into the photo's zoom and pan,
 * and marks its label on the photo (`data-surface-label`) with `data-on`.
 * Leaving resets. A touch has no hover, so the first tap on a chip holds the
 * focus instead of following its link; a second tap follows the link (or, on
 * a chip with no link, lets go), and a tap anywhere else lets go.
 * With reduced motion the label shows and the photo stays still; that is CSS.
 */
export function SurfaceFocus({ className, children }: { className: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = ref.current;
    if (!row) return;
    const chips = [...row.querySelectorAll<HTMLElement>('[data-surface]')];
    const labels = [...row.querySelectorAll<HTMLElement>('[data-surface-label]')];

    let hover: HTMLElement | null = null;
    let held: HTMLElement | null = null;
    let pointer = '';

    const render = () => {
      const id = (hover ?? held)?.dataset.surface;
      if (id) row.dataset.focus = id;
      else delete row.dataset.focus;
      for (const chip of chips) {
        chip.toggleAttribute('data-on', chip.dataset.surface === id);
        if (chip instanceof HTMLButtonElement) chip.setAttribute('aria-pressed', String(chip === held));
      }
      for (const label of labels) label.toggleAttribute('data-on', label.dataset.surfaceLabel === id);
    };

    const controller = new AbortController();
    const { signal } = controller;
    const leave = (chip: HTMLElement) => {
      if (hover === chip) hover = null;
      render();
    };

    for (const chip of chips) {
      chip.addEventListener(
        'pointerenter',
        (event) => {
          if (event.pointerType !== 'mouse') return;
          hover = chip;
          render();
        },
        { signal },
      );
      chip.addEventListener('pointerleave', () => leave(chip), { signal });
      // A tap focuses the chip too; only keyboard focus should act as a hover.
      chip.addEventListener(
        'focus',
        () => {
          if (!chip.matches(':focus-visible')) return;
          hover = chip;
          render();
        },
        { signal },
      );
      chip.addEventListener('blur', () => leave(chip), { signal });
      chip.addEventListener('pointerdown', (event) => (pointer = event.pointerType), { signal });
      chip.addEventListener(
        'click',
        (event) => {
          const touch = pointer === 'touch' || pointer === 'pen';
          pointer = '';
          if (chip instanceof HTMLButtonElement) held = held === chip ? null : chip;
          else if (touch && held !== chip) {
            event.preventDefault(); // the first tap shows the surface; the next one follows the link
            held = chip;
          }
          render();
        },
        { signal },
      );
    }
    document.addEventListener(
      'pointerdown',
      (event) => {
        if (!held || (event.target as Element).closest('[data-surface]')) return;
        held = null;
        render();
      },
      { signal },
    );
    row.addEventListener(
      'keydown',
      (event) => {
        if (event.key !== 'Escape' || !held) return;
        held = null;
        render();
      },
      { signal },
    );

    return () => {
      controller.abort();
      hover = held = null;
      render();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
