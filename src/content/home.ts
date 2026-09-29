/**
 * Home page content, as data.
 *
 * Copy is the design's (Paper "01 · Home"), verbatim. The Flash Agent tab
 * panels come from the same section as it appears open on each industry page
 * ("05 · Roofing", "06 · Schools & Athletics", "08 · Agriculture"); Golf and
 * Turf's answer is the "Q13" query card ("flash" file), and its home state is
 * the "01 · Home — Flash Agent tab · Golf and Turf" artboard.
 */

const IMG = '/images/home';

export type Img = { src: string; alt: string };

// ---------------------------------------------------------------------------
// Hero

export const heroImage: Img = {
  src: `${IMG}/golf-course-rain-storm-flash-lightning-prediction.webp`,
  alt: 'Rain sweeping across a golf course fairway under a dark storm sky, the hour before a strike that Flash Weather AI predicts',
};

export const heroSurfaces = [
  {
    tag: '01 · Weather Command Center',
    title: 'Every site on one screen',
    body: 'Lightning, hail, heat, wind and rain on the same 1×1 km grid',
    href: '/products/weather-command-center/',
    image: {
      src: `${IMG}/weather-command-center-lightning-map.png`,
      alt: 'Weather Command Center map showing lightning probability cells at 1×1 km resolution',
    },
    height: 'h-[186px]',
  },
  {
    tag: '02 · Flash Mobile App',
    title: '18 hours of future radar',
    body: "The same forecast in the crew's pocket",
    href: '/products/mobile-app/',
    image: {
      src: `${IMG}/flash-mobile-app-future-radar-phones.png`,
      alt: 'Four phones running the Flash mobile app with lightning probability and future radar maps',
    },
    height: 'h-[150px]',
  },
] as const;

export const heroBaseline: { label: string; href?: string }[] = [
  { label: 'Lightning prediction', href: '/products/lightning-prediction/' },
  { label: 'Hail prediction', href: '/products/hail-prediction/' },
  { label: '18-hour future radar' },
  { label: 'Flash Agent', href: '/products/flash-agent/' },
];

// ---------------------------------------------------------------------------
// Numbers

export type Stat = {
  id: 'accuracy' | 'hail' | 'refresh' | 'resolution' | 'products';
  value: string;
  label: string;
  /** A stat whose method has its own page links there. */
  href?: string;
};

export const stats: Stat[] = [
  {
    id: 'accuracy',
    value: '99.6%',
    label: 'Lightning prediction accuracy on the one-hour window',
    href: '/why-flash/accuracy-method/',
  },
  { id: 'hail', value: '55 min', label: 'Hail prediction lead time before the first stone falls' },
  { id: 'refresh', value: '2 min', label: 'Data refresh rate, so the map moves with the storm' },
  { id: 'resolution', value: '1×1 km', label: 'Forecast resolution: your site gets its own cell, not a county' },
  { id: 'products', value: '15+', label: 'Proprietary prediction products on one platform' },
];

// ---------------------------------------------------------------------------
// Flash Agent · ask by industry

export type AgentStatus = 'warning' | 'clear' | 'watch';

export type AgentAnswer = {
  site: string;
  status: { tone: AgentStatus; label: string };
  answer: string;
  chart: 'construction' | 'roofing' | 'schools' | 'agriculture' | 'golf';
  /** A plain-language description of the chart, for screen readers. */
  chartSummary: string;
  chips: { label: string; value: string }[];
  primaryAction: string;
  secondaryAction: string;
  followUps: string[];
};

export type AgentTab = {
  id: string;
  label: string;
  /** The industry page this tab's crew belongs to. */
  href: string;
  /** The one question this crew asks; the chat plays it, then the answer. */
  question: string;
  answer: AgentAnswer;
};

const SOURCE_CHIP = { label: 'Source', value: 'Flash forecast · 1×1 km · every 2 min' };

