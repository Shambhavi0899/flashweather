import { Logo } from '@/components/logo';
import { Motion } from '@/components/motion';

/**
 * "Reactive detection. We're proactive.": the home page's Flash difference
 * heading (components/home/comparison.tsx) and the Everyone else vs Flash
 * page's H1. One line from 1024px, sized to fit the content width; below, a
 * line per phrase. "Everyone else" sits just above the start of its phrase,
 * in the phrase's own column; the Flash sticker sits on the top-right corner
 * of "proactive.". Neither widens the line.
 *
 * The gold strike runs through the whole of "Reactive detection." and loops
 * while the heading is in view and the tab is visible; "proactive." has a
 * metallic gold underline with a light sweeping along it. Motion and sizes
 * are in styles/home.css (`diff-*`). With reduced motion, or without
 * JavaScript, the strike and the underline are simply there.
 */
export function DifferenceHeadline({ as = 'h2', id }: { as?: 'h1' | 'h2'; id?: string }) {
  return (
    <Motion as={as} replay={false} id={id} className="motion diff flex flex-wrap items-end font-extrabold">
      <span className="diff-part">
        {/* Sticker text comes from CSS so it stays out of the heading's text. */}
        <span
          aria-hidden
          className="diff-tag-them flex -rotate-4 items-center gap-2 rounded-[8px] border border-border-strong bg-neutral-0 px-[10px] py-[7px] shadow-[0_8px_20px_rgb(11_19_34/0.1)] sm:px-[14px] sm:py-[10px]"
        >
          <span className="size-[10px] shrink-0 rounded-full bg-neutral-400" />
          <span className="text-[9px] leading-3 font-extrabold tracking-[0.08em] text-text-muted before:content-['EVERYONE_ELSE'] sm:text-micro sm:leading-micro sm:tracking-[0.13em]" />
        </span>
        <span className="diff-them relative text-[#B7C0CF]">
          Reactive detection.
          {/* Drawn for the phrase's own box and stretched to it; the strokes
              keep their weight, set in em so they scale with the type. */}
          <svg
            aria-hidden
            viewBox="0 0 1000 70"
            preserveAspectRatio="none"
            className="absolute top-[24%] -left-[2.5%] h-[0.64em] w-[105%] overflow-visible"
          >
            <path
              className="diff-strike motion-loop"
              pathLength={1}
              d="M20 56 C 300 50, 700 36, 975 22"
              fill="none"
              stroke="var(--color-viz-gold)"
              strokeLinecap="round"
            />
            <path
              className="diff-strike diff-strike-2 motion-loop"
              pathLength={1}
              d="M45 66 C 340 60, 690 46, 895 38"
              fill="none"
              stroke="var(--color-viz-gold)"
              strokeOpacity="0.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </span>{' '}
      <span className="diff-part">
        <span className="diff-us">
          <span className="text-brand-navy">We&rsquo;re</span>{' '}
          <span className="diff-emph relative inline-block text-brand-blue">
            proactive.
            <span aria-hidden className="diff-underline bg-gold-metallic">
              <span className="diff-sheen motion-loop" />
            </span>
            {/* A sticker on the word's top-right corner, over "e." and clear of the letters. */}
            <span
              aria-hidden
              className="diff-tag-us flex rotate-3 items-center rounded-[8px] bg-brand-navy px-3 py-2 shadow-[0_12px_28px_rgb(7_13_38/0.28)] max-sm:scale-90 sm:px-[18px] sm:py-3"
            >
              <Logo variant="dark" size="tag" link={false} alt="" />
            </span>
          </span>
        </span>
      </span>
    </Motion>
  );
}
