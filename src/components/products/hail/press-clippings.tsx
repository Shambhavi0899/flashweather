'use client';

import { useEffect, useRef } from 'react';

import { onScrollFrame } from '@/lib/scroll';

import { pressCoverage } from './content';

/** From 1280px the clippings fan out as one stack; below, each fans in on its own. */
const WIDE = '(min-width: 1280px)';

/**
 * The launch coverage as newspaper clippings on the navy ground: masthead,
 * a "FlashHail launch" tag, the quote and who it was written for. Each
 * clipping is a link to the article, in a new tab.
 *
 * Motion (styles/hail-press.css), scrubbed on the shared scroll loop so it
 * moves with Lenis:
 *   fan     from 1280px the clippings start as one untidy stack in the
 *           middle and fan out to their places as the section scrolls in
 *           (`--hp-p`, 0 → 1 on the list). Below, each fans in from the
 *           side as it enters view (`--hp-p` on the clipping).
 *   mark    once a clipping is in place, a gold highlighter swipes across
 *           the phrase that says what FlashHail does before impact, one
 *           clipping after the other (`data-marked`); it stays marked.
 * Hovering or focusing a clipping straightens and lifts it.
 *
 * The markup is the finished frame: clippings in place, phrases marked.
 * That is what reduced motion and a browser without JavaScript show.
 */
export function PressClippings() {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const clips = [...list.querySelectorAll<HTMLElement>('.hp-clip')];
    const wide = window.matchMedia(WIDE);

    // 0 as the element's top enters the bottom 5% of the screen, 1 half a
    // screen later; eased out, so it arrives softly.
    const progress = (el: HTMLElement) => {
      const vh = window.innerHeight;
      return Math.min(1, Math.max(0, (vh * 0.95 - el.getBoundingClientRect().top) / (vh * 0.5)));
    };
    const eased = (t: number) => (1 - (1 - t) ** 3).toFixed(3);

    list.setAttribute('data-armed', '');
    const stop = onScrollFrame(() => {
      if (wide.matches) {
        const t = progress(list);
        list.style.setProperty('--hp-p', eased(t));
        clips.forEach((clip) => clip.style.removeProperty('--hp-p'));
        if (t >= 1) list.setAttribute('data-marked', '');
      } else {
        list.style.removeProperty('--hp-p');
        clips.forEach((clip) => {
          const t = progress(clip);
          clip.style.setProperty('--hp-p', eased(t));
          if (t >= 1) clip.setAttribute('data-marked', '');
        });
      }
    });

    return () => {
      stop();
      list.removeAttribute('data-armed');
      list.removeAttribute('data-marked');
      list.style.removeProperty('--hp-p');
      clips.forEach((clip) => {
        clip.removeAttribute('data-marked');
        clip.style.removeProperty('--hp-p');
      });
    };
  }, []);

  return (
    <ul ref={ref} className="hp-list">
      {pressCoverage.map((item) => {
        const [before, after] = item.summary.split(item.highlight);
        return (
          <li key={item.outlet} className="hp-clip">
            <a href={item.href} target="_blank" rel="noopener noreferrer" className="hp-card">
              <div className="hp-paper">
                <div className="hp-masthead">
                  <h3 className="hp-outlet">{item.outlet}</h3>
                  <p className="hp-meta">
                    <span>{item.beat}</span>
                    <span className="hp-tag">FlashHail launch</span>
                  </p>
                </div>
                <p className="hp-quote">
                  <span aria-hidden className="hp-quote-mark">
                    “
                  </span>
                  {before}
                  <mark className="hp-mark">{item.highlight}</mark>
                  {after}
                </p>
                <p className="hp-foot">
                  <span className="hp-audience">{item.audience}</span>
                  <span className="hp-read">
                    Read the coverage <span aria-hidden>↗</span>
                    <span className="sr-only"> in {item.outlet} (opens in a new tab)</span>
                  </span>
                </p>
              </div>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
