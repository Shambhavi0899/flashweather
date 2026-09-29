/**
 * The Flash API page's copy, as data: the endpoint, parameter and webhook
 * tables, the integrations grid, the delivery cards, the FAQ and the code
 * samples. The section components render from here, so the tables stay real
 * <table>s and the FAQ schema describes exactly what is on the page.
 *
 * Copy is the design's (Paper, "04c · Flash API"), verbatim.
 */

import type { Faq } from '@/content/products';
import { productPaths } from '@/content/products';

export const apiPath = productPaths.api;

export type HttpMethod = 'GET' | 'POST';

export type Endpoint = {
  method: HttpMethod;
  path: string;
  returns: string;
  use: string;
  /** An internal link appended to the "typical use" cell. */
  useLink?: { label: string; href: string };
  /**
   * The response preview beside the table (endpoint-explorer.tsx). Illustrative,
   * not live weather: the same cell 3391, 12:02 run and Practice Field B as the
   * hero's response, with field names from the parameter table below.
   */
  sample: { path: string; status: string; code: string };
};

export const endpoints: Endpoint[] = [
  {
    method: 'GET',
    path: '/v1/cells/{cell_id}/now',
    returns: 'Current risk and readings for one 1 km cell, with the model run it came from',
    use: 'PA triggers, site dashboards, kiosk displays',
    sample: {
      path: '/v1/cells/3391/now',
      status: '200 OK',
      code: `{
  "cell_id": "3391",
  "run": "2026-09-21T12:02:00Z",
  "lightning_risk_60m": 0.82,
  "lightning_first_strike_eta_min": 38,
  "wbgt_f": 88.1,
  "wind_gust_mph": 31
}`,
    },
  },
  {
    method: 'GET',
    path: '/v1/cells/{cell_id}/outlook',
    returns: 'Hourly forecast out to 180 hours for every parameter on the cell',
    use: 'Scheduling, crew plans, spray windows',
    sample: {
      path: '/v1/cells/3391/outlook',
      status: '200 OK',
      code: `{
  "cell_id": "3391",
  "run": "2026-09-21T12:02:00Z",
  "horizon_h": 180,
  "hours": [
    { "time": "2026-09-21T16:00:00Z",
      "wbgt_f": 88.1, "precip_prob": 0.40 },
    { "time": "2026-09-21T17:00:00Z",
      "wbgt_f": 87.3, "precip_prob": 0.25 }
  ]
}`,
    },
  },
  {
    method: 'GET',
    path: '/v1/sites',
    returns: 'Your registered sites, their cells, thresholds and channels',
    use: 'Sync with your asset list or ERP',
    sample: {
      path: '/v1/sites',
      status: '200 OK',
      code: `{
  "sites": [
    {
      "name": "Practice Field B",
      "cell_id": "3391",
      "thresholds": {
        "wbgt_f": 87,
        "lightning_risk_60m": 0.5
      },
      "channels": ["sms", "teams"]
    }
  ]
}`,
    },
  },
  {
    method: 'POST',
    path: '/v1/alerts',
    returns: 'Subscribe a threshold per site to a channel or a webhook URL',
    use: 'Alert routing, horn and strobe relays, Slack and Teams',
    sample: {
      path: '/v1/alerts',
      status: '201 Created',
      code: `{
  "alert_id": "alr_7f3c",
  "site": "Practice Field B",
  "event": "lightning.warning",
  "threshold": { "lightning_risk_60m": 0.5 },
  "channel": "webhook",
  "url": "https://hooks.yourapp.com/flash"
}`,
    },
  },
  {
    method: 'GET',
    path: '/v1/outlooks/{layer}',
    returns: 'Regional outlook for one layer: wbgt, wind, rain, frost, hail, lightning',
    use: 'Planning views across a region or a portfolio',
    sample: {
      path: '/v1/outlooks/wbgt',
      status: '200 OK',
      code: `{
  "layer": "wbgt",
  "run": "2026-09-21T12:02:00Z",
  "cells": 1840,
  "peak": {
    "cell_id": "3391",
    "wbgt_f": 88.1,
    "time": "2026-09-21T16:00:00Z"
  }
}`,
    },
  },
  {
    method: 'GET',
    path: '/v1/validation/lightning',
    returns: 'The NLDN-scored validation dataset behind 99.6% on the 60-minute window',
    use: 'Your own audit; see',
    useLink: { label: 'the accuracy method', href: '/why-flash/accuracy-method/' },
    sample: {
      path: '/v1/validation/lightning',
      status: '200 OK',
      code: `{
  "window_min": 60,
  "reference": "NLDN",
  "strikes_scored": 1000,
  "inside_forecast": 996,
  "hit_rate": 0.996
}`,
    },
  },
];

