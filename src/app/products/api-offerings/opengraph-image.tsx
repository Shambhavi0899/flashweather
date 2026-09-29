import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/seo/og';
import { site } from '@/lib/seo/site';

export const alt = `${site.name} — Flash API`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage({
    eyebrow: `${site.name} — Flash API`,
    headline: 'The weather API that fires before the weather arrives.',
    footer: '100+ parameters per 1 km cell · webhooks · flashweather.ai',
  });
}
