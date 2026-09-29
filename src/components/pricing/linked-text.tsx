import Link from 'next/link';

/**
 * Text with one phrase turned into an internal link. The copy stays a plain
 * string in `content/` (so schema can reuse it verbatim); the link is layered
 * on at render time.
 */
export function LinkedText({
  text,
  link,
  className = 'font-medium text-brand-blue underline underline-offset-2',
}: {
  text: string;
  link?: { text: string; href: string };
  className?: string;
}) {
  if (!link || !text.includes(link.text)) return <>{text}</>;
  const i = text.indexOf(link.text);
  return (
    <>
      {text.slice(0, i)}
      <Link href={link.href} className={className}>
        {link.text}
      </Link>
      {text.slice(i + link.text.length)}
    </>
  );
}
