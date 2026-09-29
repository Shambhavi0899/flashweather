import type { SectionTone, Tone } from '@/content/industries';

/**
 * Shared pieces for the industry template. Class names are written out in
 * full so Tailwind's scanner sees every one of them.
 */

export const toneBg: Record<Tone, string> = {
  clear: 'bg-alert-clear',
  advisory: 'bg-viz-gold',
  watch: 'bg-alert-watch',
  warning: 'bg-alert-warning',
  info: 'bg-alert-info',
  brand: 'bg-brand-blue',
};

export const toneBorder: Record<Tone, string> = {
  clear: 'border-alert-clear',
  advisory: 'border-viz-gold',
  watch: 'border-alert-watch',
  warning: 'border-alert-warning',
  info: 'border-alert-info',
  brand: 'border-brand-blue',
};

/** Text in an alert colour, for dark grounds only (viz gold is never text on white). */
export const toneTextOnDark: Record<Tone, string> = {
  clear: 'text-alert-clear',
  advisory: 'text-viz-gold',
  watch: 'text-alert-watch',
  warning: 'text-[#E0564B]',
  info: 'text-[#8FB7FF]',
  brand: 'text-[#8FB7FF]',
};

export const isDark = (tone: SectionTone = 'light') => tone === 'dark' || tone === 'deep';

export const sectionBg: Record<SectionTone, string> = {
  light: 'bg-neutral-0',
  sunken: 'bg-surface-sunken',
  dark: 'bg-brand-navy',
  deep: 'bg-brand-navy-deep',
};

/** A status dot. Decorative: the label beside it carries the meaning. */
export function Dot({ tone, className = 'size-2' }: { tone: Tone; className?: string }) {
  return <span aria-hidden className={`inline-block shrink-0 rounded-full ${toneBg[tone]} ${className}`} />;
}

/** The disclaimer every mock-up carries. Content, not an annotation. */
export function Illustrative({ dark = false, className = '' }: { dark?: boolean; className?: string }) {
  return (
    <p
      className={`text-[11px] leading-[14px] font-bold tracking-[0.13em] ${
        dark ? 'text-[#8F9AB8]' : 'text-text-muted'
      } ${className}`}
    >
      ILLUSTRATIVE EXAMPLE · NOT LIVE WEATHER
    </p>
  );
}

/** The standard section heading block: an H2 and an optional intro. */
export function SectionHeading({
  id,
  heading,
  intro,
  introSize = 'body',
  dark = false,
  className = '',
  children,
}: {
  id: string;
  heading: string;
  intro?: string;
  /** `small` for a one-line intro, like the related-links section's. */
  introSize?: 'body' | 'small';
  dark?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <h2
        id={id}
        className={`max-w-[900px] text-[30px] leading-[36px] font-bold tracking-display md:text-h1 md:leading-h1 ${
          dark ? 'text-neutral-0' : 'text-text'
        }`}
      >
        {heading}
      </h2>
      {intro && (
        <p
          className={`max-w-[720px] text-pretty ${introSize === 'small' ? 'text-body-s' : 'text-body'} ${
            dark ? 'text-text-on-dark-muted' : 'text-text-muted'
          }`}
        >
          {intro}
        </p>
      )}
      {children}
    </div>
  );
}

/** A section shell: landmark, background and the page gutter. */
export function Section({
  id,
  tone = 'light',
  className = '',
  children,
}: {
  id?: string;
  tone?: SectionTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className={sectionBg[tone]}>
      <div className={`container-page py-16 md:py-24 xl:py-28 ${className}`}>{children}</div>
    </section>
  );
}
