import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/seo/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Reactive detection. We’re proactive.';

export default async function Image() {
  return ogImage({ eyebrow: 'Why Flash · Everyone else vs Flash', headline: 'Reactive detection. We’re proactive.', footer: 'flashweather.ai' });
}
