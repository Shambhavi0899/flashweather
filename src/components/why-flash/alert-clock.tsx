import { clockDial } from '@/content/why-flash';

/**
 * "Where each alert sits on the clock": a clock dial for the hour before a
 * first strike, drawn between the two cards (Detection left, Flash right).
 *
 * The hour runs clockwise from –60 min at 12 o'clock to the first strike at
 * 330°, so the last 30° holds what comes after it: the detection alert. The
 * dial is one image to assistive tech (`clockDial.alt`); its labels are text
 * for sighted readers. The sweep, the card highlights, the hover pulses and
 * the replay button live in styles/why-flash-clock.css, played by the
 * surrounding Motion block. The markup is the finished dial.
 */

const C = 200; // centre of the 400 × 400 viewBox
const R = 124; // the ring
const HOUR = 330; // degrees the hour covers
const DETECTION_AT = 345; // just after the strike

/** A point on a circle of radius `r`, `deg` clockwise from 12 o'clock. */
function at(deg: number, r: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: +(C + r * Math.sin(rad)).toFixed(2), y: +(C - r * Math.cos(rad)).toFixed(2) };
}

// One tick a minute; longer every 5 and every 15.
const ticks = Array.from({ length: 61 }, (_, minute) => {
  const deg = (minute / 60) * HOUR;
  const size = minute % 15 === 0 ? 'l' : minute % 5 === 0 ? 'm' : 's';
  const outer = size === 'l' ? 141 : size === 'm' ? 137 : 134;
  return { minute, size, from: at(deg, 130), to: at(deg, outer) };
});

const start = at(0, R);
const strike = at(HOUR, R);
const detection = at(DETECTION_AT, R);
const arc = `M${start.x} ${start.y} A${R} ${R} 0 1 1 ${strike.x} ${strike.y}`;

export function AlertClock({ className = '' }: { className?: string }) {
  return (
    <figure className={`flex flex-col items-center gap-4 ${className}`}>
      <div role="img" aria-label={clockDial.alt} className="eec-dial">
        <svg viewBox="0 0 400 400" aria-hidden className="absolute inset-0 size-full overflow-visible">
          <circle cx={C} cy={C} r={R} className="eec-ring" />
          {ticks.map((tick) => (
            <line
              key={tick.minute}
              x1={tick.from.x}
              y1={tick.from.y}
              x2={tick.to.x}
              y2={tick.to.y}
              className="eec-tick"
              data-size={tick.size}
            />
          ))}
          <path d={arc} pathLength={1} className="eec-arc" />

          {/* Pulse rings sit under their markers; a card hover sets them going. */}
          <circle cx={start.x} cy={start.y} r={7} className="eec-ping" data-kind="flash" data-mark="flash" />
          <circle cx={strike.x} cy={strike.y} r={8} className="eec-ping" data-kind="detection" data-mark="strike" />
          <circle cx={detection.x} cy={detection.y} r={6} className="eec-ping" data-kind="detection" data-mark="detection" />

          <g className="eec-hand">
            <line x1={C} y1={C + 14} x2={C} y2={C - 104} />
            <circle cx={C} cy={C} r={5} />
          </g>

          <circle cx={start.x} cy={start.y} r={7} className="eec-mark" data-mark="flash" />
          <circle cx={strike.x} cy={strike.y} r={8} className="eec-mark" data-mark="strike" />
          <circle cx={detection.x} cy={detection.y} r={6} className="eec-mark" data-mark="detection" />
        </svg>

        <p aria-hidden className="eec-label" data-label="flash">
          <span className="eec-start">{clockDial.start}</span>
          <span className="eec-flash">{clockDial.flash}</span>
        </p>
        <p aria-hidden className="eec-label" data-label="strike">
          {clockDial.strike}
        </p>
        <p aria-hidden className="eec-label" data-label="detection">
          {clockDial.detection}
        </p>
        <p aria-hidden className="eec-label" data-label="window">
          {clockDial.window}
        </p>
        {clockDial.ticks.map((tick, i) => (
          <p key={tick} aria-hidden className="eec-label" data-label={`tick-${i}`}>
            {tick}
          </p>
        ))}
      </div>
      <button type="button" data-motion-replay className="eec-replay">
        <span aria-hidden>↻</span> {clockDial.replay}
      </button>
      <figcaption className="max-w-[400px] text-center text-[11px] leading-[16px] font-bold tracking-[0.13em] text-text-on-dark-muted uppercase">
        {clockDial.caption}
      </figcaption>
    </figure>
  );
}
