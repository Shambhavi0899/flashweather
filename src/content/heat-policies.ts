/**
 * State heat policies, as data.
 *
 * One template at `app/resources/state-heat-policies/[state]/` renders every
 * entry. Each state page follows the same shape -- verified thresholds, the
 * reading cadence, what to keep on file, where the 6-hour outlook fits -- so
 * adding a state is an entry here; the route and sitemap entry follow.
 *
 * This is legal and policy content: copy is verbatim from the approved
 * design and from the association's own documents. Do not paraphrase a
 * threshold, and restate `verified` whenever the source is re-checked.
 */

import type { Image } from './blog';

export type ThresholdBand = {
  /** WBGT range as printed, e.g. "82.0 – 86.9". */
  range: string;
  activity: string;
  rest: string;
  equipment: string;
  /** The Flash alert-scale colour the row carries. */
  tone: 'clear' | 'advisory' | 'watch' | 'warning' | 'extreme';
  /** Cells printed muted because they carry no restriction. */
  mutedRest?: boolean;
  mutedEquipment?: boolean;
};

export type HeatPolicy = {
  slug: string;
  state: string;
  /** Association short name, e.g. GHSA. */
  association: string;
  associationName: string;
  associationUrl: string;
  /** The rule's formal name, used in citations. */
  ruleName: string;
  title: string;
  description: string;
  headline: string;
  /** Shorter headline for the OG card. */
  shortHeadline: string;
  eyebrow: string;
  intro: string;
  byline: string;
  /** ISO date the thresholds were last verified against the source. */
  verified: string;
  hero: Image;
  requires: {
    heading: string;
    paragraphs: string[];
    cards: { title: string; body: string }[];
  };
  table: {
    heading: string;
    intro: string;
    caption: string;
    columns: [string, string, string, string];
    bands: ThresholdBand[];
    note: string;
  };
  flashFits: {
    heading: string;
    callout: string;
    points: { title: string; body: string; link?: { label: string; href: string } }[];
    link: { label: string; href: string; note: string };
  };
  planningDay: {
    heading: string;
    disclaimer: string;
    figure: { image: Image; badge: string; overlay: string };
    steps: { time: string; text: string; tone: 'info' | 'warning' | 'clear' }[];
  };
  documentation: { heading: string; intro: string; items: string[] };
  otherStates: {
    heading: string;
    intro: string;
    figure: { image: Image; badge: string; overlay: string };
    /** States without a built page render as plain labels, never dead links. */
    states: { label: string; href?: string }[];
  };
  sources: string[];
  faqs: { question: string; answer: string }[];
  rail: {
    eyebrow: string;
    heading: string;
    href: string;
    points: string[];
    agent: { prompt: string; reply: string; action: string };
    note: string;
    verifiedNote: string;
    contact: string;
  };
  /** Hero chart: an illustrative 6-hour WBGT outlook, never live weather. */
  outlook: {
    title: string;
    time: string;
    threshold: number;
    points: { label: string; value: number }[];
    /** Index of the highlighted hour. */
    peak: number;
    chips: [string, string];
    caption: string;
    alt: string;
    disclaimer: string;
  };
};

