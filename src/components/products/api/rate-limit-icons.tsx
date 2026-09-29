import type { commitments } from './content';

/**
 * One small detail per commitment column on the API page's "What are the rate
 * limits and SLAs?" section. They are pictures of the idea, not data: the
 * meter has no scale, the status pill is labelled illustrative, the retry
 * dots have no times. So the whole row is hidden from assistive tech and
 * crawlers read only the column copy.
 *
 * Each plays once as its column scrolls in (the column is a <Motion>); the
 * steps are `rl-*` rules in styles/api-limits.css. Without JavaScript or with
 * reduced motion each shows its final frame.
 */
export function CommitmentIcon({ detail }: { detail: (typeof commitments)[number]['detail'] }) {
  return (
    <div aria-hidden className="flex h-7 items-center">
      {detail === 'meter' && <Meter />}
      {detail === 'status' && <StatusPill />}
      {detail === 'retry' && <Retry />}
    </div>
  );
}

/** A half-dial with its middle third marked; the needle swings in and settles there. */
function Meter() {
  return (
    <svg viewBox="0 0 48 28" className="h-7 w-12 overflow-visible">
      <path d="M4 26 A20 20 0 0 1 44 26" fill="none" stroke="var(--color-border-strong)" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M9.86 11.86 A20 20 0 0 1 38.14 11.86"
        fill="none"
        stroke="var(--color-brand-blue-soft)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line className="rl-needle" x1="24" y1="26" x2="24" y2="10" stroke="var(--color-text)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="26" r="2.75" fill="var(--color-text)" />
    </svg>
  );
}

/** "Operational", with a green dot that pings a few times, and a note that it is an illustration. */
function StatusPill() {
  return (
    <span className="rl-status flex items-center gap-[10px]">
      <span className="flex h-7 items-center gap-2 rounded-full border border-border bg-neutral-0 pr-3 pl-[10px] text-caption leading-4 font-semibold text-text">
        <span className="relative flex size-2">
          <span className="rl-ping absolute inset-0 rounded-full bg-alert-clear" />
          <span className="relative size-2 rounded-full bg-alert-clear" />
        </span>
        Operational
      </span>
      <span className="text-[11px] leading-[14px] font-semibold tracking-label text-text-subtle uppercase">
        Illustrative
      </span>
    </span>
  );
}

/**
 * A retry arrow that turns once, then three attempts: each dot waits twice as
 * long as the one before and sits twice as far along, the shape of backoff.
 */
function Retry() {
  return (
    <svg viewBox="0 0 68 28" className="h-7 w-[68px] overflow-visible">
      <g className="rl-arrow" fill="none" stroke="var(--color-text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 14 A8 8 0 1 1 17.66 8.34" />
        <path d="M17.7 3.4 L17.66 8.34 L12.7 8.4" />
      </g>
      <circle className="rl-dot rl-dot-1" cx="32" cy="14" r="2.5" fill="var(--color-brand-blue-soft)" />
      <circle className="rl-dot rl-dot-2" cx="41" cy="14" r="2.5" fill="var(--color-brand-blue-soft)" />
      <circle className="rl-dot rl-dot-3" cx="59" cy="14" r="2.5" fill="var(--color-brand-blue-soft)" />
    </svg>
  );
}
