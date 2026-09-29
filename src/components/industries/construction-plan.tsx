import type { IndustrySection } from '@/content/industries';

import { Motion } from '../motion';
import { Illustrative, Section, SectionHeading, isDark } from './primitives';

type Figure = Extract<IndustrySection, { type: 'figure' }>;

/*
 * The Construction page's "One plan view" figure, drawn live instead of the
 * exported PNG so its layers can move and be switched. Geometry is the Paper
 * "Plan view panel" (784 x 480), the same drawing the PNG was exported from.
 *
 * Everything moves in CSS (styles/construction-plan.css) off one <Motion>
 * block: a once-only intro, then a slow loop of a predicted-strike area
 * reaching the cease-work ring. The legend is a group of real checkboxes, so
 * the toggles and hover highlights work through :has() with no script, and a
 * toggle only fades a layer's wrapper, which keeps every loop in step. The
 * markup is the finished plan: without JS or with reduced motion nothing
 * moves and every layer is on.
 */

const CX = 340;
const CY = 250;
/** Where the jib rests (the Paper drawing), in degrees: the sweep ends here. */
const JIB_ANGLE = (Math.atan2(188 - CY, 432 - CX) * 180) / Math.PI;
const BOUNDARY = 'M130 96L600 76L690 316L544 436L150 416Z';
const GRID = 'M98 0V480M196 0V480M294 0V480M392 0V480M490 0V480M588 0V480M686 0V480M0 98H784M0 196H784M0 294H784M0 392H784';

export function ConstructionPlanSection({ id, section }: { id: string; section: Figure }) {
  const dark = isDark(section.tone);

  return (
    <Section id={id} tone={section.tone}>
      <div className="cp flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-16">
        {/* Below lg this column dissolves so the plan can sit between the heading and the legend. */}
        <div className="contents lg:flex lg:w-[400px] lg:shrink lg:flex-col lg:gap-5 xl:shrink-0">
          <SectionHeading id={id} heading={section.heading} intro={section.intro} dark={dark} />
          <fieldset className="cp-keys min-w-0 pt-1 max-lg:order-2">
            <legend className="sr-only">Show or hide a layer on the plan</legend>
            {section.legend.map((item) => (
              <label key={item.label} className="cp-key" data-layer={item.layer} data-tone={item.tone}>
                <input type="checkbox" defaultChecked className="cp-check sr-only" data-layer={item.layer} />
                <span aria-hidden className="cp-swatch" data-shape={item.shape} />
                <span className={`text-body-s leading-5 ${dark ? 'text-neutral-0' : 'text-text'}`}>{item.label}</span>
              </label>
            ))}
          </fieldset>
          {section.caption && (
            <p className={`text-caption max-lg:order-3 ${dark ? 'text-text-on-dark-muted' : 'text-text-muted'}`}>
              {section.caption}
            </p>
          )}
          {section.illustrative && <Illustrative dark={dark} className="max-lg:order-3" />}
        </div>

        <figure className="min-w-0 grow basis-0 max-lg:order-1 max-lg:mt-5">
          <Motion className="motion cp-plan" replay={false} threshold={0.5}>
            <div role="img" aria-label={section.image.alt} className="cp-stage">
              <PlanDrawing />
              <span aria-hidden className="cp-chip cp-title">
                MIDTOWN PARKING DECK · PLAN VIEW · 1 KM CELLS
              </span>
              <span aria-hidden className="cp-label cp-label-ring cp-layer" data-layer="ring">
                Cease elevated work · 300 m ring
              </span>
              <span aria-hidden className="cp-label cp-label-crane">
                Tower crane TC-1 · jib 60 m
              </span>
              <span aria-hidden className="cp-label cp-label-muster cp-layer" data-layer="muster">
                Muster point
              </span>
              <span aria-hidden className="cp-footnote">
                1 cell = 1 km · refreshed every 2 minutes
              </span>
              <span aria-hidden className="cp-chip cp-status cp-status-cease motion-loop">
                <span className="cp-status-dot" />
                Cease work · crane down
              </span>
              <span aria-hidden className="cp-chip cp-status cp-status-clear motion-loop">
                <span className="cp-status-dot" />
                All-clear
              </span>
            </div>
          </Motion>
        </figure>
      </div>
    </Section>
  );
}