export const agentTabs: AgentTab[] = [
  {
    id: 'construction',
    label: 'Construction and Concrete',
    href: '/industries-we-serve/construction/',
    question: 'Are wind gusts low enough to safely operate cranes and work at elevated heights?',
    answer: {
      site: 'Midtown Parking Deck · today',
      status: { tone: 'warning', label: 'No-go until 11:20' },
      answer:
        'Not yet. Gusts at the Midtown Parking Deck reach 31 mph between 08:00 and 11:00, above your 25 mph crane limit. The window opens at 11:20 and holds through 17:00. Peachtree Yard is clear all day, so the elevated work can start there this morning.',
      chart: 'construction',
      chartSummary:
        'Hourly wind gusts from 06:00 to 18:00 against a 25 mph crane limit: gusts over the limit from 09:00 to 11:00, a clear window from 11:20 to 17:00.',
      chips: [
        { label: 'Site', value: 'Midtown Parking Deck' },
        { label: 'Your limit', value: '25 mph gusts, crane policy' },
        SOURCE_CHIP,
      ],
      primaryAction: 'Reschedule lift in Procore',
      secondaryAction: 'Notify foreman on Slack',
      followUps: ['What about Peachtree Yard?', 'When does the window close?', 'Log this decision for the safety file'],
    },
  },
  {
    id: 'roofing',
    label: 'Roofing and Exteriors',
    href: '/industries-we-serve/roofing/',
    question: 'What days this week offer viable 5-hour windows to tear off a residential roof and get back to watertight?',
    answer: {
      site: 'Roswell re-roof · this week',
      status: { tone: 'clear', label: 'Go · Tue and Thu' },
      answer:
        'Two days. Tuesday 07:00–13:30 and Thursday 08:00–14:00 are dry at the Roswell re-roof with gusts under 20 mph, long enough to tear off and get back to watertight. Wednesday brings a hail warning at 15:10, so keep that deck closed and leave the Milton repair for Friday.',
      chart: 'roofing',
      chartSummary:
        'Dry hours per day, Monday to Sunday, against a 5-hour tear-off window: Tuesday 07:00–13:30 and Thursday 08:00–14:00 clear it; Wednesday has a hail warning at 15:10.',
      chips: [
        { label: 'Site', value: 'Roswell re-roof' },
        { label: 'Your limit', value: '5 h dry, gusts under 20 mph' },
        SOURCE_CHIP,
      ],
      primaryAction: 'Book the tear-off in JobNimbus',
      secondaryAction: 'Text the crew lead',
      followUps: ['Push both days to Google Calendar', 'What about the Milton repair?', 'Log this decision for the job file'],
    },
  },
  {
    id: 'agriculture',
    label: 'Agriculture',
    href: '/industries-we-serve/agriculture/',
    question: 'When will we get the first frost?',
    answer: {
      site: 'North fields · this week',
      status: { tone: 'watch', label: 'Frost Thursday 05:40' },
      answer:
        'Thursday, 05:40. The north fields drop below 32 °F at about 04:10 Thursday, bottom out near 30 °F at 05:40 and climb back above freezing after sunrise. Tuesday night holds at 39 °F and Thursday night at 36 °F, so Wednesday night is the one that matters. Cover the seedlings Wednesday evening and hold irrigation that night so the beds are dry when it hits.',
      chart: 'agriculture',
      chartSummary:
        'Temperature from Tuesday 18:00 to Friday 06:00 against the 32 °F frost line: it dips below freezing early Thursday, with first frost at 05:40; cover by Wednesday 18:00.',
      chips: [
        { label: 'Site', value: 'North fields · Block 4' },
        { label: 'Your limit', value: '32 °F on seedlings, frost policy' },
        SOURCE_CHIP,
      ],
      primaryAction: "Add 'cover seedlings' to the crew calendar",
      secondaryAction: 'Text the irrigation lead',
      followUps: ['Which blocks are exposed?', 'How long does the frost last?', 'Remind me Wednesday at 16:00'],
    },
  },
  {
    id: 'golf',
    label: 'Golf and Turf',
    href: '/industries-we-serve/golf/',
    question: 'How much water should I put on the golf course today/tonight?',
    answer: {
      site: 'Riverbend North · tonight',
      status: { tone: 'clear', label: 'Go · Irrigate tonight' },
      answer:
        'Run 0.18 in on greens and approaches tonight. ET hit 0.22 in today and the 20% shower chance banks almost nothing. Start at 11 PM, done by 12:04 AM.',
      chart: 'golf',
      chartSummary:
        'Greens soil moisture (0–4 in, % VWC) from Saturday to Thursday against the 90% field-capacity refill target: observed moisture falls from about 62% to 41% by now. With 0.18 in tonight it recovers to about 55% by Wednesday; with no water it keeps falling to about 35% by Thursday.',
      chips: [
        { label: 'Site', value: 'Riverbend North' },
        { label: 'Your limit', value: '90% FC refill, 6h max night run' },
        SOURCE_CHIP,
      ],
      primaryAction: 'Send run times to ERP',
      secondaryAction: 'Notify crew on Slack',
      followUps: ['By zone', 'Skip tonight?', 'ET schedule'],
    },
  },
  {
    id: 'schools',
    label: 'Schools, Parks and Sports',
    href: '/industries-we-serve/schools/',
    question: 'Will our baseball fields be too saturated to play a game this Friday?',
    answer: {
      site: 'Riverside Baseball Complex · Thursday',
      status: { tone: 'warning', label: 'No-go Friday' },
      answer:
        "Yes. 1.4 in of rain lands on the Riverside fields Thursday night, and the outfield stays above your playable saturation limit until Saturday noon. Friday's 16:00 game is a no-go; Saturday 15:00 is dry, drained and playable, so move it there. The turf crew can tarp the infield Thursday afternoon.",
      chart: 'schools',
      chartSummary:
        'Outfield soil saturation from Thursday noon to Saturday 18:00 against a 60% playable limit: 1.4 in of rain Thursday night keeps it over the limit through the Friday 16:00 game; playable from Saturday 12:00.',
      chips: [
        { label: 'Site', value: 'Riverside Baseball Complex' },
        { label: 'Your limit', value: '60% outfield saturation, athletics policy' },
        SOURCE_CHIP,
      ],
      primaryAction: 'Move the game to Saturday in Google Calendar',
      secondaryAction: 'Notify parents via the athletics app',
      followUps: ['What about the softball field?', 'When does the outfield drain?', 'Log this decision for the athletic director'],
    },
  },
];

