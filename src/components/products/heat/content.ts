/**
 * Copy and data for /products/heat-wbgt/, as the design draws it.
 *
 * Kept as typed data so the section components stay presentational and the
 * FAQ array feeds both the visible block and its FAQPage schema.
 */

import type { Faq } from '@/content/products';
import { productPaths } from '@/content/products';

export const heatPage = {
  name: 'Heat and WBGT',
  path: productPaths.heat,
  title: 'WBGT forecast six hours ahead per field',
  description:
    'WBGT, heat index, temperature and dew point forecast hourly, six hours ahead per 1 km cell, so athletic directors and safety managers plan beside the sensor.',
} as const;

export const heroImage = {
  src: '/images/products/flash-heat-haze-athletic-field-stadium-lights.jpg',
  alt: 'Heat haze rippling above an empty athletic field in late afternoon with stadium light towers behind, the hero photograph of the Flash heat and WBGT page',
};

/* ---------- Hero chart: illustrative WBGT outlook ---------- */

/**
 * GHSA bands, with the y position the design draws each line at. `rule` is
 * the band's practice rule for the chart's hover tooltip, shortened from the
 * GHSA table on the Georgia policy page (content/heat-policies.ts).
 */
export const wbgtBands: {
  value: number;
  label: string;
  y: number;
  tone: 'gold' | 'watch' | 'warning';
  solid?: boolean;
  rule: string;
}[] = [
  { value: 82, label: '82 · discretion', y: 170, tone: 'gold', rule: 'Use discretion, 3 breaks an hour' },
  { value: 87, label: '87 · 2 h max', y: 103, tone: 'watch', rule: '2 h max practice' },
  { value: 90, label: '90 · 1 h max', y: 63, tone: 'warning', rule: '1 h max practice' },
  { value: 92, label: '92 · no outdoor', y: 37, tone: 'warning', solid: true, rule: 'No outdoor workouts' },
];
/** The rule under the lowest band. */
export const wbgtBelowRule = 'Normal activities';

/** Hourly bars. `y` / `height` are the design's own geometry (baseline at 250). */
export const wbgtOutlook: { hour: string; value: string; y: number; tone: 'sensor' | 'gold' | 'watch' }[] = [
  { hour: 'Now', value: '84.2', y: 141, tone: 'sensor' },
  { hour: '1 pm', value: '85.0', y: 130, tone: 'gold' },
  { hour: '2 pm', value: '86.6', y: 109, tone: 'gold' },
  { hour: '3 pm', value: '87.8', y: 93, tone: 'watch' },
  { hour: '4 pm', value: '88.1', y: 89, tone: 'watch' },
  { hour: '5 pm', value: '87.3', y: 99, tone: 'watch' },
  { hour: '6 pm', value: '85.9', y: 118, tone: 'gold' },
];

export const wbgtChartAlt =
  'Flash WBGT six-hour outlook for Practice Field B: hourly bars from the 84.2 sensor reading at 12:40 to an 88.1 peak at 4 pm, against the GHSA bands at 82, 87, 90 and 92 degrees';

/* ---------- What it predicts ---------- */

/** The hours under each parameter's sparkline: the hero's, Now to 6 pm. */
export const outlookHours = wbgtOutlook.map((bar) => bar.hour);

/**
 * Each parameter carries the same illustrative Field B afternoon as the hero,
 * one °F value per hour in `outlookHours`. WBGT is the hero's own bars; the
 * other three are drawn to agree with them: heat index is the NWS formula on
 * the temperature and dew point, whose wet-bulb, like WBGT, peaks at 4 pm.
 * Air temperature peaks later (5 pm) and dew point earlier (3 pm).
 */
export const parameters: { meta: string; title: string; body: string; outlook: number[] }[] = [
  {
    meta: '6 h · hourly · 2-min refresh',
    title: 'WBGT outlook',
    body: 'The number your sensor will read at 4 pm, known at noon. Shown against the GHSA bands or your own thresholds, per field.',
    outlook: wbgtOutlook.map((bar) => Number(bar.value)),
  },
  {
    meta: '6-hour outlook · 1 km',
    title: 'Heat index',
    body: 'For crews, events and utilities that plan by heat index rather than WBGT, on the same cells and the same run.',
    outlook: [99.5, 101.6, 104.0, 106.0, 106.5, 105.9, 103.4],
  },
  {
    meta: '6-hour outlook · 1 km',
    title: 'Air temperature',
    body: "Per 1 km cell, so the stadium and the practice field two miles away get their own numbers, not the airport's.",
    outlook: [90.8, 92.1, 93.6, 94.8, 95.4, 95.6, 94.2],
  },
  {
    meta: '6-hour outlook · 1 km',
    title: 'Dew point',
    body: 'The humidity half of the WBGT story, and the reason two afternoons with the same air temperature can land in different bands.',
    outlook: [73.2, 73.6, 74.0, 74.3, 74.1, 73.4, 72.8],
  },
];

/* ---------- Forecast vs measurement ---------- */

export type Verdict = { verdict: string; detail: string; tone: 'strong' | 'muted' | 'blue' };

