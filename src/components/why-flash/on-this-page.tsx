'use client';

import { useEffect, useRef } from 'react';

import { onScrollFrame } from '@/lib/scroll';

/** The reading line, as a share of the screen: the last heading above it is "in view". */
const READING_LINE = 0.3;

/**
 * The accuracy method's "On this page" sidebar, with scrollspy: the link for
 * the section being read is `aria-current="location"`, which
 * styles/why-flash-accuracy.css draws in brand blue with a small gold marker
 * on the rail. Clicking a link is a plain in-page anchor, so Lenis (or the
 * browser, on touch) eases to the heading clear of the fixed header, and it
 * is an instant jump with reduced motion. Without JavaScript it is the same
 * list of links, none marked.
 */
export function OnThisPage({ items }: { items: readonly { id: string; label: string }[] }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = ref.current;
    if (!nav) return;
    const links = [...nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
    const headings = items.map((item) => document.getElementById(item.id));
    const article = headings[0]?.closest('article');

    const read = () => {
      const line = window.innerHeight * READING_LINE;
      // At the very end the last section is short, so it may never reach the line.
      const atEnd = article && article.getBoundingClientRect().bottom <= window.innerHeight + 1;
      let current = atEnd ? headings.length - 1 : -1;
      if (!atEnd) {
        headings.forEach((heading, i) => {
          if (heading && heading.getBoundingClientRect().top <= line) current = i;
        });
      }
      links.forEach((link, i) => {
        if (i === current) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    };

    const stop = onScrollFrame(read);
    return () => {
      stop();
      links.forEach((link) => link.removeAttribute('aria-current'));
    };
  }, [items]);

  return (
    <nav ref={ref} aria-label="On this page" className="lg:w-[240px] lg:shrink xl:shrink-0">
      <div className="flex flex-col gap-[2px] pt-[10px] lg:sticky lg:top-24">
        <p className="pb-3 text-[11px] leading-[14px] font-bold tracking-[0.13em] text-text-muted uppercase">
          On this page
        </p>
        <ul className="flex flex-col gap-[2px]">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="wam-toc-link flex min-h-[30px] items-center gap-3 border-l-2 border-border py-[5px] pl-3 text-body-s leading-5 text-text-muted hover:border-brand-blue hover:text-brand-blue"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
