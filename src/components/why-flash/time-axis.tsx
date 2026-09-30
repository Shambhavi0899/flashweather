import { category } from '@/content/why-flash-hub';

/**
 * The time axis under "three kinds of weather tools": where each kind of
 * tool puts its answer. Detection is a grey mark at NOW, Forecasting a soft
 * band across later today, Prediction one sharp gold mark in the next hour.
 *
 * Positions, the draw-in and the card-hover highlight all live in
 * styles/why-flash-kinds.css. The axis is drawn, so it is one image to
 * assistive tech and `axisLabel` says what it shows.
 */
export function TimeAxis() {
  return (
    <div role="img" aria-label={category.axisLabel} className="wfk-axis">
      <span className="wfk-line" />
      <span className="wfk-band" data-kind="forecasting" />
      {category.kinds.map((kind) => (
        <span key={kind.key} className="wfk-mark" data-kind={kind.key}>
          <span className="wfk-mark-label">{kind.mark}</span>
          <span className="wfk-mark-stem" />
          <span className="wfk-mark-dot" />
        </span>
      ))}
      {category.axis.map((tick, i) => (
        <span key={tick} className="wfk-tick" data-tick={i}>
          {tick}
        </span>
      ))}
    </div>
  );
}
