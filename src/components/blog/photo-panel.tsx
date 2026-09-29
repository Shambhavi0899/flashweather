import Image from 'next/image';

import type { Image as ImageData } from '@/content/blog';

/**
 * A photo with the design's navy grade, a small gold label top-left and a
 * line of white copy bottom-left. Used for card thumbs and in-body figures.
 *
 * The label is viz-gold on a navy ground (the gradient and, for `pill`, a
 * navy chip), which is where small gold text belongs.
 */
export function PhotoPanel({
  image,
  sizes,
  badge,
  overlay,
  variant = 'card',
  className = '',
  alt,
}: {
  image: ImageData;
  sizes: string;
  /** The small gold label, top-left. Optional: a plain post cover may have none. */
  badge?: string;
  /** The line of copy, bottom-left. Optional for the same reason. */
  overlay?: string;
  /** `card`: plain label, 14px copy. `figure`: pill label, 14px copy on phones and 22px from `sm`. */
  variant?: 'card' | 'figure';
  className?: string;
  /** Overrides the image's own alt (pass "" when the panel is decorative). */
  alt?: string;
}) {
  const figure = variant === 'figure';
  return (
    <div className={`relative overflow-hidden rounded-lg bg-brand-navy ${className}`}>
      <Image
        src={image.src}
        alt={alt ?? image.alt}
        fill
        sizes={sizes}
        className="object-cover"
      />
      <div aria-hidden className={`${figure ? 'blog-figure-grade' : 'blog-panel-grade'} absolute inset-0`} />
      {!badge ? null : figure ? (
        <p className="absolute top-4 left-4 flex h-6 items-center rounded-[12px] bg-[#040818C7] px-[10px] text-[10px] leading-3 font-extrabold tracking-[0.13em] text-viz-gold uppercase sm:top-[18px] sm:left-[22px]">
          {badge}
        </p>
      ) : (
        <p className="absolute top-[14px] left-4 text-[10px] leading-3 font-extrabold tracking-[0.13em] text-viz-gold uppercase">
          {badge}
        </p>
      )}
      {overlay && (
        <p
          className={
            figure
              ? 'absolute right-4 bottom-4 left-4 max-w-[600px] text-body-s leading-[19px] font-extrabold text-white sm:right-[22px] sm:bottom-[18px] sm:left-[22px] sm:text-[22px] sm:leading-h4 sm:tracking-[-0.03em]'
              : 'absolute right-4 bottom-[14px] left-4 text-body-s leading-[19px] font-extrabold text-white'
          }
        >
          {overlay}
        </p>
      )}
    </div>
  );
}
