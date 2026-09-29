/**
 * Copy and data for /products/hail-prediction/, verbatim from the Paper
 * design ("04 · Hail Prediction"). Client-approved; do not add figures.
 */

import { type Faq, productPaths } from '@/content/products';

export const hailPage = {
  name: 'Hail prediction',
  path: productPaths.hail,
  title: 'Hail prediction software: 55-min warning',
  description:
    'FlashHail forecasts the hail cell, size class and arrival window up to 55 minutes before impact, refreshed every 5 minutes, for roofing, fleets and claims.',
  schemaName: 'FlashHail',
  heroImage: '/images/products/flash-predictive-hail-product-render.png',
} as const;

export type SizeClassKey = 'severe' | 'damaging' | 'destructive';

/** Dot / label colour per class, as the design draws them. */
export const sizeClassTone: Record<SizeClassKey, { dot: string; onDark: string }> = {
  severe: { dot: 'bg-viz-gold', onDark: 'text-viz-gold' },
  damaging: { dot: 'bg-alert-watch', onDark: 'text-alert-watch' },
  destructive: { dot: 'bg-alert-warning', onDark: 'text-alert-warning' },
};

export const heroSizeClasses: {
  key: SizeClassKey;
  size: string;
  label: string;
  note: string;
  /** The NWS size comparison the stone lands on, outlined to scale. */
  comparison: string;
  /** The impact preview shown while the class is active: what it hits, and what it leaves. */
  impact: { surface: string; mark: string };
}[] = [
  { key: 'severe', size: '0.75 in', label: 'Severe', note: 'NWS threshold', comparison: 'Penny', impact: { surface: 'Roof shingle', mark: 'light marks' } },
  { key: 'damaging', size: '1.00 in', label: 'Damaging', note: 'Vehicle dents, roof claims', comparison: 'Quarter', impact: { surface: 'Car panel', mark: 'dents' } },
  { key: 'destructive', size: '2.00 in', label: 'Destructive', note: 'Structural damage, glass', comparison: 'Hen egg', impact: { surface: 'Glass', mark: 'cracks' } },
];

export const comparison = {
  tracking: {
    label: 'Hail tracking tools',
    heading: 'Report after impact.',
    points: [
      'Radar-derived swaths drawn after the storm passes, often hours later.',
      'Tell you where to send the claims team and the canvassers, after the damage exists.',
      'No size class ahead of time, no window to move a single vehicle.',
    ],
  },
  prediction: {
    label: 'Flash hail prediction',
    heading: 'Forecast before impact.',
    points: [
      'Up to 55 minutes before hail reaches the site, refreshed every five minutes.',
      'The size class, the timing to the minute and the 1 km cell it will land on.',
      'Alerts by app, SMS, email, horn/strobe and API, so the crew moves before the stones fall.',
    ],
  },
};

/**
 * The storm timeline over the comparison, and the chip each column ends
 * on. The ticks sit evenly along the rail; the scroll choreography that
 * reads them lives in storm-comparison.tsx.
 */
export const stormTimeline = {
  ticks: ['–55 min', '–30', 'IMPACT', '+1 h', '+3 h'],
  impact: 2,
  predictionChip: [
    { text: 'FlashHail', tone: 'strong' },
    { text: '1.00 in DAMAGING', tone: 'damaging' },
    { text: 'ETA 14:32', tone: 'plain' },
    { text: 'App · SMS · Horn', tone: 'muted' },
  ],
  trackingChip: [
    { text: 'Swath published', tone: 'plain' },
    { text: '3 h after impact', tone: 'muted' },
  ],
  predictionScene: 'A parked vehicle drives under a carport before impact; the hail falls on the empty space it left.',
  trackingScene: 'A parked vehicle stays in the open; at impact the hail hits it and leaves dents.',
} as const;

export type ChipPart = { text: string; tone: 'strong' | 'damaging' | 'plain' | 'muted' };

export const sizeClassRows: { key: SizeClassKey; label: string; damage: string; alerted: string }[] = [
  {
    key: 'severe',
    label: 'Severe',
    damage: 'NWS severe threshold. Shingle bruising and granule loss, dented gutters, stripped foliage.',
    alerted: 'Roofing crews, agronomists covering crops',
  },
  {
    key: 'damaging',
    label: 'Damaging',
    damage: 'Vehicle dents, roof claims, cracked skylights and greenhouse panels.',
    alerted: 'Fleet managers, claims adjusters, roofing sales',
  },
  {
    key: 'destructive',
    label: 'Destructive',
    damage: 'Structural damage, broken glass, injuries to anyone caught outside.',
    alerted: 'Everyone on site, plus horn and strobe relays',
  },
];

