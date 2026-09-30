'use client';

import { useEffect, useRef } from 'react';

/** The row moves on by one logo this often. */
const AUTOPLAY_MS = 2000;
/** One slide, a logo's width. */
const SLIDE_MS = 500;
/** A swipe has settled once the row has not scrolled for this long. */
const SCROLL_SETTLE = 140;

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * The customers logo slider (styles/home-customers.css). The markup arrives
 * as one list in a row that scrolls sideways (`[data-slider-view]`), which is
 * what shows without JavaScript. Here the list is copied once before and once
 * after itself (the copies hidden from assistive tech), and the row is kept
 * inside the middle copy: whenever it comes to rest in another copy it jumps
 * one list-width back, to the same logos, so it loops with no seam.
 *
 * The row moves one logo at a time: by itself every AUTOPLAY_MS, and from the
 * `[data-slider-prev]` / `[data-slider-next]` buttons. A swipe is the row's
 * own scrolling. Autoplay waits while the pointer is over the slider, while
 * keyboard focus is inside it, while a finger is on it, and while the section is off
 * screen or the tab hidden. With reduced motion there is no autoplay and the
 * buttons move the row without a slide.
 */
export function CustomerSlider({ className, children }: { className: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const view = root?.querySelector<HTMLElement>('[data-slider-view]');
    const track = view?.firstElementChild;
    if (!root || !view || !track) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const items = [...track.children] as HTMLElement[];
    const copy = () =>
      items.map((item) => {
        const clone = item.cloneNode(true) as HTMLElement;
        clone.setAttribute('aria-hidden', 'true');
        return clone;
      });
    const before = copy();
    const after = copy();
    track.prepend(...before);
    track.append(...after);

    const step = () => items[0].getBoundingClientRect().width;
    const loop = () => step() * items.length;

    /** Back into the middle copy, onto the same logos. */
    const recentre = () => {
      const width = loop();
      if (view.scrollLeft < width - 1) view.scrollLeft += width;
      else if (view.scrollLeft >= width * 2 - 1) view.scrollLeft -= width;
    };

    let frame = 0;
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      view.removeAttribute('data-sliding');
    };

    const slide = (by: number) => {
      stop();
      recentre();
      const from = view.scrollLeft;
      // From wherever the row is, to the next logo's edge in that direction.
      const to = (Math.round(from / step()) + by) * step();
      if (reduced) {
        view.scrollLeft = to;
        recentre();
        return;
      }
      view.setAttribute('data-sliding', '');
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / SLIDE_MS);
        view.scrollLeft = from + (to - from) * ease(t);
        if (t < 1) frame = requestAnimationFrame(tick);
        else {
          stop();
          recentre();
        }
      };
      frame = requestAnimationFrame(tick);
    };

    // Autoplay, and everything that holds it.
    const holds = new Set<string>();
    const hold = (why: string, on: boolean) => (on ? holds.add(why) : holds.delete(why));
    const timer = reduced ? 0 : window.setInterval(() => holds.size === 0 && slide(1), AUTOPLAY_MS);

    const onClick = (event: MouseEvent) => {
      const button = (event.target as HTMLElement).closest('button');
      if (button?.hasAttribute('data-slider-prev')) slide(-1);
      else if (button?.hasAttribute('data-slider-next')) slide(1);
    };
    const onEnter = (event: PointerEvent) => event.pointerType === 'mouse' && hold('hover', true);
    const onLeave = () => hold('hover', false);
    // Keyboard focus only: a clicked arrow keeps focus after the pointer has left.
    const onFocusIn = (event: FocusEvent) => hold('focus', (event.target as HTMLElement).matches(':focus-visible'));
    const onFocusOut = () => hold('focus', false);
    const onTouchStart = () => {
      stop();
      hold('touch', true);
    };
    const onTouchEnd = () => hold('touch', false);
    const onWheel = (event: WheelEvent) => frame && Math.abs(event.deltaX) > Math.abs(event.deltaY) && stop();

    // A swipe or a trackpad scroll has come to rest: loop it.
    let settle = 0;
    const onScroll = () => {
      clearTimeout(settle);
      hold('scroll', !frame);
      settle = window.setTimeout(() => {
        hold('scroll', false);
        if (!frame && !holds.has('touch')) recentre();
      }, SCROLL_SETTLE);
    };

    const onVisibility = () => hold('hidden', document.hidden);
    const seen = new IntersectionObserver(([entry]) => hold('offscreen', !entry.isIntersecting), { threshold: 0.2 });
    seen.observe(root);
    // A resize changes a logo's width; the row stays on a logo's edge.
    const onResize = () => {
      stop();
      view.scrollLeft = Math.round(view.scrollLeft / step()) * step();
      recentre();
    };

    view.scrollLeft = loop();
    root.addEventListener('click', onClick);
    root.addEventListener('pointerenter', onEnter);
    root.addEventListener('pointerleave', onLeave);
    root.addEventListener('focusin', onFocusIn);
    root.addEventListener('focusout', onFocusOut);
    view.addEventListener('touchstart', onTouchStart, { passive: true });
    view.addEventListener('touchend', onTouchEnd);
    view.addEventListener('touchcancel', onTouchEnd);
    view.addEventListener('wheel', onWheel, { passive: true });
    view.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('resize', onResize);

    return () => {
      stop();
      clearInterval(timer);
      clearTimeout(settle);
      seen.disconnect();
      root.removeEventListener('click', onClick);
      root.removeEventListener('pointerenter', onEnter);
      root.removeEventListener('pointerleave', onLeave);
      root.removeEventListener('focusin', onFocusIn);
      root.removeEventListener('focusout', onFocusOut);
      view.removeEventListener('touchstart', onTouchStart);
      view.removeEventListener('touchend', onTouchEnd);
      view.removeEventListener('touchcancel', onTouchEnd);
      view.removeEventListener('wheel', onWheel);
      view.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
      [...before, ...after].forEach((clone) => clone.remove());
      view.scrollLeft = 0;
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
