/**
 * The buyer FAQ at /resources/frequently-asked-questions/, as data.
 *
 * Eighteen answers in nine groups, each group named for the objection behind
 * it. The page renders the groups and the FAQPage schema from the same array,
 * so the schema can only describe questions that are on the page.
 *
 * "Every answer cites its page": each answer carries `source`, the route that
 * is the canonical proof for it. `answer` stays plain text because it is what
 * the FAQPage schema publishes; the link is rendered beside it, not inside it.
 */

import { productPaths } from '@/content/products';

export type FaqSource = { label: string; href: string };

export type FaqItem = {
  question: string;
  /** Plain text. Rendered on the page and published in the FAQPage schema. */
  answer: string;
  /** The page that proves the answer. Only routes that exist. */
  source: FaqSource;
};

export type FaqGroup = {
  /** In-page anchor for the jump list. Permanent once linked. */
  id: string;
  number: string;
  /** The chip label in the "Jump to" list. */
  jumpLabel: string;
  /** The H2: the objection, in the buyer's words. */
  heading: string;
  shortAnswer: string;
  header: {
    eyebrow: string;
    caption: string;
    image: string;
    alt: string;
    /** Crop tweaks where the design zooms the photo. */
    imageClassName?: string;
  };
  items: FaqItem[];
  /** The audit group closes on the illustrative alert-log table. */
  showAlertLog?: boolean;
};

export const FAQ_PATH = '/resources/frequently-asked-questions/';

const img = (name: string) => `/images/faq/${name}`;

