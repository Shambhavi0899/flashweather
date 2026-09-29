/**
 * The small spaced-caps label above a heading.
 *
 * Gold rules: on dark grounds small gold text is viz-gold; on light grounds
 * it is gold-on-light. Never the bright gold on white -- it fails contrast.
 */
export function Eyebrow({
  children,
  tone = 'dark',
  className = '',
}: {
  children: React.ReactNode;
  tone?: 'dark' | 'light';
  className?: string;
}) {
  return (
    <p
      className={`text-micro font-bold tracking-label-wide uppercase ${
        tone === 'dark' ? 'text-viz-gold' : 'text-gold-on-light'
      } ${className}`}
    >
      {children}
    </p>
  );
}
