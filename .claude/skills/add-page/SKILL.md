---
name: add-page
description: Add a new route to flash-website with its metadata, canonical, OG image, JSON-LD and sitemap entry wired up. Use whenever creating any new page — /pricing, /about, /contact, a product page, a blog index. Not for adding an industry, which has its own skill.
---

# Add a page

A page on this site is not done when it renders. It is done when a crawler can
find it, index it under the right title, and show it correctly when shared.
Five things have to be true, and four of them are invisible in the browser.

## Steps

### 1. Decide the URL first

The slug is permanent. Changing it later costs whatever ranking it earned and
needs a redirect forever. Lowercase, hyphenated, no dates, no IDs, and it
should read as the thing it is: `/lightning-safety`, not `/page-2`.

### 2. Create the route

`src/app/<segment>/page.tsx`. Routes render and nothing else — anything that
is not JSX goes in `src/lib/` or `src/content/`.

```tsx
import { JsonLd, breadcrumbSchema } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Under 40 characters',       // the layout appends " | Flash Weather AI"
  description: 'One sentence, 150 or so characters, that earns the click.',
  path: '/your-segment',
});

export default function Page() {
  return (
    <>
      <SiteHeader tone="dark" />
      <main id="main">
        <JsonLd schema={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Your page', path: '/your-segment' },
        ])} />
        <HeroSection theme="dark" className="relative overflow-hidden bg-brand-navy">
          <div className="hero-copy container-page">
            <p className="hero-eyebrow">The label</p>
            <h1>
              <HeroWords text="One h1, carrying the search intent" />
            </h1>
            <p className="hero-lede">The paragraph.</p>
          </div>
        </HeroSection>
      </main>
    </>
  );
}
```

**Every page opens on one `<HeroSection>`** (`@/components/hero/hero`), which
gives it the hero motion every page shares; the classes it reads are listed at
the top of `src/styles/hero.css`. Its `theme` and the `<SiteHeader tone>` must
be the same, so the fixed header matches the hero it sits over.

**Never hand-write `export const metadata = { ... }`.** `buildMetadata` is what
guarantees the canonical, the OG block and the Twitter card arrive together.

**Never add `'use client'` to a file that exports metadata.** Next ignores the
metadata silently — the page builds, ships, and has none.

### 3. Give the segment an OG image

File-based `opengraph-image` does **not** cascade into nested segments. A new
top-level segment with no card of its own shares nothing when it is posted.

`src/app/<segment>/opengraph-image.tsx`:

```tsx
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/seo/og';
import { site } from '@/lib/seo/site';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage({ eyebrow: site.name, headline: 'Your headline', footer: 'flashweather.ai' });
}
```

### 4. Add it to the sitemap

`src/app/sitemap.ts`. If the page is one of a set driven by data, map over the
data rather than listing URLs — a hand-listed URL is one someone will forget.

### 5. Add the right schema

`BreadcrumbList` on every page below the root. Then whichever the page actually
is — `faqSchema` if it answers questions, `articleSchema` if it has a byline
and a date, `serviceSchema` if it sells something to a named audience. Do not
add `Organization` or `WebSite`; the root layout already asserts those, and
asserting them twice describes two entities.

## Verify

```sh
npm run build && npm run seo
```

`npm run seo` reads the built HTML, so it checks what crawlers receive rather
than what the source intended. It also fails a page with no hero, or whose
header is not in its hero's theme. It must report no errors. Fix warnings unless
you have a reason not to — they are mostly titles and descriptions that will be
truncated in the result.
