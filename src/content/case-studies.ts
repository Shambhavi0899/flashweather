/**
 * Case studies, as data.
 *
 * Copy is the design's, verbatim. Testimonials are quoted exactly and carry
 * only the attribution the client supplied; none of them is from Troon's own
 * staff, and none is presented as if it were. No outcome percentages are
 * published for Troon: the deployment facts and the per-event log are the
 * evidence.
 */

import { links } from '@/content/why-flash';

type Img = { src: string; alt: string };

export type Testimonial = { quote: string; name: string; role: string };

const IMG = '/images/case-studies';

export const troon = {
  eyebrow: 'Case study · Golf · Troon',
  headline: 'Troon runs Flash Lightning Prediction across its golf portfolio.',
  intro:
    'One Weather Command Center for the whole portfolio: every course in its own 1 km cell, a 60-minute strike-level forecast refreshed every 2 minutes, and a written log for every decision — from the horn relay to the tee sheet.',
  productsLine: 'Flash Lightning Prediction · Weather Command Center · Flash Mobile App · Flash Agent',
  hero: {
    src: `${IMG}/troon-golf-fairway-dusk-storm-cell-horizon.jpg`,
    alt: 'A manicured golf fairway at dusk with a dark storm cell building on the horizon and gold light on the flag, the hero photograph of the Troon case study',
  } satisfies Img,
  heroQuote: {
    quote:
      'With Flash Weather AI, we’ve moved from guessing to confidently managing the weather. It’s like having a pocket weather expert, assuring our members’ safety and satisfaction.',
    name: 'Ryan Coll',
    role: 'Director of Golf, Columbus Country Club',
  } satisfies Testimonial,

  atAGlance: [
    { label: 'Customer', value: 'Troon' },
    { label: 'Segment', value: 'Golf course management' },
    { label: 'Footprint', value: 'A portfolio of golf properties' },
    { label: 'Products', value: 'Flash Lightning Prediction · Flash Weather Command Center · Flash Mobile App' },
    { label: 'Alert channels', value: 'App · SMS · on-course horn relays' },
    { label: 'Live since', value: 'Multi-year customer' },
  ],

  narrative: [
    {
      heading: 'What was the problem across the portfolio?',
      paragraphs: [
        'Troon manages a portfolio of courses under one duty of care. On most of them the lightning horn was wired to a detection feed, so it fired after the first strike inside the radius. Until then the superintendent, the pro shop and the general manager each made their own call about when to pull crews and players, and when to let play resume.',
        'The result was inconsistency: early on some courses, late on others, and no shared record of why a course was cleared or reopened. A portfolio that size needs one trigger, one clock and one log.',
      ],
    },
    {
      heading: 'What did Troon roll out?',
      paragraphs: [
        'One Flash Weather Command Center for the whole portfolio. Every course sits in its own 1×1 km cell with a 60-minute strike-level forecast that refreshes every 2 minutes, plus a six-hour prediction outlook for the day’s tee sheet and maintenance windows.',
        'Roles are set per property. The general manager sees the portfolio view; the superintendent gets crew alerts by app and SMS; the pro shop gets the tee-sheet call. The all-clear timer runs from the last strike on the club’s own policy, and the relay to the on-course horns fires from the same rule, so a horn never sounds for a different reason than the app.',
      ],
    },
    {
      heading: 'What changed on the ground?',
      paragraphs: [
        'Decisions are made earlier and on the same trigger. Blanket closures gave way to per-course calls, because a cell forecast for one property does not clear or close another.',
        'Every event now leaves a written log: the alert level, the time, the channel, who acted. A club can show that log to a member, an insurer or a tournament committee. We do not publish downtime or loss percentages for Troon; the log is the evidence.',
      ],
    },
    {
      heading: 'How did it scale across the portfolio?',
      paragraphs: [
        'A portfolio view for the company, bulk onboarding from a property list, and the Flash API for properties that route alerts into their own systems. A new course is a pin on the map, not a hardware install: no station, no mast, no site visit.',
      ],
    },
  ],

  screens: [
    {
      badge: '01 · Weather Command Center',
      caption: 'Every course on one screen',
      role: 'The general manager',
      body: 'One portfolio view: every course in its own 1×1 km cell, the alert level, the time the call was made and who acted on it.',
      image: {
        src: `${IMG}/flash-weather-command-center-troon-portfolio-view.png`,
        alt: 'The Flash Weather Command Center on a laptop showing a storm on a 1x1 km grid, the portfolio view the general manager watches',
      },
      link: links.commandCenter,
    },
    {
      badge: '02 · Flash Mobile App',
      caption: '18 hours of future radar, in the pocket',
      role: 'The superintendent and the crew',
      body: 'The same cell by app and SMS, with a 60-minute strike-level lead, so mowers and members move before the horn relay fires.',
      image: {
        src: `${IMG}/flash-mobile-app-superintendent-lightning-alert.png`,
        alt: "Four Flash Mobile App screens showing lightning probability, future radar, live radar and a seven-day forecast, the same call in the superintendent's pocket",
      },
      link: links.mobileApp,
    },
  ],

  map: {
    alt: 'Flash Weather Command Center portfolio map showing Troon golf properties as 1 km cells, a 60-minute lightning warning cell over one course, and the written event log beside it',
    log: [
      { time: '14:02', entry: 'Advisory · cell flagged · app + SMS to superintendent' },
      { time: '14:21', entry: 'Warning · horns relayed · pro shop clears the course' },
      { time: '14:33', entry: 'First CG strike detected · 12 min after Warning' },
      { time: '14:58', entry: 'All-clear timer running · resets on each strike' },
    ],
  },

  agent: {
    body: 'Flash Agent reads the same 1×1 km cells as the portfolio map and acts in the tools Troon already runs: the Golf Genius tee sheet, the crew calendar and SMS. Every action is permissioned, logged, and confirmed by a person before a tee sheet changes.',
    question: 'Which Troon properties have a lightning Watch before Sunday’s tee times?',
    answer:
      'Two. Property 0412 has a Watch from 07:40 to 09:10 with a first tee at 08:00, and Property 0433 has a Watch from 09:10 to 10:30 that covers its 09:12 and later groups. Both tee sheets are flagged in Golf Genius and both superintendents were texted. Every other property is clear through noon.',
    actions: ['Golf Genius · tee sheet flagged', 'SMS · both superintendents'],
    source: 'Source: cells 0412 · 0433 · 06:02 run',
  },

  stats: [
    { value: '99.6%', label: 'lightning prediction accuracy in the one-hour window' },
    { value: '60 min', label: 'strike-level lead on every course' },
    { value: '2 min', label: 'lightning-model refresh, portfolio-wide' },
    { value: '1×1 km', label: 'forecast cell per course, not per region' },
  ],

  proof: [
    { name: 'Troon', use: 'Lightning alerts across its golf portfolio' },
    { name: 'Big 12', use: 'Game-day lightning decisions for conference venues' },
    { name: 'Syngenta', use: 'Turf agronomy forecasts inside Turf Assistant' },
    { name: 'NAIA', use: 'Official weather-safety partner for championships' },
  ],

  testimonialPhoto: {
    src: `${IMG}/flash-rain-on-putting-green-flagstick.jpg`,
    alt: 'Heavy rain sheeting across an empty putting green with a flagstick and standing water, shown beside what golf operators say about running Flash',
  } satisfies Img,
  testimonials: [
    {
      quote:
        '…a game-changer—accurate, reliable, and essential for making informed decisions that keep our members safe and maintain seamless operations.',
      name: 'Chris Roselle',
      role: 'Tournament Director, Golf Association of Philadelphia',
    },
    {
      quote:
        'Flash AI has transformed how we handle weather disruptions. It’s accurate, reliable, and essential for any club that values foresight and safety.',
      name: 'Ryan Coll',
      role: 'Director of Golf, Columbus Country Club',
    },
  ] satisfies Testimonial[],

  otherSports: [
    {
      name: 'Big 12 Conference',
      body: 'Game-day lightning decisions for conference venues, on the same 1 km cells and 60-minute lead that Troon runs on its courses.',
      image: {
        src: `${IMG}/flash-floodlit-athletic-field-storm-building.jpg`,
        alt: 'A floodlit empty athletic field at dusk with storm clouds building beyond the light towers, for conference game-day lightning decisions',
      },
    },
    {
      name: 'NAIA',
      body: 'Official weather-safety partner for championships: one alert standard across host sites, with the written log each host can keep.',
      image: {
        src: `${IMG}/flash-floodlight-towers-championship-host-site.jpg`,
        alt: 'Floodlight towers over an empty outdoor sports complex at dusk with a rain shaft approaching, for one alert standard across championship host sites',
      },
    },
  ],

  related: [
    { kind: 'Product', title: 'Flash Lightning Prediction', href: links.lightning.href },
    { kind: 'Industry', title: 'Golf courses and clubs', href: links.golf.href },
    { kind: 'Comparison', title: 'Everyone else vs Flash', href: '/why-flash/everyone-else-vs-flash/' },
    { kind: 'Pricing', title: 'Plans for one course or a portfolio', href: links.pricing.href },
  ],
};
