/**
 * Figure 1 of the explainer (lightning-detection-vs-electrostatic-sensor-vs-
 * ai-prediction-diagram.svg in the design): three panels, redrawn as inline
 * SVG so they stay sharp and their captions stay text.
 */

const ALT =
  "Three-panel diagram comparing a lightning detection network that maps a strike after it happens, an electrostatic field meter that reads one point, and Flash's AI prediction that forecasts a 1 km cell up to 60 minutes ahead";

const GRID = 'M0 45H352M0 90H352M0 135H352M88 0V180M176 0V180M264 0V180';
const F = { fontFamily: 'var(--font-manrope), system-ui, sans-serif' } as const;
const gold = 'var(--color-viz-gold)';

function DetectionPanel() {
  return (
    <svg viewBox="0 0 352 180" aria-hidden className="h-auto w-full">
      <path d={GRID} fill="none" stroke="#1C2340" />
      <path d="M40 150L176 100M312 150L176 100M150 26L176 100" fill="none" stroke="#0B63CE" strokeWidth="1.5" strokeDasharray="4 4" />
      <circle cx="40" cy="150" r="6" fill="#040818" stroke="#AEB8C7" strokeWidth="2" />
      <circle cx="312" cy="150" r="6" fill="#040818" stroke="#AEB8C7" strokeWidth="2" />
      <circle cx="150" cy="26" r="6" fill="#040818" stroke="#AEB8C7" strokeWidth="2" />
      <circle cx="176" cy="100" r="16" fill="#C22E22" />
      <circle cx="176" cy="100" r="6" fill="#C22E22" stroke="#FFFFFF" strokeWidth="2" />
      <text x="200" y="97" fontSize="11" fontWeight="700" fill="#FFFFFF" {...F}>STRIKE LOCATED</text>
      <text x="200" y="112" fontSize="11" fill="#AEB8C7" {...F}>seconds after it happened</text>
      <text x="14" y="172" fontSize="10" fill="#AEB8C7" {...F}>SENSOR</text>
      <text x="296" y="172" fontSize="10" fill="#AEB8C7" {...F}>SENSOR</text>
      <text x="166" y="18" fontSize="10" fill="#AEB8C7" {...F}>SENSOR</text>
    </svg>
  );
}

function FieldMeterPanel() {
  return (
    <svg viewBox="0 0 352 180" aria-hidden className="h-auto w-full">
      <path d={GRID} fill="none" stroke="#1C2340" />
      {[30, 60, 90].map((r) => (
        <circle key={r} cx="110" cy="150" r={r} fill="none" stroke="#0B63CE" strokeWidth="1.5" strokeDasharray="3 4" />
      ))}
      <path d="M110 150V70" fill="none" stroke="#FFFFFF" strokeWidth="3" />
      <rect x="100" y="56" width="20" height="14" rx="3" fill="#FFFFFF" />
      <path d="M96 150H124" fill="none" stroke="#FFFFFF" strokeWidth="3" />
      <path d="M212 130A60 60 0 0 1 229.6 87.6" fill="none" stroke="#128A5E" strokeWidth="10" />
      <path d="M229.6 87.6A60 60 0 0 1 272 70" fill="none" stroke={gold} strokeWidth="10" />
      <path d="M272 70A60 60 0 0 1 314.4 87.6" fill="none" stroke="#D9722B" strokeWidth="10" />
      <path d="M314.4 87.6A60 60 0 0 1 332 130" fill="none" stroke="#C22E22" strokeWidth="10" />
      <path d="M272 130L302 78" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      <circle cx="272" cy="130" r="5" fill="#FFFFFF" />
      <text x="272" y="156" textAnchor="middle" fontSize="11" fontWeight="700" fill="#FFFFFF" {...F}>FIELD AT ONE POINT</text>
      <text x="110" y="172" textAnchor="middle" fontSize="10" fill="#AEB8C7" {...F}>ONE MAST · LOCAL RANGE</text>
    </svg>
  );
}

function PredictionPanel() {
  return (
    <svg viewBox="0 0 352 180" aria-hidden className="h-auto w-full">
      <text x="12" y="34" fontSize="11" fontWeight="700" fill="#FFFFFF" {...F}>OVER 100 PARAMETERS</text>
      <text x="12" y="52" fontSize="11" fill="#AEB8C7" {...F}>→ 1 × 1 km cells</text>
      <text x="12" y="70" fontSize="11" fill="#AEB8C7" {...F}>→ up to 60 min ahead</text>
      <text x="12" y="88" fontSize="11" fill="#AEB8C7" {...F}>→ refreshed every 2 min</text>
      <path
        d="M136 24H328M136 56H328M136 88H328M136 120H328M136 152H328M136 24V152M168 24V152M200 24V152M232 24V152M264 24V152M296 24V152M328 24V152"
        fill="none"
        stroke="#1C2340"
      />
      <rect x="200" y="56" width="32" height="32" fill={gold} opacity="0.3" />
      <rect x="264" y="56" width="32" height="32" fill={gold} opacity="0.3" />
      <rect x="232" y="88" width="32" height="32" fill={gold} opacity="0.3" />
      <rect x="232" y="24" width="32" height="32" fill={gold} opacity="0.3" />
      <rect x="232" y="56" width="32" height="32" fill={gold} />
      <text x="248" y="76" textAnchor="middle" fontSize="10" fontWeight="800" fill="#070D26" {...F}>1 H</text>
      <path d="M150 146L222 86" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 3" />
      <text x="136" y="172" fontSize="10" fill="#AEB8C7" {...F}>1 × 1 KM CELLS · REFRESH EVERY 2 MIN</text>
    </svg>
  );
}

const panels = [
  {
    title: 'Detection network',
    Art: DetectionPanel,
    caption:
      'Sensors triangulate a strike that has already happened. Output: a dot on the map, with a radius rule that decides when you stop.',
  },
  {
    title: 'Electrostatic field meter',
    Art: FieldMeterPanel,
    caption:
      'One mast measures the electric field at one point. Output: a needle that rises as charge builds nearby, for any reason.',
  },
  {
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
      <ul className="grid gap-6 lg:grid-cols-3">
        {panels.map(({ title, Art, caption }) => (
          <li key={title} className="flex flex-col gap-4 rounded-[20px] border border-white/10 bg-[#040818B8] p-6">
            <p className="text-[11px] leading-[14px] font-bold tracking-[0.13em] text-text-on-dark uppercase">{title}</p>
            <Art />
            <p className="text-body-s leading-5 text-text-on-dark-muted">{caption}</p>
          </li>
        ))}
      </ul>
    </figure>
  );
}
