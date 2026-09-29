'use client';

import Link from 'next/link';
import { Fragment, useEffect, useId, useRef, useState } from 'react';

import { CodeBody, CodeHeader } from './code-block';
import { endpoints, type Endpoint, type HttpMethod } from './content';

const th = 'pb-[14px] text-left text-micro font-semibold tracking-label text-text-muted uppercase';
/** Hover picks a row only where the panel sits beside the table and a mouse is pointing. */
const HOVER = '(min-width: 1280px) and (hover: hover) and (pointer: fine)';

/** The endpoint table's method badge; the parameter request bar shows it too. */
export function Method({ method }: { method: HttpMethod }) {
  return (
    <span
      className={`flex h-[22px] shrink-0 items-center rounded-sm px-2 text-[11px] leading-[14px] font-bold tracking-[0.08em] ${
        method === 'GET' ? 'bg-[#E8F5EE] text-alert-clear' : 'bg-gold-on-light/14 text-brand-navy'
      }`}
    >
      {method}
    </span>
  );
}

/** One endpoint's sample response: the method and path, the status, the JSON. */
function Sample({ endpoint }: { endpoint: Endpoint }) {
  const { sample } = endpoint;
  return (
    <>
      <div className="ape-sample-head">
        <CodeHeader
          method={endpoint.method}
          tone={endpoint.method === 'GET' ? 'green' : 'gold'}
          url={sample.path}
          status={`${sample.status} · illustrative`}
        />
      </div>
      <CodeBody code={sample.code} />
    </>
  );
}

/**
 * "Which endpoints does the API expose?" as a table you can try. Each row's
 * endpoint cell is a button: clicking it (or hovering the row with a mouse,
 * on wide screens) highlights the row and swaps the response panel beside
 * the table to that endpoint's sample, a plain crossfade. The first row is
 * picked to begin with. Below 1280px there is no side panel: the rows stack
 * and the picked row opens its sample underneath it.
 *
 * The table stays a real <table> with the same copy; the samples are
 * illustrative (content.ts `sample`) and say so in their status line. The
 * panel holds every sample stacked in one place so it never changes height;
 * only the picked one shows. Rows fade in once as the table scrolls in
 * (styles/api-endpoints.css), not at all with reduced motion.
 */
export function EndpointExplorer() {
  const [picked, setPicked] = useState(0);
  const panelId = useId();
  const ref = useRef<HTMLDivElement>(null);

  // Rows fade in once: `data-in` when the table scrolls in. The CSS only hides
  // rows under `data-armed`, so without JavaScript nothing is ever hidden.
  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (root.getBoundingClientRect().top < window.innerHeight * 0.85) return; // already in view: no fade
    root.setAttribute('data-armed', '');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        root.setAttribute('data-in', '');
      },
      { threshold: 0.2 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const hoverPick = (i: number) => (event: React.PointerEvent) => {
    if (event.pointerType === 'mouse' && window.matchMedia(HOVER).matches) setPicked(i);
  };

  return (
    <div ref={ref} className="ape">
      <table className="ape-table">
        <caption className="sr-only">Flash API endpoints, what each returns and typical uses</caption>
        <thead>
          <tr className="border-b border-border-strong">
            <th scope="col" className={`${th} ape-col-endpoint`}>
              Endpoint
            </th>
            <th scope="col" className={`${th} ape-col-returns`}>
              Returns
            </th>
            <th scope="col" className={th}>
              Typical use
            </th>
          </tr>
        </thead>
        <tbody>
          {endpoints.map((e, i) => {
            const on = i === picked;
            return (
              <Fragment key={`${e.method} ${e.path}`}>
                <tr
                  className="ape-row"
                  data-i={i}
                  data-on={on || undefined}
                  onClick={() => setPicked(i)}
                  onPointerEnter={hoverPick(i)}
                >
                  <th scope="row" className="ape-cell ape-cell-endpoint text-left font-normal">
                    <button type="button" className="ape-pick" aria-pressed={on} aria-controls={panelId}>
                      <Method method={e.method} />
                      <code className="font-mono text-body-s leading-5 font-medium text-text">{e.path}</code>
                    </button>
                  </th>
                  <td className="ape-cell text-[15px] leading-body-s text-text">{e.returns}</td>
                  <td className="ape-cell text-[15px] leading-body-s text-text-muted">
                    {e.use}
                    {e.useLink && (
                      <>
                        {' '}
                        <Link href={e.useLink.href} className="font-medium text-brand-blue hover:underline">
                          {e.useLink.label}
                        </Link>
                      </>
                    )}
                  </td>
                </tr>
                {/* Phones and tablets: the picked row's sample opens under it. */}
                {on && (
                  <tr className="ape-expand">
                    <td colSpan={3}>
                      <div className="ape-window">
                        <Sample endpoint={e} />
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>

      {/* Wide screens: every sample, stacked in one window; the picked one shows. */}
      <aside id={panelId} aria-label="Sample response" className="ape-panel">
        <div className="ape-window ape-stack">
          {endpoints.map((e, i) => (
            <div
              key={`${e.method} ${e.path}`}
              className="ape-sample"
              data-on={i === picked || undefined}
              aria-hidden={i !== picked}
            >
              <Sample endpoint={e} />
            </div>
          ))}
        </div>
        <p className="text-micro leading-caption text-text-subtle">Illustrative responses, not live weather.</p>
      </aside>
    </div>
  );
}
