import { BOLT_PATH } from '@/components/bolt-path';

/** A flat bolt glyph in a single colour. Decorative. */
export function BoltIcon({ className = 'h-4 w-3', fill = 'currentColor' }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 26 34" aria-hidden className={`shrink-0 ${className}`}>
      <path d={BOLT_PATH} fill={fill} />
    </svg>
  );
}

/**
 * The bolt filled with the metallic gold gradient: `.home-gold-bolt` (src/styles/home.css)
 * masks bg-gold-metallic with the BOLT_PATH glyph.
 */
export function GoldBolt({ className = 'h-4 w-3' }: { className?: string }) {
  return <span aria-hidden className={`home-gold-bolt bg-gold-metallic block shrink-0 ${className}`} />;
}

/** The gold disc with a navy bolt: the Flash Agent avatar. */
export function AgentBadge({ className = 'size-8 rounded-lg' }: { className?: string }) {
  return (
    <span aria-hidden className={`bg-gold-metallic flex shrink-0 items-center justify-center ${className}`}>
      <svg width="12" height="16" viewBox="0 0 26 34">
        <path d={BOLT_PATH} fill="#070D26" />
      </svg>
    </span>
  );
}
