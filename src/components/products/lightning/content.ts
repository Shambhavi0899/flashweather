/**
 * Copy and data for /products/lightning-prediction/, from the Paper design
 * ("03 · Lightning Prediction"). Client-approved copy: change it here, not in
 * the section components.
 */

import type { IndustryPanel } from '@/components/home/industry-panel-list';
import type { Faq } from '@/content/products';
import { productPaths, productsCrumb } from '@/content/products';

export const lightningPage = {
  name: 'Lightning Prediction',
  productName: 'Flash Lightning Prediction',
  path: productPaths.lightning,
  title: 'Lightning prediction, 60 minutes ahead',
  description:
    'Flash predicts cloud-to-ground lightning up to 60 minutes ahead, per 1 km cell, refreshed every 2 minutes. 99.6% accurate against NLDN strikes. No sensors.',
  heroImage: '/images/products/flash-lightning-suite-product-render.png',
} as const;

export const lightningTrail = [...productsCrumb, { name: lightningPage.name, path: lightningPage.path }];

export const accuracyMethodPath = '/why-flash/accuracy-method/';
export const predictionVsDetectionPath = '/why-flash/prediction-vs-sensors-vs-detection/';
export const faqIndexPath = '/resources/frequently-asked-questions/';

/* ------------------------------------------------------------------ Hero */

export const hero = {
  eyebrow: 'Flash Lightning Prediction · FlashPredict engine',
  heading: 'Lightning prediction up to 60 minutes before the first strike, to the 1 km cell.',
  body: 'Flash Lightning Prediction forecasts where cloud-to-ground lightning will occur in the next 60 minutes, at 1 × 1 km resolution, refreshed every 2 minutes. It is 99.6% accurate on that one-hour window, and needs no sensors.',
  footnote: 'Alerts reach the field by app, SMS, horn/strobe, API or Flash Agent · Trusted by Troon, Big 12 and NAIA',
  /**
   * The forecast map, an interactive demo (risk-map.tsx, risk-model.ts).
   * Each site's `schedule` is its story in minutes from now: CAUTION, then
   * NO-GO (the forecast first strike, which its countdown runs down to), then
   * `passed`, when the storm has gone by and the all-clear time, 30 minutes
   * later, is known. The storm model is tuned to reach each site on this
   * schedule. `pin` is the centre of the site's 1 km cell in the map's
   * 570×330 frame at 12px a cell.
   */
  map: {
    alt: 'Flash lightning prediction map with 1 km risk cells at low, elevated and high intensity moving along the storm track toward a practice field and a stadium, scrubbed ahead on the forecast slider',
    title: 'Lightning · next 60 min · 1 km cells',
    refreshed: 'Refreshed 2 min ago',
    disclaimer: 'Illustrative example · not live weather',
    scrubberLabel: 'Forecast scrubber',
    ticks: ['Now', '+15', '+30', '+45', '+60'],
    alert: { sent: 'Alert sent', channels: 'App · SMS · Horn' },
    sites: [
      {
        id: 'practice',
        name: 'Practice Field B',
        schedule: { caution: 10, nogo: 18, passed: 39 },
        pin: [270, 222] as [number, number],
      },
      {
        id: 'stadium',
        name: 'Stadium',
        schedule: { caution: 22, nogo: 31, passed: 46 },
        pin: [414, 114] as [number, number],
      },
    ],
    /** The basemap's towns: label and dot, map px. */
    towns: [
      { name: 'Pine Ridge', at: [74, 62] as [number, number] },
      { name: 'Millbrook', at: [214, 118] as [number, number] },
      { name: 'Easton', at: [496, 212] as [number, number] },
    ],
  },
};

/* ------------------------------------------------------------ Spec table */

/**
 * The approved fact sheet, as the section lays it out: the four headline
 * figures as tiles over two tables. Every label and value is the fact
 * sheet's wording; the tiles took their rows out of the Forecast table, and
 * Inputs and Coverage moved from Delivery to Forecast so the two tables match.
 *
 * `id` picks a row's icon and the small visual beside its value
 * (spec-table.tsx). The visuals decorate; the value is always the text.
 */
