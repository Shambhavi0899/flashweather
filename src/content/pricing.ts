/**
 * Pricing page content, as data (Paper "13 · Pricing", copy verbatim).
 *
 * There are no public prices: every plan is quoted per site, per year. That
 * is why the page asserts Product and FAQPage schema but no Offer -- an Offer
 * without a price is a Rich Results error, not a neutral omission.
 */

import type { FaqIcon } from './faq-icons';

export type Plan = {
  id: string;
  eyebrow: string;
  name: string;
  audience: string;
  basis: string;
  basisNote: string;
  featured: boolean;
  includesLabel: string;
  includes: string[];
};

export const plans: Plan[] = [
  {
    id: 'single-site',
    eyebrow: 'Plan 01',
    name: 'Single Site',
    audience: 'One location — a course, a campus, a yard or a jobsite.',
    basis: 'Priced per site, annual',
    basisNote: 'Quoted after a live demo of your own site.',
    featured: false,
    includesLabel: 'Included',
    includes: [
      'Lightning prediction up to 60 minutes ahead, 1 × 1 km cell',
      'Hail prediction up to 55 minutes before hail reaches the site',
      'Flash mobile app for every user at the site',
      'SMS and email alerts',
      'All-clear timer after the last strike',
      'Alert audit log — who was warned, when, and when play resumed',
      '2-minute lightning refresh and 6-hour planning outlook',
    ],
  },
  {
    id: 'portfolio',
    eyebrow: 'Plan 02 · Most common',
    name: 'Portfolio',
    audience: 'Multi-site — a district, a management company, a fleet of yards.',
    basis: 'Priced per site, annual',
    basisNote: 'Quoted from the site list you send us.',
    featured: true,
    includesLabel: 'Everything in Single Site, plus',
    includes: [
      'Weather Command Center — every site on one map',
      'Flash Agent — ask in plain language; actions land in Google Calendar, Slack and Procore',
      'Horn and strobe relay integration',
      'Role-based alerts — athletic trainer, superintendent, foreman',
      'Per-site policy thresholds (lightning radius, WBGT bands)',
      '6-hour WBGT outlook for heat-policy planning',
      'Portfolio-wide audit log and exports',
      'Priority support',
    ],
  },
  {
    id: 'enterprise',
    eyebrow: 'Plan 03',
    name: 'Enterprise & API',
    audience: 'Conferences, insurers, media and anyone building on the feed.',
    basis: 'Priced per site, annual',
    basisNote: 'Plus API volume, connectors and consulting days as used.',
    featured: false,
    includesLabel: 'Everything in Portfolio, plus',
    includes: [
      'Flash API — lightning and hail predictions in your own systems',
      'Flash Agent connectors — Salesforce, HubSpot, Microsoft 365, NetSuite and SAP, plus webhooks',
      'Single sign-on (SSO)',
      'Data exports — alert history and strike verification',
      'Flash Consulting Meteorology — site policies, season reviews',
      'Custom coverage across the continental U.S., Canada and Mexico',
      'Flash Edge Model for sites that need on-premise prediction',
    ],
  },
];

/**
 * "Best fit for", above the plan cards: each answer badges one plan (by `id`).
 * `initial` is the plan badged on load.
 */
export const planFit = {
  label: 'Best fit for',
  badge: 'Best fit',
  initial: 'portfolio',
  options: [
    { plan: 'single-site', label: 'One site' },
    { plan: 'portfolio', label: 'A portfolio' },
    { plan: 'enterprise', label: 'Enterprise or API' },
  ],
};

export const quoteFactors = [
  {
    name: 'Number of sites',
    body: 'The main input. Each site is its own 1 × 1 km-resolved location with its own users, thresholds and audit log, quoted on the same per-site basis.',
  },
  {
    name: 'Alert channels',
    body: 'SMS, email and the app are included. Horn and strobe relays are added per site when you want a physical signal on the field, the range or the yard.',
  },
  {
    name: 'API volume',
    body: 'Enterprise & API only. Priced on the call volume you plan to make — one feed into a scheduling tool is a smaller line than a fleet-wide integration.',
  },
  {
    name: 'Agent connectors',
    body: 'Flash Agent is included in Portfolio and Enterprise. Each connector — Google Calendar, Microsoft 365, Slack or Teams, Procore, Salesforce, HubSpot, NetSuite, SAP — is one line per tenant, with its own permissions and its own audit log.',
  },
  {
    name: 'Consulting days',
    body: 'Optional, billed by the day. A Flash consulting meteorologist writes your site policy, runs a season review or briefs your board.',
  },
];

export const alwaysIncluded = [
  { title: 'No hardware', body: 'Nothing to buy, mount, calibrate or replace.' },
  { title: 'Unlimited users per site', body: 'Every coach, trainer, superintendent and foreman on that site.' },
  { title: '2-minute refresh', body: 'The lightning model re-runs every two minutes; hail every five.' },
  {
    title: 'Accuracy method',
    body: 'Published: 99.6% lightning prediction accuracy on a one-hour window, scored against NLDN strikes.',
    href: '/why-flash/accuracy-method/',
  },
  { title: 'Onboarding in days', body: 'Sites, users and thresholds loaded in days, not a build season.' },
];

