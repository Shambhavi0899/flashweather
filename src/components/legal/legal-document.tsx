import Link from 'next/link';

import { Breadcrumbs } from '@/components/breadcrumbs';
import { Eyebrow } from '@/components/eyebrow';
import { HeroSection, HeroWords } from '@/components/hero/hero';
import type { LegalBlock, LegalDocument, LegalRun, LegalSection } from '@/content/legal';

/**
 * One template for every legal document: a narrow reading column, the
 * document's own table of contents where it has one (plus a sticky copy
 * beside the column on wide screens), and the live page's "Last updated"
 * line under the H1. The wording is the data's, verbatim; this only lays it out.
 */
export function LegalDocumentPage({ doc }: { doc: LegalDocument }) {
  const toc = doc.sections.map((section) => ({ id: section.id, label: section.tocLabel ?? section.heading }));
  const hasToc = toc.length > 0;

  return (
    <>
      <HeroSection as="header" theme="light" className="overflow-hidden border-b border-border bg-surface-sunken">
        <div className="hero-copy container-page flex flex-col gap-5 pt-10 pb-10 md:pt-14 md:pb-12">
          <Breadcrumbs
            tone="light"
            className="hero-crumbs"
            trail={[
              { name: 'Home', path: '/' },
              { name: doc.label, path: doc.path },
            ]}
          />
          <Eyebrow tone="light" className="hero-eyebrow pt-4">
            Legal
          </Eyebrow>
          <h1 className="max-w-[900px] text-[36px] leading-[42px] font-extrabold tracking-[-0.04em] text-text md:text-display-m md:leading-display-m">
            <HeroWords text={doc.headline} tone="light" />
          </h1>
          {doc.lastUpdated && (
            <p className="hero-lede text-body-s text-text-muted">
              <time dateTime={doc.lastUpdated.iso}>{doc.lastUpdated.label}</time>
            </p>
          )}
        </div>
      </HeroSection>

      <div
        className={`container-page grid grid-cols-1 gap-12 pt-10 pb-20 md:pt-14 lg:pb-28 ${
          hasToc ? 'lg:grid-cols-[260px_minmax(0,760px)] lg:gap-16' : ''
        }`}
      >
        {hasToc && (
          <nav aria-label="On this page" className="hidden lg:block">
            <div className="legal-toc-rail sticky top-[88px] overflow-y-auto">
              <p className="pb-3 text-[11px] leading-[14px] font-bold tracking-[0.13em] text-text-muted uppercase">
                On this page
              </p>
              <ol className="flex flex-col gap-[2px]">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="flex min-h-9 items-center border-l-2 border-border px-3 py-[6px] text-caption text-text-muted transition hover:border-brand-blue hover:bg-neutral-0 hover:text-brand-blue"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>
        )}

        <article className="legal-prose flex max-w-narrow min-w-0 flex-col gap-5">
          <Blocks blocks={doc.intro} />

          {doc.preamble.map((section) => (
            <Section key={section.id} section={section} />
          ))}

          {hasToc && (
            <nav
              aria-labelledby="legal-contents"
              className="mt-4 rounded-md border border-border bg-surface-sunken px-5 py-6 sm:px-7"
            >
              <h2 id="legal-contents" className="text-body-s font-extrabold tracking-label text-text">
                {doc.tocHeading ?? 'Contents'}
              </h2>
              <ol className="mt-4 flex flex-col">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="flex min-h-11 items-center text-body-s text-brand-blue hover:underline"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {doc.sections.map((section) => (
            <Section key={section.id} section={section} />
          ))}
        </article>
      </div>
    </>
  );
}

function Section({ section }: { section: LegalSection }) {
  return (
    <section id={section.id} aria-labelledby={`${section.id}-heading`} className="flex scroll-mt-6 flex-col gap-5 pt-8">
      <h2
        id={`${section.id}-heading`}
        className="text-h4 leading-h4 font-extrabold tracking-heading text-text md:text-[22px] md:leading-[30px]"
      >
        {section.heading}
      </h2>
      <Blocks blocks={section.blocks} />
    </section>
  );
}

function Blocks({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </>
  );
}

function Block({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className="text-body text-text">
          <Runs runs={block.text} />
        </p>
      );
    case 'inShort': {
      const [label, ...rest] = block.text.split(':');
      return (
        <p className="legal-in-short text-body text-text">
          <strong className="font-bold">{label}:</strong>
          {rest.join(':')}
        </p>
      );
    }
    case 'subheading':
      return <h3 className="pt-3 text-body-l leading-body font-bold text-text">{block.text}</h3>;
    case 'minorHeading':
      return <h4 className="pt-1 text-body font-bold text-text">{block.text}</h4>;
    case 'list':
      return (
        <ul className="flex list-disc flex-col gap-2 pl-6 text-body text-text marker:text-text-subtle">
          {block.items.map((item, i) => (
            <li key={i}>
              <Runs runs={item} />
            </li>
          ))}
        </ul>
      );
    case 'table':
      return (
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full min-w-[560px] border-collapse text-left text-body-s">
            <caption className="sr-only">{block.caption}</caption>
            <thead className="bg-surface-raised">
              <tr>
                {block.columns.map((column) => (
                  <th key={column} scope="col" className="px-4 py-3 font-bold text-text">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row[0]} className="border-t border-border align-top">
                  <th scope="row" className="px-4 py-3 font-semibold text-text">
                    {row[0]}
                  </th>
                  {row.slice(1).map((cell, i) => (
                    <td key={i} className="px-4 py-3 text-text-muted">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'address':
      return (
        <address className="text-body text-text not-italic">
          {block.lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>
      );
  }
}

function Runs({ runs }: { runs: LegalRun[] }) {
  return (
    <>
      {runs.map((run, i) => {
        if (typeof run === 'string') return <span key={i}>{run}</span>;
        if ('href' in run) {
          const internal = run.href.startsWith('/');
          return internal ? (
            <Link key={i} href={run.href} className="legal-link">
              {run.text}
            </Link>
          ) : (
            <a
              key={i}
              href={run.href}
              className="legal-link"
              {...(run.href.startsWith('http') ? { rel: 'noopener' } : {})}
            >
              {run.text}
            </a>
          );
        }
        return (
          <strong key={i} className="font-bold">
            {run.text}
          </strong>
        );
      })}
    </>
  );
}