export const agentHarness = [
  {
    tag: '01 · Prediction engine',
    title: '15+ prediction products, 1×1 km, every 2 minutes',
    body: 'Lightning, hail, heat and WBGT, wind, rain, frost and more, scored for every cell.',
    highlight: false,
  },
  {
    tag: '02 · Flash Agent, the harness',
    title: 'Your sites, your thresholds, your data',
    body: 'Reads your limits and schedules, answers in plain language, proposes the action.',
    highlight: true,
  },
  {
    tag: '03 · Your tools',
    title: 'Calendar · Procore · Slack · Teams · ERP · CRM',
    body: 'Permissions per connector. Every action logged. A person confirms before a schedule or record changes.',
    highlight: false,
  },
];

// ---------------------------------------------------------------------------
// Reactive vs proactive

export type ComparisonRow = {
  icon: 'strike' | 'county' | 'hourly' | 'chance' | 'hope';
  flashIcon: 'lead' | 'cell' | 'refresh' | 'pin' | 'go';
  them: { title: string; body: string };
  flash: { title: string; body: string };
};

export const comparisonRows: ComparisonRow[] = [
  {
    icon: 'strike',
    flashIcon: 'lead',
    them: { title: "Detects lightning once it's already here", body: 'The first alert is the first strike.' },
    flash: {
      title: 'Predicts it up to an hour before it strikes',
      body: 'Every cell is scored 60 minutes out, so the call is made early.',
    },
  },
  {
    icon: 'county',
    flashIcon: 'cell',
    them: { title: 'County-level forecasts', body: 'One answer for every site in the county.' },
    flash: { title: '1×1 km, field-level precision', body: 'Each site gets its own cell and its own answer.' },
  },
  {
    icon: 'hourly',
    flashIcon: 'refresh',
    them: { title: 'Updated hourly, or slower', body: 'The storm moves faster than the map.' },
    flash: { title: 'Refreshed every 2 minutes', body: 'The map moves with the storm, not behind it.' },
  },
  {
    icon: 'chance',
    flashIcon: 'pin',
    them: { title: '"Chance of storms this afternoon"', body: 'A percentage and a shrug.' },
    flash: { title: '"Lightning reaches this field at 3:47"', body: 'A place, a time, a decision.' },
  },
  {
    icon: 'hope',
    flashIcon: 'go',
    them: { title: 'React and hope', body: 'Clear the field after the first flash.' },
    flash: {
      title: 'Decide with confidence',
      body: 'A GO or NO-GO with the time attached, and a log to prove it.',
    },
  },
];

