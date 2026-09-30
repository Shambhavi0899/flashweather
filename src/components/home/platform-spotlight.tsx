"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

import { onScrollFrame } from "@/lib/scroll";

/** A mouse, the three-column grid, and motion allowed: where the spotlight runs. */
const QUERIES = [
  "(hover: hover) and (pointer: fine)",
  "(min-width: 1024px)",
  "(prefers-reduced-motion: no-preference)",
];

const subscribe = (notify: () => void) => {
  const queries = QUERIES.map((query) => window.matchMedia(query));
  queries.forEach((query) => query.addEventListener("change", notify));
  return () =>
    queries.forEach((query) => query.removeEventListener("change", notify));
};
const enabled = () =>
  QUERIES.every((query) => window.matchMedia(query).matches);

/**
 * The platform grid's cursor spotlight (styles/home.css, "The platform"): a
 * soft light that follows the mouse across the grid, and card borders that
 * brighten as it nears them.
 *
 * All this does is say where the mouse is: `--spot-x` / `--spot-y` on the
 * grid, in its own box, for the light, and on each `.platform-cell`, in
 * that card's box, for its border. `data-spot` is on while the mouse is
 * over the grid. It writes once a frame, and again as the page scrolls
 * under a still mouse. Touch, narrow screens and reduced motion get none of
 * it, and neither does the server: the markup is the finished grid.
 */
export function PlatformSpotlight({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useSyncExternalStore(subscribe, enabled, () => false);

  useEffect(() => {
    const root = ref.current;
    if (!root || !on) return;
    const cards = [...root.querySelectorAll<HTMLElement>(".platform-cell")];

    let frame = 0;
    let x = 0;
    let y = 0;
    let over = false;

    const place = (element: HTMLElement) => {
      const box = element.getBoundingClientRect();
      element.style.setProperty("--spot-x", `${Math.round(x - box.left)}px`);
      element.style.setProperty("--spot-y", `${Math.round(y - box.top)}px`);
    };
    const paint = () => {
      frame = 0;
      if (!over) return;
      place(root);
      cards.forEach(place);
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x = event.clientX;
      y = event.clientY;
      over = true;
      root.toggleAttribute("data-spot", true);
      frame ||= requestAnimationFrame(paint);
    };
    const onLeave = () => {
      over = false;
      root.removeAttribute("data-spot");
    };

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    const stopReading = onScrollFrame(paint);
    return () => {
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      stopReading();
      cancelAnimationFrame(frame);
      root.removeAttribute("data-spot");
      [root, ...cards].forEach((element) => {
        element.style.removeProperty("--spot-x");
        element.style.removeProperty("--spot-y");
      });
    };
  }, [on]);

  return (
    <div ref={ref} className={className}>
      <span aria-hidden className="platform-spot-light" />
      {children}
    </div>
  );
}
