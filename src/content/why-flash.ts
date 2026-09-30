/**
 * The Why Flash section, as data.
 *
 * A hub at /why-flash/ and three pages under it: the comparison, the explainer
 * and the accuracy method. The comparison pages are the canonical homes of their
 * tables, definitions and glossary; other pages summarise and link here.
 * Copy is the design's, verbatim. Every Flash figure is one published on
 * flashweather.ai and defined on the accuracy-method page.
 */

import { DEMO_HREF } from '@/content/navigation';
import { productPaths } from '@/content/products';

export type PageMeta = {
  /** The <title>, 40 characters or fewer (the layout appends the brand). */
  title: string;
  /** Meta description, 140–158 characters. */
  description: string;
  path: string;
  /** Short label for breadcrumbs and cross-links. */
  label: string;
  /** One line for the cross-link cards. */
  blurb: string;
};

/**
 * `links` turns phrases of the answer into links where it is shown. The
 * answer itself stays plain text, the same string the FAQ schema carries.
 */
export type PhraseLink = { text: string; href: string };
export type Faq = { question: string; answer: string; links?: PhraseLink[] };
export type TextLink = { label: string; href: string };

/* -------------------------------------------------------------------------- */
/* Section index                                                              */
/* -------------------------------------------------------------------------- */

/** The section hub at /why-flash/: every page's "Why Flash" crumb and back-link. */
export const WHY_FLASH_HOME = '/why-flash/';

export const whyFlashPages = {
  everyoneElse: {
    title: 'Lightning prediction vs detection tools',
    description:
      'Detection alerts on lightning that already struck. Flash predicts it up to 60 minutes ahead per 1 km cell, so golf and school crews clear before it lands.',
    path: '/why-flash/everyone-else-vs-flash/',
    label: 'Everyone else vs Flash',
    blurb: 'Detection-based tools and hourly forecasts against Flash, capability by capability.',
  },
  predictionVsSensors: {
    title: 'AI lightning prediction vs sensors',
    description:
      'Detection reports strikes after they land; field meters read one mast. Flash forecasts each 1 km cell 60 minutes out, so safety officers clear fields first.',
    path: '/why-flash/prediction-vs-sensors-vs-detection/',
    label: 'Prediction vs sensors vs detection',
    blurb: 'What each technology measures, how far ahead it sees, and where it belongs in a safety plan.',
  },
  accuracyMethod: {
    title: 'Lightning prediction accuracy method',
    description:
      'Flash scores 99.6% lightning accuracy hit or miss per 1 km cell over a one-hour window, against independent strike records, so safety teams can check it.',
    path: '/why-flash/accuracy-method/',
    label: 'Accuracy method',
    blurb: 'How 99.6% is scored: ground truth, unit of measure, and how to reproduce it.',
  },
  troon: {
    title: 'Golf course lightning prediction: Troon',
    description:
      'Troon runs Flash lightning prediction across its golf courses: 60 minutes of lead per 1 km cell, a 2-minute refresh and a written log for every call.',
    path: '/case-studies/troon/',
    label: 'Case study: Troon',
    blurb: 'One Weather Command Center, one trigger and one log across a golf portfolio.',
  },
} satisfies Record<string, PageMeta>;

export type WhyFlashKey = keyof typeof whyFlashPages;

/** The order the section's pages are listed in, wherever they are listed. */
export const whyFlashOrder: WhyFlashKey[] = ['everyoneElse', 'predictionVsSensors', 'accuracyMethod', 'troon'];

/** Links used across the section. Products without a page link to their anchor. */
export const links = {
  lightning: { label: 'Lightning Prediction', href: productPaths.lightning },
  hail: { label: 'Hail Prediction', href: productPaths.hail },
  agent: { label: 'Flash Agent', href: productPaths.agent },
  api: { label: 'API offerings', href: productPaths.api },
  // No integrations page exists; connectors are documented on the API page.
  integrations: { label: 'Integrations', href: productPaths.api },
  weatherShield: { label: 'Flash Weather Shield', href: productPaths.weatherShield },
  commandCenter: { label: 'Weather Command Center', href: productPaths.commandCenter },
  mobileApp: { label: 'Flash Mobile App', href: productPaths.mobileApp },
  golf: { label: 'Golf', href: '/industries-we-serve/golf/' },
  schools: { label: 'Schools & athletics', href: '/industries-we-serve/schools/' },
  georgia: { label: 'Georgia heat-policy guide', href: '/resources/state-heat-policies/georgia/' },
  pricing: { label: 'Pricing', href: '/pricing/' },
  contact: { label: 'Contact', href: DEMO_HREF },
} satisfies Record<string, TextLink>;

