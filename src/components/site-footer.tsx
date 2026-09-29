import Link from 'next/link';

import { DEMO_HREF, footerNav, legalNav } from '@/content/navigation';
import { site } from '@/lib/seo/site';

import { ButtonLink } from './button';
import { Magnetic } from './finale/magnetic';
import { SiteMap } from './finale/site-map';
import { Logo } from './logo';
import { Motion } from './motion';

const socialLinks = [
  { label: 'LinkedIn', href: site.social.linkedin },
  { label: 'YouTube', href: site.social.youtube },
  { label: 'X', href: site.social.x },
  { label: 'Instagram', href: site.social.instagram },
  { label: 'Facebook', href: site.social.facebook },
  { label: 'TikTok', href: site.social.tiktok },
];

/**
 * How every page ends (C04 + C05): the closing band, then the footer, as
 * one piece. Each page renders it after its <main>.
 *
 * The band's copy is the home page's unless a page gives its own `eyebrow`,
 * `heading` or `body` (Pricing, an industry asking about its own sites).
 * Everything else is the same on every page: the two buttons, the map, the
 * layout, the footer and its links, and the motion (styles/finale.css):
 *   - hard edges: the band meets the section above it and the footer below
 *     without a blend
 *   - the copy rises, the buttons fade up, the map's pins pop in one by
 *     one, then a storm drifts across them, looping while it is in view
 *   - "Book a demo" leans towards the mouse
 *   - the logo column and the four link columns fade up one after the other
 * The markup is the final frame: with reduced motion or no JavaScript it is
 * still.
 *
 * `cta={false}` leaves the band out, for the few pages where a sales ask
 * does not belong (a post in memory of someone). The footer is unchanged.
 *
 * The footer's links are the site's second full internal-link graph: every
 * page reaches every hub. The Flash Agent launcher steps aside while the
 * link columns or the legal row would sit under it (`data-launcher-clear`).
 */
export function SiteFooter({
  eyebrow = 'Live demo · No sensors to install',
  heading = 'See your own sites on the map before the next storm.',
  body = "We'll load your locations, replay last season's strikes against Flash's predictions, and show you the alert log your safety officer would have received.",
  cta = true,
}: {
  eyebrow?: string;
  heading?: string;
  body?: string;
  cta?: boolean;
}) {
  return (
    // data-header-tone: the fixed header takes this tone while it is over
    // the ending (components/site-header.tsx).
    <div data-header-tone="dark">
      {cta && (
        <section aria-labelledby="cta-band-heading" className="bg-brand-blue pt-14 lg:pt-[88px]">
          <Motion replay={false} threshold={0.3} className="motion cta-finale-in">
            <div className="container-page relative z-[1] flex flex-col gap-8 pt-6 pb-2 lg:pt-8 lg:pb-[72px]">
              <div className="flex max-w-[720px] flex-col gap-[14px] lg:max-w-[520px] xl:max-w-[640px]">
                <p className="fin-rise text-[11px] leading-4 font-semibold tracking-[0.16em] text-viz-gold uppercase md:text-micro md:tracking-label-wide">
                  {eyebrow}
                </p>
                <h2
                  id="cta-band-heading"
                  className="fin-rise text-[30px] leading-[34px] font-extrabold tracking-[-0.03em] text-text-on-dark md:text-[36px] md:leading-[44px]"
                >
                  {heading}
                </h2>
                <p className="fin-rise text-[15px] leading-[22px] text-pretty text-[#C7D2F0] md:text-[17px] md:leading-h4">
                  {body}
                </p>
              </div>
              <div className="fin-fade flex flex-col gap-3 sm:flex-row">
                <Magnetic className="cta-magnet flex">
                  <ButtonLink href={DEMO_HREF} variant="gold" className="grow">
                    Book a demo
                  </ButtonLink>
                </Magnetic>
                <ButtonLink href="/pricing/" variant="outline-dark">
                  See pricing
                </ButtonLink>
              </div>
            </div>
            <div className="cta-map">
              <SiteMap className="size-full" />
            </div>
          </Motion>
        </section>
      )}

      <footer className="site-footer bg-brand-navy">
        <Motion
          replay={false}
          threshold={0.15}
          className="motion footer-reveal container-page flex flex-col gap-12 pt-16 pb-14 lg:flex-row"
        >
          <div className="footer-col flex flex-col gap-5 lg:w-[300px] lg:shrink xl:shrink-0">
            <Logo variant="dark" size="footer" />
            <p className="text-body-s leading-5 text-text-on-dark-muted md:leading-body-s">
              AI that predicts lightning and hail before they strike. Founded {site.foundingDate} by a 20-year
              National Weather Service meteorologist.
            </p>
            <ul className="flex flex-col gap-1 text-body-s leading-5 md:leading-caption">
              <li>
                <a href={`mailto:${site.salesEmail}`} className="text-text-on-dark hover:underline">
                  {site.salesEmail}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="text-text-on-dark-muted hover:text-text-on-dark">
                  {site.email}
                </a>
              </li>
            </ul>
            <a
              href={site.appDownloadUrl}
              rel="noopener"
              className="inline-flex h-11 w-fit items-center gap-2 rounded-xs border border-white/25 px-4 text-caption font-bold text-text-on-dark hover:bg-white/5"
            >
              Download the free app <span aria-hidden>↗</span>
            </a>
            <ul aria-label="Flash Weather AI on social media" className="flex flex-wrap gap-x-4 gap-y-2 text-caption">
              {socialLinks.map((s) => (
                <li key={s.href}>
                  <a href={s.href} rel="noopener me" className="text-text-on-dark-muted hover:text-text-on-dark">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav
            aria-label="Footer"
            data-launcher-clear
            className="grid grow grid-cols-2 gap-x-12 gap-y-10 md:grid-cols-4"
          >
            {footerNav.map((group) => (
              <div key={group.label} className="footer-col flex flex-col gap-3">
                {/* A label, not a heading: the page's outline is its own H2s. */}
                <p className="text-[11px] leading-4 font-semibold tracking-[0.16em] text-viz-gold uppercase md:leading-[14px]">
                  {group.label}
                </p>
                <ul className="flex flex-col gap-3">
                  {group.links.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-body-s leading-caption text-text-on-dark-muted hover:text-text-on-dark"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </Motion>

        <div className="border-t border-border-on-dark">
          <div className="container-page flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-micro text-neutral-500 md:text-caption md:leading-micro">
              © {new Date().getFullYear()} {site.name}. All rights reserved.
            </p>
            <ul data-launcher-clear className="flex flex-wrap gap-x-7 gap-y-2 text-micro md:text-caption md:leading-micro">
              {legalNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-neutral-500 hover:text-text-on-dark-muted">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href={site.appUrl} className="text-neutral-500 hover:text-text-on-dark-muted">
                  Customer log in
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
