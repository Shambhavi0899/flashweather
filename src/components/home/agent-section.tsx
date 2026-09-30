import Link from 'next/link';

import { AgentChat } from '@/components/agent-conversation/agent-chat';
import { AgentConversation } from '@/components/agent-conversation/agent-conversation';
import { Logo } from '@/components/logo';
import { agentIndustries } from '@/content/agent';
import { type AgentTab, agentTabs } from '@/content/home';
import { DEMO_HREF } from '@/content/navigation';

import { AgentChart } from './agent-charts';
import { AgentFlow } from './agent-flow';
import { AgentTour } from './agent-tour';
import { BoltIcon } from './bolt-icon';

/**
 * "Ask the question your crew actually asks": the diagram of how the agent
 * works (<AgentFlow>: your tools and the engine run into Flash Agent, its
 * answer goes to the crew), then industry tabs over a list of that crew's
 * questions and one Flash Agent conversation.
 *
 * The tabs are a radio group; each tab's list and panel are shown by a
 * `:has(#radio:checked)` rule on the wrapper, so every question and every
 * conversation is in the server HTML, a crawler reads all five, and the tabs
 * work without JavaScript. The five lists, and the five panels, are laid over
 * each other (one row, each the row's full width, pulled back over the one
 * before it) and only the open tab's is visible, so the window is always as
 * tall as its tallest conversation: it does not change height between tabs. Each panel is the shared <AgentConversation>;
 * <AgentChat> only adds the playback: the query types and sends, the agent
 * thinks, then the answer, chart, context and actions arrive
 * (styles/agent-conversation.css, `chat-*`). Class names are listed literally
 * so Tailwind can see them.
 *
 * The questions are the Flash Agent page's lists (content/agent.ts
 * `agentIndustries`), the one the tab's conversation answers first. That one
 * plays the conversation. The others have no prepared answer and none is
 * made up: a click types the question into the panel's composer, unsent, and
 * shows the demo note under it (`data-chat-ask`, <AgentChat>).
 *
 * <AgentTour> runs the section by itself until the visitor takes over: tab
 * by tab, each one's conversation, with a gold line under the open tab
 * counting down to the next (agent-tour.tsx, styles/agent-tour.css).
 *
 * Every page shows this same section: the home page, the industry pages and
 * the Industries hub, and the Flash Agent page. The differences are
 * `defaultTab`, the tab that is open (and where the tour starts) when the
 * section scrolls in, and `seeAgentLink`, off on the Flash Agent page, where
 * the link would point at the page it is on.
 */
/** A tab's list or panel: in the stack, visible while its tab is open. */
const STACKED = 'invisible -mr-[100%] w-full shrink-0';
const PANEL_VISIBLE: Record<string, string> = {
  construction: 'group-has-[#agent-tab-construction:checked]/tabs:visible',
  roofing: 'group-has-[#agent-tab-roofing:checked]/tabs:visible',
  agriculture: 'group-has-[#agent-tab-agriculture:checked]/tabs:visible',
  golf: 'group-has-[#agent-tab-golf:checked]/tabs:visible',
  schools: 'group-has-[#agent-tab-schools:checked]/tabs:visible',
};

/** A tab's questions: the one its conversation answers, then its industry's others. */
function questionsOf(tab: AgentTab) {
  const others = agentIndustries.find((industry) => industry.id === tab.id)?.questions ?? [];
  return [tab.question, ...others.filter((question) => question !== tab.question)];
}

/** What the composer shows under a question that has no prepared answer. */
const askNote = (
  <>
    <span>See this answered for your own sites in a live demo</span>
    <Link href={DEMO_HREF} className="font-bold text-viz-gold underline-offset-4 hover:underline">
      Book a demo <span aria-hidden>→</span>
    </Link>
  </>
);

