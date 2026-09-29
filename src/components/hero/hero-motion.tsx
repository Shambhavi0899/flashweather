'use client';

import { useEffect, useRef } from 'react';

import { onScrollFrame } from '@/lib/scroll';

/** A lightning flash lands every 6–10s while the hero is on screen. */
const FLASH_MIN = 6000;
const FLASH_MAX = 10000;
const FLASH_MS = 280;

/**
 * Every hero's ambient motion (styles/hero.css). The load choreography is
 * CSS alone, so it starts on the first paint and never waits for this
 * script. This adds what CSS cannot schedule:
 *
 *   --hero-scroll    how far the hero has scrolled, for the parallax; read
 *                    on the shared scroll loop, so it moves with Lenis
 *   data-scrolled-once  set on the first scroll
 *   data-offscreen   the hero is out of view: loops pause, timers stop
 *   data-flash       on `.hero-flash` for one flash, at random intervals;
 *                    only heroes over a storm photo have the layer
 *
 * Mouse parallax comes from <Tilt> (--tilt-x / --tilt-y). With reduced
 * motion none of this runs and the hero is its static final state.
 */
export function HeroMotion({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const hero = root?.closest<HTMLElement>('[data-hero]');
    if (!root || !hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const flash = root.querySelector<HTMLElement>('.hero-flash');
    let visible = true;

    // Scroll: parallax while the hero is on screen, and the first-scroll flag.
    const stopReading = onScrollFrame(() => {
      const y = Math.min(window.scrollY, hero.offsetTop + hero.offsetHeight);
      root.style.setProperty('--hero-scroll', y.toFixed(1));
      if (window.scrollY > 0) root.setAttribute('data-scrolled-once', '');
    });

    // Lightning: one soft flash in the clouds at a random 6–10s interval.
    let flashTimer = 0;
    let flashOff = 0;
    const scheduleFlash = () => {
      clearTimeout(flashTimer);
      flashTimer = window.setTimeout(
        () => {
          if (visible && flash && !document.hidden) {
            flash.setAttribute('data-flash', '');
            flashOff = window.setTimeout(() => flash.removeAttribute('data-flash'), FLASH_MS);
          }
          scheduleFlash();
        },
        FLASH_MIN + Math.random() * (FLASH_MAX - FLASH_MIN),
      );
    };
    if (flash) scheduleFlash();

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      root.toggleAttribute('data-offscreen', !visible);
    });
    observer.observe(hero);

    return () => {
      stopReading();
      clearTimeout(flashTimer);
      clearTimeout(flashOff);
      observer.disconnect();
      flash?.removeAttribute('data-flash');
      root.removeAttribute('data-offscreen');
      root.style.removeProperty('--hero-scroll');
    };
  }, []);

  return (
    <div ref={ref} className="hero-fx contents">
      {children}
    </div>
  );
}
