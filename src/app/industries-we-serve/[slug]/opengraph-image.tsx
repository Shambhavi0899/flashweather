import { getIndustry, industries } from '@/content/industries';
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/seo/og';
import { site } from '@/lib/seo/site';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }));
}

/** Past this many characters a headline no longer fits the card at 68px; the title does. */
const MAX_HEADLINE = 90;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  const eyebrow = `${site.name} — ${industry?.name ?? 'Industries'}`;
  const headline = !industry
    ? site.title
    : industry.headline.length <= MAX_HEADLINE
      ? industry.headline
      : industry.title;

  return ogImage({ eyebrow, headline, footer: 'flashweather.ai' });
}
