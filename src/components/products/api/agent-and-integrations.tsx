import Image from 'next/image';
import Link from 'next/link';

import { ButtonLink } from '@/components/button';
import { Motion } from '@/components/motion';
import { SectionHeader, SectionLabel } from '@/components/products/section-header';
import { productPaths } from '@/content/products';

import { AgentRun } from './agent-run';
import { deliveryCards, images, integrationLinks } from './content';
import { IntegrationList } from './integration-list';

/** Dark band: the agent endpoint, with an illustrative request you can run (<AgentRun>). */
export function BuildWithAgent() {
  return (
    <section aria-labelledby="agent-heading" className="bg-brand-navy">
      <div className="container-page flex flex-col gap-12 py-20 lg:py-[120px] xl:flex-row xl:items-start xl:gap-16">
        <div className="flex flex-col gap-6 xl:w-[480px] xl:shrink-0">
          <SectionLabel tone="dark" emphasis="strong">
            Flash Agent · Illustrative example · Not live weather
          </SectionLabel>
          <h2
            id="agent-heading"
            className="text-[32px] leading-[38px] font-extrabold tracking-[-0.03em] text-text-on-dark md:text-[40px] md:leading-[46px] lg:text-[48px] lg:leading-[54px]"
          >
            Build with Flash Agent
          </h2>
          <p className="text-body-l text-pretty text-[#C9D1E3]">
            Flash Agent reads the same endpoints you do, and your app can call the agent. Send a plain-language question
            with a site scope; get back an answer, the cells and run it read, and any action it proposes, held until a
            person confirms.
          </p>
          <p className="border-t border-white/10 pt-2 text-body-s text-pretty text-[#8F9AB8]">
            Permissions per connector · every action logged · human confirmation before any schedule or record changes ·
            no data leaves your tenant without consent.
          </p>
          <Link
            href={productPaths.agent}
            className="w-fit text-body-s leading-5 font-medium text-viz-gold hover:underline"
          >
            Flash Agent <span aria-hidden>→</span>
          </Link>
          <figure className="relative isolate flex aspect-[16/9] w-full max-w-[480px] flex-col justify-between overflow-hidden rounded-lg px-[22px] pt-5 pb-5">
            <Image
              src={images.controlRoom.src}
              alt={images.controlRoom.alt}
              fill
              quality={75}
              sizes="(min-width: 520px) 480px, calc(100vw - 32px)"
              className="-z-20 object-cover"
            />
            <div aria-hidden className="products-photo-grade-deep-35-92 absolute inset-0 -z-10" />
            <p className="text-micro font-bold tracking-[0.13em] text-viz-gold uppercase">
              One engine · Two front doors
            </p>
            <figcaption className="text-body leading-6 font-extrabold tracking-heading text-white">
              Your app calls the API. Your crew asks the agent.
            </figcaption>
          </figure>
        </div>

        <AgentRun className="xl:w-[704px] xl:shrink-0" />
      </div>
    </section>
  );
}

/** Integrations grid, the Flash Agent row, and the other delivery routes. */
export function Integrations() {
  return (
    <section aria-labelledby="integrations-heading" className="bg-neutral-0">
      <div className="container-page flex flex-col gap-12 py-20 lg:py-[120px]">
        <SectionHeader
          id="integrations-heading"
          labelEmphasis="strong"
          label="Integrations · The tools you already run"
          heading="Where does Flash already plug in?"
          aside="Native connectors for the calendar, CRM, ERP and job-site tools our customers run, plus a signed webhook for everything else. Each connector is permissioned on its own."
        />

        <div className="border-t border-l border-border">
          <IntegrationList />
          <div className="flex flex-col gap-6 border-r border-b border-border bg-brand-navy px-6 py-7 md:flex-row md:items-center md:gap-8 md:px-8">
            <div className="flex grow basis-0 flex-col gap-2">
              <SectionLabel tone="dark" emphasis="strong">
                Agentic
              </SectionLabel>
              <h3 className="text-[22px] leading-h4 font-extrabold tracking-display text-white">Flash Agent</h3>
              <p className="max-w-narrow text-[15px] leading-6 text-pretty text-[#C9D1E3]">
                Ask in plain language; the agent calls the same API and acts in your tools. Flash provides the harness:
                the prediction engine, your sites and your data, connected to the tools you already run. Ask in plain
                language; get an answer or an action.
              </p>
            </div>
            <ButtonLink
              href={productPaths.agent}
              variant="gold"
              size="sm"
              icon="→"
              className="self-start text-caption tracking-normal md:self-center"
            >
              Flash Agent
            </ButtonLink>
          </div>
        </div>

        <ul className="flex flex-wrap gap-x-6 gap-y-3">
          {integrationLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-body-s leading-5 font-medium text-brand-blue hover:underline">
                {l.label} <span aria-hidden>→</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* The site's wave reveal (styles/parameter-card.css): the label rises
            in, then the cards fade up left to right, 70ms apart, their photos
            focusing in; stacked, each card plays as it is reached. */}
        <div className="flex flex-col gap-5">
          <Motion replay={false} threshold={0.2} className="motion">
            <p className="text-micro font-bold tracking-[0.13em] text-text-muted uppercase">
              <span className="scroll-flow-word">The same engine · Other ways to take delivery</span>
            </p>
          </Motion>
          <ul className="ain-cards scroll-flow-cards grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-[33px]">
            {deliveryCards.map((card) => (
              <Motion as="li" key={card.name} replay={false} threshold={0.2} className="motion scroll-flow-card flex">
                <div className="pc flex w-full flex-col overflow-hidden rounded-lg border border-border bg-neutral-0">
                  <div className="pc-photo ain-card-photo relative aspect-[394/222] bg-brand-navy">
                    <Image
                      src={card.image.src}
                      alt={card.image.alt}
                      fill
                      quality={90}
                      sizes="(min-width: 1440px) 394px, (min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex grow flex-col gap-2 p-[22px]">
                    <SectionLabel emphasis="strong">{card.label}</SectionLabel>
                    <h3 className="text-h4 leading-body font-extrabold tracking-display text-text">{card.name}</h3>
                    <p className="text-[15px] leading-6 text-pretty text-text-muted">{card.body}</p>
                    <Link
                      href={card.href}
                      className="pc-link mt-auto pt-1 text-caption leading-5 font-bold text-brand-blue hover:underline"
                    >
                      See {card.name} <span aria-hidden>→</span>
                    </Link>
                  </div>
                </div>
              </Motion>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
