import Image from 'next/image';
import Link from 'next/link';

import { ButtonLink } from '@/components/button';
import { HeroBackground, HeroSection, HeroWords } from '@/components/hero/hero';
import { Motion } from '@/components/motion';
import { DEMO_HREF } from '@/content/navigation';
import { heroBaseline, heroImage, heroSurfaces } from '@/content/home';

import { AgentChat } from '@/components/agent-conversation/agent-chat';
import { AgentBadge, GoldBolt } from './bolt-icon';
import { HeroCounter } from './hero-counter';

/** The design's hero runs on a 56px gutter rather than the 96px page gutter. */
const HERO_GUTTER = 'mx-auto w-full max-w-page px-4 md:px-10 xl:px-14';

/**
 * The home hero, on the shared hero motion (components/hero/hero.tsx). Its
 * own additions, in styles/home.css: the three product cards and the 01—03
 * counter.
 */
export function Hero() {
  return (
    <HeroSection theme="dark" labelledBy="hero-heading" className="relative isolate overflow-hidden bg-brand-navy">
      <HeroBackground storm layer="-z-10">
        {/* LCP image: the only preloaded image on the page. It fades in
            from 10%, never 0, so it counts as painted at once. */}
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          fill
          preload
          sizes="100vw"
          quality={75}
          className="object-cover opacity-62"
        />
      </HeroBackground>
      <div aria-hidden className="home-hero-grade-left absolute inset-0 -z-10" />
      <div aria-hidden className="home-hero-grade-bottom absolute inset-0 -z-10" />

      <div
        className={`${HERO_GUTTER} flex flex-col gap-12 pt-14 pb-10 lg:flex-row lg:items-end lg:justify-between lg:pt-24`}
      >
        <div className="hero-copy flex max-w-[860px] flex-col gap-7">
          <p className="hero-eyebrow flex items-start gap-3 text-[11px] leading-4 font-bold tracking-[0.13em] text-viz-gold uppercase md:text-micro">
            <span aria-hidden className="hero-plus inline-block text-[18px] leading-[18px] font-extrabold md:text-[22px] md:leading-[22px]">
              +
            </span>
            <span className="pt-[3px]">The world&rsquo;s first AI that predicts lightning and hail before they strike</span>
          </p>

          <h1
            id="hero-heading"
            className="text-[46px] leading-[48px] font-extrabold tracking-[-0.05em] text-text-on-dark sm:text-[64px] sm:leading-[68px] lg:text-[84px] lg:leading-[90px] lg:tracking-[-0.065em] xl:text-[100px] xl:leading-[106px]"
          >
            <HeroWords text={['Make the call', 'before the weather does.']} gold="weather does." lineClass="lg:block" />
          </h1>

          <p className="hero-lede max-w-[520px] text-body leading-body text-pretty text-[#D1DBE8] md:text-[17px] md:leading-body-l">
            Know where and when lightning and hail are coming, down to the kilometer and the minute, up to an hour
            before.
          </p>

          <div className="hero-ctas flex flex-col gap-[14px] sm:flex-row sm:items-center">
            <ButtonLink href={DEMO_HREF} variant="gold" size="hero" icon="↗" className="hero-demo max-md:text-body-s">
              Book a demo
            </ButtonLink>
            <ButtonLink
              href="#flash-difference"
              variant="outline-dark"
              size="hero"
              icon="↓"
              className="hero-diff max-md:text-body-s"
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

      <div className={HERO_GUTTER}>
        <div className="flex flex-col gap-4 border-t border-white/13 pt-[22px] pb-[26px] md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap items-center gap-x-10 gap-y-3">
            {heroBaseline.map((item) => (
              <li key={item.label} className="text-[11px] leading-[14px] font-bold tracking-[0.11em] text-[#C9D1E3] uppercase">
                {item.href ? (
                  <Link href={item.href} className="hover:text-text-on-dark">
                    {item.label}
                  </Link>
                ) : (
                  item.label
                )}
              </li>
            ))}
          </ul>
          <a
            href="#numbers"
            className="flex items-center gap-3 text-[11px] leading-[14px] font-bold tracking-[0.11em] text-viz-gold uppercase"
          >
            A better view starts here
            <span aria-hidden className="text-caption font-extrabold">
              ↓
            </span>
          </a>
        </div>
      </div>
    </HeroSection>
  );
}

/** Radar hotspots on the Command Center map, as % of its 1600×900 frame. */
const hotspots = ['hero-hot-1', 'hero-hot-2', 'hero-hot-3', 'hero-hot-4', 'hero-hot-5'];

