import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/seo/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'AI lightning prediction vs sensors vs detection networks';

export default async function Image() {
  return ogImage({ eyebrow: 'Why Flash · Explainer', headline: 'AI lightning prediction vs sensors vs detection networks', footer: 'flashweather.ai' });
}