export type SpecTile = {
  diagram: 'lightning' | 'accuracy' | 'refresh' | 'resolution';
  value: string;
  label: string;
  detail: string;
  link?: { label: string; href: string };
};

export type SpecRowId = 'outlook' | 'ground-truth' | 'inputs' | 'coverage' | 'agent' | 'mobile' | 'channels' | 'hardware';

export type SpecRow = {
  id: SpecRowId;
  label: string;
  value: string;
  /** A follow-up link under the value. */
  link?: { label: string; href: string };
};

export type SpecChannel = { label: string; icon: 'app' | 'sms' | 'email' | 'horn' | 'api' | 'agent' };

export const specs = {
  label: 'Specifications · One set of numbers, site-wide',
  heading: 'What exactly does it predict, and how well?',
  aside: 'Every figure below is the approved fact sheet, the same numbers used site-wide.',
  badge: 'Verified figures',
  tiles: [
    { diagram: 'lightning', value: '60 min', label: 'Prediction horizon', detail: 'Up to 60 minutes, strike-level' },
    {
      diagram: 'accuracy',
      value: '99.6%',
      label: 'Accuracy',
      detail: '99.6% on the one-hour prediction window',
      link: { label: 'How it is measured', href: accuracyMethodPath },
    },
    { diagram: 'refresh', value: '2 min', label: 'Refresh', detail: 'Every 2 minutes' },
    { diagram: 'resolution', value: '1×1 km', label: 'Resolution', detail: '1 × 1 km grid cells' },
  ] satisfies SpecTile[],
  forecast: [
    { id: 'outlook', label: 'Planning outlook', value: '6 hours' },
    { id: 'ground-truth', label: 'Ground truth', value: 'NLDN cloud-to-ground strikes' },
    { id: 'inputs', label: 'Inputs', value: 'Over 100 atmospheric parameters' },
    { id: 'coverage', label: 'Coverage', value: 'Continental U.S., Canada, Mexico' },
  ] satisfies SpecRow[],
  delivery: [
    {
      id: 'agent',
      label: 'Flash Agent',
      value: 'Ask in plain language; get an answer or an action',
      link: { label: 'Meet Flash Agent', href: productPaths.agent },
    },
    { id: 'mobile', label: 'Mobile app', value: 'Enterprise-grade prediction in your pocket, with 18 hours of future radar' },
    { id: 'channels', label: 'Channels', value: 'App, SMS, email, horn/strobe relays, API, Flash Agent' },
    { id: 'hardware', label: 'Hardware', value: 'None. Nothing to install or maintain.' },
  ] satisfies SpecRow[],
  /** The Channels row's chips, in the order of its value. */
  channels: [
    { label: 'App', icon: 'app' },
    { label: 'SMS', icon: 'sms' },
    { label: 'Email', icon: 'email' },
    { label: 'Horn/strobe', icon: 'horn' },
    { label: 'API', icon: 'api' },
    { label: 'Flash Agent', icon: 'agent' },
  ] satisfies SpecChannel[],
  /** The Mobile app row's chip. */
  radarChip: '18h future radar',
  agent: {
    tag: 'Agentic',
    name: 'Flash Agent',
    body: 'Flash provides the harness: the prediction engine, your sites and your data, connected to the tools you already run. Ask in plain language; get an answer or an action.',
    link: { label: 'Meet Flash Agent', href: productPaths.agent },
    /** The one-line exchange the banner plays (Illustrative; the stadium is the hero map's). */
    chat: { question: 'Is the stadium clear at 7?', status: 'No-go until 19:24', reply: 'Alert sent.' },
  },
};

/* -------------------------------------------------------------- Timeline */

export type TimelineStep = {
  time: string;
  title: string;
  body: string;
  tag: string;
  /** Tailwind background class for the marker dot. */
  dot: string;
  image: { src: string; alt: string };
};