/** The four phone screens that scroll, cut from the 1920×1080 frame. */
const screens = ['lightning-probability', 'future-radar', 'current-radar', 'daily-forecast'] as const;

const answer = 'Not yet. 31 mph gusts until 11:20, above your 25 mph limit. Peachtree Yard is clear all day.';

/**
 * "One engine · every surface": the three product cards beside the H1. Each
 * image card carries a live layer laid out in the image's own frame
 * (`.hero-media`), so it stays on the map and the phones at every crop:
 * card 01 pulses its radar cells and counts up 99.6%, card 02 scrolls its
 * phone screens, card 03 plays the Flash Agent exchange.
 */
function HeroSurfaces() {
  const [commandCenter, mobileApp] = heroSurfaces;
  return (
    <HeroCounter className="hero-surfaces flex w-full flex-col gap-[14px] lg:w-[380px] lg:shrink xl:shrink-0">
      <div className="hero-surfaces-label flex items-center justify-between text-[11px] leading-[14px] font-bold tracking-[0.13em] text-[#8F9AB8] uppercase">
        <p>One engine · every surface</p>
        <p aria-hidden>
          <span data-hero-counter>01</span>—03
        </p>
      </div>

      <SurfaceCard card={commandCenter} index={0}>
        <Motion className="motion hero-count absolute inset-0" count="99.6%" replay={false}>
          <span aria-hidden className="hero-media hero-media-command-center">
            {hotspots.map((spot) => (
              <span key={spot} className={`hero-hot motion-loop ${spot}`} />
            ))}
            {/* Over the "99.6%" the image already carries: a clean plate and
                a live number that counts up, then fades back to the image. */}
            <span className="hero-plate">
              <span data-count className="hero-plate-number">
                99.6%
              </span>
            </span>
          </span>
        </Motion>
      </SurfaceCard>

      <SurfaceCard card={mobileApp} index={1}>
        <Motion className="motion absolute inset-0" replay={false}>
          <span aria-hidden className="hero-media hero-media-mobile-app">
            {screens.map((screen) => (
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
      </SurfaceCard>

      <AgentChat startDelay={500} className="hero-card hero-card-2 flex">
        <div
          data-chat-panel
          data-chat-hover
          data-hero-card
          className="chat flex w-full flex-col gap-3 rounded-lg border border-viz-gold/45 bg-brand-navy-deep/72 px-4 pt-4 pb-[18px]"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="chat-agent flex items-center gap-2">
              <AgentBadge className="size-6 rounded-[12px]" />
              <p className="text-[10px] leading-3 font-extrabold tracking-[0.13em] text-viz-gold uppercase">03 · Flash Agent</p>
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
          <div className="chat-actions flex flex-wrap items-center gap-2">
            <span className="bg-gold-button flex h-[26px] items-center rounded-xs px-[10px] text-[11px] leading-[14px] font-extrabold text-brand-navy">
              Reschedule in Procore
            </span>
            <span className="flex h-[26px] items-center rounded-xs border border-white/35 px-[10px] text-[11px] leading-[14px] font-extrabold text-text-on-dark">
              Notify on Slack
            </span>
          </div>
        </div>
      </AgentChat>

      {/* The Flash Agent launcher steps aside whenever it would cover this. */}
      <p data-launcher-clear className="hero-caption text-[11px] leading-micro text-[#8F9AB8]">
        Product imagery. Illustrative example, not live weather.
      </p>
    </HeroCounter>
  );
}

function SurfaceCard({
  card,
  index,
  children,
}: {
  card: (typeof heroSurfaces)[number];
  index: number;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={card.href}
      data-hero-card
      className={`hero-card hero-card-${index} group relative flex w-full shrink-0 overflow-hidden rounded-lg border border-white/12 ${card.height}`}
    >
      <Image
        src={card.image.src}
        alt={card.image.alt}
        fill
        sizes="(min-width: 1024px) 380px, 100vw"
        quality={90}
        className="object-cover object-[50%_12%] transition group-hover:scale-[1.02]"
      />
      {children}
      <span aria-hidden className="home-hero-card-grade absolute inset-0" />
      <span className="absolute top-[14px] left-[14px] flex h-6 items-center rounded-[12px] bg-brand-navy-deep/78 px-[10px] text-[10px] leading-3 font-extrabold tracking-[0.13em] text-viz-gold uppercase">
        {card.tag}
      </span>
      <span className="absolute bottom-3 left-[14px] flex flex-col gap-[2px] pr-4">
        <span className="text-body-s leading-caption font-extrabold text-text-on-dark">{card.title}</span>
        <span className="text-[11px] leading-[14px] text-text-on-dark-muted">{card.body}</span>
      </span>
    </Link>
  );
}
