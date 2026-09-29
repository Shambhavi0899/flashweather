import type { Image, Post, Section } from '@/content/blog';

/**
 * The shape the blog templates actually rely on.
 *
 * A designed article carries everything `Post` describes: stats, a
 * comparison, an FAQ, sources, a review note. A plain news post may carry
 * only a headline, paragraphs under headings, a cover and an author. The
 * templates read every post through this looser view, so a post without the
 * extras still renders cleanly, and `Post` can relax to match without a
 * template change. Every `Post` is assignable to `PostView`.
 */
export type SectionView = Omit<Section, 'heading'> & {
  /** The <h2>. A section without one renders its blocks under the previous heading. */
  heading?: string;
};

type CoreField = 'slug' | 'title' | 'description' | 'headline' | 'published' | 'author' | 'cover';

export type PostView = Pick<Post, CoreField> &
  Partial<Omit<Post, CoreField | 'sections' | 'cover'>> & {
    cover: Image;
    sections?: SectionView[];
  };

/** Two-letter initials for the avatar disc, when the post does not set them. */
export function initialsOf(post: PostView): string {
  if (post.authorInitials) return post.authorInitials;
  return post.author
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}

/** The card headline: the short one when set, otherwise the H1. */
export function cardHeadline(post: PostView): string {
  return post.shortHeadline ?? post.headline;
}

/** The card summary: the written one when set, otherwise the meta description. */
export function cardSummary(post: PostView): string {
  return post.summary ?? post.description;
}
