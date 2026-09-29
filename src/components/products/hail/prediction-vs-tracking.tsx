import { SectionHeader } from '@/components/products/section-header';

import { comparison, stormTimeline } from './content';
import { StormComparison } from './storm-comparison';

/**
 * Two columns: what tracking tools report after impact vs what FlashHail
 * forecasts before it, played out along one storm timeline as the page
 * scrolls (storm-comparison.tsx).
 */
export function PredictionVsTracking() {
  return (
    <section aria-labelledby="hail-vs-tracking-heading" className="bg-neutral-0">
      <StormComparison
        header={
          <SectionHeader
            size="md"
            labelTone="muted-light"
            id="hail-vs-tracking-heading"
            label="Prediction vs tracking"
            heading="Hail tracking or hail prediction?"
          />
        }
        tracking={comparison.tracking}
        prediction={comparison.prediction}
        {...stormTimeline}
      />
    </section>
  );
}
