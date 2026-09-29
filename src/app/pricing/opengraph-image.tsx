import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/seo/og';
import { site } from '@/lib/seo/site';

export const alt =
  'Flash Weather AI pricing: software-only lightning and hail prediction priced per site, with no sensors to install';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const eyebrow = `${site.name} · Pricing`;
  return ogImage({
    eyebrow,
    headline: 'Pricing that scales by sites, not by sensors.',
    footer: 'flashweather.ai',
  });
}
