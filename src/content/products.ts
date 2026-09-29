/**
 * The Flash product line, as data.
 *
 * The products index renders its cards from here, and the detail pages read
 * their names and paths from here, so a product is named and linked the same
 * way everywhere. The six secondary products (Weather Command Center, Flash
 * Edge Model, Agronomy Suite ...) render from content/product-pages.ts.
 */

import type { FaqIcon } from './faq-icons';

export type Faq = {
  question: string;
  answer: string;
  /** Shown left of the question (not in the schema); see content/faq-icons. */
  icon?: FaqIcon;
  /** An optional follow-up link rendered under the answer (not in the schema). */
  link?: { label: string; href: string };
};

/** Paths of the product pages that exist. Trailing slash, always. */
export const productPaths = {
  index: '/products/',
  lightning: '/products/lightning-prediction/',
  hail: '/products/hail-prediction/',
  heat: '/products/heat-wbgt/',
  api: '/products/api-offerings/',
  agent: '/products/flash-agent/',
  commandCenter: '/products/weather-command-center/',
  edgeModel: '/products/flash-edge-model/',
  agronomy: '/products/agronomy-suite/',
  mobileApp: '/products/mobile-app/',
  weatherShield: '/products/flash-weather-shield/',
  consulting: '/products/consulting-meteorology/',
} as const;

/** The breadcrumb every product page starts from. */
export const productsCrumb = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: productPaths.index },
];

type Img = { src: string; alt: string };
type TextLink = { label: string; href: string };

/**
 * "What does Flash predict?" -- the prediction catalogue on the index. Each
 * card is a hazard family and the forecast products inside it.
 */
/**
 * The industry chips over the "What does Flash predict?" grid. Picking one
 * highlights the cards that industry's pages rely on and dims the rest.
 */
export const catalogueFilters = [
  { id: 'golf', label: 'Golf & Turf' },
  { id: 'construction', label: 'Construction' },
  { id: 'schools', label: 'Schools, Parks & Sports' },
  { id: 'agriculture', label: 'Agriculture' },
  { id: 'roofing', label: 'Roofing' },
] as const;

export type CatalogueFilter = (typeof catalogueFilters)[number]['id'];

export type PredictionCard = {
  tag: string;
  badge: string;
  image: Img;
  items: { name: string; detail: string }[];
  links?: TextLink[];
  /** The navy coverage card that closes the grid. */
  dark?: boolean;
  /** The industry chips this card lights up for. */
  industries: CatalogueFilter[];
};

const IMG = '/images/products';

