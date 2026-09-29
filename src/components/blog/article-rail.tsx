import Link from 'next/link';

import { relatedProducts } from '@/content/blog';

/** Rail section labels: the phone design's 11/16 label, the desktop's 11/14 bold one from md. */
const railLabel =
  'text-[11px] leading-4 font-semibold tracking-label text-text-muted uppercase md:leading-[14px] md:font-bold md:tracking-[0.13em]';

/** Card copy: 18px titles and 14px links on phones, 16px titles and 13px links from md. */
const cardTitle = 'text-body-l leading-6 font-semibold tracking-heading md:text-body md:tracking-normal';
const cardBody = 'text-body-s leading-5 md:leading-body-s';
const cardLink =
  'text-body-s leading-5 font-medium after:absolute after:inset-0 after:rounded-[20px] hover:underline md:text-caption md:leading-caption md:font-semibold';

/** The article's right-hand column: related products, read next, sources (each list only when it has entries). */
export function ArticleRail({
  readNext,
  sources,
  showProducts = true,
}: {
  readNext: { title: string; href: string }[];
  sources: string[];
  /** Off for posts about people hurt or killed by lightning. */
  showProducts?: boolean;
}) {
  return (
    <aside aria-label="Related" className="flex flex-col gap-7">
      {showProducts && (
      <section aria-labelledby="rail-products" className="flex flex-col gap-3">
        <p id="rail-products" className={railLabel}>
          Related products
        </p>
        {relatedProducts.map((product) => (
          <div
            key={product.href}
            className="relative flex flex-col gap-2 rounded-[20px] border border-border p-5 shadow-[0_1px_2px_#0B13220D,0_12px_32px_#0B13220F]"
          >
            <p className={`${cardTitle} text-text`}>{product.name}</p>
            <p className={`${cardBody} text-text-muted`}>{product.body}</p>
            <Link href={product.href} className={`${cardLink} pt-1 text-brand-blue`}>
              See the product <span aria-hidden>→</span>
              <span className="sr-only">: {product.name}</span>
            </Link>
          </div>
        ))}
        <div className="relative flex flex-col gap-[10px] rounded-[20px] border border-border-on-dark bg-brand-navy-deep p-5">
          <div className="flex items-center gap-2">
            <span aria-hidden className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-gold-metallic">
              <svg width="10" height="12" viewBox="0 0 10 12">
                <path d="M5.8 0L0 7h3.6L2.6 12 10 4.6H6.2L5.8 0z" fill="#070D26" />
              </svg>
            </span>
            <p className="text-[11px] leading-[14px] font-bold tracking-[0.13em] text-viz-gold uppercase">
              Flash Agent · New
            </p>
          </div>
          <p className={`${cardTitle} text-white`}>Ask. Answer. Act — in your tools.</p>
          <p className={`${cardBody} text-[#C9D1E3]`}>
            &ldquo;Which of my sites has a crane lift inside a lightning window this week?&rdquo; — the answer, or the
            reschedule in Procore, with a person confirming first and every action logged.
          </p>
          <Link href="/products/flash-agent/" className={`${cardLink} pt-[2px] text-white`}>
            See the product <span aria-hidden>→</span>
            <span className="sr-only">: Flash Agent</span>
          </Link>
        </div>
      </section>
      )}

      {readNext.length > 0 && (
        <section aria-labelledby="rail-read-next" className="flex flex-col">
          <p id="rail-read-next" className={`${railLabel} pb-[10px]`}>
            Read next
          </p>
          <ul className="border-b border-border">
            {readNext.map((item) => (
              <li key={item.href} className="border-t border-border">
                <Link href={item.href} className="block py-3 text-body-s leading-5 font-medium text-text hover:text-brand-blue">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {sources.length > 0 && (
        <section aria-labelledby="rail-sources" className="flex flex-col gap-2">
          <p id="rail-sources" className={`${railLabel} pb-[2px]`}>
            Sources
          </p>
          <ul className="flex flex-col gap-2">
            {sources.map((source) => (
              <li key={source} className="text-caption leading-5 text-text-muted">
                {source}
              </li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  );
}
