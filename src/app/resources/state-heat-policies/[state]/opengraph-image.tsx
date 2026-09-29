import { getHeatPolicy, heatPolicies } from '@/content/heat-policies';
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/seo/og';
import { site } from '@/lib/seo/site';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return heatPolicies.map((policy) => ({ state: policy.slug }));
}

export default async function Image({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  const policy = getHeatPolicy(state);
  const eyebrow = policy ? `${site.name} · ${policy.state} heat policy` : site.name;

  return ogImage({
    eyebrow,
    headline: policy?.shortHeadline ?? 'State heat policies',
    footer: 'flashweather.ai',
  });
}
