import { BOLT_PATH } from '@/components/bolt-path';
import type { ProductLayerId } from '@/content/products';

/**
 * The hero's three-layer render as a small glyph: top to bottom Intelligence
 * (with the bolt), Delivery, Predictions, and Services as a dashed plate
 * beneath the platform. Drawn back to front, so each plate covers the one
 * below it. The lit plate turns viz-gold (styles/products.css, `pl-*`):
 * `lit` fixes it, as the mobile mini-headers do; without it the rail's
 * `data-active` picks it.
 *
 * Plates are 96 × 40 in a 120 × 120 box, 22 apart; `PLATE_Y` is each
 * plate's top point. The rail's click targets (`pl-hit-*`) trace the same
 * shapes, so change both together.
 */
const PLATE_Y: Record<Exclude<ProductLayerId, 'services'>, number> = {
  predictions: 48,
  delivery: 26,
  intelligence: 4,
};

const face = (y: number) => `M60 ${y}L108 ${y + 20}L60 ${y + 40}L12 ${y + 20}Z`;
const side = (y: number) => `M12 ${y + 20}L60 ${y + 40}L108 ${y + 20}v5L60 ${y + 45}L12 ${y + 25}Z`;

export function LayerStack({ lit, className }: { lit?: ProductLayerId; className: string }) {
  return (
    <svg aria-hidden viewBox="0 0 120 120" data-lit={lit} className={`pl-stack ${className}`}>
      <path data-layer="services" className="pl-plate pl-services" d={face(76)} />
      {(['predictions', 'delivery', 'intelligence'] as const).map((layer) => (
        <g key={layer} data-layer={layer} className="pl-plate">
          <path className="pl-side" d={side(PLATE_Y[layer])} />
          <path className="pl-face" d={face(PLATE_Y[layer])} />
          {layer === 'intelligence' && (
            <path className="pl-bolt" d={BOLT_PATH} transform="translate(51.7 13.1) scale(0.64)" />
          )}
        </g>
      ))}
    </svg>
  );
}
