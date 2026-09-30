'use client';

import { useEffect, useRef } from 'react';

/** How far the page scrolls before the underlines draw. */
const SCROLL_AT = 30;
/** The hero's last entrance lands at 1.9s (`--hero-support-at` + 0.6s, styles/hero.css). */
const HERO_SETTLED = 1900;
/** With no scroll, they draw this long after that, so they are never missing. */
const IDLE_DRAW = 2500;

/**
 * The home hero's paragraph. Its linked words' gold underlines
 * (`.hero-lede-link`, styles/home.css) draw once per page load, on the
 * first bit of scroll or, failing that, a while after the hero lands:
 * this sets `data-drawn` on the paragraph and the CSS does the drawing.
 */
export function HeroLede({ className, children }: { className: string; children: React.ReactNode }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const lede = ref.current;
    if (!lede) return;
    const draw = () => {
      lede.setAttribute('data-drawn', '');
      window.removeEventListener('scroll', onScroll);
      clearTimeout(idle);
    };
    const onScroll = () => {
      if (window.scrollY > SCROLL_AT) draw();
    };
    const idle = setTimeout(draw, HERO_SETTLED + IDLE_DRAW);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(idle);
    };
  }, []);

  return (
    <p ref={ref} className={className}>
      {children}
    </p>
  );
}
