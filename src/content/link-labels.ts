/**
 * What a link says when it has no copy of its own: a readable call to action
 * for a path, never the path itself. A visitor reads "Read the Troon case
 * study", not "/case-studies/troon/", and so does a crawler, which takes a
 * link's text as a description of the page it points to.
 *
 * Pages that are linked from many places are named here, once, so every card
 * that points at one says the same thing. Anything else is named from its
 * section and its slug.
 */
const labels: Record<string, string> = {
  '/products/': 'See the whole platform',
  '/products/lightning-prediction/': 'See Lightning Prediction',
  '/products/hail-prediction/': 'See Hail Prediction',
  '/products/heat-wbgt/': 'See Heat and WBGT',
  '/products/weather-command-center/': 'See Weather Command Center',
  '/products/agronomy-suite/': 'See the Agronomy Suite',
  '/products/flash-agent/': 'See Flash Agent',
  '/products/api-offerings/': 'See the Flash API',
  '/industries-we-serve/': 'See all industries',
  '/why-flash/': 'See the Flash difference',
  '/why-flash/everyone-else-vs-flash/': 'Everyone else vs Flash',
  '/why-flash/prediction-vs-sensors-vs-detection/': 'Prediction vs detection',
  '/why-flash/accuracy-method/': 'Read the accuracy method',
  '/case-studies/troon/': 'Read the Troon case study',
  '/pricing/': 'See pricing',
  '/press-and-partners/': 'Read press & partners',
  '/resources/': 'Browse resources',
  '/resources/blog/': 'Read the blog',
  '/resources/frequently-asked-questions/': 'Read the FAQ',
  '/resources/state-heat-policies/georgia/': 'Read the Georgia heat policy',
  '/about-us/': 'About Flash',
  '/contact/': 'Book a demo',
};

/** "new-jersey" -> "New Jersey". */
function titleFromSlug(path: string) {
  const slug = path.split('/').filter(Boolean).pop() ?? '';
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/** A page that is not named above, by the section it sits in. */
const sections: [prefix: string, label: (name: string) => string][] = [
  ['/industries-we-serve/', (name) => `See Flash for ${name.toLowerCase()}`],
  ['/resources/state-heat-policies/', (name) => `Read the ${name} heat policy`],
  ['/resources/blog/', () => 'Read the article'],
  ['/case-studies/', (name) => `Read the ${name} case study`],
  ['/products/', (name) => `See ${name}`],
];

export function linkLabel(href: string) {
  const known = labels[href];
  if (known) return known;
  const name = titleFromSlug(href);
  const section = sections.find(([prefix]) => href.startsWith(prefix));
  return section ? section[1](name) : name;
}
