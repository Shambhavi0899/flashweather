'use client';

import { useEffect, useRef, useState } from 'react';

import { glossaryId } from '@/content/why-flash';
import { scrollToCentre } from '@/lib/scroll';

/** How long an arrived-at term stays highlighted. */
const FLASH_MS = 1500;
/** How long "Link copied" shows. */
const COPIED_MS = 1600;

/**
 * The prediction-vs-sensors glossary: a "Find a term" filter over one list of
 * terms (styles/why-flash-glossary.css).
 *
 *   filter    typing hides rows whose term and definition both miss, and marks
 *             the matching text; "No matching term" when none is left
 *   anchors   every row has an id (glossaryId) and a copy-link button, shown
 *             on row hover or focus
 *   arrival   a #term-… link (the stack's sidenotes) clears a filter that hides
 *             the term, scrolls to it and highlights it for 1.5s
 *   reveal    rows below the fold fade in once as they scroll in
 *
 * The rows flow down the first column and then the second, split evenly over
 * however many are left. The HTML is the full list, so without JavaScript it
 * is a plain glossary. Reduced motion: no fade, and the highlight is a still
 * tint for the same 1.5s (CSS).
 */
export function Glossary({ terms }: { terms: { term: string; definition: string }[] }) {
  const [query, setQuery] = useState('');
  const [flash, setFlash] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [announce, setAnnounce] = useState('');
  const listRef = useRef<HTMLDListElement>(null);
  const pendingScroll = useRef<string | null>(null);

  const needle = query.trim().toLowerCase();
  const visible = terms.filter(
    (t) => !needle || t.term.toLowerCase().includes(needle) || t.definition.toLowerCase().includes(needle),
  );
  const shown = new Set(visible.map((t) => t.term));
  const rows = Math.ceil(visible.length / 2);

  // Arriving on a term, from a sidenote link or a shared URL.
  useEffect(() => {
    const arrive = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const item = terms.find((t) => glossaryId(t.term) === id);
      if (!item) return;
      const row = document.getElementById(id);
      if (row?.dataset.reveal === 'idle') row.dataset.reveal = 'shown';
      // Hidden by the filter: show everything, then scroll once it has laid out.
      if (row?.hidden) {
        pendingScroll.current = id;
        setQuery('');
      }
      setFlash(null);
      requestAnimationFrame(() => setFlash(id));
    };
    // The same sidenote twice leaves the hash unchanged, so no hashchange.
    const again = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#term-"]');
      if (link && link.hash === window.location.hash) arrive();
    };
    arrive();
    window.addEventListener('hashchange', arrive);
    document.addEventListener('click', again);
    return () => {
      window.removeEventListener('hashchange', arrive);
      document.removeEventListener('click', again);
    };
  }, [terms]);

  useEffect(() => {
    const id = pendingScroll.current;
    if (!id) return;
    pendingScroll.current = null;
    const row = document.getElementById(id);
    if (row) scrollToCentre(row);
  });

  useEffect(() => {
    if (!flash) return;
    const timer = window.setTimeout(() => setFlash(null), FLASH_MS);
    return () => clearTimeout(timer);
  }, [flash]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(null), COPIED_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  // Fade in once: only rows still below the fold wait for the scroll.
  useEffect(() => {
    const list = listRef.current;
    if (!list || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const waiting = [...list.querySelectorAll<HTMLElement>('.gl-row')].filter(
      (row) => row.getBoundingClientRect().top > window.innerHeight && !row.dataset.reveal,
    );
    waiting.forEach((row) => (row.dataset.reveal = 'idle'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .forEach((entry, order) => {
            const row = entry.target as HTMLElement;
            row.style.setProperty('--gl-delay', `${order * 70}ms`);
            row.dataset.reveal = 'in';
            observer.unobserve(row);
          });
      },
      { threshold: 0.2 },
    );
    waiting.forEach((row) => observer.observe(row));
    return () => {
      observer.disconnect();
      waiting.forEach((row) => {
        if (row.dataset.reveal === 'idle') delete row.dataset.reveal;
      });
    };
  }, []);

  const copyLink = async (id: string, term: string) => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(id);
      setAnnounce(`Link to ${term} copied`);
    } catch {
      // No clipboard (an insecure origin, a denied permission): put the link
      // in the address bar instead, without jumping.
      window.history.replaceState(null, '', `#${id}`);
      setAnnounce(`Couldn't copy. The link to ${term} is in the address bar.`);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
        <div className="gl-search">
          <label htmlFor="glossary-search" className="sr-only">
            Find a term
          </label>
          <svg aria-hidden className="gl-search-icon" width="18" height="18" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="m16 16 4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            id="glossary-search"
            type="search"
            placeholder="Find a term"
            autoComplete="off"
            spellCheck={false}
            aria-controls="glossary-list"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape' && query) {
                e.preventDefault();
                setQuery('');
              }
            }}
            className="gl-search-input"
          />
          {query && (
            <button type="button" className="gl-search-clear" aria-label="Clear search" onClick={() => setQuery('')}>
              <svg aria-hidden width="14" height="14" viewBox="0 0 14 14">
                <path d="m3 3 8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
        <p aria-live="polite" className="text-body-s leading-body-s text-text-muted">
          {needle ? `${visible.length} of ${terms.length} terms` : `${terms.length} terms`}
        </p>
      </div>

      <dl
        ref={listRef}
        id="glossary-list"
        className="gl-list"
        data-rows={Math.max(rows, 1)}
      >
        {terms.map((item) => {
          const id = glossaryId(item.term);
          const index = visible.indexOf(item);
          return (
            <div
              key={item.term}
              id={id}
              hidden={!shown.has(item.term)}
              className="gl-row"
              data-last={index === visible.length - 1 || undefined}
              data-col-end={index === rows - 1 || undefined}
              data-flash={flash === id || undefined}
            >
              <dt className="text-body leading-body-s font-semibold text-text sm:w-[180px] sm:shrink-0">
                <Marked text={item.term} needle={needle} />
                <button
                  type="button"
                  className="gl-copy"
                  aria-label={`Copy link to ${item.term}`}
                  onClick={() => copyLink(id, item.term)}
                >
                  <svg aria-hidden width="16" height="16" viewBox="0 0 24 24">
                    <path
                      d="M10 14a4.5 4.5 0 0 0 6.4 0l3.2-3.2a4.5 4.5 0 0 0-6.4-6.4l-1 1M14 10a4.5 4.5 0 0 0-6.4 0l-3.2 3.2a4.5 4.5 0 0 0 6.4 6.4l1-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  {copied === id && (
                    <span aria-hidden className="gl-copied">
                      Link copied
                    </span>
                  )}
                </button>
              </dt>
              <dd className="text-[15px] leading-body-s text-text-muted">
                <Marked text={item.definition} needle={needle} />
              </dd>
            </div>
          );
        })}
      </dl>

      {visible.length === 0 && (
        <p className="flex flex-wrap items-center gap-x-3 text-body text-text-muted">
          No matching term.
          <button
            type="button"
            className="inline-flex min-h-11 items-center font-semibold text-brand-blue hover:underline"
            onClick={() => setQuery('')}
          >
            Clear search
          </button>
        </p>
      )}

      <p aria-live="polite" className="sr-only">
        {announce}
      </p>
    </div>
  );
}

/** The text with every case-insensitive match of `needle` in a <mark>. */
function Marked({ text, needle }: { text: string; needle: string }) {
  if (!needle) return text;
  const parts: React.ReactNode[] = [];
  const lower = text.toLowerCase();
  let from = 0;
  for (let at = lower.indexOf(needle); at !== -1; at = lower.indexOf(needle, from)) {
    if (at > from) parts.push(text.slice(from, at));
    parts.push(
      <mark key={at} className="gl-mark">
        {text.slice(at, at + needle.length)}
      </mark>,
    );
    from = at + needle.length;
  }
  parts.push(text.slice(from));
  return parts;
}
