import Image from 'next/image';
import Link from 'next/link';

import { BOLT_PATH } from '@/components/bolt-path';
import { AgentChat } from '@/components/agent-conversation/agent-chat';
import { Lines } from '@/components/lines';
import { Motion } from '@/components/motion';
import { ParameterCard } from '@/components/parameter-card';
import { ScrollFlow } from '@/components/scroll-flow';
import {
  catalogueFilters,
  customerProof,
  predictionCatalogue,
  productPaths,
  productLayers,
  products,
  roleCards,
  type Product,
  type ProductLayerId,
} from '@/content/products';

import { SectionHeader, SectionLabel } from '../section-header';
import { LayerStack } from './layer-stack';
import { LayerSpy } from './product-layers';
import { RolePicker } from './role-picker';

/* ------------------------------------------------------------------ */
/* What does Flash predict?                                            */
/* ------------------------------------------------------------------ */

const TOTAL = predictionCatalogue.length;

/**
 * The prediction catalogue, on the same card and scroll flow as the home
 * page's "Every parameter…" (components/parameter-card.tsx, scroll-flow.tsx,
 * styles/parameter-card.css). What only this section has (styles/products.css,
 * "Prediction catalogue"):
 *
 *   filter      industry chips, a radio group: `:has(:checked)` dims the
 *               cards whose `data-for` does not name the industry. It is CSS
 *               alone, so it works without JavaScript and with reduced motion
 *   count       "15+" counts up with the intro (<Motion count>); the
 *               finished number, drawn hidden by CSS from `data-width`, holds
 *               its width, so the line does not reflow as it counts. Being
 *               CSS, that copy is not in the HTML a crawler reads
 *
 * The heading and the intro share their last baseline from lg.
 */
export function PredictionCatalogue() {
  return (
    <ScrollFlow
      labelledBy="predict-heading"
      className="scroll-flow pp-catalogue relative isolate overflow-hidden border-t border-border bg-surface-sunken"
    >
      <div className="container-page flex flex-col gap-10 py-20 lg:gap-12 lg:py-[120px]">
        <Motion
          threshold={0.2}
          replay={false}
          count="15+"
          className="motion scroll-flow-head pp-head flex flex-col gap-6 lg:flex-row lg:justify-between lg:gap-16"
        >
          <div className="flex max-w-[700px] flex-col gap-5">
            <SectionLabel className="scroll-flow-eyebrow">What we predict · one engine · one grid</SectionLabel>
            <h2
              id="predict-heading"
              className="text-[32px] leading-[38px] font-extrabold tracking-[-0.03em] text-text md:text-[40px] md:leading-[46px] lg:text-[48px] lg:leading-[54px]"
            >
              <Lines className="scroll-flow-word" text="What does Flash predict?" />
            </h2>
          </div>
          <p className="scroll-flow-intro text-[17px] leading-h4 text-pretty text-text-muted lg:w-[560px] lg:shrink">
            <span className="pp-count" data-width="15+">
              <span data-count className="pp-count-live">
                15+
              </span>
            </span>{' '}
            proprietary prediction products from over 100 atmospheric parameters, scored against ground truth and served
            from the same 1 km, 2-minute model run. Lightning, hail and heat have their own pages; the rest ship inside
            the Command Center, the API and Flash Agent.
          </p>
        </Motion>

        <div className="flex flex-col gap-10 lg:gap-12">
          <fieldset className="pp-filter">
            <legend className="sr-only">Highlight the predictions relevant to</legend>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5">
              <p aria-hidden className="text-[11px] leading-[14px] font-semibold tracking-label-wide text-text-muted uppercase">
                Relevant to
              </p>
              <div className="flex flex-wrap gap-2">
                {[{ id: 'all', label: 'All' }, ...catalogueFilters].map((filter) => (
                  <label key={filter.id} className="pp-chip">
                    <input
                      type="radio"
                      name="predict-filter"
                      value={filter.id}
                      defaultChecked={filter.id === 'all'}
                      className="sr-only"
                    />
                    {filter.label}
                  </label>
                ))}
              </div>
              {/* What the filter did, in words: one line per chip, the checked
                  one shown. In a live region, so a screen reader hears it. */}
              <p aria-live="polite" className="pp-filter-note text-caption text-text-muted sm:ml-auto">
                <span data-note="all">All {TOTAL} prediction families</span>
                {catalogueFilters.map((filter) => (
                  <span key={filter.id} data-note={filter.id}>
                    {predictionCatalogue.filter((card) => card.industries.includes(filter.id)).length} of {TOTAL} for{' '}
                    {filter.label}
                  </span>
                ))}
              </p>
            </div>
          </fieldset>

          <ul className="scroll-flow-cards grid grid-cols-1 gap-6 border-t border-border pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {predictionCatalogue.map((card) => (
              <Motion as="li" key={card.tag} threshold={0.2} replay={false} className="motion scroll-flow-card flex">
                <ParameterCard
                  pinLinks
                  industries={card.industries}
                  grade={card.dark ? 'products-photo-grade-deep-30-92' : 'products-photo-grade-15-88'}
                  card={{
                    tag: card.tag,
                    caption: card.badge,
                    image: card.image,
                    dark: card.dark,
                    links: card.links,
                    items: card.items.map((item) => ({ title: item.name, body: item.detail })),
                  }}
                />
              </Motion>
            ))}
          </ul>
        </div>
      </div>
    </ScrollFlow>
  );
}

