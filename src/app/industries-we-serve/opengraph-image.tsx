import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/seo/og';
import { site } from '@/lib/seo/site';

export const alt = `${site.name} — Industries`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage({
    eyebrow: `${site.name} — Industries`,
    headline: 'Thirteen industries, one hour of warning',
    footer: 'flashweather.ai',
  });
}
