'use client';

import Image from 'next/image';
import Link from 'next/link';
import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from 'react';

import { detectionFitCheck, detectionFits } from '@/content/why-flash';

/**
 * "When is a detection-based tool the better fit?" as a self-check. Each
 * case is a row the reader can select by clicking anywhere on it, or with
 * the "Applies to us" pill at its top right; a "Your fit" card beside the
 * rows counts the selections and gives the verdict (styles/why-flash.css,
 * `fit-*`).
 *
 * The pill is the row's tab stop: a real button with aria-pressed, so
 * Enter and Space toggle it natively and the row shows the focus ring
 * through :focus-within. Text and the link inside a row stay usable; only
 * a click that isn't on the link toggles the row.
 *
 * The selection lives in the provider, which wraps this section and the one
 * after it, so "Your options" can read it with `useDetectionFit()`. It is
 * in-page state only: nothing is stored, and it resets when the page does.
 */

type Fit = {
  checked: readonly boolean[];
  toggle: (index: number) => void;
};

const FitContext = createContext<Fit | null>(null);

export function DetectionFitProvider({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState<readonly boolean[]>(() => detectionFits.map(() => false));
  const toggle = useCallback(
    (index: number) => setChecked((prev) => prev.map((value, i) => (i === index ? !value : value))),
    [],
  );
  const value = useMemo(() => ({ checked, toggle }), [checked, toggle]);
  return <FitContext value={value}>{children}</FitContext>;
}

function useFit() {
  const fit = useContext(FitContext);
  if (!fit) throw new Error('Detection-fit components must sit inside <DetectionFitProvider>.');
  return fit;
}

/** Which cases the reader selected, in case order. For the sections after the self-check. */
export function useDetectionFit() {
  return useFit().checked;
}

/** The three case rows. */
export function FitCases() {
  const { checked, toggle } = useFit();
  return (
    <ol className="flex flex-col">
      {detectionFits.map((fit, i) => {
        const on = checked[i];
        const id = `fit-case-${i + 1}`;
        return (
          <li
            key={fit.title}
            className="fit-case flex flex-col gap-5 sm:flex-row"
            data-on={on || undefined}
            onClick={(event) => {
              // The pill toggles itself; a link keeps its own job.
              if ((event.target as Element).closest('a, button')) return;
              toggle(i);
            }}
          >
            <div className="relative h-[180px] shrink-0 overflow-hidden rounded-[12px] bg-neutral-900 sm:h-[92px] sm:w-[132px]">
              <Image src={fit.image.src} alt={fit.image.alt} fill sizes="(min-width: 480px) 132px, 100vw" className="object-cover" />
            </div>
            <div className="flex grow flex-col gap-[6px]">
              <div className="flex items-center justify-between gap-4">
                <p aria-hidden className="text-micro font-bold tracking-[0.1em] text-text-subtle">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <button
                  type="button"
                  className="fit-pill"
                  aria-pressed={on}
                  aria-describedby={id}
                  onClick={() => toggle(i)}
                >
                  {detectionFitCheck.pill}
                  <span aria-hidden className="fit-pill-tick">
                    ✓
                  </span>
                </button>
              </div>
              <h3 id={id} className="text-body-l leading-body font-bold text-text">
                {fit.title}
              </h3>
              <p className="text-[15px] leading-body-s text-text-muted">
                {fit.link ? (
                  <>
                    {fit.body.split(fit.link.label)[0]}
                    <Link href={fit.link.href} className="font-semibold text-brand-blue hover:underline">
                      {fit.link.label}
                    </Link>
                    {fit.body.split(fit.link.label)[1]}
                  </>
                ) : (
                  fit.body
                )}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

const reduced = '(prefers-reduced-motion: reduce)';
const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(reduced);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};

/**
 * The "Your fit" card: label, "N of 3 apply", the verdict, and once anything
 * is selected a link on to "Your options". When the verdict changes, the old
 * line fades out on top while the new one fades in beneath it; with reduced
 * motion it simply swaps. Only the new one is in the live region.
 */
export function FitSummary({ optionsHref }: { optionsHref: string }) {
  const { checked } = useFit();
  const motion = useSyncExternalStore(
    subscribe,
    () => !window.matchMedia(reduced).matches,
    () => false,
  );
  const count = checked.filter(Boolean).length;
  const some = count > 0;

  // The verdict only changes between none and some; the key drives the crossfade.
  const key = some ? 'some' : 'none';
  const [shown, setShown] = useState(key);
  const [leaving, setLeaving] = useState<string | null>(null);
  const [changed, setChanged] = useState(false);
  if (key !== shown) {
    setLeaving(motion ? shown : null);
    setShown(key);
    setChanged(true);
  }

  return (
    <aside aria-labelledby="fit-summary-label" className="fit-summary" data-on={some || undefined}>
      <p id="fit-summary-label" className="fit-summary-label">
        {detectionFitCheck.label}
      </p>
      <div aria-live="polite" className="flex flex-col gap-2">
        <p className="fit-summary-count">{detectionFitCheck.count(count, detectionFits.length)}</p>
        <div className="fit-verdict">
          <p key={shown} className={`fit-verdict-line ${changed && motion ? 'fit-verdict-in' : ''}`}>
            {shown === 'some' ? detectionFitCheck.some : detectionFitCheck.none}
          </p>
          {leaving !== null && (
            <p
              key={`out-${leaving}`}
              aria-hidden
              className="fit-verdict-line fit-verdict-out"
              onAnimationEnd={() => setLeaving(null)}
            >
              {leaving === 'some' ? detectionFitCheck.some : detectionFitCheck.none}
            </p>
          )}
        </div>
      </div>
      {some && (
        <Link href={optionsHref} className="fit-summary-next">
          {detectionFitCheck.next}&nbsp;<span aria-hidden>↓</span>
        </Link>
      )}
    </aside>
  );
}
