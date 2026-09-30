'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Motion } from '@/components/motion';
import { usePlanFit } from '@/components/pricing/plan-fit';
import {
  DEFAULT_QUOTE_PICKS,
  MAX_CONSULTING_DAYS,
  MAX_SITES,
  QUOTE_API_VOLUMES,
  QUOTE_CHANNELS,
  QUOTE_CONNECTORS,
  QUOTE_PLANS,
  quoteDetailsHref,
  quoteDetailsLines,
  type QuoteDetails,
  type QuotePlanId,
} from '@/lib/quote-details';

type Factor = { name: string; body: string };

/**
 * "How is your quote calculated?" (pricing-sections.tsx,
 * styles/pricing-quote.css): the five factor rows, each with one input, and
 * the "Your quote details" card that lists the selections.
 *
 * "Number of sites" starts from the plan picked under "Best fit for" in the
 * plans section above (1, 10 or 50), and starts again from the new plan when
 * that pick changes.
 *
 * The card is sticky beside the rows from lg and sits after them, at the
 * bottom of the section, below that. It shows no prices; its button opens the
 * demo form with the selections in the query string (lib/quote-details.ts).
 * Each row fades up once as it scrolls in; with reduced motion it does not.
 *
 * Every input is a native control (checkbox, radio, number field, button),
 * so the keyboard and assistive tech get them as they are.
 */
