'use client';

import Link from 'next/link';
import { useEffect, useRef, ViewTransition } from 'react';

import { DEMO_HREF, primaryNav } from '@/content/navigation';
import { onScrollFrame } from '@/lib/scroll';
import { site } from '@/lib/seo/site';

import { Logo } from './logo';

/** Past this much scroll the bar compacts (76 -> 64px). */
const SCROLLED = 40;
/**
 * Past this much the bar takes its ground: the spacer under it no longer
 * covers its text, so a first section of the other tone would show through.
 */
const GROUNDED = 24;

/**
 * The global nav (C01 dark, C02 light), fixed to the top of every page.
 *
 * `tone` is the page's header as its Paper design draws it -- dark on pages
 * that open on a hero, light on reading pages -- and it holds for the whole
 * page, whatever section scrolls under the bar. It is also the colour of the
 * spacer that keeps the page's first section out from under the bar.
 *
 * The one exception is the page's ending, the closing band and the footer
 * (<SiteFooter>), which is the same dark ground on every page: while that is
 * under the bar the bar takes its tone (`data-header-tone`), so a light
 * page's bar turns dark over it and back above it. No section inside a page
 * changes the bar.
 *
 * Past 40px the bar compacts (76 -> 64px, logo 56 -> 48px). It takes a
 * translucent, blurred ground of its tone a little earlier, past 24px, where
 * its text starts to leave the spacer, so the text stays readable over
 * anything. The styles are in styles/header.css.
 *
 * Every link is in the HTML, which is what lets a crawler reach every page
 * from every page. Dropdowns open on hover and keyboard focus; the mobile
 * menu is a <details>, so it opens without JavaScript too. With JavaScript
 * it also locks the page behind it and closes on Escape or a link.
 */
export function SiteHeader({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = ref.current;
    const menu = header?.querySelector('details');
    if (!header || !menu) return;

    // Scrolled: a ground, then a compact bar. Over the page's ending: its tone.
    const stopReading = onScrollFrame(() => {
      header.toggleAttribute('data-grounded', window.scrollY > GROUNDED);
      header.toggleAttribute('data-scrolled', window.scrollY > SCROLLED);
      const ending = document.querySelector<HTMLElement>('[data-header-tone]');
      const over = ending && ending.getBoundingClientRect().top <= header.offsetHeight / 2;
      const theme = (over && ending.dataset.headerTone) || tone;
      if (header.dataset.theme !== theme) header.dataset.theme = theme;
    });

    // Mobile menu: lock the page while it is open.
    const lock = () => document.documentElement.classList.toggle('site-menu-open', menu.open);
    const close = () => {
      if (menu.open) menu.open = false;
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menu.open) {
        close();
        menu.querySelector('summary')?.focus();
      }
    };
    const onClick = (event: MouseEvent) => {
      if ((event.target as HTMLElement).closest('nav a')) close();
    };
    const wide = window.matchMedia('(min-width: 1024px)');
    menu.addEventListener('toggle', lock);
    menu.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    wide.addEventListener('change', close);

    return () => {
      stopReading();
      menu.removeEventListener('toggle', lock);
      menu.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
      wide.removeEventListener('change', close);
      document.documentElement.classList.remove('site-menu-open');
      header.dataset.theme = tone;
    };
  }, [tone]);

  return (
    <>
      {/* The bar's height, in the page's top ground: what the fixed bar sits
          over at the top of the page, and what keeps the first section clear. */}
      <div
        aria-hidden
        className={`site-header-spacer border-b ${
          tone === 'dark' ? 'border-border-on-dark bg-brand-navy' : 'border-border bg-neutral-0'
        }`}
      />
      {/* Its own layer in a page transition: the page fades under it. */}
      <ViewTransition name="site-header" share="site-header" default="none">
      <header ref={ref} data-theme={tone} className="site-header">
        <div className="site-header-bar container-page flex items-center justify-between gap-6 xl:!px-24">
          <Logo variant={tone} size="header" priority themed={tone === 'light'} />

          <nav aria-label="Primary" className="hidden h-full lg:block">
            <ul className="flex h-full items-center gap-7 xl:gap-9">
              {primaryNav.map((group) => (
                <li key={group.label} className="group relative flex h-full items-center">
                  <Link
                    href={group.href}
                    className="site-header-link flex h-full items-center text-[15px] leading-caption font-medium"
                  >
                    {group.label}
                  </Link>
                  {group.links.length > 0 && (
                    <ul className="site-header-panel invisible absolute top-full left-1/2 min-w-[240px] -translate-x-1/2 rounded-md border p-2 opacity-0 shadow-xl transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                      {group.links.map((item) => (
                        <li key={item.href}>
                          <Link href={item.href} className="block rounded-sm px-3 py-2 text-body-s">
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-4 sm:gap-6">
            <a href={site.appUrl} className="site-header-muted hidden text-[15px] leading-caption font-medium sm:block">
              Log in
            </a>
            <Link
              href={DEMO_HREF}
              className="site-header-demo hidden h-[44px] items-center px-6 text-body-s leading-caption tracking-[0.02em] sm:flex"
            >
              Book a demo
            </Link>

            <details className="group/menu lg:hidden">
              <summary
                className="site-header-toggle flex size-11 cursor-pointer list-none items-center justify-center rounded-xs border [&::-webkit-details-marker]:hidden"
                aria-label="Menu"
              >
                <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden className="group-open/menu:hidden">
                  <path d="M0 1h20M0 7h20M0 13h20" stroke="currentColor" strokeWidth="2" />
                </svg>
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden className="hidden group-open/menu:block">
                  <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="2" />
                </svg>
              </summary>
              <nav aria-label="Mobile" data-lenis-prevent className="site-header-menu overflow-y-auto px-4 pb-8">
                <ul className="flex flex-col">
                  {primaryNav.map((group) => (
                    <li key={group.label} className="site-header-rule border-b py-3">
                      <Link href={group.href} className="site-header-link block py-1 text-body font-bold">
                        {group.label}
                      </Link>
                      {group.links.length > 0 && (
                        <ul className="mt-1 grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                          {group.links.map((item) => (
                            <li key={item.href}>
                              <Link href={item.href} className="block py-1.5 text-body-s">
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-col gap-3">
                  <Link
                    href={DEMO_HREF}
                    className="site-header-demo flex h-[54px] items-center justify-center text-body-s leading-caption tracking-[0.02em]"
                  >
                    Book a demo
                  </Link>
                  <a href={site.appUrl} className="site-header-muted py-2 text-center text-body-s">
                    Log in
                  </a>
                </div>
              </nav>
            </details>
          </div>
        </div>
      </header>
      </ViewTransition>
    </>
  );
}
