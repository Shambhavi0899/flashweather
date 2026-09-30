import { TechnologyFigureMotion } from '@/components/why-flash/technology-figure-motion';

/**
 * Figure 1 of the explainer (lightning-detection-vs-electrostatic-sensor-vs-
 * ai-prediction-diagram.svg in the design): three panels, redrawn as inline
 * SVG so they stay sharp and their captions stay text.
 *
 * The markup is the final frame. Each panel also plays its mechanism
 * (styles/why-flash-tech-figure.css, technology-figure-motion.tsx): the
 * `tf-*` layers that only exist for the motion (flow lines, pings, the bolt)
 * rest at opacity 0, so without JavaScript or with reduced motion the figure
 * is the static diagram with its Before / During / After tags.
 */

const ALT =
  "Three-panel diagram comparing a lightning detection network that maps a strike after it happens, an electrostatic field meter that reads one point, and Flash's AI prediction that forecasts a 1 km cell up to 60 minutes ahead";

const GRID = 'M0 45H352M0 90H352M0 135H352M88 0V180M176 0V180M264 0V180';
const F = { fontFamily: 'var(--font-manrope), system-ui, sans-serif' } as const;
const gold = 'var(--color-viz-gold)';

const SENSORS = [
  [40, 150],
  [312, 150],
  [150, 26],
] as const;

function DetectionPanel() {
  return (
    <svg viewBox="0 0 352 180" aria-hidden className="h-auto w-full overflow-visible">
      <defs>
        {/* The triangulation lines draw from each sensor to the strike. */}
        <mask id="tf-tri-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="352" height="180">
          {SENSORS.map(([x, y]) => (
            <path
              key={x}
              className="tf-tri"
              pathLength={1}
              d={`M${x} ${y}L176 100`}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="6"
            />
          ))}
        </mask>
      </defs>
      <path d={GRID} fill="none" stroke="#1C2340" />
      <path className="tf-bolt" d="M184 0L171 42L181 46L172 100" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" />
      <circle className="tf-burst" cx="176" cy="100" r="30" fill="#FFFFFF" />
      <path
        d="M40 150L176 100M312 150L176 100M150 26L176 100"
        fill="none"
        stroke="#0B63CE"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        mask="url(#tf-tri-mask)"
      />
      {SENSORS.map(([x, y]) => (
        <circle key={x} className="tf-ping" cx={x} cy={y} r="8" fill="none" stroke="#AEB8C7" strokeWidth="1.5" />
      ))}
      {SENSORS.map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="6" fill="#040818" stroke="#AEB8C7" strokeWidth="2" />
      ))}
      <g className="tf-strike">
        <circle cx="176" cy="100" r="16" fill="#C22E22" />
        <circle cx="176" cy="100" r="6" fill="#C22E22" stroke="#FFFFFF" strokeWidth="2" />
      </g>
      <g className="tf-located">
        <text x="200" y="97" fontSize="11" fontWeight="700" fill="#FFFFFF" {...F}>STRIKE LOCATED</text>
        <text x="200" y="112" fontSize="11" fill="#AEB8C7" {...F}>seconds after it happened</text>
      </g>
      <text x="14" y="172" fontSize="10" fill="#AEB8C7" {...F}>SENSOR</text>
      <text x="296" y="172" fontSize="10" fill="#AEB8C7" {...F}>SENSOR</text>
      <text x="166" y="18" fontSize="10" fill="#AEB8C7" {...F}>SENSOR</text>
    </svg>
  );
}

function FieldMeterPanel() {
  return (
    <svg viewBox="0 0 352 180" aria-hidden className="h-auto w-full overflow-visible">
      <path d={GRID} fill="none" stroke="#1C2340" />
      {[30, 60, 90].map((r) => (
        <circle key={r} className="tf-charge" cx="110" cy="150" r={r} fill="none" stroke="#0B63CE" strokeWidth="1.5" strokeDasharray="3 4" />
      ))}
      <path d="M110 150V70" fill="none" stroke="#FFFFFF" strokeWidth="3" />
      <rect x="100" y="56" width="20" height="14" rx="3" fill="#FFFFFF" />
      <path d="M96 150H124" fill="none" stroke="#FFFFFF" strokeWidth="3" />
      <path d="M212 130A60 60 0 0 1 229.6 87.6" fill="none" stroke="#128A5E" strokeWidth="10" />
      <path d="M229.6 87.6A60 60 0 0 1 272 70" fill="none" stroke={gold} strokeWidth="10" />
      <path d="M272 70A60 60 0 0 1 314.4 87.6" fill="none" stroke="#D9722B" strokeWidth="10" />
      <path d="M314.4 87.6A60 60 0 0 1 332 130" fill="none" stroke="#C22E22" strokeWidth="10" />
      {/* The alarm threshold, where the gauge turns from advisory to watch. */}
      <path d="M272 50V61" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      <path className="tf-needle" d="M272 130L302 78" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      <circle cx="272" cy="130" r="5" fill="#FFFFFF" />
      <g className="tf-alarm">
        <rect className="tf-alarm-pulse" x="202" y="22" width="140" height="20" rx="10" fill="none" stroke="#C22E22" strokeWidth="2" />
        <rect x="202" y="22" width="140" height="20" rx="10" fill="#C22E22" fillOpacity="0.22" stroke="#C22E22" />
        <text x="272" y="35.5" textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF" {...F}>
          Field alarm · one point
        </text>
      </g>
      <text x="272" y="156" textAnchor="middle" fontSize="11" fontWeight="700" fill="#FFFFFF" {...F}>FIELD AT ONE POINT</text>
      <text x="110" y="172" textAnchor="middle" fontSize="10" fill="#AEB8C7" {...F}>ONE MAST · LOCAL RANGE</text>
    </svg>
  );
}

