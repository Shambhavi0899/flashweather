import { getHeatPolicy } from '@/content/heat-policies';

import { georgiaPolicy, siblingPolicies } from './content';

export type PolicyState = {
  slug: string;
  name: string;
  association: string;
  /** The state's policy page; only where one is published, so nothing links to a route that does not exist. */
  href?: string;
};

/**
 * Georgia and its sibling states, from the "Name · ASSOCIATION" labels in
 * content.ts. Runs on the server: a sibling links to its page as soon as
 * content/heat-policies.ts publishes one.
 */
export function policyStates(): PolicyState[] {
  return [georgiaPolicy.name, ...siblingPolicies].map((label) => {
    const [name, association] = label.split(' · ');
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const href = slug === 'georgia' ? georgiaPolicy.href : getHeatPolicy(slug) && `/resources/state-heat-policies/${slug}/`;
    return { slug, name, association, href: href || undefined };
  });
}

/** GHSA's bands from the policy summary ("82: three 4-minute breaks per hour · 87: …"), verbatim. */
export function georgiaBands() {
  return georgiaPolicy.summary.split(' · ').map((band) => {
    const [temp, rule] = band.split(': ');
    return { temp, rule };
  });
}
