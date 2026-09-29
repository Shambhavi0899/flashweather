import { getPost, posts } from '@/content/blog';
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/seo/og';
import { site } from '@/lib/seo/site';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);

  return ogImage({
    eyebrow: `${site.name} Blog · ${post?.category ?? 'Articles'}`,
    headline: post?.shortHeadline ?? post?.headline ?? 'Weather decisions, explained for the people who make them.',
    footer: 'flashweather.ai',
  });
}