export const timeline = {
  label: 'The workflow · From advisory to all-clear',
  heading: 'How do teams use the 60 minutes?',
  alt: 'Flash lightning alert timeline from the advisory at sixty minutes through watch and warning to the all-clear',
  steps: [
    {
      time: 'T–60',
      title: 'Advisory',
      body: 'A cell is forecast to reach the site inside the hour. The athletic trainer sees it on the phone; nothing changes on the field yet.',
      tag: 'Cell forecast',
      dot: 'bg-viz-gold',
      image: {
        src: '/images/products/flash-thunderstorm-anvil-open-ground-t60-advisory.png',
        alt: 'A distant thunderstorm anvil building over open ground at dusk, on the T–60 advisory step of the lightning workflow',
      },
    },
    {
      time: 'T–30',
      title: 'Watch: staff staged',
      body: 'Shelter routes confirmed, buses and gates staffed, the PA script queued. SMS goes to coaches who never open the app.',
      tag: 'Staff staged',
      dot: 'bg-alert-watch',
      image: {
        src: '/images/products/flash-floodlit-field-dusk-t30-staff-staged.png',
        alt: 'An empty floodlit athletic field at dusk under heavy cloud, on the T–30 watch step where staff are staged',
      },
    },
    {
      time: 'T–15',
      title: 'Warning: clear the field',
      body: 'Horn and strobe fire, the push alert hits every phone, and the decision is logged with the time it was made.',
      tag: 'Clear the field',
      dot: 'bg-alert-warning',
      image: {
        src: '/images/products/flash-shelf-cloud-neighborhood-t15-clear-the-field.png',
        alt: 'A shelf cloud arriving over rooftops beside a field, on the T–15 warning step where the field is cleared',
      },
    },
    {
      time: 'T–0',
      title: 'Predicted strike window',
      body: 'Everyone is already under cover. Each NLDN strike inside the cell is matched to the forecast and feeds the accuracy record.',
      tag: 'Strike window',
      dot: 'bg-brand-navy',
      image: {
        src: '/images/products/flash-lightning-bolt-open-ground-t0-strike-window.png',
        alt: 'A cloud-to-ground lightning bolt striking open ground at night, on the T–0 predicted strike window step',
      },
    },
    {
      time: 'After',
      title: 'All clear',
      body: 'The all-clear clock restarts on every new strike and releases the field on evidence, not on a look at the sky.',
      tag: 'All clear',
      dot: 'bg-alert-clear',
      image: {
        src: '/images/products/flash-clearing-sky-empty-field-all-clear.png',
        alt: 'A clearing sky at dusk over an empty grass field with puddles reflecting the light, on the all-clear step',
      },
    },
  ] satisfies TimelineStep[],
};

/* ------------------------------------------------------------- Ask Flash */

/** The tool the action lands in, drawn as a small unbranded preview under the answer. */
export type AgentToolPreview =
  | {
      kind: 'schedule';
      /** The tool's name, set as a small label; no logo. */
      tool: string;
      title: string;
      days: string[];
      /** The day row the moved block sits in. */
      day: string;
      /** The block's label before and after it moves, and the confirmation under it. */
      from: string;
      to: string;
      confirm: string;
    }
  | {
      kind: 'audit';
      tool: string;
      title: string;
      columns: [string, string, string, string];
      rows: [string, string, string, string][];
      confirm: string;
    };

export type AgentExample = {
  role: string;
  question: string;
  answer: string;
  action: string;
  chips: string[];
  preview: AgentToolPreview;
};

