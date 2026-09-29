import { industriesForIndex, industryPath } from './industries';

/** One industry as the hub hero's cycle card shows it. */
export type CycleIndustry = {
  slug: string;
  name: string;
  /** The one line the index card below shows for it. */
  line: string;
  href: string;
  image: string;
};

/**
 * Photos for the verticals that have no `card.image` yet. A card image, once
 * one is added in industries.ts, takes over. Municipalities, Parks & Recreation
 * and Utilities are stand-ins from elsewhere on the site, awaiting approval:
 * nothing on the site shows a city crew, a park or a power line.
 */
const STAND_INS: Record<string, string> = {
  concrete: '/images/industries/flash-construction-wet-concrete-deck-clearing-sky.png',
  'events-venues': '/images/industries/flash-schools-championship-stadium-bowl-dusk-storm.png',
  'outdoor-sports': '/images/industries/flash-schools-empty-infield-rolled-tarp-floodlights.png',
  'turf-agronomy': '/images/industries/flash-agriculture-dew-leaf-wetness-close-cut-turf.png',
  municipalities: '/images/why-flash/flash-on-site-warning-siren-open-field.jpg',
  'parks-rec': '/images/products/flash-clearing-sky-empty-field-all-clear.png',
  utilities: '/images/products/flash-open-plain-layered-storms-coverage-card.png',
};

const LAST_RESORT = '/images/products/flash-storm-cell-open-ground-platform-hero.png';

/** Every vertical in the index's order, with the index card's own line. */
export function industryCycle(): CycleIndustry[] {
  return industriesForIndex().map((industry) => ({
    slug: industry.slug,
    name: industry.name,
    line: industry.card?.summary ?? industry.headline,
    href: industryPath(industry.slug),
    image: industry.card?.image?.src ?? STAND_INS[industry.slug] ?? LAST_RESORT,
  }));
}
