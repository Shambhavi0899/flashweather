---
name: seo-copy
description: Write or rewrite titles, meta descriptions, headlines and FAQ copy for flash-website within the limits search results actually impose. Use when writing page copy, fixing length warnings from npm run seo, or when copy reads generic and needs to be made specific.
---

# SEO copy

Copy on this site has two jobs and they are not the same job. The title and
description are ad copy on a results page competing with nine other results.
The headline and body are for someone who already clicked. Writing one as if it
were the other is the commonest failure here.

## The limits

| Field | Limit | Measured how |
|---|---|---|
| `title` | **40 chars** in `industries.ts` | the layout appends ` \| Flash Weather AI` (19), Google cuts at ~60 |
| meta description | **140–158 chars** | cut at ~160; under 70 looks thin |
| `headline` / `<h1>` | no hard limit | it wraps on a phone, so keep it one line of thought |
| FAQ question | phrase it as typed | this is the search query, verbatim |

`npm run seo` measures the **rendered** title, brand suffix included. Trust it
over counting by hand.

## Titles

Lead with the hazard and the audience, because that is what was typed:

- **Good** — `Hail prediction for roofing crews`
- **Good** — `Lightning alerts for golf courses`
- **Bad** — `Weather intelligence for the roofing industry` (nobody searches it, and it is 45)
- **Bad** — `Flash Weather AI for Roofers` (the suffix already says the brand)

Do not put the company name in a page title. Do not use "solutions",
"leveraging", "empowering", "cutting-edge", "revolutionary", or "unlock".

## Descriptions

The structure that works: **hazard → number → audience → consequence.**

> Flash forecasts hail 55 minutes ahead and records where it fell, so roofers
> pull crews safely and canvass the streets that were actually hit.

Hazard (hail), number (55 minutes), audience (roofers), consequence (safe
crews, real canvassing). No adjectives doing work a number could do.

End on what the reader gets to do, not on a feature. "…so crews schedule around
the storm instead of losing a slab" beats "…with advanced predictive alerting".

## Headlines

The `<h1>` is for the person who arrived. Make it concrete and specific to the
vertical — it should be impossible to swap between two industries:

- **Good** — `Pull the crew, then know which streets were hit`
- **Good** — `Sound the horn early, resume play sooner`
- **Bad** — `Weather intelligence for your business` (true of all thirteen)

## FAQ copy

The question is a search query, so write it the way it is typed: "How much
warning does Flash give before hail reaches a field?" — not "Lead time".

The answer is one or two sentences with a number in it. Vague answers win no
featured snippet, and the snippet is the whole reason `FAQPage` schema exists.

## The fixed claims

These numbers are the product and must be identical everywhere: **99.6%**
lightning accuracy, **55 minutes** hail lead time, **1km × 1km** resolution,
**2-minute** lightning refresh, **5-minute** hail refresh. Never round them, never soften them into "up to an hour"
where a specific figure is available, and never invent one for a new vertical.

## Tone

Plain and declarative. Short sentences. Weather is a safety product — crews,
children and crowds are the subject — so confidence reads better than
enthusiasm, and no exclamation marks. Say the mechanism, not the marketing.