export const decisions: { decision: string; sensor: Verdict; flash: Verdict }[] = [
  {
    decision: 'Stop or modify practice right now',
    sensor: { verdict: 'Decides.', detail: 'Policy compliance reads the meter on the field.', tone: 'strong' },
    flash: {
      verdict: 'Supports.',
      detail: 'Shows whether the next hour is rising or falling, so a pause is a plan.',
      tone: 'strong',
    },
  },
  {
    decision: "Plan today's practice time",
    sensor: { verdict: 'Cannot.', detail: 'It reads the present only.', tone: 'muted' },
    flash: {
      verdict: 'Decides.',
      detail: 'Hourly outlook six hours ahead; move practice before the band changes.',
      tone: 'blue',
    },
  },
  {
    decision: 'Compare fields before assigning sessions',
    sensor: { verdict: 'Cannot.', detail: 'No outlook, no per-field difference.', tone: 'muted' },
    flash: {
      verdict: 'Decides.',
      detail: 'Six-hour outlook per 1 km cell; the shaded field and the turf field get their own numbers.',
      tone: 'blue',
    },
  },
  {
    decision: 'Warn trainers before the band changes',
    sensor: { verdict: 'Alarms as it crosses.', detail: 'The threshold is already behind you.', tone: 'strong' },
    flash: {
      verdict: 'Alerts ahead.',
      detail: 'Push, SMS or Flash Agent when the forecast will cross 82, 87, 90 or 92, before it does.',
      tone: 'blue',
    },
  },
  {
    decision: 'Log the decision for the district',
    sensor: { verdict: 'The reading.', detail: 'Whatever the meter said when someone wrote it down.', tone: 'strong' },
    flash: {
      verdict: 'Reading and forecast, side by side.',
      detail: 'Timestamped in the Command Center log with who made the call.',
      tone: 'blue',
    },
  },
];

export const decisionLinks = [
  { label: 'How schools run both', href: '/industries-we-serve/schools/' },
  { label: "Georgia's WBGT policy, explained", href: '/resources/state-heat-policies/georgia/' },
];

export const planningImage = {
  src: '/images/products/flash-planning-day-empty-field-first-light-athletics.jpg',
  alt: 'An empty athletic field at first light with dew on the grass and a sideline equipment cart, the morning hour when the six-hour WBGT outlook is used to plan the day',
};

/* ---------- Who it is for ---------- */

export const fieldImage = {
  src: '/images/products/athletic-practice-field-dusk-late-summer-haze.jpg',
  alt: 'Empty athletic practice field at dusk in late-summer haze, the hour evening practice moves to when the WBGT outlook tops 87',
};

/**
 * The four audiences. `image` is the photo the stage shows while the audience
 * is active (existing site photos only; Utilities has none, so it keeps the
 * field). `chip` is the heat reading pinned on the photo, drawn from the copy.
 */
export const audiences: {
  title: string;
  body: string;
  link: { label: string; href: string };
  image: { src: string; alt: string };
  chip: string;
}[] = [
  {
    title: 'Athletic directors and trainers',
    body: 'GHSA or state bands per field, practice moved before 87, both trainers notified, the reading and the forecast in the log.',
    link: { label: 'Schools and athletics', href: '/industries-we-serve/schools/' },
    image: fieldImage,
    chip: 'Field B · 88.1 °F at 4 pm · move practice',
  },
  {
    title: 'Construction safety managers',
    body: "Heat index and WBGT per site for crew rotation and water breaks, with the record the owner's rep asks for.",
    link: { label: 'Construction', href: '/industries-we-serve/construction/' },
    image: {
      src: '/images/industries/flash-construction-heat-haze-rebar-deck-hard-sun.png',
      alt: 'Heat shimmer over a bare concrete parking deck with rebar mats and a shade canopy in hard midday sun',
    },
    chip: 'Crew breaks every hour after 2 pm',
  },
  {
    title: 'Event operators',
    body: "Start times, hydration stations and shade planned against the six-hour outlook for the venue's own cell, not the morning news.",
    link: { label: 'Talk to us about your venue', href: '/contact/' },
    image: {
      src: '/images/home/stadium-heat-wbgt-outlook.png',
      alt: "Heat haze rising off an empty stadium field under a hard afternoon sun, the venue an event operator plans shade and water for",
    },
    chip: 'Venue cell · start time set on the 6-hour outlook',
  },
  {
    title: 'Utilities',
    body: 'Line crews and restoration shifts planned by cell, so the hottest hour of the day is not also the hardest job.',
    link: { label: 'Talk to us about your crews', href: '/contact/' },
    image: fieldImage,
    chip: 'Line crews off the hottest hour · shifts by cell',
  },
];

/* ---------- Ask Flash ---------- */

