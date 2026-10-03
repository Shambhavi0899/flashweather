import Image from "next/image";

import { PlatformSpotlight } from "@/components/home/platform-spotlight";
import { Lines } from "@/components/lines";
import { Motion } from "@/components/motion";
import { ScrollFlow } from "@/components/scroll-flow";
import { SiteLink } from "@/components/site-link";
import { VideoPlayer } from "@/components/video-player";
import { OVERVIEW_ID, overview, overviewVideo, productCards } from "@/content/home";

/**
 * "The platform": the Flash Agent band, the overview video (<TourRow>),
 * then every product. It reveals once as it scrolls in (styles/home.css,
 * "The platform"): the header, the band and its three steps, the tour's
 * clip then its text, then the cards on the shared wave
 * (`.scroll-flow-card`, styles/parameter-card.css), a row at a time, 70ms
 * apart. <PlatformSpotlight> lays a soft light under the mouse and brightens
 * the card borders near it. <ScrollFlow> drifts each photo in its frame. The
 * cards are the shared `.pc` card for their hover.
 */
export function Products() {
  return (
    <ScrollFlow id="platform" labelledBy="platform-heading" className="scroll-mt-4 bg-brand-navy">
      <div className="container-page flex flex-col gap-12 py-20 lg:py-[120px]">
        <Motion
          threshold={0.2}
          replay={false}
          className="motion flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12"
        >
          <div className="flex max-w-[720px] flex-col gap-4">
            <p className="platform-eyebrow text-micro font-semibold tracking-label text-viz-gold uppercase">
              The platform · predictions, delivery, intelligence
            </p>
            <h2
              id="platform-heading"
              className="text-[28px] leading-[34px] font-extrabold tracking-[-0.03em] text-text-on-dark md:text-display-m md:leading-display-m md:tracking-[-0.04em]"
            >
              <Lines
                className="scroll-flow-word"
                text="One prediction engine. Every way your team needs to receive it."
              />
            </h2>
          </div>
          <SiteLink
            href="/products/"
            className="platform-more shrink-0 text-[15px] leading-caption font-semibold text-viz-gold hover:underline"
          >
            See the whole platform <span aria-hidden>→</span>
          </SiteLink>
        </Motion>

        <div className="flex flex-col gap-6">
          <FlashAgentBand />
          <TourRow />

          <PlatformSpotlight className="platform-spot relative">
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {productCards.map((card) => (
                <Motion
                  as="li"
                  key={card.name}
                  threshold={0.2}
                  replay={false}
                  className="motion scroll-flow-card platform-cell relative flex"
                >
                  <SiteLink
                    href={card.href}
                    className="pc platform-card group flex w-full flex-col overflow-hidden rounded-lg border border-white/10"
                  >
                    <div className="relative aspect-video shrink-0 overflow-hidden">
                      <div className="pc-photo absolute inset-x-0 -inset-y-3">
                        <Image
                          src={card.image.src}
                          alt={card.image.alt}
                          fill
                          sizes="(min-width: 1024px) 400px, (min-width: 480px) 50vw, 100vw"
                          quality={90}
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex grow flex-col gap-[10px] px-6 pt-[22px] pb-[26px]">
                      <p className="text-[11px] leading-[14px] font-bold tracking-[0.13em] text-[#8F9AB8] uppercase">
                        {card.category}
                      </p>
                      <h3 className="text-body leading-[22px] font-semibold text-text-on-dark md:text-h4 md:leading-body md:font-extrabold">
                        {card.name}
                      </h3>
                      <p className="text-caption text-text-on-dark-muted md:text-body-s md:leading-[21px]">
                        {card.body}
                      </p>
                      <p className="pc-link platform-link mt-auto text-caption leading-4 font-bold text-viz-gold group-hover:underline">
                        Explore {card.name} <span aria-hidden>→</span>
                      </p>
                    </div>
                  </SiteLink>
                </Motion>
              ))}
            </ul>
          </PlatformSpotlight>
        </div>
      </div>
    </ScrollFlow>
  );
}

/**
 * The overview: the whole brand video (components/video-player.tsx) beside
 * what it covers. The hero's "See the Flash difference" scrolls here
 * (`OVERVIEW_ID`). Outside <PlatformSpotlight>, so the light stays on the
 * cards.
 */
