'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

import { BOLT_PATH } from '@/components/bolt-path';
import { onScrollFrame } from '@/lib/scroll';

/**
 * The Flash Agent launcher (C03), pinned bottom-right on every page. The
 * pill is the one exception to the 4px control radius. It links to the agent
 * page rather than opening a widget: there is no widget to open yet, and a
 * link is something a crawler can follow.
 *
 * It steps aside -- slides down out of view -- while anything marked
 * `data-launcher-clear` would sit under it, such as the home hero's
 * "Product imagery" caption or the footer's links, and comes back once that
 * has scrolled past. Its resting box is worked out from its own right/bottom
 * offsets, so the check holds at every width and viewport height.
 *
 * It is in the root layout, so it outlives the page: what is marked is
 * looked up on each check, not once, or a page reached by a link would be
 * checked against the page before it.
 */
export function AgentLauncher() {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const launcher = ref.current;
    if (!launcher) return;

    const check = () => {
      const style = getComputedStyle(launcher);
      const right = window.innerWidth - parseFloat(style.right);
      const bottom = window.innerHeight - parseFloat(style.bottom);
      const left = right - launcher.offsetWidth;
      const top = bottom - launcher.offsetHeight;
      const gap = 8;
      const clear = document.querySelectorAll<HTMLElement>('[data-launcher-clear]');
      const covered = [...clear].some((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.right > left - gap && r.left < right + gap && r.bottom > top - gap && r.top < bottom + gap;
      });
      launcher.toggleAttribute('data-aside', covered);
    };
    const stopReading = onScrollFrame(check);
    return () => {
      stopReading();
      launcher.removeAttribute('data-aside');
    };
  }, []);

  return (
    <Link
      ref={ref}
      href="/products/flash-agent/"
      className="agent-launcher fixed right-4 bottom-4 z-30 flex h-14 items-center gap-3 rounded-full border border-border-on-dark bg-brand-navy pr-2 pl-2 shadow-[0_8px_24px_rgb(7_13_38/0.28)] hover:brightness-110 sm:right-8 sm:bottom-8 sm:pr-[22px]"
    >
      <span className="bg-gold-metallic flex size-10 shrink-0 items-center justify-center rounded-full">
        <svg width="16" height="22" viewBox="0 0 26 34" aria-hidden>
          <path d={BOLT_PATH} fill="#070D26" />
        </svg>
      </span>
      <span className="hidden flex-col gap-px sm:flex">
        <span className="text-micro font-semibold tracking-[0.06em] text-text-on-dark">FLASH AGENT</span>
        <span className="text-micro text-text-on-dark-muted">Ask. Answer. Act — in your tools.</span>
      </span>
      <span className="sr-only sm:hidden">Flash Agent</span>
      <span aria-hidden className="ml-1 hidden size-2 shrink-0 rounded-full bg-alert-clear sm:block" />
    </Link>
  );
}
