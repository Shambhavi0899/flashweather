import { BOLT_PATH } from '@/components/bolt-path';

/** The bolt path the agent UI draws inside discs and beside questions. */
export function BoltGlyph({
  width = 12,
  height = 16,
  fill = '#070D26',
  className = '',
}: {
  width?: number;
  height?: number;
  fill?: string;
  className?: string;
}) {
  return (
    <svg width={width} height={height} viewBox="0 0 26 34" aria-hidden className={`shrink-0 ${className}`}>
      <path d={BOLT_PATH} fill={fill} />
    </svg>
  );
}

/** A gold metallic disc with the navy bolt inside: the agent's avatar. */
export function AgentAvatar({ square = false }: { square?: boolean }) {
  return (
    <span
      aria-hidden
      className={`bg-gold-metallic flex size-8 shrink-0 items-center justify-center ${square ? 'rounded-lg' : 'rounded-full'}`}
    >
      <BoltGlyph />
    </span>
  );
}
