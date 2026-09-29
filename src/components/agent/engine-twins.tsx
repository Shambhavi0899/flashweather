import { Motion } from '@/components/motion';
import { MethodBadge } from '@/components/products/api/code-block';

import { AgentAvatar, BoltGlyph } from './bolt-glyph';

/**
 * "Is it the same engine as the API?" as a picture: one Flash engine node
 * forking into the two ways it answers — Flash Agent's sentence and the
 * Flash API's JSON — for the same cell from the same run. The values that
 * match carry `data-twin` and light gold together; hovering one lights its
 * twin (styles/agent-engine.css, sen-*).
 *
 * The values are illustrative, and the caption says so. They follow the API
 * page's samples: cell 3391 is the "Practice Field B" cell of its webhook.
 */

const VALUES = { risk: '78%', riskApi: '0.78', time: '14:32', cell: '3391', run: '14:30' };

function Twin({ id, children }: { id: 'risk' | 'time' | 'cell' | 'run'; children: React.ReactNode }) {
  return (
    <span data-twin={id} className="sen-v">
      {children}
    </span>
  );
}

export function EngineTwins() {
  return (
    <Motion replay={false} className="motion sen">
      <figure className="flex flex-col">
        <div className="sen-engine">
          <span className="sen-core bg-gold-metallic">
            <span aria-hidden className="sen-ping" />
            <BoltGlyph width={13} height={17} />
          </span>
          <span className="flex flex-col">
            <span className="text-body-s leading-5 font-bold text-text">Flash engine</span>
            <span className="text-micro leading-micro text-text-muted">1×1 km cells · 2-minute runs</span>
          </span>
        </div>

        <div aria-hidden className="sen-fork">
          <span className="sen-stem" />
          <span className="sen-bar" />
          <span className="sen-drop sen-drop-l" />
          <span className="sen-drop sen-drop-r" />
        </div>

        <div className="sen-panels">
          <div className="sen-panel sen-agent">
            <p className="sen-head text-caption leading-caption font-bold text-text">
              <AgentAvatar />
              Flash Agent
            </p>
            <div className="flex flex-col gap-2.5 px-3.5 pt-3.5 pb-4">
              <p className="self-end rounded-[12px] rounded-br-[4px] bg-brand-navy px-3 py-2 text-caption leading-caption text-text-on-dark">
                Is Field B clear for practice this afternoon?
              </p>
              <p className="rounded-[12px] rounded-bl-[4px] border border-border bg-neutral-0 px-3 py-2.5 text-body-s leading-[22px] text-text">
                <Twin id="risk">{VALUES.risk}</Twin> lightning risk at Field B around{' '}
                <Twin id="time">{VALUES.time}</Twin>.
              </p>
              <p className="text-micro leading-micro text-text-muted">
                Cell <Twin id="cell">{VALUES.cell}</Twin> · model run <Twin id="run">{VALUES.run}</Twin>
              </p>
            </div>
          </div>

          <div className="sen-panel sen-api">
            <p className="sen-head min-w-0">
              <MethodBadge method="GET" tone="green" />
              <code className="min-w-0 truncate font-mono text-micro leading-micro text-[#DCE2F0]">
                /v1/cells/{VALUES.cell}/now
              </code>
            </p>
            <pre className="sen-pre">
              <code>
                {'{\n  "cell_id": "'}
                <Twin id="cell">{VALUES.cell}</Twin>
                {'",\n  "lightning_risk_60m": '}
                <Twin id="risk">{VALUES.riskApi}</Twin>
                {',\n  "first_strike_at": "'}
                <Twin id="time">{VALUES.time}</Twin>
                {'",\n  "run": "'}
                <Twin id="run">{VALUES.run}</Twin>
                {'"\n}'}
              </code>
            </pre>
          </div>
        </div>

        <figcaption className="pt-3 text-micro leading-micro text-text-muted">
          Illustrative values: one cell, one model run, two ways to read it.
        </figcaption>
      </figure>
    </Motion>
  );
}