/* -------------------------------------------------------------------------- */
/* 09 · Everyone else vs Flash                                                */
/* -------------------------------------------------------------------------- */

export const summaryStrip = [
  {
    label: 'Lead time',
    else: 'Alerts on strikes already located, or one hourly forecast',
    flash: 'Up to 60 minutes ahead, predicted per 1×1 km cell',
  },
  {
    label: 'Resolution',
    else: 'One answer for every site in the county',
    flash: '1×1 km: each site gets its own cell and its own answer',
  },
  {
    label: 'Refresh',
    else: 'Hourly, or whenever the next strike lands',
    flash: 'Every 2 minutes for lightning, every 5 minutes for hail',
  },
  {
    label: 'Hardware',
    else: 'Sensors, masts or sirens to install, power and lease',
    flash: 'None. Web app, mobile app, API, SMS and horn relays',
  },
];

export type ComparisonIcon = 'timing' | 'resolution' | 'refresh' | 'forecast' | 'decision';

/** The side-by-side table. `capability` is the (visually hidden) row header. */
export const comparisonRows: {
  capability: string;
  icon: ComparisonIcon;
  else: { title: string; body: string };
  flash: { title: string; body: string };
}[] = [
  {
    capability: 'Alert timing',
    icon: 'timing',
    else: { title: "Detects lightning once it's already here", body: 'The first alert is the first strike.' },
    flash: {
      title: 'Predicts it up to an hour before it strikes',
      body: 'Every cell is scored 60 minutes out, so the call is made early.',
    },
  },
  {
    capability: 'Resolution',
    icon: 'resolution',
    else: { title: 'County-level forecasts', body: 'One answer for every site in the county.' },
    flash: { title: '1×1 km, field-level precision', body: 'Each site gets its own cell and its own answer.' },
  },
  {
    capability: 'Refresh rate',
    icon: 'refresh',
    else: { title: 'Updated hourly, or slower', body: 'The storm moves faster than the map.' },
    flash: { title: 'Refreshed every 2 minutes', body: 'The map moves with the storm, not behind it.' },
  },
  {
    capability: 'Forecast',
    icon: 'forecast',
    else: { title: '“Chance of storms this afternoon”', body: 'A percentage and a shrug.' },
    flash: { title: '“Lightning reaches this field at 3:47”', body: 'A place, a time, a decision.' },
  },
  {
    capability: 'Decision',
    icon: 'decision',
    else: { title: 'React and hope', body: 'Clear the field after the first flash.' },
    flash: {
      title: 'Decide with confidence',
      body: 'A GO or NO-GO with the time attached, and a log to prove it.',
    },
  },
];

export const clockCards = [
  {
    /** Which markers on the clock dial belong to this card. */
    key: 'detection',
    label: 'Detection-based tools',
    lead: 'The first alert is the first strike. A sensor network locates a cloud-to-ground strike seconds after it happens and tells you whether it fell inside a radius you set. Precise about the past, silent about the next hour.',
    onSite:
      'You clear the field after the first flash, and the return-to-play clock starts from a strike that has already landed.',
  },
  {
    key: 'flash',
    label: 'Flash · Prediction',
    lead: 'Every 1×1 km cell carries a forecast for the coming hour, refreshed every 2 minutes. When a cell is flagged, the crew, the tee sheet and the safety officer get the call before the first strike, with a time attached.',
    onSite:
      'You decide with up to 60 minutes in hand, log the decision, and still see detected strikes on the same map when they come.',
  },
];

/**
 * The clock dial between the two cards: one hour, from –60 min at the top to
 * the first strike at the end of the sweep, and the detection alert after it.
 */
