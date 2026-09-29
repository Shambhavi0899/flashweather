type TocItem = { id: string; label: string };

/**
 * "In this article" / "On this page". Two renderings of one list: a sticky
 * side column on wide screens, and a collapsed <details> on narrower ones
 * (the mobile design's "collapsed by default; one tap expands").
 */
export function TocSidebar({ label, items }: { label: string; items: TocItem[] }) {
  return (
    <nav aria-label={label} className="sticky top-[88px] hidden xl:block">
      <p className="px-[14px] pb-3 text-[11px] leading-[14px] font-bold tracking-[0.13em] text-text-muted uppercase">
        {label}
      </p>
      <ol className="flex flex-col gap-[2px]">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="flex min-h-9 items-center border-l-2 border-border px-[14px] py-2 text-body-s leading-5 text-text-muted transition hover:border-brand-blue hover:bg-surface-sunken hover:text-brand-blue"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function TocDisclosure({ label, items }: { label: string; items: TocItem[] }) {
  return (
    <details className="group rounded-md border border-border bg-surface-sunken xl:hidden">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-4 py-[14px] [&::-webkit-details-marker]:hidden">
        <span className="text-[11px] leading-4 font-semibold tracking-label text-text uppercase">
          {label} · {items.length} sections
        </span>
        <svg width="14" height="8" viewBox="0 0 14 8" aria-hidden className="shrink-0 transition group-open:rotate-180">
          <path d="M1 1l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted" />
        </svg>
      </summary>
      <nav aria-label={label} className="px-4 pb-[14px]">
        <ol className="flex flex-col">
          {items.map((item, i) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className="flex min-h-11 items-center text-caption text-text-muted hover:text-brand-blue">
                {i + 1}. {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
}
