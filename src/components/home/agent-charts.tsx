import type { AgentAnswer } from '@/content/home';

/**
 * The five answer charts from the design, as inline SVG. Each is described in
 * words by the answer card (chartSummary), so the SVGs themselves are hidden
 * from assistive tech.
 *
 * Hooks for the chat's chart build (styles/agent-conversation.css): `chat-bar` data bars
 * grow, `chat-line` data lines draw, `chat-annot` limits, bands, markers and
 * notes fade in last. Axes and baselines carry no hook and stay put. Shapes
 * with their own opacity attribute are wrapped in a `chat-annot` group so the
 * fade does not override it.
 */

const axis = { fontFamily: 'Manrope', fontSize: 11, fill: '#8F9AB8', textAnchor: 'middle' } as const;
const tick = { fontFamily: 'Manrope', fontSize: 10, fill: '#5F6B85' } as const;
const note = { fontFamily: 'Manrope', fontSize: 11, fontWeight: 700 } as const;
const GOLD = 'var(--color-viz-gold)';

export function AgentChart({ chart }: { chart: AgentAnswer['chart'] }) {
  switch (chart) {
    case 'construction':
      return <ConstructionChart />;
    case 'roofing':
      return <RoofingChart />;
    case 'schools':
      return <SchoolsChart />;
    case 'agriculture':
      return <AgricultureChart />;
    case 'golf':
      return <GolfChart />;
  }
}

const svgClass = 'block h-auto w-full';

function ConstructionChart() {
  const bars: [number, number, number, number, string][] = [
    [40, 89, 34, 41, '#0B63CE'],
    [89, 69, 34, 61, '#0B63CE'],
    [138, 48, 34, 82, '#0B63CE'],
    [187, 31, 34, 99, '#C22E22'],
    [236, 25, 34, 105, '#C22E22'],
    [285, 38, 34, 92, '#C22E22'],
    [334, 55, 34, 75, '#0B63CE'],
    [383, 72, 34, 58, '#0B63CE'],
    [432, 82, 34, 48, '#0B63CE'],
    [481, 89, 34, 41, '#0B63CE'],
    [530, 93, 34, 37, '#0B63CE'],
    [579, 96, 34, 34, '#0B63CE'],
    [628, 99, 26, 31, '#0B63CE'],
  ];
  const hours: [number, string][] = [
    [57, '06'], [106, '07'], [155, '08'], [204, '09'], [253, '10'], [302, '11'], [351, '12'],
    [400, '13'], [449, '14'], [498, '15'], [547, '16'], [596, '17'], [641, '18'],
  ];
  return (
    <svg viewBox="0 0 684 176" aria-hidden className={svgClass}>
      <g className="chat-annot">
        <rect x="302" y="12" width="352" height="132" rx="6" fill={GOLD} opacity="0.08" />
      </g>
      <line className="chat-annot" x1="40" y1="45" x2="654" y2="45" stroke={GOLD} strokeWidth="1.5" strokeDasharray="5 5" />
      <text className="chat-annot" x="650" y="38" textAnchor="end" fill={GOLD} {...note}>
        YOUR CRANE LIMIT · 25 MPH
      </text>
      <line x1="40" y1="130" x2="654" y2="130" stroke="#1C2340" />
      {bars.map(([x, y, w, h, fill]) => (
        <rect key={x} className="chat-bar" x={x} y={y} width={w} height={h} rx="3" fill={fill} />
      ))}
      {hours.map(([x, t]) => (
        <text key={t} x={x} y="150" {...axis}>
          {t}
        </text>
      ))}
      <text x="8" y="134" {...tick}>0</text>
      <text x="8" y="49" {...tick}>25</text>
      <text x="8" y="16" {...tick}>mph</text>
      <text className="chat-annot" x="478" y="170" textAnchor="middle" fill={GOLD} {...note}>
        CLEAR WINDOW 11:20 – 17:00
      </text>
      <text className="chat-annot" x="253" y="170" textAnchor="middle" fill="#C22E22" {...note}>
        GUSTS OVER LIMIT
      </text>
    </svg>
  );
}

