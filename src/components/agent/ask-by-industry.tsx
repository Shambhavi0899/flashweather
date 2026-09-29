import Link from 'next/link';

import { AgentSection } from '@/components/home/agent-section';
import { DEMO_HREF } from '@/content/navigation';

import { AgentQuestions } from './agent-questions';

/**
 * "Ask the question your crew actually asks" on the Flash Agent page: the
 * home page's section itself (<AgentSection>, content/home.ts `agentTabs`),
 * so the harness cards, the five tabs and each tab's own conversation are
 * the same component and the same data on both pages.
 *
 * What this page adds sits under the chat: <AgentQuestions>, the open tab's
 * other questions as chips. A chip types its question into the open
 * conversation's composer, unsent, where the demo note below then shows; no
 * answer is made up for it.
 */
export function AskByIndustry() {
  return (
    <AgentSection
      seeAgentLink={false}
      askNote={
        <>
          <span>See this answered for your own sites in a live demo</span>
          <Link href={DEMO_HREF} className="font-bold text-viz-gold underline-offset-4 hover:underline">
            Book a demo <span aria-hidden>→</span>
          </Link>
        </>
      }
    >
      <AgentQuestions />
    </AgentSection>
  );
}
