---
name: add-industry
description: Add a vertical to the Industries programmatic-SEO surface on flash-website — a new industry page with its own title, description, risks, FAQ schema and OG card. Use when asked to add or edit an industry, vertical, or segment page such as marine, mining, aviation or rail.
---

# Add an industry

Thirteen verticals exist because "lightning safety for golf courses" and "hail
alerts for roofing contractors" are different searches, and one Industries page
ranks for neither. Each vertical is a page that targets its own phrase.

**Do not create a route.** If you are about to run `mkdir
src/app/industries-we-serve/marine`, stop — that is the exact mistake this
structure prevents. One entry in `src/content/industries.ts` produces the route
(`/industries-we-serve/<slug>/`), the metadata, the canonical, the OG card, the
Service and FAQ schema, the sitemap entry, its card on the industries index and
its cross-links from every other industry page. The one template is
`src/app/industries-we-serve/[slug]/page.tsx`; its sections live in
`src/components/industries/`.

## The entry

Append to the `industries` array in `src/content/industries.ts`. The core is
required and on its own renders a complete page (navy hero, the three risks,
the FAQ, links to every other industry, the CTA band):

```ts
{
  slug: 'marine',
  name: 'Marine',
  title: 'Lightning alerts for marinas',
  description: '…',
  headline: '…',
  intro: '…',
  risks: ['…', '…', '…'],
  faqs: [{ question: '…', answer: '…' }],
}
```

When the vertical has a Paper design, fill the optional fields too. Each one
turns on a section of the same template; leave out any the design lacks.

```ts
{
  // …the core, as above…
  hero: { theme: 'dark', layout: 'split', asideSide: 'end', eyebrow, lead, image,
          secondary, footnote, aside, illustrative },
  agent: { tab, intro, sourceNote, questions, otherIndustriesNote, answer, tools },
  sections: [ { type: 'cards', … }, { type: 'timeline', … }, { type: 'table', … } ],
  faq: { heading: 'Questions marina managers ask', layout: 'numbered' },
  related: { heading, intro, layout: 'row', links: [{ title, text, href }] },
  cta: { eyebrow: 'Book a demo · No sensors to install' },
  card: { summary: '…', image, tag: 'Lightning · Hail', tone: 'lift' },
  software: { name, description, path },
}
```

## What each field has to do

**`slug`** — permanent. Lowercase, hyphenated, the word a buyer would use.
the slug the live site already ranks for — `parks-rec`, `events-venues` — even where a longer form reads better. Changing it later forfeits the ranking.

**`title`** — **40 characters or fewer.** The layout appends
` | Flash Weather AI` (19 characters) and Google truncates the whole thing past
about 60. Lead with the hazard and the audience: "Hail prediction for roofing
crews". Not the company name — the suffix already carries it.

**`description`** — 140–158 characters. This is ad copy, not a summary: it is
what decides the click. Name the hazard, the lead time and who it is for. End
with a consequence, not a feature.

**`headline`** — the `<h1>` and the OG card. It does not have to match the
title, and it is better when it does not: the title is for the result page, the
headline is for the person who arrived. Make it concrete — "Pull the crew, then
know which streets were hit", not "Weather intelligence for roofers".

**`intro`** — two sentences at most. Say what the industry's actual problem is
before saying what Flash does about it.

**`risks`** — three, in the industry's own words. These are what they are
buying protection from, not features they are buying.

**`faqs`** — one to five. These become `FAQPage` schema and are what wins the
expandable block in search results, so write the question the way someone would
type it. Answer it in one or two sentences with a number in it where possible.
A vague answer wins nothing. The visible FAQ renders this same list, so the
schema never asserts a question the page does not show; the design's FAQ copy
goes here verbatim, not into `sections`.

## The optional, designed fields

All optional. Copy from the design verbatim; images go in
`public/images/industries/` under the filename the design's SEO panel gives,
with its alt text.

**`hero`** — the opening block. `theme: 'dark'` lays the copy over the photo;
`'light'` puts the photo in a column (and switches the nav to light).
`layout: 'split'` sets the `aside` beside the copy (`asideSide: 'start' | 'end'`),
`'centered'` below it. `aside` is one of: `stat` (a display number, optionally
with hail-size rings), `sites` (a portfolio status table), `field-card` (a WBGT
dial and the day's alerts), `readings` (a row of live values). The `<h1>` is
always `headline`; the hero photo is the page's one preloaded image.
`illustrative: true` prints "Illustrative example · not live weather" with any
mocked-up panel — keep it wherever the design shows it.

**`agent`** — the "Flash Agent · ask" section. `tab` picks which industry tab is
open (the tabs link to those industries' pages). The first of `questions` is
the one answered; `answer.chart` names a chart drawn in
`components/industries/agent-charts.tsx` — a new chart is a new component
there plus its key in the `AgentChart` type, never an image.

**`sections`** — the body, in design order. Each is one of these types:

| `type` | For |
|---|---|
| `cards` | image cards; `variant` `boxed` (default), `open` (partner features), `chain` (numbered steps with arrows) |
| `timeline` | a storm day or practice day; `layout` `row` or `column` (with an optional photo) |
| `table` | comparisons and logs; first column is the row header; cells can be `status`, `verdict` or `hail` |
| `figure` | a mock-up exported from Paper as PNG, with its legend as real text |
| `bands` | a policy's threshold bands plus a list of related policies |
| `calendar` | which model is active in which month, as a table |
| `stats` | a row of display numbers with a sourced note |
| `strip` | one stat, a photo and a paragraph, with a link or a small readings table |
| `press` | named coverage, explained rather than logo-walled |

`tone` (`light`, `sunken`, `dark`, `deep`) sets the background. When
`sections` is present the generic risks block is not rendered — the designed
body replaces it — but still fill `risks` in the industry's own words.

**`faq`** — the FAQ's heading, an optional intro and link, and `layout`
(`numbered`, `split`, `grid`, `rows`). Questions still come from `faqs`.

**`related`** — the design's "next for this buyer" links. Only link to routes
that exist: paths in `src/content/routes.ts`, other `/industries-we-serve/<slug>/`
pages, or `/products/#…` anchors for products without a page.

**`cta`** — overrides for the closing blue band; anything omitted keeps the
default copy.

**`card`** — what the industries index shows for the vertical. `summary` is the
one line on its row (falls back to `headline`). `image` is its photo (the hub
hero card uses it): a dusk or storm photo in natural colour; leave it out
rather than use a stand-in. `tag` names the hazards the buyer watches, taken
from the page copy (`'Lightning · Heat'`); the sector panel lists them at its
foot. `tone` evens out a photo that is darker (`'lift'`) or lighter (`'dim'`)
than the set.

**Sector** — add the new slug to exactly one entry of `industrySectors` at the
end of `industries.ts` (Fields & venues, Sites & crews, Land, turf & risk). The
index panels are built from it, and the build fails if a vertical is in none
or in two.

**`software`** — a named product the vertical is sold (the Agronomy Suite);
adds `SoftwareApplication` schema beside `Service`.

## Accuracy

The product claims are fixed and must not drift between pages: **99.6%**
lightning accuracy, **55 minutes** hail lead time, **1km × 1km** resolution,
**2-minute** lightning refresh (hail updates every **5 minutes**). Do not invent a figure for a new vertical.

## Verify

```sh
npm run build && npm run seo
```

The audit will tell you if the title or description is over length. It reads
the rendered HTML, so it measures the title *including* the brand suffix.
