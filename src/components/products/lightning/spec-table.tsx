import Link from 'next/link';

import { AgentChat } from '@/components/agent-conversation/agent-chat';
import { AgentBadge, GoldBolt } from '@/components/home/bolt-icon';
import { Motion } from '@/components/motion';
import { SectionHeader } from '@/components/products/section-header';
import { StatTile } from '@/components/stats/stat-tile';

import { specs, type SpecChannel, type SpecRow, type SpecRowId } from './content';

/**
 * "What exactly does it predict, and how well?": the approved fact sheet as
 * four headline tiles, two tables and the Flash Agent banner.
 *
 *   tiles    the home page's stat tiles (components/stats/stat-tile.tsx),
 *            with their diagrams, count-up and motion
 *   tables   equal height side by side. Each row is its own <Motion> block:
 *            rows that scroll in together fade up 50ms apart, and a row's
 *            small visual draws in as the row lands (styles/products.css,
 *            `spec-*`). The value is always the fact sheet's text; icons and
 *            visuals are decoration.
 *   banner   the site's agent card: navy, gold border, bolt avatar, and one
 *            exchange played by the shared <AgentChat>
 *
 * With reduced motion everything is its final frame.
 */
export function LightningSpecs() {
  return (
    <section aria-labelledby="specs-heading" className="bg-surface">
      <div className="container-page flex flex-col gap-10 py-20 lg:py-[120px]">
        <SectionHeader
          id="specs-heading"
          size="md"
          labelTone="muted-light"
          asideAlign="baseline"
          label={specs.label}
          heading={specs.heading}
          aside={
            <div className="flex flex-col items-start gap-2.5">
              <p className="flex h-6 items-center gap-1.5 rounded-xl border border-alert-clear/40 bg-alert-clear/10 pr-2.5 pl-2 text-[11px] leading-[14px] font-bold tracking-[0.06em] text-[#0E6E4B] uppercase">
                <svg aria-hidden viewBox="0 0 12 12" className="size-3 shrink-0">
                  <path
                    d="M2.5 6.2 5 8.6 9.5 3.6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {specs.badge}
              </p>
              <p className="text-body-s">{specs.aside}</p>
            </div>
          }
        />

        <dl className="grid grid-cols-1 gap-y-10 border-y border-border pt-9 pb-10 sm:grid-cols-2 lg:grid-cols-4">
          {specs.tiles.map((tile, i) => (
            <StatTile
              key={tile.label}
              diagram={tile.diagram}
              value={tile.value}
              className={`gap-4 sm:px-6 lg:border-r lg:border-l-0 lg:border-border lg:px-6 lg:last:border-r-0 lg:last:pr-0 ${
                i % 2 === 0 ? 'sm:pl-0' : 'sm:border-l sm:border-border'
              } ${i === 0 ? 'lg:pl-0' : ''}`}
              valueClassName="order-1 text-[34px] leading-9 font-extrabold tracking-[-0.03em] text-text md:text-[46px] md:leading-12 md:tracking-[-0.05em]"
            >
              <dt className="order-2 text-caption leading-[18px] font-bold text-text">{tile.label}</dt>
              <dd className="order-3 -mt-3 text-caption leading-[19px] text-text-muted">
                {tile.detail}
                {'link' in tile && tile.link && (
                  <Link
                    href={tile.link.href}
                    className="pc-link mt-2 block w-fit font-bold text-brand-blue hover:underline"
                  >
                    {tile.link.label} <span aria-hidden>→</span>
                  </Link>
                )}
              </dd>
            </StatTile>
          ))}
        </dl>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch">
          <SpecTable caption="Lightning forecast specifications" heading="Forecast" rows={specs.forecast} />
          <SpecTable caption="Lightning alert delivery" heading="Delivery" rows={specs.delivery} />
        </div>

        <AgentBanner />
      </div>
    </section>
  );
}

