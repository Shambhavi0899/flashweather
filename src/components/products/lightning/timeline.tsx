import { SectionHeader } from '@/components/products/section-header';

import { timeline } from './content';
import { Countdown } from './countdown';

/** Five steps from advisory to all-clear, run as a scroll countdown (countdown.tsx). */
export function LightningTimeline() {
  return (
    <section aria-labelledby="timeline-heading" className="lc">
      <Countdown
        steps={timeline.steps}
        label={timeline.alt}
        header={
          <SectionHeader
            id="timeline-heading"
            size="md"
            labelTone="muted-light"
            label={timeline.label}
            heading={timeline.heading}
          />
        }
      />
    </section>
  );
}
