import { hero, lightningPage } from '@/components/products/lightning/content';
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/seo/og';
import { site } from '@/lib/seo/site';

export const alt = `${site.name} · ${lightningPage.name}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage({
    eyebrow: `${site.name} · ${lightningPage.name}`,
    headline: hero.heading,
    footer: 'flashweather.ai',
  });
}
