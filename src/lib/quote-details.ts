/**
 * Quote details: what a visitor picks under "How is your quote calculated?"
 * on /pricing/, and how those picks travel to the demo form on /contact/.
 *
 * The pricing section builds a link with `quoteDetailsHref()`; the form reads
 * the query string back with `parseQuoteDetails()` and writes the details
 * into its own fields. Nothing here carries a price: every plan is quoted.
 *
 * Everything read from the URL is checked against the lists below, so a
 * hand-edited link can only ever select options that exist.
 */

import { DEMO_HREF } from '@/content/navigation';

/** Each plan on /pricing/ (by its `id` in content/pricing.ts) and the site count its quote starts from. */
export const QUOTE_PLANS = [
  { id: 'single-site', label: 'Single Site', sites: 1 },
  { id: 'portfolio', label: 'Portfolio', sites: 10 },
  { id: 'enterprise', label: 'Enterprise', sites: 50 },
] as const;

export const QUOTE_CHANNELS = [
  { id: 'app', label: 'App' },
  { id: 'sms', label: 'SMS' },
  { id: 'email', label: 'Email' },
  { id: 'horn-strobe', label: 'Horn/strobe' },
] as const;

export const QUOTE_API_VOLUMES = [
  { id: 'none', label: 'None' },
  { id: 'light', label: 'Light' },
  { id: 'heavy', label: 'Heavy' },
] as const;

/** The connectors named in the "Agent connectors" factor, in the same order. */
export const QUOTE_CONNECTORS = [
  { id: 'google-calendar', label: 'Google Calendar' },
  { id: 'microsoft-365', label: 'Microsoft 365' },
  { id: 'slack-or-teams', label: 'Slack or Teams' },
  { id: 'procore', label: 'Procore' },
  { id: 'salesforce', label: 'Salesforce' },
  { id: 'hubspot', label: 'HubSpot' },
  { id: 'netsuite', label: 'NetSuite' },
  { id: 'sap', label: 'SAP' },
] as const;

export type QuotePlanId = (typeof QUOTE_PLANS)[number]['id'];
export type QuoteChannelId = (typeof QUOTE_CHANNELS)[number]['id'];
export type QuoteApiVolumeId = (typeof QUOTE_API_VOLUMES)[number]['id'];
export type QuoteConnectorId = (typeof QUOTE_CONNECTORS)[number]['id'];

export type QuoteDetails = {
  plan: QuotePlanId;
  sites: number;
  channels: QuoteChannelId[];
  api: QuoteApiVolumeId;
  connectors: QuoteConnectorId[];
  consulting: number;
};

/** The demo form accepts up to this many sites (lib/demo-request.ts). */
export const MAX_SITES = 100000;
export const MAX_CONSULTING_DAYS = 365;

/** Where the inputs start: the three channels every plan includes, and nothing optional. */
export const DEFAULT_QUOTE_PICKS: Omit<QuoteDetails, 'plan' | 'sites'> = {
  channels: ['app', 'sms', 'email'],
  api: 'none',
  connectors: [],
  consulting: 0,
};

const PARAMS = ['plan', 'sites', 'channels', 'api', 'connectors', 'consulting'] as const;

/** /contact/ with the details in the query string. */
export function quoteDetailsHref(details: QuoteDetails): string {
  const query = new URLSearchParams({
    plan: details.plan,
    sites: String(details.sites),
    channels: details.channels.join(','),
    api: details.api,
    connectors: details.connectors.join(','),
    consulting: String(details.consulting),
  });
  return `${DEMO_HREF}?${query}`;
}

/** The details in a query string, or null when it carries none of them. */
export function parseQuoteDetails(search: string): QuoteDetails | null {
  const query = new URLSearchParams(search);
  if (!PARAMS.some((name) => query.has(name))) return null;

  const plan = QUOTE_PLANS.find((p) => p.id === query.get('plan')) ?? QUOTE_PLANS[0];
  const picked = (name: string) => (query.get(name) ?? '').split(',');

  return {
    plan: plan.id,
    sites: wholeNumber(query.get('sites'), 1, MAX_SITES) ?? plan.sites,
    // Filtering the known list keeps its order and drops anything unknown or repeated.
    channels: query.has('channels')
      ? QUOTE_CHANNELS.filter((c) => picked('channels').includes(c.id)).map((c) => c.id)
      : DEFAULT_QUOTE_PICKS.channels,
    api: QUOTE_API_VOLUMES.find((v) => v.id === query.get('api'))?.id ?? 'none',
    connectors: QUOTE_CONNECTORS.filter((c) => picked('connectors').includes(c.id)).map((c) => c.id),
    consulting: wholeNumber(query.get('consulting'), 0, MAX_CONSULTING_DAYS) ?? 0,
  };
}

function wholeNumber(raw: string | null, min: number, max: number): number | null {
  if (!raw || !/^\d+$/.test(raw)) return null;
  const value = Number(raw);
  return value >= min && value <= max ? value : null;
}

const labels = (list: readonly { id: string; label: string }[], ids: readonly string[]) =>
  list
    .filter((item) => ids.includes(item.id))
    .map((item) => item.label)
    .join(', ') || 'None';

/** The five factors as label and value, in the order the section lists them. */
export function quoteDetailsLines(details: QuoteDetails): { label: string; value: string }[] {
  return [
    { label: 'Number of sites', value: `${details.sites} ${details.sites === 1 ? 'site' : 'sites'}` },
    { label: 'Alert channels', value: labels(QUOTE_CHANNELS, details.channels) },
    { label: 'API volume', value: labels(QUOTE_API_VOLUMES, [details.api]) },
    { label: 'Agent connectors', value: labels(QUOTE_CONNECTORS, details.connectors) },
    {
      label: 'Consulting days',
      value: details.consulting ? `${details.consulting} ${details.consulting === 1 ? 'day' : 'days'}` : 'None',
    },
  ];
}

/** The details as the demo form's message, which the visitor can then edit. */
export function quoteDetailsMessage(details: QuoteDetails): string {
  return [
    'Quote details from the pricing page',
    `Plan: ${labels(QUOTE_PLANS, [details.plan])}`,
    ...quoteDetailsLines(details).map((line) => `${line.label}: ${line.value}`),
  ].join('\n');
}