export const clockDial = {
  start: '–60 min',
  flash: 'Flash flags the cell',
  window: 'Your hour',
  strike: 'First strike',
  detection: 'Detection alert',
  /** Minutes before the strike, clockwise between –60 and the strike. */
  ticks: ['–45', '–30', '–15'],
  replay: 'Replay',
  caption: 'Figure · Where each alert sits on the clock · Illustrative example · Not live weather',
  alt: 'A clock dial for the hour before a first cloud-to-ground strike. Flash flags the cell at 60 minutes before; the hour after it fills gold as your hour; then the first strike, and a detection alert only after it.',
};

/**
 * The self-check under "When is a detection-based tool the better fit?":
 * a "This is me" box per case, and the verdict it adds up to.
 */
export const detectionFitCheck = {
  pill: 'Applies to us',
  label: 'Your fit',
  count: (n: number, of: number) => `${n} of ${of} apply`,
  next: 'See your options below',
  none: 'Prediction fits how you work.',
  some: 'A detection tool, or detection alongside Flash, may fit you better.',
  why: 'Here’s why:',
};

export const detectionFits: {
  title: string;
  body: string;
  /** A phrase inside `body` that links out. */
  link?: TextLink;
  /** This case's line in the verdict once it is checked, from its own body copy. */
  reason: string;
  image: { src: string; alt: string };
}[] = [
  {
    title: 'Your written policy names an on-site device.',
    body: 'If your state or conference policy requires a sideline WBGT reading or a field-meter alarm, keep the device the policy names. Flash runs beside it for the hour before a storm and for the heat-planning outlook; it does not replace the reading.',
    reason: 'Keep the device your policy names. Flash runs beside it for the hour before a storm.',
    image: {
      src: '/images/why-flash/flash-rooftop-sensor-mast-storm-sky.jpg',
      alt: 'A slender on-site weather sensor mast mounted on a flat commercial rooftop under a storm sky, for the case where a written policy names an on-site device',
    },
  },
  {
    title: 'You only need confirmation.',
    body: 'If the job is to confirm that a strike happened inside a radius and start the return-to-play clock, a detection feed does that well. Flash shows detected strikes on the same map, so the two never disagree about what happened.',
    reason: 'A detection feed confirms a strike inside your radius and starts the return-to-play clock well.',
    image: {
      src: '/images/why-flash/flash-operations-control-room-radar-screens.jpg',
      alt: 'A dim operations control room at night with monitors showing radar maps, for the case where a team only needs confirmation that a strike happened',
    },
  },
  {
    title: 'You want one vendor for hardware and app.',
    body: 'Some tools bundle a station, sirens and software in one lease. Flash is software first: it drives the horns and strobes you already own through relays, and Flash Weather Shield adds a predictive siren on site where you want one.',
    reason: 'Some tools bundle a station, sirens and software in one lease.',
    link: { label: 'Flash Weather Shield', href: productPaths.weatherShield },
    image: {
      src: '/images/why-flash/flash-on-site-warning-siren-open-field.jpg',
      alt: 'An outdoor warning siren and strobe head on a pole at the edge of an open field under a storm sky, for the case where one vendor supplies hardware and software',
    },
  },
];

/**
 * "Your options". Each card ends in one next step; `primary` makes it a
 * button rather than a text link. Detection's goes to Integrations: its card
 * is about a detection feed, which Flash connects to rather than replaces.
 */
export const options: {
  name: string;
  fits: string;
  watch: string;
  action: { label: string; href: string; primary?: boolean };
}[] = [
  {
    name: 'Flash Weather AI',
    fits: 'You need to act before the first strike across one site or hundreds, with nothing to install: prediction up to 60 minutes ahead per 1×1 km cell, refreshed every 2 minutes, with a published accuracy method.',
    watch: 'No on-site WBGT probe. Where policy requires one, run a sideline device beside Flash.',
    action: { label: 'Book a demo', href: DEMO_HREF, primary: true },
  },
  {
    name: 'Detection-only tools',
    fits: 'You only need confirmation that lightning has occurred within a radius, and a return-to-play clock that starts from the last strike. Often the cheapest feed to run.',
    watch:
      'The first strike is the trigger, so the alert follows it. Your radius rule decides how often you stop for storms that never reach you.',
    action: { label: 'Keep your sensor, add Flash', href: links.integrations.href },
  },
  {
    name: 'Do it yourself: public radar and a handheld WBGT',
    fits: 'Budgets are tight and one trained person can watch radar, take readings and make the call for a single site.',
    watch: 'No written alert log, no lead time, and every decision depends on who is on duty that afternoon.',
    action: { label: 'Try the free app', href: links.mobileApp.href },
  },
];

