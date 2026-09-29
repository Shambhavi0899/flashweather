'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';

import { Motion } from '@/components/motion';

import { type SizeClassKey, type UseCase, heroSizeClasses, useCaseAlert, useCases } from './content';

/** The flip layout's query, as in styles/hail-use-cases.css; the server renders the stack. */
const FLIP = '(prefers-reduced-motion: no-preference)';
const subscribe = (notify: () => void) => {
  const query = window.matchMedia(FLIP);
  query.addEventListener('change', notify);
  return () => query.removeEventListener('change', notify);
};
const matches = () => window.matchMedia(FLIP).matches;

function StepText({ text, inlineLink }: { text: string; inlineLink: UseCase['inlineLink'] }) {
  if (!inlineLink || !text.includes(inlineLink.text)) return <>{text}</>;
  const [before, after] = text.split(inlineLink.text);
  return (
    <>
      {before}
      <Link href={inlineLink.href} className="font-semibold text-brand-blue hover:underline">
        {inlineLink.text}
      </Link>
      {after}
    </>
  );
}

function TurnIcon() {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3.5 6.5A5 5 0 1 1 3 9.8M3.5 6.5V3M3.5 6.5H7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * One card: a photo front and a "their move" back. With motion it turns
 * over: a mouse resting on it, a tap on its front, or Enter / Space on its
 * front's button turns the card; leaving it, or the back's turn button,
 * turns it back. Focus follows the turn, since the face
 * turned away is inert. Without motion both faces are simply shown, one
 * under the other (styles/hail-use-cases.css).
 */
function UseCaseCard({
  useCase,
  sizeClass,
  alerted,
  flippable,
}: {
  useCase: UseCase;
  /** The class the card's alert is for: the carried class if it is alerted on it, else its first. */
  sizeClass: SizeClassKey;
  alerted: boolean;
  flippable: boolean;
}) {
  const backId = useId();
  const frontButton = useRef<HTMLButtonElement>(null);
  const backButton = useRef<HTMLButtonElement>(null);
  /** Whether the turn came from the keyboard, so focus goes to the face that comes up. */
  const moveFocus = useRef(false);
  const [flipped, setFlipped] = useState(false);
  const size = heroSizeClasses.find((c) => c.key === sizeClass)?.size ?? '';

  // After the render that lifts `inert` from the face that came up.
  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    (flipped ? backButton : frontButton).current?.focus({ preventScroll: true });
  }, [flipped]);

  const open = (focus: boolean) => {
    if (flipped) return;
    moveFocus.current = focus;
    setFlipped(true);
  };
  const close = (focus: boolean) => {
    moveFocus.current = focus;
    setFlipped(false);
  };

  return (
    <li
      className="huc-card"
      data-class={sizeClass}
      data-alerted={alerted ? '' : undefined}
      data-flipped={flipped ? '' : undefined}
      onPointerEnter={(event) => {
        if (flippable && event.pointerType === 'mouse') open(false);
      }}
      onPointerLeave={(event) => {
        if (flippable && event.pointerType === 'mouse' && flipped) close(false);
      }}
    >
      <div className="huc-inner">
        <div className="huc-front" inert={flippable && flipped}>
          <Image
            src={useCase.image.src}
            alt={useCase.image.alt}
            fill
            sizes="(min-width: 1440px) 294px, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="-z-20 object-cover"
          />
          <span aria-hidden className="huc-front-grade" />
          {alerted && <span className="huc-alerted">Alerted · {size}</span>}
          <h3 className="text-h4 leading-h4 font-extrabold tracking-display">{useCase.title}</h3>
          <p className="text-[15px] leading-5 text-[#D5DCEA]">{useCase.kicker}</p>
          <button
            ref={frontButton}
            type="button"
            className="huc-flip"
            aria-expanded={flipped}
            aria-controls={backId}
            onClick={(event) => open(event.detail === 0 || document.activeElement === event.currentTarget)}
          >
            Their move <span aria-hidden>→</span>
            <span className="sr-only">: {useCase.title}</span>
          </button>
        </div>

        <div id={backId} className="huc-back" inert={flippable && !flipped}>
          <div className="flex items-start justify-between gap-3">
            <p className="text-[11px] leading-4 font-semibold tracking-label-wide text-text-muted uppercase">
              Their move{flippable ? ` · ${useCase.title}` : ''}
            </p>
            <button
              ref={backButton}
              type="button"
              className="huc-unflip -mt-1.5 -mr-1.5"
              aria-label={`Back to ${useCase.title}`}
              onClick={(event) => close(event.detail === 0 || document.activeElement === event.currentTarget)}
            >
              <TurnIcon />
            </button>
          </div>
          <ol className="huc-steps text-[15px] leading-5 text-text">
            {useCase.move.map((step) => (
              <li key={step}>
                <span>
                  <StepText text={step} inlineLink={useCase.inlineLink} />
                </span>
              </li>
            ))}
          </ol>
          <p className="huc-alert">
            <strong>{useCaseAlert.engine}</strong> · <span className="huc-alert-size">{size}</span> · {useCaseAlert.eta}{' '}
            · {useCase.channel}
          </p>
          {useCase.note && <p className="text-caption leading-caption text-text-subtle">{useCase.note}</p>}
          <Link
            href={useCase.link.href}
            className="mt-auto inline-flex min-h-11 items-center text-body-s leading-5 font-bold text-brand-blue hover:underline"
          >
            {useCase.link.label} <span aria-hidden>&nbsp;→</span>
          </Link>
        </div>
      </div>
    </li>
  );
}

/**
 * The four use cases, dealt out of a small stack as they scroll in (a
 * <Motion> block; styles/hail-use-cases.css). `sizeClass` is the class the
 * page carries down from the size-class table: a card whose industry is
 * alerted on it is highlighted, the others step back.
 */
export function UseCaseCards({ sizeClass }: { sizeClass: SizeClassKey }) {
  const flippable = useSyncExternalStore(subscribe, matches, () => false);

  return (
    <Motion
      as="ul"
      replay={false}
      threshold={0.2}
      className="motion huc-list grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
    >
      {useCases.map((useCase) => {
        const alerted = useCase.alertedOn.includes(sizeClass);
        return (
          <UseCaseCard
            key={useCase.title}
            useCase={useCase}
            sizeClass={alerted ? sizeClass : useCase.alertedOn[0]}
            alerted={alerted}
            flippable={flippable}
          />
        );
      })}
    </Motion>
  );
}
