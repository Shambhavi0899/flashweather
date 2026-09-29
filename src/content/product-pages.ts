/**
 * The six secondary product pages, as data.
 *
 * One template (`app/products/[slug]/page.tsx`) renders every entry here, and
 * its route, metadata, OG card, schema and sitemap entry all derive from the
 * same entry. Slugs are the live flashweather.ai URLs and are permanent.
 *
 * Copy in `overview` and `features` is ported verbatim from the live pages
 * (flashweather.ai/products/<slug>/). The hero image is the product's card
 * image on /products/; the gallery image is the second image on the live page.
 */

import { site } from '@/lib/seo/site';

import { productPaths } from './products';

type Img = { src: string; alt: string };

/** One stop of an overview tour: see `overview.tour`. */
export type TourStop = {
  /** The screenshot area it points at; also the block's anchor id suffix. */
  spot: 'risk' | 'refresh' | 'lead-time' | 'screen';
  /** The hotspot's small label on the screenshot. */
  label: string;
  /** The bold lead-in, taken from the stop's own text. */
  lead: string;
  body: string;
};

export type ProductPage = {
  /** The URL segment under /products/. Permanent. */
  slug: string;
  /** The product's name: the <h1>, the breadcrumb and the OG eyebrow. */
  name: string;
  /** The <title>, 40 characters or fewer, keyword first; the layout appends the brand. */
  title: string;
  /** The meta description, 140-158 characters. */
  description: string;
  /** The hero's spaced-caps line above the H1. */
  eyebrow: string;
  /** The hero lead, one sentence. */
  lead: string;
  /** Which schema.org type the page asserts. */
  schema: { type: 'software'; category?: string; operatingSystem?: string } | { type: 'product' };
  /** The hero's secondary button; the primary is always "Book a demo". */
  secondaryCta: { label: string; href: string };
  heroImage: Img;
  overview: {
    heading: string;
    image: Img & { caption: string };
  } & (
    | {
        /** The live "Product Overview" text, split into paragraphs. */
        paragraphs: string[];
        /**
         * Draws the text with a Free / Premium toggle: `free` and `premium` are
         * the features and `price` the Premium price, each an exact phrase of
         * `paragraphs` (mobile-app-tiers.tsx marks them where they stand).
         */
        tiers?: { free: string[]; premium: string[]; price: string };
        tour?: never;
      }
    | {
        /**
         * The same live text as a guided tour of `image`: each stop is a run of
         * whole sentences with a lead-in taken from its own words, and points at
         * one area of the screenshot (`spot`, placed in styles/wcc-tour.css).
         */
        tour: TourStop[];
        paragraphs?: never;
      }
  );
  features: {
    heading: string;
    items: { title: string; body: string }[];
  };
  /** `id`s from `products` in content/products.ts. */
  related: string[];
  /** Industry slugs from content/industries.ts. */
  industries: string[];
};

const IMG = '/images/products';

/** The live product pages' shared title-bar photograph, used behind every hero. */
export const productPageHeroBackground = `${IMG}/flash-lightning-storm-over-water-product-hero.jpg`;

