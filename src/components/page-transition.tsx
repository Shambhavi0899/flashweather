'use client';

import { usePathname } from 'next/navigation';
import { ViewTransition } from 'react';

/**
 * The change from one page to the next (styles/hero.css, "Page to page").
 * The page that is leaving fades out over 200ms; the one arriving is already
 * under it, so its hero plays from the first frame. Keyed by the path, so a
 * page always arrives new: two pages of one template (two industries, two
 * posts) replay the hero as any other pair does.
 *
 * The header is a layer of its own (<SiteHeader>) and does not move. A
 * browser without view transitions changes page at once, as before.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <ViewTransition key={pathname} enter="page-enter" exit="page-leave" default="none">
      {children}
    </ViewTransition>
  );
}