// ---------------------------------------------------------------------------
// See what's coming

export const devicesImage: Img = {
  src: `${IMG}/flash-weather-command-center-mobile-app-devices.png`,
  alt: 'Weather Command Center on a laptop beside the Flash Mobile App on two phones, both showing the same lightning prediction map',
};

// ---------------------------------------------------------------------------
// Trust bar + catalogue

export const trustedBy = [
  { name: 'Troon', use: 'Lightning alerts across Troon golf properties' },
  { name: 'Big 12', use: 'Game-day lightning decisions for conference venues' },
  { name: 'Syngenta', use: 'Turf agronomy forecasts inside Turf Assistant' },
  { name: 'NAIA', use: 'Official weather-safety partner for championships' },
];

export type CatalogueCard = {
  tag: string;
  caption: string;
  image: Img;
  items: { title: string; body: string }[];
  dark?: boolean;
  link?: { label: string; href: string };
  /** The design's photo grade: a named class in src/styles/home.css (`.home-catalogue-grade-<grade>`). */
  grade: 'standard' | 'delivery' | 'intelligence';
};

export const catalogue: CatalogueCard[] = [
  {
    tag: 'Severe',
    caption: 'Up to 60 min ahead',
    image: { src: `${IMG}/lightning-storm-severe-weather-prediction.png`, alt: '' },
    grade: 'standard',
    items: [
      { title: 'Lightning', body: 'Cloud-to-ground strikes, 60 min ahead per cell' },
      { title: 'Hail', body: 'Arrival window and size class, 55 min ahead' },
    ],
  },
  {
    tag: 'Heat',
    caption: '6-hour WBGT outlook',
    image: { src: `${IMG}/stadium-heat-wbgt-outlook.png`, alt: '' },
    grade: 'standard',
    items: [
      { title: 'WBGT outlook', body: 'Six hours ahead, beside your on-site sensor' },
      { title: 'Heat index, temperature, dew point', body: 'Hourly, out to 180 hours' },
    ],
  },
  {
    tag: 'Water',
    caption: 'Per cell, per hour',
    image: { src: `${IMG}/construction-site-rain-forecast.png`, alt: '' },
    grade: 'standard',
    items: [
      { title: 'Rain rate and accumulation', body: 'Per cell, per hour' },
      { title: 'Precipitation probability', body: 'Timing for pours, spraying and events' },
    ],
  },
  {
    tag: 'Wind',
    caption: 'Gust timing to the minute',
    image: { src: `${IMG}/crane-wind-gust-forecast.png`, alt: '' },
    grade: 'standard',
    items: [
      { title: 'Sustained wind and gusts', body: 'Crane, lift and tent thresholds' },
      { title: 'Gust timing', body: 'When the first gust over your limit arrives' },
    ],
  },
  {
    tag: 'Agronomy',
    caption: 'Field by field',
    image: { src: `${IMG}/frosted-field-agronomy-forecast.png`, alt: '' },
    grade: 'standard',
    items: [
      { title: 'Frost and freeze', body: 'Hours ahead, by field' },
      { title: 'Evapotranspiration, disease pressure, GDD', body: 'From the Agronomy Suite' },
    ],
  },
  {
    tag: 'Visibility and winter',
    caption: 'Stage the fleet early',
    image: { src: `${IMG}/foggy-road-winter-visibility-forecast.png`, alt: '' },
    grade: 'standard',
    items: [
      { title: 'Fog and low visibility', body: 'Fleet staging and event starts' },
      { title: 'Snow and ice accumulation', body: 'Municipal and utility crews' },
    ],
  },
  {
    tag: 'Delivery',
    caption: 'Screen, pocket, API',
    image: { src: `${IMG}/flash-weather-command-center-mobile-app-devices.png`, alt: '' },
    grade: 'delivery',
    items: [
      {
        title: 'Command Center, mobile app, Edge Model',
        body: 'Every site on one screen, alerts in the pocket, on-site when the link drops',
      },
      { title: 'Flash API and webhooks', body: 'Over 100 parameters as JSON, per cell' },
    ],
  },
  {
    tag: 'Intelligence',
    caption: 'Ask in plain language',
    image: { src: `${IMG}/flash-agent-weather-intelligence-network.png`, alt: '' },
    grade: 'intelligence',
    dark: true,
    items: [
      {
        title: 'Flash Agent',
        body: 'Ask in plain language; it answers from the forecast and acts in your calendar, ERP or CRM',
      },
    ],
    link: { label: 'See the platform', href: '/products/' },
  },
];