/** The "Start here" badge on "Your options", and the note beside it once a self-check box is ticked. */
export const optionsBadge = { label: 'Start here', both: 'Many sites run both' };

/** "Everyone else vs the agentic approach": the Flash Agent loop, in three steps. */
export const agenticSteps = [
  { label: 'Ask', body: '“Which of my sites has a lightning Watch before Sunday’s tee times?”' },
  { label: 'Answer', body: 'From the same 1×1 km cells, refreshed every 2 minutes.' },
  { label: 'Act', body: 'Moves practice, flags the tee sheet, reschedules the lift. Confirmed by a person.' },
];

export const everyoneElseFaqs: Faq[] = [
  {
    question: 'Do prediction tools have more false alarms than detection?',
    answer:
      'Detection has almost none for strikes that have already happened, because it reports the past. Prediction is a forecast, so it is scored like one: Flash publishes how each 1×1 km cell is scored on the one-hour window, against an independent record of cloud-to-ground strikes, on the Accuracy Method page.',
  },
  {
    question: 'Is lightning prediction the same as lightning detection?',
    answer:
      'No. Detection reports a strike that has happened; prediction forecasts where a strike is likely in the next 60 minutes. Flash shows both on one map. The prediction vs sensors vs detection explainer walks through the three technologies.',
    links: [{ text: 'prediction vs sensors vs detection explainer', href: '/why-flash/prediction-vs-sensors-vs-detection/' }],
  },
  {
    question: 'Do I need any hardware to run Flash?',
    answer:
      'No. Flash is software: web app, mobile app, API, SMS and email, and relays for horns or strobes you already own. If your policy requires an on-site WBGT device, keep it and run Flash beside it.',
  },
  {
    question: 'Can I keep my detection feed and add Flash?',
    answer:
      'Yes, and we recommend it. Detection confirms the strike and anchors your return-to-play clock; Flash gives you the hour before it. Flash Agent answers from the same cells and acts in the tools you already run.',
  },
];

/* -------------------------------------------------------------------------- */
/* 10 · Prediction vs sensors vs detection                                    */
/* -------------------------------------------------------------------------- */

export const technologies: {
  name: string;
  tag: string;
  sees: { kind: 'strikes' | 'radius' | 'cell'; label: string };
  body: string;
  image: { src: string; alt: string };
}[] = [
  {
    name: 'Detection network',
    tag: 'After the strike',
    /** What the card's image overlay shows it seeing (components/why-flash/measure-overlay.tsx). */
    sees: { kind: 'strikes', label: 'Already happened' },
    body: 'A national array of ground sensors listens for the electromagnetic pulse of a lightning return stroke and triangulates where it hit, usually within seconds. It is the reference record of what happened, and the kind of independent ground truth a forecast like Flash is scored against. A detection alert is precise about the past and silent about the next hour.',
    image: {
      src: '/images/why-flash/flash-lightning-strike-open-ground-detection-network.jpg',
      alt: 'A cloud-to-ground lightning bolt striking open flat ground at night, illustrating what a detection network reports after the strike',
    },
  },
  {
    name: 'Electrostatic field meter',
    tag: 'At one mast',
    sees: { kind: 'radius', label: 'One point, one radius' },
    body: 'A single mast measures the static electric field around one point and raises an alarm when the field climbs past a threshold. Because it reads charge rather than lightning, it can respond to a storm building overhead, and also to machinery, power lines and dust. It sees only its own surroundings, needs power and mounting at every site, and its warning time is whatever the local field allows.',
    image: {
      src: '/images/why-flash/flash-electrostatic-field-meter-mast-single-site.jpg',
      alt: 'A single slender instrument mast on a fence line at the edge of an open field under a charged storm sky, illustrating an electrostatic field meter reading one point',
    },
  },
  {
    name: 'AI prediction (Flash)',
    tag: 'Before the strike',
    sees: { kind: 'cell', label: 'Your cell, next 60 min' },
    body: 'Flash ingests over 100 atmospheric parameters and forecasts, for every 1 × 1 km cell, the likelihood of a cloud-to-ground strike in the next 60 minutes. It refreshes every 2 minutes and needs no on-site hardware. Its output is a forecast, so it is scored like one: hit or miss per cell on the one-hour window, against an independent ground truth, with the method published.',
    image: {
      src: '/images/why-flash/flash-storm-shelf-cloud-before-first-strike.jpg',
      alt: 'A storm shelf cloud advancing over low rooftops before any lightning has struck, illustrating the hour AI prediction forecasts ahead of the first strike',
    },
  },
];

