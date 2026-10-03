import { AgentSection } from '@/components/home/agent-section';

/**
 * "Ask the question your crew actually asks" on the Flash Agent page: the
 * home page's section itself (<AgentSection>, content/home.ts `agentTabs`),
 * so the harness cards, the five tabs, each tab's questions and its
 * conversation are the same component and the same data on both pages.
 */
export function AskByIndustry() {
  return <AgentSection />;
}
