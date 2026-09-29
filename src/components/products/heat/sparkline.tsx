import { outlookHours } from './content';

/**
 * The six-hour sparkline above each heat parameter (styles/heat-predicts.css):
 * the hero's illustrative Field B afternoon, Now to 6 pm, with a dot and the
 * value at the curve's peak, and a 4 pm readout that shows while any column
 * of the row is hovered.
 *
 * The outer SVG is in CSS pixels, so its labels stay 11px however wide the
 * column is; x positions are percentages of its width. Only the curve sits
 * in a stretched inner SVG, with a stroke that does not stretch with it.
 */

const HEIGHT = 78;
/** The curve's band: room above it for the peak value, below for the hours. */
const PLOT_TOP = 24;
const PLOT_HEIGHT = 32;
const BASELINE = 62;
/**
 * The smallest span of °F the band stands for, so a near-flat parameter
 * (dew point moves 1.5 °F) draws near flat instead of filling the band.
 */
const MIN_SPAN = 4;
const LAST = outlookHours.length - 1;
/** The hover readout's hour, where the hero's WBGT peaks. */
const READOUT = outlookHours.indexOf('4 pm');

const pct = (i: number) => `${((i / LAST) * 100).toFixed(3)}%`;
const degrees = (value: number) => `${value.toFixed(1)} °F`;

/**
 * A monotone cubic (Fritsch-Carlson) through the points, in hour-index x and
 * pixel y: smooth, and never above the peak or below the lowest value.
 */
function monotonePath(ys: number[]) {
  const n = ys.length;
  const d = ys.slice(1).map((y, i) => y - ys[i]);
  const m = ys.map((_, i) => (i === 0 ? d[0] : i === n - 1 ? d[n - 2] : d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2));
  d.forEach((slope, i) => {
    if (slope === 0) {
      m[i] = m[i + 1] = 0;
      return;
    }
    const a = m[i] / slope;
    const b = m[i + 1] / slope;
    const h = a * a + b * b;
    if (h > 9) {
      const t = 3 / Math.sqrt(h);
      m[i] = t * a * slope;
      m[i + 1] = t * b * slope;
    }
  });
  const f = (v: number) => Number(v.toFixed(2));
  return ys.reduce(
    (path, y, i) =>
      i === 0 ? `M0 ${f(y)}` : `${path}C${f(i - 2 / 3)} ${f(ys[i - 1] + m[i - 1] / 3)} ${f(i - 1 / 3)} ${f(y - m[i] / 3)} ${i} ${f(y)}`,
    '',
  );
}

export function Sparkline({ id, title, values }: { id: string; title: string; values: number[] }) {
  const low = Math.min(...values);
  const high = Math.max(...values);
  const span = Math.max(high - low, MIN_SPAN);
  const floor = low - (span - (high - low)) / 2;
  const ys = values.map((v) => PLOT_TOP + PLOT_HEIGHT - ((v - floor) / span) * PLOT_HEIGHT);
  const peak = values.indexOf(high);
  const peakAnchor = peak === 0 ? 'start' : peak === LAST ? 'end' : 'middle';
  const label = `${title} for Practice Field B, illustrative: ${degrees(values[0])} now, peaking at ${degrees(high)} at ${outlookHours[peak]}, ${degrees(values[LAST])} at ${outlookHours[LAST]}.`;

  return (
    <svg
      role="img"
      aria-labelledby={`${id}-title`}
      height={HEIGHT}
      className="hsp-spark block w-full overflow-visible font-sans"
    >
      <title id={`${id}-title`}>{label}</title>
      <line className="hsp-base" x1="0" x2="100%" y1={BASELINE} y2={BASELINE} />

      <g aria-hidden className="hsp-at">
        <line className="hsp-at-line" x1={pct(READOUT)} x2={pct(READOUT)} y1="16" y2={BASELINE} />
        <text className="hsp-at-value" x={pct(READOUT)} y="11" textAnchor="middle">
          {outlookHours[READOUT]} · {degrees(values[READOUT])}
        </text>
      </g>

      <svg y={PLOT_TOP - 2} height={PLOT_HEIGHT + 4} viewBox={`0 ${PLOT_TOP - 2} ${LAST} ${PLOT_HEIGHT + 4}`} preserveAspectRatio="none" overflow="visible">
        <path className="hsp-curve" d={monotonePath(ys)} vectorEffect="non-scaling-stroke" />
      </svg>

      <circle aria-hidden className="hsp-at-dot" cx={pct(READOUT)} cy={ys[READOUT].toFixed(2)} r="3" />
      <g aria-hidden className="hsp-peak">
        <circle className="hsp-peak-dot" cx={pct(peak)} cy={ys[peak].toFixed(2)} r="3.5" />
        <text className="hsp-peak-value" x={pct(peak)} y={(ys[peak] - 9).toFixed(2)} textAnchor={peakAnchor}>
          {degrees(high)}
        </text>
      </g>

      <text aria-hidden className="hsp-hour" x="0" y={HEIGHT - 3}>
        {outlookHours[0]}
      </text>
      <text aria-hidden className="hsp-hour" x="100%" y={HEIGHT - 3} textAnchor="end">
        {outlookHours[LAST]}
      </text>
    </svg>
  );
}
