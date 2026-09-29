/**
 * Press & Partners at /press-and-partners/, as data.
 *
 * Coverage, the self-hosted press kit, partners and testimonials. Names,
 * coverage and quotes are verbatim from the approved design.
 *
 * Links: the audit found the old partners page sent visitors away to partner
 * homepages. Each partner row here links to the Flash page that explains the
 * work instead. External links only where the design gives a real URL; the
 * trade coverage names its publication but no article URL, so it is text.
 *
 * The press kit is real files under /public/press/ -- nothing points at a
 * staging server, and nothing points at a /press/... route that does not exist.
 */

import { productPaths } from '@/content/products';
import { site } from '@/lib/seo/site';

export const PRESS_PATH = '/press-and-partners/';

/** Every downloadable in the kit, served from our own domain. */
export const pressFiles = {
  kitZip: '/press/flash-weather-ai-press-kit.zip',
  boilerplate: '/press/flash-weather-ai-boilerplate.txt',
  factSheet: '/press/flash-weather-ai-fact-sheet.txt',
  founderBio: '/press/flash-weather-ai-founder-bio.txt',
} as const;

export type Coverage = {
  outlet: string;
  beat: string;
  headline: string;
  summary: string;
  /** The publication's domain, as the design prints it. Rendered as text: no article URL is known. */
  domain: string;
  image: { src: string; alt: string; caption: string; fit: 'cover' | 'contain' };
};

export const coverage: Coverage[] = [
  {
    outlet: 'Carrier Management',
    beat: 'Insurance trade',
    headline: 'FlashHail launches: hail predicted up to 55 minutes before it reaches a site',
    summary:
      "Carrier Management covered the launch of FlashHail, Flash Weather AI's hail-prediction engine, for its carrier and adjuster readership: hail size, timing and swath up to 55 minutes before the first stone falls, refreshed every five minutes, delivered by API and webhook so claims teams can position adjusters before a hail cell arrives.",
    domain: 'carriermanagement.com',
    image: {
      src: '/images/press/flash-weather-predictive-hail-swath-product.png',
      alt: "Flash's Predictive Hail product showing a hail swath and its size classes on the 1km × 1km grid, illustrating the Carrier Management coverage of the FlashHail launch",
      caption: 'Predictive Hail: size class, timing and swath on the 1km × 1km grid. Product imagery.',
      fit: 'cover',
    },
  },
  {
    outlet: 'Automotive Fleet',
    beat: 'Fleet trade',
    headline: 'Hail forecasts for fleet staging: move vehicles before the cell, not after',
    summary:
      "Automotive Fleet reported on FlashHail for fleet managers: 1km × 1km hail predictions let dealers, rental yards and service fleets move exposed vehicles under cover up to 55 minutes before hail is forecast to reach the lot, with the alert routed to the yard supervisor's phone.",
    domain: 'automotive-fleet.com',
    image: {
      src: '/images/press/flash-weather-mobile-app-hail-alert-screens.png',
      alt: 'Four Flash mobile app screens showing lightning probability, future radar, live radar and the seven-day forecast, illustrating the Automotive Fleet coverage of hail alerts for yard staging',
      caption: 'The Flash mobile app: the hail alert that reaches the yard supervisor. Product imagery.',
      fit: 'cover',
    },
  },
];

/** The "Also" line under the coverage. `href` only where a real URL exists. */
export const otherMentions: { text: string; href?: string }[] = [
  { text: 'Podcast appearance · founder interview on prediction vs detection' },
  { text: 'LinkedIn · Flash Weather AI company page updates', href: site.social.linkedin },
  { text: 'Flash blog · FlashHail launch note' },
];

export const heroStats = [
  { value: '99.6%', label: 'Lightning prediction accuracy on the one-hour window' },
  { value: '55 min', label: 'Hail lead time before the first stone falls' },
  { value: '15+', label: 'Proprietary prediction products, all on one platform' },
];

export const logoFiles = [
  { label: 'flash-weather-ai-logo.svg', href: '/press/logos/flash-weather-ai-logo.svg' },
  { label: 'flash-weather-ai-logo.png', href: '/press/logos/flash-weather-ai-logo.png' },
  { label: 'flash-weather-ai-bolt-mark.svg', href: '/press/logos/flash-weather-ai-bolt-mark.svg' },
];

/** "Reversed and mono versions of each" -- listed so each is a real file. */
export const logoVariants = [
  { label: 'Reversed · SVG', href: '/press/logos/flash-weather-ai-logo-reversed.svg' },
  { label: 'Reversed · PNG', href: '/press/logos/flash-weather-ai-logo-reversed.png' },
  { label: 'Mono · SVG', href: '/press/logos/flash-weather-ai-logo-mono.svg' },
  { label: 'Mono reversed · SVG', href: '/press/logos/flash-weather-ai-logo-mono-reversed.svg' },
  { label: 'Bolt mono · SVG', href: '/press/logos/flash-weather-ai-bolt-mark-mono.svg' },
  { label: 'Bolt mono reversed · SVG', href: '/press/logos/flash-weather-ai-bolt-mark-mono-reversed.svg' },
];

export const boilerplate = {
  text: 'Flash Weather AI (Flash Scientific Technology Inc., Canton, Georgia) builds AI weather intelligence — 15+ proprietary prediction products and over 100 parameters on a 1km × 1km grid, refreshed every 2 minutes, delivered through its Command Center, mobile app, API and Flash Agent.',
  note: 'Use verbatim. Lightning prediction accuracy of 99.6% on the one-hour window may be quoted with that qualifier.',
};

