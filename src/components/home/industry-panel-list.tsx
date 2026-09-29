import Image from 'next/image';
import Link from 'next/link';

import type { AgentStatus } from '@/content/home';

import { AgentBadge } from './bolt-icon';
import { IndustryPanels } from './industry-panels';

const STATUS_BG: Record<AgentStatus, string> = {
  warning: 'bg-alert-warning',
  clear: 'bg-alert-clear',
  watch: 'bg-alert-watch',
};

export type IndustryPanel = {
  id: string;
  name: string;
  image: { src: string; alt: string };
  /** Who makes the call. */
  role: string;
  /** Their call, as a question. */
  question: string;
  /** Flash Agent's verdict; with a `line`, the full chip (home), without, the mini one. */
  agent: { status: { tone: AgentStatus; label: string }; line?: string };
  /** Supporting copy, shown between the verdict and the link. */
  body?: string;
  href: string;
  linkLabel: string;
};

/**
 * The expanding photo panels: the home page's "Built for the person who has
 * to make the call" and the Lightning page's "Who makes the lightning call".
 * A row from lg up (the open panel takes `--ind-grow` shares of the width to
 * one per closed panel); below that, a stacked accordion. The open panel
 * shows who makes the call, the call, Flash Agent's verdict and the link.
 *
 * The panels are a radio group and the open one is picked by
 * `:has(:checked)` (styles/home.css, `ind-*`), so every panel is in the
 * server HTML and they open without JavaScript. <IndustryPanels> adds hover
 * and the 5s advance; the caller's <Motion class="motion"> plays the
 * scroll-in. Both sizes are fixed, so opening a panel moves nothing outside
 * the section.
 */
export function IndustryPanelList({
  panels,
  name,
  labelledBy,
}: {
  panels: IndustryPanel[];
  /** The radio group's name, and the prefix of each panel heading's id; unique on the page. */
  name: string;
  /** The id of the section heading that names the group. */
  labelledBy: string;
}) {
  return (
    <IndustryPanels labelledBy={labelledBy} className="ind-panels">
      <ul className="ind-list">
        {panels.map((panel, i) => (
          <li key={panel.id} data-panel className="ind-panel">
            <span className="ind-photo">
              <Image
                src={panel.image.src}
                alt={panel.image.alt}
                fill
                sizes="(min-width: 1024px) 932px, 824px"
                className="object-cover"
              />
            </span>
            <span aria-hidden className="ind-shade" />
            <span aria-hidden className="ind-grade" />
            <span aria-hidden className="ind-bar">
              <span className="ind-bar-fill" />
            </span>

            <h3
              id={`${name}-${panel.id}`}
              className="ind-name text-body-l leading-6 font-extrabold tracking-[-0.02em] text-text-on-dark"
            >
              {panel.name}
            </h3>
            <svg aria-hidden viewBox="0 0 16 16" className="ind-plus size-4">
              <path d="M8 2v12M2 8h12" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>

            {/* The whole panel is the radio's label: a click or tap anywhere opens it. */}
            <label className="ind-hit">
              <input
                type="radio"
                name={name}
                defaultChecked={i === 0}
                aria-labelledby={`${name}-${panel.id}`}
                className="ind-radio sr-only"
              />
            </label>

            <div className="ind-body">
              <p className="ind-rise text-[11px] leading-[14px] font-bold tracking-label text-viz-gold uppercase lg:text-micro lg:leading-micro">
                {panel.role}
              </p>
              <p className="ind-rise max-w-[500px] text-h4 leading-[26px] font-extrabold tracking-[-0.03em] text-text-on-dark lg:text-[22px] lg:leading-7 xl:text-[26px] xl:leading-8">
                {panel.question}
              </p>
              {panel.agent.line ? (
                <div className="ind-rise grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-[10px] rounded-[14px] border border-white/12 bg-brand-navy-deep/78 p-[14px] lg:gap-y-2 lg:px-4">
                  <AgentBadge className="size-7 rounded-lg lg:size-8" />
                  <AgentVerdict status={panel.agent.status} />
                  <p className="col-span-2 max-w-[440px] text-body-s leading-[21px] font-medium text-[#C9D1E3] lg:col-span-1 lg:col-start-2">
                    {panel.agent.line}
                  </p>
                </div>
              ) : (
                <div className="ind-rise flex items-center gap-3 self-start rounded-[14px] border border-white/12 bg-brand-navy-deep/78 py-2 pr-2 pl-2 lg:pr-2.5">
                  <AgentBadge className="size-7 rounded-lg" />
                  <AgentVerdict status={panel.agent.status} />
                </div>
              )}
              {panel.body && (
                <p className="ind-rise max-w-[460px] text-body-s leading-[21px] text-pretty text-[#C9D1E3]">
                  {panel.body}
                </p>
              )}
              <Link
                href={panel.href}
                className="ind-rise ind-link self-start py-[2px] text-body-s leading-5 font-bold text-viz-gold hover:underline"
              >
                {panel.linkLabel}
                <span aria-hidden>&nbsp;→</span>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </IndustryPanels>
  );
}

function AgentVerdict({ status }: { status: IndustryPanel['agent']['status'] }) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-x-[10px] gap-y-2">
      <p className="text-[10px] leading-3 font-extrabold tracking-[0.13em] text-text-on-dark lg:text-[11px] lg:leading-[14px]">
        FLASH AGENT
      </p>
      <p
        className={`flex h-[26px] items-center gap-2 rounded-[13px] px-3 text-[10px] leading-3 font-extrabold tracking-[0.08em] text-text-on-dark uppercase lg:text-[11px] lg:leading-[14px] ${
          STATUS_BG[status.tone]
        }`}
      >
        <span aria-hidden className="size-2 shrink-0 rounded-[2px] bg-text-on-dark" />
        {status.label}
      </p>
    </div>
  );
}
