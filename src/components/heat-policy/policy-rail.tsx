import Link from 'next/link';

import { ButtonLink } from '@/components/button';
import { DEMO_HREF } from '@/content/navigation';
import type { HeatPolicy } from '@/content/heat-policies';
import { site } from '@/lib/seo/site';

/** The policy page's side column: the schools pitch, then the verified note. */
export function PolicyRail({ rail }: { rail: HeatPolicy['rail'] }) {
  return (
    <aside aria-label="Flash for schools" className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 rounded-[20px] border border-border-on-dark bg-brand-navy-deep p-6">
        <p className="text-[11px] leading-[14px] font-bold tracking-[0.13em] text-text-on-dark-muted uppercase">
          {rail.eyebrow}
        </p>
        <p className="text-h4 leading-h4 font-extrabold tracking-[-0.03em] text-white">
          <Link href={rail.href} className="hover:underline">
            {rail.heading}
          </Link>
        </p>
        <ul className="flex flex-col gap-[10px]">
          {rail.points.map((point) => (
            <li key={point} className="flex items-start gap-[10px]">
              <span aria-hidden className="mt-[2px] flex size-[18px] shrink-0 items-center justify-center rounded-full bg-border-on-dark">
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path
                    d="M5.5 9.5l2.3 2.3L12.5 7"
                    fill="none"
                    stroke="#D6BD69"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-body-s text-white">{point}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-2 rounded-[12px] border border-white/10 bg-white/5 p-[14px]">
          <div className="flex items-center gap-2">
            <span aria-hidden className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-gold-metallic">
              <svg width="10" height="12" viewBox="0 0 10 12">
                <path d="M5.8 0L0 7h3.6L2.6 12 10 4.6H6.2L5.8 0z" fill="#070D26" />
              </svg>
            </span>
            <p className="text-[11px] leading-[14px] font-bold tracking-[0.13em] text-viz-gold uppercase">
              <Link href="/products/flash-agent/" className="hover:underline">
                Ask Flash
              </Link>
            </p>
          </div>
          <p className="text-body-s leading-5 font-medium text-white">{rail.agent.prompt}</p>
          <p className="text-caption leading-[19px] text-[#C9D1E3]">{rail.agent.reply}</p>
          <p className="self-start rounded-sm border border-border-on-dark bg-neutral-900 px-2 py-1 text-[11px] leading-[14px] font-medium text-[#C9D1E3]">
            {rail.agent.action}
          </p>
        </div>
        <ButtonLink href={DEMO_HREF} variant="gold" size="sm" className="rounded-full">
          Book a demo
        </ButtonLink>
        <p className="text-micro leading-[17px] text-text-on-dark-muted">{rail.note}</p>
      </div>

      <div className="flex flex-col gap-2 rounded-[20px] border border-border p-5 shadow-[0_1px_2px_#0B13220D,0_12px_32px_#0B13220F]">
        <p className="text-[11px] leading-[14px] font-bold tracking-[0.13em] text-text-muted uppercase">Verified</p>
        <p className="text-body-s text-text">{rail.verifiedNote}</p>
        <p className="text-caption text-text-muted">
          {rail.contact}{' '}
          <a href={`mailto:${site.email}`} className="text-brand-blue hover:underline">
            {site.email}
          </a>
        </p>
      </div>
    </aside>
  );
}