export const productPages: ProductPage[] = [
  {
    slug: 'weather-command-center',
    name: 'Weather Command Center',
    title: 'Weather command center for operations',
    description:
      'Live lightning, predictive hail and 18-hour future radar on one screen, refreshed every 2 minutes at 1 km, so dispatchers and crews make the same call.',
    eyebrow: 'Delivery · flagship · every risk on one screen',
    lead: "Flash's flagship platform: every risk that touches your operation on one screen.",
    schema: { type: 'software', operatingSystem: 'Web' },
    secondaryCta: { label: 'View Command Center', href: site.appUrl },
    heroImage: {
      src: `${IMG}/flash-weather-command-center-product.png`,
      alt: 'The Weather Command Center on a laptop, showing lightning probability across a region at 1×1 km resolution',
    },
    overview: {
      heading: 'What is the Weather Command Center?',
      // The live three paragraphs, word for word, split at sentence breaks.
      // Lead-ins and hotspot labels are drafted from each stop's own text.
      tour: [
        {
          spot: 'risk',
          label: 'Live lightning risk',
          lead: 'Every risk on one screen',
          body: "The Weather Command Center is Flash's flagship operational platform, built for teams that need a single source of truth on weather. It pulls every risk that touches your operation onto one screen, including live lightning, predictive hail swaths, hi-res future radar, watches and warnings, custom indices, and decision-ready maps for when to pause, when to call all clear, and when to pre-position crews.",
        },
        {
          spot: 'refresh',
          label: 'Refreshes every 2 minutes',
          lead: 'Every two minutes, on a 1×1 km grid',
          body: 'Data refreshes as often as every two minutes on a 1×1 km grid, with 99.6% accuracy on lightning and 85%+ accuracy on most other parameters.',
        },
        {
          spot: 'lead-time',
          label: 'Minutes ahead',
          lead: 'Future radar and All Clear maps',
          body: 'Eighteen hours of hi-res future radar and a 10-day outlook let teams plan the day and the week from the same view. All Clear and Lightning Probability maps remove the judgment call from dispatch and field decisions, replacing the old "30 minute rule" with predictive alerts grounded in real data.',
        },
        {
          spot: 'screen',
          label: 'One platform',
          lead: 'One platform, not three apps',
          body: 'WCC is the home for the full Flash product suite, including the Lightning Suite, hail prediction, the Flash Edge Model forecasts, agronomy tools, and the Winter Weather Center. Dispatchers, supervisors, and field crews work from one platform instead of juggling three different apps. Whether you manage a course, a job site, a utility crew, or a stadium, WCC turns weather from a guessing game into a structured operational decision.',
        },
      ],
      image: {
        src: `${IMG}/weather-command-center/flash-weather-command-center-firststrike-prediction-laptop.png`,
        alt: 'The Weather Command Center on a laptop showing a FirstStrike prediction map, beside the line "See it up to 60 minutes in advance"',
        caption: 'FirstStrike prediction in the Weather Command Center',
      },
    },
    features: {
      heading: 'Why teams run operations from the Command Center',
      items: [
        { title: 'A single platform', body: 'One platform, every weather risk' },
        { title: 'Accuracy', body: '99.6% accuracy on a 1x1 km grid' },
        { title: 'Future radar', body: '18-hour future radar, 2-minute refresh' },
        { title: 'Plan ahead', body: 'Detect, predict, decide, plan' },
      ],
    },
    related: ['flash-lightning-suite', 'predictive-hail', 'flash-edge-model', 'flash-mobile-app'],
    industries: ['construction', 'golf', 'utilities', 'events-venues', 'schools'],
  },
  {
    slug: 'mobile-app',
    name: 'Flash Mobile App',
    title: 'Lightning alert app with future radar',
    description:
      'Predictive lightning push alerts, 18-hour future radar and an All Clear map on your phone. Free to download; Premium is $3.99 a month or $40 a year.',
    eyebrow: 'Delivery · iOS and Android · free and Premium',
    lead: 'Enterprise-grade prediction in your pocket, with 18 hours of future radar.',
    schema: { type: 'software', category: 'UtilitiesApplication', operatingSystem: 'iOS, Android' },
    secondaryCta: { label: 'Download the free app', href: site.appDownloadUrl },
    heroImage: {
      src: `${IMG}/flash-mobile-app-product.png`,
      alt: 'Four phones running the Flash mobile app: lightning probability, future radar, live radar and 7-day forecasts',
    },
    overview: {
      heading: 'What does the Flash mobile app do?',
      paragraphs: [
        'The Flash mobile app puts the same predictive intelligence we built for enterprise teams in your pocket. The free version covers nearest strike and detection, current conditions, 7-day and hourly forecasts, and live radar, which already beats most weather apps on the market.',
        // The live paragraph is cut off after "10-day"; completed with the "10-day outlook" the Command Center page names.
        'Premium, at $3.99 a month or $40 a year, unlocks the products that make Flash different: lightning detection and prediction push notifications, the lightning threat forecast and trend view, the First Strike forecast map, the All Clear go/no-go map, 1-hour hi-res lightning probability, 5-hour lightning probability, 18-hour hi-res future radar, and the 10-day outlook.',
      ],
      // Awaiting approval: the free / Premium split as the two paragraphs state it.
      tiers: {
        free: ['nearest strike and detection', 'current conditions', '7-day and hourly forecasts', 'live radar'],
        premium: [
          'lightning detection and prediction push notifications',
          'lightning threat forecast and trend view',
          'First Strike forecast map',
          'All Clear go/no-go map',
          '1-hour hi-res lightning probability',
          '5-hour lightning probability',
          '18-hour hi-res future radar',
          '10-day outlook',
        ],
        price: '$3.99 a month or $40 a year',
      },
      image: {
        src: `${IMG}/mobile-app/flash-mobile-app-all-clear-push-notification-screens.png`,
        alt: 'Three phones running the Flash mobile app, showing the All Clear map, a lightning stop status and the lightning outlook, beside all-clear, detected and warning push notifications',
        caption: 'Lightning safety, status, outlook and push notifications in the Flash mobile app',
      },
    },
    features: {
      heading: 'What comes with the Flash mobile app?',
      items: [
        { title: 'Tiered options', body: 'Free version plus Premium at $3.99 a month' },
        { title: 'Push notifications', body: 'Predictive lightning push, SMS, and email alerts' },
        { title: 'In your pocket', body: '18-hour future radar in your pocket' },
        { title: 'Pairs with other products', body: 'Pairs with the Weather Command Center for ops teams' },
      ],
    },
    related: ['weather-command-center', 'flash-lightning-suite', 'flash-weather-shield'],
    industries: ['golf', 'outdoor-sports', 'schools', 'parks-rec'],
  },
  {
    slug: 'flash-weather-shield',
    name: 'Flash Weather Shield',
    title: 'Predictive lightning siren and strobe',
    description:
      'Horns and strobes wired to 99.6% accurate lightning prediction sound before the first strike. Solar, cellular, in three sizes for courses, fields and pools.',
    eyebrow: 'On site · Shield, Mini and Micro',
    lead: 'The first fully customizable predictive weather siren. Solar-powered, cellular, on site.',
    schema: { type: 'product' },
    secondaryCta: { label: 'See pricing', href: '/pricing/' },
    heroImage: {
      src: `${IMG}/flash-weather-shield-siren-product.png`,
      alt: 'The Flash Weather Shield Micro siren with strobe and horns on a tripod beside a swimming pool',
    },
    overview: {
      heading: 'What is the Flash Weather Shield?',
      paragraphs: [
        "The Flash Weather Shield is the industry's first fully customizable predictive weather notification system. Where legacy detection units only sound off after lightning is already nearby, Shield is wired to Flash's 1-hour predictive lightning model, so the horn or strobe fires before the first strike lands, not after.",
        'Three configurations fit different environments. The full Flash Shield is the gold standard for large outdoor operations, with four horns standard (up to eight) and coverage built for entire golf courses and complexes. The Mini is a compact two-horn unit sized for clusters of soccer or baseball fields, often deployed near busy roads where ambient noise would drown out a smaller siren. The Micro is built for spaces like pool decks, outdoor dining patios, and other settings where a full siren would be disruptive, with a multi-colored strobe that shows real-time status: green for all clear, amber for warning, and red for alert. The siren can even be removed entirely for quiet zones.',
        'All units are solar-powered with cellular connectivity, so each one operates as a standalone command center for the property. Shield replaces the archaic "30 minute rule" with dynamic, data-backed alerts grounded in 99.6% accurate lightning prediction. Safety happens before the storm, not in reaction to it.',
      ],
      image: {
        src: `${IMG}/flash-weather-shield/flash-weather-shield-golf-course-siren.png`,
        alt: 'The full Flash Shield: a pole-mounted siren with four horns, a control box and a solar panel on a golf course at sunrise',
        caption: 'The full Flash Shield, with four horns standard, on a golf course',
      },
    },
    features: {
      heading: 'How is the Shield different from a detection siren?',
      items: [
        { title: 'Different options', body: 'Three models: Shield, Mini, Micro' },
        { title: 'Predictive alerts', body: 'Predictive sirens, not reactive ones' },
        { title: 'Multiple alert methods', body: 'Audio plus visual alerts via strobe and horn' },
        { title: 'Customizable', body: 'Cellular, solar, fully customizable' },
      ],
    },
    related: ['flash-lightning-suite', 'weather-command-center', 'flash-mobile-app'],
    industries: ['golf', 'parks-rec', 'outdoor-sports', 'schools', 'events-venues'],
  },
  {
    slug: 'flash-edge-model',
    name: 'Flash Edge Model',
    title: 'Probabilistic weather forecast model',
    description:
      'Best, most likely and worst case for 100+ parameters, each with a 0 to 100 confidence score, so operations leaders plan for the range, not a coin flip.',
    eyebrow: 'Forecasting · proprietary · 100+ parameters',
    lead: 'Best, most likely and worst case for over 100 parameters, so you plan for the range, not a single line.',
    schema: { type: 'product' },
    secondaryCta: { label: 'Explore the API', href: productPaths.api },
    heroImage: {
      src: `${IMG}/flash-edge-model-product.png`,
      alt: 'Three Flash Edge Model forecast maps of the continental U.S. for temperature, moisture and fire risk from one model run',
    },
    overview: {
      heading: 'What is the Flash Edge Model?',
      paragraphs: [
        "The Flash Edge Model is Flash's proprietary forecasting engine, built to replace the public NWS feeds that most weather companies repackage and resell. Instead of one number that is wrong half the time, the Edge Model gives you a full range of outcomes for every weather parameter: best case, most likely, and worst case. Each variable comes with a 0 to 100 confidence score, so teams know when to trust the forecast and when to hedge.",
        'The model covers an hourly, 7-day, and 10-day horizon out of the same stack, with over 100 different parameters available via API, ranging from the basics like temperature, humidity, and precipitation to industry-specific indices like wet bulb globe temperature, the Concrete Pourability Index, the Golf Playability Index, and proprietary frost prediction.',
        'In a planning scenario, that means a 5-day snow forecast is not "50% chance of 6 inches" but "best case 4.5 inches, most likely 6 inches, worst case 7.5 inches, 85/100 confidence." Operations leaders make different calls with that information than they do with a coin-flip percentage.',
        'The Edge Model is the engine behind the Weather Command Center, the mobile app, and every API integration Flash offers. It is not a borrowed model with a wrapper. It is a forecast built from the ground up to drive decisions.',
      ],
      image: {
        src: `${IMG}/flash-edge-model/flash-edge-model-best-worst-case-confidence-forecast.png`,
        alt: 'A Flash Edge Model snow forecast showing best case, most likely and worst case accumulation with a confidence score, beside competitors’ single chance-of-snow figures',
        caption: 'Same forecast, more certainty: best, most likely and worst case with a confidence score',
      },
    },
    features: {
      heading: 'What does the Edge Model forecast?',
      items: [
        { title: 'Forecasting', body: 'Proprietary forecast, not borrowed from the NWS' },
        { title: 'Confidence results', body: 'Best, most likely, and worst case for every parameter' },
        { title: 'Confidence scoring', body: '0 to 100 confidence score on every variable' },
        { title: 'Multiple parameters', body: '100+ parameters across hourly, 7-day, and 10-day horizons' },
      ],
    },
    related: ['flash-api', 'weather-command-center', 'agronomy-suite'],
    industries: ['construction', 'concrete', 'utilities', 'municipalities', 'agriculture'],
  },
  {
    slug: 'agronomy-suite',
    name: 'Agronomy Suite',
    title: 'Turf agronomy forecasts for golf',
    description:
      'Frost, heat, wind and storm forecasts on a 1x1 km grid, with 20+ site-specific metrics and one playability score, so superintendents plan crews by the hour.',
    eyebrow: 'Turf and crops · superintendents and agronomists',
    lead: 'Site-specific turf and crop metrics, proprietary frost forecasts and the Golf Playability index.',
    schema: { type: 'software', operatingSystem: 'Web, iOS, Android' },
    secondaryCta: { label: 'See pricing', href: '/pricing/' },
    heroImage: {
      src: `${IMG}/flash-agronomy-suite-product.png`,
      alt: 'The Flash app showing a Golf Playability map over a course, beside a ball at the edge of the cup',
    },
    overview: {
      heading: 'What is the Agronomy Suite?',
      paragraphs: [
        "The Agronomy Suite turns Flash's prediction engine into turf decisions. Flash's one stop shop agronomy platform pairs 1x1 km, minute-level forecasting with turf-specific indices so superintendents and agronomists can protect playing surfaces and plan the crew with confidence.",
        "Track heat, wind, frost, and storm threats to the course, know when frost will lift before you set tee times, and read a single playability score instead of juggling a dozen variables. By using the same prediction machine that powers all of Flash, you can act on what's coming instead of reacting to what already happened.",
      ],
      image: {
        src: `${IMG}/agronomy-suite/flash-agronomy-suite-precipitation-forecast-dashboard.png`,
        alt: 'The Agronomy Suite precipitation forecast dashboard with most likely, high-end and low-end weekly totals, above the line "Built for sunrise decisions"',
        caption: 'The weekly precipitation forecast, with most likely, high-end and low-end totals',
      },
    },
    features: {
      heading: 'What does the Agronomy Suite track?',
      items: [
        { title: '20+ Site Specific Metrics', body: 'No data from an airport 10 miles away' },
        {
          title: 'Proprietary Frost Forecasts',
          body: 'Know when frost will burn so you can open tee times on schedule, not on a guess.',
        },
        {
          title: 'Golf Playability Index',
          body: 'One clear score for course conditions to guide play, cart traffic, and set tee time prices.',
        },
        { title: 'Plan The Crew', body: 'Schedule mowing, spraying, and irrigation around the forecast, down to the hour.' },
      ],
    },
    related: ['flash-edge-model', 'flash-mobile-app', 'flash-lightning-suite', 'weather-command-center'],
    industries: ['golf', 'turf-agronomy', 'agriculture'],
  },
  {
    slug: 'consulting-meteorology',
    name: 'Consulting Meteorology',
    title: 'Consulting meteorologists on call',
    description:
      "Real meteorologists behind Flash's prediction engine: custom briefings, go/no-go decision support and post-event analysis for your highest-stakes days.",
    eyebrow: 'Services · a meteorologist in the loop',
    lead: 'Real meteorologists for your biggest days: expert forecasting, briefings and live decision support.',
    schema: { type: 'product' },
    secondaryCta: { label: 'Contact us', href: '/contact/' },
    heroImage: {
      src: `${IMG}/flash-consulting-meteorology-product.png`,
      alt: 'A Flash meteorologist delivering a briefing in front of forecast maps',
    },
    overview: {
      heading: 'What is Flash consulting meteorology?',
      paragraphs: [
        'Flash pairs its prediction engine with real meteorologists. When the stakes are high and you want a human in the loop, our team delivers expert forecasting, custom briefings, and live decision support built around your operation.',
        'It is the AI that powers the rest of Flash, backed by people who read the sky for a living. Your biggest days need a forecaster, not just a feed.',
      ],
      image: {
        src: `${IMG}/consulting-meteorology/flash-consulting-meteorology-tournament-playability-report.png`,
        alt: 'A Flash consulting briefing for a four-round golf tournament: playability scores, the primary weather concern and impact level for each day, then daily detailed forecasts',
        caption: 'A tournament briefing: playability outlook by round, then the daily detailed forecast',
      },
    },
    features: {
      heading: 'What does a Flash meteorologist do for you?',
      items: [
        { title: 'On-call event support', body: 'A meteorologist on the line for your highest-stakes days and events.' },
        { title: 'Custom briefings', body: 'Forecasts tailored to your site, sport, or operation, in plain language.' },
        { title: 'Decision support', body: 'Go/no-go guidance backed by a person, not just a model.' },
        { title: 'Expert analysis', body: 'Post-event and historical weather analysis when you need answers.' },
      ],
    },
    related: ['weather-command-center', 'flash-edge-model', 'flash-lightning-suite'],
    industries: ['events-venues', 'golf', 'outdoor-sports'],
  },
];

export function getProductPage(slug: string): ProductPage | undefined {
  return productPages.find((page) => page.slug === slug);
}

export function productPagePath(slug: string): string {
  return `${productPaths.index}${slug}/`;
}
