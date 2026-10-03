import { Logo } from '@/components/logo';
import { Motion } from '@/components/motion';
import { SiteLink } from '@/components/site-link';
import { comparisonRows, type ComparisonRow } from '@/content/home';

import { BoltIcon } from './bolt-icon';
import { DifferenceHeadline } from './difference-headline';

/**
 * "Reactive detection. We're proactive." (<DifferenceHeadline>). The
 * comparison is a real table (two columns,
 * five rows). Below md each row becomes a stacked card pair, as in the mobile
 * design, with a small column label on each cell.
 *
 * Each row's two diagrams animate when the row scrolls in (and replay on
 * hover): the Flash side first and crisp, everyone else late and vague. The
 * `cmp-*` hooks and keyframes are in styles/why-flash.css, shared with the
 * Everyone else vs Flash page.
 */
export function Comparison() {
  return (
    <section id="flash-difference" aria-labelledby="difference-heading" className="scroll-mt-4 bg-surface-sunken">
      <div className="container-page flex flex-col gap-10 py-20 lg:gap-14 lg:py-[120px]">
        <div className="flex flex-col gap-8 lg:gap-10">
          <p className="text-[11px] leading-4 font-bold tracking-[0.13em] text-brand-blue uppercase md:text-micro">
            The Flash difference · prediction, not detection
          </p>

          {/* The same heading as the Everyone else vs Flash page's H1. */}
          <DifferenceHeadline id="difference-heading" />

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <p className="max-w-[640px] text-[15px] leading-[23px] text-pretty text-text-muted md:text-body-l md:leading-body-l">
              Detection tools tell you where lightning was. Flash tells you where it will be, up to an hour before, one
              kilometre at a time. That is the difference between reacting and deciding.
            </p>
            <div aria-hidden className="hidden shrink-0 items-center gap-7 pb-1 md:flex">
              <span className="flex items-center gap-2 text-[11px] leading-[14px] font-extrabold tracking-[0.13em] text-text-muted">
                <span className="size-[10px] rounded-full bg-neutral-400" />
                DETECTS · AFTER
              </span>
              <span className="flex items-center gap-2 text-[11px] leading-[14px] font-extrabold tracking-[0.13em] text-brand-navy">
                <BoltIcon className="h-[14px] w-[10px]" fill="var(--color-viz-gold)" />
                PREDICTS · UP TO 60 MIN BEFORE
              </span>
            </div>
          </div>
        </div>

        <div className="md:overflow-hidden md:rounded-xl md:border md:border-border md:bg-neutral-0">
          <table className="block w-full border-collapse md:table md:table-fixed">
            <caption className="sr-only">Detection-based tools compared with Flash prediction</caption>
            <thead className="max-md:sr-only">
              <tr>
                <th scope="col" className="border-b border-border px-8 py-[22px] text-left">
                  <span className="flex items-center gap-[10px] text-micro font-bold tracking-[0.13em] text-text-muted uppercase">
                    <span aria-hidden className="size-[10px] shrink-0 rounded-full bg-neutral-300" />
                    Everyone else
                  </span>
                </th>
                <th scope="col" className="bg-brand-navy px-8 py-[22px] text-left">
                  <Logo variant="dark" size="column" link={false} alt="Flash" />
                </th>
              </tr>
            </thead>
            <tbody className="flex flex-col gap-4 md:table-row-group">
              {comparisonRows.map((row, i) => (
                <Motion
                  as="tr"
                  key={row.flash.title}
                  className="motion cmp-row block overflow-hidden rounded-lg border border-border bg-neutral-0 md:table-row md:rounded-none md:border-0"
                >
                  <td
                    className={`cmp-them block px-4 py-5 align-middle md:table-cell md:px-8 md:py-7 ${
                      i < comparisonRows.length - 1 ? 'md:border-b md:border-border' : ''
                    }`}
                  >
                    <Cell side="them" icon={row.icon} {...row.them} />
                  </td>
                  <td
                    className={`cmp-flash block bg-brand-navy px-4 py-5 align-middle md:table-cell md:px-8 md:py-7 ${
                      i < comparisonRows.length - 1 ? 'md:border-b md:border-border-on-dark' : ''
                    }`}
                  >
                    <Cell side="flash" icon={row.flashIcon} {...row.flash} />
                  </td>
                </Motion>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="flex flex-wrap gap-x-6 gap-y-2 text-body-s leading-5 font-bold text-brand-blue md:leading-caption">
            <SiteLink href="/why-flash/prediction-vs-sensors-vs-detection/" className="hover:underline">
              Read the full explainer <span aria-hidden>→</span>
            </SiteLink>
            <SiteLink href="/why-flash/everyone-else-vs-flash/" className="hover:underline">
              Everyone else vs Flash <span aria-hidden>→</span>
            </SiteLink>
          </p>
          <p className="text-caption leading-4 text-text-subtle">
            Generic comparison with detection-based tools. No vendor named.
          </p>
        </div>
      </div>
    </section>
  );
}

function Cell({
  side,
  icon,
  title,
  body,
}: {
  side: 'them' | 'flash';
  icon: ComparisonRow['icon'] | ComparisonRow['flashIcon'];
  title: string;
  body: string;
}) {
  const flash = side === 'flash';
  return (
    <div className="flex items-center gap-6">
      <span className="hidden sm:block">
        <RowIcon icon={icon} />
      </span>
      <div className="flex flex-col gap-1">
        {/* The column label, shown only where the table header is hidden. */}
        <span
          aria-hidden
          className="mb-1 flex items-center gap-2 text-[10px] leading-3 font-bold tracking-[0.13em] text-text-muted uppercase md:hidden"
        >
          {flash ? (
            <Logo variant="dark" size="label" link={false} alt="" />
          ) : (
            <>
              <span className="size-2 rounded-full bg-neutral-300" />
              Everyone else
            </>
          )}
        </span>
        <p
          className={`text-[15px] leading-[21px] font-bold md:text-body-l md:leading-6 ${flash ? 'text-text-on-dark' : 'text-neutral-700'}`}
        >
          {title}
        </p>
        <p
          className={`text-caption md:text-body-s md:leading-5 ${flash ? 'text-text-on-dark-muted' : 'text-text-muted'}`}
        >
          {body}
        </p>
      </div>
    </div>
  );
}

const iconProps = { viewBox: '0 0 128 72', className: 'h-[72px] w-32 shrink-0', 'aria-hidden': true } as const;
const t10 = { fontFamily: 'Manrope', fontSize: 10, fontWeight: 700 } as const;

function RowIcon({ icon }: { icon: ComparisonRow['icon'] | ComparisonRow['flashIcon'] }) {
  switch (icon) {
    case 'strike':
      return (
        <svg {...iconProps}>
          <line x1="8" y1="46" x2="120" y2="46" stroke="#CBD2DE" strokeWidth="2" />
          <path className="cmp-strike-bolt" d="M96 14l-15 20h8l-4 16 15-22h-8.5z" fill="#8A93A8" />
          <g className="cmp-strike-hit">
            <circle cx="90" cy="46" r="7" fill="#C22E22" />
            <path d="M86 54v-6a4 4 0 018 0v6" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>
          <text x="118" y="68" textAnchor="end" fill="#5F6B85" {...t10}>
            ALERT = STRIKE
          </text>
        </svg>
      );
    case 'lead':
      return (
        <svg {...iconProps}>
          <line x1="8" y1="46" x2="120" y2="46" stroke="#1C2340" strokeWidth="2" />
          <clipPath id="cmp-lead-line">
            <rect className="cmp-lead-line" x="16" y="42" width="88" height="8" />
          </clipPath>
          <line
            x1="16"
            y1="46"
            x2="104"
            y2="46"
            stroke="var(--color-viz-gold)"
            strokeWidth="2"
            strokeDasharray="4 4"
            clipPath="url(#cmp-lead-line)"
          />
          <circle
            className="cmp-lead-ping"
            cx="16"
            cy="46"
            r="7"
            fill="none"
            stroke="var(--color-viz-gold)"
            strokeWidth="2"
          />
          <g className="cmp-lead-alert">
            <circle cx="16" cy="46" r="7" fill="var(--color-viz-gold)" />
            <path d="M14 42l-1.5 4h2l-1 4 3.5-5h-2l1-3z" fill="#070D26" />
          </g>
          <path className="cmp-lead-bolt" d="M110 14l-15 20h8l-4 16 15-22h-8.5z" fill="#FFFFFF" />
          <path d="M16 34 L16 28 L104 28 L104 34" fill="none" stroke="var(--color-viz-gold)" strokeWidth="1.5" />
          <text x="60" y="22" textAnchor="middle" fill="var(--color-viz-gold)" {...t10}>
            UP TO 60 MIN
          </text>
          <text x="16" y="68" fill="#AEB8C7" {...t10}>
            ALERT
          </text>
          <text x="104" y="68" textAnchor="middle" fill="#AEB8C7" {...t10}>
            STRIKE
          </text>
        </svg>
      );
    case 'county':
      return (
        <svg {...iconProps}>
          <g className="cmp-county">
            <path
              d="M14 22 C30 6, 70 4, 92 14 C118 26, 118 52, 92 62 C66 72, 22 70, 12 52 C6 42, 6 30, 14 22Z"
              fill="#EEF1F7"
              stroke="#CBD2DE"
              strokeWidth="1.5"
            />
            <text x="64" y="41" textAnchor="middle" fill="#5F6B85" {...t10}>
              WHOLE COUNTY
            </text>
          </g>
        </svg>
      );
    case 'cell':
      return (
        <svg {...iconProps}>
          {[8, 24, 40, 56].map((y) => (
            <line key={`h${y}`} x1="8" y1={y} x2="120" y2={y} stroke="#1C2340" />
          ))}
          {[8, 24, 40, 56, 72, 88, 104, 120].map((x) => (
            <line key={`v${x}`} x1={x} y1="8" x2={x} y2="56" stroke="#1C2340" />
          ))}
          <rect
            className="cmp-cell-scan"
            x="8"
            y="8"
            width="16"
            height="16"
            fill="var(--color-viz-gold)"
            fillOpacity="0.25"
            stroke="var(--color-viz-gold)"
            strokeWidth="1.5"
          />
          <rect className="cmp-cell-fill" x="40" y="24" width="16" height="16" fill="var(--color-viz-gold)" />
          <rect
            className="cmp-cell-fill"
            x="56"
            y="24"
            width="16"
            height="16"
            fill="var(--color-viz-gold)"
            opacity="0.45"
          />
          <rect
            className="cmp-cell-fill"
            x="40"
            y="40"
            width="16"
            height="16"
            fill="var(--color-viz-gold)"
            opacity="0.3"
          />
          <circle className="cmp-cell-dot" cx="48" cy="32" r="3" fill="#070D26" />
          <text x="64" y="70" textAnchor="middle" fill="#AEB8C7" {...t10}>
            YOUR 1 KM CELL
          </text>
        </svg>
      );
    case 'hourly':
      return (
        <svg {...iconProps}>
          <line x1="8" y1="40" x2="120" y2="40" stroke="#CBD2DE" strokeWidth="2" />
          <circle cx="12" cy="40" r="5" fill="#8A93A8" />
          <circle cx="116" cy="40" r="5" fill="#8A93A8" />
          <circle className="cmp-hourly-crawl motion-loop" cx="12" cy="40" r="5" fill="#8A93A8" />
          <text x="12" y="62" fill="#5F6B85" {...t10}>
            :00
          </text>
          <text x="116" y="62" textAnchor="end" fill="#5F6B85" {...t10}>
            :60
          </text>
          <text x="64" y="24" textAnchor="middle" fill="#5F6B85" {...t10}>
            ONE UPDATE AN HOUR
          </text>
        </svg>
      );
    case 'refresh':
      return (
        <svg {...iconProps}>
          <line x1="8" y1="40" x2="120" y2="40" stroke="#1C2340" strokeWidth="2" />
          <g className="cmp-refresh-dots">
            {[12, 20, 28, 36, 44, 52, 60, 68, 76, 84, 92, 100, 108].map((cx) => (
              <circle key={cx} className="motion-loop" cx={cx} cy="40" r="3" fill="#0B63CE" />
            ))}
          </g>
          <circle className="cmp-refresh-end motion-loop" cx="116" cy="40" r="5" fill="var(--color-viz-gold)" />
          <text x="12" y="62" fill="#AEB8C7" {...t10}>
            :00
          </text>
          <text x="116" y="62" textAnchor="end" fill="#AEB8C7" {...t10}>
            :28
          </text>
          <text x="64" y="24" textAnchor="middle" fill="var(--color-viz-gold)" {...t10}>
            EVERY 2 MINUTES
          </text>
        </svg>
      );
    case 'chance':
      return (
        <svg {...iconProps}>
          <g className="cmp-chance-cloud">
            <path
              d="M36 54h56a14 14 0 000-28 20 20 0 00-38-6 16 16 0 00-18 34z"
              fill="#EEF1F7"
              stroke="#CBD2DE"
              strokeWidth="1.5"
            />
            <text
              className="cmp-chance-q"
              x="64"
              y="44"
              textAnchor="middle"
              fontFamily="Manrope"
              fontSize="16"
              fontWeight="800"
              fill="#8A93A8"
            >
              ?
            </text>
          </g>
          <text x="64" y="68" textAnchor="middle" fill="#5F6B85" {...t10}>
            SOMEWHERE, SOMETIME
          </text>
        </svg>
      );
    case 'pin':
      return (
        <svg {...iconProps}>
          {[12, 30, 48, 66].map((y) => (
            <line
              key={`h${y}`}
              className="cmp-pin-grid"
              pathLength="1"
              x1="8"
              y1={y}
              x2="120"
              y2={y}
              stroke="#1C2340"
            />
          ))}
          {[26, 44, 62, 80, 98].map((x) => (
            <line
              key={`v${x}`}
              className="cmp-pin-grid"
              pathLength="1"
              x1={x}
              y1="12"
              x2={x}
              y2="66"
              stroke="#1C2340"
            />
          ))}
          <g className="cmp-pin-drop">
            <path d="M44 52c0-8 5-13 12-13s12 5 12 13c0 9-12 18-12 18S44 61 44 52z" fill="#FFFFFF" />
            <circle cx="56" cy="52" r="4" fill="#070D26" />
          </g>
          <g className="cmp-pin-tag">
            <rect x="62" y="14" width="56" height="20" rx="4" fill="var(--color-viz-gold)" />
            <text x="90" y="28" textAnchor="middle" fontFamily="Manrope" fontSize="11" fontWeight="800" fill="#070D26">
              3:47 PM
            </text>
          </g>
        </svg>
      );
    case 'hope':
      return (
        <svg {...iconProps}>
          <g className="cmp-hope">
            <circle cx="64" cy="34" r="22" fill="#EEF1F7" stroke="#CBD2DE" strokeWidth="1.5" />
            <path
              d="M56 30a8 8 0 0116 0c0 5-8 6-8 12"
              fill="none"
              stroke="#8A93A8"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="64" cy="48" r="1.8" fill="#8A93A8" />
          </g>
          <text x="64" y="70" textAnchor="middle" fill="#5F6B85" {...t10}>
            WAIT AND SEE
          </text>
        </svg>
      );
    case 'go':
      return (
        <svg {...iconProps}>
          <g className="cmp-go-badge">
            <rect x="4" y="14" width="120" height="40" rx="8" fill="#128A5E" />
            <text x="44" y="39" fontFamily="Manrope" fontSize="12" fontWeight="800" fill="#FFFFFF">
              GO · 3:20 PM
            </text>
          </g>
          <path
            className="cmp-go-check"
            pathLength="1"
            d="M18 34l6 6 12-12"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x="64" y="70" textAnchor="middle" fill="#AEB8C7" {...t10}>
            DECIDE EARLY, LOG IT
          </text>
        </svg>
      );
  }
}