/** The plan itself, in the order Paper stacks it. Labels are HTML over it (see above). */
function PlanDrawing() {
  return (
    <svg viewBox="0 0 784 480" className="cp-svg" aria-hidden>
      <defs>
        {/* The boundary and the crane radius are dashed, so each draws in through a solid mask. */}
        <mask id="cp-boundary-reveal" maskUnits="userSpaceOnUse" x={0} y={0} width={784} height={480}>
          <path d={BOUNDARY} pathLength={1} className="cp-reveal cp-boundary-reveal" fill="none" stroke="#fff" strokeWidth={6} />
        </mask>
        <mask id="cp-radius-reveal" maskUnits="userSpaceOnUse" x={0} y={0} width={784} height={480}>
          {/* Starts at the jib's resting angle and runs clockwise, as the jib sweeps. */}
          <circle
            cx={CX}
            cy={CY}
            r={104}
            pathLength={1}
            transform={`rotate(${JIB_ANGLE.toFixed(2)} ${CX} ${CY})`}
            className="cp-reveal cp-radius-reveal"
            fill="none"
            stroke="#fff"
            strokeWidth={8}
          />
        </mask>
        <radialGradient id="cp-strike-fill">
          <stop offset={0} stopColor="var(--color-alert-watch)" stopOpacity={0.55} />
          <stop offset={0.55} stopColor="var(--color-alert-warning)" stopOpacity={0.3} />
          <stop offset={1} stopColor="var(--color-alert-warning)" stopOpacity={0} />
        </radialGradient>
      </defs>

      <path d={GRID} fill="none" stroke="var(--color-border-on-dark)" />

      <g className="cp-layer" data-layer="cell">
        <rect
          className="cp-cell"
          x={490}
          y={98}
          width={196}
          height={196}
          fill="var(--color-viz-gold)"
          stroke="var(--color-viz-gold)"
          strokeWidth={1.5}
        />
      </g>

      <path
        d={BOUNDARY}
        mask="url(#cp-boundary-reveal)"
        fill="none"
        stroke="var(--color-text-on-dark-muted)"
        strokeWidth={1.5}
        strokeDasharray="6 6"
      />
      <rect x={212} y={152} width={176} height={118} fill="var(--color-neutral-800)" stroke="var(--color-neutral-700)" />
      <rect x={424} y={222} width={128} height={150} fill="var(--color-neutral-800)" stroke="var(--color-neutral-700)" />
      <rect x={184} y={304} width={118} height={78} fill="var(--color-neutral-800)" stroke="var(--color-neutral-700)" />

      {/* The predicted-strike area: hidden until the loop drifts it in from the right edge. */}
      <g className="cp-strike">
        <circle className="cp-strike-area motion-loop" cx={585} cy={215} r={130} fill="url(#cp-strike-fill)" />
      </g>

      <g className="cp-layer" data-layer="ring">
        <circle className="cp-halo motion-loop" cx={CX} cy={CY} r={170} fill="none" stroke="var(--color-alert-warning)" strokeWidth={4} />
        <g className="cp-ring-pulse motion-loop" stroke="var(--color-alert-warning)" strokeWidth={1.5}>
          <circle className="cp-ring" cx={CX} cy={CY} r={170} fill="none" pathLength={1} />
        </g>
      </g>

      <g className="cp-layer" data-layer="crane">
        <g className="cp-radius-dim motion-loop">
          <circle
            cx={CX}
            cy={CY}
            r={104}
            mask="url(#cp-radius-reveal)"
            fill="none"
            stroke="var(--color-alert-watch)"
            strokeWidth={1.5}
            strokeDasharray="4 5"
          />
        </g>
      </g>

      <path className="cp-jib" d={`M${CX} ${CY}L432 188`} fill="none" stroke="var(--color-neutral-0)" strokeWidth={2} />
      <g className="cp-mast">
        <circle cx={CX} cy={CY} r={14} fill="none" stroke="var(--color-neutral-0)" strokeWidth={1.5} />
        <circle cx={CX} cy={CY} r={6} fill="var(--color-neutral-0)" />
      </g>

      <g className="cp-layer" data-layer="muster">
        <rect className="cp-muster" x={640} y={356} width={16} height={16} fill="var(--color-alert-clear)" />
      </g>
    </svg>
  );
}
