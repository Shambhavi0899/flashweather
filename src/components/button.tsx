import Link from 'next/link';

import { linksOpenInNewTab } from '@/lib/new-tab';

/**
 * Buttons, per the component sheet (C04): 54px tall, 4px radius, Manrope 800
 * at 14/18 with 0.02em tracking, sentence case. `hero` is the home hero's
 * smaller 13/16 set. Always links -- every CTA on a marketing site goes somewhere,
 * and an <a> is what a crawler follows.
 *
 * Where it opens follows the page, the same rule as <SiteLink>: on a page that
 * calls `openLinksInNewTab()` (the home page) a button that navigates opens in
 * a new tab, and everywhere else it opens in place. An in-page anchor (`#…`)
 * never turns, and `newTab` overrides the page either way.
 */

const variants = {
  /** Gold on dark grounds. The primary action. */
  gold: 'bg-gold-button text-brand-navy hover:brightness-[1.06]',
  /** Secondary on dark grounds. */
  'outline-dark': 'border border-white/45 text-text-on-dark hover:bg-white/8',
  /** Primary on light grounds. */
  blue: 'bg-brand-blue text-text-on-dark hover:bg-brand-blue-hover',
  /** Secondary on light grounds. */
  'outline-light': 'border border-border-strong text-brand-navy hover:bg-neutral-50',
} as const;

const sizes = {
  md: 'h-[54px] px-[22px] text-body-s leading-caption tracking-[0.02em]',
  hero: 'h-[54px] px-[22px] text-caption leading-micro',
  sm: 'h-[44px] px-5 text-body-s leading-caption tracking-[0.02em]',
} as const;

export function ButtonLink({
  href,
  children,
  variant = 'gold',
  size = 'md',
  icon,
  newTab,
  className = '',
}: {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  /** A trailing glyph such as ↗ or →; hidden from screen readers. */
  icon?: string;
  /** Force the answer the page would otherwise give: opens in a new tab, or does not. */
  newTab?: boolean;
  className?: string;
}) {
  const external = /^(https?:\/\/|mailto:)/.test(href);
  const open = newTab ?? (linksOpenInNewTab() && !href.startsWith('#'));
  const classes = `inline-flex shrink-0 items-center justify-center gap-[14px] rounded-xs font-extrabold transition ${variants[variant]} ${sizes[size]} ${className}`;
  const content = (
    <>
      {children}
      {icon && <span aria-hidden>{icon}</span>}
      {open && <span className="sr-only"> (opens in a new tab)</span>}
    </>
  );

  return external ? (
    <a
      href={href}
      className={classes}
      target={open ? '_blank' : undefined}
      rel={open ? 'noopener noreferrer' : 'noopener'}
    >
      {content}
    </a>
  ) : (
    <Link
      href={href}
      className={classes}
      target={open ? '_blank' : undefined}
      rel={open ? 'noopener noreferrer' : undefined}
    >
      {content}
    </Link>
  );
}
