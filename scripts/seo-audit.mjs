#!/usr/bin/env node
/**
 * Audit the SEO surface of the built site.
 *
 * Reads the prerendered HTML that `next build` writes, so it checks what
 * search engines will actually receive rather than what the source intended.
 * A component can look correct and still emit no canonical; only the output
 * settles it.
 *
 *   npm run build && npm run seo
 *
 * Exits non-zero on an error, zero on warnings. Wire it into CI as a gate.
 */

import { readFileSync, existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const APP_DIR = '.next/server/app';

/** Google truncates a title past roughly this width; under it is a wasted slot. */
const TITLE = { min: 15, max: 60 };
/** Descriptions below 70 characters look thin; above 160 get cut. */
const DESCRIPTION = { min: 70, max: 160 };

/**
 * The origin this build was made for, taken from the sitemap rather than from
 * the environment — the sitemap is built output, so it is the origin the build
 * actually used, not the one this shell happens to have.
 */
let expectedOrigin = null;

const errors = [];
const warnings = [];

const fail = (page, message) => errors.push(`${page}: ${message}`);
const warn = (page, message) => warnings.push(`${page}: ${message}`);

async function htmlFiles(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await htmlFiles(path)));
    else if (entry.name.endsWith('.html')) found.push(path);
  }
  return found;
}

/** The route a prerendered file corresponds to. */
function routeFor(file) {
  const rel = relative(APP_DIR, file).replace(/\.html$/, '').split(sep).join('/');
  return rel === 'index' ? '/' : `/${rel}`;
}

const pick = (html, re) => html.match(re)?.[1]?.trim();

function audit(file) {
  const route = routeFor(file);
  // Next's own error and not-found shells carry no marketing metadata and are
  // not meant to rank. Auditing them only produces noise.
  if (route.startsWith('/_')) return;

  const html = readFileSync(file, 'utf8');

  const title = pick(html, /<title[^>]*>([^<]*)<\/title>/i);
  if (!title) fail(route, 'no <title>');
  else if (title.length > TITLE.max) warn(route, `title is ${title.length} chars, over ${TITLE.max} — Google will truncate it`);
  else if (title.length < TITLE.min) warn(route, `title is only ${title.length} chars`);

  const description = pick(html, /<meta name="description" content="([^"]*)"/i);
  if (!description) fail(route, 'no meta description');
  else if (description.length > DESCRIPTION.max) warn(route, `description is ${description.length} chars, over ${DESCRIPTION.max}`);
  else if (description.length < DESCRIPTION.min) warn(route, `description is only ${description.length} chars`);

  // A self-referencing canonical, absolute. A relative one is ignored by some
  // crawlers, and a missing one lets every parameterised variant compete.
  const canonical = pick(html, /<link rel="canonical" href="([^"]*)"/i);
  if (!canonical) {
    fail(route, 'no canonical');
  } else if (!canonical.startsWith('http')) {
    fail(route, `canonical is not absolute: ${canonical}`);
  } else if (expectedOrigin && !canonical.startsWith(expectedOrigin)) {
    // The real defect: a page canonicalising somewhere other than where the
    // rest of the build points. That splits the site across two origins.
    fail(route, `canonical origin is not ${expectedOrigin}: ${canonical}`);
  }

  for (const property of ['og:title', 'og:description', 'og:image', 'og:url']) {
    if (!html.includes(`property="${property}"`)) fail(route, `no ${property}`);
  }
  if (!html.includes('name="twitter:card"')) warn(route, 'no twitter:card');

  // Exactly one h1. Zero leaves the page's subject implicit; more than one
  // splits it.
  const h1s = html.match(/<h1[\s>]/gi)?.length ?? 0;
  if (h1s === 0) fail(route, 'no <h1>');
  else if (h1s > 1) fail(route, `${h1s} <h1> elements — there must be exactly one`);

  // The fixed header sits over the hero, so it has to be in the hero's theme
  // from the first paint: a light bar over a navy hero is unreadable until
  // something scrolls. Every page opens on exactly one hero.
  const heroes = [...html.matchAll(/<(?:section|header)\b[^>]*\bdata-hero\b[^>]*>/gi)];
  const headerTheme = pick(html, /<header\b[^>]*\bdata-theme="([^"]*)"[^>]*class="site-header"/i);
  if (heroes.length !== 1) {
    fail(route, `${heroes.length} hero sections (data-hero) — there must be exactly one`);
  } else {
    const heroTheme = heroes[0][0].match(/data-theme="([^"]*)"/)?.[1];
    if (!heroTheme) fail(route, 'hero has no data-theme');
    else if (!headerTheme) fail(route, 'no site header with a data-theme');
    else if (heroTheme !== headerTheme) fail(route, `header is ${headerTheme} over a ${heroTheme} hero`);
  }

  // Structured data must parse. Invalid JSON-LD is silently discarded by
  // Google, which looks identical to having none.
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (blocks.length === 0) warn(route, 'no JSON-LD');
  for (const [, body] of blocks) {
    try {
      const parsed = JSON.parse(body.replace(/\\u003c/g, '<'));
      if (!parsed['@context']) fail(route, 'JSON-LD block has no @context');
      if (!parsed['@type']) fail(route, 'JSON-LD block has no @type');
    } catch {
      fail(route, 'JSON-LD does not parse');
    }
  }

  return route;
}

