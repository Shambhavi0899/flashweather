import { HowTimeline } from '@/components/home/how-timeline';
import { steps } from '@/content/home';

export function HowItWorks() {
  return (
    <section aria-labelledby="how-heading" className="bg-neutral-0">
      <div className="container-page flex flex-col gap-12 py-20 lg:gap-14 lg:py-[120px]">
        <div className="flex flex-col gap-4">
          <p className="text-[11px] leading-[14px] font-semibold tracking-label-wide text-text-muted uppercase">How it works</p>
          <h2
            id="how-heading"
            className="text-[26px] leading-8 font-extrabold tracking-[-0.03em] text-text md:text-[48px] md:leading-[54px] md:tracking-[-0.04em]"
          >
            How does Flash know 60 minutes early?
          </h2>
        </div>

        <HowTimeline steps={steps} />
      </div>
    </section>
  );
}
