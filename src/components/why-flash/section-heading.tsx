import Link from 'next/link';

/**
 * The section label + H2 pair every Why Flash section opens with.
 *
 * The label is brand blue on light grounds and viz-gold on dark ones (the
 * design's rule; bright gold text never sits on white).
 */

export function Kicker({
  children,
  tone = 'light',
  className = '',
}: {
  children: React.ReactNode;
  tone?: 'light' | 'dark';
  className?: string;
}) {
  return (
    <p
      className={`text-micro font-bold tracking-[0.13em] uppercase ${
        tone === 'dark' ? 'text-viz-gold' : 'text-brand-blue'
      } ${className}`}
    >
      {children}
    </p>
  );
}

export const h2Class =
  'text-[28px] leading-[34px] font-extrabold tracking-[-0.03em] md:text-[36px] md:leading-[42px]';

export const h2LargeClass =
  'text-[28px] leading-[34px] font-extrabold tracking-[-0.03em] md:text-h1 md:leading-[44px]';

export function SectionHeading({
  id,
  kicker,
  children,
  tone = 'light',
  size = 'md',
  className = '',
}: {
  id: string;
  kicker: string;
  children: React.ReactNode;
  tone?: 'light' | 'dark';
  size?: 'md' | 'lg';
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <Kicker tone={tone}>{kicker}</Kicker>
      <h2
        id={id}
        className={`${size === 'lg' ? h2LargeClass : h2Class} ${tone === 'dark' ? 'text-text-on-dark' : 'text-text'}`}
      >
        {children}
      </h2>
    </div>
  );
}

/** The small "Illustrative example · not live weather" chip. */
export function IllustrativeChip({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  return tone === 'light' ? (
    <p className="inline-flex h-[26px] items-center rounded-xs border border-border bg-surface-raised px-[10px] text-[11px] leading-[14px] font-bold tracking-[0.12em] text-text-muted uppercase">
      Illustrative example · Not live weather
    </p>
  ) : (
    <p className="text-[11px] leading-[14px] font-bold tracking-[0.13em] text-[#8F9AB8] uppercase">
      Illustrative example · Not live weather
    </p>
  );
}

/** An inline text link with a trailing arrow. */
export function ArrowLink({
  href,
  children,
  tone = 'light',
}: {
  href: string;
  children: React.ReactNode;
  tone?: 'light' | 'dark';
}) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center gap-1 text-[15px] leading-body-s font-semibold hover:underline ${
        tone === 'dark' ? 'text-viz-gold' : 'text-brand-blue'
      }`}
    >
      {children}
      <span aria-hidden> →</span>
    </Link>
  );
}