function RoofingChart() {
  const bars: [number, number, number, string][] = [
    [56, 102, 28, '#0B63CE'],
    [144, 70, 60, GOLD],
    [231, 112, 18, '#C22E22'],
    [319, 75, 55, GOLD],
    [407, 93, 37, '#0B63CE'],
    [494, 98, 32, '#0B63CE'],
    [582, 116, 14, '#0B63CE'],
  ];
  const days: [number, string][] = [
    [84, 'Mon'], [172, 'Tue'], [259, 'Wed'], [347, 'Thu'], [435, 'Fri'], [522, 'Sat'], [610, 'Sun'],
  ];
  return (
    <svg viewBox="0 0 684 176" aria-hidden className={svgClass}>
      <g className="chat-annot">
        <rect x="132" y="12" width="80" height="132" rx="6" fill={GOLD} opacity="0.08" />
      </g>
      <g className="chat-annot">
        <rect x="307" y="12" width="80" height="132" rx="6" fill={GOLD} opacity="0.08" />
      </g>
      <line className="chat-annot" x1="40" y1="84" x2="654" y2="84" stroke={GOLD} strokeWidth="1.5" strokeDasharray="5 5" />
      <text className="chat-annot" x="654" y="77" textAnchor="end" fill={GOLD} {...note}>
        YOUR TEAR-OFF WINDOW · 5 H DRY
      </text>
      <line x1="40" y1="130" x2="654" y2="130" stroke="#1C2340" />
      {bars.map(([x, y, h, fill]) => (
        <rect key={x} className="chat-bar" x={x} y={y} width="56" height={h} rx="3" fill={fill} />
      ))}
      <text className="chat-annot" x="172" y="62" textAnchor="middle" fill={GOLD} {...note} fontSize="10">
        07:00–13:30
      </text>
      <text className="chat-annot" x="347" y="67" textAnchor="middle" fill={GOLD} {...note} fontSize="10">
        08:00–14:00
      </text>
      <text className="chat-annot" x="259" y="104" textAnchor="middle" fill="#C22E22" {...note} fontSize="10">
        HAIL 15:10
      </text>
      {days.map(([x, d]) => (
        <text key={d} x={x} y="150" {...axis}>
          {d}
        </text>
      ))}
      <text x="8" y="134" {...tick}>0</text>
      <text x="8" y="88" {...tick}>5 h</text>
      <text x="8" y="16" {...tick}>dry</text>
      <text className="chat-annot" x="259" y="170" textAnchor="middle" fill="#C22E22" {...note}>
        HAIL WARNING WED 15:10
      </text>
      <text className="chat-annot" x="478" y="170" textAnchor="middle" fill={GOLD} {...note}>
        DRY WINDOWS TUE AND THU
      </text>
    </svg>
  );
}

function SchoolsChart() {
  const rain: [number, number, number][] = [
    [123, 112, 18], [135, 96, 34], [147, 78, 52], [159, 68, 62], [171, 72, 58],
    [182, 84, 46], [194, 98, 32], [206, 110, 20], [218, 120, 10],
  ];
  const times: [number, string][] = [
    [40, 'Thu 12'], [111, 'Thu 18'], [183, 'Fri 00'], [254, 'Fri 06'], [325, 'Fri 12'],
    [397, 'Fri 18'], [468, 'Sat 00'], [539, 'Sat 06'], [611, 'Sat 12'], [682, 'Sat 18'],
  ];
  return (
    <svg viewBox="0 0 712 176" aria-hidden className={svgClass}>
      <g className="chat-annot">
        <rect x="611" y="12" width="71" height="132" rx="6" fill="#128A5E" opacity="0.14" />
      </g>
      <line x1="40" y1="130" x2="682" y2="130" stroke="#1C2340" />
      {rain.map(([x, y, h]) => (
        <rect key={x} className="chat-bar" x={x} y={y} width="9" height={h} rx="2" fill="#0B63CE" />
      ))}
      <line className="chat-annot" x1="40" y1="70" x2="682" y2="70" stroke={GOLD} strokeWidth="1.5" strokeDasharray="5 5" />
      <polyline
        className="chat-line"
        points="40,88 111,88 147,70 183,46 218,35 254,36 325,40 397,46 468,54 539,62 611,70 682,78"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line className="chat-annot" x1="373" y1="14" x2="373" y2="130" stroke="#C22E22" strokeWidth="1.5" strokeDasharray="4 4" />
      <circle className="chat-annot" cx="611" cy="70" r="5" fill="#128A5E" stroke="#FFFFFF" strokeWidth="1.5" />
      <text className="chat-annot" x="395" y="84" fill={GOLD} {...note}>
        YOUR PLAYABLE LIMIT · 60% SATURATION
      </text>
      <text className="chat-annot" x="171" y="22" textAnchor="middle" fill="#8FB7FF" {...note}>
        RAIN · 1.4 IN · THU NIGHT
      </text>
      <text className="chat-annot" x="44" y="104" fontFamily="Manrope" fontSize="10" fill="#C9D1E3">
        OUTFIELD SOIL SATURATION
      </text>
      <text x="8" y="34" {...tick}>100</text>
      <text x="8" y="74" {...tick}>60</text>
      <text x="8" y="134" {...tick}>0</text>
      {times.map(([x, t]) => (
        <text key={t} x={x} y="150" {...axis}>
          {t}
        </text>
      ))}
      <text className="chat-annot" x="373" y="170" textAnchor="middle" fill="#E0564B" {...note}>
        GAME · FRI 16:00 · NO-GO
      </text>
      <text className="chat-annot" x="611" y="170" textAnchor="middle" fill="#3FC48E" {...note}>
        PLAYABLE FROM SAT 12:00
      </text>
    </svg>
  );
}

