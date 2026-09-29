import { clockMarks } from '@/content/why-flash';

/**
 * "Where each alert sits on the clock": the design's timeline figure
 * (flash-prediction-vs-detection-alert-timeline.svg), rebuilt as an ordered
 * list so every label is text. Horizontal at xl (the design's 1248px track),
 * a vertical list below it.
 */

const ALT =
  "Timeline showing Flash's prediction window opening up to 60 minutes before a first cloud-to-ground strike, the strike itself, and a detection alert that can only follow it";

// Label placement on the 1248px track (marks at x = 48, 460, 1100, 1160):
// above or below the line, as in the design.
const label = [
  'xl:left-[3.85%] xl:bottom-[60px] xl:pb-5',
  'xl:left-[36.86%] xl:top-[70px] xl:pt-5',
  'xl:left-[88.14%] xl:bottom-[60px] xl:pb-5 xl:-translate-x-1/2 xl:text-center',
  'xl:right-0 xl:top-[70px] xl:pt-5 xl:text-right',
];
const markX = ['left-[3.85%]', 'left-[36.86%]', 'left-[88.14%]', 'left-[92.95%]'];

function Dot({ tone, className = '' }: { tone: (typeof clockMarks)[number]['tone']; className?: string }) {
  const look =
    tone === 'strike'
      ? 'size-[18px] border-2 border-white bg-alert-warning'
      : tone === 'after'
        ? 'size-[14px] bg-white'
        : 'size-[14px] border-2 border-brand-navy bg-viz-gold';
  return <span aria-hidden className={`absolute block rounded-full ${look} ${className}`} />;
}

export function AlertClock() {
  return (
    <figure aria-label={ALT} className="flex flex-col gap-4">
      <figcaption className="text-[11px] leading-[14px] font-bold tracking-[0.13em] text-text-on-dark-muted uppercase">
        Figure · Where each alert sits on the clock · Illustrative example · Not live weather
      </figcaption>
      <div className="relative xl:h-[130px]">
        {/* The track, then the dashed gold prediction window over it. */}
        <div
          aria-hidden
          className="absolute top-2 bottom-2 left-[6px] w-0.5 bg-border-on-dark xl:inset-x-[3.85%] xl:top-[69px] xl:bottom-auto xl:h-0.5 xl:w-auto"
        />
        <div
          aria-hidden
          className="why-flash-clock-window absolute top-2 left-[6px] h-[62%] w-0.5 xl:top-[69px] xl:left-[3.85%] xl:h-0.5 xl:w-[84.3%]"
        />
        {/* Marks on the horizontal track (xl only; the list carries its own below xl). */}
        <div aria-hidden className="hidden xl:block">
          {clockMarks.map((mark, i) => (
            <Dot key={mark.when} tone={mark.tone} className={`top-[70px] -translate-1/2 ${markX[i]}`} />
          ))}
        </div>
        <ol className="relative flex flex-col gap-6 pl-8 xl:block xl:h-full xl:pl-0">
          {clockMarks.map((mark, i) => (
            <li key={mark.when} className={`relative xl:absolute ${label[i]}`}>
              <Dot tone={mark.tone} className="top-0 -left-8 xl:hidden" />
              <p className="text-[11px] leading-[14px] font-bold tracking-[0.08em] text-text-on-dark uppercase">
                {mark.when}
              </p>
              <p className="mt-1 text-caption text-text-on-dark-muted xl:whitespace-nowrap">{mark.what}</p>
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}
