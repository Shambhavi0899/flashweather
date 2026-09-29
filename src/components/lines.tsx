'use client';

import { Fragment, useEffect, useRef } from 'react';

/**
 * Text that can move a line at a time. Each word is its own inline block,
 * and carries the line it has wrapped onto as `data-line` (0, 1, 2 ...),
 * kept current as the text reflows. Global CSS turns that into a delay; the
 * words are laid out exactly as plain text would be, so nothing shifts.
 * Without JavaScript every word is on "line 0" and moves as one.
 */
export function Lines({ text, className }: { text: string; className: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const words = [...root.children] as HTMLElement[];
    const measure = () => {
      let line = -1;
      let top = -Infinity;
      for (const word of words) {
        if (word.offsetTop > top + 4) {
          line++;
          top = word.offsetTop;
        }
        if (word.dataset.line !== String(line)) word.dataset.line = String(line);
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, [text]);

  const words = text.split(' ');
  return (
    <span ref={ref}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className={className}>{word}</span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </span>
  );
}
