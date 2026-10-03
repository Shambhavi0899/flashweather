import Link from 'next/link';

import { linksOpenInNewTab } from '@/lib/new-tab';

type LinkProps = React.ComponentProps<typeof Link>;

/**
 * The site's content link: <Link> plus the one rule about where it opens.
 *
 * On a page that calls `openLinksInNewTab()` (the home page, src/app/page.tsx)
 * every link rendered through this component opens in a new tab, with
 * `rel="noopener noreferrer"` and "(opens in a new tab)" for screen readers.
 * Everywhere else it is an ordinary <Link>, so a component shared between the
 * home page and another page needs no prop of its own.
 *
 * Two kinds of link are never turned: an in-page anchor (`#…`, which would
 * open a second copy of the page), and anything that passes `newTab`
 * explicitly, which overrides the page either way. The site chrome needs
 * neither: the header, the footer's nav columns and the floating launcher are
 * plain <Link>, and only this component and <ButtonLink> read the flag.
 *
 * The anchor is real and carries a real `target`, so a middle-click or a
 * Cmd/Ctrl-click behaves exactly as the browser means it to, and a
 * programmatic `.click()` (the industry panels follow their card's link that
 * way, components/home/industry-panels.tsx) opens the new tab too.
 */
export function SiteLink({ newTab, href, children, ...props }: LinkProps & { newTab?: boolean }) {
  const anchor = typeof href === 'string' && href.startsWith('#');
  const open = newTab ?? (linksOpenInNewTab() && !anchor);

  return (
    <Link href={href} {...props} target={open ? '_blank' : undefined} rel={open ? 'noopener noreferrer' : props.rel}>
      {children}
      {open && <span className="sr-only"> (opens in a new tab)</span>}
    </Link>
  );
}
