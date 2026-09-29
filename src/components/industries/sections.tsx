import Image from 'next/image';
import Link from 'next/link';

import { Motion } from '@/components/motion';
import type { Card, IndustrySection, TableCell } from '@/content/industries';

import {
  Dot,
  Illustrative,
  Section,
  SectionHeading,
  isDark,
  sectionBg,
  toneBg,
  toneBorder,
} from './primitives';
import { AlertChain } from './alert-chain';
import { AlertLog } from './alert-log';
import { AlertRoles } from './alert-roles';
import { ConstructionPlanSection } from './construction-plan';
import { LeadBars } from './lead-bars';
import { LeadTimeCards } from './lead-time-cards';
import { PracticeScoreboard } from './practice-scoreboard';
import { RoofDamageTable } from './roof-damage';
import { StormLanes } from './storm-lanes';
import { SwathReportSection } from './swath-report';
import { VerdictTable } from './verdict-table';

/**
 * The body of a designed industry page: each entry in `industry.sections`
 * rendered by its type, in order. Every section type is generic -- the same
 * `cards` renders roofing's three costs, the construction notification chain
 * and the agronomy models -- so a new vertical composes its page from data.
 */
export function IndustrySections({ sections }: { sections: IndustrySection[] }) {
  return (
    <>
      {sections.map((section, i) => {
        const id = `section-${i + 1}`;
        switch (section.type) {
          case 'cards':
            return <CardsSection key={id} id={id} section={section} />;
          case 'timeline':
            return <TimelineSection key={id} id={id} section={section} />;
          case 'table':
            return <TableSection key={id} id={id} section={section} />;
          case 'figure':
            return section.live === 'construction-plan' ? (
              <ConstructionPlanSection key={id} id={id} section={section} />
            ) : section.live === 'swath' ? (
              <SwathReportSection key={id} id={id} section={section} />
            ) : (
              <FigureSection key={id} id={id} section={section} />
            );
          case 'bands':
            return <BandsSection key={id} id={id} section={section} />;
          case 'calendar':
            return <CalendarSection key={id} id={id} section={section} />;
          case 'stats':
            return <StatsSection key={id} section={section} />;
          case 'strip':
            return <StripSection key={id} id={id} section={section} />;
          case 'press':
            return <PressSection key={id} section={section} />;
        }
      })}
    </>
  );
}

type Of<T extends IndustrySection['type']> = Extract<IndustrySection, { type: T }>;

// ---------------------------------------------------------------------------
// Cards

const gridCols = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-2 lg:grid-cols-3',
  5: 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
} as const;

function CardsSection({ id, section }: { id: string; section: Of<'cards'> }) {
  const variant = section.variant ?? 'boxed';
  const dark = isDark(section.tone);

  return (
    <Section id={id} tone={section.tone}>
      <SectionHeading id={id} heading={section.heading} intro={section.intro} dark={dark} />
      {variant === 'chain' ? (
        <AlertChain cards={section.cards} />
      ) : variant === 'roles' ? (
        <AlertRoles cards={section.cards} />
      ) : (
        <CardList section={section} variant={variant} />
      )}
      {section.note && (
        <p className={`mt-10 text-body-s ${dark ? 'text-text-on-dark-muted' : 'text-text-muted'}`}>
          {section.note.text}{' '}
          {section.note.link && (
            <Link href={section.note.link.href} className="pc-link font-semibold text-brand-blue hover:underline">
              {section.note.link.label} <span aria-hidden>→</span>
            </Link>
          )}
        </p>
      )}
    </Section>
  );
}

/**
 * The boxed / open card row. With a `leadTime` slider (the Roofing cards) the
 * row sits under the slider and each card carries its flip point; the slider
 * turns the cards over (components/industries/lead-time-cards.tsx).
 */
function CardList({ section, variant }: { section: Of<'cards'>; variant: 'boxed' | 'open' | 'chain' }) {
  const list = (
    <ul
      className={`grid gap-6 ${section.leadTime ? '' : 'mt-10 xl:mt-12'} ${variant === 'open' ? 'md:gap-10 xl:gap-16' : ''} ${gridCols[section.columns]}`}
    >
      {section.cards.map((card, i) => {
        const key = card.title ?? card.imageTitle ?? i;
        const item =
          variant === 'open' ? (
            <OpenCard card={card} large={section.columns === 2} wave={section.wave} />
          ) : (
            <BoxedCard card={card} compact={section.columns === 5} />
          );
        // The site's wave reveal (styles/parameter-card.css): the cards fade up
        // left to right, 70ms apart, their photos focusing in.
        return section.wave ? (
          <Motion as="li" key={key} replay={false} threshold={0.2} className="motion scroll-flow-card flex">
            {item}
          </Motion>
        ) : (
          <li key={key} className="flex" data-flip-at={card.flipAt}>
            {item}
          </li>
        );
      })}
    </ul>
  );
  if (!section.leadTime) return list;
  const marks = section.cards.flatMap((card) =>
    card.flipAt === undefined ? [] : [{ at: card.flipAt, label: card.imageEyebrow?.split(' · ').pop() ?? '' }],
  );
  return (
    <LeadTimeCards label={section.leadTime.label} max={section.leadTime.max} marks={marks}>
      {list}
    </LeadTimeCards>
  );
}

