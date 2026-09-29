import { AgentHero } from '@/components/agent/agent-hero';
import {
  AgentFaq,
  GuardrailsSection,
  HarnessSection,
  IntegrationsSection,
  SameEngineSection,
} from '@/components/agent/agent-sections';
import { AskByIndustry } from '@/components/agent/ask-by-industry';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { agentFaqs } from '@/content/agent';
import { JsonLd, faqSchema, softwareApplicationSchema } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';

const PATH = '/products/flash-agent/';
const DESCRIPTION =
  'Agentic weather AI: ask about lightning, hail or wind in plain words. Flash answers from 1km cells refreshed every 2 minutes, then acts in Procore or Slack.';

export const metadata = buildMetadata({
  title: 'Agentic weather AI: Flash Agent',
  description: DESCRIPTION,
  path: PATH,
});

export default function FlashAgentPage() {
  return (
    <>
      <SiteHeader tone="dark" />
      <main id="main">
        <JsonLd
          schema={softwareApplicationSchema({
            name: 'Flash Agent',
            description: DESCRIPTION,
            path: PATH,
            category: 'BusinessApplication',
            operatingSystem: 'Web',
          })}
        />
        <JsonLd schema={faqSchema(agentFaqs)} />

        {/* The hero renders the visible breadcrumb and its BreadcrumbList. */}
        <AgentHero />
        <AskByIndustry />
        <HarnessSection />
        <IntegrationsSection />
        <GuardrailsSection />
        <SameEngineSection />
        <AgentFaq />
      </main>
      <SiteFooter />
    </>
  );
}
