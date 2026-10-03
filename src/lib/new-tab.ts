import { cache } from 'react';

/**
 * Which pages open their content links in a new tab.
 *
 * The home page does. Its sections are a shop window: a visitor who follows
 * "Explore Flash Agent" or "See Flash for golf" should still have the home
 * page behind them. Every other page links normally, in place.
 *
 * The flag is per render, not global: `cache()` is scoped to one request (one
 * prerender at build time), so `openLinksInNewTab()` in a page's body is read
 * only by that page's own tree. A component shared with other pages
 * (<AgentSection>, <ParameterCard>, <IndustryPanelList>, the closing CTA band
 * in <SiteFooter>) therefore needs no prop and no copy of itself -- it links
 * in place everywhere else and opens a new tab on the home page. A page's body
 * runs before any of its children render, so the flag is always set by the
 * time a link reads it.
 *
 * Only <SiteLink> and <ButtonLink> read it, which is what keeps the chrome
 * out of it: the header, the footer's nav columns and the floating launcher
 * are plain <Link> and <a>, so they link in place on every page. `newTab` on
 * either component overrides the page either way, if one ever has to.
 */
const store = cache(() => ({ on: false }));

/** Called at the top of a page that opens its content links in a new tab. */
export function openLinksInNewTab() {
  store().on = true;
}

export function linksOpenInNewTab() {
  return store().on;
}
