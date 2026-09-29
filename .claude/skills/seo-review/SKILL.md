---
name: seo-review
description: Audit the SEO health of flash-website before shipping — run the automated checks, then the judgement calls a script cannot make. Use before a deploy, after adding or changing pages, or when asked to check SEO, check metadata, or find why a page is not ranking.
---

# SEO review

Two halves. The script catches what is mechanically checkable; the rest needs
reading. Do both — a clean script run on badly written titles is a site that is
technically perfect and still does not rank.

## 1. The automated pass

```sh
npm run build && npm run seo
```

`scripts/seo-audit.mjs` parses the prerendered HTML in `.next/server/app`, so
it checks what a crawler actually receives. Per route it verifies: a `<title>`
within length, a meta description within length, an absolute self-referencing
canonical that is not localhost, the four required `og:` properties, a
`twitter:card`, exactly one `<h1>`, exactly one hero (`data-hero`) whose
`data-theme` is the site header's, and that every JSON-LD block parses and
carries `@context` and `@type`. It then checks every route appears in the
sitemap.

**Errors block a ship. Warnings are length problems** — a truncated title is a
lost click, so fix them unless there is a reason.

## 2. The judgement pass

The script cannot tell whether the words are any good. Read each changed page
and ask:

**Does the title match a real search?** Someone types "lightning alerts for
golf courses". Nobody types "weather intelligence solutions". If the title
would only be found by someone who already knows the company, it is a brand
page, not a landing page.

**Does one page target one phrase?** Two pages competing for the same query
split their own authority and Google picks the weaker one. If two industries
have near-identical titles, either differentiate them or merge them.

**Does the description earn the click?** It is the only ad copy on the results
page. It should name the hazard, the number and the audience, and end on a
consequence rather than a feature list.

**Does the `<h1>` say the same thing as the title?** Not word for word — but a
page titled for hail that opens by talking about lightning is a mismatch, and
it reads as one.

**Is the schema honest?** `FAQPage` on questions nobody asked, or `Article` on
a page with no author or date, is structured data that invites a manual action.
Only assert what the page actually is.

**Is the content thin?** A page with a heading, three bullets and nothing else
is a page Google classes as thin regardless of its markup. Verticals need a
real reason to exist as separate pages.

## 3. What the script does not cover yet

Check these by hand when they become relevant:

- **Internal links.** A page linked from nowhere is a page crawled rarely.
  Every industry should be reachable from `/industries` and from the home page.
- **Core Web Vitals.** Run Lighthouse against a production build (`npm run
  build && npm start`), not the dev server — dev is unoptimised and the numbers
  are meaningless.
- **Redirects.** If a slug changed, there must be a 301 from the old URL. A
  changed slug without one throws the ranking away.
- **`NEXT_PUBLIC_SITE_URL`.** Confirm production is set to the real origin.
  `robots.ts` closes crawlers out of any other origin on purpose, so a
  production deploy with the variable unset will be fully deindexed.

## Report

Say what you checked, what failed, and what you changed. If a warning was left
in place, say why. Do not report "SEO looks good" without the audit output —
the numbers are the finding.
