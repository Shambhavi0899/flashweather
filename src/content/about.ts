/**
 * About page content, as data (Paper "19b · About", copy verbatim).
 *
 * Every figure here is on the approved fact sheet; the page says so in its
 * own H2. Do not add an outcome claim (downtime, losses avoided) until it is
 * sourced and dated.
 */

export const founder = {
  name: 'Jason Deese',
  jobTitle: 'Founder and Chief Meteorologist',
  description:
    "Founder and Chief Meteorologist of Flash Weather AI, and a former forecaster at NOAA's National Weather Service.",
  facts: [
    { value: 'Forecasters', label: 'by trade' },
    { value: 'NWS', label: "NOAA's National Weather Service" },
    { value: 'Predict', label: 'not detect' },
    { value: 'Canton, GA', label: 'Atlanta metro' },
  ],
};

export const principles = [
  {
    title: "Predict, don't detect.",
    body: 'A detector tells you a strike has already happened. A prediction tells you which 1 km cell is about to take one, up to 60 minutes ahead. Everything Flash builds starts from the second, because that is the one a coach, a foreman or a superintendent can act on.',
    link: { text: 'prediction', href: '/why-flash/prediction-vs-sensors-vs-detection/' },
  },
  {
    title: 'Publish the method.',
    body: 'Every accuracy figure we quote comes with its window: 99.6% lightning prediction accuracy on the one-hour window. The accuracy method page shows how the number is computed and when it was last refreshed.',
    link: { text: 'accuracy method page', href: '/why-flash/accuracy-method/' },
  },
  {
    title: "Act in the customer's tools.",
    body: 'A forecast is only useful when it changes a decision. Flash Agent answers in plain language and acts in the calendar, ERP or CRM you already run — Google Calendar, Procore, HubSpot, NetSuite — with a human confirming any change to a schedule or a record.',
    link: { text: 'Flash Agent', href: '/products/flash-agent/' },
  },
];

export const companyNumbers = [
  { value: '15+', label: 'proprietary prediction products', gold: false },
  { value: '100+', label: 'atmospheric parameters in the Flash API and Edge Model', gold: false },
  { value: '1 km', label: 'grid cells across the U.S., Canada and Mexico', gold: false },
  { value: '55 min', label: 'hail lead time before the first stone falls', gold: true },
  { value: '180 h', label: 'of forecasts in the Flash API', gold: false },
];

export const milestones = [
  {
    name: 'Origin',
    title: 'Founded by a forecaster',
    body: "Flash Scientific Technology Inc. is founded by Jason Deese in Canton, Georgia, after a career at NOAA's National Weather Service.",
    gold: false,
  },
  {
    name: 'Agronomy',
    title: 'Turf Threat Tracker acquisition',
    body: 'Frost, evapotranspiration, disease forecasting and growing-degree-day tracking join the platform as the Flash Agronomy Suite.',
    link: { text: 'Flash Agronomy Suite', href: '/products/agronomy-suite/' },
    gold: false,
  },
  {
    name: 'Hail',
    title: 'FlashHail launch',
    body: 'Hail predicted up to 55 minutes before the first stone falls, with size class, timing and swath; covered by Carrier Management and Automotive Fleet.',
    link: { text: 'Hail predicted', href: '/products/hail-prediction/' },
    gold: false,
  },
  {
    name: 'Accuracy',
    title: 'Accuracy method published',
    body: '99.6% lightning prediction accuracy on the one-hour window, published with its method and refresh date.',
    link: { text: 'published with its method', href: '/why-flash/accuracy-method/' },
    gold: true,
  },
];

export const aboutCustomers = [
  { name: 'Troon', use: 'Lightning prediction across managed golf properties', href: '/case-studies/troon/' },
  { name: 'Big 12', use: 'Game-day lightning decisions for conference venues' },
  { name: 'Syngenta', use: 'Turf agronomy forecasts inside Turf Assistant' },
  { name: 'NAIA', use: 'Official weather-safety partner for championships' },
];

/** Customers whose quotes from the old About page now live on Press & Partners. */
export const quotedCustomers = [
  'True North Golf Club',
  'Golf Association of Philadelphia',
  'Columbus Country Club',
  'The Edge Zipline',
];