// ---------------------------------------------------------------------------
// Industries

/**
 * One panel of "Built for the person who has to make the call": who makes the
 * call, the call as they ask it, and Flash Agent's verdict in one line.
 *
 * Nothing here is new copy. The question and the status badge are the Flash
 * Agent tab for that industry (`agentTabs`, above), and `line` is a sentence
 * of that tab's answer. Insurance and fleets has no tab: its question and line
 * are the fleet manager exchange on the hail page
 * (components/products/hail/content.ts, `agentExamples`).
 */
export type IndustryCard = {
  id: string;
  name: string;
  /** The card summary. The panels do not show it. */
  body: string;
  href: string;
  image: Img;
  role: string;
  question: string;
  agent: { status: AgentAnswer['status']; line: string };
  /** "See Flash for {linkName}". */
  linkName: string;
};

const agentTab = (id: string) => {
  const tab = agentTabs.find((t) => t.id === id);
  if (!tab) throw new Error(`No Flash Agent tab "${id}"`);
  return tab;
};

export const industryCards: IndustryCard[] = [
  {
    id: 'schools',
    name: 'Schools and athletics',
    body: 'WBGT planning and lightning calls for athletic directors',
    href: '/industries-we-serve/schools/',
    image: { src: `${IMG}/schools-athletic-field-storm.png`, alt: 'A floodlit athletic field under a dark storm sky' },
    role: 'Athletic director',
    question: agentTab('schools').question,
    agent: {
      status: agentTab('schools').answer.status,
      line: 'Friday’s 16:00 game is a no-go; Saturday 15:00 is dry, drained and playable.',
    },
    linkName: 'schools and athletics',
  },
  {
    id: 'construction',
    name: 'Construction',
    body: 'Lightning and gust alerts that reach the crane operator',
    href: '/industries-we-serve/construction/',
    image: { src: `${IMG}/construction-crane-storm.png`, alt: 'A tower crane beside an unfinished concrete building as a storm moves in' },
    role: 'Construction superintendent',
    question: agentTab('construction').question,
    agent: {
      status: agentTab('construction').answer.status,
      line: 'Gusts at the Midtown Parking Deck reach 31 mph between 08:00 and 11:00, above your 25 mph crane limit.',
    },
    linkName: 'construction',
  },
  {
    id: 'roofing',
    name: 'Roofing',
    body: 'Hail cells up to 55 minutes before the storm reaches the neighborhood',
    href: '/industries-we-serve/roofing/',
    image: { src: `${IMG}/roofing-neighborhood-shelf-cloud.png`, alt: 'Residential rooftops beneath an advancing shelf cloud' },
    role: 'Roofing owner',
    question: agentTab('roofing').question,
    agent: {
      status: agentTab('roofing').answer.status,
      line: 'Tuesday 07:00–13:30 and Thursday 08:00–14:00 are dry at the Roswell re-roof with gusts under 20 mph.',
    },
    linkName: 'roofing',
  },
  {
    id: 'golf',
    name: 'Golf',
    body: 'Course-by-course lightning for every property in the portfolio',
    href: '/industries-we-serve/golf/',
    image: { src: heroImage.src, alt: 'A golf fairway under rain with standing water on the turf' },
    role: 'Golf course superintendent',
    question: agentTab('golf').question,
    agent: {
      status: agentTab('golf').answer.status,
      line: 'Run 0.18 in on greens and approaches tonight. Start at 11 PM, done by 12:04 AM.',
    },
    linkName: 'golf',
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    body: 'Frost, evapotranspiration, disease pressure and growing degree days',
    href: '/industries-we-serve/agriculture/',
    image: { src: `${IMG}/agriculture-crop-rows-dawn.png`, alt: 'Frosted crop rows running to the horizon at dawn' },
    role: 'Farm manager',
    question: agentTab('agriculture').question,
    agent: {
      status: agentTab('agriculture').answer.status,
      line: 'Cover the seedlings Wednesday evening and hold irrigation that night so the beds are dry when it hits.',
    },
    linkName: 'agriculture',
  },
  {
    id: 'insurance-fleets',
    name: 'Insurance and fleets',
    body: 'Hail forecasts for claims teams and vehicle staging',
    href: '/products/hail-prediction/',
    image: { src: `${IMG}/insurance-fleet-hail-sky.png`, alt: 'A parked vehicle fleet under a dark hail sky' },
    role: 'Fleet manager',
    question: 'Which lots are inside the hail window before 6 pm?',
    agent: {
      // The hail page's exchange has no status badge; this label is drafted from its answer.
      status: { tone: 'watch', label: 'Hail from 4:50 pm' },
      line: 'Two: Sandy Springs and Roswell, 1.00 in class from 4:50 pm.',
    },
    linkName: 'insurance and fleets',
  },
];