export const techColumns = ['Detection network', 'Electrostatic sensor', 'AI prediction · Flash'] as const;

/**
 * How far ahead each column can see, drawn as a relative bar under its Lead
 * time cell: none, short, long. Not a scale; the label is the cell's own words.
 */
export type LeadBar = { reach: 'none' | 'short' | 'long'; label: string };

export const techRows: {
  criterion: string;
  cells: [string, string, string];
  links?: PhraseLink[];
  bars?: [LeadBar, LeadBar, LeadBar];
}[] = [
  {
    criterion: 'What it measures',
    cells: [
      'The electromagnetic pulse of a strike that has already occurred, located by triangulation across a national sensor network.',
      'The static electric field at one mast, over the few hundred metres around it.',
      'Over 100 atmospheric parameters, scored per 1 × 1 km cell.',
    ],
  },
  {
    criterion: 'Lead time',
    cells: [
      'None before the first strike. The alert follows the strike, within seconds.',
      'Vendor-stated warnings of several minutes; validation methods vary by product.',
      'Up to 60 minutes before a first strike, per 1 × 1 km cell, refreshed every 2 minutes.',
    ],
    bars: [
      { reach: 'none', label: 'None before first strike' },
      { reach: 'short', label: 'Minutes, vendor-stated' },
      { reach: 'long', label: 'Up to 60 min' },
    ],
  },
  {
    criterion: 'Where it works',
    cells: [
      'Anywhere the network covers; nothing at the site.',
      'Only around the mast. Each site needs its own unit, power and connectivity.',
      'Continental U.S., Canada and Mexico; any site you place on the map.',
    ],
  },
  {
    criterion: 'False-alarm behaviour',
    cells: [
      'Very low for strikes that happened. Your radius rule decides how often you stop for strikes that never reach you.',
      'Sensitive to local charge sources such as machinery and power lines: the basis of the “false alarm” caution in athletic-safety guidance.',
      'Scored per cell on the one-hour window against an independent ground truth; the method is published and the validation dataset can be requested.',
    ],
  },
  {
    criterion: 'Cost & install',
    cells: [
      'Subscription; sirens optional.',
      'Hardware purchase or lease per site, plus mast, mounting and maintenance.',
      'Software subscription, nothing to install; horn and strobe relays optional. See the pricing tiers.',
    ],
    links: [{ text: 'pricing tiers', href: '/pricing/' }],
  },
  {
    criterion: 'Best for',
    cells: [
      "Confirming a strike and running your policy's return-to-play clock.",
      'Sites whose written policy names a field-meter alarm.',
      'Clearing the field before the first strike, across one site or hundreds.',
    ],
  },
];

export const guidanceParagraphs = [
  'Position statements from athletic-training and collegiate sports-medicine bodies caution against relying on a single-point electrostatic “lightning prediction” device as the sole trigger for clearing a field. The reasoning is sound: a local field reading can rise for reasons other than an approaching storm, and it cannot see a cell that is outside its sensing range. That caution is about an instrument class.',
  'Flash is a different category. It is a forecast model, not a field meter: it scores every 1 × 1 km cell on the one-hour window against an independent record of cloud-to-ground strikes, and publishes how that score is computed, what it covers and what it does not.',
  'We recommend Flash alongside your detection feed and your written policy, not instead of them. If your policy names a detection radius or a sideline device, keep it. Flash gives you the 60 minutes before that rule fires.',
];

