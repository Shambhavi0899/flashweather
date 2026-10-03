import { AgentBadge } from '@/components/home/bolt-icon';
import { Logo } from '@/components/logo';
import type { AgentReply } from '@/content/agent';

/**
 * One Flash Agent conversation: the crew's question, then Flash Agent's
 * answer (status badge, text, chart, context chips, proposed actions and
 * follow-ups), then the composer the question was typed into. It is the
 * panel every Flash Agent interface on the site shows, played by <AgentChat>
 * (./agent-chat.tsx) and drawn by the `chat-*` rules in
 * styles/agent-conversation.css; each section brings its own copy and chart.
 *
 * Every piece is laid out from the start (the playback only fades and draws),
 * so the panel is at its final height from the first frame and nothing jumps
 * while it plays.
 *
 * One layout, sized by the panel's own width (a container query), so the
 * same panel fits a full-width section, a hero's side column or a card beside
 * a list: from 886px of content (the home panel's width at the lg viewport,
 * so home switches exactly where it always has) the chart sits beside the
 * answer; narrower, they stack in the order the conversation builds: answer,
 * chart, chips. The chart keeps a 520px floor on phones only (it scrolls
 * sideways there); from md it scales to its column.
 *
 * A section shows the parts its copy has: the answer and its chips always,
 * and the site, status badge, chart and proposed actions when given (the
 * Troon case study has none of those four). The playback is the same either
 * way; a missing piece's step simply has nothing to show.
 */

/** A reply's answer and chips, and whichever of its other parts the section has. */
export type ConversationReply = Pick<AgentReply, 'answer' | 'chips'> & Partial<AgentReply>;

const STATUS_BG: Record<AgentReply['status']['tone'], string> = {
  warning: 'bg-alert-warning',
  clear: 'bg-alert-clear',
  watch: 'bg-alert-watch',
};

/** Written out in full so Tailwind can see them. */
const LAYOUT = {
  body: 'grid grid-cols-[minmax(0,1fr)] gap-6 @min-[886px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] @min-[886px]:gap-10',
  /** With no chart the answer has the panel's whole width. */
  bodyAlone: 'grid grid-cols-[minmax(0,1fr)] gap-6',
  text: 'flex min-w-0 flex-col gap-5 @max-[886px]:contents',
  chips: '@max-[886px]:order-3',
  chart: '@max-[886px]:order-2',
} as const;
/** In the app window: one column at any width, in the order the conversation builds, and tighter. */
const WINDOW_LAYOUT = {
  body: 'grid grid-cols-[minmax(0,1fr)] gap-4',
  bodyAlone: 'grid grid-cols-[minmax(0,1fr)] gap-4',
  text: 'contents',
  chips: 'order-3',
  /** The chart is held to 150px tall from md, centred, so every conversation fits one screen. */
  chart: 'order-2 md:[&_svg]:h-[140px] md:[&_svg]:w-full',
} as const;