export const predictionCatalogue: PredictionCard[] = [
  {
    tag: 'Severe',
    badge: 'Up to 60 min ahead',
    image: {
      src: `${IMG}/flash-lightning-open-field-severe-card.png`,
      alt: 'Cloud-to-ground lightning striking open farmland at night, on the severe prediction card of the What does Flash predict grid',
    },
    items: [
      {
        name: 'Lightning',
        detail: '60-minute cell prediction, refreshed every 2 minutes · 99.6% accurate on the one-hour window',
      },
      {
        name: 'Hail',
        detail: 'Size, timing and swath up to 55 minutes before the first stone falls, refreshed every five minutes',
      },
    ],
    links: [
      { label: 'Lightning Prediction', href: productPaths.lightning },
      { label: 'Hail Prediction', href: productPaths.hail },
    ],
    industries: ['golf', 'construction', 'schools', 'agriculture', 'roofing'],
  },
  {
    tag: 'Heat',
    badge: '6-hour WBGT outlook',
    image: {
      src: `${IMG}/flash-heat-haze-track-dusk-wbgt-card.png`,
      alt: 'Heat haze rising off a synthetic track and bleachers at dusk, on the heat and WBGT prediction card',
    },
    items: [
      { name: 'WBGT outlook', detail: 'Six hours ahead, hourly, planned beside your on-site sensor' },
      { name: 'Heat index, temperature, dew point', detail: 'Hourly, out to 180 hours, per cell' },
    ],
    links: [{ label: 'Heat and WBGT', href: productPaths.heat }],
    industries: ['construction', 'schools'],
  },
  {
    tag: 'Water',
    badge: 'Per cell, per hour',
    image: {
      src: `${IMG}/flash-rain-steel-frame-jobsite-water-card.png`,
      alt: 'Rain falling across a steel-frame construction site, on the rain rate and precipitation probability card',
    },
    items: [
      { name: 'Rain rate and accumulation', detail: 'Per cell, per hour' },
      { name: 'Precipitation probability', detail: 'Timing for pours, spraying and event starts' },
    ],
    industries: ['golf', 'construction', 'schools', 'agriculture'],
  },
  {
    tag: 'Wind',
    badge: 'Gust timing to the minute',
    image: {
      src: `${IMG}/flash-tower-crane-storm-sky-wind-card.png`,
      alt: 'A tower crane silhouetted against a dark storm sky, on the sustained wind and gust timing card',
    },
    items: [
      { name: 'Sustained wind and gusts', detail: 'Crane, lift and tent thresholds' },
      { name: 'Gust timing', detail: 'When the first gust over your limit arrives' },
    ],
    industries: ['construction', 'schools', 'agriculture', 'roofing'],
  },
  {
    tag: 'Visibility and winter',
    badge: 'Stage the fleet early',
    image: {
      src: `${IMG}/flash-fog-country-road-dusk-visibility-card.png`,
      alt: 'Fog and snow along a country road at dusk, on the visibility and winter prediction card',
    },
    items: [
      { name: 'Fog and low visibility', detail: 'Fleet staging and event starts' },
      { name: 'Snow and ice accumulation', detail: 'Municipal and utility crews' },
    ],
    industries: ['schools'],
  },
  {
    tag: 'Agronomy',
    badge: 'Field by field',
    image: {
      src: `${IMG}/flash-frosted-crop-rows-dawn-agronomy-card.png`,
      alt: 'Frosted crop rows running to the horizon at dawn, on the agronomy prediction card',
    },
    items: [
      { name: 'Frost and freeze', detail: 'Hours ahead, by field' },
      {
        name: 'Evapotranspiration and disease pressure',
        detail: 'Daily ET for irrigation · dollar spot, pythium, brown patch',
      },
      { name: 'Growing-degree days', detail: 'Cumulative GDD by field, for timing and treatment' },
    ],
    links: [{ label: 'Agronomy Suite', href: productPaths.agronomy }],
    industries: ['golf', 'agriculture'],
  },
  {
    tag: 'Delivery',
    badge: 'Screen, pocket, API',
    image: {
      src: `${IMG}/flash-command-center-mobile-app-delivery-card.png`,
      alt: 'The Weather Command Center radar view beside the Flash mobile app, on the delivery card',
    },
    items: [
      {
        name: 'Command Center, mobile app, Edge Model',
        detail: 'Every site on one screen, alerts in the pocket, on-site when the link drops',
      },
      { name: 'Flash API and webhooks', detail: 'Over 100 parameters as JSON, per cell' },
    ],
    industries: ['golf', 'construction', 'schools', 'agriculture', 'roofing'],
  },
  {
    tag: 'Coverage',
    badge: '1 × 1 km, no hardware',
    dark: true,
    image: {
      src: `${IMG}/flash-open-plain-layered-storms-coverage-card.png`,
      alt: 'A vast open plain under layered storm systems at dusk, on the coverage card for the U.S., Canada and Mexico',
    },
    items: [
      {
        name: 'Continental U.S., Canada and Mexico',
        detail: '1 × 1 km cells · lightning model every 2 minutes, hail every 5 · no hardware on any site',
      },
    ],
    links: [{ label: 'See every product', href: '/products/#products' }],
    industries: ['golf', 'construction', 'schools', 'agriculture', 'roofing'],
  },
];

/**
 * Every Flash product, as the index's delivery grid shows it. `id` is the
 * card's anchor on /products/ and stays permanent, since older links point at
 * `/products/#<id>`. `href` is the product's own page.
 */
export type Product = {
  id: string;
  name: string;
  category: string;
  summary: string;
  href?: string;
  image: Img;
};

