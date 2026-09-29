import Link from 'next/link';

import { Motion } from '@/components/motion';
import { SectionLabel } from '@/components/products/section-header';

import { AccuracyScoring } from './accuracy-scoring';
import { accuracy } from './content';

/** The small verified seal before "Measured, not claimed". */
function VerifiedBadge() {
  return (
    <svg aria-hidden className="la-badge" viewBox="0 0 24 24">
      <path
        className="la-badge-seal"
        d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
      />
      <path className="la-badge-check" d="m8.5 12 2.4 2.4 4.6-4.8" />
    </svg>
  );
}

/**
 * The 99.6% figure with the sentence it is never quoted without, how it is
 * measured (three steps) and the scoring visual that plays those steps.
 * Reveal and layout are in styles/lightning-accuracy.css: the head rises and
 * counts up, then the steps, then the scoring run starts. Phones stack the
 * number, the visual, then the steps; from 1024px the text is on the left
 * and the visual, as tall as it, on the right.
 */
export function LightningAccuracy() {
  return (
    <section aria-labelledby="accuracy-heading" className="bg-surface">
      <div className="container-page la py-20 lg:py-[120px]">
        <Motion className="motion la-block la-head" count={accuracy.figure} replay={false}>
          <SectionLabel tone="muted-light" className="flex items-center gap-2">
            <VerifiedBadge />
            {accuracy.label}
          </SectionLabel>
          <h2
            id="accuracy-heading"
            className="text-[32px] leading-[38px] font-extrabold tracking-[-0.03em] text-text md:text-[36px] md:leading-[42px] lg:text-[40px] lg:leading-[46px]"
          >
            {accuracy.heading}
          </h2>
          <p className="la-figure-value pt-2 text-[80px] leading-[84px] font-extrabold tracking-[-0.05em] text-text sm:text-[120px] sm:leading-[120px]">
            <span data-count>{accuracy.figure}</span>
          </p>
          <p className="max-w-[520px] text-body text-pretty text-text-muted">{accuracy.body}</p>
        </Motion>

        <AccuracyScoring copy={accuracy} />

        <div className="la-cta">
          <Link
            href={accuracy.cta.href}
            className="inline-flex h-12 items-center justify-center rounded-full bg-brand-blue px-[28px] text-body-s leading-caption font-semibold tracking-[0.02em] text-text-on-dark transition hover:bg-brand-blue-hover"
          >
            {accuracy.cta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
