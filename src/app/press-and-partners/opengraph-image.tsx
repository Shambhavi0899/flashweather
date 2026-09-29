import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/seo/og';
import { site } from '@/lib/seo/site';

export const alt = `${site.name} press coverage, press kit and partners`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage({
    eyebrow: `${site.name} · Press & partners`,
    headline: 'Coverage, partners, and what each partner actually does with Flash',
    footer: 'flashweather.ai/press-and-partners',
  });
}
