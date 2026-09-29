import Image from 'next/image';
import Link from 'next/link';

import { Breadcrumbs } from '@/components/breadcrumbs';
import { ButtonLink } from '@/components/button';
import { HeroBackground, HeroSection, HeroWords } from '@/components/hero/hero';
import { Motion } from '@/components/motion';
import { getIndustry, industryPath } from '@/content/industries';
import { DEMO_HREF } from '@/content/navigation';
import { productPageHeroBackground, type ProductPage } from '@/content/product-pages';
import { products } from '@/content/products';

import { SectionHeader, SectionLabel } from '../section-header';

import { CommandCenterLayers } from './command-center-layers';
import { CommandCenterTour } from './command-center-tour';
import { CommandCenterWindow } from './command-center-window';
import { MobileAppLockScreen } from './mobile-app-lock-screen';
import { MobileAppPairs } from './mobile-app-pairs';
import { MobileAppPhones } from './mobile-app-phones';
import { MobileAppTiers } from './mobile-app-tiers';

/**
 * The sections of a secondary product page, in page order. Built in the
 * visual language of the lightning and hail pages: a navy hero over a graded
 * storm photo, a light overview, a ruled feature grid, then the cross-links.
 */

type Crumb = { name: string; path: string };

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export function ProductPageHero({ page, trail }: { page: ProductPage; trail: Crumb[] }) {
  return (
    <HeroSection theme="dark" labelledBy="product-hero-heading" className="relative isolate overflow-clip bg-brand-navy">
      <HeroBackground storm layer="-z-20">
        <Image
          src={productPageHeroBackground}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-40"
        />
      </HeroBackground>
      <div aria-hidden className="products-hero-grade absolute inset-0 -z-10" />

      <div className="container-page flex flex-col gap-12 pt-10 pb-20 lg:flex-row lg:items-center lg:gap-14 lg:pt-14 lg:pb-[112px]">
        <div className="hero-copy flex flex-col gap-6 lg:w-[500px] lg:shrink lg:gap-7 xl:w-[560px] xl:shrink-0">
          <Breadcrumbs trail={trail} tone="dark" className="hero-crumbs" />
          <p className="hero-eyebrow text-micro font-semibold tracking-label text-viz-gold uppercase">{page.eyebrow}</p>
          <h1
            id="product-hero-heading"
            className="text-[44px] leading-[48px] font-extrabold tracking-[-0.05em] text-text-on-dark md:text-[60px] md:leading-[64px] xl:text-display-xl xl:leading-display-xl"
          >
            <HeroWords text={page.name} />
          </h1>
          <p className="hero-lede max-w-[560px] text-[17px] leading-[28px] text-pretty text-[#C9D1E3] md:text-[19px] md:leading-body-l">
            {page.lead}
          </p>
          <div className="hero-ctas flex flex-col gap-[14px] pt-1 sm:flex-row sm:items-center">
            <ButtonLink href={DEMO_HREF} variant="gold">
              Book a demo
            </ButtonLink>
            <ButtonLink href={page.secondaryCta.href} variant="outline-dark">
              {page.secondaryCta.label}
            </ButtonLink>
          </div>
        </div>

        <div className="hero-visual hero-visual-side flex min-w-0 grow basis-0 justify-center lg:justify-end">
          {/* The Mobile App draws its lineup as four live phones. */}
          {page.slug === 'mobile-app' ? (
            <MobileAppPhones />
          ) : (
            <div className="relative aspect-video w-full max-w-[680px] overflow-clip rounded-[20px] border border-white/10 shadow-[0_30px_80px_#00000073]">
              <Image
                src={page.heroImage.src}
                alt={page.heroImage.alt}
                fill
                preload
                sizes="(min-width: 1440px) 680px, (min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </HeroSection>
  );
}

/* ------------------------------------------------------------------ */
/* Product overview                                                    */
/* ------------------------------------------------------------------ */

export function ProductOverview({ page }: { page: ProductPage }) {
  const { overview } = page;
  // An overview written as a tour of its screenshot (the Command Center) gets the tour layout.
  if (overview.tour) return <CommandCenterTour overview={{ ...overview, tour: overview.tour }} />;
  // An overview that lists free and Premium features (the Mobile App) gets the tier toggle.
  if (overview.tiers) return <MobileAppTiers overview={{ ...overview, tiers: overview.tiers }} />;
  return (
    <section aria-labelledby="product-overview-heading" className="bg-surface">
      <div className="container-page flex flex-col gap-12 py-20 lg:flex-row lg:items-start lg:gap-16 lg:py-[120px]">
        <div className="flex flex-col gap-6 lg:w-[560px] lg:shrink xl:w-[620px] xl:shrink-0">
          <SectionLabel tone="muted-light">Product overview</SectionLabel>
          <h2
            id="product-overview-heading"
            className="text-[32px] leading-[38px] font-extrabold tracking-[-0.03em] text-text md:text-[36px] md:leading-[42px] lg:text-[40px] lg:leading-[46px]"
          >
            {overview.heading}
          </h2>
          <div className="flex flex-col gap-5">
            {overview.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-body leading-body text-pretty text-text-muted">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <figure className="flex min-w-0 grow basis-0 flex-col gap-[10px] lg:pt-[76px]">
          <div className="relative aspect-video w-full overflow-clip rounded-lg border border-border">
            <Image
              src={overview.image.src}
              alt={overview.image.alt}
              fill
              sizes="(min-width: 1440px) 620px, (min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="text-micro leading-caption text-text-subtle">{overview.image.caption}</figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Features                                                            */
/* ------------------------------------------------------------------ */

export function ProductFeatures({ page }: { page: ProductPage }) {
  const { features } = page;
  // The Mobile App delivers its four points as notifications on a lock screen.
  if (page.slug === 'mobile-app') {
    return (
      <MobileAppLockScreen label={`${page.name} · at a glance`} heading={features.heading} items={features.items} />
    );
  }
  return (
    <section aria-labelledby="product-features-heading" className="border-t border-border bg-surface-sunken">
      <div className="container-page flex flex-col gap-10 py-20 lg:gap-14 lg:py-[120px]">
        <SectionHeader
          id="product-features-heading"
          size="md"
          labelTone="muted-light"
          label={`${page.name} · at a glance`}
          heading={features.heading}
        />
        {/* The Command Center draws its four points as one dashboard window. */}
        {page.slug === 'weather-command-center' ? (
          <CommandCenterWindow items={features.items} />
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.items.map((item, i) => (
              <li
                key={item.title}
                className="flex flex-col gap-3 rounded-lg border border-border bg-neutral-0 px-6 pt-6 pb-7"
              >
                <span aria-hidden className="text-micro font-extrabold tracking-[0.13em] text-gold-on-light">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-h4 leading-h4 font-extrabold tracking-display text-text">{item.title}</h3>
                <p className="text-[15px] leading-6 text-pretty text-text-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Related products and industries                                     */
/* ------------------------------------------------------------------ */

export function ProductRelated({ page }: { page: ProductPage }) {
  const related = page.related.flatMap((id) => {
    const product = products.find((p) => p.id === id);
    return product?.href ? [{ ...product, href: product.href }] : [];
  });
  const industries = page.industries.map((slug) => getIndustry(slug)).filter((industry) => industry !== undefined);
  // The Command Center is the screen the others pair onto, so its page draws
  // them as layers on it; the chips then fade in after the cards.
  const layered = page.slug === 'weather-command-center';
  // The Mobile App's cards each show what that product sends to the phone.
  const onPhone = page.slug === 'mobile-app';

  const chipRow = 'flex flex-col gap-4 border-t border-white/12 pt-7 md:flex-row md:items-center md:gap-6';
  const chips = (
    <>
      <p className="ccl-chips-label shrink-0 text-micro font-semibold tracking-label text-[#8F9AB8] uppercase">
        Industries that use it
      </p>
      <ul className="flex flex-wrap gap-2">
        {industries.map((industry) => (
          <li key={industry.slug} className="ccl-chip">
            <Link
              href={industryPath(industry.slug)}
              className="flex min-h-11 items-center rounded-full border border-white/18 px-4 text-caption font-semibold text-[#DCE2F0] transition hover:bg-white/8"
            >
              {industry.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );

  return (
    <section aria-labelledby="product-related-heading" className="bg-brand-navy">
      <div className="container-page flex flex-col gap-10 py-20 lg:gap-14 lg:py-[120px]">
        <SectionHeader
          id="product-related-heading"
          size="md"
          tone="dark"
          label="Explore products · one model run"
          heading={`Products that pair with ${page.name}`}
          aside={
            <Link
              href="/products/#products"
              className="inline-flex min-h-11 items-center text-body-s font-semibold text-text-on-dark hover:underline lg:justify-end"
            >
              Every Flash product <span aria-hidden>&nbsp;→</span>
            </Link>
          }
        />

        {layered ? (
          <CommandCenterLayers products={related} />
        ) : onPhone ? (
          <MobileAppPairs products={related} />
        ) : (
          <ul className={`grid grid-cols-1 gap-6 md:grid-cols-2 ${related.length > 3 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
            {related.map((product) => (
              <li key={product.id} className="flex">
                <article className="flex w-full flex-col overflow-hidden rounded-lg border border-white/10 bg-white/3">
                  <div className="relative aspect-video shrink-0">
                    <Image
                      src={product.image.src}
                      alt={product.image.alt}
                      fill
                      sizes="(min-width: 1440px) 400px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex grow flex-col gap-2.5 px-6 pt-[22px] pb-[26px]">
                    <p className="text-[11px] leading-[14px] font-bold tracking-[0.13em] text-[#8F9AB8] uppercase">
                      {product.category}
                    </p>
                    <h3 className="text-h4 leading-body font-extrabold text-text-on-dark">{product.name}</h3>
                    <p className="text-body-s leading-[21px] text-text-on-dark-muted">{product.summary}</p>
                    <Link
                      href={product.href}
                      className="mt-auto inline-flex min-h-11 items-center pt-1 text-caption font-bold text-viz-gold hover:underline"
                    >
                      {product.name} <span aria-hidden>&nbsp;→</span>
                    </Link>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}

        {industries.length > 0 &&
          (layered || onPhone ? (
            <Motion replay={false} className={`motion ccl-chips ${chipRow}`}>
              {chips}
            </Motion>
          ) : (
            <div className={chipRow}>{chips}</div>
          ))}
      </div>
    </section>
  );
}
