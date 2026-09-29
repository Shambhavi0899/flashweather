import Link from 'next/link';

import type { Rich } from '@/content/blog';

/** A paragraph's runs: plain strings, or inline links to built routes. */
export function RichText({ text }: { text: Rich }) {
  return (
    <>
      {text.map((run, i) =>
        typeof run === 'string' ? (
          run
        ) : (
          <Link
            key={i}
            href={run.href}
            className="font-semibold text-brand-blue underline decoration-brand-blue/30 underline-offset-2 hover:decoration-brand-blue"
          >
            {run.text}
          </Link>
        ),
      )}
    </>
  );
}
