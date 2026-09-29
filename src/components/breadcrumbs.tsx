import Link from 'next/link';

import { JsonLd, breadcrumbSchema } from '@/lib/seo/jsonld';

type Crumb = { name: string; path: string };

/**
 * A visible breadcrumb and its BreadcrumbList schema, from one trail, so the
 * two cannot disagree. The markup is for Google; the links are for the person
 * who landed mid-site from a search.
 *
 * Pass the full trail from Home to the current page, inclusive.
 */
export function Breadcrumbs({
  trail,
  tone = 'dark',
  className = '',
}: {
  trail: Crumb[];
  tone?: 'dark' | 'light';
  className?: string;
}) {
  const muted = tone === 'dark' ? 'text-text-on-dark-muted' : 'text-text-muted';
  const current = tone === 'dark' ? 'text-text-on-dark' : 'text-text';

  return (
    <>
      <JsonLd schema={breadcrumbSchema(trail)} />
      <nav aria-label="Breadcrumb" className={`text-micro md:text-caption ${className}`}>
        <ol className={`flex flex-wrap items-center gap-2 ${muted}`}>
          {trail.map((crumb, i) => {
            const last = i === trail.length - 1;
            return (
              <li key={crumb.path} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className={current}>
                    {crumb.name}
                  </span>
                ) : (
                  <>
                    <Link href={crumb.path} className="hover:underline">
                      {crumb.name}
                    </Link>
                    <span aria-hidden>›</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
