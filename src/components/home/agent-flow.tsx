import { Logo } from '@/components/logo';
import { Motion } from '@/components/motion';
import { agentFlow } from '@/content/home';

const TAG =
  'text-[10px] leading-3 font-bold tracking-[0.13em] uppercase min-[520px]:text-[11px] min-[520px]:leading-[14px]';

/** Every card's three levels: a label, a bold line, a muted line. */
const EYEBROW = 'text-[10px] leading-3 font-bold tracking-[0.1em] uppercase';
const TITLE =
  'text-micro leading-4 font-bold tracking-[-0.01em] text-balance text-brand-navy min-[520px]:text-caption min-[520px]:leading-[18px]';
const DETAIL = 'text-[11px] leading-4 text-balance text-text-muted min-[520px]:text-micro';
/** A card: the same border, shadow and padding everywhere, its lines centred in it. */
const CARD = 'aflow-card flex grow flex-col items-center justify-center gap-1.5 text-center';

const ICON = {
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

/** What the crew decides: each outcome chip's tint and icon, in the order of `agentFlow.outcomes`. */
const OUTCOMES = [
  { tone: 'go', d: 'M3 8.5 6.5 12 13 4.5' },
  { tone: 'move', d: 'M8 13.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM8 5v3.5l2 1.5' },
  { tone: 'alert', d: 'M4.5 11V7.5a3.5 3.5 0 0 1 7 0V11l1 1.5h-9zM7 14h2' },
];

/**
 * The merge, drawn for the column at 362px wide and stretched to its gap
 * (the strokes keep their weight): each source's bottom centre curves in to
 * the junction halfway down, where "Power" sits, and a stem runs on into the
 * agent card. x scales with the column, so the paths leave the cards at
 * their centres at any width.
 */
const MERGE = { w: 362, h: 100 };
const MERGE_PATHS = {
  tools: 'M88.5 0C88.5 31 181 19 181 50',
  engine: 'M273.5 0C273.5 31 181 19 181 50',
  stem: 'M181 50V100',
};

type Lines = { tag: string; title: string; detail: string };

/** A card's label, bold line and muted line. */
function CardLines({ tag, title, detail }: Lines) {
  return (
    <>
      <h3 className={`${EYEBROW} text-text-muted`}>{tag}</h3>
      <p className={TITLE}>{title}</p>
      <p className={DETAIL}>{detail}</p>
    </>
  );
}

/** One source: half the column wide, so it keeps 12px either side, not 18px. */
function Source({ id, ...lines }: Lines & { id: 'tools' | 'engine' }) {
  return (
    <div className={`${CARD} aflow-source aflow-${id} min-w-0 basis-0 px-3 py-4`}>
      <CardLines {...lines} />
    </div>
  );
}

/** A connector's word, on the line. */
const Label = ({ children }: { children: string }) => (
  <span className={`aflow-label ${TAG} relative z-[1] rounded-full px-2 py-1 text-text-muted`}>{children}</span>
);

/** A vertical connector, as long as the other two, with its word in the middle. */
function Link({ name, label }: { name: 'answers' | 'decide'; label: string }) {
  return (
    <div className={`aflow-gap aflow-link aflow-link-${name} relative flex items-center justify-center`}>
      <span aria-hidden className="aflow-vline" />
      <Label>{label}</Label>
    </div>
  );
}

/**
 * How Flash Agent works, as one column beside the agent window
 * (agent-section.tsx; above it below lg): your tools and data and the
 * prediction engine, side by side at the top, run into Flash Agent; its
 * answer goes to you and your crew; you decide, which ends in the three
 * outcomes, in a last card. Read top to bottom it says the same without the
 * drawing: the connectors' words (Power, Answers, You decide) are text.
 *
 * From lg the column is as tall as the window beside it (or the viewport,
 * when the window is taller, and it sticks there): the three connectors
 * share the height evenly up to 72px each, then the cards take the rest,
 * evenly (.aflow-gap, styles/agent-flow.css). Below lg they are at their
 * shortest. The merge is an SVG stretched to its gap. The motion is
 * styles/agent-flow.css, played once by <Motion> as the column scrolls in,
 * then the pulses loop while it is in view.
 */
export function AgentFlow() {
  const { tools, engine, agent, crew, decision, outcomes, links } = agentFlow;
  return (
    <Motion replay={false} threshold={0.3} className="motion aflow flex h-full flex-col">
      <div className="flex grow gap-2">
        <Source id="tools" {...tools} />
        <Source id="engine" {...engine} />
      </div>

      <div className="aflow-gap aflow-merge relative">
        <svg
          aria-hidden
          viewBox={`0 0 ${MERGE.w} ${MERGE.h}`}
          preserveAspectRatio="none"
          className="absolute inset-0 size-full"
        >
          <path d={MERGE_PATHS.stem} pathLength={100} className="aflow-line aflow-line-stem" />
          <path d={MERGE_PATHS.tools} pathLength={100} className="aflow-line aflow-line-tools" />
          <path d={MERGE_PATHS.engine} pathLength={100} className="aflow-line aflow-line-engine" />
          <path d={MERGE_PATHS.tools} pathLength={100} className="aflow-pulse aflow-pulse-tools motion-loop" />
          <path d={MERGE_PATHS.engine} pathLength={100} className="aflow-pulse aflow-pulse-engine motion-loop" />
        </svg>
        <span className="absolute top-1/2 left-1/2 flex -translate-1/2">
          <Label>{links.power}</Label>
        </span>
      </div>

      {/* The centre of the diagram: the white card with the gold border, a
          little tighter inside than the others, as it has the logo too. */}
      <div className={`${CARD} aflow-agent relative px-4 py-3.5`}>
        <Logo variant="light" size="window" link={false} alt="" />
        <h3 className={`${EYEBROW} text-gold-on-light`}>{agent.tag}</h3>
        <p className={TITLE}>{agent.body}</p>
      </div>

      <Link name="answers" label={links.answers} />

      <div className={`${CARD} aflow-crew px-[18px] py-4`}>
        <CardLines {...crew} />
      </div>

      <Link name="decide" label={links.decide} />

      {/* The base: what the crew decides, as wide as the card above it. Its
          sides are 12px so the three chips stay on one line from 1280px. */}
      <div className={`${CARD} aflow-decision gap-2.5 px-3 py-4`}>
        <h3 className={`${EYEBROW} text-text-muted`}>{decision}</h3>
        <ul className="flex flex-wrap justify-center gap-1.5">
          {outcomes.map((outcome, i) => (
            <li
              key={outcome}
              className={`aflow-chip aflow-chip-${OUTCOMES[i].tone} flex items-center gap-1 rounded-full border py-1 pr-2.5 pl-2 text-[11px] leading-4 font-semibold`}
            >
              <svg aria-hidden {...ICON} className="size-3 shrink-0">
                <path d={OUTCOMES[i].d} />
              </svg>
              {outcome}
            </li>
          ))}
        </ul>
      </div>
    </Motion>
  );
}
