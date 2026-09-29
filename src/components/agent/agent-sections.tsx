import { FaqAccordion } from '@/components/faq/faq-accordion';
import { Motion } from '@/components/motion';
import Link from 'next/link';

import { agentEngineStats, agentFaqs, agentHarnessChecks, agentIntegrations, agentToolChips } from '@/content/agent';

import { AgentGuardrails } from './agent-guardrails';
import { AgentIntegrations } from './agent-integrations';
import { BoltGlyph } from './bolt-glyph';
import { EngineTwins } from './engine-twins';
import { HarnessLoop } from './harness-loop';

/** The chip the harness loop starts from, and the engine lines its answer reads (styles/agent-harness.css). */
const LOOP_TOOL = 'Google Calendar';
const LOOP_STATS = new Set(['1×1 km', '60 min']);

function SwapArrows({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`hl-rise flex items-center justify-center py-2 max-lg:rotate-90 lg:w-[60px] lg:shrink xl:shrink-0 ${className}`}
    >
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path
          d="M4 8.5h14M14 4.5l4 4-4 4M20 15.5H6M10 11.5l-4 4 4 4"
          fill="none"
          stroke="#5F6B85"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/** "How does the harness work?" The diagram is HTML, so every label in it is text a crawler reads. */
export function HarnessSection() {
  return (
    <section aria-labelledby="harness-heading" className="bg-neutral-0">
      <div className="container-page flex flex-col gap-12 py-16 lg:gap-14 lg:py-[112px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="flex max-w-[720px] flex-col gap-4">
            <p className="text-micro font-semibold tracking-label text-brand-blue">HOW THE HARNESS WORKS</p>
            <h2
              id="harness-heading"
              className="text-[32px] leading-[38px] font-extrabold tracking-[-0.03em] text-text md:text-h1 md:leading-h1"
            >
              How does the harness work?
            </h2>
          </div>
          <p className="text-[17px] leading-h4 text-pretty text-text-muted lg:w-[400px] lg:shrink xl:shrink-0">
            Three parts, one loop. Your tools and data on one side, the prediction engine on the other, and the Flash
            harness in between: it understands the question, reads the forecast for your cells, and acts only where you
            allowed it.
          </p>
        </div>

        <HarnessLoop>
          <figure className="flex flex-col lg:flex-row lg:items-stretch">
            <figcaption className="sr-only">
              Diagram of the Flash Agent harness: the customer&apos;s tools and data on the left, the Flash harness with
              permissions, memory, audit log and human confirmation in the middle, and the Flash prediction engine on the
              right
            </figcaption>

            <div className="hl-rise flex flex-col gap-4 rounded-[20px] border border-border p-7 shadow-[0_1px_2px_#0B13220D,0_12px_32px_#0B13220F] lg:w-[376px] lg:shrink xl:shrink-0">
              <p className="text-[11px] leading-[14px] font-semibold tracking-label text-text-muted">YOUR TOOLS AND DATA</p>
              <ul className="flex flex-wrap gap-2">
                {agentToolChips.map((chip) => (
                  <li
                    key={chip}
                    className={`flex h-[30px] items-center rounded-full border border-border-strong px-3 text-caption leading-micro font-medium text-text ${chip === LOOP_TOOL ? 'hl-chip' : ''}`}
                  >
                    {chip === LOOP_TOOL ? (
                      <>
                        <span className="hl-chip-label">{chip}</span>
                        <span aria-hidden className="hl-chip-done">
                          <svg width="14" height="14" viewBox="0 0 24 24">
                            <path
                              d="M5 12.5l4.5 4.5L19 7.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Done
                        </span>
                      </>
                    ) : (
                      chip
                    )}
                  </li>
                ))}
              </ul>
              <p className="text-body-s text-text-muted">
                Plus your site list, your written policies and your contact lists per role — the memory the agent reads
                before it answers.
              </p>
            </div>

            <SwapArrows className="hl-arrow-1 hl-k1" />

            <div className="hl-rise hl-k2 hl-harness flex flex-col gap-[18px] rounded-[20px] bg-brand-navy p-7 lg:w-[376px] lg:shrink xl:shrink-0">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="hl-badge bg-gold-metallic flex size-9 shrink-0 items-center justify-center rounded-full"
                >
                  <BoltGlyph width={14} height={18} />
                </span>
                <p className="text-body-l leading-body-s font-bold tracking-heading text-text-on-dark">Flash harness</p>
              </div>
              <p className="text-body-s text-[#C9D1E3]">
                Understands the question, reads the forecast for your cells, acts only where you allowed it.
              </p>
              <ul className="flex flex-col border-b border-white/10">
                {agentHarnessChecks.map((c, i) => (
                  <li key={c} className={`hl-check hl-c${i + 1} flex items-start gap-[10px] border-t border-white/10 py-3`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className="shrink-0">
                      <path
                        className="hl-tick"
                        pathLength={1}
                        d="M5 12.5l4.5 4.5L19 7.5"
                        fill="none"
                        stroke="var(--color-gold-300)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="hl-check-label text-body-s leading-5 text-[#DCE2F0]">{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <SwapArrows className="hl-arrow-2 hl-k3" />

            <div className="hl-rise hl-k4 hl-engine flex flex-col gap-4 rounded-[20px] border border-border p-7 shadow-[0_1px_2px_#0B13220D,0_12px_32px_#0B13220F] lg:w-[376px] lg:shrink xl:shrink-0">
              <p className="text-[11px] leading-[14px] font-semibold tracking-label text-text-muted">PREDICTION ENGINE</p>
              <p className="text-[15px] leading-[23px] text-text">
                <Link href="/products/lightning-prediction/" className="font-semibold text-brand-blue hover:underline">
                  FlashPredict lightning
                </Link>{' '}
                ·{' '}
                <Link href="/products/hail-prediction/" className="font-semibold text-brand-blue hover:underline">
                  FlashHail
                </Link>{' '}
                · heat and WBGT · wind, rain, frost · agronomy — 15+ prediction products on one grid.
              </p>
              <dl className="hl-engine-dl flex flex-col border-b border-border">
                {agentEngineStats.map((s) => (
                  <div
                    key={s.value}
                    className={`flex items-baseline gap-3 border-t border-border py-[10px] ${LOOP_STATS.has(s.value) ? 'hl-row' : ''}`}
                  >
                    <dt className="w-[72px] shrink-0 text-h4 leading-6 font-bold tracking-display text-text">{s.value}</dt>
                    <dd className="text-caption text-text-muted">{s.label}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-body-s text-text-muted">Every answer cites the cell and the model run it came from.</p>
            </div>
          </figure>
        </HarnessLoop>
      </div>
    </section>
  );
}

export function IntegrationsSection() {
  return (
    <section id="integrations" aria-labelledby="integrations-heading" className="scroll-mt-4 bg-neutral-0">
      <div className="container-page flex flex-col gap-12 border-t border-border py-16 lg:py-[112px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="flex max-w-[720px] flex-col gap-4">
            <p className="text-micro font-semibold tracking-label text-brand-blue">
              INTEGRATIONS · WHERE THE AGENT CAN ACT
            </p>
            <h2
              id="integrations-heading"
              className="text-[32px] leading-[38px] font-extrabold tracking-[-0.03em] text-text md:text-h1 md:leading-h1"
            >
              Which tools does Flash Agent work in?
            </h2>
            <Motion replay={false} count={String(agentIntegrations.length)} className="motion agi-count">
              <span aria-hidden className="agi-count-dot" />
              <span>
                <span data-count>{agentIntegrations.length}</span> connectors
              </span>
            </Motion>
          </div>
          <p className="text-[17px] leading-h4 text-pretty text-text-muted lg:w-[400px] lg:shrink xl:shrink-0">
            Each connector is switched on per site with its own permissions. One line on what the agent can do in each.
          </p>
        </div>
        <AgentIntegrations />
      </div>
    </section>
  );
}

export function GuardrailsSection() {
  return (
    <section aria-labelledby="guardrails-heading" className="bg-brand-navy">
      <div className="container-page flex flex-col gap-12 py-16 lg:gap-14 lg:py-[112px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="flex max-w-[720px] flex-col gap-4">
            <p className="text-micro font-semibold tracking-label text-viz-gold">GUARDRAILS · ON BY DEFAULT</p>
            <h2
              id="guardrails-heading"
              className="text-[32px] leading-[38px] font-extrabold tracking-[-0.03em] text-text-on-dark md:text-h1 md:leading-h1"
            >
              What stops it doing the wrong thing?
            </h2>
          </div>
          <p className="text-[17px] leading-h4 text-pretty text-[#C9D1E3] lg:w-[400px] lg:shrink xl:shrink-0">
            Four rules that cannot be switched off. They are the reason a safety manager can hand the agent a live site.
          </p>
        </div>
        <AgentGuardrails />
      </div>
    </section>
  );
}

export function SameEngineSection() {
  const links = [
    { label: 'Flash API offerings', href: '/products/api-offerings/' },
    { label: 'Accuracy method', href: '/why-flash/accuracy-method/' },
    { label: 'Weather Command Center', href: '/products/weather-command-center/' },
    { label: 'Prediction vs sensors vs detection', href: '/why-flash/prediction-vs-sensors-vs-detection/' },
  ];
  return (
    <section aria-labelledby="engine-heading" className="bg-neutral-0">
      <div className="container-page">
        <div className="flex flex-col gap-10 border-b border-border py-16 lg:flex-row lg:items-center lg:gap-16 lg:py-20">
          <div className="flex flex-col gap-[18px] lg:w-[460px] lg:shrink xl:w-[520px] xl:shrink-0">
            <div className="flex flex-col gap-3">
              <p className="text-micro font-semibold tracking-label text-brand-blue">SAME ENGINE AS THE API</p>
              <h2
                id="engine-heading"
                className="text-[28px] leading-[34px] font-extrabold tracking-[-0.03em] text-text md:text-h2 md:leading-h2"
              >
                Is it the same engine as the API?
              </h2>
            </div>
            <p className="text-[17px] leading-h4 text-pretty text-text-muted">
              Yes. Flash Agent and the Flash API read the same 1×1 km cells and the same 2-minute model runs. If you
              already build on the API, the agent adds the plain-language layer and the action layer on top; nothing
              about the forecast changes, and the accuracy method that scores it is the same page.
            </p>
            <ul className="flex flex-wrap gap-x-7 gap-y-2">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-flex min-h-[44px] items-center text-body-s leading-caption font-semibold text-brand-blue hover:underline"
                  >
                    {l.label} <span aria-hidden>&nbsp;→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0 grow basis-0">
            <EngineTwins />
          </div>
        </div>
      </div>
    </section>
  );
}

export function AgentFaq() {
  return (
    <section aria-labelledby="agent-faq-heading" className="bg-surface-sunken">
      <div className="container-page flex flex-col gap-10 py-16 lg:py-[112px]">
        <div className="flex max-w-[900px] flex-col gap-4">
          <p className="text-micro font-semibold tracking-label text-brand-blue">FAQ</p>
          <h2
            id="agent-faq-heading"
            className="text-[32px] leading-[38px] font-extrabold tracking-[-0.03em] text-text md:text-h1 md:leading-h1"
          >
            Questions buyers ask about Flash Agent
          </h2>
        </div>
        <FaqAccordion
          className="flex flex-col border-t border-border"
          question="text-body-l leading-body font-semibold tracking-heading text-text"
          answer="mt-3 max-w-[820px] text-[15px] leading-6 text-text-muted"
          faqs={agentFaqs}
        />
      </div>
    </section>
  );
}
