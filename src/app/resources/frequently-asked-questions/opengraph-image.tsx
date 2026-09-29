import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/seo/og';
import { site } from '@/lib/seo/site';

export const alt =
  'Flash Weather AI FAQ social preview listing the nine buyer objections: prediction, sensors, WBGT, meteorologist, alert policy, audit file, pricing, hail and API, and Flash Agent';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage({
    eyebrow: `${site.name} · FAQ`,
    headline: 'The questions buyers actually ask, answered straight',
    footer: 'Prediction · Sensors · WBGT · Alert policy · Audit file · Pricing · Hail and API',
  });
}
