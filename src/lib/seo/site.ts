/**
 * One source of truth for everything the site says about itself.
 *
 * Every piece of SEO output — metadata, canonicals, sitemap, robots, JSON-LD,
 * OG images — reads from here. Change the domain in one place and the whole
 * surface follows. Nothing below should be duplicated into a component.
 */

export const site = {
  name: 'Flash Weather AI',
  /** The company record, as the Contact page states it. */
  legalName: 'Flash Scientific Technology Inc.',
  address: { addressLocality: 'Canton', addressRegion: 'GA', addressCountry: 'US' },
  /** Used where a short label reads better than the full name. */
  shortName: 'Flash',
  /**
   * No trailing slash. `metadataBase` is built from this, and Next composes
   * relative paths against it — a trailing slash produces `//path`.
   *
   * Read from the environment so preview deploys canonicalise to themselves
   * rather than to production, which is what stops Google indexing a preview.
   */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://flashweather.ai').replace(/\/$/, ''),
  /**
   * Under 60 characters INCLUDING the ` | Flash Weather AI` suffix the root
   * layout appends, or Google truncates it. `npm run seo` measures the
   * rendered title, not this string, which is the only measurement that counts.
   */
  title: 'Predict lightning and hail before they strike',
  /** 150–160 characters. Longer is cut off; shorter wastes the slot. */
  description:
    'Flash Weather AI predicts lightning and hail up to an hour ahead at 1km resolution, so outdoor operations clear, cover and resume on evidence.',
  locale: 'en_US',
  /** BCP 47, for <html lang>. Deliberately not the same shape as `locale`. */
  lang: 'en',
  twitter: '@FLASHWeatherAI',
  email: 'support@flashweather.ai',
  foundingDate: '2015',
  /** Sales and demo requests, as the live site publishes it. */
  salesEmail: 'sales@flashweather.ai',
  /** The customer app behind "Log in" (as linked from the live site). */
  appUrl: 'https://app.flashweather.ai/',
  /** Developer documentation for the Flash API. */
  apiDocsUrl: 'https://api.flashweather.ai/docs/',
  /** One link that sends phones to the right app store. */
  appDownloadUrl: 'https://onelink.to/flashweather',
  /**
   * Sameas links for the Organization schema. Search engines use these to
   * reconcile the site with the entity it belongs to.
   */
  social: {
    linkedin: 'https://www.linkedin.com/company/flash-weather-ai/',
    x: 'https://x.com/FLASHWeatherAI',
    youtube: 'https://www.youtube.com/@flashweatherai',
    instagram: 'https://www.instagram.com/flashweatherai/',
    facebook: 'https://www.facebook.com/FLASHWeatherAI',
    tiktok: 'https://www.tiktok.com/@flashweatherai',
  },
} as const;

/**
 * An absolute URL for a path.
 *
 * Canonicals, sitemap entries and JSON-LD all need fully qualified URLs, and
 * hand-concatenating them is how you end up with a canonical pointing at
 * localhost in production.
 */
export function absoluteUrl(path = '/'): string {
  return new URL(path, site.url).toString();
}
