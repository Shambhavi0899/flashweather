import type { MetadataRoute } from 'next';

import { absoluteUrl, site } from '@/lib/seo/site';

/**
 * Crawl rules, and the pointer to the sitemap.
 *
 * Preview deployments are closed to crawlers entirely. A preview that is
 * indexable competes with production for the same content and usually wins
 * the wrong URL into the results -- and no canonical will save you once it
 * has been crawled.
 */
export default function robots(): MetadataRoute.Robots {
  const isProduction = site.url === 'https://flashweather.ai';

  if (!isProduction) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Nothing here is secret; these are just routes with no search value.
      disallow: ['/api/', '/_next/'],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
    host: site.url,
  };
}