/** `id` names the surface's focus area on the devices photo (styles/pricing-surfaces.css). */
export const includedSurfaces: { id: string; label: string; href?: string }[] = [
  { id: 'command-center', label: 'Weather Command Center', href: '/products/weather-command-center/' },
  { id: 'mobile-app', label: 'Flash mobile app' },
  { id: 'api', label: 'Flash API', href: '/products/api-offerings/' },
  { id: 'agent', label: 'Flash Agent', href: '/products/flash-agent/' },
];

export type SensorComparisonRow = {
  item: string;
  flash: string;
  sensor: string;
  /**
   * Set on a row that is not a cost (Coverage): it stacks no block on the
   * sensor bar, and each bar carries this short caption instead.
   */
  short?: { flash: string; sensor: string };
};

export const sensorComparison: SensorComparisonRow[] = [
  {
    item: 'Hardware',
    flash: 'None — nothing to buy',
    sensor: 'Hardware purchase per site',
  },
  {
    item: 'Installation',
    flash: 'None — software only; sites are live in days',
    sensor: 'Mounting, power and network at every site',
  },
  {
    item: 'Calibration',
    flash: 'None — the model refreshes itself every 2 minutes',
    sensor: 'Periodic calibration and service visits',
  },
  {
    item: 'Replacement',
    flash: 'None — nothing to replace after a strike or a storm',
    sensor: 'Replacement after damage or end of life',
  },
  {
    item: 'Coverage',
    flash: 'Every 1 × 1 km cell — continental U.S., Canada and Mexico',
    sensor: 'The radius each mounted unit can see',
    short: { flash: 'Every 1×1 km cell', sensor: '1 radius per mast' },
  },
];

export const trustedCustomers = [
  { name: 'Troon', use: 'Lightning alerts across Troon golf properties', href: '/case-studies/troon/' },
  { name: 'Big 12', use: 'Game-day lightning decisions for conference venues' },
  { name: 'Syngenta', use: 'Turf agronomy forecasts inside Turf Assistant' },
  { name: 'NAIA', use: 'Official weather-safety partner for championships' },
];

/**
 * Visible on the page and carried by FAQPage schema, word for word. `link`
 * turns one phrase of the visible answer into an internal link.
 */
export const pricingFaqs: {
  question: string;
  answer: string;
  /** Beside the question (not in the schema). */
  icon: FaqIcon;
  link?: { text: string; href: string };
}[] = [
  {
    question: 'How long is the contract?',
    icon: 'calendar',
    answer:
      'Plans are annual, per site, and renew together on one date. Multi-year terms are available for portfolios that want a fixed per-site rate.',
  },
  {
    question: 'Can we run a pilot first?',
    icon: 'flag',
    answer:
      "Yes. A pilot runs on one site with the full Single Site feature set, so the alert log you review afterwards is the one you'd operate with. Ask for it on the demo form.",
    link: { text: 'demo form', href: '/contact/' },
  },
  {
    question: 'Is there education or municipal pricing?',
    icon: 'document',
    answer:
      'Schools, districts, conferences and municipalities are quoted on the same per-site basis. Tell us on the demo form and the quote will follow your procurement process — purchase orders and multi-year options included.',
    link: { text: 'demo form', href: '/contact/' },
  },
  {
    question: 'What if we add sites mid-year?',
    icon: 'pin-plus',
    answer:
      'Add them any time. New sites are pro-rated to your renewal date so the whole portfolio renews together, and they appear on the Command Center map the day they are loaded.',
  },
  {
    question: 'Do we need a sensor for our WBGT policy?',
    icon: 'thermometer',
    answer:
      "No. If your state policy requires an on-site WBGT reading — Georgia's GHSA does — that device stays. Flash's 6-hour WBGT outlook tells you where the reading is heading, so you move practice instead of cancelling it.",
    link: { text: "Georgia's GHSA", href: '/resources/state-heat-policies/georgia/' },
  },
  {
    question: 'Is there a free tier?',
    icon: 'phone',
    answer:
      'The Flash mobile app has a free tier for individuals. B2B plans — sites, teams, horn relays, the Command Center, the API — are per site and quoted.',
  },
];

/** The portfolio mock-up in the hero: example sites, not customers. */
export const portfolioSites = [
  {
    name: 'Northside HS · Field B',
    meta: 'Athletics · Alpharetta, GA · all users',
    params: ['Lightning', 'WBGT', 'Hail'],
    status: 'Live',
  },
  {
    name: 'Midtown Parking Deck',
    meta: 'Construction · Atlanta, GA · all users',
    params: ['Lightning', 'Wind', 'Rain'],
    status: 'Live',
  },
  {
    name: 'Cherokee Run Golf Club',
    meta: 'Golf · Canton, GA · all users',
    params: ['Lightning', 'Frost', 'Disease'],
    status: 'Live',
  },
  { name: 'Peachtree Yard 4', meta: 'Roofing · Marietta, GA · all users', params: ['Hail', 'Wind'], status: 'Loading' },
];
