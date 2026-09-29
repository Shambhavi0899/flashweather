'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { BOLT_PATH } from '@/components/bolt-path';
import { productPaths } from '@/content/products';

const TYPE_MS = 48;
const CLEAR_MS = 22;
const HOLD_MS = 2200;
const GAP_MS = 450;

/** The agent page, carrying the question the bar is showing. */
const hrefFor = (question: string) => `${productPaths.agent}?${new URLSearchParams({ q: question })}`;

/**
 * An input-style bar in the Flash Agent banner: example hail questions type
 * in, hold, clear and give way to the next, on a loop. It is a link, not a
 * field: there is no chat widget, so a click opens the Flash Agent page with
 * the question showing (?q=), which the page's own ask bar picks up.
 *
 * The loop only runs while the bar is on screen. Reduced motion (and no
 * JavaScript) shows the first question, still.
 */
export function AgentAskBar({ questions }: { questions: string[] }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [shown, setShown] = useState(questions[0]);

  useEffect(() => {
    const bar = ref.current;
    const text = bar?.querySelector<HTMLElement>('.hs-ask-typed');
    if (!bar || !text || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let timer = 0;
    let running = false;
    let index = 0;
    let chars = 0;
    let phase: 'type' | 'hold' | 'clear' = 'type';

    const step = () => {
      const question = questions[index];
      if (phase === 'type') {
        if (chars === 0) setShown(question);
        chars += 1;
        text.textContent = question.slice(0, chars);
        if (chars >= question.length) phase = 'hold';
        timer = window.setTimeout(step, chars >= question.length ? HOLD_MS : TYPE_MS);
      } else if (phase === 'hold') {
        phase = 'clear';
        step();
      } else {
        chars -= 1;
        text.textContent = question.slice(0, Math.max(0, chars));
        if (chars <= 0) {
          phase = 'type';
          index = (index + 1) % questions.length;
        }
        timer = window.setTimeout(step, chars <= 0 ? GAP_MS : CLEAR_MS);
      }
    };

    bar.toggleAttribute('data-typing', true);
    text.textContent = '';
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        timer = window.setTimeout(step, GAP_MS);
      } else if (!entry.isIntersecting && running) {
        running = false;
        clearTimeout(timer);
      }
    });
    observer.observe(bar);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
      bar.removeAttribute('data-typing');
      text.textContent = questions[0];
      setShown(questions[0]);
    };
  }, [questions]);

  return (
    <Link ref={ref} href={hrefFor(shown)} className="hs-ask" aria-label="Ask Flash Agent a hail question">
      <span aria-hidden className="bg-gold-metallic flex size-9 shrink-0 items-center justify-center rounded-full">
        <svg width="12" height="16" viewBox="0 0 26 34">
          <path d={BOLT_PATH} fill="#070D26" />
        </svg>
      </span>
      <span aria-hidden className="hs-ask-field">
        <span className="hs-ask-typed">{questions[0]}</span>
        <span className="hs-ask-caret" />
      </span>
      <span aria-hidden className="bg-gold-button flex h-9 shrink-0 items-center rounded-full px-4 text-caption leading-micro font-extrabold text-brand-navy">
        Ask
      </span>
    </Link>
  );
}