export const askFlash = {
  label: 'Ask Flash · Flash Agent · Illustrative example · Not live weather',
  heading: 'Ask about the next 60 minutes in plain language.',
  body: 'Flash Agent reads the same 1 km cells and the same 2-minute run as this page, then answers or acts in the tools you already run. A person confirms before anything changes; every action is logged.',
  link: { label: 'How Flash Agent works', href: productPaths.agent },
  examples: [
    {
      role: 'Superintendent · 12 sites',
      question: '“Which of my 12 sites has a crane lift inside a lightning window this week?”',
      answer: 'Midtown Parking Deck, Wed 2:10–3:40 pm. Lift rescheduled in Procore; foreman texted.',
      action: 'Action · Procore: lift rescheduled',
      chips: ['SMS · foreman', 'Source · cell 3391 · Wed 14:36 run'],
      preview: {
        kind: 'schedule',
        tool: 'Procore',
        title: 'Midtown Parking Deck',
        days: ['Tue', 'Wed', 'Thu'],
        day: 'Wed',
        from: 'Crane lift · Wed 10:00',
        to: 'Crane lift · Wed 2:10–3:40 pm',
        confirm: 'Foreman texted',
      },
    },
    {
      role: 'Safety manager · Owner’s rep',
      question: '“Log last night’s all-clear decisions for the owner’s rep.”',
      answer:
        'Six events exported to the audit file in SharePoint, each with the cell, the model run and the person who cleared the field.',
      action: 'Action · SharePoint: audit file updated',
      chips: ['Source · alert log · 6 events'],
      preview: {
        kind: 'audit',
        tool: 'SharePoint',
        title: 'All-clear audit · last night',
        columns: ['Time', 'Cell', 'Decision', 'Confirmed by'],
        rows: [
          ['19:12', '3391', 'All clear', 'M. Reyes'],
          ['19:48', '3392', 'All clear', 'M. Reyes'],
          ['20:25', '3391', 'All clear', 'D. Chen'],
          ['21:03', '3418', 'All clear', 'D. Chen'],
          ['21:40', '3419', 'All clear', 'A. Patel'],
          ['22:18', '3391', 'All clear', 'A. Patel'],
        ],
        confirm: 'Audit file updated',
      },
    },
  ] satisfies AgentExample[],
};

/* -------------------------------------------------------------- Accuracy */

export const accuracy = {
  label: 'Accuracy · Measured, not claimed',
  heading: 'How accurate is 99.6%, really?',
  figure: '99.6%',
  body: 'On a 60-minute prediction window, measured against NLDN ground-truth cloud-to-ground strikes.',
  image: {
    src: '/images/products/flash-lightning-open-country-accuracy-ground-truth.png',
    alt: 'Cloud-to-ground lightning over open country, illustrating the strikes each forecast cell is scored against in the accuracy section',
    tag: 'Ground truth',
    overlay: 'Every cell scored against the strikes that actually landed',
    caption: 'Cloud-to-ground lightning over open country · scoring window: 60 minutes, 1 × 1 km',
  },
  /**
   * The scoring visual (accuracy-scoring.tsx): an illustrative run of a
   * forecast area and the strikes that landed, on the hero map's basemap and
   * bands. The tally counts to these totals, which are the 99.6% (996 of 1,000).
   */
  scoring: {
    illustrative: 'Illustrative',
    scored: { label: 'Strikes scored', total: 1000 },
    inside: { label: 'Inside forecast', total: 996 },
  },
  /**
   * How the figure is produced, one step per stage of the scoring visual
   * (predicted cells, strikes land, checks and tally). Facts only from the
   * approved sheet: 1 km cells, 60 minutes, NLDN, 99.6% on the one-hour window.
   */
  method: {
    label: "How it's measured",
    steps: [
      { number: '01', title: 'Predict', body: 'Every 1 km cell gets a lightning forecast for the next 60 minutes.' },
      { number: '02', title: 'Observe', body: 'NLDN records where cloud-to-ground strikes actually land.' },
      {
        number: '03',
        title: 'Score',
        body: "Each strike is checked against its cell's forecast. The 99.6% is always quoted with its one-hour window.",
      },
    ],
  },
  cta: { label: 'Read the accuracy method', href: accuracyMethodPath },
};

/* ------------------------------------------------------------ Industries */