/* ------------------------------------------------------------------ */
/* Every Flash product                                                 */
/* ------------------------------------------------------------------ */

const agentFlow = [
  { label: 'Prediction engine', value: '15+ products · 1×1 km · every 2 min', highlight: false },
  { label: 'Flash Agent', value: 'Your sites, thresholds and data', highlight: true },
  { label: 'Your tools', value: 'Calendar · Procore · Slack · Teams · ERP · CRM', highlight: false },
];

const productById = new Map(products.map((product) => [product.id, product]));

/** The rail's click targets, top plate first (the tab order); z-index lets an upper plate win where two overlap. */
const railPlates: ProductLayerId[] = ['intelligence', 'delivery', 'predictions', 'services'];

/**
 * "Every Flash product", grouped by the hero's three layers, then services
 * (content/products.ts, `productLayers`). The home page shows the same
 * products as one grid with a gold line; this page groups them, so the two
 * never read as the same block.
 *
 *   rail    from lg: a sticky mini stack of the hero's layers and the current
 *           group's name. <LayerSpy> lights the group being read; each plate
 *           is a link to its group (Lenis eases in-page links).
 *   groups  one <Motion> each: the label rises, the line follows, the cards
 *           fade up 70ms apart; the Flash Agent flow draws left to right.
 *           Below lg the label is a sticky mini-header with its plate lit.
 *   cards   the shared `.pc` card (styles/parameter-card.css): lift, photo
 *           scale and arrow slide on hover; <ScrollFlow> drifts each photo
 *           in its frame as the card crosses the screen.
 *
 * With reduced motion all of it is static; the rail still tracks.
 */