function PredictionPanel() {
  return (
    <svg viewBox="0 0 352 180" aria-hidden className="h-auto w-full overflow-visible">
      <text x="12" y="34" fontSize="11" fontWeight="700" fill="#FFFFFF" {...F}>OVER 100 PARAMETERS</text>
      <text className="tf-param" x="12" y="52" fontSize="11" fill="#AEB8C7" {...F}>→ 1 × 1 km cells</text>
      <text className="tf-param" x="12" y="70" fontSize="11" fill="#AEB8C7" {...F}>→ up to 60 min ahead</text>
      <text className="tf-param" x="12" y="88" fontSize="11" fill="#AEB8C7" {...F}>→ refreshed every 2 min</text>
      <path
        d="M136 24H328M136 56H328M136 88H328M136 120H328M136 152H328M136 24V152M168 24V152M200 24V152M232 24V152M264 24V152M296 24V152M328 24V152"
        fill="none"
        stroke="#1C2340"
      />
      <g className="tf-halo">
        <rect x="200" y="56" width="32" height="32" fill={gold} opacity="0.3" />
        <rect x="264" y="56" width="32" height="32" fill={gold} opacity="0.3" />
        <rect x="232" y="88" width="32" height="32" fill={gold} opacity="0.3" />
        <rect x="232" y="24" width="32" height="32" fill={gold} opacity="0.3" />
      </g>
      {/* The parameters flow into the cell, one line each. */}
      <g fill="none" stroke={gold} strokeWidth="1.5" strokeLinecap="round">
        <path className="tf-flow" pathLength={1} d="M140 48C180 48 204 68 236 70" />
        <path className="tf-flow" pathLength={1} d="M140 66C180 66 204 72 236 72" />
        <path className="tf-flow" pathLength={1} d="M140 84C180 84 204 76 236 74" />
      </g>
      <rect className="tf-cell-ring" x="232" y="56" width="32" height="32" fill="none" stroke={gold} strokeWidth="2" />
      <rect className="tf-cell" x="232" y="56" width="32" height="32" fill={gold} />
      <text className="tf-cell-text" x="248" y="76" textAnchor="middle" fontSize="10" fontWeight="800" fill="#070D26" {...F}>1 H</text>
      <path d="M150 146L222 86" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 3" />
      <g className="tf-next">
        <rect x="156" y="0" width="172" height="19" rx="9.5" fill={gold} fillOpacity="0.16" stroke={gold} />
        <text x="242" y="13" textAnchor="middle" fontSize="10" fontWeight="700" fill="#F0DE7E" {...F}>
          Next 60 min · before the strike
        </text>
      </g>
      <text x="136" y="172" fontSize="10" fill="#AEB8C7" {...F}>1 × 1 KM CELLS · REFRESH EVERY 2 MIN</text>
    </svg>
  );
}

/** In document order. They play in time order: Before, During, After. */
const panels = [
  {
    key: 'detection',
    when: 'After',
    title: 'Detection network',
    Art: DetectionPanel,
    caption:
      'Sensors triangulate a strike that has already happened. Output: a dot on the map, with a radius rule that decides when you stop.',
  },
  {
    key: 'meter',
    when: 'During',
    title: 'Electrostatic field meter',
    Art: FieldMeterPanel,
    caption:
      'One mast measures the electric field at one point. Output: a needle that rises as charge builds nearby, for any reason.',
  },
  {
    key: 'prediction',
    when: 'Before',
    title: 'AI prediction · Flash',
    Art: PredictionPanel,
    caption:
      'A model turns over 100 atmospheric parameters into a forecast for each 1 km cell, up to 60 minutes out. Output: a cell that changes colour before the first strike.',
  },
];

export function TechnologyFigure() {
  return (
    <figure aria-label={ALT} className="flex flex-col gap-4 pt-6">
      <figcaption className="text-[11px] leading-[14px] font-bold tracking-[0.13em] text-text-on-dark-muted uppercase">
        Figure 1 · What each one actually sees
      </figcaption>
      <TechnologyFigureMotion className="grid gap-6 lg:grid-cols-3">
        {panels.map(({ key, when, title, Art, caption }) => (
          <li
            key={key}
            data-tech={key}
            className="tech-card flex flex-col gap-4 rounded-[20px] border border-white/10 bg-[#040818B8] p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] leading-[14px] font-bold tracking-[0.13em] text-text-on-dark uppercase">{title}</p>
              <span className="tech-tag" data-when={when.toLowerCase()}>
                {when}
              </span>
            </div>
            <Art />
            <p className="text-body-s leading-5 text-text-on-dark-muted">{caption}</p>
          </li>
        ))}
      </TechnologyFigureMotion>
    </figure>
  );
}
