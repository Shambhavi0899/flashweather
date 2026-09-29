import { useId } from 'react';

/*
 * The live overlay drawn over each "How it works" photo. Every overlay shares
 * the photo's own coordinate system (1376x768, sliced like object-cover), so
 * the marks stay on the dome, the streams, the land and the horn at any crop.
 * All motion is CSS (styles/home.css) and only runs while the step is active.
 */
const VIEW = '0 0 1376 768';

/** 03: a ground grid in perspective, vanishing on the photo's horizon. */
const HORIZON = { x: 688, y: 395 };
const NEAR = 768 - HORIZON.y; // the nearest row sits on the bottom edge
const COLUMN = 260; // column width on the nearest row
const depths = [1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6];
const columns = [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6];
const ground = (column: number, depth: number) =>
  `${(HORIZON.x + (column * COLUMN) / depth).toFixed(1)},${(HORIZON.y + NEAR / depth).toFixed(1)}`;
const cell = [ground(1, 2), ground(2, 2), ground(2, 2.5), ground(1, 2.5)].join(' ');

function Radar() {
  return (
    <>
      <circle className="how-fx-ring" cx="688" cy="334" r="150" />
      <circle className="how-fx-ring how-fx-ring-far" cx="688" cy="334" r="240" />
      <circle className="how-fx-ping motion-loop" cx="688" cy="334" r="150" />
      {/* Turns about the dome (688, 334); the wedges trail the beam. */}
      <g className="how-fx-sweep motion-loop">
        <path className="how-fx-wedge" d="M688 334l240 0a240 240 0 0 0 -5.2 -49.9z" fillOpacity="0.12" />
        <path className="how-fx-wedge" d="M688 334l234.8 -49.9a240 240 0 0 0 -15.5 -47.7z" fillOpacity="0.07" />
        <path className="how-fx-wedge" d="M688 334l219.3 -97.6a240 240 0 0 0 -35.4 -56.7z" fillOpacity="0.035" />
        <line className="how-fx-beam" x1="688" y1="334" x2="928" y2="334" />
      </g>
    </>
  );
}

function Signals() {
  return (
    <>
      <g className="how-fx-stream how-fx-stream-a">
        <circle className="how-fx-dot motion-loop" r="4" />
        <circle className="how-fx-dot motion-loop" r="3" />
        <circle className="how-fx-dot motion-loop" r="4.5" />
        <circle className="how-fx-dot motion-loop" r="3" />
      </g>
      <g className="how-fx-stream how-fx-stream-b">
        <circle className="how-fx-dot motion-loop" r="3.5" />
        <circle className="how-fx-dot motion-loop" r="3" />
        <circle className="how-fx-dot motion-loop" r="4" />
      </g>
      <g className="how-fx-stream how-fx-stream-c">
        <circle className="how-fx-dot motion-loop" r="3" />
        <circle className="how-fx-dot motion-loop" r="3.5" />
      </g>
    </>
  );
}

function Grid() {
  const fade = useId();
  const mask = useId();
  return (
    <>
      <defs>
        <linearGradient id={fade} x1="0" y1={HORIZON.y} x2="0" y2="768" gradientUnits="userSpaceOnUse">
          <stop offset="0.08" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.45" stopColor="#fff" />
        </linearGradient>
        <mask id={mask} maskUnits="userSpaceOnUse" x="0" y={HORIZON.y} width="1376" height={NEAR}>
          <rect y={HORIZON.y} width="1376" height={NEAR} fill={`url(#${fade})`} />
        </mask>
      </defs>
      <g className="how-fx-grid" mask={`url(#${mask})`}>
        {depths.map((depth) => (
          <line key={depth} x1="0" x2="1376" y1={HORIZON.y + NEAR / depth} y2={HORIZON.y + NEAR / depth} />
        ))}
        {columns.map((column) => (
          <line key={column} x1={HORIZON.x} y1={HORIZON.y} x2={HORIZON.x + column * COLUMN} y2="768" />
        ))}
        <polygon className="how-fx-cell motion-loop" points={cell} />
      </g>
    </>
  );
}

function Siren() {
  const glow = useId();
  return (
    <>
      <defs>
        <radialGradient id={glow}>
          <stop className="how-fx-glow-stop" offset="0" stopOpacity="0.6" />
          <stop className="how-fx-glow-stop" offset="0.45" stopOpacity="0.18" />
          <stop className="how-fx-glow-stop" offset="1" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle className="how-fx-glow motion-loop" cx="787" cy="197" r="170" fill={`url(#${glow})`} />
      {/* Arcs about the mouth of the horn (581, 330), which faces left. */}
      <g>
        <path className="how-fx-alert motion-loop" d="M537.4 267.7A76 76 0 0 0 537.4 392.3" />
        <path className="how-fx-alert motion-loop" d="M537.4 267.7A76 76 0 0 0 537.4 392.3" />
        <path className="how-fx-alert motion-loop" d="M537.4 267.7A76 76 0 0 0 537.4 392.3" />
      </g>
    </>
  );
}

const overlays = [Radar, Signals, Grid, Siren];

export function StepOverlay({ step }: { step: number }) {
  const Overlay = overlays[step];
  if (!Overlay) return null;
  return (
    <svg aria-hidden className="how-fx" viewBox={VIEW} preserveAspectRatio="xMidYMid slice">
      <Overlay />
    </svg>
  );
}
