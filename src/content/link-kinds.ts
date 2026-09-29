/**
 * What kind of page a link leads to, read from where it points: the tag on a
 * "Keep reading" card. Anything that is not a product, a policy or a customer
 * story is a guide.
 */
export type LinkKind = 'Guide' | 'Case study' | 'Policy' | 'Product';

const kinds: [prefix: string, kind: LinkKind][] = [
  ['/case-studies/', 'Case study'],
  ['/resources/state-heat-policies/', 'Policy'],
  ['/products/', 'Product'],
  ['/pricing/', 'Product'],
];

export function linkKind(href: string): LinkKind {
  return kinds.find(([prefix]) => href.startsWith(prefix))?.[1] ?? 'Guide';
}
