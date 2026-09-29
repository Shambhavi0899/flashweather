/**
 * Which Flash Agent tab each industry page opens on. Every industry page shows
 * the home page's "Ask the question your crew actually asks" section (components/home/agent-section.tsx) unchanged; the
 * only difference is the tab that is open, and plays first, when it scrolls in.
 *
 * Keys are industry slugs (content/industries.ts); values are tab ids from
 * `agentTabs` (content/home.ts). The five industries with a tab of their own
 * map to it; the others map to the closest crew.
 */

import { agentTabs } from './home';

type TabId = (typeof agentTabs)[number]['id'];

export const industryAgentTab: Record<string, TabId> = {
  construction: 'construction',
  roofing: 'roofing',
  agriculture: 'agriculture',
  golf: 'golf',
  schools: 'schools',
  // The closest crew for the rest.
  concrete: 'construction',
  utilities: 'construction',
  insurance: 'roofing',
  'turf-agronomy': 'golf',
  'outdoor-sports': 'schools',
  'parks-rec': 'schools',
  'events-venues': 'schools',
  municipalities: 'schools',
};

/** The home page's own first tab, for an industry that has no entry above. */
export const hubAgentTab: TabId = agentTabs[0].id;