function TourRow() {
  const { eyebrow, title, body, chips, highlight, link } = overview;
  return (
    <Motion
      id={OVERVIEW_ID}
      threshold={0.3}
      replay={false}
      className="motion platform-tour flex scroll-mt-6 flex-col gap-8 lg:flex-row lg:items-center lg:gap-12"
    >
      <div className="platform-tour-clip min-w-0 lg:w-[57%] lg:shrink-0">
        <VideoPlayer clip={overviewVideo} onDark sizes="(min-width: 1440px) 712px, (min-width: 1024px) 57vw, 100vw" />
      </div>
      <div className="platform-tour-text flex min-w-0 flex-col gap-4 lg:flex-1">
        <p className="text-[10px] leading-[14px] font-bold tracking-[0.13em] text-viz-gold uppercase md:text-[11px]">
          {eyebrow}
        </p>
        <h3 className="text-[24px] leading-[30px] font-extrabold tracking-[-0.03em] text-text-on-dark md:text-[32px] md:leading-[38px]">
          {title}
        </h3>
        <p className="text-caption text-pretty text-[#C9D1E3] md:text-[15px] md:leading-6">{body}</p>
        <ul className="flex flex-wrap gap-2 pt-1">
          {chips.map((chip) => (
            <li
              key={chip}
              className={`rounded-full border px-3 py-1 text-[11px] leading-4 font-semibold md:text-micro ${
                chip === highlight
                  ? "border-viz-gold/70 bg-viz-gold/10 text-viz-gold"
                  : "border-white/12 bg-white/4 text-[#C9D1E3]"
              }`}
            >
              {chip}
            </li>
          ))}
        </ul>
        <SiteLink
          href={link.href}
          className="pc-link pt-1 text-caption leading-4 font-bold text-viz-gold hover:underline"
        >
          {link.label} <span aria-hidden>→</span>
        </SiteLink>
      </div>
    </Motion>
  );
}

function FlashAgentBand() {
  const steps = [
    {
      label: "Prediction engine",
      body: "15+ products · 1×1 km · every 2 min",
      highlight: false,
    },
    {
      label: "Flash Agent",
      body: "Your sites, thresholds and data",
      highlight: true,
    },
    {
      label: "Your tools",
      body: "Calendar · Procore · Slack · ERP · CRM",
      highlight: false,
    },
  ];
  return (
    // The band fades up, then its steps rise left to right and each arrow
    // draws after its step: the Flash Agent harness's motion (.flow-*).
    <Motion threshold={0.2} replay={false} className="motion platform-agent">
      <div className="platform-band flex flex-col gap-8 rounded-[20px] border border-viz-gold/55 bg-viz-gold/6 px-5 py-8 sm:px-10 sm:py-9 lg:flex-row lg:items-center lg:gap-10">
        <div className="flex flex-col gap-3 lg:w-[500px] lg:shrink xl:shrink-0">
          <p className="text-[10px] leading-[14px] font-bold tracking-[0.13em] text-viz-gold uppercase md:text-[11px]">
            Agentic · the harness
          </p>
          <h3 className="text-body leading-[22px] font-semibold text-text-on-dark md:text-[28px] md:leading-[34px] md:font-extrabold md:tracking-[-0.03em]">
            Flash Agent
          </h3>
          <p className="text-caption text-[#C9D1E3] md:text-[15px] md:leading-6">
            Flash provides the harness: the prediction engine, your sites and your data, connected to the tools you
            already run. Ask in plain language; get an answer or an action.
          </p>
          <SiteLink
            href="/products/flash-agent/"
            className="pc-link text-caption leading-4 font-bold text-viz-gold hover:underline"
          >
            Explore Flash Agent <span aria-hidden>→</span>
          </SiteLink>
        </div>
        <ol className="platform-steps flex grow flex-col items-stretch gap-2 md:flex-row md:items-center md:gap-0">
          {steps.map((s, i) => (
            <li key={s.label} className="flow-step flex flex-col items-stretch md:flex-1 md:flex-row md:items-center">
              <div
                className={`flow-card flex grow flex-col gap-[6px] rounded-[12px] border px-5 py-[18px] ${
                  s.highlight ? "border-viz-gold/60 bg-viz-gold/10" : "border-white/12 bg-white/4"
                }`}
              >
                <p
                  className={`text-[10px] leading-3 font-bold tracking-[0.13em] uppercase ${
                    s.highlight ? "text-viz-gold" : "text-[#8F9AB8]"
                  }`}
                >
                  {s.label}
                </p>
                <p className="text-body-s leading-5 font-bold text-text-on-dark">{s.body}</p>
              </div>
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="flow-arrow self-center px-3 text-h4 leading-6 font-extrabold text-viz-gold max-md:rotate-90"
                >
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </Motion>
  );
}
