import Link from 'next/link';

import { SectionHeader } from '@/components/products/section-header';
import { productPaths } from '@/content/products';

import { AgentAskBar } from './agent-ask-bar';
import { agentBarQuestions, specs } from './content';
import { SpecList } from './spec-list';

/**
 * The eight specs beside a hailstone cut in half, a growth ring each
 * (spec-list.tsx, spec-stone.tsx), then the Flash Agent banner with its
 * typing ask bar (agent-ask-bar.tsx).
 */
export function SpecGrid() {
  return (
    <section aria-labelledby="hail-specs-heading" className="bg-neutral-0">
      <div className="container-page flex flex-col gap-10 py-20 lg:gap-12 lg:py-[120px]">
        <SectionHeader
          size="md"
          labelTone="muted-light"
          id="hail-specs-heading"
          label="Specifications · FlashHail"
          heading="What exactly does FlashHail deliver?"
          aside={
            <Link
              href="/why-flash/accuracy-method/"
              className="inline-flex min-h-11 items-center text-body-s leading-5 font-semibold text-brand-blue hover:underline lg:justify-end"
            >
              How both engines are scored <span aria-hidden>&nbsp;→</span>
            </Link>
          }
        />

        <SpecList specs={specs} />

        <div className="hs-agent">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
            <p className="text-micro font-bold tracking-[0.13em] text-brand-blue uppercase lg:w-[88px] lg:shrink xl:shrink-0">
              Agentic
            </p>
            <p className="text-body-l leading-6 font-extrabold tracking-heading text-brand-navy lg:shrink-0">
              Flash Agent
            </p>
            <p className="grow basis-0 text-[15px] leading-6 text-pretty text-neutral-700">
              Flash provides the harness: the prediction engine, your sites and your data, connected to the tools you
              already run. Ask in plain language; get an answer or an action.
            </p>
            <Link
              href={productPaths.agent}
              className="inline-flex min-h-11 shrink-0 items-center text-caption leading-micro font-extrabold text-brand-blue hover:underline"
            >
              Flash Agent <span aria-hidden>&nbsp;→</span>
            </Link>
          </div>
          <AgentAskBar questions={agentBarQuestions} />
        </div>
      </div>
    </section>
  );
}
