import Image from 'next/image';
import Link from 'next/link';

import { ButtonLink } from '@/components/button';
import { HeroBackground, HeroSection, HeroWords } from '@/components/hero/hero';
import { Motion } from '@/components/motion';
import { DEMO_HREF } from '@/content/navigation';
import { type HeroSurface, heroImage, heroSurfaces, heroVideoHref } from '@/content/home';

import { AgentChat } from '@/components/agent-conversation/agent-chat';
import { AgentBadge, GoldBolt } from './bolt-icon';
import { HeroDeck } from './hero-deck';
import { HeroLede } from './hero-lede';
import { HeroLightning } from './hero-lightning';

/** The design's hero runs on a 56px gutter rather than the 96px page gutter. */
const HERO_GUTTER = 'mx-auto w-full max-w-page px-4 md:px-10 xl:px-14';

/**
 * The home hero, on the shared hero motion (components/hero/hero.tsx). Its
 * own additions: the product deck and its tabs (styles/home-hero-deck.css),
 * and in place of the shared storm flash, lightning that strikes in the sky
 * between the copy and the deck (<HeroLightning>).
 */
export function Hero() {
  return (
    <HeroSection
      theme="dark"
      labelledBy="hero-heading"
      className="relative isolate flex min-h-svh flex-col justify-center overflow-hidden bg-brand-navy"
    >
      <HeroBackground layer="-z-10">
        {/* LCP image: the only preloaded image on the page. It fades in
            from 10%, never 0, so it counts as painted at once. */}
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          fill
          preload
          sizes="100vw"
          quality={75}
          className="object-cover opacity-70"
        />
      </HeroBackground>
      <HeroLightning>
        <div aria-hidden className="home-hero-grade-left absolute inset-0 -z-10" />
        <div aria-hidden className="home-hero-grade-bottom absolute inset-0 -z-10" />
      </HeroLightning>

      <div
        className={`${HERO_GUTTER} flex flex-col gap-12 pt-14 pb-10 lg:flex-row lg:items-end lg:justify-between lg:pt-24 lg:pb-14`}
      >
        <div className="hero-copy flex max-w-[860px] flex-col gap-7">
          <h1
            id="hero-heading"
            className="text-[46px] leading-[48px] font-extrabold tracking-[-0.05em] text-text-on-dark sm:text-[64px] sm:leading-[68px] lg:text-[84px] lg:leading-[90px] lg:tracking-[-0.065em] xl:text-[100px] xl:leading-[106px]"
          >
            <HeroWords text={['Make the call', 'before the weather does.']} gold="weather does." lineClass="lg:block" />
          </h1>

          <HeroLede className="hero-lede max-w-[520px] text-body leading-body font-medium text-pretty text-[#D1DBE8] md:text-[17px] md:leading-body-l">
            The world&rsquo;s first AI that predicts <LedeLink href="/products/lightning-prediction/">lightning</LedeLink>{' '}
            and <LedeLink href="/products/hail-prediction/">hail</LedeLink> before they strike, down to the kilometer and
            the minute, up to an hour&nbsp;ahead.
          </HeroLede>

          <div className="hero-ctas flex flex-col gap-[14px] sm:flex-row sm:items-center">
            <ButtonLink href={DEMO_HREF} variant="gold" size="hero" icon="↗" className="hero-demo max-md:text-body-s">
              Book a demo
            </ButtonLink>
            <ButtonLink
              href={heroVideoHref}
              newTab
              variant="outline-dark"
              size="hero"
              icon="↗"
              className="max-md:text-body-s"
            >
              See the Flash difference
            </ButtonLink>
          </div>

          <div className="hero-support mt-[6px] flex items-start gap-3">
            <GoldBolt className="hero-bolt h-6 w-[18px]" />
            <p className="flex flex-col gap-[2px] text-caption leading-[19px] md:leading-5">
              <span className="font-bold text-text-on-dark">For golf, construction, sports, schools,</span>
              <span className="text-text-on-dark-muted">and every kind of outdoor operation.</span>
            </p>
          </div>
        </div>

        <HeroSurfaces />
      </div>
    </HeroSection>
  );
}

