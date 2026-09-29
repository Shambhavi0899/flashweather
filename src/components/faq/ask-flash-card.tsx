import Link from 'next/link';

/**
 * The hero's "Ask Flash" card: one question and the agent's answer, with the
 * FAQ entry it cites. A static illustration of Flash Agent, not a widget --
 * the cited source is a real link to that answer further down the page.
 */
export function AskFlashCard() {
  return (
    <aside
      aria-label="Example Flash Agent answer"
      className="relative flex w-full max-w-[400px] shrink-0 flex-col gap-[18px] rounded-[20px] border border-viz-gold/45 bg-[#040818CC] p-6 shadow-[0_1px_2px_#0B13220D,0_12px_32px_#0B13221A]"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-[11px] leading-[16px] font-semibold tracking-label text-viz-gold uppercase">Ask Flash</p>
        <p className="text-micro text-text-on-dark-muted">every answer cites its page</p>
      </div>
      <div className="flex justify-end">
        <p className="max-w-[300px] rounded-[14px] rounded-br-xs border border-white/10 bg-white/8 px-[14px] py-[10px] text-body-s leading-5 text-text-on-dark">
          Our policy sets its own radius and all-clear wait. Can Flash use that?
        </p>
      </div>
      <div className="flex items-start gap-[10px]">
        <span className="bg-gold-metallic flex size-7 shrink-0 items-center justify-center rounded-full">
          <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden>
            <path d="M7.2 0.5L1 8.2h4.4L4.6 13.5 11 5.8H6.6L7.2 0.5z" fill="#070D26" />
          </svg>
        </span>
        <div className="flex flex-col gap-[10px]">
          <p className="text-body-s leading-[21px] text-[#C9D1E3]">
            Yes. Each site carries its own thresholds — radius, lead time, WBGT limit and who is told. Want me to
            load yours from the alert policy PDF?
          </p>
          <div className="flex flex-wrap gap-[6px]">
            <Link
              href="#alert-policy"
              className="rounded-sm border border-[#128A5E80] bg-[#128A5E2E] px-[10px] py-1 text-micro font-medium text-[#6FD1A5] hover:underline"
            >
              Source · FAQ 05
            </Link>
            <span className="rounded-sm border border-white/14 px-[10px] py-1 text-micro text-text-on-dark-muted">
              Confirms before any change
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
