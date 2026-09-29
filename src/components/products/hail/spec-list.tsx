'use client';

import { useRef, useState } from 'react';

import { Motion } from '@/components/motion';

import { SpecStone } from './spec-stone';

type Spec = { label: string; value: string; note: string };

const STONE_LABEL =
  'Illustrative hailstone cut in half: an icy core and eight growth rings, numbered 1 to 8 like the specifications beside it';

/**
 * The eight specs beside a hailstone cross-section, one growth ring each,
 * core → outside. As the block scrolls in (the shared <Motion>), the rings
 * draw from the core out while their rows fade in beside them. Pointing at
 * a row lights its ring gold, and pointing at a ring lights its row; on a
 * touch screen a tap does the same and a second tap clears it. Reduced
 * motion and no JavaScript show every ring and row, and no shimmer.
 */
export function SpecList({ specs }: { specs: Spec[] }) {
  const [active, setActive] = useState<number | null>(null);
  // A mouse highlights on hover; a finger or pen on tap. `click` does not
  // say which (not every Safari sends a PointerEvent), so pointerdown does.
  const pointer = useRef('mouse');
  const note = (event: React.PointerEvent) => {
    pointer.current = event.pointerType;
  };
  const tap = (i: number) => {
    if (pointer.current !== 'mouse') setActive((current) => (current === i ? null : i));
  };

  return (
    <Motion className="motion hs-body" replay={false} threshold={0.2}>
      <div className="hs-figure" onPointerDown={note}>
        <div className="hs-card">
          <SpecStone label={STONE_LABEL} active={active} onPoint={setActive} onTap={tap} />
        </div>
      </div>

      <dl className="hs-list" onPointerDown={note}>
        {specs.map((spec, i) => (
          <div
            key={spec.label}
            className={`hs-row hs-k${i + 1}`}
            data-active={active === i ? '' : undefined}
            onPointerEnter={(event) => event.pointerType === 'mouse' && setActive(i)}
            onPointerLeave={(event) => event.pointerType === 'mouse' && setActive(null)}
            onClick={() => tap(i)}
          >
            <dt className="hs-term">
              <span aria-hidden className="hs-mark">
                {i + 1}
              </span>
              <span className="text-[11px] leading-[14px] font-semibold tracking-[0.16em] text-text-muted uppercase">
                {spec.label}
              </span>
            </dt>
            <dd className="hs-value text-[22px] leading-[28px] font-bold tracking-display text-text md:text-[24px] md:leading-[30px]">
              {spec.value}
            </dd>
            <dd className="hs-note text-body-s leading-5 text-text-muted">{spec.note}</dd>
          </div>
        ))}
      </dl>
    </Motion>
  );
}