export const faqGroups: FaqGroup[] = [
  {
    id: 'prediction',
    number: '01',
    jumpLabel: 'Prediction vs marketing',
    heading: "Is 'prediction' real, or marketing?",
    shortAnswer: 'Short answer: real, 99.6% accurate on the one-hour window, and published with its method.',
    header: {
      eyebrow: 'Prediction',
      caption: 'Up to 60 minutes before the first strike',
      image: img('flash-weather-faq-lightning-prediction-header.png'),
      alt: 'A cloud-to-ground lightning strike over open country, heading the answer group on what Flash predicts and how far ahead',
    },
    items: [
      {
        question: 'What does Flash actually predict, and how far ahead?',
        answer:
          'FlashPredict forecasts where lightning will strike up to 60 minutes before the first bolt, at 1km × 1km resolution, refreshed every 2 minutes, with a 6-hour planning outlook. A detection network can only tell you a strike has already happened; Flash tells you a cell is about to strike your site.',
        source: { label: 'Prediction vs sensors vs detection', href: '/why-flash/prediction-vs-sensors-vs-detection/' },
      },
      {
        question: 'How accurate is it, and who measured it?',
        answer:
          '99.6% lightning prediction accuracy on the one-hour window. The accuracy method page shows how the number is computed and when it was last refreshed.',
        source: { label: 'Accuracy method', href: '/why-flash/accuracy-method/' },
      },
    ],
  },
  {
    id: 'sensors',
    number: '02',
    jumpLabel: 'Sensors vs software',
    heading: 'Sensors vs software: do I still need hardware?',
    shortAnswer: 'Short answer: no hardware for lightning. Keep the on-site WBGT sensor your heat policy names.',
    header: {
      eyebrow: 'No hardware',
      caption: 'Every site on the same 1km × 1km grid',
      image: img('flash-weather-faq-construction-site-no-sensors-header.png'),
      alt: 'A tower crane on a construction site against a bruised storm sky, heading the answer group on why Flash needs no on-site sensors',
    },
    items: [
      {
        question: 'Do I have to install anything on site?',
        answer:
          'No. Flash is software only: web app, mobile app, API, SMS and email, plus horn and strobe integrations for the field. Coverage comes from over 100 atmospheric parameters across the continental U.S., Canada and Mexico, not from a sensor you have to mount, power and calibrate.',
        source: { label: 'Prediction vs sensors vs detection', href: '/why-flash/prediction-vs-sensors-vs-detection/' },
      },
      {
        question: 'We already own a lightning detector. Is it wasted?',
        answer:
          'Keep it if your policy names it. A detector confirms strikes that have already happened inside its range; Flash gives the warning up to 60 minutes before the first one. Most sites run Flash as the decision layer and keep the detector as a log of record.',
        source: { label: 'Everyone else vs Flash', href: '/why-flash/everyone-else-vs-flash/' },
      },
    ],
  },
  {
    id: 'wbgt',
    number: '03',
    jumpLabel: 'WBGT',
    heading: 'WBGT: forecast or on-site measurement?',
    shortAnswer: 'Short answer: the forecast plans the day; the sensor on the field makes the call.',
    header: {
      eyebrow: 'Heat and WBGT',
      caption: 'Six hours of WBGT outlook',
      image: img('flash-weather-faq-heat-wbgt-outlook-header.png'),
      alt: 'Heat shimmering over open ground in late-afternoon sun, heading the answer group on the WBGT outlook',
    },
    items: [
      {
        question: 'Does Flash replace my on-site WBGT sensor?',
        answer:
          "No, and we say so plainly. State heat policies, Georgia's included, move activity tiers on a wet-bulb globe temperature reading taken on the field. Flash forecasts WBGT so an athletic trainer can plan the practice window hours ahead; the on-site reading decides when the tier changes.",
        source: { label: 'Georgia heat policy', href: '/resources/state-heat-policies/georgia/' },
      },
      {
        question: 'Then what is the WBGT forecast for?',
        answer:
          'Scheduling. Trainers use the 6-hour outlook to move an afternoon practice to the morning before the buses leave, and superintendents use it to plan crew rotations. When the on-site reading crosses a threshold, Flash logs the tier change next to the forecast it was measured against.',
        source: { label: 'Schools & Athletics', href: '/industries-we-serve/schools/' },
      },
    ],
  },
  {
    id: 'meteorologist',
    number: '04',
    jumpLabel: 'Human meteorologist',
    heading: 'Will I get a human meteorologist?',
    shortAnswer:
      'Short answer: yes. Flash Consulting Meteorology is led by former National Weather Service forecasters.',
    header: {
      eyebrow: 'Consulting meteorology',
      caption: 'Real meteorologists for your biggest days',
      image: img('flash-weather-faq-consulting-meteorology-header.png'),
      alt: "Wind-driven cloud racing over open country, heading the answer group on Flash's consulting meteorologists",
    },
    items: [
      {
        question: 'Is there a person behind the alerts?',
        answer:
          'Yes. Flash Consulting Meteorology is led by founder Jason Deese, a former NOAA National Weather Service forecaster. Enterprise plans include storm-day desk support; any plan can add a written pre-event briefing.',
        source: { label: 'Products · Flash Consulting Meteorology', href: productPaths.consulting },
      },
      {
        question: 'Can I talk to someone before a championship weekend?',
        answer:
          'That is what the desk is for. Send the venue, the schedule and your policy thresholds; the desk issues a written outlook the day before and monitors through the event. NAIA championships, where Flash is the official weather-safety partner, run this way.',
        source: { label: 'Schools & Athletics', href: '/industries-we-serve/schools/' },
      },
    ],
  },
  {
    id: 'alert-policy',
    number: '05',
    jumpLabel: 'Alert policy',
    heading: 'Can alerts follow my policy, not a generic radius?',
    shortAnswer:
      'Short answer: per-site thresholds, per-role delivery, horn and strobe, and a return-to-play timer that resets itself.',
    header: {
      eyebrow: 'Alert policy',
      caption: 'Your radius, your lead time, your people',
      image: img('flash-weather-faq-alert-policy-athletic-field-header.png'),
      alt: 'A floodlit athletic field at dusk under a clearing sky, heading the answer group on setting your own alert policy',
    },
    items: [
      {
        question: 'Our policy sets its own radius and all-clear wait. Can Flash use that?',
        answer:
          'Yes. Each site carries its own thresholds: alert radius, lead time, WBGT tier and who is told. A superintendent, an athletic trainer and a safety manager can receive different alerts for the same cell. The return-to-play timer starts from the last strike and resets automatically if another one lands.',
        source: { label: 'Weather Command Center', href: productPaths.commandCenter },
      },
      {
        question: 'Can Flash sound the horn and strobe on the field?',
        answer:
          'Yes. Horn and strobe controllers, SMS, email, mobile push and the API all fire from the same alert. You decide which channels each role gets and whether the all-clear is automatic or has to be acknowledged by a named person.',
        source: { label: 'Weather Command Center', href: productPaths.commandCenter },
      },
    ],
  },
  {
    id: 'audit-file',
    number: '06',
    jumpLabel: 'Audit file',
    heading: 'What do I have for the audit and liability file?',
    shortAnswer:
      'Short answer: a timestamped record of every alert, acknowledgement and decision, exportable on demand.',
    header: {
      eyebrow: 'Audit file',
      caption: 'Every alert, timestamped and exportable',
      image: img('flash-weather-faq-audit-file-command-center-header.png'),
      alt: 'The screen glow of a Weather Command Center in a darkened operations room, heading the answer group on the audit file',
      imageClassName: 'origin-[6%_45%] scale-[1.9]',
    },
    items: [
      {
        question: 'If something happens, what can I show an insurer or a lawyer?',
        answer:
          'A timestamped alert log: the prediction issued, when, to whom, who acknowledged it, what the on-site reading said and when the all-clear went out. It exports to PDF and CSV and is retained for the life of the contract.',
        source: { label: 'Weather Command Center', href: productPaths.commandCenter },
      },
      {
        question: 'Does the log record decisions, not just alerts?',
        answer:
          'Yes. When a coach clears the field or a foreman calls a crew down, the acknowledgement is stamped against the alert that triggered it. The Troon case study shows what a season of that record looks like across its managed properties.',
        source: { label: 'Case study · Troon', href: '/case-studies/troon/' },
      },
    ],
    showAlertLog: true,
  },
  {
    id: 'pricing',
    number: '07',
    jumpLabel: 'Pricing & pilots',
    heading: 'Pricing, contracts and pilots',
    shortAnswer: 'Short answer: per site, per year, no hardware line, and a pilot on your real sites before you sign.',
    header: {
      eyebrow: 'Pricing',
      caption: 'Screen, pocket and API',
      image: img('flash-weather-faq-pricing-screen-pocket-api-header.png'),
      alt: 'Flash running on a laptop beside the mobile app on a phone, heading the answer group on pricing and what a subscription covers',
    },
    items: [
      {
        question: 'How is Flash priced?',
        answer:
          'Per site, per year, with no hardware cost and no installation fee. Portfolio pricing covers multi-site operators; Enterprise adds API volume and the meteorology desk. The pricing page lists what every tier includes and what counts as a site.',
        source: { label: 'Pricing', href: '/pricing/' },
      },
      {
        question: 'Can we pilot before we sign?',
        answer:
          "Yes. A pilot loads your sites, replays last season's strikes against Flash's predictions and shows the alert log your team would have received. It runs on live weather at your real locations, not a demo account.",
        source: { label: 'Pricing', href: '/pricing/' },
      },
    ],
  },
  {
    id: 'hail-and-api',
    number: '08',
    jumpLabel: 'Hail & API',
    heading: 'Hail and the API',
    shortAnswer:
      'Short answer: hail size, timing and swath up to 55 minutes ahead, and every prediction available by API and webhook.',
    header: {
      eyebrow: 'Hail and API',
      caption: 'Up to 55 minutes before the first stone falls',
      image: img('flash-weather-faq-hail-swath-parked-fleet-header.png'),
      alt: 'Parked vehicles under a bruised hail sky, heading the answer group on hail prediction and the Flash API',
    },
    items: [
      {
        question: 'How far ahead does Flash see hail?',
        answer:
          'FlashHail predicts hail up to 55 minutes before the first stone falls, at 1km × 1km resolution with updates every five minutes: hail size by class, timing down to the minute and a 1-hour swath prediction, built on four years of convective storm data across the CONUS.',
        source: { label: 'Hail Prediction', href: '/products/hail-prediction/' },
      },
      {
        question: 'Can our own systems consume the predictions directly?',
        answer:
          'Yes. The Flash API returns lightning and hail predictions for any 1km × 1km cell, with over 100 parameters and forecasts out to 180 hours, and webhooks push alerts into dispatch, fleet-staging and claims tools. Carriers and fleet managers use it to move vehicles before a hail cell arrives.',
        source: { label: 'Flash API', href: '/products/api-offerings/' },
      },
    ],
  },
  {
    id: 'flash-agent',
    number: '09',
    jumpLabel: 'Ask Flash',
    heading: 'Can I just ask it?',
    shortAnswer:
      'Short answer: yes. Flash Agent answers in plain language and acts in the tools you already run, with a human confirming any change.',
    header: {
      eyebrow: 'Agentic',
      caption: 'Ask in plain language; get an answer or an action',
      image: img('flash-weather-faq-flash-agent-network-header.png'),
      alt: 'An abstract navy network of glowing connected nodes, heading the answer group on Flash Agent and the tools it acts in',
    },
    items: [
      {
        question: 'What can Flash Agent actually do?',
        answer:
          "Ask in plain language — \"Which of my sites has a crane lift inside a lightning window this week?\" — and Flash Agent reads the forecast for your cells, answers with the cell and model run it used, and acts where you allowed it: moving a practice in Google Calendar, rescheduling a lift in Procore, pushing a canvass list to HubSpot, or exporting last night's all-clear decisions to SharePoint. It connects to Google Calendar, Microsoft 365, Salesforce, HubSpot, NetSuite and SAP, Procore, Slack and Teams, and webhooks. No command center to open.",
        source: { label: 'Flash Agent', href: '/products/flash-agent/' },
      },
      {
        question: "What stops it doing something we didn't ask for?",
        answer:
          'Four guardrails. Permissions are set per connector, so the agent can read a calendar without being able to write to it. Every action is logged with the question, the cell and the model run behind it. Any change to a schedule or a record waits for a human to confirm. And no data leaves your tenant without consent.',
        source: { label: 'Flash Agent', href: '/products/flash-agent/' },
      },
    ],
  },
];

/** Every question, flat, for the FAQPage schema. */
export const allFaqs = faqGroups.flatMap((group) => group.items);

/**
 * The illustrative alert log in the audit-file group. Not live weather, and
 * labelled so on the page.
 */
export const alertLogExample = {
  label: 'Alert log · South Fields · Illustrative example · Not live weather',
  exportNote: 'Export PDF · CSV',
  caption:
    'Flash Weather Command Center alert log showing a timestamped lightning prediction, the confirmed strike, the return-to-play timer and the acknowledged all-clear',
  rows: [
    {
      time: '15:42:10',
      tone: 'advisory',
      event: 'Prediction: first strike in 38 min, cell 1.8 mi NW',
      channel: 'SMS · horn · app',
      acknowledged: 'Athletic trainer · 15:42:55',
    },
    {
      time: '15:58:31',
      tone: 'warning',
      event: 'Strike confirmed 0.9 mi · return-to-play timer started',
      channel: 'app · dashboard',
      acknowledged: 'Automatic',
    },
    {
      time: '16:33:04',
      tone: 'clear',
      event: 'All-clear issued · last strike 16:03:04',
      channel: 'horn · SMS',
      acknowledged: 'Athletic trainer · 16:33:40',
    },
  ],
} as const;