export const founderBio =
  'Jason Deese, founder and chief meteorologist. A former NOAA National Weather Service forecaster, he founded Flash Scientific Technology Inc., headquartered in Canton, Georgia, in the Atlanta metro.';

export const factSheet = [
  '99.6% lightning prediction accuracy on the one-hour window',
  'Up to 60 min lightning · up to 55 min hail · 1km × 1km grid · refreshed every 2 minutes',
  '15+ prediction products · over 100 parameters · forecasts out to 180 hours',
  'Customers and partners include Troon, the Big 12 Conference, Syngenta and the NAIA',
];

export const productImagery = [
  {
    title: 'Weather Command Center',
    file: 'flash-weather-command-center.png',
    alt: 'Print-resolution press-kit image of the Flash Weather Command Center map on a laptop',
    fit: 'cover' as const,
  },
  {
    title: 'Laptop and mobile app',
    file: 'flash-weather-devices-laptop-phone.png',
    alt: 'Print-resolution press-kit image of Flash on a laptop beside the mobile app',
    fit: 'contain' as const,
  },
  {
    title: 'Flash Weather Shield',
    file: 'flash-weather-shield-on-site.png',
    alt: 'Print-resolution press-kit image of a Flash Weather Shield siren mounted on site',
    fit: 'cover' as const,
  },
].map((item) => ({ ...item, href: `/press/imagery/${item.file}` }));

export type Partner = {
  name: string;
  work: string;
  /** The Flash page that explains the work. Internal, always. */
  link: { label: string; href: string };
};

export const partners: Partner[] = [
  {
    name: 'Troon',
    work: "Runs Flash lightning prediction across its managed golf properties so superintendents and golf-shop staff get the same alert at the same time. The case study shows how a season's alert log was used.",
    link: { label: 'Case study · Troon', href: '/case-studies/troon/' },
  },
  {
    name: 'Big 12 Conference',
    work: 'Uses Flash for venue-level lightning decisions on game day, with alerts routed to athletic trainers and event operations. Member schools apply the same policy thresholds to practice fields.',
    link: { label: 'Schools & Athletics', href: '/industries-we-serve/schools/' },
  },
  {
    name: 'Syngenta',
    work: 'Embeds Flash agronomy forecasts inside Turf Assistant, its turf-management platform: frost, evapotranspiration, disease pressure and growing-degree days for each course. Superintendents see the forecast next to their spray and irrigation plans.',
    link: { label: 'Agriculture', href: '/industries-we-serve/agriculture/' },
  },
  {
    name: 'NAIA',
    work: 'Names Flash its official weather-safety partner. Championship hosts run venue predictions and the return-to-play timer through the event, with the meteorology desk on call for the weekend.',
    link: { label: 'Schools & Athletics', href: '/industries-we-serve/schools/' },
  },
  {
    name: 'McClatchy Media',
    work: 'Publishes Flash-powered weather content across its local news titles. Readers get the same lightning and hail outlooks that Flash customers see for their sites.',
    link: { label: 'Products', href: productPaths.index },
  },
  {
    name: 'Golf Genius',
    work: 'Integrates Flash lightning alerts into its tournament-management software, so committees see the prediction next to the tee sheet. Suspension and resumption decisions are logged with the round.',
    link: { label: 'Golf', href: '/industries-we-serve/golf/' },
  },
  {
    name: "Annika Women's All Pro Tour",
    work: 'Runs event-day forecasting with Flash: a written outlook the day before each round and live strike prediction on site. Tournament staff receive the alert before the first group is called in.',
    link: { label: 'Golf', href: '/industries-we-serve/golf/' },
  },
  {
    name: 'Turf Assistant',
    work: 'Distributes the Flash Agronomy Suite to its superintendent customers as part of the Turf Assistant subscription. The Turf Threat Tracker acquisition brought the two products together.',
    link: { label: 'Agronomy Suite', href: productPaths.agronomy },
  },
];

export type Testimonial = { quote: string; name: string; role: string };

/**
 * Reinstated from the pre-migration flashweather.ai/about/ page. The design
 * notes True North Golf Club's wording is pending re-confirmation with the
 * club before publish.
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      "Flash AI has transformed how we handle weather disruptions. It's accurate, reliable, and essential for any club that values foresight and safety. With Flash AI, my team can be proactive instead of reactive.",
    name: 'Ryan Coll',
    role: 'Director of Golf · Columbus Country Club',
  },
  {
    quote:
      'A game-changer — accurate, reliable, and essential for making informed decisions that keep our members safe and maintain seamless operations.',
    name: 'Chris Roselle',
    role: 'Tournament Director · Golf Association of Philadelphia',
  },
  {
    quote:
      "Flash Weather AI's real-time, highly accurate data and 'All Clear' feature have streamlined our operations, maximizing operating time and guest satisfaction.",
    name: 'Chris Wahle',
    role: 'Manager · The Edge Zipline, Castle Rock, Colorado',
  },
  {
    quote:
      'Flash tells us when to clear the course before the first strike, and the all-clear lets us get players back out without guessing.',
    name: 'True North Golf Club',
    role: 'Golf operations · Harbor Springs, Michigan',
  },
];
