import Image from 'next/image';

import { AgentChat } from '@/components/agent-conversation/agent-chat';
import { AgentConversation } from '@/components/agent-conversation/agent-conversation';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ButtonLink } from '@/components/button';
import { HeroBackground, HeroSection, HeroWords } from '@/components/hero/hero';
import { AgentChart } from '@/components/home/agent-charts';
import { agentTabs } from '@/content/home';
import { DEMO_HREF } from '@/content/navigation';

import { CarriedQuestion } from './carried-question';

/**
 * The hero's visual is the home page's Construction conversation, in the
 * shared <AgentConversation> and played by the same <AgentChat>: no tabs, one
 * panel, sized by the column it sits in. It starts once the panel has slid in
 * (styles/hero.css `--hero-visual-at` plus the slide). A question carried
 * here as ?q= shows in its ask bar once the answer has played.
 */
const example = agentTabs.find((tab) => tab.id === 'construction')!;
const PLACEHOLDER = 'Ask about any site, any layer, any day…';

export function AgentHero() {
  return (
    <HeroSection theme="dark" className="relative overflow-hidden bg-brand-navy">
      <HeroBackground>
        <Image
          src="/images/agent/flash-agent-control-room-desk-single-screen-navy.jpg"
          alt="A calm control-room desk with a single glowing screen in deep navy with one gold highlight, the hero photograph of the Flash Agent page"
          fill
          preload
          sizes="100vw"
          className="object-cover opacity-55"
        />
      </HeroBackground>
      <div aria-hidden className="agent-hero-grade absolute inset-0" />

      <div className="container-page relative flex flex-col gap-10 pt-10 pb-16 lg:pb-[112px]">
        <Breadcrumbs
          tone="dark"
          className="hero-crumbs"
          trail={[
            { name: 'Home', path: '/' },
            { name: 'Platform', path: '/products/' },
            { name: 'Flash Agent', path: '/products/flash-agent/' },
          ]}
        />

        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-14">
          <div className="hero-copy flex flex-col gap-7 lg:w-[640px] lg:shrink xl:shrink-0">
            <p className="hero-eyebrow text-micro font-semibold tracking-label text-viz-gold uppercase">
              Flash Agent · Agentic weather intelligence
            </p>
            <h1 className="text-[40px] leading-[44px] font-extrabold tracking-[-0.05em] text-text-on-dark md:text-[52px] md:leading-[56px] xl:text-[64px] xl:leading-[68px]">
              <HeroWords text="Ask Flash. It answers from the forecast and acts in your tools." />
            </h1>
            <p className="hero-lede text-[17px] leading-[28px] text-pretty text-[#C9D1E3] md:text-[19px] md:leading-body-l">
              Flash provides the harness — the prediction engine, your sites and your data — and connects to the tools
              you already run. Ask in plain language; get an answer or an action.
            </p>
            <div className="hero-ctas flex flex-col gap-[14px] pt-1 sm:flex-row">
              <ButtonLink href={DEMO_HREF} variant="gold" className="rounded-full px-[30px]">
                Book a demo
              </ButtonLink>
              <ButtonLink href="#integrations" variant="outline-dark" className="rounded-full px-[30px]">
                See integrations
              </ButtonLink>
            </div>
            <p className="hero-support text-caption leading-5 text-[#8F9AB8]">
              Included in Portfolio and Enterprise plans · Google Calendar · Microsoft 365 · Salesforce · HubSpot ·
              NetSuite · SAP · Procore · Slack · Teams · Golf Genius
            </p>
          </div>

          <div className="hero-visual hero-visual-side flex min-w-0 grow flex-col gap-3 lg:min-w-[440px] lg:basis-0">
            <AgentChat startDelay={1300} className="flex">
              <AgentConversation
                question={example.question}
                reply={example.answer}
                chart={<AgentChart chart={example.answer.chart} />}
                label={`${example.label}: Flash Agent answers "${example.question}"`}
                placeholder={<CarriedQuestion placeholder={PLACEHOLDER} />}
                className="flex w-full"
              />
            </AgentChat>
            <p className="text-[10px] leading-[14px] font-bold tracking-[0.13em] text-[#8F9AB8] uppercase md:text-[11px] lg:text-right">
              Illustrative example · not live weather
            </p>
          </div>
        </div>
      </div>
    </HeroSection>
  );
}
