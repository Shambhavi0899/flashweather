import Link from 'next/link';

import type { PhraseLink } from '@/content/why-flash';

/**
 * Plain copy with some of its phrases turned into links. The copy stays one
 * readable string in `content/`, the same string the FAQ schema carries; the
 * links are laid over it here, each on the first place its phrase appears.
 * A link says what it leads to ("the accuracy method"), never its path.
 */
export function LinkifiedText({
  text,
  links = [],
  className = '',
}: {
  text: string;
  links?: PhraseLink[];
  className?: string;
}) {
  // Where each phrase sits, in reading order. A phrase the copy no longer
  // holds is dropped, so an edit to the copy cannot leave a broken link.
  const found = links
    .map((link) => ({ ...link, at: text.indexOf(link.text) }))
    .filter((link) => link.at >= 0)
    .sort((a, b) => a.at - b.at);

  const parts: React.ReactNode[] = [];
  let from = 0;
  for (const link of found) {
    if (link.at < from) continue; // overlaps the phrase before it
    parts.push(text.slice(from, link.at));
    parts.push(
      <Link
        key={link.at}
        href={link.href}
        className={`font-semibold text-brand-blue underline-offset-2 hover:underline ${className}`}
      >
        {link.text}
      </Link>,
    );
    from = link.at + link.text.length;
  }
  parts.push(text.slice(from));

  return <>{parts}</>;
}
