import Image from 'next/image';
import Link from 'next/link';

import { Motion } from '@/components/motion';

type Screen = {
  badge: string;
  caption: string;
  role: string;
  body: string;
  image: { src: string; alt: string };
  link: { href: string; label: string };
};

/** The one alert both screens show. Illustrative, like the imagery it sits on. */
const ALERT = { level: 'Warning', detail: 'Property 14 · 13 min' };

/**
 * The Troon case study's "One forecast, two screens, the same call.": the
 * Command Center and Mobile app cards (styles/case-study-screens.css, tsc-*).
 *
 * The list is one <Motion> block, so the alert chip pops onto both images in
 * the same frame when the cards scroll in, and again every 6s while they are
 * in view, with a thin line drawing between the two. The markup is the
 * finished state, both chips showing, which is what reduced motion and a
 * browser without JavaScript see.
 */
export function TwoScreens({ screens }: { screens: Screen[] }) {
  return (
    <Motion as="ul" className="motion tsc" replay={false}>
      {screens.map((screen) => (
        <li
          key={screen.badge}
          className="tsc-card flex flex-col overflow-hidden rounded-lg border border-white/10 bg-[#040818B8]"
        >
          <div className="relative aspect-[612/330] bg-brand-navy-deep">
            <Image
              src={screen.image.src}
              alt={screen.image.alt}
              fill
              sizes="(min-width: 1440px) 612px, (min-width: 1024px) 46vw, 100vw"
              className="object-cover"
            />
            <div aria-hidden className="case-study-screen-grade absolute inset-0" />
            <p className="absolute top-4 left-4 flex h-6 items-center rounded-[12px] bg-[#040818C7] px-[10px] text-[10px] leading-3 font-extrabold tracking-[0.13em] text-viz-gold uppercase">
              {screen.badge}
            </p>
            <p aria-hidden className="tsc-chip motion-loop">
              <span className="tsc-dot" />
              <span>
                <b>{ALERT.level}</b> · {ALERT.detail}
              </span>
            </p>
            <h3 className="absolute bottom-4 left-4 text-body leading-body-s font-extrabold tracking-heading text-white">
              {screen.caption}
            </h3>
          </div>
          <div className="flex flex-col gap-2 px-6 pt-5 pb-6">
            <p className="text-micro font-bold tracking-[0.13em] text-text-on-dark-muted uppercase">{screen.role}</p>
            <p className="text-[15px] leading-6 text-neutral-300">{screen.body}</p>
            <Link
              href={screen.link.href}
              className="tsc-link inline-flex min-h-11 items-center text-body-s font-semibold text-viz-gold hover:underline"
            >
              {screen.link.label}&nbsp;
              <span aria-hidden className="tsc-arrow">
                →
              </span>
            </Link>
          </div>
        </li>
      ))}
      <li aria-hidden role="presentation" className="tsc-line motion-loop" />
    </Motion>
  );
}
