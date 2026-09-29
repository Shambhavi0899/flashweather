/**
 * The Why Flash hub at /why-flash/, as data.
 *
 * Copy is the live page's ("The Flash Difference" on flashweather.ai),
 * verbatim, section by section. Every figure is one the live page publishes.
 * The only additions are the cards into the section's deep pages and the
 * Troon case study, whose titles and blurbs come from content/why-flash.ts.
 */

import { DEMO_HREF } from '@/content/navigation';
import { productPaths } from '@/content/products';
import { site } from '@/lib/seo/site';

export const WHY_FLASH_HUB_PATH = '/why-flash/';

export const whyFlashHub = {
  title: 'Why Flash: prediction, not detection',
  description:
    'Detection reports lightning after it lands. Flash predicts lightning and hail up to an hour ahead at 1 km, 99.6% accurate, so teams move people in time.',
  /** For the OG card. */
  ogHeadline: 'Prediction, not detection',
};

/** Two calls to action the live page repeats: sales and the free app. */
export const whyFlashCtas = {
  demo: { label: 'Book a Demo', href: DEMO_HREF },
  app: { label: 'Download the Free App', href: site.appDownloadUrl },
};

export const hero = {
  kicker: 'Why Flash?',
  headline: 'The world’s first AI that predicts lightning and hail before it hits.',
  body: 'Every other weather tool tells you what already happened. Flash tells you what is about to. Where and when lightning and hail will strike, down to the kilometer and the minute, up to an hour before they do. 99.6% accurate.',
};

export const category = {
  kicker: 'The category nobody else is in',
  heading: 'There are three kinds of weather tools. Only one tells you what happens next.',
  kinds: [
    {
      name: 'Detection',
      body: 'Tells you lightning is here, right now. Radar shows rain already falling. Sensors log strikes that already hit the ground. Useful, but by the time it alerts you, the bolt has already landed. You are reacting.',
      flash: false,
    },
    {
      name: 'Forecasting',
      body: 'Tells you storms are possible, somewhere in your county, sometime today. It is the app on your phone and the legacy providers behind it. Too broad and too slow. A summer storm can form, hit, and pass inside a single update cycle.',
      flash: false,
    },
    {
      name: 'Prediction. This is Flash.',
      body: 'Tells you exactly where and when lightning and hail will strike, before they do. This field. This hour. Not a faster radar and not a denser sensor network, a forecast of the storm that does not exist yet. Nobody else can honestly use that word.',
      flash: true,
    },
  ],
  closing:
    'Detection describes the present. Forecasting describes the maybe. Prediction is the only one that gives you time.',
};

export const comparison = {
  kicker: 'Prediction, not detection',
  heading: 'Everyone else reacts. Flash predicts.',
  others: {
    label: 'Everyone else',
    rows: [
      'Detects lightning once it is already here',
      'County-level forecasts',
      'Updated hourly, or slower',
      '“Chance of storms this afternoon”',
      'React and hope',
    ],
  },
  flash: {
    label: 'FLASH',
    rows: [
      'Predicts it up to an hour before it strikes',
      '1 km, field-level precision',
      'Refreshed every 2 minutes',
      '“Lightning reaches this field at 3:47”',
      'Decide with confidence',
    ],
  },
  tagline: 'Weather prediction, not weather detection.',
};

/** A run of text, bold, or a link to a built route. */
export type HubRun = string | { text: string; strong: true } | { text: string; href: string };

export const receipts = {
  kicker: 'Built to be trusted with a real decision',
  heading: 'The receipts.',
  stats: [
    { value: '99.6%', label: 'Verified lightning prediction accuracy' },
    { value: '1 km', label: 'Resolution, your property not your county' },
    { value: '2 min', label: 'Refresh, 20 to 50x faster than legacy' },
    { value: '1 hr', label: 'Of lead time before the first strike' },
    { value: '55 min', label: 'Hail prediction lead time' },
    { value: '18 hr', label: 'High-resolution predictive radar' },
  ],
  proof: [
    'Organizations that cannot afford a late call have already made the switch. Flash is the ',
    { text: 'official weather safety provider of the Big 12 Conference', strong: true },
    ', an approved vendor across all ',
    { text: '700+ Troon golf properties worldwide', href: '/case-studies/troon/' },
    ', and the ',
    { text: 'API lightning provider for Syngenta', strong: true },
    '.',
  ] as HubRun[],
  founder:
    'Built by Jason Deese, a 20-year former Senior Meteorologist at the National Weather Service, because he watched capable teams get burned by tools that only described the past.',
};

export const operation = {
  kicker: 'For your operation',
  heading: 'An hour of warning changes how you run everything.',
  body: 'An hour of lead time is the difference between managing a situation and reacting to one. An athletic director walks athletes off the field and families out of the bleachers instead of scrambling. A golf operation pages the course, stages the carts, and protects the tee sheet instead of refunding it. A construction crew makes the pour call before the trucks roll. And when the threat passes, Flash All Clear tells you the moment it is actually safe to go back out, not thirty arbitrary minutes later.',
  outcomes: [
    { value: '30-50%', label: 'less weather-related downtime' },
    { value: 'Up to 70%', label: 'lower weather-related losses' },
  ],
  outcomeNote:
    'That is what earlier, smarter calls add up to across our clients. Early decisions are simply cheaper than late ones.',
  audiences: ['Golf', 'Sports & athletics', 'Schools', 'Construction', 'Insurance', 'Aviation', 'Any outdoor operation'],
  /** What you get. A product with its own page links to it. */
  products: [
    {
      name: 'Weather Command Center',
      href: productPaths.commandCenter,
      body: 'the live screen your team runs every day, every site on one map.',
    },
    {
      name: 'Flash API',
      href: productPaths.api,
      body: 'our prediction data dropped straight into the tools you already use.',
    },
    {
      name: 'FirstStrike',
      href: productPaths.lightning,
      body: 'the industry’s first patented tool that tells you when and where lightning will occur, before the first bolt.',
    },
    {
      name: 'Flash AI Hail',
      href: productPaths.hail,
      body: 'the first predictive hail system, swath forecasts and arrival times down to the address.',
    },
    {
      name: 'FlashView',
      body: 'live radar and lightning prediction embedded into your website and the TVs around your property. A clear go or no-go anyone can read at a glance, so your team and your guests stay a step ahead of every storm.',
    },
  ] as { name: string; href?: string; body: string }[],
};

export const everyday = {
  kicker: 'For everyday life',
  heading: 'What if you got the alert before the storm?',
  body: 'The same engine that protects stadiums and job sites is in your pocket. For your backyard, your kid’s Saturday game, your tee time, your hike. Flash tells you when lightning is coming to your exact location and pushes it to your phone before the first strike, then tells you when it is safe again. Free to download, and the prediction tools are right there waiting.',
};

/** The cards into the section. Not on the live page, which has no subpages yet. */
export const deeper = {
  kicker: 'Go deeper',
  heading: 'The comparison, the explainer, the method and the proof.',
};

export const closing = {
  heading: 'Stop playing meteorologist.',
  body: 'The weather industry will keep getting better at telling you what already happened. We built Flash to tell you what happens next: predict the threat, prepare the response, protect your people and your revenue. Whether you run an operation or just want to stay a step ahead of the sky, that is the one thing every other weather tool can’t give you: time.',
  kicker: 'We don’t report the weather. We call it before it happens.',
  tagline: { plain: 'Weather prediction, ', strong: 'not weather detection.' },
};
