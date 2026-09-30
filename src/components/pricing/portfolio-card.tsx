'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type Site = { name: string; meta: string; params: string[]; status: string };

/** "Add a site +" adds two rows at most; then it is the link to the quote form. */
const MAX_ADDED = 2;
/** How long an added site reads "Setting up" before it is "Live". */
const SETUP_MS = 1500;
const ADDED_PARAMS = ['Lightning', 'Heat'];

const chip =
  'flex h-[22px] items-center rounded-sm border border-border-on-dark bg-neutral-900 px-2 text-[11px] leading-[14px] font-medium text-[#C9D1E3]';

/**
 * The per-site portfolio view in the Pricing hero, rebuilt in HTML so its
 * text is crawlable. Its motion is styles/pricing-portfolio.css: the rows
 * fade in one by one after the headline, which is CSS and needs none of
 * this. What is here is "Add a site +": an illustrative row opens at the
 * foot of the table, "Setting up" and then "Live", and the site count
 * follows. Added sites go live in the order they were added, so two counts
 * are the whole state.
 */
export function PortfolioCard({ sites, quoteHref }: { sites: Site[]; quoteHref: string }) {
  const [added, setAdded] = useState(0);
  const [live, setLive] = useState(0);
  const timers = useRef<number[]>([]);
  const quoteLink = useRef<HTMLAnchorElement>(null);
  const focusQuoteLink = useRef(false);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((timer) => clearTimeout(timer));
  }, []);

  // The button that had the focus is gone: the link that replaced it takes it.
  useEffect(() => {
    if (added === MAX_ADDED && focusQuoteLink.current) quoteLink.current?.focus();
  }, [added]);

  const addSite = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (added >= MAX_ADDED) return;
    focusQuoteLink.current = document.activeElement === event.currentTarget;
    setAdded(added + 1);
    timers.current.push(window.setTimeout(() => setLive((n) => n + 1), SETUP_MS));
  };

  const count = sites.length + added;

  return (
    <figure className="pfc hero-visual hero-visual-side min-w-0 lg:w-[544px] lg:shrink xl:shrink-0">
      <figcaption className="sr-only">
        Flash Weather AI portfolio view listing sites with their users, predicted parameters and live status, priced
        per site per year
      </figcaption>
      <div className="overflow-hidden rounded-[20px] border border-border-on-dark bg-brand-navy-deep shadow-[0_1px_2px_#0B13220D,0_24px_48px_#0B132229]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-on-dark px-6 py-[18px]">
          <p className="text-micro font-semibold tracking-label text-text-on-dark-muted">PORTFOLIO · PER SITE, PER YEAR</p>
          <p className="flex items-center gap-2 text-micro font-medium text-neutral-500">
            <span key={count} className="pfc-count text-text-on-dark-muted" data-ticked={added > 0 ? '' : undefined}>
              {count} sites
            </span>
            <span aria-hidden>·</span>
            <span aria-hidden className="size-[6px] rounded-full bg-alert-clear" />
            Live · refreshed 09:42
          </p>
        </div>
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[440px] text-left">
            <thead>
              <tr className="border-b border-border-on-dark text-[11px] leading-[14px] font-semibold tracking-[0.12em] text-neutral-500">
                <th scope="col" className="w-[204px] py-3 pr-4 pl-6 font-semibold">
                  SITE
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold">
                  PARAMETERS
                </th>
                <th scope="col" className="py-3 pr-6 text-right font-semibold">
                  STATUS
                </th>
              </tr>
            </thead>
            <tbody>
              {sites.map((s, i) => (
                <tr key={s.name} className={`pfc-row pfc-row-${i} border-b border-border-on-dark`}>
                  <th scope="row" className="py-[14px] pr-4 pl-6 font-normal">
                    <span className="block text-body-s leading-caption font-medium text-text-on-dark">{s.name}</span>
                    <span className="block text-micro text-neutral-500">{s.meta}</span>
                  </th>
                  <td className="py-[14px] pr-4">
                    <ul className="flex flex-wrap gap-[6px]">
                      {s.params.map((p) => (
                        <li key={p} className={chip}>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td
                    className={`py-[14px] pr-6 text-right text-micro font-medium ${
                      s.status === 'Live' ? 'text-[#3FBF8C]' : 'text-text-on-dark-muted'
                    }`}
                  >
                    {s.status}
                  </td>
                </tr>
              ))}
              {Array.from({ length: added }, (_, i) => (
                <tr key={i} className="pfc-added border-b border-border-on-dark">
                  <th scope="row" className="pr-4 pl-6 font-normal">
                    <AddedCell>
                      <span className="block text-body-s leading-caption font-medium text-text-on-dark">New site</span>
                      <span className="block text-micro text-neutral-500">
                        Illustrative · site {sites.length + i + 1} · all users
                      </span>
                    </AddedCell>
                  </th>
                  <td className="pr-4">
                    <AddedCell>
                      <ul className="flex flex-wrap gap-[6px]">
                        {ADDED_PARAMS.map((p) => (
                          <li key={p} className={chip}>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </AddedCell>
                  </td>
                  <td className="pr-6 text-right text-micro font-medium">
                    <AddedCell>
                      {i < live ? (
                        <span key="live" className="pfc-status" data-state="live">
                          Live
                        </span>
                      ) : (
                        <span key="setup" className="pfc-status inline-flex items-center gap-2" data-state="setup">
                          <span aria-hidden className="pfc-dot size-[6px] rounded-full" />
                          Setting up
                        </span>
                      )}
                    </AddedCell>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 bg-white/3 px-6 py-4 text-caption">
          <span className="text-text-on-dark-muted">Every site · every user included · one renewal date</span>
          {added < MAX_ADDED ? (
            <button
              type="button"
              onClick={addSite}
              className="-my-2 cursor-pointer py-2 font-semibold text-text-on-dark transition-colors hover:text-viz-gold"
            >
              Add a site <span aria-hidden>+</span>
            </button>
          ) : (
            <Link
              ref={quoteLink}
              href={quoteHref}
              className="-my-2 py-2 font-semibold text-text-on-dark transition-colors hover:text-viz-gold"
            >
              Get a quote for your sites <span aria-hidden>→</span>
            </Link>
          )}
        </div>
      </div>
      <p role="status" className="sr-only">
        {added > 0 &&
          `${live < added ? 'New site added, setting up.' : 'New site is live.'} ${count} sites in the portfolio.`}
      </p>
    </figure>
  );
}

/** An added row's cell: the track that opens, the clip, and the content that slides up into it. */
function AddedCell({ children }: { children: React.ReactNode }) {
  return (
    <div className="pfc-cell">
      <div className="pfc-clip">
        <div className="pfc-slide py-[14px]">{children}</div>
      </div>
    </div>
  );
}