export const products: Product[] = [
  {
    id: 'flash-lightning-suite',
    name: 'Flash Lightning Suite',
    category: 'Severe weather',
    summary: 'Predicts lightning up to 60 minutes ahead at 1×1 km, refreshed every two minutes.',
    href: productPaths.lightning,
    image: {
      src: `${IMG}/flash-lightning-suite-product.png`,
      alt: 'Flash AI Lightning product card: first strike map, threat forecast and nearest strike, beside the mobile app showing a lightning probability map',
    },
  },
  {
    id: 'predictive-hail',
    name: 'Predictive Hail',
    category: 'Severe weather',
    summary:
      'Hail size, timing and swath up to 55 minutes before the first stone falls, refreshed every five minutes.',
    href: productPaths.hail,
    image: {
      src: `${IMG}/flash-predictive-hail-product.png`,
      alt: 'A laptop showing a predicted hail swath over a county map, beside the line "The first true predictive hail product on the market"',
    },
  },
  {
    id: 'weather-command-center',
    name: 'Weather Command Center',
    category: 'Delivery · flagship',
    summary: "Flash's flagship platform: every risk that touches your operation on one screen.",
    href: productPaths.commandCenter,
    image: {
      src: `${IMG}/flash-weather-command-center-product.png`,
      alt: 'The Weather Command Center on a laptop, showing lightning probability across a region at 1×1 km resolution',
    },
  },
  {
    id: 'flash-edge-model',
    name: 'Flash Edge Model',
    category: 'Forecasting',
    summary:
      'Best, most likely and worst case for over 100 parameters, so you plan for the range, not a single line.',
    href: productPaths.edgeModel,
    image: {
      src: `${IMG}/flash-edge-model-product.png`,
      alt: 'Three Flash Edge Model forecast maps of the continental U.S. for temperature, moisture and fire risk from one model run',
    },
  },
  {
    id: 'flash-api',
    name: 'Flash API',
    category: 'Integration',
    summary:
      'The same forecast intelligence, engineered for integration: over 100 parameters, forecasts out to 180 hours.',
    href: productPaths.api,
    image: {
      src: `${IMG}/flash-api-product.png`,
      alt: 'A laptop showing Flash forecast storm cells across the south-eastern U.S., as served by the Flash API',
    },
  },
  {
    id: 'agronomy-suite',
    name: 'Agronomy Suite',
    category: 'Turf and crops',
    summary: 'Site-specific turf and crop metrics, proprietary frost forecasts and the Golf Playability index.',
    href: productPaths.agronomy,
    image: {
      src: `${IMG}/flash-agronomy-suite-product.png`,
      alt: 'The Flash app showing a Golf Playability map over a course, beside a ball at the edge of the cup',
    },
  },
  {
    id: 'flash-mobile-app',
    name: 'Flash Mobile App',
    category: 'Delivery',
    summary: 'Enterprise-grade prediction in your pocket, with 18 hours of future radar.',
    href: productPaths.mobileApp,
    image: {
      src: `${IMG}/flash-mobile-app-product.png`,
      alt: 'Four phones running the Flash mobile app: lightning probability, future radar, live radar and 7-day forecasts',
    },
  },
  {
    id: 'flash-weather-shield',
    name: 'Flash Weather Shield',
    category: 'On site',
    summary: 'The first fully customizable predictive weather siren. Solar-powered, cellular, on site.',
    href: productPaths.weatherShield,
    image: {
      src: `${IMG}/flash-weather-shield-siren-product.png`,
      alt: 'The Flash Weather Shield Micro siren with strobe and horns on a tripod beside a swimming pool',
    },
  },
  {
    id: 'consulting-meteorology',
    name: 'Consulting Meteorology',
    category: 'Services',
    summary: 'Real meteorologists for your biggest days: expert forecasting, briefings and live decision support.',
    href: productPaths.consulting,
    image: {
      src: `${IMG}/flash-consulting-meteorology-product.png`,
      alt: 'A Flash meteorologist delivering a briefing in front of forecast maps',
    },
  },
];

/**
 * The index's product grid, grouped by the hero's three layers, then services.
 * `id` is the group's anchor on /products/ (`#layer-<id>`); `products` are
 * ids from `products` above, in the order they show. Intelligence has no card
 * list: its one product is the Flash Agent band.
 *
 * The first three lines are the hero lede's sentences, verbatim. The services
 * line is drafted for this grid.
 */
export type ProductLayerId = 'intelligence' | 'predictions' | 'delivery' | 'services';

export type ProductLayer = { id: ProductLayerId; label: string; line: string; products: string[] };

export const productLayers: ProductLayer[] = [
  {
    id: 'intelligence',
    label: 'Intelligence',
    line: 'Flash Agent answers in plain language and acts in the tools you already run.',
    products: [],
  },
  {
    id: 'predictions',
    label: 'Predictions',
    line: 'One engine forecasts lightning, hail, heat and WBGT, wind, rain and frost on a 1 km grid, refreshed every 2 minutes.',
    products: ['flash-lightning-suite', 'predictive-hail', 'flash-edge-model', 'agronomy-suite'],
  },
  {
    id: 'delivery',
    label: 'Delivery',
    line: 'Every channel puts the call where your people already look.',
    products: ['weather-command-center', 'flash-api', 'flash-mobile-app', 'flash-weather-shield'],
  },
  {
    id: 'services',
    label: 'Services',
    line: 'Meteorologists beside your team for the calls that need a person.',
    products: ['consulting-meteorology'],
  },
];

/** "Which part of the platform should you start with?" */
export type RoleCard = {
  role: string;
  image: Img;
  startWith: TextLink[];
  /** Where Flash Agent acts for this role, and what it does there. */
  tool: string;
  action: string;
};