async function main() {
  if (!existsSync(APP_DIR)) {
    console.error(`No build found at ${APP_DIR}. Run \`npm run build\` first.`);
    process.exit(1);
  }

  // Establish the build's own origin before auditing anything against it.
  const sitemapPath = join(APP_DIR, 'sitemap.xml.body');
  if (existsSync(sitemapPath)) {
    const firstLoc = readFileSync(sitemapPath, 'utf8').match(/<loc>(https?:\/\/[^/<]+)/)?.[1];
    if (firstLoc) expectedOrigin = firstLoc;
  }

  // A local build canonicalising to localhost is correct, and is exactly what
  // stops a tunnelled dev server being indexed. It is only a defect if this
  // build is going to production, which this script cannot know -- so it says
  // so once, loudly, rather than failing fifteen routes for it.
  const isLocal = expectedOrigin ? /localhost|127\.0\.0\.1/.test(expectedOrigin) : false;

  const files = await htmlFiles(APP_DIR);
  const routes = files.map(audit).filter(Boolean).sort();

  // Every prerendered route should be in the sitemap. A page that exists and
  // is not listed is a page the crawler has to stumble on.
  if (existsSync(sitemapPath)) {
    const sitemap = readFileSync(sitemapPath, 'utf8');
    for (const route of routes) {
      // The site uses trailing slashes, so /products is listed as /products/.
      const listed = route === '/' || sitemap.includes(`${route}</loc>`) || sitemap.includes(`${route}/</loc>`);
      if (!listed) warnings.push(`sitemap: ${route} is not listed`);
    }
  } else {
    warnings.push('sitemap: no sitemap.xml in the build');
  }

  console.log(`Audited ${routes.length} routes against ${expectedOrigin ?? '(unknown origin)'}.\n`);
  if (isLocal) {
    console.log('  note   this is a LOCAL build — canonicals point at localhost, which is');
    console.log('         correct here and fatal in production. Set NEXT_PUBLIC_SITE_URL.\n');
  }
  for (const w of warnings) console.log(`  warn   ${w}`);
  for (const e of errors) console.log(`  ERROR  ${e}`);

  if (errors.length) {
    console.log(`\n${errors.length} error(s), ${warnings.length} warning(s).`);
    process.exit(1);
  }
  console.log(warnings.length ? `\n${warnings.length} warning(s), no errors.` : '\nClean.');
}

await main();