export function AgentConversation({
  question,
  reply,
  chart,
  label,
  tabFor,
  placeholder = 'Ask about any site, any layer, any day…',
  askNote,
  inWindow = false,
  className = 'flex',
}: {
  question: string;
  reply: ConversationReply;
  /** The answer's visual, with `chat-bar` / `chat-line` / `chat-annot` hooks. Leave out for none. */
  chart?: React.ReactNode;
  /** The panel's accessible name. */
  label: string;
  /** The id of the tab radio that opens this panel, when the tabs do not map to panels one for one. */
  tabFor?: string;
  /** What the composer shows when nothing is being typed (the Flash Agent hero shows a carried ?q= here). */
  placeholder?: React.ReactNode;
  /**
   * Shown under the composer once a question chip has typed a question in
   * (`data-asked`, set by <AgentChat>); leave out where no chips point here.
   */
  askNote?: React.ReactNode;
  /**
   * Set inside an app window that draws its own frame (`.agent-window`,
   * styles/agent-window.css): the panel drops its card and gets more room
   * (except at the sides from lg to xl, where the 886px switch needs them),
   * the agent signs with the Flash logo, and the floating launcher steps
   * aside while the actions or composer would be under it. The window also
   * keeps the ask note's line from the start (agent-window.css), so typing a
   * question in does not change its height; the panel's foot is shorter for it.
   */
  inWindow?: boolean;
  /** Display and visibility (a tab's `group-has-[…]:flex`); `flex` by default. */
  className?: string;
}) {
  const hasActions = Boolean(reply.primaryAction || reply.secondaryAction || reply.followUps?.length);
  const layout = inWindow ? WINDOW_LAYOUT : LAYOUT;

  return (
    <article
      data-chat-panel
      data-chat-for={tabFor}
      aria-label={label}
      className={`chat min-w-0 flex-col ${
        inWindow
          ? 'gap-4 p-5 pb-4 sm:p-6 sm:pb-4 lg:px-7 lg:pt-4'
          : 'gap-6 rounded-[20px] border border-white/10 bg-brand-navy-deep/72 p-5 sm:p-7'
      } ${className}`}
    >
      <div className="chat-bubble flex justify-end">
        <p
          className={`rounded-[14px] rounded-br-xs bg-brand-blue px-4 text-caption leading-[19px] font-medium text-text-on-dark md:text-body-s md:leading-[21px] ${inWindow ? 'max-w-[640px] py-2.5' : 'max-w-[560px] py-3'}`}
        >
          {question}
        </p>
      </div>

      <div className={`@container relative flex flex-col ${inWindow ? 'gap-4' : 'gap-6'}`}>
        <div className="chat-agent flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* In the window the agent signs with the Flash logo. */}
            {inWindow ? (
              <Logo variant="dark" size="chat" link={false} alt="Flash Agent" />
            ) : (
              <>
                <AgentBadge />
                <p className="text-[10px] leading-3 font-extrabold tracking-[0.13em] text-text-on-dark md:text-micro md:leading-micro">
                  FLASH AGENT
                </p>
              </>
            )}
            {reply.site && <p className="text-micro text-[#8F9AB8]">· {reply.site}</p>}
          </div>
          {reply.status && (
            <p
              className={`chat-badge flex h-[30px] items-center gap-2 rounded-[15px] px-3 text-[10px] leading-3 font-extrabold tracking-[0.08em] text-text-on-dark uppercase md:text-micro md:leading-micro ${
                STATUS_BG[reply.status.tone]
              }`}
            >
              <span aria-hidden className="size-2 shrink-0 rounded-[2px] bg-text-on-dark" />
              {reply.status.label}
            </p>
          )}
        </div>

        {/* Shown only while the agent "thinks"; sits over the answer's first line. */}
        <span aria-hidden className="chat-dots absolute top-[54px] left-0 flex h-6 items-center gap-[6px]">
          <span className="size-[7px] rounded-full bg-[#8F9AB8]" />
          <span className="size-[7px] rounded-full bg-[#8F9AB8]" />
          <span className="size-[7px] rounded-full bg-[#8F9AB8]" />
        </span>

        <div className={chart ? layout.body : layout.bodyAlone}>
          <div className={layout.text}>
            <p
              className={`text-body-s leading-body-s text-text-on-dark ${inWindow ? 'md:text-[15px] md:leading-[22px]' : 'md:text-body md:leading-body'}`}
            >
              {reply.answer.split(' ').map((word, i) => (
                <span key={i}>
                  <span className="chat-word">{word}</span>{' '}
                </span>
              ))}
            </p>

            <ul className={`flex flex-wrap gap-2 ${layout.chips}`}>
              {reply.chips.map((chip) => (
                <li
                  key={chip.label}
                  className="chat-chip flex min-h-[28px] items-center gap-[6px] rounded-[14px] border border-white/12 bg-white/6 px-3 py-1 text-[10px] leading-3 md:text-micro md:leading-micro"
                >
                  <span className="text-[#8F9AB8]">{chip.label}</span>
                  <span className="font-bold text-text-on-dark">{chip.value}</span>
                </li>
              ))}
            </ul>
          </div>

          {chart && (
            <figure className={`chat-chart flex min-w-0 flex-col justify-center ${layout.chart}`}>
              <div className="relative -mx-1 overflow-x-auto px-1">
                <div className="max-md:min-w-[520px]">{chart}</div>
              </div>
              {reply.chartSummary && <figcaption className="sr-only">{reply.chartSummary}</figcaption>}
            </figure>
          )}
        </div>

        {/* The actions and follow-ups show what the agent proposes; they are
            illustrations, not controls, so they are not buttons. One row for
            the two actions and the confirm note, one for the follow-ups. */}
        {hasActions && (
          <div
            data-launcher-clear={inWindow || undefined}
            className={`chat-actions flex flex-col border-t border-white/10 ${inWindow ? 'gap-2.5 pt-3.5' : 'gap-4 pt-5'}`}
          >
            {(reply.primaryAction || reply.secondaryAction) && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                {reply.primaryAction && (
                  <span className="bg-gold-button flex min-h-11 items-center justify-center gap-[10px] rounded-xs px-[18px] text-caption leading-4 font-extrabold text-brand-navy">
                    {reply.primaryAction}
                    <span aria-hidden>↗</span>
                  </span>
                )}
                {reply.secondaryAction && (
                  <span className="flex min-h-11 items-center justify-center rounded-xs border border-white/40 px-[18px] text-caption leading-4 font-extrabold text-text-on-dark">
                    {reply.secondaryAction}
                  </span>
                )}
                {/* In the window the note wraps within the row rather than taking a row of its own. */}
                <span
                  className={`text-[10px] leading-[14px] text-[#8F9AB8] md:text-micro md:leading-micro ${inWindow ? 'min-w-[96px] flex-1' : ''}`}
                >
                  You confirm before anything changes.
                </span>
              </div>
            )}
            {reply.followUps && reply.followUps.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {reply.followUps.map((f) => (
                  <li
                    key={f}
                    className="flex min-h-[30px] items-center rounded-[15px] border border-white/18 px-[14px] py-1 text-[10px] leading-3 font-bold text-[#D1DBE8] md:text-micro md:leading-micro"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* The composer the question is typed into; an illustration, so hidden
          from assistive tech (the question itself is the bubble above). */}
      {/* In a window shared with taller conversations (the tabs' stack), it stays at the foot. */}
      <div
        data-launcher-clear={inWindow || undefined}
        className={`flex items-center gap-3 border-t border-white/10 ${inWindow ? 'mt-auto pt-3.5' : 'pt-5'}`}
      >
        <div
          aria-hidden
          className={`chat-composer flex min-w-0 grow items-center gap-3 rounded-full border border-white/12 bg-white/4 pr-[6px] pl-5 text-caption md:text-body-s ${inWindow ? 'h-11' : 'h-12'}`}
        >
          <span className="flex min-w-0 grow items-center overflow-hidden">
            <span data-chat-typed data-text={question} className="chat-typed truncate text-text-on-dark" />
            <span className="chat-caret h-4 w-px shrink-0 bg-viz-gold" />
            <span className="chat-placeholder truncate text-[#8F9AB8]">{placeholder}</span>
          </span>
          <span
            className={`bg-gold-button flex shrink-0 items-center justify-center rounded-full text-body-s font-extrabold text-brand-navy ${inWindow ? 'size-8' : 'size-9'}`}
          >
            ↑
          </span>
        </div>
        <button
          type="button"
          data-chat-replay
          className="chat-replay flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-full border border-white/20 px-4 text-micro font-bold text-[#C9D1E3] hover:border-white/40 hover:text-text-on-dark"
        >
          <span aria-hidden>↻</span>
          Replay
        </button>
      </div>

      {askNote && (
        <>
          {/* The composer is hidden from assistive tech, so the typed question is announced here. */}
          <p data-chat-asked-live aria-live="polite" className="sr-only" />
          <div className="chat-ask-note -mt-3 flex-wrap items-center gap-x-3 gap-y-1 px-5 text-caption leading-5 text-[#C9D1E3]">
            {askNote}
          </div>
        </>
      )}
    </article>
  );
}
