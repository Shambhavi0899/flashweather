'use client';

import { useEffect, useRef, useState } from 'react';

import { Motion } from '@/components/motion';

import { heroResponse, parameterGroups } from './content';

/**
 * "What can you request for a cell?": the parameter catalogue as a request
 * builder (styles/api-parameters.css, apr-*). Each chip is a toggle button;
 * the request bar above lists the selected ones, in the order they were
 * picked, and Copy puts the full URL on the clipboard.
 *
 * The server HTML is the default request (lightning_risk_60m and wbgt_f
 * selected), so every chip is still readable text without JavaScript.
 */

/** An illustrative cell, like the hero's sample response. */
const CELL_PATH = '/v1/cells/2214/now';
const ORIGIN = new URL(heroResponse.url).origin;
const PRESELECTED = ['lightning_risk_60m', 'wbgt_f'];
/** The catalogue size the section label gives ("a sample of over 100"). */
const TOTAL = '100+';
const COPIED_MS = 1800;

export function ParameterRequest({ method }: { method: React.ReactNode }) {
  const [selected, setSelected] = useState<string[]>(PRESELECTED);
  const [copied, setCopied] = useState(false);
  const url = useRef<HTMLElement>(null);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  // Where the URL is one scrolling line (below 1024px), keep the newest param
  // in view, and fade the cut-off start once it has scrolled.
  const markScrolled = () => url.current?.toggleAttribute('data-scrolled', url.current.scrollLeft > 0);
  useEffect(() => {
    if (!url.current) return;
    url.current.scrollLeft = url.current.scrollWidth;
    markScrolled();
  }, [selected]);

  const query = selected.length ? `?params=${selected.join(',')}` : '';

  const toggle = (param: string) =>
    setSelected((current) =>
      current.includes(param) ? current.filter((p) => p !== param) : [...current, param],
    );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${ORIGIN}${CELL_PATH}${query}`);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), COPIED_MS);
    } catch {
      // No clipboard access (an insecure origin, a denied permission): select
      // the URL so it can be copied by hand.
      if (url.current) window.getSelection()?.selectAllChildren(url.current);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="apr-bar-wrap">
        <div className="apr-bar">
          {method}
          <code ref={url} onScroll={markScrolled} className="apr-url font-mono">
            {/* Inline-block segments: the URL wraps between them (after "?" and each comma), never inside a
                name, and not at all where it is one scrolling line. */}
            <span className="apr-seg">
              {CELL_PATH}
              {selected.length > 0 && '?'}
            </span>
            {selected.map((p, i) => (
              <span key={p} className="apr-seg">
                {i === 0 && 'params='}
                <span className="apr-param">{p}</span>
                {i < selected.length - 1 && ','}
              </span>
            ))}
          </code>
          <button type="button" onClick={copy} className="apr-copy" data-copied={copied ? '' : undefined}>
            <span aria-live="polite">{copied ? 'Copied ✓' : 'Copy'}</span>
          </button>
        </div>
        <p className="apr-count" aria-live="polite">
          <strong>{selected.length}</strong> of {TOTAL} parameters selected
        </p>
      </div>

      <table className="w-full border-collapse border-t border-border">
        <caption className="sr-only">
          A sample of Flash API parameters, grouped by hazard. Each parameter is a toggle that adds it to the request
          above.
        </caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Group</th>
            <th scope="col">Parameters</th>
          </tr>
        </thead>
        <tbody>
          {parameterGroups.map((g) => (
            <Motion
              as="tr"
              key={g.group}
              className="motion apr-row flex flex-col gap-3 border-b border-border py-[22px] md:table-row"
              replay={false}
            >
              <th
                scope="row"
                className="text-left align-top text-micro font-semibold tracking-label text-brand-blue-soft uppercase md:w-[224px] md:py-[22px] md:pt-[28px] md:pr-6"
              >
                {g.group}
              </th>
              <td className="md:py-[22px]">
                <ul className="flex flex-wrap gap-2">
                  {g.parameters.map((p) => (
                    <li key={p}>
                      <button
                        type="button"
                        aria-pressed={selected.includes(p)}
                        onClick={() => toggle(p)}
                        className="apr-chip font-mono"
                      >
                        {p}
                      </button>
                    </li>
                  ))}
                </ul>
              </td>
            </Motion>
          ))}
        </tbody>
      </table>
    </div>
  );
}
