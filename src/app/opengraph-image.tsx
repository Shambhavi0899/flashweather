import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/seo/og';
import { site } from '@/lib/seo/site';

export const alt =
  'Flash Weather AI: lightning, hail, heat, wind, rain and frost predicted on a 1 km grid, refreshed every 2 minutes, with an agent that acts in your tools';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage({
    eyebrow: site.name,
    headline: 'Make the call before the weather does.',
    footer: '99.6% lightning accuracy · 55 min hail lead time · 1km resolution',
  });
}
