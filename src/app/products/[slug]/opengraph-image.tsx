import { getProductPage, productPages } from '@/content/product-pages';
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/seo/og';
import { site } from '@/lib/seo/site';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return productPages.map((page) => ({ slug: page.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getProductPage(slug);
  const eyebrow = `${site.name} · ${page?.name ?? 'Products'}`;
  const headline = page?.lead ?? site.title;

  return ogImage({ eyebrow, headline, footer: 'flashweather.ai' });
}
