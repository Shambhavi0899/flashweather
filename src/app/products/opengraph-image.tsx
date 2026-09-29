import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/seo/og';
import { site } from '@/lib/seo/site';

export const alt = 'The Flash platform: predictions, delivery, intelligence.';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const eyebrow = `${site.name} · Platform`;
  return ogImage({
    eyebrow,
    headline: 'The Flash platform: predictions, delivery, intelligence.',
    footer: 'flashweather.ai',
  });
}
