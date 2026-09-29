import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/seo/og';
import { site } from '@/lib/seo/site';

export const alt = `${site.name}: WBGT and heat forecasts six hours ahead`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const eyebrow = `${site.name} · Heat and WBGT`;
  return ogImage({
    eyebrow,
    headline: 'WBGT and heat forecasts six hours ahead, planned beside your sensor',
    footer: 'flashweather.ai/products/heat-wbgt',
  });
}
