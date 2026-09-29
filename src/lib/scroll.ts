import type Lenis from 'lenis';

/**
 * One scroll loop for everything that follows the scroll position: a reader
 * registered here runs once per frame in which the page has scrolled or
 * resized, and once when it registers. Scrubbed motion reads positions here
 * rather than on its own listener, so every piece moves in the same frame.
 *
 * With smooth scrolling on (components/smooth-scroll.tsx) the readers run
 * from Lenis's own scroll event, inside the frame in which it moved the
 * page, so nothing trails it. Without it they run on the frame after a
 * native scroll event.
 */
const readers = new Set<() => void>();
let frame = 0;
let listening = false;
let smooth: Lenis | null = null;

function run() {
  cancelAnimationFrame(frame);
  frame = 0;
  readers.forEach((read) => read());
}

function onResize() {
  frame ||= requestAnimationFrame(run);
}

function onScroll() {
  if (!smooth) frame ||= requestAnimationFrame(run);
}

export function onScrollFrame(read: () => void) {
  readers.add(read);
  if (!listening) {
    listening = true;
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
  }
  read();
  return () => {
    readers.delete(read);
    if (readers.size === 0) {
      listening = false;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };
}

/** Hands the loop to Lenis while smooth scrolling is on. */
export function attachSmoothScroll(lenis: Lenis) {
  smooth = lenis;
  lenis.on('scroll', run);
  return () => {
    lenis.off('scroll', run);
    smooth = null;
  };
}

/**
 * Scrolls an element to the middle of the screen, with whichever scrolling
 * is on: Lenis, or the browser's own smooth scroll.
 */
export function scrollToCentre(element: Element) {
  const box = element.getBoundingClientRect();
  scrollToY(box.top + window.scrollY - (window.innerHeight - box.height) / 2);
}

/** Scrolls the page to a position, with whichever scrolling is on. */
export function scrollToY(top: number) {
  if (smooth) smooth.scrollTo(top);
  else window.scrollTo({ top, behavior: 'smooth' });
}
