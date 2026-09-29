# flash-website

Marketing site for [Flash Weather AI](https://flashweather.ai) — AI that
predicts lightning and hail up to an hour before they strike, at 1km
resolution, for thirteen industries that work outdoors.

The product's claims, which appear throughout the copy and must stay
consistent: **99.6%** lightning accuracy, **55 minutes** hail lead time,
**1km × 1km** spatial resolution, **2-minute** lightning refresh (the hail model
updates every **5 minutes**, as flashweather.ai publishes it).

---

## Getting started

```sh
npm install
cp .env.example .env.local
npm run dev
```

Then open http://localhost:3000.

Set `NEXT_PUBLIC_SITE_URL` in `.env.local` to the origin you are actually
serving from — `http://localhost:3000`, or whatever port you are on. It is not
cosmetic: canonicals, the sitemap, JSON-LD and OG image URLs are all built from
it, and `robots.ts` reads it to decide whether to let crawlers in.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server, Turbopack |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run seo` | SEO audit over the built output — **build first** |
| `npm run check` | typecheck → lint → build → seo. **This is the gate.** |

`npm run check` is what CI should run and what "done" means. A change that has
only been looked at in a browser is not done: four of the five things a page
must get right are invisible there.

## Stack

| | |
|---|---|
| Framework | Next.js 16.3 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| Language | TypeScript (strict) |
| Structured data | `schema-dts` — typed JSON-LD |
| Fonts | Geist / Geist Mono via `next/font` |

No component library. Components are local, small, and presentational.

---

## How it is organised

```
src/
  app/                          routes only — they render, they hold no logic
    layout.tsx                  root metadata, Organization + WebSite JSON-LD
    page.tsx                    home
    opengraph-image.tsx         1200x630 share card for /
    sitemap.ts  robots.ts       generated, never hand-edited
    logo.png/route.tsx          the raster logo Organization schema points at
    products/  pricing/  contact/  about-us/  press-and-partners/  ...
                                hand-built pages, one folder each, each with
                                its own opengraph-image.tsx
    industries-we-serve/
      page.tsx                  the index of thirteen
      opengraph-image.tsx       share card for /industries-we-serve/
      [slug]/
        page.tsx                one template, thirteen pages
        opengraph-image.tsx     a card per vertical
    resources/blog/[slug]/      one template, a page per post
    resources/state-heat-policies/[state]/
                                one template, a page per state
  content/
    routes.ts                   every hand-built route; the sitemap reads it
    navigation.ts               the global nav and footer links
    industries.ts               the thirteen verticals, as data
    blog.ts  heat-policies.ts   posts and state pages, as data
    …                           page copy for the hand-built pages
  lib/seo/
    site.ts                     single source of truth: name, url, socials
    metadata.ts                 buildMetadata() — the only metadata path
    jsonld.tsx                  typed schema builders + the <JsonLd> component
    og.tsx                      the shared OG card renderer
  components/                   presentational, local, no data fetching;
                                shared chrome at the top level, one folder per area
scripts/
  seo-audit.mjs                 the audit behind `npm run seo`
```

**Where things go.** Routes render; they do not hold logic. Anything a route
needs that is not JSX belongs in `lib/` or `content/`. Content that will grow —
industries today, products and posts tomorrow — is data in `content/`, never a
folder of near-identical hand-written pages.

---

## The SEO system

Traffic is the product, so the metadata surface is load-bearing rather than
decoration. Three rules, and the code is arranged so that following them is
easier than not.

### 1. Metadata has exactly one path

```tsx
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Under 40 characters',
  description: 'One sentence, ~150 characters, that earns the click.',
  path: '/your-segment',
});
```

`buildMetadata()` emits the title, description, **self-referencing canonical**,
Open Graph block and Twitter card together. Hand-writing `export const metadata
= { ... }` is how a site ends up with half its pages missing a canonical and
the other half missing an OG image — each individually easy to forget, and none
of them visible in the browser.

The root layout sets `metadataBase` and a title template (`%s | Flash Weather
AI`), so pages declare only their own title and never repeat the brand.

### 2. Nothing hardcodes a URL or the site name

Both come from `src/lib/seo/site.ts`. `absoluteUrl(path)` builds fully
qualified URLs. String concatenation does not survive a domain change, and a
canonical pointing at the wrong origin hands your traffic away.

### 3. Repeating content is data, not files

The thirteen verticals are entries in `src/content/industries.ts`. One template
at `app/industries-we-serve/[slug]/page.tsx` renders them, and the route, canonical, OG
card, FAQ schema and sitemap entry all derive from the same entry.

This is the programmatic-SEO surface, and it is the main reason the site is
shaped this way. "Lightning safety for golf courses" and "hail alerts for
roofing contractors" are different searches; a single Industries page ranks for
neither, while thirteen targeted pages can each rank for their own phrase.

### Structured data

`Organization` and `WebSite` are asserted **once**, in the root layout —
repeating them per page asserts the same entity twice. Per-page schema is
`BreadcrumbList`, plus whichever the page actually is:

| Helper | Use for |
|---|---|
| `breadcrumbSchema()` | every page below the root |
| `faqSchema()` | pages that answer questions — wins the expandable block |
| `serviceSchema()` | a named service for a named audience (the industry pages) |
| `articleSchema()` | anything with a byline and a date |

All typed against `schema-dts`, so a mistyped property fails the build rather
than surfacing in Search Console weeks later.

---

## The audit

`npm run seo` parses the prerendered HTML in `.next/server/app`, so it checks
what a crawler actually receives rather than what the source intended. Per
route it verifies:

- a `<title>`, 15–60 characters **including** the brand suffix
- a meta description, 70–160 characters
- an absolute, self-referencing canonical on the same origin as the rest of the
  build (it takes that origin from the sitemap, so it checks internal
  consistency; a local build canonicalising to localhost is correct and says so)
- `og:title`, `og:description`, `og:image`, `og:url`, and a `twitter:card`
- **exactly one** `<h1>`
- every JSON-LD block parses and carries `@context` and `@type`
- every route appears in `sitemap.xml`

Errors exit non-zero and should block a deploy. Warnings are length problems —
a truncated title is a lost click, so fix them unless there is a reason not to.

It caught a missing OG image and 23 over-length strings the first time it ran,
which is the point: none of that is visible in a browser.

---

## Adding content

### A vertical

One entry in `src/content/industries.ts`. Do **not** create
`src/app/industries-we-serve/<name>/` — that is the mistake the structure exists to
prevent. See the `add-industry` skill for what each field has to do.

### A page

`src/app/<segment>/page.tsx` with `buildMetadata()`, plus an
`opengraph-image.tsx` for the segment, plus an entry in `sitemap.ts`. See the
`add-page` skill.

---

## Gotchas

Things that fail quietly, each of which has already bitten once:

- **`'use client'` silently kills metadata.** Next ignores a `metadata` export
  in a Client Component. No warning, no error — the page just ships without it.
- **OG images do not cascade.** A file-based `opengraph-image` covers its own
  segment, not nested ones. Every top-level segment needs its own; they all
  render through `lib/seo/og.tsx`, so it is three lines. The audit catches any
  segment that forgot.
- **Satori is not a browser.** The OG renderer supports a subset of CSS and
  rejects any element with more than one child that has no explicit `display`.
  `{a} — {b}` is three children — compose the string first.
- **Slugs are permanent.** Changing one forfeits whatever ranking it earned and
  needs a 301 from the old URL, forever.
- **`next dev` rewrites `AGENTS.md`.** It manages the block between the
  `BEGIN:nextjs-agent-rules` / `END` markers. Project conventions live *below*
  it, where regeneration cannot touch them.

---

## Working with agents

`AGENTS.md` holds the conventions — it is the cross-tool standard, and
`CLAUDE.md` is a one-line import of it. Do not start a second instructions
file.

Four skills in `.claude/skills/`, scoped to the work this repo actually gets:

| Skill | For |
|---|---|
| `add-page` | a new route with metadata, OG card, schema and sitemap entry |
| `add-industry` | a vertical added to the programmatic surface |
| `seo-review` | the automated pass, then the judgement calls a script cannot make |
| `seo-copy` | titles, descriptions and headlines within the limits results impose |

---

## Deploying

Set `NEXT_PUBLIC_SITE_URL` to the deployment's own origin.

`robots.ts` serves `Disallow: /` for any origin that is **not** production.
This is deliberate: an indexable preview competes with the site it previews,
and once a preview URL has been crawled no canonical reliably undoes it. The
consequence to remember is the inverse — **a production deploy with the
variable unset will be fully deindexed.** Check it on first deploy.

---

## URLs

Every URL ends in a slash (`trailingSlash: true`), and the paths are the ones
the live flashweather.ai already ranks for: `/products/…/`,
`/industries-we-serve/<slug>/`, `/why-flash/…/`, `/resources/…/`. A hand-built
page is listed in `src/content/routes.ts`; a data-driven one (industry, post,
state) appears in the sitemap from its data. Old URLs 301 in `next.config.ts`.

## Not built yet

Built: every page in the Paper design, plus everything the live WordPress
site published -- the six secondary product pages, `/why-flash/` and
`/resources/` hubs, the privacy policy and legal information (verbatim), and
the three news posts. Every URL in the live site's sitemap either exists here
at the same path or 301s in one hop (`next.config.ts`).

Still to come: an integrations page, a case-studies index, the other blog
articles and state heat policies the design shows as cards, and the demo
form's delivery (`src/lib/demo-request.ts` is an honest stub that sends people
to sales@ until it is wired).

## Styling

Global CSS only. Tailwind utilities, plus named classes in
`src/styles/<area>.css` (imported by `globals.css`, inside
`@layer components`) for what a utility cannot say -- photo grades, gradient
overlays, masks. No component uses `style={...}`; data-driven geometry goes in
SVG attributes. The one exception is the Satori image routes
(`opengraph-image.tsx`, `icon.tsx`, `apple-icon.tsx`, `logo.png`), which render
without a stylesheet.
