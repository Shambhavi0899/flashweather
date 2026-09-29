'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';

import { attachSmoothScroll } from '@/lib/scroll';

/**
 * Site-wide smooth scrolling (Lenis), for a mouse or trackpad only. Touch
 * devices keep their native scroll, and so does anyone who asks for reduced
 * motion; it turns on and off with those settings, live.
 *
 * It moves the real scroll position, not a transformed page, so `position:
 * fixed` and `sticky`, IntersectionObserver and scroll events all behave as
 * they do natively. What it takes over:
 *   anchors     in-page links ease to their target, clear of the fixed
 *               header (it reads `scroll-padding-top`, styles/header.css)
 *   autoToggle  it stops while the page is locked (`overflow: hidden` on
 *               <html>, as the mobile menu sets) and resumes after
 *   nested scrollers marked `data-lenis-prevent` scroll on their own
 */
export function SmoothScroll() {
  useEffect(() => {
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let stop: (() => void) | undefined;

    const sync = () => {
      const wanted = pointer.matches && !reduced.matches;
      if (wanted && !stop) {
        const lenis = new Lenis({
          duration: 1.1,
          easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
          smoothWheel: true,
          syncTouch: false,
          anchors: true,
          autoToggle: true,
          autoRaf: true,
          stopInertiaOnNavigate: true,
        });
        const detach = attachSmoothScroll(lenis);
        stop = () => {
          detach();
          lenis.destroy();
        };
      } else if (!wanted && stop) {
        stop();
        stop = undefined;
      }
    };

    sync();
    pointer.addEventListener('change', sync);
    reduced.addEventListener('change', sync);
    return () => {
      pointer.removeEventListener('change', sync);
      reduced.removeEventListener('change', sync);
      stop?.();
    };
  }, []);

  return null;
}
