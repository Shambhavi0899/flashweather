import Link from 'next/link';

import type { Industry } from '@/content/industries';
import { industryPath, siblingIndustries } from '@/content/industries';
import { linkLabel } from '@/content/link-labels';

import { KeepReading } from './keep-reading';
import { NextStepCards } from './next-steps';
import { Section, SectionHeading } from './primitives';

const RELATED_ID = 'related-heading';

/** The designed "next for this buyer" links: product, comparison, pricing, a customer story. */
export function IndustryRelated({ industry }: { industry: Industry }) {
  const related = industry.related;
  if (!related) return null;
  const layout = related.layout ?? 'row';

  if (layout === 'cards') return <KeepReading id={RELATED_ID} related={related} />;

  if (layout === 'list') {
    return (
      <Section id={RELATED_ID} tone="sunken">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
          <div className="lg:w-[400px] lg:shrink xl:shrink-0">
            <SectionHeading id={RELATED_ID} heading={related.heading} intro={related.intro} introSize="small" />
          </div>
          <ul className="flex grow basis-0 flex-col">
            {related.links.map((link) => (
              <li key={link.href} className="border-t border-border-strong last:border-b">
                <Link
                  href={link.href}
                  className="group flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                >
                  <span className="flex flex-col gap-0.5">
                    <span className="text-body-l leading-6 font-semibold text-text group-hover:text-brand-blue">
                      {link.title}
                    </span>
                    <span className="text-body-s leading-5 text-text-muted">{link.text}</span>
                  </span>
                  <span className="shrink-0 text-micro font-semibold text-text-muted group-hover:text-brand-blue">
                    {linkLabel(link.href)} <span aria-hidden>→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    );
  }

  if (layout === 'intent') {
    return (
      <Section id={RELATED_ID} tone="sunken">
        <SectionHeading id={RELATED_ID} heading={related.heading} intro={related.intro} introSize="small" />
        <NextStepCards related={related} />
      </Section>
    );
  }

  const half = Math.ceil(related.links.length / 2);
  const columns = layout === 'columns' ? [related.links.slice(0, half), related.links.slice(half)] : null;

  return (
    <Section id={RELATED_ID} tone="sunken">
      <SectionHeading id={RELATED_ID} heading={related.heading} intro={related.intro} introSize="small" />
      {columns ? (
        <div className="mt-8 grid gap-x-12 md:grid-cols-2">
          {columns.map((col, i) => (
            <ul key={i} className="flex flex-col">
              {col.map((link) => (
                <li key={link.href} className="border-t border-border-strong last:border-b">
                  <RelatedLink link={link} className="py-[18px]" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      ) : (
        <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:flex">
          {related.links.map((link) => (
            <li key={link.href} className="border-t-2 border-brand-navy xl:grow xl:basis-0">
              <RelatedLink link={link} className="pt-4" />
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

function RelatedLink({
  link,
  className,
}: {
  link: { title: string; text: string; href: string };
  className: string;
}) {
  return (
    <Link href={link.href} className={`group flex flex-col gap-1.5 ${className}`}>
      <span className="text-body-l leading-6 font-semibold text-text group-hover:text-brand-blue">{link.title}</span>
      <span className="text-body-s leading-5 text-text-muted">{link.text}</span>
      <span className="text-micro font-semibold text-text-muted group-hover:text-brand-blue">
        {linkLabel(link.href)} <span aria-hidden>→</span>
      </span>
    </Link>
  );
}

/**
 * Every other vertical, at the foot of every industry page. Not a heading:
 * the page's outline is its own H2s, and this is navigation.
 */
export function IndustrySiblings({ industry }: { industry: Industry }) {
  return (
    <nav aria-label="Other industries" className="border-t border-border bg-neutral-0">
      <div className="container-page flex flex-col gap-4 py-10 md:flex-row md:items-baseline md:gap-10">
        <p className="shrink-0 text-[11px] leading-[14px] font-semibold tracking-[0.16em] text-text-muted">
          <Link href="/industries-we-serve/" className="hover:text-brand-blue hover:underline">
            OTHER INDUSTRIES WE SERVE
          </Link>
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {siblingIndustries(industry.slug).map((sibling) => (
            <li key={sibling.slug}>
              <Link
                href={industryPath(sibling.slug)}
                className="inline-flex min-h-11 items-center text-body-s font-semibold text-brand-blue hover:underline md:min-h-0"
              >
                {sibling.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

/** The three risks, for verticals that have no designed body yet. */
export function IndustryRisks({ industry }: { industry: Industry }) {
  const id = 'risks-heading';
  return (
    <Section id={id}>
      <SectionHeading
        id={id}
        heading={`What the storm costs in ${industry.name.toLowerCase()}`}
      />
      <ol className="mt-10 grid gap-6 md:grid-cols-3">
        {industry.risks.map((risk, i) => (
          <li key={risk} className="flex flex-col gap-3 border-t-2 border-brand-navy pt-5">
            <span aria-hidden className="text-micro font-bold tracking-[0.13em] text-gold-on-light">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="text-h4 font-semibold text-text">{risk}</h3>
          </li>
        ))}
      </ol>
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: '/products/lightning-prediction/', title: 'Lightning Prediction', text: '99.6% accuracy, up to 60 minutes ahead' },
          { href: '/products/hail-prediction/', title: 'Hail Prediction', text: 'Up to 55 minutes before it reaches a site' },
          { href: '/why-flash/prediction-vs-sensors-vs-detection/', title: 'Prediction vs detection', text: 'Why a forecast beats a strike sensor' },
          { href: '/pricing/', title: 'Pricing', text: 'Per site, no sensors to install' },
        ].map((link) => (
          <li key={link.href} className="rounded-md border border-border bg-surface-sunken">
            <Link href={link.href} className="group flex h-full flex-col gap-1 p-5">
              <span className="text-body font-semibold text-text group-hover:text-brand-blue">{link.title} →</span>
              <span className="text-body-s text-text-muted">{link.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
