import { whyFlashHub } from '@/content/why-flash-hub';
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/seo/og';
import { site } from '@/lib/seo/site';

export const alt = `${site.name} — Why Flash`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage({
    eyebrow: `${site.name} — Why Flash`,
    headline: whyFlashHub.ogHeadline,
    footer: 'flashweather.ai',
  });
}
