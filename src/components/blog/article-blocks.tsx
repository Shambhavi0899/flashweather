import Link from 'next/link';

import type { Block } from '@/content/blog';

import { PhotoPanel } from './photo-panel';
import { RichText } from './rich-text';

/**
 * Renders a post's body blocks. The markup lives here, once; a post is data.
 */
export function ArticleBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => (
        <ArticleBlock key={i} block={block} />
      ))}
    </>
  );
}

function ArticleBlock({ block }: { block: Block }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className="text-[17px] leading-h4 text-pretty text-text md:text-body md:leading-body">
          <RichText text={block.text} />
        </p>
      );

    case 'stats':
      return (
        <ul
          aria-label={block.label}
          className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-4"
        >
          {block.items.map((item) => (
            <li
              key={item.value}
              className={`flex flex-col gap-[6px] px-5 py-[18px] ${item.emphasis ? 'bg-brand-navy' : 'bg-surface-sunken'}`}
            >
              <span
                className={`text-h3 leading-body-l font-bold tracking-display ${
                  item.emphasis ? 'text-text-on-dark' : 'text-text'
                }`}
              >
                {item.value}
              </span>
              <span className={`text-caption ${item.emphasis ? 'text-text-on-dark-muted' : 'text-text-muted'}`}>
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      );

    case 'figure':
      return (
        <figure className="flex flex-col gap-[10px]">
          <PhotoPanel
            image={block.image}
            sizes="(min-width: 1024px) 720px, 100vw"
            badge={block.badge}
            overlay={block.overlay}
            variant="figure"
            className="aspect-video w-full"
          />
        </figure>
      );

    case 'quote':
      return (
        <figure className="flex flex-col gap-3 border-l-[3px] border-brand-blue py-2 pl-5 sm:pl-7">
          <blockquote className="text-[20px] leading-h4 font-medium text-text sm:text-h3 sm:leading-[34px]">
            <p>{block.text}</p>
          </blockquote>
          <figcaption className="text-caption text-text-muted sm:text-body-s sm:leading-5">{block.cite}</figcaption>
        </figure>
      );

    case 'comparison': {
      const [, ...techColumns] = block.columns;
      return (
        <>
          {/* Desktop and tablet: a real table. */}
          <div className="hidden overflow-hidden rounded-md border border-border md:block">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">{block.caption}</caption>
              <thead className="bg-surface-sunken">
                <tr className="border-b border-border">
                  {block.columns.map((column, c) => (
                    <th
                      key={c}
                      scope="col"
                      className={`px-4 py-3 align-bottom text-micro font-bold tracking-[0.13em] uppercase ${
                        c === block.emphasis ? 'text-brand-blue' : 'text-text-muted'
                      } ${c === 0 ? 'w-[150px]' : c < block.columns.length - 1 ? 'w-[190px]' : ''}`}
                    >
                      {column || <span className="sr-only">Attribute</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row) => (
                  <tr key={row.label} className="border-b border-border last:border-b-0">
                    <th scope="row" className="px-4 py-[14px] align-top text-body-s font-semibold text-text">
                      {row.label}
                    </th>
                    {row.cells.map((cell, c) => (
                      <td
                        key={c}
                        className={`px-4 py-[14px] align-top text-body-s ${
                          c + 1 === block.emphasis ? 'text-text' : 'text-text-muted'
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phones: the same data as one card per technology, no sideways scroll. */}
          <ul className="flex flex-col gap-3 md:hidden">
            {techColumns.map((column, c) => {
              const emphasised = c + 1 === block.emphasis;
              return (
                <li
                  key={column}
                  className={`rounded-lg border p-4 ${emphasised ? 'border-brand-navy bg-brand-navy' : 'border-border'}`}
                >
                  <p
                    className={`pb-2 text-body-s leading-caption font-semibold tracking-[0.06em] uppercase ${
                      emphasised ? 'text-text-on-dark' : 'text-text'
                    }`}
                  >
                    {column}
                  </p>
                  <dl>
                    {block.rows.map((row) => (
                      <div
                        key={row.label}
                        className={`flex justify-between gap-3 border-t py-2 last:pb-0 ${
                          emphasised ? 'border-white/15' : 'border-border'
                        }`}
                      >
                        <dt
                          className={`w-24 shrink-0 text-caption leading-5 ${
                            emphasised ? 'text-text-on-dark-muted' : 'text-text-muted'
                          }`}
                        >
                          {row.label}
                        </dt>
                        <dd
                          className={`text-right text-body-s leading-5 ${emphasised ? 'text-text-on-dark' : 'text-text'}`}
                        >
                          {row.cells[c]}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </li>
              );
            })}
          </ul>
        </>
      );
    }

    case 'definitions':
      return (
        <dl className="flex flex-col border-t border-border">
          {block.items.map((item) => (
            <div
              key={item.term}
              className="flex flex-col gap-1 border-b border-border py-[14px] sm:flex-row sm:gap-5"
            >
              <dt className="text-body-s leading-6 font-bold text-text sm:w-[120px] sm:shrink-0">
                {item.href ? (
                  <Link href={item.href} className="text-brand-blue hover:underline">
                    {item.term}
                  </Link>
                ) : (
                  item.term
                )}
              </dt>
              <dd className="text-[15px] leading-6 text-text">{item.text}</dd>
            </div>
          ))}
        </dl>
      );

    case 'bullets':
      return (
        <ul className="flex list-disc flex-col gap-2 pl-6 text-body text-text marker:text-brand-blue">
          {block.items.map((item) => (
            <li key={item} className="pl-1">
              {item}
            </li>
          ))}
        </ul>
      );
    case 'numbered':
      return (
        <ol className="flex flex-col gap-[10px]">
          {block.items.map((item, i) => (
            <li
              key={item}
              className="flex items-start gap-[14px] rounded-md bg-surface-sunken px-[18px] py-[14px]"
            >
              <span aria-hidden className="w-7 shrink-0 text-micro leading-6 font-bold tracking-[0.1em] text-brand-blue">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[15px] leading-6 text-text">{item}</span>
            </li>
          ))}
        </ol>
      );

    case 'links':
      return (
        <ul className="flex flex-wrap gap-x-6 gap-y-1 pt-1">
          {block.items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="inline-flex min-h-11 items-center text-micro font-bold tracking-[0.13em] text-brand-blue uppercase hover:underline"
              >
                {item.label} <span aria-hidden>&nbsp;→</span>
              </Link>
            </li>
          ))}
        </ul>
      );
  }
}