export type ParameterGroup = { group: string; parameters: string[] };

export const parameterGroups: ParameterGroup[] = [
  {
    group: 'Severe',
    parameters: ['lightning_risk_60m', 'lightning_first_strike_eta_min', 'hail_lead_min', 'hail_size_class'],
  },
  { group: 'Heat', parameters: ['wbgt_f', 'heat_index_f', 'temp_f', 'dew_point_f'] },
  { group: 'Water', parameters: ['rain_rate_in_hr', 'rain_accum_in', 'precip_prob'] },
  { group: 'Wind', parameters: ['wind_sustained_mph', 'wind_gust_mph', 'gust_over_limit_eta_min'] },
  {
    group: 'Agronomy',
    parameters: [
      'frost_prob',
      'freeze_prob',
      'et_in_day',
      'disease_pressure.dollar_spot',
      'disease_pressure.pythium',
      'disease_pressure.brown_patch',
      'gdd',
    ],
  },
  { group: 'Visibility and winter', parameters: ['fog_prob', 'visibility_mi', 'snow_accum_in', 'ice_accum_in'] },
];

export const parameterLinks = [
  { label: 'Lightning Prediction', href: productPaths.lightning },
  { label: 'Hail Prediction', href: productPaths.hail },
  { label: 'Heat and WBGT', href: productPaths.heat },
  { label: 'Agronomy Suite', href: productPaths.agronomy },
];

export type WebhookEvent = { event: string; firesWhen: string; lead: string };

export const webhookEvents: WebhookEvent[] = [
  { event: 'lightning.watch', firesWhen: 'A cell inside the site radius enters the 60-minute window', lead: 'T–60' },
  { event: 'lightning.warning', firesWhen: "Strike-level prediction for the site's own cell", lead: 'Configurable' },
  {
    event: 'lightning.all_clear',
    firesWhen: 'Your all-clear timer completes with no new cell inside the radius',
    lead: 'After the last strike',
  },
  {
    event: 'hail.approaching',
    firesWhen: 'A FlashHail cell with a size class is heading for the site',
    lead: 'Up to T–55',
  },
  {
    event: 'wbgt.threshold',
    firesWhen: 'The forecast will cross 82, 87, 90 or 92 °F, or your own band',
    lead: 'Up to 6 h ahead',
  },
  {
    event: 'wind.gust_over_limit',
    firesWhen: "The first gust over the site's crane, lift or tent limit",
    lead: 'Gust timing',
  },
  { event: 'frost.expected', firesWhen: 'Frost or freeze probability over your threshold for a field', lead: 'Hours ahead' },
];

/**
 * The three commitments. `detail` picks each column's small icon
 * (rate-limit-icons.tsx); none of them carries a figure.
 */
export const commitments: { title: string; body: string; detail: 'meter' | 'status' | 'retry' }[] = [
  {
    detail: 'meter',
    title: 'Rate limits',
    body: 'Per key and per minute, with burst allowances for alert fan-out. The current figures are published in the developer docs.',
  },
  {
    detail: 'status',
    title: 'Uptime and support',
    body: 'The uptime commitment, support hours and escalation path are written into your order form and mirrored in the developer docs.',
  },
  {
    detail: 'retry',
    title: 'Webhook delivery',
    body: 'Signed payloads, retries with backoff and a replay endpoint. The retry schedule is published in the developer docs.',
  },
];

/**
 * `receives`: the webhook events (names from `webhookEvents`) each connector
 * shows under "Receives:" on hover; 'all' for the raw webhook. Drafted from each
 * connector's use, awaiting approval.
 */
