import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/seo/og';
import { site } from '@/lib/seo/site';

export const alt = 'About Flash Weather AI: built by meteorologists who used to issue the warnings';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const eyebrow = `${site.name} · About`;
  return ogImage({
    eyebrow,
    headline: 'Built by meteorologists who used to issue the warnings.',
    footer: 'flashweather.ai',
  });
}
