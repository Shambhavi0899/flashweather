import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/seo/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'How Flash measures 99.6% lightning-prediction accuracy';

export default async function Image() {
  return ogImage({ eyebrow: 'Why Flash · Accuracy method', headline: 'How Flash measures 99.6% lightning-prediction accuracy', footer: 'flashweather.ai' });
}