/** A photo tile with the design's grade and its gold / white labels. */
function PhotoTile({
  card,
  height,
  sizes,
  titleAsHeading,
  titleClass,
  compact = false,
  className = '',
}: {
  card: Card;
  height: string;
  sizes: string;
  titleAsHeading: boolean;
  titleClass: string;
  /** The five-up tile, whose eyebrow is a size smaller. */
  compact?: boolean;
  className?: string;
}) {
  if (!card.image) return null;
  const Title = titleAsHeading ? 'h3' : 'p';
  return (
    <div
      className={`relative shrink-0 overflow-hidden bg-brand-navy ${height} ${card.problem ? 'ilt-photo' : ''} ${className}`}
    >
      <Image src={card.image.src} alt={card.image.alt} fill sizes={sizes} quality={75} className="object-cover" />
      <div aria-hidden className="industry-photo-grade absolute inset-0" />
      {card.imageEyebrow && (
        <p
          className={`absolute top-3 left-[14px] right-[14px] font-bold tracking-[0.13em] text-viz-gold sm:top-4 sm:left-[18px] ${
            compact ? 'text-[11px] leading-[14px]' : 'text-micro'
          }`}
        >
          {card.imageEyebrow}
        </p>
      )}
      {/* With a lead-time slider: the problem the warning solves, shown until the card turns over. */}
      {card.problem && (
        <p aria-hidden className="ilt-problem">
          {card.problem}
        </p>
      )}
      {card.imageTitle && (
        <Title
          className={`absolute right-[14px] bottom-3 left-[14px] font-extrabold tracking-display text-neutral-0 sm:bottom-4 sm:left-[18px] ${titleClass} ${card.problem ? 'ilt-solved' : ''}`}
        >
          {card.problem && (
            <svg viewBox="0 0 20 20" aria-hidden className="ilt-check">
              <circle cx="10" cy="10" r="10" />
              <path d="M5.8 10.4l2.8 2.8 5.6-6" />
            </svg>
          )}
          {card.imageTitle}
        </Title>
      )}
    </div>
  );
}