/**
 * A product word in the hero's paragraph, linked to its page, over a gold
 * underline that draws in (`.hero-lede-link`, styles/home.css; <HeroLede>).
 */
function LedeLink({ href, children }: { href: string; children: string }) {
  return (
    <Link href={href} className="hero-lede-link font-semibold text-text-on-dark">
      {children}
    </Link>
  );
}

/** Radar hotspots on the Command Center map, as % of the map (styles/home-hero-deck.css). */
const hotspots = ['hero-hot-1', 'hero-hot-2', 'hero-hot-3', 'hero-hot-4', 'hero-hot-5'];

/** The three phone screens that scroll, each in its own phone. */
const screens = ['lightning-probability', 'future-radar', 'current-radar'] as const;

const answer = 'Not yet. 31 mph gusts until 11:20, above your 25 mph limit. Peachtree Yard is clear all day.';
/** The answer's words already there as the Flash Agent card comes forward: its first sentence. */
const LEAD_WORDS = 12;

/**
 * "One engine · every surface": the three products as a stacked deck beside
 * the H1, one card open at a time, with a tab each under it (<HeroDeck>).
 * Every card is a visual, then its label, title, one line and a link to the
 * product's page; nothing is lettered over a screenshot. The visuals are
 * live: card 01 pulses its radar cells, card 02 scrolls its phone screens,
 * card 03 opens on the Flash Agent's question, badge and first sentence and
 * plays the rest as it comes forward.
 */
