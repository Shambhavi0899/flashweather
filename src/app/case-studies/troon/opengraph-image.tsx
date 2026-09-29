import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/seo/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Troon runs Flash Lightning Prediction across its golf portfolio';

export default async function Image() {
  return ogImage({ eyebrow: 'Case study · Golf · Troon', headline: 'Troon runs Flash Lightning Prediction across its golf portfolio', footer: 'flashweather.ai' });
}