// ---------------------------------------------------------------------------
// Products

export type ProductCard = { category: string; name: string; body: string; href: string; image: Img };

export const productCards: ProductCard[] = [
  {
    category: 'Severe weather',
    name: 'Flash Lightning Suite',
    body: 'Predicts lightning up to 60 minutes ahead at 1×1 km, refreshed every two minutes.',
    href: '/products/lightning-prediction/',
    image: {
      src: `${IMG}/flash-lightning-suite-prediction-map.png`,
      alt: 'Flash AI Lightning: first strike map, threat forecast and nearest strike beside the mobile app',
    },
  },
  {
    category: 'Severe weather',
    name: 'Predictive Hail',
    body: 'Hail size, timing and swath up to 55 minutes before the first stone falls.',
    href: '/products/hail-prediction/',
    image: {
      src: `${IMG}/predictive-hail-product-map.png`,
      alt: 'A laptop showing a predicted hail swath over a county map',
    },
  },
  {
    category: 'Delivery · flagship',
    name: 'Weather Command Center',
    body: "Flash's flagship platform: every risk that touches your operation on one screen.",
    href: '/products/weather-command-center/',
    image: {
      src: `${IMG}/weather-command-center-lightning-map.png`,
      alt: 'The Weather Command Center on a laptop showing lightning probability at 1×1 km resolution',
    },
  },
  {
    category: 'Forecasting',
    name: 'Flash Edge Model',
    body: 'Best, most likely and worst case for over 100 parameters, so you plan for the range, not a single line.',
    href: '/products/flash-edge-model/',
    image: {
      src: `${IMG}/flash-edge-model-forecast-range.png`,
      alt: 'Three Flash Edge Model forecast maps of the continental U.S. from one model run',
    },
  },
  {
    category: 'Integration',
    name: 'Flash API',
    body: 'The same forecast intelligence, engineered for integration: over 100 parameters, forecasts out to 180 hours.',
    href: '/products/api-offerings/',
    image: {
      src: `${IMG}/flash-api-weather-data-map.png`,
      alt: 'A laptop showing Flash forecast storm cells across the south-eastern U.S.',
    },
  },
  {
    category: 'Turf and crops',
    name: 'Agronomy Suite',
    body: 'Site-specific turf and crop metrics, proprietary frost forecasts and the Golf Playability index.',
    href: '/products/agronomy-suite/',
    image: {
      src: `${IMG}/agronomy-suite-turf-crop-metrics.png`,
      alt: 'The Flash app showing a Golf Playability map over a course',
    },
  },
  {
    category: 'Delivery',
    name: 'Flash Mobile App',
    body: 'Enterprise-grade prediction in your pocket, with 18 hours of future radar.',
    href: '/products/mobile-app/',
    image: {
      src: `${IMG}/flash-mobile-app-future-radar-phones.png`,
      alt: 'Four phones running the Flash mobile app: lightning probability, future radar, live radar and 7-day forecasts',
    },
  },
  {
    category: 'On site',
    name: 'Flash Weather Shield',
    body: 'The first fully customizable predictive weather siren. Solar-powered, cellular, on site.',
    href: '/products/flash-weather-shield/',
    image: {
      src: `${IMG}/flash-weather-shield-siren.png`,
      alt: 'The Flash Weather Shield siren with strobe and horns on a tripod beside a swimming pool',
    },
  },
  {
    category: 'Services',
    name: 'Consulting Meteorology',
    body: 'Real meteorologists for your biggest days: expert forecasting, briefings and live decision support.',
    href: '/products/consulting-meteorology/',
    image: {
      src: `${IMG}/consulting-meteorology-briefing.png`,
      alt: 'A Flash meteorologist delivering a briefing in front of forecast maps',
    },
  },
];

