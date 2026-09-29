import { useId } from 'react';

/*
 * The live overlay over each countdown photo. The drawn ones share the
 * photo's own space (1376x768, sliced like object-cover), so the markers stay
 * on the field and the strobe on the gable at any crop. All motion is CSS
 * (styles/lightning-countdown.css) and only runs on the active step.
 */
const VIEW = '0 0 1376 768';

/** T–60: soft cloud drifting over the anvil. */
function Clouds() {
  return (
    <>
      <span className="lc-cloud" />
      <span className="lc-cloud" />
    </>
  );
}

/** Where the staff stand on the T–30 field: [x, y] of each marker's tip. */
const STAFF = [
  [262, 566],
  [592, 522],
  [908, 594],
  [1130, 522],
];

/** T–30: a marker for each member of staff, dropped on the field in turn. */
function Staff() {
  return (
    <svg viewBox={VIEW} preserveAspectRatio="xMidYMid slice">
      {STAFF.map(([x, y]) => (
        <g key={x} transform={`translate(${x} ${y})`}>
          <g className="lc-staff">
            <path className="lc-staff-pin" d="M0 0C-8-20-44-38-44-72a44 44 0 1 1 88 0C44-38 8-20 0 0Z" />
            <circle className="lc-staff-figure" cx="0" cy="-86" r="12" />
            <path className="lc-staff-figure" d="M-22-52c0-14 10-22 22-22s22 8 22 22Z" />
          </g>
        </g>
      ))}
    </svg>
  );
}

/** T–15: the horn's strobe on the gable. */
function Strobe() {
  const glow = useId();
  return (
    <svg viewBox={VIEW} preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id={glow}>
          <stop className="lc-strobe-stop" offset="0" stopOpacity="0.75" />
          <stop className="lc-strobe-stop" offset="0.4" stopOpacity="0.22" />
          <stop className="lc-strobe-stop" offset="1" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle className="lc-strobe-glow" cx="908" cy="440" r="220" fill={`url(#${glow})`} />
      <circle className="lc-strobe-ring" cx="908" cy="440" r="36" />
      <circle className="lc-strobe-ring" cx="908" cy="440" r="36" />
      <circle className="lc-strobe-core" cx="908" cy="440" r="14" />
    </svg>
  );
}

/** T–0: the strike's flash over the frame. */
function Flash() {
  return <span className="lc-flash" />;
}

/** After: the storm's shade lifts off the sky. */
function Clearing() {
  return (
    <>
      <span className="lc-veil" />
      <span className="lc-glow" />
    </>
  );
}

const overlays = [Clouds, Staff, Strobe, Flash, Clearing];

export function CountdownFx({ step }: { step: number }) {
  const Overlay = overlays[step];
  if (!Overlay) return null;
  return (
    <span aria-hidden className={`lc-fx${Overlay === Clearing ? ' lc-fx-clear' : ''}`}>
      <Overlay />
    </span>
  );
}
