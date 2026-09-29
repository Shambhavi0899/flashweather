import Image from 'next/image';
import Link from 'next/link';

import { Motion } from '@/components/motion';
import { SectionHeader } from '@/components/products/section-header';
import { site } from '@/lib/seo/site';

import { EndpointExplorer, Method } from './endpoint-explorer';
import { ParameterRequest } from './parameter-request';
import { CommitmentIcon } from './rate-limit-icons';

import { commitments, images, parameterLinks, webhookEvents } from './content';
import { WebhookEvents } from './webhook-log';

/**
 * The reference half of the API page: endpoints, parameters, webhook events,
 * and rate limits / SLAs. Tables are real <table>s with scoped headers, each
 * in its own horizontal scroller so a phone never scrolls the page sideways.
 */

export function Endpoints() {
  return (
    <section aria-labelledby="endpoints" className="scroll-mt-4 bg-neutral-0">
      <div className="container-page flex flex-col gap-12 py-20 lg:py-[120px]">
        <SectionHeader
          id="endpoints"
          labelEmphasis="strong"
          label="Endpoints · REST · JSON"
          heading="Which endpoints does the API expose?"
          aside="The resources cover cells, your sites, alert routing, regional outlooks and the validation dataset behind the accuracy figure. Authentication, pagination and versioning are in the developer docs."
        />
        <EndpointExplorer />
      </div>
    </section>
  );
}

export function Parameters() {
  return (
    <section aria-labelledby="parameters-heading" className="border-t border-border bg-surface-sunken">
      <div className="container-page flex flex-col gap-12 py-20 lg:py-[120px]">
        <SectionHeader
          id="parameters-heading"
          labelEmphasis="strong"
          label="Parameters · A sample of over 100"
          heading="What can you request for a cell?"
          aside="Every parameter is served per 1 km cell, per hour, from the same run. Units, ranges and the full list live in the developer docs so they never drift from the response."
        />
        {/* The chips toggle into the request bar's params list; the badge is the endpoints table's. */}
        <ParameterRequest method={<Method method="GET" />} />
        <ul className="flex flex-wrap gap-x-6 gap-y-3">
          {parameterLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-body-s leading-5 font-medium text-brand-blue hover:underline">
                {l.label} <span aria-hidden>→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Webhooks() {
  return (
    <section aria-labelledby="webhooks-heading" className="bg-neutral-0">
      <div className="container-page flex flex-col gap-12 py-20 lg:py-[120px]">
        <SectionHeader
          id="webhooks-heading"
          labelEmphasis="strong"
          label="Webhooks · Per site, per event, per URL"
          heading="Which events can a webhook fire on?"
          aside="Subscribe per site, per event, per URL. Every payload carries the cell, the model run and a signature, and every delivery is logged so your on-call engineer can replay it."
        />
        <WebhookEvents events={webhookEvents} />
      </div>
    </section>
  );
}

export function RateLimits() {
  return (
    <section aria-labelledby="limits-heading" className="border-t border-border bg-surface-sunken">
      <div className="container-page flex flex-col gap-12 py-20 lg:py-[120px]">
        <SectionHeader
          id="limits-heading"
          labelEmphasis="strong"
          label="Rate limits · SLAs · Published once"
          heading="What are the rate limits and SLAs?"
          aside="We publish limits and commitments in one place, the developer docs and your order form, so a marketing page never quotes a number that has since changed."
        />
        {/* Each column carries one small detail that plays once as it scrolls
            in (rate-limit-icons.tsx, styles/api-limits.css). */}
        <ul className="flex flex-col border-t border-border md:flex-row md:pt-10">
          {commitments.map((c, i) => (
            <Motion
              as="li"
              replay={false}
              key={c.title}
              className={`motion flex grow basis-0 flex-col gap-[14px] border-border py-8 md:py-0 ${
                i > 0 ? 'border-t md:border-t-0 md:border-l md:pl-10' : ''
              } ${i < commitments.length - 1 ? 'md:pr-10' : ''}`}
            >
              <CommitmentIcon detail={c.detail} />
              <h3 className="text-[22px] leading-body-l font-semibold text-text">{c.title}</h3>
              <p className="text-[15px] leading-6 text-pretty text-text-muted">{c.body}</p>
            </Motion>
          ))}
        </ul>
        <p>
          <a href={site.apiDocsUrl} rel="noopener" className="text-body-s leading-5 font-medium text-brand-blue hover:underline">
            See current limits and SLAs in the developer docs <span aria-hidden>→</span>
          </a>
        </p>
        <figure className="relative isolate flex h-[260px] flex-col justify-between overflow-hidden rounded-[20px] p-6 md:h-[300px] md:px-8 md:pt-[28px] md:pb-8">
          <Image
            src={images.network.src}
            alt={images.network.alt}
            fill
            quality={75}
            sizes="(min-width: 1440px) 1248px, calc(100vw - 32px)"
            className="-z-20 object-cover"
          />
          <div aria-hidden className="products-photo-grade-deep-40-92 absolute inset-0 -z-10" />
          <p className="text-micro font-bold tracking-[0.13em] text-viz-gold uppercase">One contract · Every cell</p>
          <Motion
            as="figcaption"
            replay={false}
            className="motion rl-caption max-w-[1000px] text-[20px] leading-7 font-extrabold tracking-display text-white md:text-[22px] md:leading-body-l"
          >
            Over 100 parameters, forecasts out to 180 hours, refreshed every two minutes.
          </Motion>
        </figure>
      </div>
    </section>
  );
}
