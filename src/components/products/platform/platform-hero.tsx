import Image from 'next/image';

import { BOLT_PATH } from '@/components/bolt-path';
import { ButtonLink } from '@/components/button';
import { HeroBackground, HeroSection, HeroWords } from '@/components/hero/hero';
import { Motion } from '@/components/motion';
import { Tilt } from '@/components/tilt';
import { DEMO_HREF } from '@/content/navigation';

import { SectionLabel } from '../section-header';

/**
 * The render's three layers, bottom to top: the order they assemble in. The
 * motion (styles/products.css) and the legend both key off `data-layer`.
 */
type Layer = 'predictions' | 'delivery' | 'intelligence';

/** The delivery chips, positioned as in the design's 640×572 frame. */
const chips = [
  { text: 'Command Center', position: 'products-platform-label-command-center' },
  { text: 'Mobile app', position: 'products-platform-label-mobile-app' },
  { text: 'Edge Model', position: 'products-platform-label-edge-model' },
  { text: 'API · webhooks', position: 'products-platform-label-api' },
];

const legend: { layer: Layer; label: string; swatch: string }[] = [
  { layer: 'intelligence', label: 'Intelligence · Flash Agent', swatch: 'bg-neutral-50 border border-neutral-300' },
  { layer: 'delivery', label: 'Delivery · every channel', swatch: 'bg-neutral-800 border border-white/45' },
  { layer: 'predictions', label: 'Predictions · 15+ products on a 1 km grid', swatch: 'bg-viz-gold' },
];

const label =
  'absolute flex h-7 items-center rounded-sm border border-border bg-neutral-0 px-3 text-[10px] font-semibold whitespace-nowrap text-brand-navy md:text-micro';

/**
 * The platform hero, on the shared hero motion. Its visual's own intro is
 * the three-layer assembly (styles/products.css), which starts as the render
 * comes in.
 */
export function PlatformHero() {
  return (
    <HeroSection theme="dark" labelledBy="platform-hero-heading" className="relative isolate overflow-hidden bg-brand-navy">
      <HeroBackground storm layer="-z-20">
        <Image
          src="/images/products/flash-storm-cell-open-ground-platform-hero.png"
          alt="A towering storm cell with rain shafts over wide open ground at dusk, graded navy behind the Flash platform headline"
          fill
          preload
          sizes="100vw"
          className="object-cover"
        />
      </HeroBackground>
      <div aria-hidden className="products-platform-hero-grade absolute inset-0 -z-10" />

      <div className="container-page flex flex-col gap-12 pt-16 pb-16 lg:flex-row lg:items-center lg:pt-[104px] lg:pb-24">
        <div className="hero-copy flex flex-col gap-7 lg:w-[560px] lg:shrink xl:shrink-0">
          <SectionLabel tone="dark" className="hero-eyebrow">
            The platform · 15+ prediction products · over 100 parameters · Flash Agent
          </SectionLabel>
          <h1
            id="platform-hero-heading"
            className="text-[44px] leading-[48px] font-extrabold tracking-[-0.05em] text-text-on-dark md:text-display-l md:leading-display-l xl:text-display-xl xl:leading-display-xl"
          >
            <HeroWords text="The Flash platform: predictions, delivery, intelligence." />
          </h1>
          <p className="hero-lede max-w-[540px] text-[17px] leading-h4 text-pretty text-neutral-300 md:text-[19px] md:leading-body-l">
            One engine forecasts lightning, hail, heat and WBGT, wind, rain and frost on a 1 km grid, refreshed every
            2 minutes. Every channel puts the call where your people already look. Flash Agent answers in plain
            language and acts in the tools you already run.
          </p>
          <div className="hero-ctas flex flex-col gap-3.5 pt-1 sm:flex-row sm:items-center">
            <ButtonLink href={DEMO_HREF} className="px-[30px] tracking-normal">
              Book a demo
            </ButtonLink>
            <ButtonLink href="/pricing/" variant="outline-dark" className="bg-white/6 px-[30px] tracking-normal">
              See pricing
            </ButtonLink>
          </div>
          <p className="hero-support text-caption leading-5 text-neutral-500">
            Software only, no sensors to install · Trusted by Troon, Big 12, Syngenta and NAIA
          </p>
        </div>

        {/* One motion block for the render and its legend: the legend lights
            up with the layers, and hovering either one picks out a layer. */}
        <Motion className="motion plat hero-visual hero-visual-side flex min-w-0 grow basis-0 flex-col gap-3" replay={false}>
          <PlatformRender />
          <ul className="flex flex-col gap-2 px-2 sm:flex-row sm:flex-wrap sm:gap-x-5">
            {legend.map((item) => (
              <li
                key={item.layer}
                data-layer={item.layer}
                className="plat-legend flex items-center gap-2 text-caption text-text-on-dark-muted"
              >
                <span aria-hidden className={`plat-swatch size-2.5 shrink-0 rounded-[2px] ${item.swatch}`} />
                {item.label}
              </li>
            ))}
          </ul>
        </Motion>
      </div>
    </HeroSection>
  );
}