function AgricultureChart() {
  const times: [number, string][] = [
    [40, 'Tue 18'], [104, 'Wed 00'], [168, 'Wed 06'], [233, 'Wed 12'], [297, 'Wed 18'], [361, 'Thu 00'],
    [425, 'Thu 06'], [489, 'Thu 12'], [553, 'Thu 18'], [618, 'Fri 00'], [682, 'Fri 06'],
  ];
  return (
    <svg viewBox="0 0 712 176" aria-hidden className={svgClass}>
      <g className="chat-annot">
        <rect x="404" y="12" width="34" height="132" rx="6" fill="#C22E22" opacity="0.16" />
      </g>
      <line x1="40" y1="130" x2="682" y2="130" stroke="#1C2340" />
      <line className="chat-annot" x1="40" y1="99" x2="682" y2="99" stroke={GOLD} strokeWidth="1.5" strokeDasharray="5 5" />
      <g className="chat-annot">
        <line x1="297" y1="20" x2="297" y2="130" stroke={GOLD} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
      </g>
      <polyline
        className="chat-line"
        points="40,42 72,57 104,68 136,72 168,72 200,49 233,26 265,22 297,49 329,76 361,88 393,97 406,99 422,107 438,99 457,76 489,38 521,30 553,53 585,72 618,80 650,84 682,84"
        fill="none"
        stroke="#5FA8FF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle className="chat-annot" cx="422" cy="107" r="5" fill="#C22E22" stroke="#FFFFFF" strokeWidth="1.5" />
      <text className="chat-annot" x="44" y="93" fill={GOLD} {...note}>
        FROST LINE · 32 °F
      </text>
      <text x="8" y="34" {...tick}>50</text>
      <text x="8" y="103" {...tick}>32</text>
      <text x="8" y="16" {...tick}>°F</text>
      {times.map(([x, t]) => (
        <text key={t} x={x} y="150" {...axis}>
          {t}
        </text>
      ))}
      <text className="chat-annot" x="250" y="170" textAnchor="middle" fill={GOLD} {...note}>
        COVER BY WED 18:00
      </text>
      <text className="chat-annot" x="422" y="170" textAnchor="middle" fill="#E0564B" {...note}>
        FIRST FROST · THU 05:40
      </text>
    </svg>
  );
}

/**
 * Greens soil moisture (% VWC), Sat to Thu: observed to now, then the two
 * projections the answer weighs. y = 130 - (VWC - 30) * 3.14, so 30% sits on
 * the baseline and the 90% FC refill target (45% VWC) at y 83.
 */
function GolfChart() {
  const days: [number, string][] = [
    [40, 'Sat'], [168, 'Sun'], [297, 'Mon'], [425, 'Now'], [554, 'Wed'], [682, 'Thu'],
  ];
  return (
    <svg viewBox="0 0 712 176" aria-hidden className={svgClass}>
      <g className="chat-annot">
        <rect x="425" y="12" width="129" height="132" rx="6" fill="#128A5E" opacity="0.14" />
      </g>
      <line x1="40" y1="130" x2="682" y2="130" stroke="#1C2340" />
      <line className="chat-annot" x1="40" y1="83" x2="682" y2="83" stroke={GOLD} strokeWidth="1.5" strokeDasharray="5 5" />
      <line className="chat-annot" x1="425" y1="14" x2="425" y2="130" stroke="#8F9AB8" strokeWidth="1.5" strokeDasharray="4 4" />
      <polyline
        className="chat-line"
        points="40,30 168,49 297,71 425,96"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        className="chat-line"
        points="425,96 554,52 682,61"
        fill="none"
        stroke="#3FC48E"
        strokeWidth="2.5"
        strokeDasharray="6 5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        className="chat-line"
        points="425,96 554,104 682,113"
        fill="none"
        stroke="#E0564B"
        strokeWidth="2.5"
        strokeDasharray="6 5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle className="chat-annot" cx="425" cy="96" r="5" fill="#FFFFFF" stroke="#070D26" strokeWidth="1.5" />
      <text className="chat-annot" x="44" y="22" fontFamily="Manrope" fontSize="10" fill="#C9D1E3">
        SOIL MOISTURE · GREENS AVG 0–4 IN · OBSERVED
      </text>
      <text className="chat-annot" x="44" y="77" fill={GOLD} {...note}>
        REFILL TARGET · 90% FC
      </text>
      <text className="chat-annot" x="678" y="46" textAnchor="end" fill="#3FC48E" {...note}>
        WITH 0.18 IN
      </text>
      <text className="chat-annot" x="678" y="125" textAnchor="end" fill="#E0564B" {...note}>
        NO WATER
      </text>
      <text x="8" y="16" {...tick}>VWC</text>
      <text x="8" y="40" {...tick}>60</text>
      <text x="8" y="87" {...tick}>45</text>
      <text x="8" y="134" {...tick}>30</text>
      {days.map(([x, d]) => (
        <text key={d} x={x} y="150" {...axis}>
          {d}
        </text>
      ))}
      <text className="chat-annot" x="232" y="170" textAnchor="middle" fill="#8FB7FF" {...note}>
        ET 0.22 IN TODAY · RAIN 0.02 IN
      </text>
      <text className="chat-annot" x="490" y="170" textAnchor="middle" fill="#3FC48E" {...note}>
        RUN TONIGHT · 11 PM – 12:04 AM
      </text>
    </svg>
  );
}