export const agentExample = {
  context: 'Athletic director · Practice Field B · Tuesday 12:04',
  question: '“Move Thursday practice if WBGT tops 87.”',
  where: 'Asked in Microsoft Teams, from the phone, between two meetings.',
  answer: '88.1 forecast at 4 pm. Practice moved to 5:30 in Google Calendar; trainers notified.',
  detail:
    "Thursday's outlook for Practice Field B reaches 88.1 °F WBGT at 4:00 pm and stays above 87 until 5:20. Your GHSA policy caps practice at one hour in that band, so the 5:30–7:00 pm slot keeps the full session.",
  action: 'Action · Google Calendar: practice moved to 5:30',
  chips: ['SMS · 2 trainers', 'Source · cell 3391 · 12:02 run', 'Confirmed by the AD before the change'],
  /** The question as the rule Flash Agent arms (agent-rule.tsx). */
  rule: 'IF WBGT > 87 °F → move practice',
  /**
   * Thursday's outlook the rule watches, noon to 7 pm, hourly °F: the hero
   * outlook's 1–6 pm run (88.1 at 4 pm, under 87 after 5:20), with noon and
   * 7 pm added for the ends of the line. It crosses 87 at 2:20 pm, a third
   * of the way along, which styles/heat-agent.css times --hag-cross to.
   */
  chart: {
    label:
      "Thursday's WBGT outlook for Practice Field B, noon to 7 pm: above 87 °F from mid-afternoon to 5:20 pm, peaking at 88.1 °F at 4 pm; practice moved to 5:30–7:00",
    points: [83.6, 85.0, 86.6, 87.8, 88.1, 87.3, 85.9, 84.6],
    ticks: ['Noon', '2 pm', '4 pm', '6 pm', '7 pm'],
    peak: '88.1 · 4 pm',
    slot: '5:30–7:00',
  },
};

/* ---------- State heat policies ---------- */

export const policyImage = {
  src: '/images/products/flash-state-heat-policy-track-bleachers-haze.jpg',
  alt: 'Empty aluminium bleachers beside a high school running track under a hazy late-summer sky, the venues state heat policies govern',
};

export const georgiaPolicy = {
  name: 'Georgia · GHSA',
  summary:
    '82: three 4-minute breaks per hour · 87: 2 h max, four breaks · 90: 1 h max, no pads · 92: no outdoor workouts',
  href: '/resources/state-heat-policies/georgia/',
};

/** Sibling state pages the design shows. None exists yet, so they render as text. */
export const siblingPolicies = [
  'Florida · FHSAA',
  'North Carolina · NCHSAA',
  'South Carolina · SCHSL',
  'Alabama · AHSAA',
];

/* ---------- Spec table ---------- */

/** `heatBar` draws the GHSA bands (wbgtBands) as a small bar under the value. */
export type SpecRow = { label: string; value: string; link?: { label: string; href: string }; heatBar?: boolean };

export const forecastSpecs: SpecRow[] = [
  { label: 'Planning horizon', value: '6 hours, hourly, refreshed every 2 minutes' },
  { label: 'Parameters', value: 'WBGT, heat index, air temperature, dew point, per field' },
  { label: 'Resolution', value: '1 × 1 km grid cells' },
  { label: 'Inputs', value: 'Over 100 parameters, the same engine and run as the lightning and hail products' },
  { label: 'Policy bands', value: 'GHSA 82 / 87 / 90 / 92 °F by default; custom thresholds per field', heatBar: true },
];

export const deliverySpecs: SpecRow[] = [
  { label: 'Channels', value: 'App, SMS, email, Command Center, API and webhooks, Flash Agent' },
  {
    label: 'Flash Agent',
    value: 'Ask in plain language; the agent calls the same API and acts in your tools',
    link: { label: 'Flash Agent', href: productPaths.agent },
  },
  { label: 'Hardware', value: 'None. Runs beside any WBGT meter you already own' },
  { label: 'Coverage', value: 'Continental U.S., Canada, Mexico' },
  { label: 'Decision log', value: 'Sensor reading and forecast side by side, timestamped, with who made the call' },
  {
    label: 'Scoring',
    value: 'Scored against ground truth; method and figures on the accuracy page, never quoted unqualified',
    link: { label: 'Accuracy method', href: '/why-flash/accuracy-method/' },
  },
];

/* ---------- FAQ ---------- */

export const heatFaqs: Faq[] = [
  {
    question: 'Does Flash replace my WBGT meter?',
    answer:
      'No. GHSA and most state policies require the reading from the meter on the field, and that stays your compliance record. Flash plans beside it: it tells you at noon what the meter will read at 4 pm, per field, so the decision is made before the band changes.',
  },
  {
    question: 'How far ahead is the WBGT outlook?',
    answer:
      'Six hours, hourly, refreshed every 2 minutes, on the same 1 km cell as your lightning alerts. Set your thresholds per field and the outlook shows when each one will be crossed.',
  },
  {
    question: 'Which policy thresholds does it show?',
    answer:
      "The GHSA bands at 82, 87, 90 and 92 °F by default. Set your own state's or district's thresholds per field and the outlook, the alerts and Flash Agent all use them.",
  },
  {
    question: 'Can it move practice by itself?',
    answer:
      'Only through Flash Agent, and only after a person confirms. The agent proposes the new slot, shows the cell and the run it read, and writes to your calendar when you say yes. Every change is logged.',
  },
];

export const faqLinks = [
  { label: 'All questions', href: '/resources/frequently-asked-questions/' },
  { label: 'Plans and pricing', href: '/pricing/' },
];
