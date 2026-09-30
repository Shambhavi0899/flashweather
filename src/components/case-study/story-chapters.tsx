'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * The case study's chapter markers: Problem, Change, Scale, joined by a
 * thin line (styles/case-study-story.css, `css-*`). `rail` is the vertical
 * set inside the sticky "At a glance" card; `bar` is the slim sticky bar a
 * phone gets at the top of the section. Only one is displayed at a time.
 *
 * A chapter's marker fills gold once its section has come into view (its
 * top is past the trigger line, four fifths of the way down the viewport),
 * and the line fills toward the next marker in step with the scroll,
 * through whatever sits between two chapters. The line is that low because
 * the card is nearly as tall as the story: it has to reach the last marker
 * while the card is still stuck. The markers are plain in-page links, so a
 * click scrolls to the section (eased by the site's smooth scroll) and they
 * work without JavaScript.
 *
 * Reduced motion: the line steps from marker to marker with the chapter,
 * and nothing transitions.
 */

export type Chapter = { id: string; label: string };

/** How far down the viewport a section's top must come to count as in view. */
const LINE = 0.8;

export function StoryChapters({ chapters, variant }: { chapters: Chapter[]; variant: 'rail' | 'bar' }) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const nav = ref.current;
    if (!nav) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sections = chapters.map((chapter) => document.getElementById(chapter.id));
    let frame = 0;

    const measure = () => {
      frame = 0;
      // The variant that is display: none has nothing to draw.
      if (nav.offsetParent === null) return;
      const line = window.innerHeight * LINE;
      const tops = sections.map((section) => section?.getBoundingClientRect().top ?? Infinity);
      let current = -1;
      tops.forEach((top, i) => {
        if (top <= line) current = i;
      });

      const last = chapters.length - 1;
      let fill = 0;
      if (current >= last) fill = 1;
      else if (current >= 0) {
        const span = tops[current + 1] - tops[current];
        const part = reduced.matches || span <= 0 ? 0 : Math.min(1, Math.max(0, (line - tops[current]) / span));
        fill = (current + part) / last;
      }
      nav.style.setProperty('--css-fill', fill.toFixed(4));
      setActive(current);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    reduced.addEventListener('change', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      reduced.removeEventListener('change', schedule);
    };
  }, [chapters]);

  return (
    <nav ref={ref} aria-label="Chapters" className={`css css-${variant}`}>
      <span aria-hidden className="css-line">
        <span className="css-line-fill" />
      </span>
      <ol className="css-list">
        {chapters.map((chapter, i) => (
          <li key={chapter.id}>
            <a
              href={`#${chapter.id}`}
              className="css-link"
              data-on={i <= active || undefined}
              aria-current={i === active ? 'step' : undefined}
            >
              <span aria-hidden className="css-dot" />
              {chapter.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
