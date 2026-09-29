import Link from 'next/link';

import { Motion } from '@/components/motion';
import { agentIndustries, type AgentIndustry } from '@/content/agent';
import { agentTabs } from '@/content/home';

import { BoltGlyph } from './bolt-glyph';

/**
 * The Flash Agent page's question list, under the chat panel in "Ask the
 * question your crew actually asks" (styles/agent-questions.css, agq-*).
 *
 * It follows the section's industry tabs (<AgentSection>): every industry's
 * set is in the server HTML, and CSS `:has()` on the tab radios shows the
 * open tab's set, crossfading from the last one. A question is a chip;
 * clicking it types the question into the open conversation's composer,
 * unsent, and shows the demo note there (<AgentChat> does both, from
 * `data-chat-ask`). No answer is made up for it.
 *
 * Each tab's conversation answers one question (content/home.ts `agentTabs`).
 * While that tab is open its chip reads "Playing above" and is not a control;
 * met under "See all industries" while another tab is open, it opens its tab,
 * which plays the answer (`data-chat-tab`).
 *
 * "See all industries" opens every industry's list, one industry at a time
 * (native <details name>); a question there opens its tab first.
 */

/** Matches the tab radios in home/agent-section.tsx. */
const tabId = (id: string) => `agent-tab-${id}`;

/** The tab whose conversation answers this question, if one does. */
const answeredBy = (question: string) => agentTabs.find((tab) => tab.question === question);

/** An industry's questions, the one its tab answers first. */
function questionsOf(industry: AgentIndustry) {
  const answered = agentTabs.find((tab) => tab.id === industry.id)?.question;
  return answered ? [answered, ...industry.questions.filter((q) => q !== answered)] : industry.questions;
}

/** A question sits under more than one industry, so the count is of distinct questions. */
const questionCount = new Set(agentIndustries.flatMap(questionsOf)).size;

function Chip({ question, industry }: { question: string; industry: AgentIndustry }) {
  const tab = answeredBy(question);
  if (tab) {
    // Both are in the HTML; CSS shows the first while the tab is open, the second otherwise.
    return (
      <li className={`agq-item agq-answered agq-answered-${tab.id}`}>
        <p className="agq-chip agq-playing">
          <span aria-hidden className="bg-gold-metallic agq-bolt bolt-shape" />
          <span className="agq-q">{question}</span>
          <span className="agq-tag">Playing above</span>
        </p>
        <button type="button" className="agq-chip agq-play" data-chat-tab={tabId(tab.id)}>
          <span aria-hidden className="bg-gold-metallic agq-bolt bolt-shape" />
          <span className="agq-q">{question}</span>
          <span className="agq-hint">
            Play answer <span aria-hidden>→</span>
          </span>
        </button>
      </li>
    );
  }
  return (
    <li className="agq-item">
      <button type="button" className="agq-chip" data-chat-ask={question} data-chat-ask-tab={tabId(industry.id)}>
        <BoltGlyph fill="#5F6B85" className="agq-bolt" />
        <span className="agq-q">{question}</span>
        <span aria-hidden className="agq-hint">
          Ask →
        </span>
      </button>
    </li>
  );
}

function Chips({ industry }: { industry: AgentIndustry }) {
  return (
    <ul className="agq-chips">
      {questionsOf(industry).map((q) => (
        <Chip key={q} question={q} industry={industry} />
      ))}
    </ul>
  );
}

export function AgentQuestions() {
  return (
    <div className="agq">
      <Motion className="motion agq-sets" replay={false} threshold={0.2}>
        <div className="agq-head">
          <div className="agq-stack">
            {agentIndustries.map((industry) => (
              <h3 key={industry.id} id={`agq-title-${industry.id}`} className={`agq-title agq-for-${industry.id}`}>
                More questions <span className="text-gold-metallic">{industry.label}</span> crews ask
              </h3>
            ))}
          </div>
          <p className="agq-count">
            {questionCount} questions across {agentIndustries.length} industries
          </p>
        </div>
        <div className="agq-stack">
          {agentIndustries.map((industry) => (
            <div
              key={industry.id}
              role="group"
              aria-labelledby={`agq-title-${industry.id}`}
              className={`agq-set agq-for-${industry.id}`}
            >
              <Chips industry={industry} />
            </div>
          ))}
        </div>
      </Motion>

      <details className="agq-all">
        <summary className="agq-toggle">
          <span className="agq-toggle-open">See all industries</span>
          <span className="agq-toggle-close">Hide all industries</span>
          <Chevron />
        </summary>
        <div className="agq-industries">
          {agentIndustries.map((industry) => (
            <details
              key={industry.id}
              name="agq-industry"
              className="agq-industry"
              open={industry.id === 'construction'}
            >
              <summary className="agq-industry-head">
                <span>{industry.label}</span>
                <span className="agq-badge">
                  <span className="sr-only">(</span>
                  {questionsOf(industry).length}
                  <span className="sr-only"> questions)</span>
                </span>
                <Chevron />
              </summary>
              <div className="agq-industry-body">
                <Chips industry={industry} />
                <Link href={industry.href} className="agq-page-link">
                  {industry.label} page<span aria-hidden>&nbsp;→</span>
                </Link>
              </div>
            </details>
          ))}
        </div>
      </details>
    </div>
  );
}

function Chevron() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="agq-chevron"
    >
      <path d="m4 6 4 4 4-4" />
    </svg>
  );
}