/**
 * The expanding panels (components/home/industry-panel-list.tsx). Names,
 * bodies, images and links are the section's own copy. Roles come from the
 * bodies; the schools question and verdict are the user's; the construction
 * question is from its industry page and its verdict from this page's Ask
 * Flash answer and the site log. Drafted and awaiting approval: the golf
 * question and verdict, and the construction verdict.
 */
export const industries = {
  label: 'Who uses it',
  heading: 'Who makes the lightning call with Flash?',
  allLink: { label: 'All industries', href: '/industries-we-serve/' },
  cards: [
    {
      id: 'schools',
      name: 'Schools & athletics',
      role: 'Athletic director',
      question: 'Do we clear the field before the game?',
      agent: { status: { tone: 'warning', label: 'No-go until 19:24 · horn sounded' } },
      body: 'Athletic directors and trainers: WBGT planning plus lightning for every practice and game, with the all-clear timer the policy requires.',
      href: '/industries-we-serve/schools/',
      linkLabel: 'Lightning for schools',
      image: {
        src: '/images/products/flash-floodlit-field-industry-schools-athletics.png',
        alt: 'A floodlit athletic field at dusk, on the schools and athletics industry card',
      },
    },
    {
      id: 'construction',
      name: 'Construction',
      role: 'Safety manager',
      question: 'What time will the best lightning chance be today to shut down operations?',
      agent: { status: { tone: 'warning', label: 'No-go 14:10–15:40 · site cleared' } },
      body: 'Safety managers: alerts that reach the crane operator and the crew on the deck before the first strike, logged for the record.',
      href: '/industries-we-serve/construction/',
      linkLabel: 'Lightning for construction',
      image: {
        src: '/images/products/flash-tower-crane-storm-industry-construction.png',
        alt: 'A high-rise under construction with a tower crane against a storm sky, on the construction industry card',
      },
    },
    {
      id: 'golf',
      name: 'Golf',
      role: 'Golf superintendent',
      question: 'When do I sound the horn on the course?',
      agent: { status: { tone: 'watch', label: 'Horn at 15:02 · resume 16:10' } },
      body: 'Superintendents: course-by-course lightning decisions across every property in the portfolio, from the phone to the horn on the range.',
      href: '/industries-we-serve/golf/',
      linkLabel: 'Lightning for golf',
      image: {
        src: '/images/products/flash-golf-fairway-rain-industry-golf.webp',
        alt: 'A golf fairway and tree line under rain-heavy cloud, on the golf industry card',
      },
    },
  ] satisfies IndustryPanel[],
};

/* ------------------------------------------------------------------- FAQ */

export const faq = {
  heading: 'What do athletic directors ask before they switch?',
  intro: 'The objections that come up on every lightning demo, answered with the same numbers as the spec table.',
  links: [{ label: 'All questions', href: faqIndexPath }],
  faqs: [
    {
      question: 'Is this a "prediction device" the athletic-safety guidance warns about?',
      answer:
        'No. That guidance warns against trusting a single-point electrostatic meter that claims to predict strikes. Flash is a forecast model scored against NLDN strikes for every 1 km cell, with a published method and a 99.6% accuracy record on the one-hour window.',
      link: { label: 'Prediction vs sensors vs detection', href: predictionVsDetectionPath },
    },
    {
      question: 'How is 99.6% measured?',
      answer:
        'Against NLDN cloud-to-ground strikes on a 60-minute window. What counts as a hit, a miss and a false alarm is spelled out on the accuracy method page.',
    },
    {
      question: 'What happens when the connection drops on site?',
      answer:
        'The Flash Edge Model runs on site and keeps the horn and strobe relays on the forecast, while SMS and email alerts continue from the cloud. The Command Center logs both paths.',
    },
    {
      question: 'Does it cover Canada and Mexico?',
      answer:
        'Yes. Coverage is the continental U.S., Canada and Mexico, at the same 1 × 1 km resolution and 2-minute refresh, with no hardware at any site.',
    },
  ] satisfies Faq[],
};
