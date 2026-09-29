import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /**
   * Every URL on flashweather.ai ends in a slash, and the canonicals say so.
   * Serving both forms would make two documents of every page; this makes the
   * slashless form a redirect instead.
   */
  trailingSlash: true,

  images: {
    // AVIF first, WebP as the fallback: the photography is the page weight.
    // Development serves WebP only: the dev server's AVIF encoder hung on
    // uncached variants (2026-09-29), leaving photos as empty boxes in any
    // browser that accepts AVIF. Production output is unchanged.
    formats: process.env.NODE_ENV === 'production' ? ['image/avif', 'image/webp'] : ['image/webp'],
    // Required since Next 16. 75 for photography, 90 for UI screenshots
    // where compression artefacts show on text.
    qualities: [75, 90],
  },

  /**
   * Slugs are permanent. Each of these is a URL that has been live somewhere
   * and may hold ranking, so it is a 301 forever -- not something to tidy up.
   */
  async redirects() {
    return [
      // The scaffold's industry routes, before they moved to the URLs the live
      // site already ranks for.
      { source: '/industries', destination: '/industries-we-serve/', permanent: true },
      { source: '/industries/:slug', destination: '/industries-we-serve/:slug/', permanent: true },
      // Scaffold slugs that differed from the live ones.
      { source: '/industries-we-serve/events-and-venues', destination: '/industries-we-serve/events-venues/', permanent: true },
      { source: '/industries-we-serve/parks-and-recreation', destination: '/industries-we-serve/parks-rec/', permanent: true },

      // ── The live WordPress site (flashweather.ai, Sept 2026 sitemap) ──
      // Every URL it published either exists here at the same path or is
      // listed below. Posts lived at the root; they now live under the blog.
      { source: '/prediction-versus-detection', destination: '/resources/blog/lightning-prediction-vs-detection/', permanent: true },
      { source: '/blog-violent-week-midwest-storms-ohio-lightning', destination: '/resources/blog/blog-violent-week-midwest-storms-ohio-lightning/', permanent: true },
      { source: '/remembering-kenya-and-kennedi-glasgow', destination: '/resources/blog/remembering-kenya-and-kennedi-glasgow/', permanent: true },
      { source: '/michigan-man-tragically-dies-after-lightning-strike-in-osceola-county', destination: '/resources/blog/michigan-man-tragically-dies-after-lightning-strike-in-osceola-county/', permanent: true },
      // WordPress archives: categories, authors and feeds, onto the blog.
      { source: '/category/:slug', destination: '/resources/blog/', permanent: true },
      { source: '/author/:slug', destination: '/about-us/', permanent: true },
      { source: '/feed', destination: '/resources/blog/', permanent: true },
      { source: '/comments/feed', destination: '/resources/blog/', permanent: true },
      // Portfolio: Troon has a full case study; the rest were one-line stubs,
      // and the partner list on Press & partners now carries them.
      { source: '/portfolio/troon', destination: '/case-studies/troon/', permanent: true },
      { source: '/portfolio/:slug', destination: '/press-and-partners/', permanent: true },
      { source: '/portfolio_category/:slug', destination: '/press-and-partners/', permanent: true },
      { source: '/partners', destination: '/press-and-partners/', permanent: true },
      // Placeholder pages with no content of their own (an empty video embed,
      // an empty events calendar, a changelog of truncated excerpts, and a
      // component test page).
      { source: '/youtube', destination: '/resources/', permanent: true },
      { source: '/events', destination: '/resources/', permanent: true },
      { source: '/product-updates', destination: '/resources/', permanent: true },
      { source: '/contrast-block', destination: '/why-flash/everyone-else-vs-flash/', permanent: true },

      // Yoast's sitemap files, which Search Console may still have submitted.
      ...['sitemap_index', 'wp-sitemap', 'post-sitemap', 'page-sitemap', 'category-sitemap', 'author-sitemap',
        'chromax_port_cpt-sitemap', 'portfolio_categories-sitemap'].map((name) => ({
        source: `/${name}.xml`,
        destination: '/sitemap.xml',
        permanent: true,
      })),

      // Older addresses from the pre-WordPress site.
      { source: '/blog', destination: '/resources/blog/', permanent: true },
      { source: '/blog/:slug', destination: '/resources/blog/:slug/', permanent: true },
      { source: '/faq', destination: '/resources/frequently-asked-questions/', permanent: true },
      { source: '/about', destination: '/about-us/', permanent: true },
      { source: '/press', destination: '/press-and-partners/', permanent: true },
    ];
  },
};

export default nextConfig;
