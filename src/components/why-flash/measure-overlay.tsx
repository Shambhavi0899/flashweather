/**
 * The line drawing over a "What does each technology actually measure?" card
 * image: what that technology sees. Drawn on the photo's own 384 × 216 frame
 * so the marks land on the bolt, the mast and the rooftops.
 *
 *   strikes  four strike marks on the ground, labelled "already happened"
 *   radius   one dashed circle around the mast, with its radius
 *   cell     a gold patch of ground ahead of the shelf cloud
 *
 * No grid: each overlay is only what that technology reports. Hidden until
 * the card is hovered, shown from the start on a phone or a touch screen
 * (styles/why-flash-measures.css). The words are in the card copy, so the
 * drawing is decorative.
 */

type Kind = 'strikes' | 'radius' | 'cell';

const STRIKES = [
  [130, 166],
  [212, 176],
  [284, 158],
  [338, 172],
] as const;

function Marks({ kind }: { kind: Kind }) {
  if (kind === 'strikes') {
    return (
      <g stroke="#FFFFFF" fill="none">
        {STRIKES.map(([x, y]) => (
          <g key={x} transform={`translate(${x} ${y})`}>
            <circle r="9" strokeOpacity="0.35" />
            <path d="M-4 -4L4 4M4 -4L-4 4" strokeWidth="1.75" strokeLinecap="round" />
          </g>
        ))}
      </g>
    );
  }
  if (kind === 'radius') {
    return (
      <g stroke="#FFFFFF" fill="none">
        <circle cx="122" cy="100" r="70" strokeWidth="1.5" strokeDasharray="4 5" strokeOpacity="0.9" />
        <path d="M122 100H192" strokeOpacity="0.6" />
        <circle cx="122" cy="100" r="3" fill="#FFFFFF" stroke="none" />
      </g>
    );
  }
  return (
    <g stroke="var(--color-viz-gold)">
      <path d="M48 140L156 136L176 164L36 168Z" fill="var(--color-viz-gold)" fillOpacity="0.28" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M252 118L192 140" fill="none" strokeOpacity="0.7" strokeDasharray="3 4" />
      <path d="M198 133L192 140L201 141.5" fill="none" strokeOpacity="0.7" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/** The drawing, for inside the image's clipped box. */
export function MeasureMarks({ kind }: { kind: Kind }) {
  return (
    <svg viewBox="0 0 384 216" aria-hidden className="wfm-overlay absolute inset-0 h-full w-full">
      <Marks kind={kind} />
    </svg>
  );
}

/** The label: on the image on a wide screen, under it on a phone. */
export function MeasureLabel({ kind, label }: { kind: Kind; label: string }) {
  return (
    <p aria-hidden className={`wfm-overlay wfm-label wfm-label-${kind}`}>
      {label}
    </p>
  );
}
