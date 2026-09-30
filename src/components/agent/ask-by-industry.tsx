import { AgentSection } from '@/components/home/agent-section';

/**
 * "Ask the question your crew actually asks" on the Flash Agent page: the
 * home page's section itself (<AgentSection>, content/home.ts `agentTabs`),
 * so the harness cards, the five tabs, each tab's questions and its
 * conversation are the same component and the same data on both pages. Only
 * the "See Flash Agent" link is off, since this is the page it points at.
 */
export function AskByIndustry() {
  return <AgentSection seeAgentLink={false} />;
}
