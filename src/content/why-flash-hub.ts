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
import { type WhyFlashKey, whyFlashPages } from '@/content/why-flash';
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
      key: 'detection',
      name: 'Detection',
      body: 'Tells you lightning is here, right now. Radar shows rain already falling. Sensors log strikes that already hit the ground. Useful, but by the time it alerts you, the bolt has already landed. You are reacting.',
      flash: false,
      /** Its mark on the time axis under the cards. */
      mark: 'already happened',
    },
    {
      key: 'forecasting',
      name: 'Forecasting',
      body: 'Tells you storms are possible, somewhere in your county, sometime today. It is the app on your phone and the legacy providers behind it. Too broad and too slow. A summer storm can form, hit, and pass inside a single update cycle.',
      flash: false,
      mark: 'somewhere, sometime',
    },
    {
      key: 'prediction',
      name: 'Prediction. This is Flash.',
      body: 'Tells you exactly where and when lightning and hail will strike, before they do. This field. This hour. Not a faster radar and not a denser sensor network, a forecast of the storm that does not exist yet. Nobody else can honestly use that word.',
      flash: true,
      mark: 'this place, this time',
    },
  ],
  /** The time axis under the cards, left to right. */
  axis: ['Earlier', 'NOW', 'Next hour', 'Later today'],
  /** The axis is drawn, so assistive tech reads this instead. */
  axisLabel:
    'On a timeline from earlier to later today: detection marks what already happened, at now. Forecasting is a wide band across later today, somewhere, sometime. Prediction is one sharp mark in the next hour: this place, this time.',
  closing:
    'Detection describes the present. Forecasting describes the maybe. Prediction is the only one that gives you time.',
};

export const comparison = {
  kicker: 'Prediction, not detection',
  heading: 'Everyone else reacts. Flash predicts.',
  labels: { others: 'Everyone else', flash: 'Flash' },
  /** Row by row: what everyone else does, and what Flash does instead. */
  pairs: [
    { others: 'Detects lightning once it is already here', flash: 'Predicts it up to an hour before it strikes' },
    { others: 'County-level forecasts', flash: '1 km, field-level precision' },
    { others: 'Updated hourly, or slower', flash: 'Refreshed every 2 minutes' },
    { others: '“Chance of storms this afternoon”', flash: '“Lightning reaches this field at 3:47”' },
    { others: 'React and hope', flash: 'Decide with confidence' },
  ],
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
    { value: '1 hr', label: 'Lead time before the first strike' },
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
  /** The slip the stats print on: a header line, then a footer into the method. */
  slip: {
    title: 'Flash Weather AI · Receipt',
    verified: 'Verified against ground truth',
    method: { text: 'see method', href: whyFlashPages.accuracyMethod.path },
  },
  founder:
    'Built by Jason Deese, a 20-year former Senior Meteorologist at the National Weather Service, because he watched capable teams get burned by tools that only described the past.',
};

export const operation = {
  kicker: 'For your operation',
  heading: 'An hour of warning changes how you run everything.',
  /**
   * The paragraph opens and closes on these; the chip picked (Golf first)
   * puts its scenario between them.
   */
  lead: 'An hour of lead time is the difference between managing a situation and reacting to one.',
  close:
    'And when the threat passes, Flash All Clear tells you the moment it is actually safe to go back out, not thirty arbitrary minutes later.',
  /** `range` is the share the bar fills, in percent. */
  outcomes: [
    { value: '30-50%', label: 'less weather-related downtime', range: [30, 50] },
    { value: 'Up to 70%', label: 'lower weather-related losses', range: [0, 70] },
  ] as { value: string; label: string; range: [number, number] }[],
  outcomeNote:
    'That is what earlier, smarter calls add up to across our clients. Early decisions are simply cheaper than late ones.',
  /**
   * Golf, Sports & athletics and Construction are the live paragraph's own
   * sentences. The rest are drafted from the industry pages' copy and wait on
   * approval; Aviation has no page, so its line has no source yet.
   */
  audiences: [
    {
      name: 'Golf',
      scenario: 'A golf operation pages the course, stages the carts, and protects the tee sheet instead of refunding it.',
    },
    {
      name: 'Sports & athletics',
      scenario:
        'An athletic director walks athletes off the field and families out of the bleachers instead of scrambling.',
    },
    {
      name: 'Schools',
      scenario:
        'A school moves afternoon practice on the WBGT outlook instead of cancelling it late, and every alert and all-clear is already in the log when the district or its insurer asks.',
    },
    { name: 'Construction', scenario: 'A construction crew makes the pour call before the trucks roll.' },
    {
      name: 'Insurance',
      scenario:
        'A claims team knows which addresses the hail actually reached, and a fleet manager moves vehicles off the lots inside the hail window before the first stone falls.',
    },
    {
      name: 'Aviation',
      scenario: 'A ramp crew clears the flight line before the first strike is possible, not when the thunder starts.',
    },
    {
      name: 'Any outdoor operation',
      scenario:
        'A venue moves a full house under cover on a plan, and a city clears every pool, park and crew on the same warning.',
    },
  ],
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
  /** The step each card is, numbered in whyFlashOrder. */
  steps: {
    everyoneElse: 'Compare',
    predictionVsSensors: 'Understand',
    accuracyMethod: 'Verify',
    troon: 'See proof',
  } satisfies Record<WhyFlashKey, string>,
};

export const closing = {
  heading: 'Stop playing meteorologist.',
  body: 'The weather industry will keep getting better at telling you what already happened. We built Flash to tell you what happens next: predict the threat, prepare the response, protect your people and your revenue. Whether you run an operation or just want to stay a step ahead of the sky, that is the one thing every other weather tool can’t give you: time.',
  kicker: 'We don’t report the weather. We call it before it happens.',
  tagline: { plain: 'Weather prediction, ', strong: 'not weather detection.' },
};