/**
 * The class the page carries down from the comparison's alert ("1.00 in
 * DAMAGING"): the size-class table marks its row, and "Who moves first"
 * shows who moves on it.
 */
export const carriedSizeClass: SizeClassKey = 'damaging';

/** The alert a use-case card's back shows: engine and ETA as in the comparison's chip, then the card's own size and channel. */
export const useCaseAlert = { engine: 'FlashHail', eta: 'ETA 14:32' } as const;

export type UseCase = {
  title: string;
  kicker: string;
  /**
   * The size classes this industry is alerted on, read off `sizeClassRows`
   * "Who gets alerted": severe (roofing crews, agronomists), damaging (fleet
   * managers, claims adjusters, roofing sales), destructive (everyone).
   */
  alertedOn: SizeClassKey[];
  /** The back of the card: their move, in short steps, from the card's copy. Drafted 2026-09-29, awaiting approval. */
  move: string[];
  /** The channel their alert arrives on. Drafted, awaiting approval. */
  channel: string;
  /** A trade-press line kept from the card's copy. */
  note?: string;
  /** Optional phrase inside a `move` step to link inline. */
  inlineLink?: { text: string; href: string };
  link: { label: string; href: string };
  image: { src: string; alt: string };
};

export const useCases: UseCase[] = [
  {
    title: 'Roofing',
    kicker: 'Before the storm, not after',
    alertedOn: ['severe', 'damaging', 'destructive'],
    move: [
      'Know which neighborhoods before the storm, not from the claims map after it.',
      'Stage crews and canvassers where the 1 km cells will land.',
    ],
    channel: 'App',
    link: { label: 'Hail alerts for roofing', href: '/industries-we-serve/roofing/' },
    image: {
      src: '/images/products/flash-shelf-cloud-rooftops-use-case-roofing.png',
      alt: 'A shelf cloud moving over suburban rooftops ahead of the storm, on the roofing use case card',
    },
  },
  {
    title: 'Auto & fleet',
    kicker: 'Stage the lot, not the dents',
    alertedOn: ['damaging', 'destructive'],
    move: [
      'The lot gets its window, up to 55 minutes out.',
      'Stage vehicles under cover inside it.',
      'No dents to file afterwards.',
    ],
    channel: 'SMS',
    note: 'Covered by Automotive Fleet.',
    link: { label: 'Press & partners', href: '/press-and-partners/' },
    image: {
      src: '/images/products/flash-vehicle-lot-hail-sky-use-case-auto-fleet.png',
      alt: 'Rows of parked vehicles in an open lot under a bruised hail sky, on the auto and fleet use case card',
    },
  },
  {
    title: 'Insurance & claims',
    kicker: 'Adjusters before the FNOL',
    alertedOn: ['damaging', 'destructive'],
    move: [
      'See the size class and the cell before the first notice of loss.',
      'Pre-position adjusters where it will land.',
    ],
    channel: 'Email',
    note: 'Covered by Carrier Management.',
    link: { label: 'Press & partners', href: '/press-and-partners/' },
    image: {
      src: '/images/products/flash-neighborhood-hail-sky-use-case-insurance-claims.png',
      alt: 'A suburban neighborhood under a bruised green-grey hail sky with hail on a driveway, on the insurance and claims use case card',
    },
  },
  {
    title: 'Agriculture',
    kicker: 'Cover and harvest calls',
    alertedOn: ['severe', 'destructive'],
    move: [
      'Time crop cover to the hail window.',
      'Make the harvest call before the cell arrives.',
      'Read it next to the frost, ET and disease forecasts of the Agronomy Suite.',
    ],
    channel: 'App',
    inlineLink: { text: 'Agronomy Suite', href: productPaths.agronomy },
    link: { label: 'Hail alerts for agriculture', href: '/industries-we-serve/agriculture/' },
    image: {
      src: '/images/products/flash-crop-rows-dawn-use-case-agriculture.png',
      alt: 'Crop rows running to the horizon at dawn, on the agriculture use case card for cover and harvest calls',
    },
  },
];

