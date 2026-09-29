'use client';

import { Motion } from '@/components/motion';

import { agentExample } from './content';
import { BoltGlyph } from './wbgt-chart';

/*
 * The Thursday line: noon to 7 pm across, 83 to 89 °F up, the 87 threshold
 * at y 32 of 100. It is drawn at two widths, 600 from 640px and 340 below,
 * so its 10px labels stay about 1:1 in the card. Straight segments between
 * the hourly points, so the drawn crossing is the real one; the crossing
 * is a third of the way across at either width.
 */
const HOURS = agentExample.chart.points.length - 1;
const THRESHOLD = 87;
const yAt = (degrees: number) => 80 - (degrees - 83) * 12;
const Y87 = yAt(THRESHOLD);
const TICK_HOURS = [0, 2, 4, 6, 7];
const PEAK_HOUR = agentExample.chart.points.indexOf(Math.max(...agentExample.chart.points));
/** The first rise through 87, in hours after noon (2:20 pm). */
const CROSS_HOUR = (() => {
  const p = agentExample.chart.points;
  const i = p.findIndex((v, h) => h < p.length - 1 && v < THRESHOLD && p[h + 1] >= THRESHOLD);
  return i + (THRESHOLD - p[i]) / (p[i + 1] - p[i]);
})();

function ThursdayChart({ width, className }: { width: number; className: string }) {
  const { chart } = agentExample;
  const xAt = (hour: number) => 8 + (hour * (width - 16)) / HOURS;
  const points = chart.points.map((v, h) => `${xAt(h).toFixed(1)},${yAt(v).toFixed(1)}`).join(' ');
  const clip = `hag-above-87-${width}`;
  const cross = xAt(CROSS_HOUR);
  // The moved practice, 5:30 to 7:00.
  const slot = { from: xAt(5.5), to: xAt(7) };

  return (
    <svg role="img" aria-label={chart.label} viewBox={`0 0 ${width} 100`} className={`hag-chart ${className}`}>
      <defs>
        <clipPath id={clip}>
          <rect x="0" y="0" width={width} height={Y87} />
        </clipPath>
      </defs>
      <line className="hag-threshold" x1={xAt(0)} y1={Y87} x2={xAt(HOURS)} y2={Y87} />
      <text className="hag-threshold-label" x={xAt(0)} y={Y87 - 5}>
        87 °F
      </text>
      <g className="hag-draw">
        <polyline className="hag-line" points={points} />
        <polyline className="hag-line hag-line-hot" points={points} clipPath={`url(#${clip})`} />
      </g>
      <text className="hag-peak" x={xAt(PEAK_HOUR)} y={yAt(chart.points[PEAK_HOUR]) - 8} textAnchor="middle">
        {chart.peak}
      </text>
      <circle className="hag-cross-ring" cx={cross} cy={Y87} r="6" />
      <circle className="hag-cross-dot" cx={cross} cy={Y87} r="4" />
      <g className="hag-slot-group">
        <rect className="hag-slot" x={slot.from} y="84" width={slot.to - slot.from} height="3" rx="1.5" />
        <text className="hag-slot-label" x={slot.to} y="79" textAnchor="end">
          {chart.slot}
        </text>
      </g>
      {TICK_HOURS.map((hour, i) => (
        <text
          key={hour}
          className="hag-axis"
          x={xAt(hour)}
          y="98"
          textAnchor={i === 0 ? 'start' : i === TICK_HOURS.length - 1 ? 'end' : 'middle'}
        >
          {chart.ticks[i]}
        </text>
      ))}
    </svg>
  );
}

function ReplayIcon() {
  return (
    <svg aria-hidden width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path
        d="M3.5 6.5A5 5 0 1 1 3 9.8M3.5 6.5V3M3.5 6.5H7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Runs the card's sequence again from the start, as <Motion> does for a hover replay. */
function replay(event: React.MouseEvent<HTMLButtonElement>) {
  const block = event.currentTarget.closest<HTMLElement>('.hag');
  if (!block) return;
  block.dataset.delay = '0';
  block.dataset.anim = 'reset';
  void block.getBoundingClientRect(); // commit the reset so the animations restart
  block.dataset.anim = 'run';
}

/**
 * The Ask Flash card as a rule firing (styles/heat-agent.css): as it scrolls
 * in, the question sweeps into a rule chip, which arms; Thursday's outlook
 * draws under the answer; where it crosses 87 the rule triggers, the
 * crossing pulses and the answer arrives; then the action, the
 * notifications, the source and the AD's confirmation, and a Replay. One
 * <Motion> block, the site's scroll-in; the markup is the final state, which
 * is all that reduced motion shows.
 */
export function AgentRule() {
  return (
    <Motion
      replay={false}
      threshold={0.35}
      className="motion hag flex flex-col gap-8 rounded-[20px] border border-white/10 bg-[#040818B8] p-6 md:p-8 lg:flex-row lg:gap-12"
    >
      <div className="flex flex-col gap-[14px] border-white/10 max-lg:border-b max-lg:pb-8 lg:w-[480px] lg:shrink xl:shrink-0 lg:border-r lg:pr-12">
        <p className="text-[11px] leading-[14px] font-semibold tracking-label text-[#8F9AB8] uppercase">
          {agentExample.context}
        </p>
        <p className="hag-question text-[20px] leading-7 font-medium text-white md:text-[22px] md:leading-body-l">
          {agentExample.question}
        </p>
        <p className="hag-rule">
          <span className="hag-rule-text">{agentExample.rule}</span>
          <span className="hag-status">
            <span aria-hidden className="hag-armed">
              Armed
            </span>
            <span className="hag-triggered">Triggered</span>
          </span>
        </p>
        <p className="text-body-s leading-5 text-[#8F9AB8]">{agentExample.where}</p>
      </div>

      <div className="flex grow basis-0 items-start gap-[14px]">
        <span aria-hidden className="bg-gold-metallic flex size-7 shrink-0 items-center justify-center rounded-full">
          <BoltGlyph />
        </span>
        <div className="flex min-w-0 grow basis-0 flex-col gap-[14px]">
          <p className="hag-answer text-[17px] leading-body text-[#DCE2F0]">{agentExample.answer}</p>

          <ThursdayChart width={600} className="max-sm:hidden" />
          <ThursdayChart width={340} className="sm:hidden" />

          <p className="hag-detail text-body-s text-[#8F9AB8]">{agentExample.detail}</p>
          <ul className="flex flex-wrap gap-2">
            <li className="hag-chip flex min-h-6 items-center rounded-sm border border-[#128A5E99] bg-[#128A5E29] px-[10px] py-1 text-micro font-semibold text-[#7FD1A8]">
              {agentExample.action}
            </li>
            {agentExample.chips.map((chip) => (
              <li
                key={chip}
                className="hag-chip flex min-h-6 items-center rounded-sm border border-white/14 px-[10px] py-1 text-micro font-medium text-neutral-400"
              >
                {chip}
              </li>
            ))}
          </ul>
          <button type="button" className="hag-replay" onClick={replay}>
            <ReplayIcon />
            Replay
          </button>
        </div>
      </div>
    </Motion>
  );
}