export const roleCards: RoleCard[] = [
  {
    role: 'Athletic director or trainer',
    image: {
      src: `${IMG}/flash-floodlit-athletic-field-role-athletic-director.png`,
      alt: 'A floodlit athletic field under heavy cloud at dusk, on the athletic director role card',
    },
    startWith: [
      { label: 'Heat and WBGT', href: productPaths.heat },
      { label: 'Lightning Prediction', href: productPaths.lightning },
    ],
    tool: 'Google Calendar',
    action: 'Moves practice when WBGT crosses your limit and texts the trainers',
  },
  {
    role: 'Construction superintendent',
    image: {
      src: `${IMG}/flash-highrise-tower-crane-role-superintendent.png`,
      alt: 'A high-rise under construction with a tower crane against storm clouds, on the construction superintendent role card',
    },
    startWith: [
      { label: 'Lightning Prediction', href: productPaths.lightning },
      { label: 'Flash Edge Model', href: productPaths.edgeModel },
    ],
    tool: 'Procore',
    action: 'Finds the crane lift inside a lightning window and reschedules it',
  },
  {
    role: 'Roofing owner or claims lead',
    image: {
      src: `${IMG}/flash-shelf-cloud-rooftops-role-roofing-owner.png`,
      alt: 'A shelf cloud moving over suburban rooftops, on the roofing owner and claims lead role card',
    },
    startWith: [{ label: 'Hail Prediction', href: productPaths.hail }],
    tool: 'HubSpot',
    action: 'Lists the streets that took hail above your size threshold and pushes the canvass list',
  },
  {
    role: 'Golf superintendent or agronomist',
    image: {
      src: `${IMG}/flash-golf-fairway-rain-role-superintendent.webp`,
      alt: 'A golf fairway and tree line under rain-heavy cloud, on the golf superintendent and agronomist role card',
    },
    startWith: [
      { label: 'Agronomy Suite', href: productPaths.agronomy },
      { label: 'Lightning Prediction', href: productPaths.lightning },
    ],
    tool: 'Crew calendar',
    action: 'Checks the spray window against wind and rain and books it for the crew',
  },
  {
    role: 'Safety manager, multi-site',
    image: {
      src: `${IMG}/flash-weather-command-center-role-safety-manager.png`,
      alt: 'The Weather Command Center showing every site on one map, on the multi-site safety manager role card',
    },
    startWith: [{ label: 'Weather Command Center', href: productPaths.commandCenter }],
    tool: 'SharePoint',
    action: "Exports last night's all-clear decisions to the audit file",
  },
  {
    role: 'Developer or integration team',
    image: {
      src: `${IMG}/flash-api-forecast-cells-role-developer.png`,
      alt: 'The Flash API view of forecast cells across the country, on the developer and integration team role card',
    },
    startWith: [{ label: 'Flash API', href: productPaths.api }],
    tool: 'Your app',
    action: 'Callable from your own code; the agent and the API read the same 1 km cells and model run',
  },
];

/** Named customers on the index's proof strip. */
export const customerProof = [
  { name: 'Troon', use: "Lightning alerts across Troon's golf properties" },
  { name: 'Big 12', use: 'Game-day lightning decisions for conference venues' },
  { name: 'Syngenta', use: 'Turf agronomy forecasts inside Turf Assistant' },
  { name: 'NAIA', use: 'Official weather-safety partner for championships' },
];

export const platformFaqs: Faq[] = [
  {
    question: 'Do I need to install anything?',
    icon: 'download',
    answer:
      'No. Flash is software only: the web app, the mobile app, the API and the SMS, email and horn/strobe integrations. There is no sensor to site, calibrate or replace, and you are live the day you sign.',
  },
  {
    question: 'Is Flash only lightning and hail?',
    icon: 'layers',
    answer:
      'No. Those are the products with their own pages. The same engine forecasts WBGT and heat, wind and gusts, rain, frost and freeze, disease pressure, fog, snow and ice on the same 1 km grid, and all of it is in the API.',
  },
  {
    question: 'What does Flash Agent actually do?',
    icon: 'bolt',
    answer:
      'It reads the forecast for your cells and your site list, answers questions in plain language and, with your permission, acts in the tools you already run: moves a practice in Google Calendar, reschedules a lift in Procore, pushes a canvass list to HubSpot. Every action is logged and a person confirms it first.',
  },
  {
    question: 'Can I start with one site?',
    icon: 'pin',
    answer:
      'Yes. A single school, course or job site can start on its own and add locations later from the Command Center. There is no hardware roll-out to schedule, so the second site is a setting, not a project.',
  },
  {
    question: 'Does the API return the same forecast the app shows?',
    icon: 'code',
    answer:
      'Yes. The API, the Command Center, the mobile app and Flash Agent all read the same 1 km, 2-minute model run, so a webhook and a push alert never disagree about the same cell.',
  },
];
