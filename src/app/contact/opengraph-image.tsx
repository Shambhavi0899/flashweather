import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/seo/og';
import { site } from '@/lib/seo/site';

export const alt =
  'Book a Flash Weather AI demo with your own sites loaded on the lightning prediction map before the call';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const eyebrow = `${site.name} · Book a demo`;
  return ogImage({
    eyebrow,
    headline: 'Book a demo. We load your sites before the call.',
    footer: 'flashweather.ai',
  });
}