/**
 * The launch coverage, as clippings. `summary` is the approved quote, verbatim;
 * `highlight` is the phrase in it the highlighter marks (what FlashHail does
 * before impact), and must appear in `summary` exactly. `href` is the article.
 */
export const pressCoverage: {
  outlet: string;
  beat: string;
  audience: string;
  summary: string;
  highlight: string;
  href: string;
}[] = [
  {
    outlet: 'Carrier Management',
    beat: 'Insurance trade',
    audience: 'Carriers and claims teams',
    summary:
      'Coverage of the FlashHail launch for carriers and claims teams: hail predicted up to 55 minutes ahead, by size class, so adjusters can be staged before the first notice of loss.',
    highlight: 'hail predicted up to 55 minutes ahead',
    href: 'https://www.carriermanagement.com/news/2026/05/15/288050.htm',
  },
  {
    outlet: 'Automotive Fleet',
    beat: 'Fleet trade',
    audience: 'Fleet operators',
    summary:
      'Coverage of the FlashHail launch for fleet operators: a forecast window to move vehicles under cover before hail reaches the lot, with no sensors on any site.',
    highlight: 'a forecast window to move vehicles under cover before hail reaches the lot',
    href: 'https://www.automotive-fleet.com/news/flash-weather-ai-launches-first-deep-learning-hail-prediction-model-with-high-resolution-forecasting',
  },
];

export const specs: { label: string; value: string; note: string }[] = [
  { label: 'Lead time', value: 'Up to 55 min', note: 'before hail reaches the site' },
  { label: 'Refresh', value: 'Every 5 min', note: 'FlashHail model cycle' },
  { label: 'Resolution', value: '1 × 1 km', note: 'the cell the stones will land on' },
  { label: 'Swath', value: '1 hour', note: 'hail swath prediction, timing to the minute' },
  { label: 'Channels', value: 'App · SMS · email', note: 'plus horn/strobe relays, the API and Flash Agent' },
  { label: 'Hardware', value: 'None', note: 'software only, live the day you sign' },
  { label: 'Coverage', value: 'U.S. · CA · MX', note: 'continental U.S., Canada and Mexico' },
  { label: 'Engine', value: 'FlashHail', note: 'runs beside FlashPredict, the lightning engine' },
];

/** Typed into the spec section's Flash Agent bar in turn; a click carries the one showing. */
export const agentBarQuestions = ["Which lots are in tonight's swath?", 'Did 1-inch hail hit our Plano homes?'];

export const agentExamples: {
  persona: string;
  question: string;
  answer: string;
  action: string;
  meta: string[];
}[] = [
  {
    persona: 'Roofing owner · Alpharetta',
    question: '“Which streets took hail over one inch last night?”',
    answer: '14 streets in Alpharetta, 1.00–1.50 in. Canvass list pushed to HubSpot.',
    action: 'Action · HubSpot: canvass list created',
    meta: ['Source · FlashHail cells · 21:40 run'],
  },
  {
    persona: 'Fleet manager · 3 lots',
    question: '“Which lots are inside the hail window before 6 pm?”',
    answer:
      'Two: Sandy Springs and Roswell, 1.00 in class from 4:50 pm. Move-under-cover work orders created in NetSuite; lot leads texted.',
    action: 'Action · NetSuite: 2 work orders',
    meta: ['SMS · 2 lot leads', 'Source · cells 2731, 2760 · 15:05 run'],
  },
];

export const hailFaqs: Faq[] = [
  {
    question: 'How far ahead does FlashHail see?',
    answer:
      'Up to 55 minutes before hail reaches a site, refreshed every five minutes, with the size class and the 1 km cell it will land on.',
  },
  {
    question: 'Is this hail tracking?',
    answer:
      'No. Tracking tools report where hail fell, from radar, after the fact. FlashHail is a forecast: the report arrives before the impact, in time to move vehicles and stage crews.',
  },
  {
    question: 'Which size classes are predicted?',
    answer:
      'Severe (the NWS threshold), damaging and destructive. Each alert names the class, so a fleet manager and a roofer can act on different thresholds from the same forecast.',
  },
  {
    question: 'Do I need hardware?',
    answer:
      'No. FlashHail is software only, delivered by app, SMS, email, horn/strobe relays and the API, and it runs beside your lightning alerts in the same Weather Command Center.',
  },
];