export function AgentSection({
  defaultTab = agentTabs[0].id,
  seeAgentLink = true,
}: {
  defaultTab?: string;
  seeAgentLink?: boolean;
} = {}) {
  return (
    <section
      id="flash-agent"
      aria-labelledby="agent-heading"
      className="agent-stage scroll-mt-4 overflow-x-clip bg-neutral-100"
    >
      <div className="container-page flex flex-col gap-11 py-20 lg:py-[120px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="flex max-w-[780px] flex-col gap-[18px]">
            <p className="text-[11px] leading-4 font-bold tracking-[0.13em] text-brand-blue uppercase md:text-micro">
              Flash Agent · ask in plain language
            </p>
            <h2
              id="agent-heading"
              className="text-[28px] leading-8 font-extrabold tracking-[-0.03em] text-brand-navy md:text-display-l md:leading-display-l md:tracking-[-0.05em]"
            >
              Ask the question your crew actually asks.
            </h2>
            <p className="text-[15px] leading-[23px] text-pretty text-neutral-700 md:text-[17px] md:leading-h4">
              Pick your industry. Flash Agent answers from the same 1×1 km forecast, refreshed every two minutes, then
              acts in the tools you already run.
            </p>
          </div>
          <p className="text-caption leading-5 text-text-muted lg:w-[300px] lg:shrink lg:text-right xl:shrink-0">
            Thresholds are yours. Sites come from your CRM or ERP.
          </p>
        </div>

        <AgentFlow />

        <AgentChat className="group/tabs flex min-w-0 flex-col gap-8">
          <AgentTour>
            {/* Five equal columns on one line from lg; below, one snap-scrolling
              row that the script keeps the picked tab centred in. The line
              under the open tab spans the whole column; on the tour it fills
              (.agent-tab-line). */}
            <fieldset className="min-w-0">
              <legend className="sr-only">Pick your industry</legend>
              <div
                data-chat-tabs
                className="chat-tabs flex snap-x snap-mandatory gap-1 overflow-x-auto border-b border-border-strong lg:gap-0 lg:overflow-visible"
              >
                {/* Each label is `relative` so its visually hidden radio stays
                inside the scrolling row instead of widening the page. */}
                {agentTabs.map((tab) => (
                  <label
                    key={tab.id}
                    htmlFor={`agent-tab-${tab.id}`}
                    className="agent-tab relative -mb-px flex shrink-0 cursor-pointer snap-center items-center justify-center border-b-2 border-transparent px-5 py-[14px] text-center text-caption leading-4 font-bold whitespace-nowrap text-text-muted transition hover:text-brand-navy has-[:checked]:font-extrabold has-[:checked]:text-brand-navy has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-alert-info lg:min-w-0 lg:flex-1 lg:basis-0 lg:px-3 lg:text-body-s lg:leading-caption"
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
                    <span aria-hidden className="agent-tab-line">
                      <span data-tour-fill className="agent-tab-fill" />
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="flex flex-col gap-3">
              {/* The app window (styles/agent-window.css): a title bar, a gold
                frame whose light sweeps round once while the agent thinks,
                and a soft glow behind it. Inside, the open tab's questions
                and its conversation: from lg the list is a column on the
                left (38%) and the conversation is on the right; below, the
                list is a row of chips that scrolls sideways, over it. */}
              <div className="relative isolate">
                <div aria-hidden className="agent-window-glow" />
                <div className="agent-window">
                  <div aria-hidden className="agent-window-bar">
                    <span className="agent-window-lights">
                      <span />
                      <span />
                      <span />
                    </span>
                    <span className="agent-window-title">
                      <Logo variant="dark" size="window" link={false} alt="" />
                    </span>
                    <span className="agent-window-status">
                      <span className="agent-window-live" />
                      Live
                    </span>
                  </div>
                  <div className="flex flex-col lg:flex-row">
                    <div className="flex min-w-0 flex-col gap-3 px-5 pt-5 sm:px-8 sm:pt-8 lg:w-[38%] lg:shrink-0 lg:border-r lg:border-white/8 lg:bg-white/[0.025] lg:p-7 xl:p-8">
                      <p className="text-[10px] leading-[14px] font-bold tracking-[0.13em] text-[#8F9AB8] uppercase md:text-[11px]">
                        Questions crews ask
                      </p>
                      <div className="agent-query-lists flex">
                        {agentTabs.map((tab) => (
                          <ul
                            key={tab.id}
                            data-tour-list={tab.id}
                            aria-label={`Questions ${tab.label} crews ask`}
                            className={`agent-queries invisible flex ${PANEL_VISIBLE[tab.id]}`}
                          >
                            {questionsOf(tab).map((question, i) => (
                              <li key={question} className="flex">
                                {/* The first is the one the conversation answers; the rest are typed in, unsent. */}
                                <button
                                  type="button"
                                  data-tour-query
                                  aria-current={i === 0 ? 'true' : undefined}
                                  {...(i > 0 && {
                                    'data-chat-ask': question,
                                    'data-chat-ask-tab': `agent-tab-${tab.id}`,
                                  })}
                                  className="agent-query"
                                >
                                  <BoltIcon className="agent-query-bolt h-4 w-3" />
                                  <span>{question}</span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        ))}
                      </div>
                    </div>

                    {/* The stage is as tall as the tallest of the five panels,
                      which are laid over each other; a shorter conversation
                      keeps its composer at the foot of the window. */}
                    <div data-chat-stage className="flex min-w-0 lg:flex-1">
                      {agentTabs.map((tab) => (
                        <AgentConversation
                          key={tab.id}
                          question={tab.question}
                          reply={tab.answer}
                          chart={<AgentChart chart={tab.answer.chart} />}
                          label={`${tab.label}: Flash Agent answers "${tab.question}"`}
                          askNote={askNote}
                          inWindow
                          className={`flex ${STACKED} ${PANEL_VISIBLE[tab.id]}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-[10px] leading-[14px] font-bold tracking-[0.13em] text-text-muted uppercase md:text-[11px]">
                Illustrative example · not live weather
              </p>
            </div>
          </AgentTour>
        </AgentChat>

        {seeAgentLink && (
          <p className="text-body-s leading-5 font-bold text-brand-blue">
            <Link href="/products/flash-agent/" className="underline-offset-4 hover:underline">
              See Flash Agent <span aria-hidden>→</span>
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