export type Integration = { name: string; use: string; receives: WebhookEvent['event'][] | 'all' };

export const integrations: Integration[] = [
  { name: 'Google Calendar', use: 'Practice and shift moves', receives: ['lightning.watch', 'wbgt.threshold'] },
  { name: 'Microsoft 365', use: 'Outlook, SharePoint audit files', receives: ['lightning.warning', 'lightning.all_clear'] },
  { name: 'Salesforce', use: 'Site records, field service orders', receives: ['hail.approaching', 'wind.gust_over_limit'] },
  { name: 'HubSpot', use: 'Canvass lists, claims follow-up', receives: ['hail.approaching'] },
  { name: 'NetSuite', use: 'Work orders, fleet tasks', receives: ['wind.gust_over_limit', 'frost.expected'] },
  { name: 'SAP', use: 'Plant maintenance notifications', receives: ['lightning.warning', 'wind.gust_over_limit'] },
  { name: 'Procore', use: 'Lift schedules, daily logs', receives: ['wind.gust_over_limit', 'lightning.warning'] },
  { name: 'Slack', use: 'A channel per site, alerts and all-clears', receives: ['lightning.warning', 'lightning.all_clear'] },
  { name: 'Microsoft Teams', use: 'Ask Flash from the phone', receives: ['lightning.watch', 'wbgt.threshold'] },
  { name: 'Any webhook', use: 'PA systems, horn relays, your own stack', receives: 'all' },
];

export const integrationLinks = [
  { label: 'Construction', href: '/industries-we-serve/construction/' },
  { label: 'Roofing', href: '/industries-we-serve/roofing/' },
  { label: 'Accuracy method', href: '/why-flash/accuracy-method/' },
  { label: 'Pricing', href: '/pricing/' },
];

export type DeliveryCard = {
  label: string;
  name: string;
  body: string;
  href: string;
  image: { src: string; alt: string };
};

export const deliveryCards: DeliveryCard[] = [
  {
    label: 'Ensemble',
    name: 'Flash Edge Model',
    body: 'Best, most likely and worst case for over 100 parameters, so you plan for the range, not a single line.',
    href: productPaths.edgeModel,
    image: {
      src: '/images/products/flash-edge-model-ensemble-product-render.png',
      alt: 'Flash Edge Model product render: three national ensemble maps stacked above the Flash Edge wordmark, shown as another way to take delivery of the same engine',
    },
  },
  {
    label: 'Platform',
    name: 'Weather Command Center',
    body: "Flash's flagship platform: every risk that touches your operation on one screen.",
    href: productPaths.commandCenter,
    image: {
      src: '/images/products/flash-weather-command-center-product-render.png',
      alt: 'Weather Command Center product render: a laptop showing a storm-cell map with 99.6% accuracy, 6 hours of prediction and 1x1 km resolution called out beside it',
    },
  },
  {
    label: 'Mobile',
    name: 'Flash Mobile App',
    body: 'Enterprise-grade prediction in your pocket, with 18 hours of future radar.',
    href: productPaths.mobileApp,
    image: {
      src: '/images/products/flash-mobile-app-future-radar-product-render.png',
      alt: 'Flash Mobile App product render: four phone screens showing lightning probability, future radar, live radar and seven-day forecasts',
    },
  },
];

export const faqs: Faq[] = [
  {
    question: 'Is the API the same forecast the app shows?',
    answer:
      'Yes. The API, the Command Center, the mobile app and Flash Agent read the same 1 km cells from the same run, so a webhook and a push alert never disagree about a site.',
  },
  {
    question: 'How fresh is the data?',
    answer:
      'The prediction engine refreshes every 2 minutes. Heat, wind, rain and the agronomy parameters are hourly across the 6-hour outlook, with forecasts out to 180 hours for planning. Every response carries its run timestamp.',
  },
  {
    question: 'Is there a validation dataset I can test against?',
    answer:
      'Yes. /v1/validation/lightning returns the NLDN-scored dataset behind 99.6% on the one-hour window, so you can re-run the scoring yourself. The method is written up on the accuracy page.',
  },
  {
    question: 'Can Flash Agent be called from my own app?',
    answer:
      'Yes, through the agent endpoint. It answers with the cells and the run it read; any action it proposes waits for a person to confirm, and each connector is permissioned on its own, so your app decides what the agent may touch.',
  },
];