// ---------------------------------------------------------------------------
// How it works

export const steps: { title: string; body: string; image: Img }[] = [
  {
    title: 'Over 100 atmospheric parameters',
    body: 'Radar, satellite, surface observations, lightning climatology and model fields, ingested continuously for the U.S., Canada and Mexico.',
    image: { src: `${IMG}/radar-dome-atmospheric-data.png`, alt: '' },
  },
  {
    title: 'The signals that precede a strike',
    body: 'FlashPredict for lightning and FlashHail for hail distil them into the signals that come before a strike, not the ones that follow it.',
    image: { src: `${IMG}/lightning-signal-model-visualization.png`, alt: '' },
  },
  {
    title: '1×1 km cells, refreshed every 2 min',
    body: "Risk is scored for every 1 × 1 km cell out to 60 minutes, with a six-hour outlook for the day's schedule.",
    image: { src: `${IMG}/supercell-storm-grid-forecast.png`, alt: '' },
  },
  {
    title: 'Alerts where the call is made',
    body: 'App, SMS, email, horn and strobe relays and the API, with an all-clear timer so play resumes on evidence, not a guess.',
    image: { src: `${IMG}/lightning-alert-horn-strobe.png`, alt: '' },
  },
];

// ---------------------------------------------------------------------------
// Proof

/**
 * `ambient` is what the card's photo does while it is on screen: the course
 * photo drifts, the storm photo flashes now and then (styles/finale.css).
 */
export const proofCards = [
  {
    tag: 'Case study · Golf',
    figure: '60 min',
    title: 'Troon: one lightning forecast for every course',
    body: 'A 60-minute cell forecast for each property, delivered to superintendents by app, SMS and horn/strobe relays, with one alert log for the whole portfolio.',
    link: { label: 'Read the Troon case study', href: '/case-studies/troon/' },
    image: { src: heroImage.src, alt: '' },
    dark: true,
    ambient: 'drift',
  },
  {
    tag: 'Comparison · Generic, no vendor named',
    figure: '99.6%',
    title: 'Prediction vs detection: what each can and cannot tell you',
    body: 'Detection networks report a strike after it happens. Flash scores every 1×1 km cell up to an hour ahead, at 99.6% accuracy on the one-hour window, refreshed every two minutes.',
    link: { label: 'Prediction vs detection', href: '/why-flash/prediction-vs-sensors-vs-detection/' },
    image: { src: `${IMG}/lightning-strike-storm-detection-comparison.png`, alt: '' },
    dark: false,
    ambient: 'flash',
  },
] as const;

export const testimonial = {
  quote:
    'The alert came through before we heard any thunder. We had the course cleared and the crews under cover before the first strike hit.',
  attribution: 'Golf course superintendent, True North Golf Club',
};
