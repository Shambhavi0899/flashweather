import Image from 'next/image';
import Link from 'next/link';

import { site } from '@/lib/seo/site';

/** The bolt, as the design draws it: a clip-path over the metallic gradient. */
export function Bolt({ className = 'h-8 w-6' }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`bolt-shape bg-gold-metallic block shrink-0 ${className}`}
    />
  );
}

/**
 * The two cleaned logo files, one per background. `v` busts caches still
 * holding an older file at the same path; bump it when the art changes.
 */
const files = {
  dark: { src: '/brand/flash-logo-for-dark-bg.png?v=2', width: 731, height: 396 },
  light: { src: '/brand/flash-logo-for-light-bg.png?v=2', width: 733, height: 398 },
} as const;

/** Height only; the width follows the file's own aspect ratio. */
const sizes = {
  nav: 'h-11 md:h-14',
  /** The fixed header's: 44 / 56px, 48 once it compacts (styles/header.css). */
  header: 'site-header-logo-img',
  footer: 'h-20',
  /** The Flash Agent window's title bar (styles/agent-window.css). */
  window: 'h-[26px] md:h-8',
  /** The agent's name on its messages in that window. */
  chat: 'h-[22px] md:h-[26px]',
  /** The dark "We're proactive." sticker (home Comparison, Everyone else vs Flash hero). */
  tag: 'h-6 sm:h-[34px]',
  /** The Flash column's header in the comparison tables. */
  column: 'h-[30px]',
  /** The same column label on a stacked comparison card, below md. */
  label: 'h-[22px]',
} as const;

/**
 * The self-hosted logo, a link home -- it is how every page links to `/`.
 * Pick the variant by the background it sits on: `dark` for navy grounds,
 * `light` for white ones.
 *
 * `link={false}` is the logo as a mark inside something else (the Flash
 * Agent window names the agent with it), where a link home would be out of
 * place; `alt` then says what it stands for there, or is empty where it is
 * decoration.
 *
 * `themed` is for a logo whose ground can change under it (the fixed header
 * of a light page, which turns dark over the page's ending): both files are
 * in the markup, marked `logo-for-dark` and `logo-for-light`, and the
 * stylesheet shows the one for the theme in force (styles/header.css).
 * `variant` is still the one the page opens on, and the one loaded first.
 *
 * `unoptimized` serves the PNG as drawn: the optimizer would re-encode it
 * lossily, which is what puts a fringe on letter edges.
 */
export function Logo({
  variant,
  size = 'nav',
  priority = false,
  themed = false,
  link = true,
  alt = site.name,
}: {
  variant: 'dark' | 'light';
  size?: keyof typeof sizes;
  /** The nav logo is above the fold on every page. */
  priority?: boolean;
  themed?: boolean;
  link?: boolean;
  alt?: string;
}) {
  const shown = themed ? (['dark', 'light'] as const) : [variant];
  const images = shown.map((name) => (
    <Image
      key={name}
      src={files[name].src}
      alt={alt}
      width={files[name].width}
      height={files[name].height}
      unoptimized
      loading={priority && name === variant ? 'eager' : 'lazy'}
      className={`w-auto ${sizes[size]} ${themed ? `logo-for-${name}` : ''}`}
    />
  ));
  if (!link) return <span className="flex shrink-0 items-center">{images}</span>;
  return (
    <Link href="/" className="flex shrink-0 items-center">
      {images}
    </Link>
  );
}