function HeroSurfaces() {
  return (
    <HeroDeck className="hero-surfaces hero-deck relative flex w-full max-w-[460px] flex-col lg:w-[380px] lg:max-w-none lg:shrink xl:shrink-0">
      <p className="hero-surfaces-label text-[11px] leading-[14px] font-bold tracking-[0.13em] text-[#EEF1F7] uppercase">
        One engine · every surface
      </p>

      <div data-deck-stage className="hero-deck-stage">
        {heroSurfaces.map((card, i) => (
          <div
            key={card.id}
            id={`hero-deck-panel-${card.id}`}
            role="tabpanel"
            aria-labelledby={`hero-deck-tab-${card.id}`}
            data-deck-card
            data-depth={i}
            className={`hero-deck-card hero-deck-card-${i}`}
          >
            {/* The card's name on its edge while it is behind; the label below says it to everyone. */}
            <p aria-hidden className="hero-deck-peek">
              {card.name}
            </p>
            <div data-deck-body inert={i > 0} className="hero-deck-body">
              <SurfaceVisual card={card} />
              <div className="flex flex-col items-start px-1 pt-[14px]">
                <p className="text-[10px] leading-3 font-extrabold tracking-[0.13em] text-viz-gold uppercase">{card.name}</p>
                <p className="mt-[6px] text-[15px] leading-5 font-extrabold text-text-on-dark">{card.title}</p>
                <p className="mt-[2px] text-micro leading-micro text-text-on-dark-muted">{card.body}</p>
                <Link
                  href={card.href}
                  className="hero-deck-explore mt-2 flex h-6 items-center gap-[6px] text-micro leading-micro font-extrabold text-viz-gold underline-offset-4 hover:underline"
                >
                  Explore<span className="sr-only"> {card.name}</span> <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div role="tablist" aria-label="Flash products" className="hero-deck-tabs">
        {heroSurfaces.map((card, i) => (
          <button
            key={card.id}
            type="button"
            role="tab"
            id={`hero-deck-tab-${card.id}`}
            aria-selected={i === 0}
            aria-controls={`hero-deck-panel-${card.id}`}
            tabIndex={i === 0 ? 0 : -1}
            data-deck-tab={card.id}
            className="hero-deck-tab"
          >
            <span aria-hidden className="hero-deck-track">
              <span data-deck-fill className="hero-deck-fill" />
            </span>
            <span className="hero-deck-tab-name">
              <span aria-hidden className="hero-deck-dot" />
              {card.tab}
            </span>
          </button>
        ))}
      </div>

      {/* The Flash Agent launcher steps aside whenever it would cover this. */}
      <p data-launcher-clear className="hero-caption mt-2 text-[11px] leading-micro text-[#EEF1F7]">
        Product imagery. Illustrative example, not live weather.
      </p>
    </HeroDeck>
  );
}

/** A card's visual: its screenshot with the facts as chips under it, or the Flash Agent chat. */
function SurfaceVisual({ card }: { card: HeroSurface }) {
  if (!card.image) return <AgentVisual />;
  return (
    <div className="hero-deck-visual">
      <div className="hero-deck-shot">
        <Image
          src={card.image.src}
          alt={card.image.alt}
          fill
          sizes="(min-width: 1024px) 336px, (min-width: 500px) 440px, 92vw"
          quality={90}
          className="object-cover"
        />
        <Motion className="motion absolute inset-0" replay={false}>
          <span aria-hidden>
            {card.id === 'command-center'
              ? hotspots.map((spot) => <span key={spot} className={`hero-hot motion-loop ${spot}`} />)
              : screens.map((screen) => (
                  <span key={screen} className={`hero-screen hero-screen-${screen}`}>
                    {/* The screen, its mirror, the screen: one loop with no seam. */}
                    <span className="hero-screen-strip motion-loop">
                      <span />
                      <span className="hero-screen-mirror" />
                      <span />
                    </span>
                  </span>
                ))}
          </span>
        </Motion>
      </div>
      {card.chips && (
        <ul className="hero-deck-chips">
          {card.chips.map((chip) => (
            <li key={chip}>{chip}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Card 03's visual: the Flash Agent exchange, on the shared chat styling. The deck plays it. */
function AgentVisual() {
  return (
    <AgentChat autoPlay={false} className="hero-deck-visual hero-deck-chat">
      <div
        data-chat-panel
        data-chat-hover
        data-chat-untyped
        data-chat-lead={LEAD_WORDS}
        className="chat flex w-full flex-1 flex-col gap-3 rounded-[10px] border border-white/10 bg-brand-navy-deep/72 px-[14px] pt-[14px] pb-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="chat-agent flex items-center gap-2">
            <AgentBadge className="size-6 rounded-[12px]" />
            <p className="text-[11px] leading-[14px] font-extrabold text-text-on-dark">Flash Agent</p>
          </div>
          <p className="chat-badge flex h-[22px] items-center rounded-[11px] bg-alert-warning px-[9px] text-[10px] leading-3 font-extrabold tracking-[0.06em] text-text-on-dark uppercase">
            No-go until 11:20
          </p>
        </div>
        <p className="chat-bubble text-caption leading-[19px] font-bold text-text-on-dark">
          &ldquo;Are gusts low enough to run the crane this morning?&rdquo;
        </p>
        <div className="relative">
          {/* Shown only while the agent "thinks"; sits over the answer's first line. */}
          <span aria-hidden className="chat-dots absolute top-0 left-0 flex h-[19px] items-center gap-[5px]">
            <span className="size-[6px] rounded-full bg-[#8F9AB8]" />
            <span className="size-[6px] rounded-full bg-[#8F9AB8]" />
            <span className="size-[6px] rounded-full bg-[#8F9AB8]" />
          </span>
          <p className="text-micro leading-caption text-[#C9D1E3]">
            {answer.split(' ').map((w, i) => (
              <span key={i}>
                <span className="chat-word">{w}</span>{' '}
              </span>
            ))}
          </p>
        </div>
        {/* Illustrations of the actions the agent proposes, not controls. */}
        <div className="chat-actions mt-auto flex flex-wrap items-center gap-2">
          <span className="bg-gold-button flex h-[26px] items-center rounded-xs px-[10px] text-[11px] leading-[14px] font-extrabold text-brand-navy">
            Reschedule in Procore
          </span>
          <span className="flex h-[26px] items-center rounded-xs border border-white/35 px-[10px] text-[11px] leading-[14px] font-extrabold text-text-on-dark">
            Notify on Slack
          </span>
        </div>
      </div>
    </AgentChat>
  );
}