export function ProductGrid() {
  return (
    <ScrollFlow id="products" labelledBy="products-heading" className="scroll-mt-24 bg-brand-navy">
      <div className="container-page flex flex-col gap-10 py-20 lg:gap-14 lg:py-[120px]">
        <SectionHeader
          id="products-heading"
          tone="dark"
          labelEmphasis="strong"
          label="Products · prediction, delivery, agentic"
          heading="Every Flash product, and how the forecast reaches your people."
          aside="Every product reads the same model run, so the push alert, the horn, the webhook and the agent never disagree. Pick the surface each role already looks at."
        />

        <LayerSpy initial="intelligence" className="pl lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-12">
          <div className="hidden lg:block">
            <nav aria-label="Product layers" className="pl-rail sticky top-28 flex flex-col gap-5 pt-1">
              <div className="relative size-40">
                <LayerStack className="size-full" />
                {railPlates.map((id) => (
                  <a key={id} href={`#layer-${id}`} data-layer={id} className={`pl-hit pl-hit-${id}`}>
                    <span className="sr-only">{productLayers.find((layer) => layer.id === id)?.label}</span>
                  </a>
                ))}
              </div>
              {/* The current group's name; the links above carry the names for assistive tech. */}
              <div aria-hidden className="grid">
                {productLayers.map((layer, i) => (
                  <p key={layer.id} data-layer={layer.id} className="pl-name flex flex-col gap-1.5 [grid-area:1/1]">
                    <span className="text-[11px] leading-[14px] font-bold tracking-[0.13em] text-[#8F9AB8] uppercase">
                      Layer {String(i + 1).padStart(2, '0')} / {String(productLayers.length).padStart(2, '0')}
                    </span>
                    <span className="text-h3 leading-[30px] font-extrabold tracking-[-0.02em] text-text-on-dark">
                      {layer.label}
                    </span>
                  </p>
                ))}
              </div>
            </nav>
          </div>

          <div className="flex min-w-0 flex-col gap-20 lg:gap-24">
            {productLayers.map((layer, i) => (
              <div
                key={layer.id}
                id={`layer-${layer.id}`}
                data-layer-group={layer.id}
                aria-labelledby={`layer-${layer.id}-heading`}
                role="group"
                className="lg:scroll-mt-9"
              >
                <Motion threshold={0.12} replay={false} className="motion flex flex-col gap-6 lg:gap-7">
                  <div className="pl-head sticky top-16 z-10 -mx-4 flex h-13 items-center gap-3 border-b border-white/10 bg-brand-navy/92 px-4 backdrop-blur-md md:-mx-10 md:px-10 lg:static lg:mx-0 lg:h-auto lg:border-0 lg:bg-transparent lg:px-0 lg:backdrop-blur-none">
                    <LayerStack lit={layer.id} className="size-[30px] shrink-0 lg:hidden" />
                    <h3
                      id={`layer-${layer.id}-heading`}
                      className="text-micro font-bold tracking-[0.13em] text-viz-gold uppercase"
                    >
                      {String(i + 1).padStart(2, '0')} · {layer.label}
                    </h3>
                  </div>
                  <p className="pl-line -mt-2 max-w-[640px] text-[15px] leading-[23px] text-[#C9D1E3] md:text-[17px] md:leading-[26px] lg:-mt-4">
                    {layer.line}
                  </p>

                  {layer.id === 'intelligence' ? (
                    <AgentBand />
                  ) : (
                    <ul className={`grid grid-cols-1 gap-6 ${layer.products.length > 1 ? 'md:grid-cols-2' : ''}`}>
                      {layer.products.map((id, n) => {
                        const product = productById.get(id);
                        if (!product) return null;
                        return (
                          <li key={id} id={id} className="pl-card flex scroll-mt-24" data-i={n}>
                            <ProductCard product={product} wide={layer.products.length === 1} />
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {layer.id === 'delivery' && (
                    <div className="pl-card flex flex-col gap-3 border-t border-white/12 pt-7 md:flex-row md:items-center md:gap-6" data-i={4}>
                      <p className="shrink-0 text-micro font-semibold tracking-label text-[#8F9AB8] uppercase">Also</p>
                      <p className="text-[15px] leading-body-s text-text-on-dark-muted">
                        SMS and email for staff who never open an app · horn and strobe relays for crews and crowds ·
                        Flash Agent, which reads all of the above and answers in the tool you are already in
                      </p>
                    </div>
                  )}
                </Motion>
              </div>
            ))}
          </div>
        </LayerSpy>
      </div>
    </ScrollFlow>
  );
}

/** Flash Agent, the harness over every product: the Intelligence group's one card. */
function AgentBand() {
  return (
    <article className="pl-card flex flex-col gap-8 rounded-[20px] border border-viz-gold/55 bg-viz-gold/6 p-6 md:px-10 md:py-9">
      <div className="flex max-w-[640px] flex-col gap-3">
        <p className="text-[11px] leading-[14px] font-bold tracking-[0.13em] text-viz-gold uppercase">
          Agentic · the harness
        </p>
        <h4 className="text-[28px] leading-[34px] font-extrabold tracking-[-0.03em] text-text-on-dark">Flash Agent</h4>
        <p className="text-[15px] leading-6 text-[#C9D1E3]">
          Flash provides the harness: the prediction engine, your sites and your data, connected to the tools you
          already run. Ask in plain language; get an answer or an action.
        </p>
        <Link
          href={productPaths.agent}
          className="pc-link self-start text-caption leading-micro font-bold text-viz-gold hover:underline"
        >
          Flash Agent <span aria-hidden>→</span>
        </Link>
      </div>
      <ol className="flex flex-col items-stretch gap-2 md:flex-row md:items-center md:gap-0">
        {agentFlow.map((step, i) => (
          <li key={step.label} data-step={i} className="flex grow basis-0 flex-col items-stretch md:flex-row md:items-center">
            {i > 0 && (
              <span
                aria-hidden
                className="pl-arrow inline-block self-center px-3 text-h4 leading-6 font-extrabold text-viz-gold max-md:rotate-90"
              >
                →
              </span>
            )}
            <div
              className={`pl-step flex grow basis-0 flex-col gap-1.5 rounded-[12px] border px-5 py-[18px] ${
                step.highlight ? 'border-viz-gold/60 bg-viz-gold/10' : 'border-white/12 bg-white/4'
              }`}
            >
              <p
                className={`text-[10px] leading-3 font-bold tracking-[0.13em] uppercase ${
                  step.highlight ? 'text-viz-gold' : 'text-[#8F9AB8]'
                }`}
              >
                {step.label}
              </p>
              <p className="text-body-s leading-5 font-bold text-text-on-dark">{step.value}</p>
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}

/**
 * One product, the whole card a link, on the shared `.pc` card. A group with
 * a single product (Services) lays it out wide from md: photo left, copy right.
 */
function ProductCard({ product, wide }: { product: Product; wide: boolean }) {
  return (
    <Link
      href={product.href ?? `${productPaths.index}#${product.id}`}
      className={`pc pl-product group flex w-full flex-col overflow-hidden rounded-lg border border-white/10 bg-white/3 hover:border-white/25 focus-visible:border-white/25 ${
        wide ? 'md:flex-row' : ''
      }`}
    >
      <div className={`relative aspect-video shrink-0 overflow-hidden ${wide ? 'md:w-1/2' : ''}`}>
        <div className="pc-photo absolute inset-x-0 -inset-y-3">
          <Image
            src={product.image.src}
            alt={product.image.alt}
            fill
            sizes="(min-width: 1440px) 488px, (min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
      <div className={`flex grow flex-col gap-2.5 px-6 pt-[22px] pb-[26px] ${wide ? 'md:justify-center md:px-9' : ''}`}>
        <p className="text-[11px] leading-[14px] font-bold tracking-[0.13em] text-[#8F9AB8] uppercase">
          {product.category}
        </p>
        <h4 className="text-h4 leading-body font-extrabold text-text-on-dark">{product.name}</h4>
        <p className="text-body-s leading-[21px] text-text-on-dark-muted">{product.summary}</p>
        <p className={`pc-link pt-1 text-caption leading-micro font-bold text-viz-gold group-hover:underline ${wide ? '' : 'mt-auto'}`}>
          {product.name} <span aria-hidden>→</span>
        </p>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* What is Flash Agent?                                                */
/* ------------------------------------------------------------------ */

const agentConnectors = [
  'Google Calendar',
  'Microsoft 365',
  'Salesforce',
  'HubSpot',
  'NetSuite · SAP',
  'Procore',
  'Slack · Teams',
  'Webhooks',
];

export function AgentSection() {
  return (
    <section aria-labelledby="agent-heading" className="border-t border-white/10 bg-brand-navy">
      <div className="container-page flex flex-col gap-12 py-20 lg:flex-row lg:items-start lg:gap-16 lg:py-[120px]">
        <div className="flex flex-col gap-6 lg:w-[520px] lg:shrink xl:shrink-0">
          <SectionLabel tone="dark">Intelligence · Flash Agent</SectionLabel>
          <h2
            id="agent-heading"
            className="text-[32px] leading-[38px] font-extrabold tracking-[-0.03em] text-text-on-dark md:text-[40px] md:leading-[46px] lg:text-[48px] lg:leading-[54px]"
          >
            What is Flash Agent?
          </h2>
          <p className="text-body-l leading-body-l text-pretty text-[#C9D1E3]">
            Flash provides the harness — the prediction engine, your sites and your data — and connects to the
            tools you already run. Ask in plain language; get an answer or an action.
          </p>
          <Motion as="ul" label="Connectors" className="motion flex flex-wrap gap-2 pt-1" replay={false}>
            {agentConnectors.map((name) => (
              <li
                key={name}
                className="exchange-connector flex h-7 items-center rounded-full border border-white/18 px-3 text-micro font-medium text-[#DCE2F0]"
              >
                {name}
              </li>
            ))}
          </Motion>
          <p className="border-t border-white/10 pt-2 text-body-s text-[#8F9AB8]">
            Guardrails by design: permissions per connector, every action logged, a human confirms before any
            schedule or record changes, and no data leaves your tenant without consent.
          </p>
          <Link href={productPaths.agent} className="text-body-s leading-5 font-medium text-viz-gold hover:underline">
            How Flash Agent works <span aria-hidden>→</span>
          </Link>
        </div>

        <AgentExchange />
      </div>
    </section>
  );
}

const exchange = {
  question: 'Is Tuesday’s spray window still open?',
  answer:
    'Yes, 06:00–09:30. Wind 6 mph from the south-west, no rain before noon, dew point holding at 58 °F across all six cells. Added to the crew calendar and flagged the 14th green for a second pass.',
};

const exchangeChip = 'exchange-chip flex min-h-6 items-center rounded-sm border px-2.5 text-micro';

/**
 * The illustrative agent exchange, built in HTML so its text is crawlable.
 * It plays once as it scrolls in, on the home page's chat playback
 * (<AgentChat>, the `chat-*` rules in styles/agent-conversation.css), with this panel's own
 * steps in styles/products.css. Every piece is laid out from the start and
 * only fades, so the panel is at its final height throughout.
 */
function AgentExchange() {
  return (
    <AgentChat className="relative flex min-w-0 grow basis-0 flex-col">
      <figure
        data-chat-panel
        aria-label="Flash Agent answering an agronomist that Tuesday's spray window is open and adding it to the crew calendar"
        className="chat flex flex-col gap-5 rounded-[20px] border border-white/10 bg-brand-navy-deep/72 p-5 md:p-7"
      >
        <div className="exchange-head flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] leading-[14px] font-semibold tracking-label text-[#8F9AB8] uppercase">
            Flash Agent · illustrative example · not live weather
          </p>
          <p className="text-[11px] leading-[14px] font-medium text-[#7FD1A8]">
            <span aria-hidden className="exchange-dot inline-block">
              ●
            </span>{' '}
            Connected · crew calendar · Salesforce
          </p>
        </div>
        <div className="chat-bubble flex justify-end">
          <p className="max-w-[400px] rounded-[14px] rounded-br-xs bg-neutral-800 px-4 py-3 text-[15px] leading-body-s text-text-on-dark">
            {exchange.question}
          </p>
        </div>
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="chat-agent bg-gold-metallic flex size-7 shrink-0 items-center justify-center rounded-full"
          >
            <svg width="12" height="16" viewBox="0 0 26 34">
              <path d={BOLT_PATH} fill="#070D26" />
            </svg>
          </span>
          <div className="relative flex min-w-0 grow basis-0 flex-col gap-3">
            {/* Shown only while the agent "thinks"; sits over the answer's first line. */}
            <span aria-hidden className="chat-dots absolute top-0 left-0 flex h-6 items-center gap-[6px]">
              <span className="size-[7px] rounded-full bg-[#8F9AB8]" />
              <span className="size-[7px] rounded-full bg-[#8F9AB8]" />
              <span className="size-[7px] rounded-full bg-[#8F9AB8]" />
            </span>
            <p className="text-[15px] leading-6 text-[#DCE2F0]">
              {exchange.answer.split(' ').map((word, i) => (
                <span key={i}>
                  <span className="chat-word">{word}</span>{' '}
                </span>
              ))}
            </p>
            {/* In reading order; they arrive Source, Action, Confirmed. */}
            <ul className="flex flex-wrap gap-2">
              <li
                className={`exchange-chip-action gap-1.5 border-alert-clear/60 bg-alert-clear/16 font-semibold text-[#7FD1A8] ${exchangeChip}`}
              >
                <svg aria-hidden width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
                  <path
                    className="exchange-tick"
                    pathLength="1"
                    d="M2.5 6.4l2.3 2.3 4.7-5.2"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Action · crew calendar updated
              </li>
              <li className={`exchange-chip-source border-white/14 font-medium text-text-on-dark-muted ${exchangeChip}`}>
                Source · cells 2214–2219 · 05:40 run
              </li>
              <li
                className={`exchange-chip-confirmed border-white/14 font-medium text-text-on-dark-muted ${exchangeChip}`}
              >
                Confirmed by the superintendent
              </li>
            </ul>
          </div>
        </div>
        {/* The composer the question is typed into; an illustration, so hidden
            from assistive tech (the question itself is the bubble above). */}
        <div
          aria-hidden
          className="flex items-center justify-between gap-3 rounded-full border border-white/12 py-2 pr-2 pl-5"
        >
          <span className="flex min-w-0 items-center overflow-hidden text-body-s leading-5">
            <span data-chat-typed data-text={exchange.question} className="chat-typed truncate text-text-on-dark" />
            <span className="chat-caret h-4 w-px shrink-0 bg-viz-gold" />
            <span className="chat-placeholder exchange-placeholder truncate text-[#8F9AB8]">
              Ask about any site, any layer, any day…
            </span>
          </span>
          <span className="exchange-send bg-gold-button flex h-9 shrink-0 items-center rounded-full px-5 text-caption leading-micro font-semibold text-brand-navy">
            Ask
          </span>
        </div>
        {/* Out of the flow, under the panel's corner, so it takes no room. */}
        <button
          type="button"
          data-chat-replay
          className="chat-replay absolute top-full right-0 mt-3 flex h-8 cursor-pointer items-center gap-2 rounded-full border border-white/20 px-3.5 text-micro font-bold text-[#C9D1E3] hover:border-white/40 hover:text-text-on-dark"
        >
          <span aria-hidden>↻</span>
          Replay
        </button>
      </figure>
    </AgentChat>
  );
}

/* ------------------------------------------------------------------ */
/* Start by role                                                       */
/* ------------------------------------------------------------------ */

const industryLinks = [
  { label: 'Schools', href: '/industries-we-serve/schools/' },
  { label: 'Construction', href: '/industries-we-serve/construction/' },
  { label: 'Roofing', href: '/industries-we-serve/roofing/' },
  { label: 'Golf', href: '/industries-we-serve/golf/' },
  { label: 'Agriculture', href: '/industries-we-serve/agriculture/' },
];

export function StartByRole() {
  return (
    <section aria-labelledby="role-heading" className="bg-neutral-0">
      <div className="container-page flex flex-col gap-10 py-20 lg:gap-12 lg:py-[120px]">
        <SectionHeader
          id="role-heading"
          label="Where to start · by role"
          heading="Which part of the platform should you start with?"
          aside="Every role starts with one prediction product and one channel. Flash Agent sits on top of all of them and acts in the tool that role already lives in."
        />
        <RolePicker roles={roleCards} />
        <div className="flex flex-col gap-6 border-t border-border pt-8 lg:flex-row lg:items-center lg:justify-between">
          <nav aria-label="Explore by industry" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <p className="text-[11px] leading-[14px] font-semibold tracking-label-wide text-text-muted uppercase">
              Explore by industry
            </p>
            <ul className="flex flex-wrap gap-2">
              {industryLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="role-industry">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link
            href="/why-flash/accuracy-method/"
            className="pc-link self-start text-body-s leading-5 font-bold text-brand-blue hover:underline lg:self-auto"
          >
            Accuracy method <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Named customers                                                     */
/* ------------------------------------------------------------------ */

export function CustomerProof() {
  return (
    <section aria-label="Trusted on the field" className="border-y border-border bg-neutral-0">
      <div className="mx-auto flex max-w-page flex-col lg:flex-row">
        <div className="flex flex-col justify-center gap-2 border-b border-border px-4 py-7 md:px-10 lg:w-[300px] lg:shrink xl:shrink-0 lg:border-r lg:border-b-0 lg:pr-8 xl:pl-24">
          <p className="text-[11px] leading-[14px] font-semibold tracking-[0.16em] text-text-muted uppercase">
            Trusted on the field
          </p>
          <p className="text-body-s text-text">Named customers, named use.</p>
        </div>
        <ul className="grid grow grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {customerProof.map((customer, i) => (
            <li
              key={customer.name}
              className={`flex flex-col justify-center gap-1.5 border-border px-4 py-7 md:px-8 ${
                i < customerProof.length - 1 ? 'border-b sm:border-b-0 lg:border-r' : ''
              } ${i < 2 ? 'sm:max-lg:border-b' : ''} ${i === customerProof.length - 1 ? 'xl:pr-24' : ''}`}
            >
              <p className="text-h4 leading-6 font-bold tracking-[0.02em] text-brand-navy uppercase">{customer.name}</p>
              <p className="text-caption text-text-muted">{customer.use}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
