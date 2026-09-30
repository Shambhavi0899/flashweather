import { Logo } from '@/components/logo';
import { Motion } from '@/components/motion';
import { agentFlow } from '@/content/home';

const TAG = 'text-[10px] leading-3 font-bold tracking-[0.13em] uppercase md:text-[11px] md:leading-[14px]';

const ICON = {
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

/** The tools card's chips, in the order its title names them: calendar, Procore, Slack, Teams, ERP, CRM. */
const TOOL_ICONS = [
  'M4 3.5h8A1.5 1.5 0 0 1 13.5 5v7A1.5 1.5 0 0 1 12 13.5H4A1.5 1.5 0 0 1 2.5 12V5A1.5 1.5 0 0 1 4 3.5zM2.5 7h11M5.5 2v3M10.5 2v3',
  'M2.5 11.5h11M4 11.5V9a4 4 0 0 1 8 0v2.5M8 5V3.5',
  'M3 4.5A1.5 1.5 0 0 1 4.5 3h7A1.5 1.5 0 0 1 13 4.5v5a1.5 1.5 0 0 1-1.5 1.5H7l-3 2.5V11a1.5 1.5 0 0 1-1-1.5z',
  'M6 7.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM2.5 12.5a3.5 3.5 0 0 1 7 0M10.5 7.4a1.75 1.75 0 1 0 0-3.4M11.5 9.2a3 3 0 0 1 2.2 3.3',
  'M3.5 4.5C3.5 3.5 5.5 2.75 8 2.75s4.5.75 4.5 1.75S10.5 6.25 8 6.25 3.5 5.5 3.5 4.5zM3.5 4.5v7c0 1 2 1.75 4.5 1.75s4.5-.75 4.5-1.75v-7M3.5 8c0 1 2 1.75 4.5 1.75S12.5 9 12.5 8',
  'M3.5 3.5h9A1.5 1.5 0 0 1 14 5v6a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 11V5a1.5 1.5 0 0 1 1.5-1.5zM6 8a1.25 1.25 0 1 0 0-2.5A1.25 1.25 0 0 0 6 8zM4 10.5a2 2 0 0 1 4 0M10 6.5h2M10 9h2',
];

/** The engine card's hazards, each in its weather colour (`aflow-hazard-*`), in the order its body names them. */
const HAZARDS = [
  { id: 'lightning', d: 'M9 1.5 3.5 9H7l-1 5.5L12.5 7H9z' },
  {
    id: 'hail',
    d: 'M4.6 8.5a2.4 2.4 0 0 1 .3-4.8 3.4 3.4 0 0 1 6.5.8 2 2 0 0 1 0 4zM5.5 11.5v.01M8 13v.01M10.5 11.5v.01',
  },
  { id: 'heat', d: 'M8 2a1.5 1.5 0 0 0-1.5 1.5v5.2a3 3 0 1 0 3 0V3.5A1.5 1.5 0 0 0 8 2zM8 6v5' },
  { id: 'wind', d: 'M2 6h7.5a2 2 0 1 0-2-2M2 9h10a2 2 0 1 1-2 2M2 12h4' },
  { id: 'rain', d: 'M8 2s4 4.3 4 7.5a4 4 0 0 1-8 0C4 6.3 8 2 8 2z' },
  { id: 'frost', d: 'M8 2v12M2.8 5l10.4 6M13.2 5 2.8 11M6.5 3 8 4.5 9.5 3M6.5 13 8 11.5 9.5 13' },
];

/** What the crew decides: each outcome chip's tint and icon, in the order of `agentFlow.crew.outcomes`. */
const OUTCOMES = [
  { tone: 'go', d: 'M3 8.5 6.5 12 13 4.5' },
  { tone: 'move', d: 'M8 13.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM8 5v3.5l2 1.5' },
  { tone: 'alert', d: 'M4.5 11V7.5a3.5 3.5 0 0 1 7 0V11l1 1.5h-9zM7 14h2' },
];

/**
 * One input: a white card whose link runs down into the agent. Each has its
 * own colour, which its accent bar, label, icons, link and pulse all carry:
 * blue for your tools and data, gold for the prediction engine.
 */
function Input({ id, tag, title, body }: { id: 'tools' | 'engine'; tag: string; title: string; body: string }) {
  return (
    <li
      className={`aflow-input aflow-${id} relative flex w-[calc(50%-6px)] flex-col gap-2 overflow-clip rounded-lg border border-border bg-neutral-0 px-4 pt-[21px] pb-[18px] md:px-[26px] md:pt-[27px] md:pb-6 lg:w-[380px]`}
    >
      <span aria-hidden className="aflow-bar" />
      <p className={`${TAG} aflow-tag`}>{tag}</p>
      <span aria-hidden className="flex gap-1 py-0.5 md:gap-1.5">
        {id === 'tools'
          ? TOOL_ICONS.map((d) => (
              <span key={d} className="aflow-icon aflow-icon-tool">
                <svg {...ICON}>
                  <path d={d} />
                </svg>
              </span>
            ))
          : HAZARDS.map((hazard) => (
              <span key={hazard.id} className={`aflow-icon aflow-hazard aflow-hazard-${hazard.id}`}>
                <svg {...ICON}>
                  <path d={hazard.d} />
                </svg>
              </span>
            ))}
      </span>
      <h3 className="text-caption font-bold text-brand-navy md:text-[17px] md:leading-6">{title}</h3>
      <p className="text-[11px] leading-4 text-text-muted md:text-caption md:leading-5">{body}</p>
    </li>
  );
}

/** A link: the line, and the pulse that runs along it, both in their source's colour. */
const Link = ({ d, name }: { d: string; name: 'tools' | 'engine' | 'out' }) => (
  <>
    <path d={d} pathLength={100} className={`aflow-line aflow-line-${name}`} />
    <path d={d} pathLength={100} className={`aflow-pulse aflow-pulse-${name} motion-loop`} />
  </>
);

/**
 * How Flash Agent works, as a diagram: your tools and data, and the
 * prediction engine, run into Flash Agent; its answer goes to you and your
 * crew. A list of four in that order, which is how it reads without the
 * drawing. The links, the colours and all the motion are
 * styles/agent-flow.css, played once by <Motion> as the diagram scrolls in.
 * Every icon is decoration: the cards' text says the same.
 */
export function AgentFlow() {
  const { tools, engine, agent, crew, cue } = agentFlow;
  return (
    <Motion replay={false} threshold={0.3} className="motion aflow flex flex-col items-center gap-5">
      <ol className="flex w-full flex-wrap justify-between lg:w-[920px]">
        <Input id="tools" {...tools} />
        <Input id="engine" {...engine} />

        <li className="flex w-full flex-col items-center">
          {/* From lg: each input's bottom centre, curving in to the agent's top edge. */}
          <svg aria-hidden viewBox="0 0 920 88" className="hidden h-[88px] w-[920px] lg:block">
            <Link name="tools" d="M190 0C190 54 420 34 420 88" />
            <Link name="engine" d="M730 0C730 54 500 34 500 88" />
          </svg>
          <svg aria-hidden viewBox="0 0 100 32" preserveAspectRatio="none" className="h-8 w-full lg:hidden">
            <Link name="tools" d="M25 0V32" />
            <Link name="engine" d="M75 0V32" />
          </svg>
          {/* The centre of the diagram: a white card like the others, with the gold border and a deeper shadow. */}
          <div className="aflow-agent relative flex w-full flex-col items-center gap-3 rounded-lg bg-neutral-0 px-6 py-6 text-center md:px-8 md:py-7 lg:w-[440px]">
            <span aria-hidden className="aflow-sweep" />
            <Logo variant="light" size="window" link={false} alt="" />
            <h3 className={`${TAG} text-gold-on-light`}>{agent.tag}</h3>
            <p className="text-body-s leading-[22px] font-bold text-pretty text-brand-navy md:text-[17px] md:leading-[26px]">
              {agent.body}
            </p>
          </div>
        </li>

        <li className="flex w-full flex-col items-center">
          <svg aria-hidden viewBox="0 0 8 36" className="h-9 w-2">
            <Link name="out" d="M4 0V36" />
          </svg>
          <div className="aflow-crew flex w-full flex-col items-center gap-3 rounded-lg border border-border bg-neutral-0 px-6 py-[18px] text-center md:py-6 lg:w-[440px]">
            <p className={`${TAG} text-gold-on-light`}>{crew.tag}</p>
            <h3 className="text-caption font-bold text-brand-navy md:text-[17px] md:leading-6">{crew.title}</h3>
            <ul className="flex flex-wrap justify-center gap-2">
              {crew.outcomes.map((outcome, i) => (
                <li
                  key={outcome}
                  className={`aflow-chip aflow-chip-${OUTCOMES[i].tone} flex items-center gap-1.5 rounded-full border py-1 pr-3 pl-2.5 text-[11px] leading-4 font-semibold md:text-caption md:leading-5`}
                >
                  <svg aria-hidden {...ICON} className="size-3 shrink-0 md:size-3.5">
                    <path d={OUTCOMES[i].d} />
                  </svg>
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
        </li>
      </ol>

      <p className="aflow-cue flex items-center gap-1.5 text-caption leading-5 font-semibold text-brand-blue">
        {cue}
        <span aria-hidden className="aflow-cue-arrow motion-loop">
          ↓
        </span>
      </p>
    </Motion>
  );
}
