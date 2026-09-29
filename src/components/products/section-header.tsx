/**
 * The header every products-section block opens with: a spaced-caps label,
 * the H2, and (on wide screens) a muted paragraph set to the right.
 *
 * Label colour follows the gold rules: blue-soft on light grounds (as the
 * design draws it), viz-gold on dark grounds.
 */
const labelColors = {
  light: 'text-brand-blue-soft',
  dark: 'text-viz-gold',
  /** The grey label some sections draw on light grounds. */
  'muted-light': 'text-text-muted',
  /** The grey label some sections draw on dark grounds. */
  'muted-dark': 'text-text-on-dark-muted',
} as const;

export type LabelTone = keyof typeof labelColors;

/**
 * The label's type. The design sets the coloured label two ways: 'regular'
 * (12/16, 600, 0.14em) on the platform, lightning and hail pages, 'strong'
 * (12/16, 700, 0.13em) on the heat and API pages. The grey labels are always
 * smaller and wider (11/14, 600, 0.18em), whatever the emphasis.
 */
const labelEmphases = {
  regular: 'text-micro font-semibold tracking-label',
  strong: 'text-micro font-bold tracking-[0.13em]',
} as const;

export type LabelEmphasis = keyof typeof labelEmphases;

const mutedLabel = 'text-[11px] leading-[14px] font-semibold tracking-label-wide';

export function SectionLabel({
  children,
  tone = 'light',
  emphasis = 'regular',
  className = '',
}: {
  children: React.ReactNode;
  tone?: LabelTone;
  emphasis?: LabelEmphasis;
  className?: string;
}) {
  const type = tone === 'muted-light' || tone === 'muted-dark' ? mutedLabel : labelEmphases[emphasis];
  return <p className={`${type} uppercase ${labelColors[tone]} ${className}`}>{children}</p>;
}

export function SectionHeader({
  id,
  label,
  heading,
  aside,
  tone = 'light',
  labelTone,
  labelEmphasis,
  size = 'lg',
  asideAlign = 'end',
  className = '',
}: {
  /** The H2's id, for aria-labelledby on the section. */
  id: string;
  label?: React.ReactNode;
  heading: React.ReactNode;
  aside?: React.ReactNode;
  tone?: 'light' | 'dark';
  /** Overrides the label colour; defaults to the ground's tone. */
  labelTone?: LabelTone;
  /** The label's weight and tracking; see SectionLabel. */
  labelEmphasis?: LabelEmphasis;
  /** 'lg' is the design's 48px H2, 'md' its 40px H2. */
  size?: 'lg' | 'md';
  /**
   * How the aside lines up with the heading on wide screens: 'end' puts the
   * two boxes' bottoms level; 'baseline' sets the aside's last line on the
   * heading's last baseline.
   */
  asideAlign?: 'end' | 'baseline';
  className?: string;
}) {
  const dark = tone === 'dark';
  const headingSize =
    size === 'lg'
      ? 'md:text-[40px] md:leading-[46px] lg:text-[48px] lg:leading-[54px]'
      : 'md:text-[36px] md:leading-[42px] lg:text-[40px] lg:leading-[46px]';
  return (
    <div
      className={`flex flex-col gap-6 lg:flex-row lg:justify-between lg:gap-16 ${
        asideAlign === 'baseline' ? 'lg:items-baseline-last' : 'lg:items-end'
      } ${className}`}
    >
      <div className="flex max-w-[700px] flex-col gap-5">
        {label && (
          <SectionLabel tone={labelTone ?? tone} emphasis={labelEmphasis}>
            {label}
          </SectionLabel>
        )}
        <h2
          id={id}
          className={`text-[32px] leading-[38px] font-extrabold tracking-[-0.03em] ${headingSize} ${
            dark ? 'text-text-on-dark' : 'text-text'
          }`}
        >
          {heading}
        </h2>
      </div>
      {aside && (
        <div
          className={`text-[17px] leading-h4 text-pretty lg:w-[420px] lg:shrink-0 ${
            dark ? 'text-text-on-dark-muted' : 'text-text-muted'
          }`}
        >
          {aside}
        </div>
      )}
    </div>
  );
}
