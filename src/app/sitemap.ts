import type { MetadataRoute } from 'next';

import { posts } from '@/content/blog';
import { heatPolicies } from '@/content/heat-policies';
import { industries } from '@/content/industries';
import { productPagePath, productPages } from '@/content/product-pages';
import { staticRoutes } from '@/content/routes';
import { absoluteUrl } from '@/lib/seo/site';

/**
 * Generated, never hand-maintained.
 *
 * A hand-written sitemap is wrong the day after someone adds a route, and a
 * sitemap that lists URLs which no longer exist is worse than none at all.
 * Every entry here derives from the same data the routes derive from, so the
 * two cannot drift: hand-built routes from `content/routes.ts`, verticals from
 * `content/industries.ts`, secondary products from `content/product-pages.ts`, posts from `content/blog.ts`,
 * state pages from `content/heat-policies.ts`.
 *
 * `lastModified` is a real signal: it is how a crawler decides what to come
 * back for. Posts carry their own dates; everything else is build time, which
 * is honest for a static marketing page.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const industryPages: MetadataRoute.Sitemap = industries.map((industry) => ({
    url: absoluteUrl(`/industries-we-serve/${industry.slug}/`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const productDetailPages: MetadataRoute.Sitemap = productPages.map((page) => ({
    url: absoluteUrl(productPagePath(page.slug)),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/resources/blog/${post.slug}/`),
    lastModified: new Date(post.modified ?? post.published),
    changeFrequency: 'yearly',
    priority: 0.5,
  }));

  const heatPolicyPages: MetadataRoute.Sitemap = heatPolicies.map((policy) => ({
    url: absoluteUrl(`/resources/state-heat-policies/${policy.slug}/`),
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.6,
  }));

  return [...pages, ...productDetailPages, ...industryPages, ...postPages, ...heatPolicyPages];
}
