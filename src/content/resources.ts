/**
 * The resources hub at /resources/, as data.
 *
 * The live page is a bare list ("Browse Our Resources: YouTube Videos, Blog
 * Posts, FAQs"); this is the same set of destinations, plus the others the
 * rebuilt site has, each with one line on what is there. Every internal href
 * is a built route; the external ones come from `site`.
 */

import { heatPolicies } from '@/content/heat-policies';
import { site } from '@/lib/seo/site';

export const RESOURCES_PATH = '/resources/';

export const resourcesPage = {
  title: 'Resources: blog, FAQ and heat policies',
  description:
    'Lightning and hail safety guides, state heat policies, FAQs and video from Flash meteorologists, for the people who clear fields and job sites before a storm.',
  /** The live page's heading, kept as the H1. */
  headline: 'Browse our resources',
  intro:
    'Articles from Flash meteorologists, answers to the questions buyers ask first, state heat-policy guides, press coverage and video. Everything here is free to read and share.',
};

export type ResourceCard = {
  /** The small label above the title. */
  kind: string;
  /** The card's <h3>, and its ItemList name. */
  title: string;
  body: string;
  href: string;
  /** The link's visible call to action. */
  cta: string;
  /** Leaves the site; opens with rel="noopener". */
  external?: boolean;
};

const [firstHeatPolicy] = heatPolicies;

export const resourceCards: ResourceCard[] = [
  {
    kind: 'Articles',
    title: 'Blog',
    body: 'Lightning clearance, WBGT heat planning, hail readiness and accuracy, written for the person who has to make the call.',
    href: '/resources/blog/',
    cta: 'Read the blog',
  },
  {
    kind: 'Answers',
    title: 'Frequently asked questions',
    body: 'Whether prediction is real, whether you still need sensors, WBGT forecasts, alert policies and the audit file.',
    href: '/resources/frequently-asked-questions/',
    cta: 'Read the FAQ',
  },
  ...(firstHeatPolicy
    ? [
        {
          kind: 'Guides',
          title: 'State heat policies',
          body: `The WBGT thresholds, practice limits and paperwork each state association sets, starting with ${firstHeatPolicy.state} (${firstHeatPolicy.association}).`,
          href: `/resources/state-heat-policies/${firstHeatPolicy.slug}/`,
          cta: `Read the ${firstHeatPolicy.state} guide`,
        },
      ]
    : []),
  {
    kind: 'Newsroom',
    title: 'Press & partners',
    body: 'Coverage of Flash, the organizations that run on it, and the press kit.',
    href: '/press-and-partners/',
    cta: 'See press & partners',
  },
  {
    kind: 'Video',
    title: 'YouTube',
    body: 'Videos from the Flash Weather AI channel, for when you would rather watch than read.',
    href: site.social.youtube,
    cta: 'Watch on YouTube',
    external: true,
  },
  {
    kind: 'Mobile app',
    title: 'Download the free app',
    body: 'Lightning prediction for your exact location on your phone, with an alert before the first strike and another when it is safe again.',
    href: site.appDownloadUrl,
    cta: 'Download the free app',
    external: true,
  },
];
