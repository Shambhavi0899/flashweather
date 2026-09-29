'use client';

import { useEffect, useRef } from 'react';

import { onScrollFrame } from '@/lib/scroll';

const clamp = (n: number) => Math.min(1, Math.max(0, n));

/** Where on the screen the quote starts to fill in, and where it is complete. */
const START = 0.85;
const END = 0.5;

/**
 * The testimonial, read in by the scroll: each word goes from muted to full
 * colour as the quote crosses the screen, and the attribution arrives once
 * the last word has. It only says how far along the quote is (`data-on` on
 * the words reached, `data-done` on the figure); global CSS
 * (styles/finale.css) does the colouring.
 *
 * It reads on the shared scroll frame (lib/scroll), so it keeps step with
 * smooth scrolling. The markup is the finished quote: with no JavaScript or
 * with reduced motion nothing is set, and the quote is in full colour with
 * its attribution showing.
 */
export function ScrubQuote({
  quote,
  attribution,
  className,
  quoteClassName,
  children,
}: {
  quote: string;
  attribution: string;
  className: string;
  quoteClassName: string;
  /** What sits above the quote (the eyebrow). */
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const words = `“${quote}”`.split(' ');

  useEffect(() => {
    const figure = ref.current;
    const block = figure?.querySelector('blockquote');
    if (!figure || !block || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const spans = [...block.querySelectorAll<HTMLElement>('[data-word]')];

    let lit = -1;
    const read = () => {
      const vh = window.innerHeight;
      const box = block.getBoundingClientRect();
      if (box.top > vh * 1.2 && lit === 0) return;
      // 0 as the quote's first line reaches START, 1 as its last line reaches END.
      const progress = clamp((vh * START - box.top) / (vh * (START - END) + box.height));
      const next = Math.round(progress * spans.length);
      if (next === lit) return;
      const [from, to] = lit < 0 ? [0, spans.length] : [Math.min(lit, next), Math.max(lit, next)];
      for (let i = from; i < to; i++) spans[i].toggleAttribute('data-on', i < next);
      lit = next;
      figure.toggleAttribute('data-done', next === spans.length);
    };

    figure.setAttribute('data-scrub', '');
    const stop = onScrollFrame(read);
    return () => {
      stop();
      figure.removeAttribute('data-scrub');
      figure.removeAttribute('data-done');
      spans.forEach((span) => span.removeAttribute('data-on'));
    };
  }, []);

  return (
    <figure ref={ref} className={`quote-scrub ${className}`}>
      {children}
      <blockquote className={quoteClassName}>
        <p>
          {words.map((word, i) => (
            // The space stays outside the span, so the line breaks where it
            // would in plain text.
            <span key={i}>
              <span data-word className="quote-word">
                {word}
              </span>
              {i < words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </p>
      </blockquote>
      <figcaption className="quote-by flex items-center justify-center gap-3">
        <span aria-hidden className="h-[2px] w-8 shrink-0 bg-brand-navy" />
        <span className="text-body-s leading-5 font-semibold text-text">{attribution}</span>
      </figcaption>
    </figure>
  );
}