export const safetyStack = [
  {
    step: '01',
    when: 'Before · The 60 minutes',
    name: 'Flash prediction',
    duty: 'Before the storm',
    body: 'Per 1 km cell, refreshed every 2 minutes, up to 60 minutes ahead. Clear the field on Advisory or Warning, whichever your policy sets.',
    gold: true,
    /** Glossary terms the step's sidenote links down to. */
    terms: ['1 km cell', 'Advisory · Watch · Warning'],
  },
  {
    step: '02',
    when: 'During · Confirmation',
    name: 'Detection feed',
    duty: 'During the storm',
    body: 'Confirm each strike and start your return-to-play clock from the last one. Flash shows detected strikes on the same map.',
    gold: false,
    /** Glossary terms the step's sidenote links down to. */
    terms: ['NLDN', 'Return-to-play'],
  },
  {
    step: '03',
    when: 'On the sideline · Policy',
    name: 'WBGT sensor',
    duty: 'On the sideline, for policy',
    body: 'Where your state requires an on-site reading, take it with the device the policy names. Flash carries the heat-planning outlook for the day.',
    gold: false,
    /** Glossary terms the step's sidenote links down to. */
    terms: ['WBGT'],
  },
];

/** The chip label on each stack item, and the line under the three: "= one complete safety plan". */
export const safetyStackCopy = {
  duty: 'On duty',
  sum: 'one complete safety plan',
};

/** The glossary row's anchor: "Advisory · Watch · Warning" -> "term-advisory-watch-warning". */
export function glossaryId(term: string) {
  return `term-${term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}`;
}

export const glossary: { term: string; definition: string }[] = [
  {
    term: 'NLDN',
    definition:
      'The National Lightning Detection Network: ground sensors across the continental U.S. that locate strikes by triangulation. The reference record most U.S. safety programmes use.',
  },
  {
    term: 'Cloud-to-ground (CG)',
    definition:
      'A lightning flash that reaches the ground. The only kind Flash forecasts and scores; intra-cloud flashes are excluded.',
  },
  {
    term: 'First strike',
    definition:
      'The first CG strike of a storm cell inside a given 1 km cell. Detection can only report it; prediction is scored on whether it flagged the cell first.',
  },
  {
    term: 'False-alarm ratio',
    definition:
      'Flagged cell-windows with no CG strike, divided by all flagged cell-windows. Tracked alongside the hit rate so a forecast cannot score well by flagging everything.',
  },
  {
    term: 'WBGT',
    definition:
      'Wet-bulb globe temperature: a heat-stress index combining temperature, humidity, wind and solar load. Many state policies require an on-site reading.',
  },
  {
    term: 'Return-to-play',
    definition:
      'The wait after the last detected strike before activity resumes. Its length is set by your policy; Flash shows detected strikes on the same map so the clock starts from the right one.',
  },
  {
    term: 'Advisory · Watch · Warning',
    definition:
      "Flash's three alert levels for a cell, in rising order of likelihood inside the one-hour window. Your written policy names the level that clears the field.",
  },
  {
    term: '1 km cell',
    definition:
      'The 1 × 1 km grid square Flash forecasts. Every site sits in one cell, and every score on the Accuracy Method page is computed per cell.',
  },
];

export const predictionFaqs: Faq[] = [
  {
    question: 'Can any system predict exactly where lightning will strike?',
    answer:
      'No system predicts the exact strike point. Flash forecasts the likelihood that a 1 × 1 km cell sees a cloud-to-ground strike in the next 60 minutes, and scores that forecast against an independent ground truth: 99.6% accuracy on the one-hour window.',
  },
  {
    question: 'Is an electrostatic sensor the same thing as AI prediction?',
    answer:
      'No. A field meter reads the charge at one mast. Flash reads over 100 atmospheric parameters across the whole grid, refreshes every 2 minutes and publishes how its accuracy is scored.',
  },
  {
    question: 'Do I still need a detection feed if I run Flash?',
    answer:
      'Keep it. Detection confirms the strike and anchors your return-to-play clock; Flash gives you the time before it. Flash shows detected strikes on the same map so the two never disagree about what happened.',
  },
  {
    question: 'Where can I check the accuracy numbers myself?',
    answer:
      'The accuracy method publishes the ground truth, the unit of measure and how each cell is scored on the one-hour window, so you can read exactly what 99.6% means, and explains how to request the validation dataset.',
    links: [{ text: 'accuracy method', href: '/why-flash/accuracy-method/' }],
  },
];

