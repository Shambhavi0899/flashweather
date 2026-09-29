/**
 * The global nav and footer, as data.
 *
 * Every href here is a real, built route -- the audit this redesign answers
 * found dead /features and /pricing links, so nothing points at a page that
 * does not exist. Paths are the live site's, so existing rankings carry over.
 */

export type NavLink = { label: string; href: string };
export type NavGroup = { label: string; href: string; links: NavLink[] };

export const primaryNav: NavGroup[] = [
  {
    label: 'Platform',
    href: '/products/',
    links: [
      { label: 'All products', href: '/products/' },
      { label: 'Lightning Prediction', href: '/products/lightning-prediction/' },
      { label: 'Hail Prediction', href: '/products/hail-prediction/' },
      { label: 'Heat and WBGT', href: '/products/heat-wbgt/' },
      { label: 'Weather Command Center', href: '/products/weather-command-center/' },
      { label: 'Mobile App', href: '/products/mobile-app/' },
      { label: 'Flash Agent', href: '/products/flash-agent/' },
      { label: 'Flash API', href: '/products/api-offerings/' },
    ],
  },
  {
    label: 'Industries',
    href: '/industries-we-serve/',
    links: [
      { label: 'Schools & Athletics', href: '/industries-we-serve/schools/' },
      { label: 'Construction', href: '/industries-we-serve/construction/' },
      { label: 'Roofing', href: '/industries-we-serve/roofing/' },
      { label: 'Golf', href: '/industries-we-serve/golf/' },
      { label: 'Agriculture', href: '/industries-we-serve/agriculture/' },
      { label: 'All industries', href: '/industries-we-serve/' },
    ],
  },
  {
    label: 'Why Flash',
    href: '/why-flash/',
    links: [
      { label: 'The Flash difference', href: '/why-flash/' },
      { label: 'Everyone else vs Flash', href: '/why-flash/everyone-else-vs-flash/' },
      { label: 'Prediction vs sensors vs detection', href: '/why-flash/prediction-vs-sensors-vs-detection/' },
      { label: 'Accuracy method', href: '/why-flash/accuracy-method/' },
      { label: 'Case study: Troon', href: '/case-studies/troon/' },
    ],
  },
  { label: 'Pricing', href: '/pricing/', links: [] },
  {
    label: 'Resources',
    href: '/resources/',
    links: [
      { label: 'All resources', href: '/resources/' },
      { label: 'Blog', href: '/resources/blog/' },
      { label: 'State heat policies', href: '/resources/state-heat-policies/georgia/' },
      { label: 'FAQ', href: '/resources/frequently-asked-questions/' },
    ],
  },
  {
    label: 'Company',
    href: '/about-us/',
    links: [
      { label: 'About', href: '/about-us/' },
      { label: 'Press & partners', href: '/press-and-partners/' },
      { label: 'Contact', href: '/contact/' },
    ],
  },
];

export const footerNav: NavGroup[] = [
  {
    label: 'Products',
    href: '/products/',
    links: [
      { label: 'Lightning Prediction', href: '/products/lightning-prediction/' },
      { label: 'Hail Prediction', href: '/products/hail-prediction/' },
      { label: 'Weather Command Center', href: '/products/weather-command-center/' },
      { label: 'Flash Edge Model', href: '/products/flash-edge-model/' },
      { label: 'Agronomy Suite', href: '/products/agronomy-suite/' },
      { label: 'Flash API', href: '/products/api-offerings/' },
    ],
  },
  {
    label: 'Industries',
    href: '/industries-we-serve/',
    links: [
      { label: 'Schools & Athletics', href: '/industries-we-serve/schools/' },
      { label: 'Construction', href: '/industries-we-serve/construction/' },
      { label: 'Roofing', href: '/industries-we-serve/roofing/' },
      { label: 'Golf', href: '/industries-we-serve/golf/' },
      { label: 'Agriculture', href: '/industries-we-serve/agriculture/' },
      { label: 'All industries', href: '/industries-we-serve/' },
    ],
  },
  {
    label: 'Why Flash',
    href: '/why-flash/',
    links: [
      { label: 'The Flash difference', href: '/why-flash/' },
      { label: 'Accuracy method', href: '/why-flash/accuracy-method/' },
      { label: 'Prediction vs sensors vs detection', href: '/why-flash/prediction-vs-sensors-vs-detection/' },
      { label: 'Everyone else vs Flash', href: '/why-flash/everyone-else-vs-flash/' },
      { label: 'Case studies', href: '/case-studies/troon/' },
      { label: 'Pricing', href: '/pricing/' },
    ],
  },
  {
    label: 'Resources',
    href: '/resources/',
    links: [
      { label: 'Blog', href: '/resources/blog/' },
      { label: 'State heat policies', href: '/resources/state-heat-policies/georgia/' },
      { label: 'FAQ', href: '/resources/frequently-asked-questions/' },
      { label: 'About us', href: '/about-us/' },
      { label: 'Press & partners', href: '/press-and-partners/' },
      { label: 'Contact', href: '/contact/' },
    ],
  },
];

/** The footer's bottom row. Live-site URLs, unchanged. */
export const legalNav: NavLink[] = [
  { label: 'Privacy Policy', href: '/privacy-policy/' },
  { label: 'Legal information', href: '/flash-weather-ai-legal-information/' },
];

/** Where every "Book a demo" button goes. */
export const DEMO_HREF = '/contact/';
