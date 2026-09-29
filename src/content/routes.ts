import type { MetadataRoute } from 'next';

/**
 * Every hand-built route on the site, in one list.
 *
 * `sitemap.ts` reads this, so a route that is not here is a route crawlers
 * have to stumble on. Routes generated from data -- the industry pages, the
 * secondary product pages, blog posts, state heat policies -- are NOT listed
 * here; the sitemap maps over their data directly.
 *
 * Paths end in a slash because the site does (`trailingSlash: true`), and
 * they are the URLs the live site already ranks for. Slugs are permanent:
 * changing one here needs a 301 in next.config.ts.
 */

type StaticRoute = {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;
  priority: number;
};

export const staticRoutes: StaticRoute[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },

  // Platform
  { path: '/products/', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/products/lightning-prediction/', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/products/hail-prediction/', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/products/heat-wbgt/', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/products/api-offerings/', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/products/flash-agent/', changeFrequency: 'monthly', priority: 0.8 },

  // Industries (the index; each vertical comes from content/industries.ts)
  { path: '/industries-we-serve/', changeFrequency: 'monthly', priority: 0.8 },

  // Why Flash
  { path: '/why-flash/', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/why-flash/everyone-else-vs-flash/', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/why-flash/prediction-vs-sensors-vs-detection/', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/why-flash/accuracy-method/', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/case-studies/troon/', changeFrequency: 'yearly', priority: 0.6 },

  // Pricing
  { path: '/pricing/', changeFrequency: 'monthly', priority: 0.8 },

  // Resources (each blog post comes from content/blog.ts)
  { path: '/resources/', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/resources/blog/', changeFrequency: 'weekly', priority: 0.6 },
  { path: '/resources/frequently-asked-questions/', changeFrequency: 'monthly', priority: 0.6 },

  // Company
  { path: '/press-and-partners/', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/about-us/', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/contact/', changeFrequency: 'yearly', priority: 0.6 },

  // Legal (live-site URLs, kept as they are)
  { path: '/privacy-policy/', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/flash-weather-ai-legal-information/', changeFrequency: 'yearly', priority: 0.2 },
];
