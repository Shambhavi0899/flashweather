'use client';

import { useEffect, useId, useRef, useState } from 'react';

import { Motion } from '@/components/motion';
import { agentIntegrationPermissions, agentIntegrations, type IntegrationPermission } from '@/content/agent';

/**
 * The connectors in "Which tools does Flash Agent work in?", each with a
 * "Connected" switch. Opening a tool (click, tap, Enter or Space on its name)
 * shows what it may do on one site; Escape or a click elsewhere closes it and
 * one is open at a time. Rows fade up and their switches flip on as they
 * scroll in (styles/agent-integrations.css, agi-*); reduced motion and no
 * JavaScript show every switch on.
 */
export function AgentIntegrations() {
  const [open, setOpen] = useState<string | null>(null);
  const list = useRef<HTMLUListElement>(null);
  const id = useId();

  // While one is open: Escape closes it and hands focus back to its name; a
  // press outside the item closes it.
  useEffect(() => {
    if (!open) return;
    const item = list.current?.querySelector<HTMLElement>(`[data-tool="${CSS.escape(open)}"]`);
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(null);
      item?.querySelector<HTMLButtonElement>('.agi-name')?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      if (!item?.contains(event.target as Node)) setOpen(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  // Row by row: the items <Motion> starts together are numbered by their
  // visual row (items sharing an offsetTop share a row), counted from the
  // first row in that batch. The queue's own order is no use here, since
  // other blocks entering in the same frame (the counter) shift it.
  useEffect(() => {
    const ul = list.current;
    if (!ul) return;
    const observer = new MutationObserver((records) => {
      const started = new Set<HTMLElement>();
      for (const record of records) {
        const item = record.target as HTMLElement;
        if (item.parentElement === ul && item.dataset.anim === 'run') started.add(item);
      }
      if (!started.size) return;
      const tops = [...new Set([...started].map((item) => item.offsetTop))].sort((a, b) => a - b);
      started.forEach((item) => (item.dataset.row = String(tops.indexOf(item.offsetTop))));
    });
    observer.observe(ul, { subtree: true, attributes: true, attributeFilter: ['data-anim'] });
    return () => observer.disconnect();
  }, []);

  return (
    <ul ref={list} className="agi-list">
      {agentIntegrations.map((tool, i) => {
        const isOpen = open === tool.name;
        const popId = `${id}-perm-${i}`;
        const permissions = agentIntegrationPermissions[tool.name] ?? [];
        return (
          <Motion as="li" key={tool.name} replay={false} threshold={0.2} className="motion agi-item flex">
            <div className="agi-tool" data-tool={tool.name} data-open={isOpen ? '' : undefined}>
              <div className="agi-head">
                <h3 className="text-body leading-6 font-semibold text-text">
                  <button
                    type="button"
                    className="agi-name"
                    aria-expanded={isOpen}
                    aria-controls={popId}
                    onClick={() => setOpen(isOpen ? null : tool.name)}
                  >
                    {tool.name.slice(0, tool.name.lastIndexOf(' ') + 1)}
                    {/* The caret stays with the last word when the name wraps. */}
                    <span className="whitespace-nowrap">
                      {tool.name.slice(tool.name.lastIndexOf(' ') + 1)}
                      <svg aria-hidden className="agi-caret" width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M3 4.5l3 3 3-3"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                </h3>
                <span aria-hidden className="agi-toggle">
                  <span className="agi-track">
                    <span className="agi-knob" />
                  </span>
                  <span className="agi-toggle-label">Connected</span>
                </span>
              </div>
              <p className="agi-body text-body-s text-text-muted">{tool.body}</p>
              {permissions.length > 0 && (
                <div
                  id={popId}
                  role="group"
                  aria-label={`${tool.name} permissions`}
                  className="agi-pop"
                  hidden={!isOpen}
                >
                  <p className="agi-pop-head">Connected · permissions for one site</p>
                  <ul className="agi-perms">
                    {permissions.map((permission) => (
                      <li key={permission.label} className="agi-perm" data-kind={permission.kind}>
                        <span aria-hidden className="agi-perm-icon">
                          <PermissionIcon kind={permission.kind} />
                        </span>
                        <span>
                          <span className="agi-perm-label">{permission.label}</span>
                          <span className="agi-perm-detail">{permission.detail}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Motion>
        );
      })}
    </ul>
  );
}

function PermissionIcon({ kind }: { kind: IntegrationPermission['kind'] }) {
  const line = {
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      {kind === 'read' && (
        <>
          <path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8z" {...line} />
          <circle cx="8" cy="8" r="2" {...line} />
        </>
      )}
      {kind === 'propose' && <path d="M10.5 2.5l3 3-8 8H2.5v-3z M9 4l3 3" {...line} />}
      {kind === 'post' && <path d="M2 8.5l11.5-5.5-4 11-2.5-4.5z M7 9.5l6.5-6.5" {...line} />}
      {kind === 'confirm' && (
        <>
          <circle cx="8" cy="8" r="6" {...line} />
          <path d="M5.5 8.2l1.8 1.8 3.2-3.5" {...line} />
        </>
      )}
    </svg>
  );
}