export const heatPolicies: HeatPolicy[] = [
  {
    slug: 'georgia',
    state: 'Georgia',
    association: 'GHSA',
    associationName: 'Georgia High School Association',
    associationUrl: 'https://www.ghsa.net/',
    ruleName: 'GHSA By-Law 2.67, Practice Policy for Heat and Humidity',
    title: 'Georgia high school heat policy (WBGT)',
    description:
      'GHSA 2.67 WBGT thresholds for Georgia high school practice: rest breaks, practice limits and football equipment by band, and how to plan around them.',
    headline:
      'Georgia high school heat policy: GHSA WBGT thresholds, practice limits, and how to plan around them',
    shortHeadline: 'Georgia high school heat policy: GHSA WBGT thresholds and practice limits',
    eyebrow: 'State heat policy · Georgia (GHSA) · Verified 21 Sep 2026',
    intro:
      'GHSA By-Law 2.67 sets five WBGT bands that decide how long practice runs, how often players rest and what football players may wear. Here are the verified thresholds, what an athletic director has to keep on file, and how a 6-hour WBGT outlook lets you move practice instead of cancelling it.',
    byline:
      'Flash Meteorology Desk · Checked against GHSA By-Law 2.67 (current PDF, ghsa.net) · Updated 21 Sep 2026 · 7 min read',
    verified: '2026-09-21',
    hero: {
      src: '/images/heat-policies/flash-georgia-floodlit-athletic-field-heat-policy.png',
      alt: 'An empty floodlit high school football field at dusk with heat haze over the turf, the setting GHSA WBGT practice limits govern',
      width: 1376,
      height: 768,
    },
    requires: {
      heading: 'What does GHSA require?',
      paragraphs: [
        'By-Law 2.67 applies to every sport, year-round, including summer conditioning. The head coach signs the policy at the start of each season and it goes to every player and parent. It follows modified American College of Sports Medicine guidance on three things: when practice can be scheduled, how much rest and hydration time each hour needs, and the level at which practice stops.',
        "A scientifically approved WBGT instrument must be used at each practice. The by-law text sets readings every hour, beginning 30 minutes before practice starts; GHSA's practice reminder tightens that to at least every 30 minutes. Once a reading has stayed in a band for 15 consecutive minutes, that band's restrictions hold for the rest of the session — you can move up to a stricter band, never back down.",
      ],
      cards: [
        {
          title: 'Reading cadence',
          body: "Every hour by the by-law; at least every 30 minutes per GHSA's reminder. First reading 30 minutes before practice.",
        },
        {
          title: 'Band lock-in',
          body: '15 consecutive minutes in a band commits that band for the rest of practice. Stricter bands apply at once; no reverting lower.',
        },
        {
          title: 'The device',
          body: 'A scientifically approved WBGT monitor, calibrated at least every two years. Phone apps are not accepted.',
        },
        {
          title: 'Rest breaks and cooling',
          body: 'In a cool zone out of direct sun, unlimited hydration, never combined with activity. Over 86: ice towels and a cold-immersion tub on hand.',
        },
      ],
    },
    table: {
      heading: 'The GHSA WBGT threshold table',
      intro:
        'Five bands, read in degrees Fahrenheit from the on-site WBGT device. The row colour follows the Flash alert scale your athletic trainers already see in the app.',
      caption:
        'GHSA WBGT threshold table for Georgia high school practice: five bands from under 82.0 to over 92.0 °F with rest-break, practice-length and football-equipment rules',
      columns: ['WBGT (°F)', 'Activity limit', 'Rest breaks', 'Football equipment'],
      bands: [
        {
          range: 'Under 82.0',
          activity: 'Normal activities',
          rest: 'At least 3 separate breaks per hour, minimum 3 min each',
          equipment: 'No restriction',
          tone: 'clear',
          mutedEquipment: true,
        },
        {
          range: '82.0 – 86.9',
          activity: 'Use discretion for intense or prolonged exercise; watch at-risk players closely',
          rest: 'At least 3 separate breaks per hour, minimum 4 min each',
          equipment: 'No restriction',
          tone: 'advisory',
          mutedEquipment: true,
        },
        {
          range: '87.0 – 89.9',
          activity: 'Maximum practice time 2 hours',
          rest: 'At least 4 separate breaks per hour, minimum 4 min each',
          equipment: 'Helmet, shoulder pads and shorts only; all protective equipment off for conditioning',
          tone: 'watch',
        },
        {
          range: '90.0 – 92.0',
          activity: 'Maximum practice time 1 hour; no conditioning activities',
          rest: '20 minutes of breaks distributed through the hour',
          equipment: 'No protective equipment',
          tone: 'warning',
        },
        {
          range: 'Over 92.0',
          activity: 'No outdoor workouts — delay until a cooler WBGT is reached',
          rest: '—',
          equipment: '—',
          tone: 'extreme',
          mutedRest: true,
          mutedEquipment: true,
        },
      ],
      note: 'Source: GHSA By-Law 2.67, Practice Policy for Heat and Humidity — current PDF on ghsa.net, verified 21 Sep 2026. If WBGT rises into 87.0–89.9 during a session, players may finish in football pants without changing to shorts.',
    },
    flashFits: {
      heading: 'Where does Flash fit?',
      callout:
        "GHSA compliance is decided by your on-site WBGT reading. Flash's 6-hour WBGT outlook tells you at 1 pm what the 4 pm reading is likely to be, so you can move practice instead of cancelling it.",
      points: [
        {
          title: "Heat: plan, don't cancel",
          body: 'The outlook runs per field for every hour of the afternoon, against the five bands above. Shift the start, swap the equipment plan or go indoors before the cars arrive.',
        },
        {
          title: 'Lightning: up to 60 minutes ahead',
          body: 'Strike-level prediction on a 1 × 1 km cell, refreshed every 2 minutes. 99.6% lightning prediction accuracy on a one-hour window, measured against NLDN ground-truth strikes — method published.',
          link: { label: 'Accuracy method', href: '/why-flash/accuracy-method/' },
        },
        {
          title: 'Return to play: the all-clear timer',
          body: "After the last strike inside your radius, Flash runs your policy's all-clear timer and logs it. The practice clock stops for the weather stoppage, as 2.67(c) allows.",
          link: { label: 'Weather Command Center', href: '/products/weather-command-center/' },
        },
      ],
      link: {
        label: 'Flash Heat and WBGT prediction',
        href: '/products/heat-wbgt/',
        note: '6-hour WBGT outlook, heat index, air temperature and dew point per 1 km cell',
      },
    },
    planningDay: {
      heading: 'What does a planning day look like?',
      disclaimer: "Illustrative example · Not live weather — the readings are examples, the rules are GHSA's",
      figure: {
        image: {
          src: '/images/heat-policies/flash-georgia-practice-field-heat-planning-day.png',
          alt: 'An empty Georgia high school practice field under a hazy hot sun with a shade canopy and water coolers on the sideline, the setting for a GHSA WBGT planning day',
          width: 1376,
          height: 768,
        },
        badge: '3:15 pm · The reading that decides the day',
        overlay: 'The band you land in at 3 pm sets the pads, the breaks and the water.',
      },
      steps: [
        {
          time: '1:00 pm',
          text: 'Flash 6-hour WBGT outlook for the practice field: 84 by 3 pm, into 87.0–89.9 by 4 pm. The athletic director flags the football session.',
          tone: 'info',
        },
        {
          time: '1:15 pm',
          text: 'Decision: run at 4 pm under the 2-hour cap with four breaks an hour, or push to 6:30 pm. The AD pushes. The bus, the trainers and the parents hear now, not at 3:45.',
          tone: 'info',
        },
        {
          time: '6:00 pm',
          text: 'First on-site WBGT reading, 30 minutes before practice: 83.4, the 82.0–86.9 band. Three 4-minute breaks per hour go on the plan and the reading goes on the GHSA record chart.',
          tone: 'info',
        },
        {
          time: '7:10 pm',
          text: 'Flash lightning alert: a strike is predicted inside the site radius within the next 60 minutes. The field clears and the practice clock stops.',
          tone: 'warning',
        },
        {
          time: '7:52 pm',
          text: 'Last strike inside the radius. Flash starts the all-clear timer.',
          tone: 'info',
        },
        {
          time: '8:22 pm',
          text: 'All clear. Practice resumes for its remaining time; the alert log records who was warned, when, and when play returned.',
          tone: 'clear',
        },
      ],
    },
    documentation: {
      heading: 'What does the athletic director keep on file?',
      intro:
        'The by-law is enforced from the record. Keep these together for every practice, so a question from the GHSA, the district or a parent is answered from one folder.',
      items: [
        'WBGT readings with times — the first 30 minutes before practice, then every 30 minutes — on the GHSA Heat Index Measurement & Record Chart.',
        'The band each reading fell in and the decision it triggered: practice length, rest-break schedule, equipment plan.',
        'The WBGT monitor used and its calibration date (at least every two years).',
        'The signed policy for the season — head coach, each athlete and a parent or guardian.',
        'The Flash alert log export: lightning alerts, who was notified, the all-clear, and the 6-hour outlook the schedule decision was based on.',
      ],
    },
    otherStates: {
      heading: 'Which other states publish WBGT policies?',
      intro:
        'Every state page follows this template: verified thresholds, the reading cadence, what to keep on file, and where the 6-hour outlook fits.',
      figure: {
        image: {
          src: '/images/heat-policies/flash-wbgt-heat-outlook-state-policies.png',
          alt: "Heat haze over an open field at midday, the conditions each state association's WBGT policy sets practice limits for",
          width: 1376,
          height: 768,
        },
        badge: 'State by state',
        overlay: 'Same instrument, different bands — the six-hour WBGT outlook travels with you.',
      },
      states: [
        { label: 'Florida (FHSAA)' },
        { label: 'Texas (UIL)' },
        { label: 'Arkansas (AAA)' },
        { label: 'New Jersey (NJSIAA)' },
        { label: 'North Carolina (NCHSAA)' },
      ],
    },
    sources: [
      'GHSA — By-Law 2.67, Practice Policy for Heat and Humidity, current PDF on ghsa.net. Thresholds, reading cadence, definitions. Verified 21 Sep 2026.',
      'GHSA — Heat policy FAQ and practice reminder, ghsa.net. 30-minute reading cadence, 15-minute band lock-in, monitor calibration, record chart.',
      'National Weather Service — WBGT and heat-safety guidance, weather.gov.',
      "National Athletic Trainers' Association — Position Statement: Exertional Heat Illnesses, Journal of Athletic Training, 2015.",
    ],
    faqs: [
      {
        question: 'Does Flash replace the on-site WBGT device?',
        answer:
          "No. GHSA compliance is decided by the reading from a scientifically approved monitor at the practice site. Flash's 6-hour outlook tells you where that reading is heading — a scheduling tool, not a compliance instrument.",
      },
      {
        question: 'How often do we take readings?',
        answer:
          "By-Law 2.67 says every hour, starting 30 minutes before practice. GHSA's practice reminder says at least every 30 minutes. Plan for every 30 minutes and record each one.",
      },
      {
        question: 'What happens if the WBGT rises during practice?',
        answer:
          "Once a reading has stayed in a higher band for 15 consecutive minutes, that band's limits apply for the rest of practice. Football players already in pants may finish in pants when the reading enters 87.0–89.9. You never drop back to a lower band in the same session.",
      },
      {
        question: 'Does the policy apply to summer conditioning?',
        answer:
          'Yes. By-Law 2.67 is year-round and covers voluntary conditioning workouts as well as in-season practice, for every sport.',
      },
    ],
    rail: {
      eyebrow: 'For athletic directors',
      heading: 'Flash for Georgia schools',
      href: '/industries-we-serve/schools/',
      points: [
        '6-hour WBGT outlook for every field, so you move practice before the on-site reading crosses 87.0.',
        'Lightning predicted up to 60 minutes ahead, with your all-clear timer built in.',
        'An alert log the AD can hand to the GHSA, the district and the parents.',
      ],
      agent: {
        prompt: '"Move Thursday practice if WBGT tops 87."',
        reply: '88.1 forecast at 4 pm. Practice moved to 5:30 in Google Calendar; trainers notified.',
        action: 'Action · Google Calendar updated',
      },
      note: 'Software only. No sensor to buy — your WBGT device stays. Every agent action is logged and confirmed by a person first.',
      verifiedNote: 'Thresholds checked against GHSA By-Law 2.67 (current PDF on ghsa.net) on 21 Sep 2026.',
      contact: 'Spotted a change?',
    },
    outlook: {
      title: 'WBGT outlook · Field B · 6 hours',
      time: '12:58',
      threshold: 87,
      points: [
        { label: '1 pm', value: 84.2 },
        { label: '2 pm', value: 86.1 },
        { label: '3 pm', value: 87.6 },
        { label: '4 pm', value: 88.1 },
        { label: '5 pm', value: 86.4 },
        { label: '6 pm', value: 84.0 },
      ],
      peak: 3,
      chips: ['4 pm · 88.1 — above 87.0', 'Under 87 after 5:20'],
      caption: 'Move practice to 5:30 — the on-site reading stays the compliance record.',
      alt: 'Flash 6-hour WBGT outlook for a Georgia high school practice field, showing the 4 pm reading trending into the 87.0–89.9 band',
      disclaimer: 'Illustrative example · Not live weather',
    },
  },
];

export function getHeatPolicy(slug: string): HeatPolicy | undefined {
  return heatPolicies.find((policy) => policy.slug === slug);
}
