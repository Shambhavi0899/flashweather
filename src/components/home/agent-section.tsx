import Link from 'next/link';

import { AgentChat } from '@/components/agent-conversation/agent-chat';
import { AgentConversation } from '@/components/agent-conversation/agent-conversation';
import { Motion } from '@/components/motion';
import { agentHarness, agentTabs } from '@/content/home';

import { AgentChart } from './agent-charts';

/**
 * "Ask the question your crew actually asks": the harness (engine → agent →
 * your tools), then industry tabs over one Flash Agent conversation each.
 *
 * The tabs are a radio group; each panel is shown by a `:has(#radio:checked)`
 * rule on the wrapper, so every conversation is in the server HTML and a
 * crawler reads all five, and the tabs work without JavaScript. Each panel is
 * the shared <AgentConversation>; <AgentChat> only adds the playback: the
 * query types and sends, the agent thinks, then the answer, chart, context
 * and actions arrive (styles/agent-conversation.css, `chat-*`).
 * Class names are listed literally so Tailwind can see them.
 *
 * The industry pages and the Industries hub show this same section; the only
 * difference is `defaultTab`, the tab that is open (and plays first) when the
 * section scrolls in. The home page leaves it at the first tab.
 *
 * The Flash Agent page shows it too (components/agent/ask-by-industry.tsx),
 * with its question chips under the chat: `children` sit inside the player,
 * below the conversations, `askNote` is what each conversation shows once a
 * chip has typed a question into it, and `seeAgentLink` is off there, since
 * the link would point at the page it is on.
 */
const PANEL_VISIBLE: Record<string, string> = {
  construction: 'group-has-[#agent-tab-construction:checked]/tabs:flex',
  roofing: 'group-has-[#agent-tab-roofing:checked]/tabs:flex',
  agriculture: 'group-has-[#agent-tab-agriculture:checked]/tabs:flex',
  golf: 'group-has-[#agent-tab-golf:checked]/tabs:flex',
  schools: 'group-has-[#agent-tab-schools:checked]/tabs:flex',
};

export function AgentSection({
  defaultTab = agentTabs[0].id,
  askNote,
  seeAgentLink = true,
  children,
}: {
  defaultTab?: string;
  askNote?: React.ReactNode;
  seeAgentLink?: boolean;
  children?: React.ReactNode;
} = {}) {
  return (
    <section id="flash-agent" aria-labelledby="agent-heading" className="scroll-mt-4 bg-brand-navy">
      <div className="container-page flex flex-col gap-11 py-20 lg:py-[120px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="flex max-w-[780px] flex-col gap-[18px]">
            <p className="text-[11px] leading-4 font-bold tracking-[0.13em] text-viz-gold uppercase md:text-micro">
              Flash Agent · ask in plain language
            </p>
            <h2
              id="agent-heading"
              className="text-[28px] leading-8 font-extrabold tracking-[-0.03em] text-text-on-dark md:text-display-l md:leading-display-l md:tracking-[-0.05em]"
            >
              Ask the question your crew actually asks.
            </h2>
            <p className="text-[15px] leading-[23px] text-pretty text-[#C9D1E3] md:text-[17px] md:leading-h4">
              Pick your industry. Flash Agent answers from the same 1×1 km forecast, refreshed every two minutes, then
              acts in the tools you already run.
            </p>
          </div>
          <div className="flex flex-col gap-[6px] lg:w-[300px] lg:shrink xl:shrink-0 lg:items-end lg:text-right">
            <p className="text-[10px] leading-[14px] font-bold tracking-[0.13em] text-[#8F9AB8] uppercase md:text-[11px]">
              Illustrative example · not live weather
            </p>
            <p className="text-caption leading-5 text-[#8F9AB8]">Thresholds are yours. Sites come from your CRM or ERP.</p>
          </div>
        </div>

        {/* The harness: cards rise in turn and the arrows draw between them, once. */}
        <Motion as="ol" replay={false} className="motion flow flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-0">
          {agentHarness.map((step, i) => (
            <li key={step.tag} className="flow-step flex flex-col lg:flex-1 lg:flex-row">
              <div
                className={`flow-card flex grow flex-col gap-2 rounded-lg border px-[26px] py-6 ${
                  step.highlight ? 'border-viz-gold/55 bg-viz-gold/6' : 'border-white/12 bg-white/3'
                }`}
              >
                <p className="text-[10px] leading-3 font-bold tracking-[0.13em] text-viz-gold uppercase md:text-[11px] md:leading-[14px]">
                  {step.tag}
                </p>
                <h3 className="text-caption font-bold text-text-on-dark md:text-[17px] md:leading-6">{step.title}</h3>
                <p className="text-[11px] leading-4 text-text-on-dark-muted md:text-caption md:leading-5">{step.body}</p>
              </div>
              {i < agentHarness.length - 1 && (
                <span
                  aria-hidden
                  className="flow-arrow hidden w-14 shrink-0 items-center justify-center text-h3 leading-body-l font-extrabold text-viz-gold lg:flex"
                >
                  →
                </span>
              )}
            </li>
          ))}
        </Motion>

        <AgentChat className={`group/tabs flex flex-col gap-8 ${children ? 'agq-root' : ''}`}>
          {/* Five equal columns from lg; below, one snap-scrolling row that the
              script keeps the picked tab centred in. The underline is the
              label's own border, so it spans the whole column. */}
          <fieldset className="min-w-0">
            <legend className="sr-only">Pick your industry</legend>
            <div
              data-chat-tabs
              className="chat-tabs flex snap-x snap-mandatory gap-1 overflow-x-auto border-b border-white/12 lg:grid lg:grid-cols-5 lg:gap-0 lg:overflow-visible"
            >
              {/* Each label is `relative` so its visually hidden radio stays
                  inside the scrolling row instead of widening the page. */}
              {agentTabs.map((tab) => (
                <label
                  key={tab.id}
                  htmlFor={`agent-tab-${tab.id}`}
                  className="relative -mb-px flex shrink-0 cursor-pointer snap-center items-center justify-center border-b-2 border-transparent px-5 py-[14px] text-center text-caption leading-4 font-bold whitespace-nowrap text-[#8F9AB8] transition hover:text-text-on-dark has-[:checked]:border-viz-gold has-[:checked]:font-extrabold has-[:checked]:text-text-on-dark has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-alert-info lg:px-3 lg:text-body-s lg:leading-caption"
                >
                  <input
                    type="radio"
                    name="home-agent-industry"
                    id={`agent-tab-${tab.id}`}
                    value={tab.id}
                    defaultChecked={tab.id === defaultTab}
                    className="sr-only"
                  />
                  {tab.label}
                </label>
              ))}
            </div>
          </fieldset>

          {/* The stage takes the open panel's height (measured by the script)
              and eases between them when the tab changes; without JS it is
              simply as tall as its content. */}
          <div data-chat-stage className="chat-stage">
            {agentTabs.map((tab) => (
              <AgentConversation
                key={tab.id}
                question={tab.question}
                reply={tab.answer}
                chart={<AgentChart chart={tab.answer.chart} />}
                label={`${tab.label}: Flash Agent answers "${tab.question}"`}
                askNote={askNote}
                className={`hidden ${PANEL_VISIBLE[tab.id]}`}
              />
            ))}
          </div>

          {children}
        </AgentChat>

        {seeAgentLink && (
          <p className="text-body-s leading-5 font-bold text-text-on-dark">
            <Link href="/products/flash-agent/" className="hover:text-viz-gold">
              See Flash Agent <span aria-hidden>→</span>
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
