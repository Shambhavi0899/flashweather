'use client';

import { Fragment, useEffect, useId, useRef, useState } from 'react';

import { CodeHeader, CodeWindow, highlight } from './code-block';
import { agentExample } from './content';

/** The button's spinner, before the first line arrives. */
const SEND_MS = 700;
/** One response line every this many ms. */
const LINE_MS = 320;
/** After the last line, the confirmation line lights up. */
const SETTLE_MS = 250;

type Phase = 'idle' | 'sending' | 'streaming' | 'done';
type Snippet = (typeof agentExample.snippets)[number];

const LINES = agentExample.response.split('\n');
const CONFIRM_LINE = LINES.findIndex((line) => line.includes(agentExample.confirm.value));

const STATUS: Record<Phase, string> = {
  idle: 'Not sent yet',
  sending: 'Sending…',
  streaming: 'Receiving…',
  done: `${agentExample.status} · illustrative`,
};

/* -------------------------------------------------- Request highlighting */
/* The JSON palette of CodeBody (code-block.tsx), carried to code: strings
   light, keys and punctuation muted, numbers gold, keywords and flags dim.
   A cURL body is JSON, so it is coloured as JSON. */

const CODE_TOKEN =
  /("(?:[^"\\\n]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)(\s*:)?|\b(\d+(?:\.\d+)?)\b|\b(const|await|import|curl)\b|(?<=\s)(-[A-Za-z])(?=\s)/g;

