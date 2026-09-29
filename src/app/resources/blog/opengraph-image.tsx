import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/seo/og';
import { site } from '@/lib/seo/site';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage({
    eyebrow: `${site.name} Blog`,
    headline: 'Weather decisions, explained for the people who make them.',
    footer: 'Lightning · Heat and WBGT · Hail · Accuracy — flashweather.ai',
  });
}
