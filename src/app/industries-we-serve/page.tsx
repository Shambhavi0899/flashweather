import { Breadcrumbs } from '@/components/breadcrumbs';
import { ButtonLink } from '@/components/button';
import { HeroSection, HeroWords } from '@/components/hero/hero';
import { IndustryCycle } from '@/components/industries/industry-cycle';
import { IndustrySectors } from '@/components/industries/industry-sectors';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { industries, industriesForIndex, industryPath } from '@/content/industries';
import { industryCycle } from '@/content/industries-cycle';
import { DEMO_HREF } from '@/content/navigation';
import { JsonLd, itemListSchema, webPageSchema } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';

const PATH = '/industries-we-serve/';
const TITLE = 'Lightning and hail alerts by industry';
const DESCRIPTION =
  'Flash predicts lightning up to 60 minutes and hail up to 55 minutes ahead at 1 km, for thirteen industries that work outdoors, from schools to roofing crews.';

export const metadata = buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

/** The fixed product claims, identical to every other page. */
const CLAIMS = [
  { value: '99.6%', caption: 'lightning prediction accuracy' },
  { value: '55 min', caption: 'hail lead time, up to' },
  { value: '1×1 km', caption: 'forecast cell, no sensors to install' },
  { value: '2 min', caption: 'lightning model refresh' },
];

/**
 * The hub of the programmatic surface: every vertical, linked, in one grid.
 * Every industry page links back here through its breadcrumb, and here links
 * to all thirteen, so none of them is an orphan.
 */
export default function IndustriesPage() {
  const ordered = industriesForIndex();

  return (
    <>
      <SiteHeader tone="dark" />
      <main id="main">
        <JsonLd schema={webPageSchema({ type: 'CollectionPage', name: TITLE, description: DESCRIPTION, path: PATH })} />
        <JsonLd schema={itemListSchema(ordered.map((i) => ({ name: i.name, path: industryPath(i.slug) })))} />

        <HeroSection theme="dark" className="relative overflow-hidden bg-brand-navy">
          <div aria-hidden className="industries-hub-glow absolute inset-0" />
          <div className="hero-copy container-page relative flex flex-col gap-6 pt-8 pb-16 md:pt-10 lg:pb-24">
            <Breadcrumbs
              trail={[
                { name: 'Home', path: '/' },
                { name: 'Industries', path: PATH },
              ]}
              tone="dark"
              className="hero-crumbs"
            />
            <div className="flex flex-col gap-10 pt-6 lg:flex-row lg:items-center lg:gap-12 lg:pt-10 xl:gap-16">
              <div className="flex min-w-0 grow flex-col gap-6">
                <p className="hero-eyebrow text-micro font-semibold tracking-[0.16em] text-viz-gold">
                  INDUSTRIES WE SERVE · {industries.length} VERTICALS
                </p>
                <h1 className="max-w-[980px] text-[36px] leading-[42px] font-extrabold tracking-[-0.04em] text-neutral-0 md:text-display-l md:leading-[62px] md:tracking-[-0.05em]">
                  <HeroWords text="Thirteen industries, one hour of warning" gold="one hour of warning" />
                </h1>
                <p className="hero-lede max-w-[680px] text-[17px] leading-h4 text-pretty text-[#C9D1E3] md:text-[19px] md:leading-body-l">
                  Every operation below works outdoors and answers to the same sky. What differs is what the storm
                  costs them, who has to make the call, and which tool the answer has to land in.
                </p>
                <div className="hero-ctas flex flex-col gap-3 pt-1.5 sm:flex-row sm:items-center sm:gap-[14px]">
                  <ButtonLink href={DEMO_HREF} variant="gold">
                    Book a demo
                  </ButtonLink>
                  <ButtonLink href="/products/" variant="outline-dark">
                    See the platform
                  </ButtonLink>
                </div>
              </div>
              <IndustryCycle items={industryCycle()} className="hero-visual hero-visual-side lg:shrink-0" />
            </div>
            <dl className="hero-support mt-10 grid grid-cols-2 gap-y-8 border-t border-white/12 pt-8 lg:grid-cols-4">
              {CLAIMS.map((claim, i) => (
                <div
                  key={claim.value}
                  className={`flex flex-col-reverse gap-1.5 pr-6 ${i % 2 === 1 ? 'border-l border-white/12 pl-6' : ''} ${
                    i === 2 ? 'lg:border-l lg:border-white/12 lg:pl-6' : ''
                  }`}
                >
                  <dt className="text-body-s text-text-on-dark-muted">{claim.caption}</dt>
                  <dd className="text-[36px] leading-[42px] font-bold tracking-display text-neutral-0 md:text-[44px] md:leading-[50px]">
                    {claim.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </HeroSection>

        <IndustrySectors />
      </main>
      <SiteFooter />
    </>
  );
}