/** One layer's share of the 640×572 frame; the three stack exactly. */
function Plane({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 640 572" className="absolute inset-0 size-full overflow-visible" aria-hidden>
      {children}
    </svg>
  );
}

/**
 * The isometric three-layer render, drawn in SVG as the design draws it,
 * with its labels as real text. Each layer is its own plane, with its labels
 * on it, so a layer drops in, floats and dims as one piece. Hidden below
 * 480px, where the labels would collide; the legend beneath it carries the
 * same three layers.
 */
function PlatformRender() {
  return (
    <figure
      role="img"
      aria-label="Isometric render of the Flash platform as three stacked layers: a 1 km prediction grid with a gold lightning cell beside Practice Field B, the delivery layer of Command Center, mobile app, Edge Model and API, and Flash Agent on top"
      className="plat-stage relative mx-auto hidden aspect-[640/572] w-full max-w-[640px] sm:block"
    >
      <Tilt className="plat-tilt absolute inset-0">
        <Plane>
          <ellipse cx="320" cy="558" rx="262" ry="16" fill="#0B1322" opacity="0.1" />
        </Plane>

        <div data-layer="predictions" className="plat-layer absolute inset-0">
          <div className="plat-plane motion-loop absolute inset-0">
            <Plane>
              <path d="M320 296 L580 426 L320 556 L60 426 Z" fill="#02050F" stroke="#02050F" strokeWidth="10" strokeLinejoin="round" />
              <path d="M320 280 L580 410 L320 540 L60 410 Z" fill="#1C2340" stroke="#1C2340" strokeWidth="10" strokeLinejoin="round" />
              <path className="plat-hit" d="M320 280 L580 410 L320 540 L60 410 Z" fill="#040818" stroke="#040818" strokeWidth="8" strokeLinejoin="round" />
              <g stroke="#1C2340">
                <line x1="92.5" y1="426.25" x2="352.5" y2="296.25" />
                <line x1="125" y1="442.5" x2="385" y2="312.5" />
                <line x1="157.5" y1="458.75" x2="417.5" y2="328.75" />
                <line x1="190" y1="475" x2="450" y2="345" />
                <line x1="222.5" y1="491.25" x2="482.5" y2="361.25" />
                <line x1="255" y1="507.5" x2="515" y2="377.5" />
                <line x1="287.5" y1="523.75" x2="547.5" y2="393.75" />
                <line x1="92.5" y1="393.75" x2="352.5" y2="523.75" />
                <line x1="125" y1="377.5" x2="385" y2="507.5" />
                <line x1="157.5" y1="361.25" x2="417.5" y2="491.25" />
                <line x1="190" y1="345" x2="450" y2="475" />
                <line x1="222.5" y1="328.75" x2="482.5" y2="458.75" />
                <line x1="255" y1="312.5" x2="515" y2="442.5" />
                <line x1="287.5" y1="296.25" x2="547.5" y2="426.25" />
              </g>
              <polygon points="125,442.5 157.5,426.25 190,442.5 157.5,458.75" fill="#E6BA2D" opacity="0.25" />
              <polygon points="190,442.5 222.5,426.25 255,442.5 222.5,458.75" fill="#E6BA2D" opacity="0.3" />
              <polygon points="190,410 222.5,393.75 255,410 222.5,426.25" fill="#E6BA2D" opacity="0.55" />
              <polygon className="plat-cell motion-loop" points="157.5,426.25 190,410 222.5,426.25 190,442.5" fill="#E6BA2D" />
              <ellipse cx="190" cy="426" rx="50" ry="25" fill="none" stroke="#E6BA2D" strokeWidth="1.5" strokeDasharray="4 5" />
              <path
                className="plat-storm motion-loop"
                pathLength="1"
                d="M90 400 C 160 470, 250 470, 330 490 S 470 460, 545 405"
                fill="none"
                stroke="#0B63CE"
                strokeWidth="2"
              />
              <circle className="plat-ping motion-loop" cx="420" cy="470" r="11" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle cx="420" cy="470" r="11" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle cx="420" cy="470" r="5" fill="#FFFFFF" />
            </Plane>
            <span className={`plat-tag ${label} products-platform-label-practice-field`}>Practice Field B</span>
          </div>
        </div>

        <div data-layer="delivery" className="plat-layer absolute inset-0">
          <div className="plat-plane absolute inset-0">
            <Plane>
              <path d="M320 166 L580 296 L320 426 L60 296 Z" fill="#060B18" stroke="#060B18" strokeWidth="10" strokeLinejoin="round" />
              <path d="M320 150 L580 280 L320 410 L60 280 Z" fill="#26304D" stroke="#26304D" strokeWidth="10" strokeLinejoin="round" />
              <path className="plat-hit" d="M320 150 L580 280 L320 410 L60 280 Z" fill="#0B1322" stroke="#0B1322" strokeWidth="8" strokeLinejoin="round" />
            </Plane>
            {chips.map((chip) => (
              <span key={chip.text} className={`plat-chip motion-loop ${label} ${chip.position}`}>
                {chip.text}
              </span>
            ))}
          </div>
        </div>

        <div data-layer="intelligence" className="plat-layer absolute inset-0">
          <div className="plat-plane motion-loop absolute inset-0">
            <Plane>
              <path d="M320 36 L580 166 L320 296 L60 166 Z" fill="#D5DBE6" stroke="#D5DBE6" strokeWidth="10" strokeLinejoin="round" />
              <path d="M320 20 L580 150 L320 280 L60 150 Z" fill="#CBD2DE" stroke="#CBD2DE" strokeWidth="10" strokeLinejoin="round" />
              <path className="plat-hit" d="M320 20 L580 150 L320 280 L60 150 Z" fill="#F7F9FC" stroke="#F7F9FC" strokeWidth="8" strokeLinejoin="round" />
              {/* The site's bolt glyph, at 1.4x: 36.4 × 47.6, centred on the plate. */}
              <path className="plat-bolt motion-loop" d={BOLT_PATH} transform="translate(302 112) scale(1.4)" fill="#E6BA2D" />
            </Plane>
            <span className="plat-tag products-platform-label-agent absolute flex h-[30px] items-center rounded-full bg-brand-navy px-3.5 text-[10px] font-semibold whitespace-nowrap text-text-on-dark md:text-micro">
              Flash Agent · intelligence
            </span>
          </div>
        </div>

        {/* Data flow: from the gold cell, through a delivery chip, into the bolt. */}
        <Plane>
          <circle className="plat-pulse plat-pulse-a motion-loop" r="3.5" fill="#F0DE7E" />
          <circle className="plat-pulse plat-pulse-b motion-loop" r="3.5" fill="#F0DE7E" />
        </Plane>
      </Tilt>
    </figure>
  );
}