function highlightCode(code: string, lang: Snippet['id']) {
  const out: React.ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const match of code.matchAll(CODE_TOKEN)) {
    const start = match.index ?? 0;
    if (start > last) out.push(code.slice(last, start));
    const [whole, str, colon, num, keyword, flag] = match;
    if (str && lang === 'curl' && str.startsWith("'{")) {
      out.push(
        <Fragment key={i++}>
          {"'"}
          {highlight(str.slice(1, -1))}
          {"'"}
        </Fragment>,
      );
    } else if (str && colon) {
      out.push(str + colon);
    } else if (str) {
      out.push(
        <span key={i++} className="text-[#DCE2F0]">
          {str}
        </span>,
      );
    } else if (num) {
      out.push(
        <span key={i++} className="text-viz-gold">
          {num}
        </span>,
      );
    } else if (keyword || flag) {
      out.push(
        <span key={i++} className="text-[#6F7A99]">
          {whole}
        </span>,
      );
    } else {
      out.push(whole);
    }
    last = start + whole.length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

/**
 * "Build with Flash Agent"'s code window, runnable. The request is shown in
 * cURL, JavaScript or Python (ARIA tabs). Run sends it: the button spins for a beat,
 * the response streams in a line at a time, the header's status reads
 * "200 OK · illustrative", and the proposed action's
 * "awaiting_confirmation" line lights up gold with the note that a person
 * confirms first. It runs once by itself as the window scrolls into view;
 * after that the button reads "Run again".
 *
 * Nothing is sent anywhere: the response is agentExample.response. The
 * server renders the finished run, so the copy is all in the HTML; with
 * reduced motion it stays that way and Run shows the response at once.
 * Styles: styles/api-agent-run.css (aar-*).
 */
export function AgentRun({ className = '' }: { className?: string }) {
  const [lang, setLang] = useState(0);
  const [phase, setPhase] = useState<Phase>('done');
  const [shown, setShown] = useState(LINES.length);
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const timers = useRef<number[]>([]);
  const ran = useRef(false);
  const [hasRun, setHasRun] = useState(false);
  const base = useId();

  const clear = () => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  };
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  const run = () => {
    ran.current = true;
    setHasRun(true);
    clear();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(LINES.length);
      setPhase('done');
      return;
    }
    setShown(0);
    setPhase('sending');
    later(() => setPhase('streaming'), SEND_MS);
    LINES.forEach((_, n) => later(() => setShown(n + 1), SEND_MS + n * LINE_MS));
    later(() => setPhase('done'), SEND_MS + (LINES.length - 1) * LINE_MS + SETTLE_MS);
  };
  const runRef = useRef(run);
  useEffect(() => {
    runRef.current = run;
  });

  // With motion, the window waits empty below the fold and runs once when it is in view.
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (ran.current) return observer.disconnect();
        if (entry.isIntersecting) {
          observer.disconnect();
          runRef.current();
        } else {
          setShown(0);
          setPhase('idle');
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clear();
    };
  }, []);

  const busy = phase === 'sending' || phase === 'streaming';
  const again = phase === 'done' && hasRun;

  const pickTab = (i: number) => {
    setLang(i);
    const tab = tabs.current[i];
    tab?.focus();
    tab?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };
  const onKeyDown = (event: React.KeyboardEvent) => {
    const count = agentExample.snippets.length;
    const by = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (by) pickTab((lang + by + count) % count);
    else if (event.key === 'Home') pickTab(0);
    else if (event.key === 'End') pickTab(count - 1);
    else return;
    event.preventDefault();
  };

  const tabId = (i: number) => `${base}-tab-${i}`;
  const panelId = (i: number) => `${base}-panel-${i}`;

  return (
    <div ref={root} className={`aar flex min-w-0 flex-col ${className}`}>
      <CodeWindow
        header={
          <>
            <CodeHeader method="POST" tone="gold" url={agentExample.url} />
            <span role="status" data-phase={phase} className="aar-status">
              {STATUS[phase]}
            </span>
          </>
        }
      >
        <div className="aar-bar">
          <div role="tablist" aria-label="Request language" className="aar-tabs" onKeyDown={onKeyDown}>
            {agentExample.snippets.map((snippet, i) => (
              <button
                key={snippet.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={tabId(i)}
                aria-selected={lang === i}
                aria-controls={panelId(i)}
                tabIndex={lang === i ? 0 : -1}
                className="aar-tab"
                onClick={() => setLang(i)}
              >
                {snippet.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-disabled={busy}
            data-phase={phase}
            className="aar-run"
            onClick={() => {
              if (!busy) run();
            }}
          >
            {phase === 'sending' ? (
              <span aria-hidden className="aar-spinner" />
            ) : (
              <svg aria-hidden viewBox="0 0 12 12" className="aar-run-icon">
                {again ? (
                  <path d="M9.8 4.2A4.2 4.2 0 1 0 10.2 7M10 1.6v2.8H7.2" className="aar-again" />
                ) : (
                  <path d="M3 1.8v8.4L10 6z" />
                )}
              </svg>
            )}
            {busy ? 'Running' : again ? 'Run again' : 'Run'}
          </button>
        </div>

        <div className="aar-panels">
          {agentExample.snippets.map((snippet, i) => (
            <div
              key={snippet.id}
              role="tabpanel"
              id={panelId(i)}
              aria-labelledby={tabId(i)}
              data-on={lang === i ? '' : undefined}
              className="aar-panel"
            >
              <pre tabIndex={0} aria-label={`${snippet.label} request`} className="aar-pre">
                <code>{highlightCode(snippet.code, snippet.id)}</code>
              </pre>
            </div>
          ))}
        </div>

        <div className="aar-response" aria-busy={busy}>
          <p className="aar-label">Response</p>
          <pre className="aar-pre">
            <code>
              {LINES.map((line, n) => (
                <span
                  key={n}
                  data-shown={n < shown ? '' : undefined}
                  data-hl={phase === 'done' && n === CONFIRM_LINE ? '' : undefined}
                  className="aar-line"
                >
                  {highlight(line, phase === 'done' ? [agentExample.confirm.value] : [])}
                </span>
              ))}
            </code>
          </pre>
          <p data-on={phase === 'done' ? '' : undefined} className="aar-note">
            <svg aria-hidden viewBox="0 0 16 16" className="aar-note-icon">
              <circle cx="8" cy="5" r="2.6" />
              <path d="M2.8 14c.6-2.9 2.7-4.4 5.2-4.4s4.6 1.5 5.2 4.4" />
            </svg>
            {agentExample.confirm.note}
          </p>
        </div>
      </CodeWindow>
    </div>
  );
}
