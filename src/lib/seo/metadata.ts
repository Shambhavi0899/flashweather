import type { Metadata } from 'next';

import { absoluteUrl, site } from './site';

type BuildMetadata = {
  title: string;
  description: string;
  /** Route path, leading slash, no domain. Becomes the canonical. */
  path: string;
  /** Omit to fall back to the route's own generated OG image. */
  image?: string;
  /** Excluded from search results, but still crawlable and still linked. */
  noIndex?: boolean;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
};

/**
 * The only way a page should declare its metadata.
 *
 * Writing `export const metadata` by hand on each route is how a site ends up
 * with half its pages missing a canonical and the other half missing an OG
 * image. This makes the complete set the default and the omission deliberate.
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
  type = 'website',
  publishedTime,
  modifiedTime,
}: BuildMetadata): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    // A self-referencing canonical on every page. Without one, any URL that
    // reaches the same content -- a tracking parameter, a trailing slash, an
    // uppercase path -- is a separate document competing with the original.
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      type,
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      // Left undefined on purpose when no image is passed: Next then uses the
      // route's own opengraph-image, which is the better default.
      ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: site.twitter,
      ...(image ? { images: [image] } : {}),
    },
    ...(noIndex
      ? { robots: { index: false, follow: true, googleBot: { index: false, follow: true } } }
      : {}),
  };
}