/* -------------------------------------------------------------------------- */
/* 11 · Accuracy method                                                       */
/* -------------------------------------------------------------------------- */

export const accuracyFacts = [
  { label: 'Ground truth', value: 'Independent cloud-to-ground strike record' },
  { label: 'Window', value: 'One hour, per 1×1 km cell' },
  { label: 'Scored', value: 'Hit or miss, cell by cell' },
  { label: 'Forecast refresh', value: 'Every 2 minutes' },
  { label: 'Reviewed by', value: "Flash's Chief Meteorologist" },
];

/** The document's sections, in order. Ids are the in-page anchors. */
export const accuracySections = [
  { id: 'summary', label: 'Summary' },
  { id: 'ground-truth', label: 'Ground truth' },
  { id: 'unit-of-measure', label: 'Unit of measure' },
  { id: 'how-the-score-is-built', label: 'How the score is built' },
  { id: 'worked-example', label: 'Worked example' },
  { id: 'what-it-does-not-cover', label: 'What it does not cover' },
  { id: 'reproduce-it', label: 'Reproduce it' },
  { id: 'reviewer', label: 'Reviewer' },
] as const;

export const scoreSteps = [
  'Align. Flags and strikes are matched cell by cell and hour by hour. A strike is compared only with the flags issued for its own cell in the hour before it.',
  'Classify. Every strike becomes a hit or a miss. Every flagged cell-window with no strike becomes a false alarm. Nothing is dropped and nothing is counted twice.',
  'Score. Accuracy is hits divided by all strikes. The false-alarm side is tracked beside it, because a forecast that flagged every cell all day would score a perfect hit rate; both are reviewed together before a figure is published.',
];

export const workedExample: {
  cell: string;
  flag: string;
  strike: string;
  result: 'Hit' | 'False alarm' | 'Miss';
}[] = [
  { cell: 'Cell A · north field', flag: 'Advisory at 2:10 PM', strike: '2:47 PM, inside the cell', result: 'Hit' },
  { cell: 'Cell B · car park', flag: 'Advisory at 2:12 PM', strike: 'None by 3:12 PM', result: 'False alarm' },
  { cell: 'Cell C · east range', flag: 'No flag', strike: '2:30 PM, inside the cell', result: 'Miss' },
];

export const notCovered = [
  'Intra-cloud lightning. Only cloud-to-ground strikes are forecast and scored.',
  'Sites outside the continental United States, Canada and Mexico. No forecast is issued there, so nothing is scored.',
  'Hail. Hail is predicted by its own model, up to 55 minutes before the first stone falls, at 1-km resolution with updates every five minutes, built on four years of convective storm data across the CONUS (2021 through 2024). It is scored by its own method; the 99.6% on this page is a lightning figure only.',
];

export const reproduceSteps = [
  'Email support@flashweather.ai with the subject “Validation dataset”. You receive a CSV: cell id, cell centroid, flag timestamp, alert level, and the matched ground-truth strike timestamp or none.',
  'Recompute. Accuracy = hits ÷ (hits + misses). False-alarm ratio = false alarms ÷ flagged cell-windows. The worked example above is the whole of the arithmetic.',
  'Compare. Your accuracy should match the 99.6% on this page. If it does not, write to us and we will publish the discrepancy here.',
];

export const reviewer = {
  name: 'Jason Deese',
  initials: 'JD',
  role: 'Founder and Chief Meteorologist, Flash Weather AI',
  bio: "A career meteorologist, formerly with NOAA's National Weather Service. Responsible for the method and every figure on this page.",
};
