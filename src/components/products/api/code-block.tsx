/**
 * The dark code windows the API page draws: a header bar (method badge, URL,
 * status) over a <pre><code> body. The code is real text, so it is crawlable
 * and copyable; it scrolls sideways inside its own box on narrow screens and
 * never widens the page.
 *
 * Colouring follows the design: keys and punctuation muted, strings light,
 * numbers viz-gold (small gold on a dark ground), null dimmed.
 */

const TOKEN = /("(?:[^"\\]|\\.)*")(\s*:)?|(-?\d+(?:\.\d+)?)|\b(null|true|false)\b/g;

export function highlight(code: string, gold: string[] = []) {
  const out: React.ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const match of code.matchAll(TOKEN)) {
    const start = match.index ?? 0;
    if (start > last) out.push(code.slice(last, start));
    const [whole, str, colon, num, lit] = match;
    if (str && colon) {
      out.push(str + colon);
    } else if (str) {
      out.push(
        <span key={i++} className={gold.includes(str) ? 'text-viz-gold' : 'text-[#DCE2F0]'}>
          {str}
        </span>,
      );
    } else if (num) {
      out.push(
        <span key={i++} className="text-viz-gold">
          {num}
        </span>,
      );
    } else if (lit) {
      out.push(
        <span key={i++} className="text-[#6F7A99]">
          {lit}
        </span>,
      );
    } else {
      out.push(whole);
    }
    last = start + whole.length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

export function CodeBody({
  code,
  gold,
  label,
  className = '',
}: {
  code: string;
  /** String literals (with their quotes) to colour gold, e.g. a status value. */
  gold?: string[];
  /** A small caps label above the code, such as REQUEST or RESPONSE. */
  label?: string;
  className?: string;
}) {
  return (
    <div className={`px-5 py-4 ${className}`}>
      {label && (
        <p className="pb-[6px] text-[11px] leading-[14px] font-semibold tracking-label text-[#8F9AB8] uppercase">
          {label}
        </p>
      )}
      <pre className="relative overflow-x-auto font-mono text-caption leading-5 text-[#8F9AB8]">
        <code>{highlight(code, gold)}</code>
      </pre>
    </div>
  );
}

export function MethodBadge({ method, tone }: { method: string; tone: 'green' | 'gold' }) {
  return (
    <span
      className={`flex h-[22px] shrink-0 items-center rounded-sm border px-2 text-[11px] leading-[14px] font-bold tracking-[0.08em] ${
        tone === 'green'
          ? 'border-[#128A5E99] bg-[#128A5E2E] text-[#7FD1A8]'
          : 'border-viz-gold/60 bg-viz-gold/16 text-viz-gold'
      }`}
    >
      {method}
    </span>
  );
}

/** The window chrome: rounded, translucent navy, hairline border. */
export function CodeWindow({
  header,
  children,
  className = '',
}: {
  header: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <figure
      className={`flex min-w-0 flex-col overflow-hidden rounded-[20px] border border-white/10 bg-[#040818B8] ${className}`}
    >
      <figcaption className="flex items-center justify-between gap-3 border-b border-white/8 px-5 py-[14px]">
        {header}
      </figcaption>
      {children}
    </figure>
  );
}

/** A header row: badge, URL (monospace, wraps anywhere on a phone), status. */
export function CodeHeader({
  method,
  tone,
  url,
  status,
}: {
  method: string;
  tone: 'green' | 'gold';
  url: string;
  status?: string;
}) {
  return (
    <>
      <span className="flex min-w-0 items-center gap-[10px]">
        <MethodBadge method={method} tone={tone} />
        <code className="min-w-0 font-mono text-caption leading-caption [overflow-wrap:anywhere] text-[#DCE2F0]">{url}</code>
      </span>
      {status && <span className="shrink-0 text-[11px] leading-[14px] font-medium text-alert-clear">{status}</span>}
    </>
  );
}