export const faqLinks = [
  { label: 'All questions', href: '/resources/frequently-asked-questions/' },
  { label: 'How we measure 99.6%', href: '/why-flash/accuracy-method/' },
];

/* ------------------------------------------------------------------ */
/* Code samples. Illustrative, not live weather (the page says so).    */
/* ------------------------------------------------------------------ */

export const heroResponse = {
  method: 'GET' as const,
  url: 'https://api.flashweather.ai/v1/cells/3391/now',
  status: '200 OK',
  code: `{
  "cell_id": "3391",
  "run": "2026-09-21T12:02:00Z",
  "centroid": [34.0234, -84.3616],
  "lightning_risk_60m": 0.82,
  "lightning_first_strike_eta_min": 38,
  "hail_lead_min": null,
  "wbgt_f": 88.1,
  "wind_gust_mph": 31,
  "rain_rate_in_hr": 0.60,
  "frost_prob": 0.00,
  "next_alert": "lightning.warning @ T-15"
}`,
};

export const heroWebhook = {
  label: 'POST https://hooks.yourapp.com/flash · event: lightning.warning',
  code: `{ "event": "lightning.warning", "site": "Practice Field B",
  "cell_id": "3391", "eta_min": 15, "risk": 0.82,
  "issued": "2026-09-21T14:21:00Z", "signature": "sha256=…" }`,
};

export const agentExample = {
  url: 'https://api.flashweather.ai/v1/agent/ask',
  status: '200 OK',
  request: `{ "question": "Which of my sites are inside a lightning window before 3 pm?",
  "scope": "sites:all", "actions": "propose" }`,
  response: `{ "answer": "Two: Midtown Parking Deck (cell 3391, T–38) and Riverside Yard (cell 3402, T–52).",
  "cells": ["3391", "3402"], "run": "2026-09-21T12:02:00Z",
  "proposed_action": { "tool": "procore", "type": "reschedule_lift",
    "status": "awaiting_confirmation" } }`,
  /** The value to call out once the response is in, and what it means. */
  confirm: { value: '"awaiting_confirmation"', note: 'A person confirms before anything changes.' },
  /** The same request in each language tab, built from `request`. The auth header is illustrative. */
  snippets: [
    {
      id: 'curl',
      label: 'cURL',
      code: `curl -X POST https://api.flashweather.ai/v1/agent/ask \\
  -H "Authorization: Bearer $FLASH_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "question": "Which of my sites are inside a lightning window before 3 pm?",
        "scope": "sites:all", "actions": "propose" }'`,
    },
    {
      id: 'javascript',
      label: 'JavaScript',
      code: `const res = await fetch("https://api.flashweather.ai/v1/agent/ask", {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${process.env.FLASH_API_KEY}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    question: "Which of my sites are inside a lightning window before 3 pm?",
    scope: "sites:all",
    actions: "propose",
  }),
});
const answer = await res.json();`,
    },
    {
      id: 'python',
      label: 'Python',
      code: `import os
import requests

res = requests.post(
    "https://api.flashweather.ai/v1/agent/ask",
    headers={"Authorization": f"Bearer {os.environ['FLASH_API_KEY']}"},
    json={
        "question": "Which of my sites are inside a lightning window before 3 pm?",
        "scope": "sites:all",
        "actions": "propose",
    },
)
answer = res.json()`,
    },
  ],
};

export const images = {
  hero: {
    src: '/images/products/flash-weather-api-integration-visual.png',
    alt: 'Laptop showing the Flash weather map with storm cells tracked over the southeast, the same model run the Flash API serves',
  },
  network: {
    src: '/images/products/flash-api-network-of-glowing-nodes-abstract.png',
    alt: 'An abstract network of glowing nodes joined by thin lines in dark space, standing for the Flash API delivering the same forecast to every connected system',
  },
  controlRoom: {
    src: '/images/products/flash-api-control-room-screen-glow-night.png',
    alt: 'A darkened operations control room at night with a wall of screens casting blue glow across empty desks, where Flash API responses and Flash Agent answers land side by side',
  },
};