function SpecTable({ caption, heading, rows }: { caption: string; heading: string; rows: SpecRow[] }) {
  return (
    <div className="flex overflow-x-auto rounded-md border border-border lg:grow lg:basis-0">
      <table className="h-full w-full min-w-[320px] border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-surface-sunken">
          <tr className="border-b border-border">
            <th scope="col" className="w-[42%] px-4 py-3 text-micro font-semibold tracking-label text-text-muted uppercase sm:w-[220px] sm:px-5">
              {heading}
            </th>
            <th scope="col" className="px-4 py-3 text-micro font-semibold tracking-label text-text-muted uppercase sm:px-5">
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <Motion
              as="tr"
              key={row.id}
              replay={false}
              className={`motion spec-row transition-colors duration-200 hover:bg-surface-sunken ${
                i < rows.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              <th scope="row" className="spec-cell px-4 py-4 align-middle text-[15px] leading-body-s font-semibold text-text sm:px-5">
                <span className="flex items-center gap-2.5">
                  <RowIcon id={row.id} />
                  {row.label}
                </span>
              </th>
              <td className="spec-cell px-4 py-4 align-middle text-[15px] leading-body-s text-text sm:px-5">
                <RowValue row={row} />
              </td>
            </Motion>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------ Row values */

function RowValue({ row }: { row: SpecRow }) {
  switch (row.id) {
    case 'outlook':
      return (
        <span className="flex items-center gap-3.5">
          <svg aria-hidden viewBox="0 0 132 20" className="spec-6h h-5 w-[132px] shrink-0">
            <rect x="1" y="8" width="130" height="4" rx="2" fill="#EEF1F7" />
            <rect className="spec-6h-fill" x="1" y="8" width="130" height="4" rx="2" fill="#003399" />
            <path className="spec-6h-ticks" d="M22.7 6v8M44.3 6v8M66 6v8M87.7 6v8M109.3 6v8" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="3" cy="10" r="3" fill="var(--color-viz-gold)" />
            <circle className="spec-6h-end" cx="129" cy="10" r="3" fill="#003399" />
          </svg>
          {row.value}
        </span>
      );
    case 'ground-truth': {
      // "NLDN cloud-to-ground strikes": the network's name becomes the chip.
      const [network, ...rest] = row.value.split(' ');
      return (
        <span className="flex flex-wrap items-center gap-2">
          <GoldBolt className="spec-pop h-4 w-3" />
          <span className="spec-pop spec-pop-2 flex h-[22px] items-center rounded-sm bg-brand-navy px-2 text-[11px] leading-[14px] font-extrabold tracking-[0.08em] text-text-on-dark">
            {network}
          </span>
          <span>{rest.join(' ')}</span>
        </span>
      );
    }
    case 'inputs':
      return (
        <span className="flex items-center gap-2.5">
          <svg aria-hidden viewBox="0 0 26 24" className="h-6 w-[26px] shrink-0">
            <path className="spec-layer spec-layer-3" d="M13 13 24 17.5 13 22 2 17.5Z" fill="#DCE4F5" />
            <path className="spec-layer spec-layer-2" d="M13 7.5 24 12 13 16.5 2 12Z" fill="#7F98D8" />
            <path className="spec-layer" d="M13 2 24 6.5 13 11 2 6.5Z" fill="#003399" />
          </svg>
          <span aria-hidden className="text-body-l leading-[22px] font-extrabold tracking-[-0.02em] text-brand-blue">
            100+
          </span>
          {row.value}
        </span>
      );
    case 'coverage':
      return (
        <span className="flex items-center gap-3">
          <svg aria-hidden viewBox="0 0 80 56" className="h-10 w-14 shrink-0">
            <g stroke="#FFFFFF" strokeWidth="1.2" strokeLinejoin="round">
              <path
                className="spec-land"
                d="M4 21 7 14 13 11 17 6 24 8 29 4 36 5 40 9 43 16 48 17 50 11 55 8 62 9 68 12 74 16 76 21 70 22H6Z"
                fill="#B9C8EC"
              />
              <path
                className="spec-land spec-land-2"
                d="M6 22H70L73 25 67 28 64 32 60 34 58 40 56 41 55 36 50 35 44 36 40 39 36 37 28 36 20 35 14 33 9 29Z"
                fill="#003399"
              />
              <path
                className="spec-land spec-land-3"
                d="M14 33 20 35 28 36 36 37 40 39 38 42 42 46 48 47 46 51 40 50 34 45 28 41 22 38Z"
                fill="#7F98D8"
              />
            </g>
          </svg>
          {row.value}
        </span>
      );
    case 'agent':
      return (
        <>
          {row.value}
          {row.link && (
            <Link
              href={row.link.href}
              className="pc-link mt-0.5 block w-fit text-caption leading-[18px] font-bold text-brand-blue hover:underline"
            >
              {row.link.label} <span aria-hidden>→</span>
            </Link>
          )}
        </>
      );
    case 'mobile':
      return (
        <span className="flex flex-col items-start gap-2">
          {row.value}
          <span
            aria-hidden
            className="spec-pop flex h-6 items-center gap-1.5 rounded-xl border border-brand-blue/22 bg-brand-blue/8 pr-2.5 pl-2 text-micro font-bold text-brand-blue"
          >
            <svg viewBox="0 0 12 12" className="size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.2">
              <circle cx="6" cy="6" r="4.8" />
              <circle cx="6" cy="6" r="2.4" />
              <path className="spec-radar-arm" d="M6 6 9.4 2.6" strokeLinecap="round" />
            </svg>
            {specs.radarChip}
          </span>
        </span>
      );
    case 'channels':
      return (
        <>
          {/* The fact sheet's sentence is the value; the chips draw it. */}
          <span className="sr-only">{row.value}</span>
          <ul aria-hidden className="flex flex-wrap gap-1.5">
            {specs.channels.map((channel) => (
              <li
                key={channel.label}
                className="spec-chip flex h-6 items-center gap-[5px] rounded-xl border border-border bg-surface-sunken pr-[9px] pl-[7px] text-micro font-semibold text-text"
              >
                <ChannelIcon icon={channel.icon} />
                {channel.label}
              </li>
            ))}
          </ul>
        </>
      );
    case 'hardware': {
      // "None. Nothing to install or maintain.": the first sentence is the badge.
      const [none, rest] = row.value.split('. ');
      return (
        <span className="flex flex-wrap items-center gap-2.5">
          <span className="flex h-[26px] items-center gap-1.5 rounded-[13px] border border-border-strong bg-neutral-100 pr-2.5 pl-2 text-micro font-extrabold tracking-[0.04em] text-text">
            <svg aria-hidden viewBox="0 0 14 14" className="size-3.5 shrink-0" fill="none" strokeWidth="1.2">
              <circle cx="7" cy="7" r="1.8" stroke="#3A4460" />
              <path d="M4 4a4.2 4.2 0 0 0 0 6M10 4a4.2 4.2 0 0 1 0 6" stroke="#3A4460" strokeLinecap="round" />
              <path className="spec-strike" d="M2 12 12 2" pathLength="1" stroke="#C22E22" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {none}
            <span className="sr-only">.</span>
          </span>
          {rest}
        </span>
      );
    }
  }
}

/* ----------------------------------------------------------------- Icons */

const iconPaths: Record<SpecRowId, React.ReactNode> = {
  outlook: (
    <>
      <circle cx="8" cy="8" r="6" />
      <path d="M8 4.8V8l2.2 1.4" />
    </>
  ),
  'ground-truth': (
    <>
      <circle cx="8" cy="8" r="6" />
      <circle cx="8" cy="8" r="2.5" />
    </>
  ),
  inputs: <path d="M8 2.2 14 5.2 8 8.2 2 5.2Z M2 8.2 8 11.2 14 8.2M2 11 8 14 14 11" />,
  coverage: (
    <>
      <circle cx="8" cy="8" r="6" />
      <ellipse cx="8" cy="8" rx="2.6" ry="6" />
      <path d="M2 8h12" />
    </>
  ),
  agent: <path d="M3 3h10a1 1 0 0 1 1 1v6.2a1 1 0 0 1-1 1H7.2L4.2 13.6v-2.4H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />,
  mobile: (
    <>
      <rect x="4.25" y="1.75" width="7.5" height="12.5" rx="1.75" />
      <path d="M7 11.8h2" />
    </>
  ),
  channels: (
    <>
      <circle cx="8" cy="8" r="1.6" fill="currentColor" stroke="none" />
      <path d="M5.2 5.2a4 4 0 0 0 0 5.6M10.8 5.2a4 4 0 0 1 0 5.6M3 3a7 7 0 0 0 0 10M13 3a7 7 0 0 1 0 10" />
    </>
  ),
  hardware: (
    <>
      <rect x="4" y="4" width="8" height="8" rx="1.2" />
      <path d="M6.2 1.8v2M9.8 1.8v2M6.2 12.2v2M9.8 12.2v2M1.8 6.2h2M1.8 9.8h2M12.2 6.2h2M12.2 9.8h2" />
    </>
  ),
};

function RowIcon({ id }: { id: SpecRowId }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="size-4 shrink-0 text-text-muted"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {iconPaths[id]}
    </svg>
  );
}

const channelPaths: Record<SpecChannel['icon'], React.ReactNode> = {
  app: (
    <>
      <rect x="3.2" y="1" width="5.6" height="10" rx="1.2" />
      <path d="M5.2 9h1.6" />
    </>
  ),
  sms: <path d="M2 2.5h8a.8.8 0 0 1 .8.8v4.6a.8.8 0 0 1-.8.8H5.2L3 10.5V8.7H2a.8.8 0 0 1-.8-.8V3.3a.8.8 0 0 1 .8-.8Z" />,
  email: (
    <>
      <rect x="1.2" y="2.5" width="9.6" height="7" rx="1" />
      <path d="M1.6 3.2 6 6.6l4.4-3.4" />
    </>
  ),
  horn: <path d="M1.8 4.4h2.2l4.6-2.6v8.4L4 7.6H1.8ZM4.2 7.6l.8 2.8" />,
  api: <path d="M4.2 3 1.8 6l2.4 3M7.8 3l2.4 3-2.4 3" />,
  agent: <path d="M8.3.2 1.6 6.9h3L3.8 11.8l6.6-7.3H6.9z" fill="currentColor" stroke="none" />,
};

function ChannelIcon({ icon }: { icon: SpecChannel['icon'] }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 12"
      className="size-3 shrink-0 text-neutral-700"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {channelPaths[icon]}
    </svg>
  );
}

/* ---------------------------------------------------------------- Banner */

function AgentBanner() {
  const { agent } = specs;
  return (
    <article className="flex flex-col gap-6 rounded-[20px] border border-viz-gold/55 bg-brand-navy p-6 md:px-8 md:py-7 lg:flex-row lg:items-center lg:gap-8">
      <div className="flex items-start gap-4 lg:w-[500px] lg:shrink xl:shrink-0">
        <AgentBadge className="size-11 shrink-0 rounded-xl" />
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5">
            <p className="text-micro font-bold tracking-[0.13em] text-viz-gold uppercase">{agent.tag}</p>
            <h3 className="text-body-l leading-6 font-extrabold tracking-heading text-text-on-dark">{agent.name}</h3>
          </div>
          <p className="text-body-s leading-[22px] text-pretty text-[#C9D1E3]">{agent.body}</p>
        </div>
      </div>

      {/* One exchange, played by the shared chat player once it scrolls in; laid
          out at its final size from the start, so nothing moves around it. */}
      <AgentChat className="min-w-0 grow basis-0">
        <div
          data-chat-panel
          data-chat-hover
          aria-label={`Flash Agent answers "${agent.chat.question}"`}
          className="chat flex flex-col gap-2.5 rounded-[14px] border border-white/10 bg-brand-navy-deep px-4 py-3.5"
        >
          <div className="chat-bubble flex justify-end">
            <p className="rounded-xl rounded-br-xs bg-brand-blue px-3 py-2 text-caption leading-[18px] font-medium text-text-on-dark">
              {agent.chat.question}
            </p>
          </div>
          <div className="relative flex flex-wrap items-center gap-2.5">
            <span className="chat-agent flex">
              <AgentBadge className="size-6 rounded-[7px]" />
              <span className="sr-only">Flash Agent:</span>
            </span>
            <span aria-hidden className="chat-dots absolute top-0 left-[34px] flex h-6 items-center gap-[5px]">
              <span className="size-1.5 rounded-full bg-[#8F9AB8]" />
              <span className="size-1.5 rounded-full bg-[#8F9AB8]" />
              <span className="size-1.5 rounded-full bg-[#8F9AB8]" />
            </span>
            <p className="chat-badge flex h-6 items-center gap-[7px] rounded-xl bg-alert-warning px-2.5 text-[11px] leading-[14px] font-extrabold tracking-[0.08em] text-text-on-dark uppercase">
              <span aria-hidden className="size-[7px] shrink-0 rounded-[2px] bg-text-on-dark" />
              {agent.chat.status}
            </p>
            <p className="text-caption leading-[18px] font-medium text-[#C9D1E3]">
              {agent.chat.reply.split(' ').map((word, i) => (
                <span key={i}>
                  <span className="chat-word">{word}</span>{' '}
                </span>
              ))}
            </p>
          </div>
        </div>
      </AgentChat>

      <Link
        href={agent.link.href}
        className="pc-link flex min-h-11 shrink-0 items-center text-caption leading-micro font-extrabold text-viz-gold hover:underline"
      >
        {agent.link.label}
        <span aria-hidden>&nbsp;→</span>
      </Link>
    </article>
  );
}