export function QuoteBuilder({ factors }: { factors: Factor[] }) {
  const picked = usePlanFit();
  const plan = QUOTE_PLANS.find((p) => p.id === picked) ?? QUOTE_PLANS[0];
  // A site count the visitor set, kept only while the plan it was set under is still the pick.
  const [edited, setEdited] = useState<{ plan: QuotePlanId; sites: number } | null>(null);
  const [picks, setPicks] = useState(DEFAULT_QUOTE_PICKS);
  const set = (change: Partial<typeof picks>) => setPicks((p) => ({ ...p, ...change }));

  const details: QuoteDetails = {
    ...picks,
    plan: plan.id,
    sites: edited?.plan === plan.id ? edited.sites : plan.sites,
  };

  // One input per factor, in the order content/pricing.ts lists the factors.
  const inputs = [
    (labelledBy: string) => (
      <Stepper
        labelledBy={labelledBy}
        unit={['site', 'sites']}
        min={1}
        max={MAX_SITES}
        value={details.sites}
        onChange={(sites) => setEdited({ plan: plan.id, sites })}
      />
    ),
    (labelledBy: string) => (
      <div role="group" aria-labelledby={labelledBy} className="flex flex-wrap gap-2">
        {QUOTE_CHANNELS.map((channel) => (
          <Chip
            key={channel.id}
            name="quote-channels"
            checked={details.channels.includes(channel.id)}
            onChange={() => set({ channels: toggled(QUOTE_CHANNELS, details.channels, channel.id) })}
          >
            {channel.label}
          </Chip>
        ))}
      </div>
    ),
    (labelledBy: string) => (
      <div
        role="radiogroup"
        aria-labelledby={labelledBy}
        className="flex h-11 gap-[2px] self-start rounded-md border border-border-strong bg-neutral-0 p-[3px]"
      >
        {QUOTE_API_VOLUMES.map((volume) => (
          <label
            key={volume.id}
            className="relative flex w-[88px] cursor-pointer items-center justify-center rounded-[7px] border border-transparent text-body-s font-semibold text-neutral-700 hover:bg-brand-blue/6 hover:text-text has-[:checked]:border-brand-blue has-[:checked]:bg-brand-blue/10 has-[:checked]:text-brand-blue has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-1 has-[:focus-visible]:outline-alert-info"
          >
            <input
              type="radio"
              name="quote-api"
              className="sr-only"
              checked={details.api === volume.id}
              onChange={() => set({ api: volume.id })}
            />
            {volume.label}
          </label>
        ))}
      </div>
    ),
    (labelledBy: string) => (
      <div role="group" aria-labelledby={labelledBy} className="flex flex-wrap gap-2">
        {QUOTE_CONNECTORS.map((connector) => (
          <Chip
            key={connector.id}
            name="quote-connectors"
            checked={details.connectors.includes(connector.id)}
            onChange={() => set({ connectors: toggled(QUOTE_CONNECTORS, details.connectors, connector.id) })}
          >
            {connector.label}
          </Chip>
        ))}
      </div>
    ),
    (labelledBy: string) => (
      <Stepper
        labelledBy={labelledBy}
        unit={['day', 'days']}
        min={0}
        max={MAX_CONSULTING_DAYS}
        value={details.consulting}
        onChange={(consulting) => set({ consulting })}
      />
    ),
  ];

  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12 xl:gap-16">
      <ol className="flex min-w-0 grow basis-0 flex-col border-t border-border-strong">
        {factors.map((f, i) => {
          const id = `quote-factor-${i + 1}`;
          return (
            <Motion as="li" key={f.name} replay={false} threshold={0.2} className="motion border-b border-border">
              <div className="pricing-quote-rise flex flex-col gap-2 py-6 md:flex-row md:gap-6 lg:flex-col lg:gap-2 min-[1240px]:flex-row min-[1240px]:gap-6">
                <span
                  aria-hidden
                  className="text-micro leading-body font-semibold tracking-label text-brand-blue md:w-12 md:shrink-0"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 id={id} className="text-body-l leading-body font-semibold text-text md:w-[220px] md:shrink-0">
                  {f.name}
                </h3>
                <div className="flex min-w-0 grow basis-0 flex-col gap-4">
                  <p className="text-body text-text-muted">{f.body}</p>
                  {inputs[i]?.(id)}
                </div>
              </div>
            </Motion>
          );
        })}
      </ol>

      <aside
        aria-labelledby="quote-details-heading"
        className="flex flex-col gap-5 rounded-lg border border-border bg-neutral-0 p-6 sm:p-7 lg:sticky lg:top-[calc(var(--site-header-h)+24px)] lg:w-[340px] lg:shrink-0 xl:w-[384px]"
      >
        <div className="flex flex-col gap-[6px]">
          <h3
            id="quote-details-heading"
            className="text-[22px] leading-h4 font-extrabold tracking-[-0.02em] text-text"
          >
            Your quote details
          </h3>
          <p className="text-body-s text-text-muted">Updates as you change the inputs.</p>
        </div>
        <dl aria-live="polite" className="flex flex-col border-t border-border-strong">
          {quoteDetailsLines(details).map((line) => (
            <div key={line.label} className="flex gap-4 border-b border-border py-3">
              <dt className="w-[132px] shrink-0 text-caption leading-body-s text-text-muted">{line.label}</dt>
              <dd className="min-w-0 grow text-body-s font-semibold text-text">{line.value}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-col gap-3">
          {/* Not prefetched: the href changes with every input. */}
          <Link
            href={quoteDetailsHref(details)}
            prefetch={false}
            className="bg-gold-button flex min-h-12 items-center justify-center gap-[10px] rounded-full px-4 py-2 text-center text-body-s leading-caption font-extrabold tracking-[0.02em] text-brand-navy transition hover:brightness-[1.06]"
          >
            Get a quote with these details
            <span aria-hidden>→</span>
          </Link>
          <p className="text-caption text-text-muted">Opens the demo form with these details filled in.</p>
        </div>
      </aside>
    </div>
  );
}

/** `ids` with `id` switched on or off, kept in the list's own order. */
function toggled<T extends string>(all: readonly { id: T }[], ids: readonly T[], id: T): T[] {
  return all.map((item) => item.id).filter((item) => (item === id) !== ids.includes(item));
}

function Tick({ className }: { className: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className={`shrink-0 ${className}`}>
      <path
        d="M3 7.4l2.6 2.6L11 4.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** A checkbox drawn as a pill. Selected adds a tick, so it is never colour alone. */
function Chip({
  name,
  checked,
  onChange,
  children,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
}) {
  return (
    <label className="group relative flex h-9 cursor-pointer items-center gap-[6px] rounded-full border border-border-strong bg-neutral-0 px-[14px] text-body-s font-semibold text-neutral-700 hover:border-neutral-600 hover:bg-brand-blue/6 hover:text-text has-[:checked]:border-brand-blue has-[:checked]:bg-brand-blue/10 has-[:checked]:pl-3 has-[:checked]:text-brand-blue has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-alert-info">
      <input type="checkbox" name={name} className="sr-only" checked={checked} onChange={onChange} />
      <Tick className="hidden group-has-[:checked]:block" />
      <span>{children}</span>
    </label>
  );
}

/** Minus, a number field, plus. The field takes typing and the arrow keys. */
function Stepper({
  labelledBy,
  unit,
  min,
  max,
  value,
  onChange,
}: {
  labelledBy: string;
  /** Singular and plural, e.g. ['site', 'sites']. */
  unit: [string, string];
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}) {
  // What is being typed, while it is being typed; otherwise the field shows the value.
  const [draft, setDraft] = useState<string | null>(null);
  const step = (by: number) => {
    setDraft(null);
    onChange(Math.min(max, Math.max(min, value + by)));
  };
  // aria-disabled, not disabled: a button that reaches its limit keeps keyboard focus.
  const button =
    'flex h-full w-11 shrink-0 items-center justify-center text-text hover:bg-brand-blue/6 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-alert-info aria-disabled:cursor-not-allowed aria-disabled:text-neutral-400 aria-disabled:hover:bg-transparent';

  return (
    <div role="group" aria-labelledby={labelledBy} className="flex items-center gap-3">
      <div className="flex h-11 overflow-hidden rounded-md border border-border-strong bg-neutral-0">
        <button
          type="button"
          aria-label={`Remove one ${unit[0]}`}
          aria-disabled={value <= min}
          onClick={() => step(-1)}
          className={button}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        <input
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          step={1}
          aria-labelledby={labelledBy}
          value={draft ?? value}
          onChange={(event) => {
            const raw = event.target.value;
            setDraft(raw);
            const typed = Number(raw);
            if (raw !== '' && Number.isInteger(typed)) onChange(Math.min(max, Math.max(min, typed)));
          }}
          onBlur={() => setDraft(null)}
          className="pricing-quote-number h-full w-16 border-x border-border bg-transparent text-center text-body font-bold text-text focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-alert-info"
        />
        <button
          type="button"
          aria-label={`Add one ${unit[0]}`}
          aria-disabled={value >= max}
          onClick={() => step(1)}
          className={button}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M2 7h10M7 2v10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <span aria-hidden className="text-body-s text-text-muted">
        {value === 1 ? unit[0] : unit[1]}
      </span>
    </div>
  );
}