function CardBody({ card, titleClass, small = false }: { card: Card; titleClass: string; small?: boolean }) {
  return (
    <>
      {card.kicker && (
        <p className="text-[11px] leading-[14px] font-semibold tracking-[0.16em] text-text-muted">{card.kicker}</p>
      )}
      {card.title && <h3 className={`font-bold text-text ${titleClass}`}>{card.title}</h3>}
      {card.facts && (
        <ul aria-label="Key facts" className="icf-chips">
          {card.facts.map((fact) => (
            <li key={fact} className="icf-chip">
              {fact}
            </li>
          ))}
        </ul>
      )}
      {card.highlight && <p className="text-[15px] leading-5 font-bold text-alert-clear">{card.highlight}</p>}
      <p className={`text-body-s text-pretty text-text-muted ${small ? '' : 'md:text-body'}`}>{card.body}</p>
      {card.bullets && (
        <ul className="flex flex-col gap-2 pt-1">
          {card.bullets.map((b) => (
            <li key={b} className="flex items-start gap-[10px] text-body-s text-text">
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-alert-clear" />
              {b}
            </li>
          ))}
        </ul>
      )}
      {card.meta && <p className="text-caption leading-5 text-text-muted">{card.meta}</p>}
      {card.tags && (
        <ul aria-label="Channels" className="flex flex-wrap gap-1.5">
          {card.tags.map((t) => (
            <li
              key={t}
              className="flex h-6 items-center rounded-xs bg-surface-raised px-[10px] text-[10px] leading-3 font-bold tracking-[0.1em] text-neutral-700"
            >
              {t}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function BoxedCard({ card, compact }: { card: Card; compact: boolean }) {
  return (
    <article className="flex w-full flex-col overflow-hidden rounded-lg border border-border bg-neutral-0">
      <PhotoTile
        card={card}
        height={compact ? 'h-[140px]' : 'h-[200px]'}
        sizes={compact ? '(min-width: 1440px) 232px, (min-width: 1024px) 33vw, (min-width: 480px) 50vw, 100vw' : '(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw'}
        titleAsHeading={!card.title}
        titleClass={compact ? 'text-[17px] leading-body-s' : 'text-body-l leading-[23px]'}
        compact={compact}
      />
      <div className={`flex flex-col gap-3 ${compact ? 'px-4 pt-4 pb-5' : 'px-[22px] pt-[22px] pb-[26px]'}`}>
        <CardBody card={card} titleClass="text-[21px] leading-[27px] tracking-display" small={compact} />
      </div>
    </article>
  );
}

function OpenCard({ card, large, wave = false }: { card: Card; large: boolean; wave?: boolean }) {
  return (
    <article className={`flex w-full flex-col gap-4 ${wave ? 'pc icf' : ''}`}>
      {card.image && (
        <div className="overflow-hidden rounded-lg">
          <PhotoTile
            card={card}
            height="h-[220px] md:h-[240px] xl:h-[264px]"
            sizes="(min-width: 1440px) 592px, (min-width: 768px) 50vw, 100vw"
            titleAsHeading={false}
            titleClass={large ? 'text-body-l leading-[23px] md:text-h4 md:leading-[26px]' : 'text-body-l'}
            className={wave ? 'pc-photo' : ''}
          />
        </div>
      )}
      <div className="flex flex-col gap-[14px] border-t border-border-strong pt-[22px]">
        <CardBody card={card} titleClass="text-h3 leading-[31px] tracking-[-0.03em]" />
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Timeline

function TimelineSection({ id, section }: { id: string; section: Of<'timeline'> }) {
  const dark = isDark(section.tone);

  if (section.lanes) {
    return (
      <Section id={id} tone={section.tone}>
        <SectionHeading id={id} heading={section.heading} intro={section.intro} dark={dark}>
          {section.illustrative && <Illustrative dark={dark} />}
        </SectionHeading>
        <StormLanes lanes={section.lanes} steps={section.steps} label={section.heading} />
      </Section>
    );
  }

  if (section.scoreboard) {
    const { media } = section;
    return (
      <Section id={id} tone={section.tone}>
        <SectionHeading id={id} heading={section.heading} intro={section.intro} dark={dark}>
          {section.illustrative && <Illustrative dark={dark} />}
        </SectionHeading>
        <PracticeScoreboard
          scoreboard={section.scoreboard}
          steps={section.steps}
          label={section.heading}
          media={
            media && (
              <div className="sb-media">
                <Image
                  src={media.image.src}
                  alt={media.image.alt}
                  fill
                  sizes="(min-width: 1024px) 400px, 100vw"
                  quality={75}
                  className="object-cover"
                />
                <div aria-hidden className="industry-photo-grade absolute inset-0" />
                <p className="absolute top-4 left-[18px] text-micro font-bold tracking-[0.13em] text-viz-gold">
                  {media.eyebrow}
                </p>
                <p className="absolute right-[18px] bottom-4 left-[18px] text-body-l leading-[23px] font-extrabold tracking-display text-neutral-0">
                  {media.title}
                </p>
              </div>
            )
          }
        />
      </Section>
    );
  }

  if (section.layout === 'row') {
    return (
      <Section id={id} tone={section.tone}>
        <SectionHeading id={id} heading={section.heading} intro={section.intro} dark={dark}>
          {section.illustrative && <Illustrative dark={dark} />}
        </SectionHeading>
        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:mt-12 xl:grid-cols-6 xl:gap-6">
          {section.steps.map((step, i) => {
            const last = i === section.steps.length - 1;
            return (
              <li key={step.time} className="flex flex-col gap-[14px]">
                <p
                  className={`text-[22px] leading-body font-bold tracking-display ${
                    step.tone === 'warning' ? 'text-alert-warning' : 'text-text'
                  }`}
                >
                  {step.time}
                </p>
                <span aria-hidden className="flex h-3 items-center">
                  <span className={`size-3 shrink-0 rounded-full ${step.tone ? toneBg[step.tone] : 'bg-brand-blue'}`} />
                  {!last && <span className="h-[2px] grow bg-border-strong" />}
                </span>
                <h3 className="pt-1 text-body leading-6 font-semibold text-text">{step.title}</h3>
                <p className="text-body-s text-text-muted">{step.body}</p>
              </li>
            );
          })}
        </ol>
      </Section>
    );
  }

  return (
    <Section id={id} tone={section.tone}>
      <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
        <div className="flex flex-col gap-4 lg:w-[400px] lg:shrink xl:shrink-0">
          <SectionHeading id={id} heading={section.heading} intro={section.intro} dark={dark} />
          {section.illustrative && <Illustrative dark={dark} className="mt-2" />}
          {section.media && (
            <div className="relative mt-[18px] h-[250px] overflow-hidden rounded-lg bg-brand-navy">
              <Image
                src={section.media.image.src}
                alt={section.media.image.alt}
                fill
                sizes="(min-width: 1024px) 400px, 100vw"
                quality={75}
                className="object-cover"
              />
              <div aria-hidden className="industry-photo-grade absolute inset-0" />
              <p className="absolute top-4 left-[18px] text-micro font-bold tracking-[0.13em] text-viz-gold">
                {section.media.eyebrow}
              </p>
              <p className="absolute right-[18px] bottom-4 left-[18px] text-body-l leading-[23px] font-extrabold tracking-display text-neutral-0">
                {section.media.title}
              </p>
            </div>
          )}
        </div>
        <ol className="flex grow basis-0 flex-col pt-2">
          {section.steps.map((step, i) => {
            const last = i === section.steps.length - 1;
            return (
              <li key={step.time} className="flex gap-4 sm:gap-5">
                <p className="w-[72px] shrink-0 text-body-s font-semibold text-text sm:w-[88px]">{step.time}</p>
                <span aria-hidden className="flex w-4 shrink-0 flex-col items-center gap-1.5 pt-[5px]">
                  <span className={`size-3 shrink-0 rounded-full ${toneBg[step.tone ?? 'info']}`} />
                  {!last && <span className="w-[2px] grow bg-border-strong" />}
                </span>
                <div className={`flex grow basis-0 flex-col gap-1 ${last ? '' : 'pb-8'}`}>
                  <h3 className="text-body-s leading-body-s font-semibold text-text md:text-body">{step.title}</h3>
                  <p className="text-body-s text-text-muted">{step.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Table

const hailRing = { sm: 'size-[22px]', md: 'size-8', lg: 'size-[52px]' } as const;

function Cell({ cell, lead }: { cell: TableCell; lead: boolean }) {
  if (typeof cell === 'string') {
    return <span className={lead ? 'font-semibold text-text' : ''}>{cell}</span>;
  }
  switch (cell.kind) {
    case 'status':
      return (
        <span className="flex items-center gap-2 font-semibold text-text">
          <Dot tone={cell.tone} />
          {cell.text}
        </span>
      );
    case 'verdict':
      return (
        <span className="flex items-start gap-[10px]">
          <span className={`w-9 shrink-0 text-micro leading-6 font-bold ${cell.yes ? 'text-alert-clear' : 'text-text-muted'}`}>
            {cell.yes ? 'YES' : 'NO'}
          </span>
          {/* On the badge's 24px line, so YES / NO sits on the first line of text. */}
          <span className="text-body-s leading-6">{cell.text}</span>
        </span>
      );
    case 'hail':
      return (
        <span className="flex items-center gap-4">
          <span aria-hidden className="flex w-14 shrink-0 items-center justify-center">
            <span className={`rounded-full border-2 ${toneBorder[cell.tone]} ${hailRing[cell.size]}`} />
          </span>
          <span className="flex flex-col gap-0.5">
            <span className="text-body-l leading-body-s font-bold whitespace-nowrap text-text">{cell.title}</span>
            <span className="text-caption font-normal text-text-muted">{cell.sub}</span>
          </span>
        </span>
      );
  }
}

/** A cell's plain text, for filtering by it. */
function cellText(cell: TableCell): string {
  if (typeof cell === 'string') return cell;
  return cell.kind === 'hail' ? cell.title : cell.text;
}

function TableSection({ id, section }: { id: string; section: Of<'table'> }) {
  const dark = isDark(section.tone);
  /** A five-column log (time, site, alert, ...) is wider and sets smaller, tighter type. */
  const dense = section.columns.length >= 5;
  const minWidth = dense ? 'min-w-[880px]' : 'min-w-[720px]';

  if (section.roof) {
    const { roof } = section;
    return (
      <Section id={id} tone={section.tone}>
        <SectionHeading id={id} heading={section.heading} intro={section.intro} dark={dark}>
          {section.illustrative && <Illustrative dark={dark} />}
        </SectionHeading>
        <RoofDamageTable
          columns={section.columns}
          highlight={section.highlight}
          cells={section.rows.map((row) => row.map((cell, c) => <Cell key={c} cell={cell} lead={c === 0} />))}
          names={section.rows.map(([cell]) =>
            typeof cell !== 'string' && cell.kind === 'hail' ? `${cell.title} ${cell.sub}` : cellText(cell),
          )}
          levels={roof.levels}
          damage={roof.damage}
          channels={roof.channels}
          defaultRow={roof.defaultRow}
        />
        {section.footnote && <p className="mt-10 text-caption text-text-muted">{section.footnote}</p>}
      </Section>
    );
  }

  if (section.compare && section.highlight !== undefined) {
    return (
      <Section id={id} tone={section.tone}>
        <SectionHeading id={id} heading={section.heading} intro={section.intro} dark={dark} />
        <VerdictTable
          columns={section.columns}
          rows={section.rows}
          highlight={section.highlight}
          summary={section.summary}
        />
        {section.link && (
          <p className="mt-6">
            <Link href={section.link.href} className="text-[15px] leading-body-s font-semibold text-brand-blue hover:underline">
              {section.link.label}
            </Link>
          </p>
        )}
      </Section>
    );
  }

  if (section.log) {
    const { log } = section;
    return (
      <Section id={id} tone={section.tone}>
        <SectionHeading id={id} heading={section.heading} intro={section.intro} dark={dark}>
          {section.illustrative && <Illustrative dark={dark} />}
        </SectionHeading>
        <AlertLog
          columns={section.columns}
          cells={section.rows.map((row) => row.map((cell, c) => <Cell key={c} cell={cell} lead={c === 0} />))}
          filterValues={section.rows.map((row) => cellText(row[log.filterColumn]))}
          allLabel={log.allLabel}
          details={log.details}
          exportLabel={log.exportLabel}
          fileName={log.fileName}
          footer={section.footer}
        />
      </Section>
    );
  }

  return (
    <Section id={id} tone={section.tone}>
      <SectionHeading id={id} heading={section.heading} intro={section.intro} dark={dark}>
        {section.illustrative && <Illustrative dark={dark} />}
      </SectionHeading>
      <div className="mt-10 overflow-hidden rounded-md border border-border bg-neutral-0">
        <div className="relative overflow-x-auto">
          <table className={`w-full border-collapse text-left ${minWidth}`}>
            <thead className="bg-surface-raised">
              <tr>
                {section.columns.map((col, i) => (
                  <th
                    key={col}
                    scope="col"
                    className={`px-6 py-[14px] text-micro font-semibold tracking-label ${
                      i === section.highlight ? 'text-brand-blue' : 'text-text-muted'
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row, r) => (
                <tr key={r} className="border-t border-border align-top">
                  {row.map((cell, c) =>
                    c === 0 ? (
                      <th
                        key={c}
                        scope="row"
                        className={`px-6 py-[18px] text-left font-normal ${dense ? 'text-caption' : 'text-body leading-6'}`}
                      >
                        <Cell cell={cell} lead />
                      </th>
                    ) : (
                      <td
                        key={c}
                        className={`px-6 py-[18px] ${
                          dense ? 'text-body-s leading-5' : 'text-body-s leading-6 md:text-[15px] md:leading-[23px]'
                        } ${c === 1 && section.highlight !== undefined ? 'text-text' : 'text-text-muted'}`}
                      >
                        <Cell cell={cell} lead={false} />
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {section.summary && (
          <p className="bg-brand-navy px-6 py-4 text-body leading-6 font-semibold text-neutral-0">{section.summary}</p>
        )}
        {section.footer && (
          <p className="border-t border-border bg-surface-sunken px-6 py-[14px] text-caption text-text-muted">
            {section.footer}
          </p>
        )}
      </div>
      {section.footnote && <p className="mt-10 text-caption text-text-muted">{section.footnote}</p>}
      {section.link && (
        <p className="mt-6">
          <Link href={section.link.href} className="text-[15px] leading-body-s font-semibold text-brand-blue hover:underline">
            {section.link.label}
          </Link>
        </p>
      )}
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Figure: a mock-up exported from the design, with its legend as real text

function Legend({ legend, dark, inline = false }: { legend: Of<'figure'>['legend']; dark: boolean; inline?: boolean }) {
  return (
    <ul className={inline ? 'flex flex-wrap gap-x-5 gap-y-2' : 'flex flex-col gap-[10px] pt-1'}>
      {legend.map((item) => {
        const box = inline ? 'size-[10px] rounded-[2px]' : 'size-[14px]';
        const swatch =
          item.shape === 'square'
            ? item.tone === 'none'
              ? `${box} rounded-[3px] border border-neutral-600`
              : `${box} rounded-[3px] ${toneBg[item.tone]}`
            : `${box} rounded-full border-2 ${item.shape === 'ring-dashed' ? 'border-dashed' : ''} ${
                item.tone === 'none' ? 'border-neutral-600' : toneBorder[item.tone]
              }`;
        return (
          <li key={item.label} className="flex items-center gap-2.5">
            <span aria-hidden className={`shrink-0 ${swatch}`} />
            <span
              className={`${inline ? 'text-caption leading-micro' : 'text-body-s leading-5'} ${
                item.tone === 'none' || inline
                  ? dark
                    ? 'text-text-on-dark-muted'
                    : 'text-text-muted'
                  : dark
                    ? 'text-neutral-0'
                    : 'text-text'
              }`}
            >
              {item.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function FigureSection({ id, section }: { id: string; section: Of<'figure'> }) {
  const dark = isDark(section.tone);
  const image = (
    <Image
      src={section.image.src}
      alt={section.image.alt}
      width={section.image.width}
      height={section.image.height}
      quality={90}
      sizes={section.layout === 'split' ? '(min-width: 1440px) 784px, (min-width: 1024px) 60vw, 100vw' : '(min-width: 1440px) 1248px, 100vw'}
      className="h-auto w-full rounded-[20px]"
    />
  );

  if (section.layout === 'stacked') {
    return (
      <Section id={id} tone={section.tone}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <SectionHeading id={id} heading={section.heading} intro={section.intro} dark={dark} />
          <div className="shrink-0 pb-1.5">
            <Legend legend={section.legend} dark={dark} inline />
          </div>
        </div>
        <figure className="mt-10 flex flex-col gap-4 xl:mt-12">
          <div className="relative overflow-x-auto">
            <div className="min-w-[720px]">{image}</div>
          </div>
          {section.illustrative && (
            <figcaption>
              <Illustrative dark={dark} />
            </figcaption>
          )}
        </figure>
      </Section>
    );
  }

  return (
    <Section id={id} tone={section.tone}>
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
        <div className="flex flex-col gap-5 lg:w-[400px] lg:shrink xl:shrink-0">
          <SectionHeading id={id} heading={section.heading} intro={section.intro} dark={dark} />
          <Legend legend={section.legend} dark={dark} />
          {section.caption && <p className={`text-caption ${dark ? 'text-text-on-dark-muted' : 'text-text-muted'}`}>{section.caption}</p>}
          {section.illustrative && <Illustrative dark={dark} />}
        </div>
        <figure className="min-w-0 grow basis-0">{image}</figure>
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Bands: a policy's thresholds, and where the other policies are

function BandsSection({ id, section }: { id: string; section: Of<'bands'> }) {
  const { card, aside } = section;
  return (
    <Section id={id} tone={section.tone ?? 'dark'}>
      <SectionHeading id={id} heading={section.heading} intro={section.intro} dark />
      <div className="mt-10 flex flex-col gap-12 lg:flex-row lg:items-start">
        <div className="flex flex-col gap-5 rounded-[20px] border border-white/10 bg-[#040818B8] px-5 py-6 sm:px-8 sm:py-7 lg:w-[560px] lg:shrink xl:shrink-0 xl:w-[600px]">
          <p className="text-[11px] leading-[14px] font-semibold tracking-[0.16em] text-text-on-dark-muted">{card.eyebrow}</p>
          <h3 className="text-[22px] leading-body-l font-semibold text-neutral-0">{card.title}</h3>
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">WBGT bands in °F and the activity modification at each</caption>
            <thead className="sr-only">
              <tr>
                <th scope="col">WBGT (°F)</th>
                <th scope="col">Modification</th>
              </tr>
            </thead>
            <tbody>
              {card.rows.map((row) => (
                <tr key={row.range} className="border-t border-border-on-dark last:border-b">
                  <th scope="row" className="py-3 pr-3 text-left align-top text-caption font-semibold whitespace-nowrap text-neutral-0 sm:w-[144px]">
                    <span className="flex items-center gap-[14px]">
                      <Dot tone={row.tone} className="size-[10px]" />
                      {row.range}
                    </span>
                  </th>
                  <td className="py-3 text-body-s leading-5 text-text-on-dark-muted">{row.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex flex-col gap-1.5">
            <p className="text-body-s text-text-on-dark-muted">{card.note}</p>
            <Link href={card.link.href} className="text-[15px] leading-body-s font-semibold text-neutral-0 hover:underline">
              {card.link.label}
            </Link>
          </div>
        </div>
        <div className="flex grow basis-0 flex-col pt-1">
          <p className="pb-4 text-[11px] leading-[14px] font-semibold tracking-[0.16em] text-text-on-dark-muted">
            {aside.eyebrow}
          </p>
          <ul>
            {aside.items.map((item) => (
              <li key={item.title} className="flex flex-col gap-0.5 border-t border-border-on-dark py-[18px] last:border-b">
                {item.href ? (
                  <Link href={item.href} className="text-body-l leading-6 font-semibold text-neutral-0 hover:underline">
                    {item.title}
                  </Link>
                ) : (
                  <p className="text-body-l leading-6 font-semibold text-neutral-0">{item.title}</p>
                )}
                <p className="text-caption text-text-on-dark-muted">{item.text}</p>
              </li>
            ))}
          </ul>
          <p className="pt-5 text-body-s text-text-on-dark-muted">{aside.note}</p>
        </div>
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Calendar: which model is active in which month

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function CalendarSection({ id, section }: { id: string; section: Of<'calendar'> }) {
  return (
    <Section id={id} tone={section.tone}>
      <SectionHeading id={id} heading={section.heading} intro={section.intro} dark={isDark(section.tone)} />
      <div className="relative mt-10 overflow-x-auto xl:mt-12">
        <table className="w-full min-w-[760px] border-separate border-spacing-x-1.5 border-spacing-y-2 text-left">
          <caption className="sr-only">{section.summary}</caption>
          <thead>
            <tr>
              <td className="w-[160px]" />
              {MONTHS.map((m, i) => (
                <th key={m} scope="col" className="text-center text-[11px] leading-[14px] font-semibold tracking-[0.1em] text-text-muted">
                  <abbr title={MONTH_NAMES[i]} className="no-underline">
                    {m}
                  </abbr>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.rows.map((row) => (
              <tr key={row.label}>
                <th scope="row" className="pr-4 text-body-s leading-5 font-semibold whitespace-nowrap text-text">
                  {row.label}
                </th>
                {MONTHS.map((m, i) => {
                  const on = row.months.includes(i);
                  return (
                    <td key={m}>
                      <span
                        className={`block h-3 rounded-[3px] ${on ? toneBg[row.tone] : 'bg-neutral-200'}`}
                        aria-hidden
                      />
                      <span className="sr-only">{on ? 'active' : 'off'}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="mt-10 grid gap-8 sm:grid-cols-2 xl:mt-12 xl:grid-cols-4 xl:gap-10">
        {section.notes.map((note) => (
          <li key={note.kicker} className="flex flex-col gap-[10px] border-t border-border-strong pt-5">
            <p className="text-[11px] leading-[14px] font-semibold tracking-[0.16em] text-text-muted">{note.kicker}</p>
            <h3 className="text-h4 font-semibold text-text">{note.title}</h3>
            <p className="text-body-s text-text-muted">{note.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Stats row

function StatsSection({ section }: { section: Of<'stats'> }) {
  return (
    <section aria-label="Flash at a glance" className={sectionBg[section.tone ?? 'light']}>
      <div className="container-page flex flex-col gap-10 py-16 md:py-20">
        <dl className="grid grid-cols-2 gap-y-10 lg:flex">
          {section.stats.map((stat, i) => (
            <div
              key={stat.value}
              className={`flex flex-col-reverse justify-end gap-2 pr-6 lg:grow lg:basis-0 lg:px-10 ${
                i % 2 === 1 ? 'border-l border-border-strong pl-6' : ''
              } ${i > 0 ? 'lg:border-l lg:border-border-strong' : 'lg:pl-0'}`}
            >
              <dt className="text-body-s text-text-muted">{stat.caption}</dt>
              <dd className="text-[36px] leading-[42px] font-bold tracking-display text-text md:text-display-l md:leading-display-l">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
        {section.note && (
          <p className="max-w-[980px] text-body-s text-text-muted">
            {section.note.text}{' '}
            {section.note.link && (
              <Link href={section.note.link.href} className="font-semibold text-brand-blue hover:underline">
                {section.note.link.label} →
              </Link>
            )}
          </p>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Strip: a stat, a photo and one paragraph

function StripSection({ id, section }: { id: string; section: Of<'strip'> }) {
  const dark = isDark(section.tone);
  const media = section.media;
  const leads = section.leads;

  const column = (
    <>
      <div className={`flex gap-10 sm:gap-12 ${section.stats.length > 1 ? '' : 'flex-col'}`}>
        {section.stats.map((stat) => (
          <p key={stat.value} className="flex flex-col gap-1.5">
            <span
              className={`text-[44px] leading-[50px] font-bold tracking-display md:text-display-l md:leading-display-l ${
                dark ? 'text-neutral-0' : 'text-text'
              }`}
            >
              {stat.value}
            </span>
            <span className={`text-body-s ${dark ? 'text-text-on-dark-muted' : 'text-text-muted'}`}>{stat.caption}</span>
          </p>
        ))}
      </div>
      {leads && <LeadBars leads={leads} />}
      {media && (
        <div
          className={`relative shrink-0 overflow-hidden rounded-lg border border-border-on-dark bg-brand-navy ${
            leads
              ? 'slb-photo h-[186px] w-full sm:w-[300px]'
              : section.stats.length > 1
                ? 'h-[224px] w-full sm:w-[398px]'
                : section.readings
                  ? 'h-[150px] w-full sm:w-[220px]'
                  : 'h-[186px] w-full sm:w-[300px]'
          }`}
        >
          <Image
            src={media.image.src}
            alt={media.image.alt}
            fill
            sizes="(min-width: 480px) 400px, 100vw"
            quality={75}
            className="object-cover"
          />
          <div aria-hidden className="industry-photo-grade absolute inset-0" />
          <p
            className={`absolute right-4 bottom-[14px] left-4 ${
              media.labelStyle === 'title'
                ? 'text-[17px] leading-body-s font-extrabold tracking-display text-neutral-0'
                : 'text-micro font-bold tracking-[0.13em] text-viz-gold'
            }`}
          >
            {media.label}
          </p>
        </div>
      )}
    </>
  );

  return (
    <section
      aria-labelledby={id}
      className={`${sectionBg[section.tone ?? 'light']} ${section.tone ? '' : 'border-b border-border'}`}
    >
      <div className="container-page flex flex-col gap-10 py-16 md:py-20 xl:flex-row xl:items-center xl:gap-16">
        {leads ? (
          // Stacked like the Paper strip: the bars grow in under the stat as the column scrolls in.
          <Motion className="motion flex w-full shrink-0 flex-col sm:w-[300px]" replay={false}>
            {column}
          </Motion>
        ) : (
          <div className={`flex shrink-0 flex-col gap-8 sm:flex-row sm:items-center ${section.stats.length > 1 ? 'xl:gap-12' : ''}`}>
            {column}
          </div>
        )}

        <div className="flex grow basis-0 flex-col gap-[10px]">
          <h2
            id={id}
            className={`text-[22px] leading-[28px] font-semibold tracking-display md:text-h3 md:leading-body-l ${
              dark ? 'text-neutral-0' : 'text-text'
            }`}
          >
            {section.heading}
          </h2>
          <p className={`text-body text-pretty ${dark ? 'text-text-on-dark-muted' : 'text-text-muted'}`}>{section.body}</p>
          {section.illustrative && <Illustrative dark={dark} />}
        </div>

        {section.link && (
          <Link
            href={section.link.href}
            className={`inline-flex h-12 shrink-0 items-center justify-center self-start rounded-full border-[1.5px] px-6 text-body-s leading-caption font-semibold tracking-[0.02em] xl:self-center ${
              dark ? 'border-neutral-0 text-neutral-0 hover:bg-white/8' : 'border-brand-navy text-brand-navy hover:bg-neutral-50'
            }`}
          >
            {section.link.label}
            <span aria-hidden className="slb-arrow">
              →
            </span>
          </Link>
        )}

        {section.readings && (
          <div className="w-full shrink-0 overflow-hidden rounded-md border border-border bg-neutral-0 xl:w-[280px]">
            <div aria-hidden className="flex items-center justify-between bg-surface-raised px-4 py-[10px]">
              <span className="text-[10px] leading-3 font-semibold tracking-label text-text-muted">{section.readings.title}</span>
              <span className="text-micro text-text-muted">{section.readings.unit}</span>
            </div>
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">{`${section.readings.title}, ${section.readings.unit}`}</caption>
              <tbody>
                {section.readings.rows.map((row) => (
                  <tr key={row.time} className="border-t border-border">
                    <th scope="row" className="w-[62px] py-[9px] pl-4 text-left text-micro font-semibold text-text">
                      {row.time}
                    </th>
                    <td className="py-[9px] pr-4">
                      <span className="flex items-center gap-[10px] text-body-s leading-5 text-text">
                        <Dot tone={row.tone} />
                        {row.text}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Press: coverage, explained rather than logo-walled

function PressSection({ section }: { section: Of<'press'> }) {
  return (
    <section aria-label={section.eyebrow} className={sectionBg[section.tone ?? 'sunken']}>
      <div className="container-page flex flex-col gap-10 py-16 lg:flex-row lg:items-center lg:gap-16">
        <div className="flex shrink-0 flex-col gap-2 lg:w-[300px]">
          <p className="text-[11px] leading-[14px] font-semibold tracking-[0.16em] text-text-muted">{section.eyebrow}</p>
          <p className="text-body leading-6 text-text">{section.text}</p>
          <div className="relative mt-[14px] h-[176px] overflow-hidden rounded-lg bg-neutral-900">
            <Image
              src={section.media.image.src}
              alt={section.media.image.alt}
              fill
              sizes="(min-width: 1024px) 300px, 100vw"
              quality={75}
              className="object-cover"
            />
            <div aria-hidden className="industry-photo-grade absolute inset-0" />
            <p className="absolute right-4 bottom-[14px] left-4 text-caption font-bold tracking-heading text-neutral-0">
              {section.media.title}
            </p>
          </div>
        </div>
        <ul className="grid grow basis-0 gap-8 sm:grid-cols-2 lg:gap-12">
          {section.items.map((item) => (
            <li key={item.name} className="flex flex-col gap-1.5 border-l border-border-strong pl-6">
              <p className="text-body leading-5 font-bold tracking-[0.02em] text-text">{item.name}</p>
              <p className="text-body-s text-text-muted">{item.text}</p>
            </li>
          ))}
        </ul>
        <Link href={section.link.href} className="shrink-0 text-body-s font-semibold text-brand-blue hover:underline">
          {section.link.label}
        </Link>
      </div>
    </section>
  );
}
