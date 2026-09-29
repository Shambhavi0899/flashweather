<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# flash-website

Marketing site for **Flash Weather AI** — AI that predicts lightning and hail up
to an hour before they strike, at 1km resolution, for thirteen industries that
work outdoors.

`CLAUDE.md` is a one-line import of this file. Everything for every agent lives
here; do not start a second instructions file.

## Commands

```sh
npm run dev        # dev server, Turbopack
npm run build      # production build — this is the real check, run it before claiming done
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run seo        # SEO audit over the built output (build first)
```

## Stack

Next.js 16 App Router · React 19 · TypeScript · Tailwind v4 · `schema-dts` for
typed JSON-LD. No UI library — components are local and small.

## The rule that matters most

**This is an SEO-first site.** Traffic is the product. A page that renders
beautifully and cannot be crawled, or that ships without a canonical, is broken
regardless of how it looks.

Concretely, and without exception:

- **Never write `export const metadata` by hand.** Use `buildMetadata()` from
  `@/lib/seo/metadata`. It is the only thing that guarantees a canonical, an OG
  block and a Twitter card together. Hand-rolled metadata is how a site ends up
  with half its pages missing one of the three.
- **Never hardcode a URL or the site name.** Both come from `@/lib/seo/site`.
  `absoluteUrl()` builds fully qualified URLs; string concatenation does not
  survive a domain change.
- **Every route goes in the sitemap.** `src/app/sitemap.ts` derives from the
  same data the routes derive from, so adding a route means adding its data —
  never hand-listing a URL.
- **One `<h1>` per page**, and it carries the page's search intent.
- **Metadata is Server-Component only.** Adding `'use client'` to a file that
  exports `metadata` makes Next silently ignore it. Silently.

## Structure

```
src/
  app/                      routes only — no business logic
    layout.tsx              root metadata, Organization + WebSite JSON-LD (once, here)
    sitemap.ts robots.ts    generated, never hand-edited
    opengraph-image.tsx     1200x630, generated per route
    industries-we-serve/[slug]/  one template, thirteen pages
  content/                  the data routes are built from
    routes.ts               every hand-built route (the sitemap reads it)
    industries.ts           the thirteen verticals
    blog.ts heat-policies.ts  posts and state pages
  lib/seo/
    site.ts                 single source of truth for name, url, socials
    metadata.ts             buildMetadata() — the only metadata path
    jsonld.tsx              typed schema builders + the <JsonLd> component
  components/               presentational, local, no data fetching
```

**Where things go.** Routes render; they do not hold logic. Anything a route
needs that is not JSX belongs in `lib/` or `content/`. Content that will grow —
industries today, products and posts tomorrow — is data in `content/`, never
thirteen hand-written pages.

## Adding content

Adding a vertical is one entry in `src/content/industries.ts`. The route, the
metadata, the canonical, the OG image, the FAQ schema and the sitemap entry all
follow from it. If you find yourself creating `src/app/industries-we-serve/roofing/`,
stop — that is the mistake this structure exists to prevent.

## URLs

Every path ends in a slash (`trailingSlash: true`) and matches the live site's
URLs. Pass paths with the slash to `buildMetadata`, breadcrumbs and schema.
Never link to a route that does not exist; the redesign audit exists partly
because the old site did.

## JSON-LD

`Organization` and `WebSite` are asserted once, in the root layout. Do not
repeat them per page — that asserts the same entity twice. Per-page schema is
`BreadcrumbList`, plus whichever of `FAQPage` / `Service` / `Article` the page
actually is. Typed against `schema-dts`, so a mistyped property fails the build
rather than surfacing in Search Console weeks later.

## Definition of done

`npm run build` passes, `npm run typecheck` passes, `npm run seo` reports no
errors. A change is not done because it looks right in the browser.

## Environment

`NEXT_PUBLIC_SITE_URL` sets the canonical origin. Preview deployments must set
their own — `robots.ts` closes crawlers out of any origin that is not
production, because an indexable preview competes with the site it previews.
