'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

import type { WebhookEvent } from './content';

/**
 * "Which events can a webhook fire on?": the events table beside a delivery
 * log (styles/api-webhooks.css, whl-*). The log is illustrative and says so.
 *
 * About a fifth in view, one storm plays through the log at once, a line
 * every 700ms (the whole storm in about 3s), and each event's row lights as
 * its line lands: 200ms in, held 600ms, 200ms out. Clicking a row (or its event, the
 * keyboard target) logs one delivery for that event. Replay reruns the storm.
 *
 * The storm follows the webhook sample on this page: Practice Field B, the
 * warning issued at 14:21. Server HTML, no JavaScript and reduced motion get
 * the storm's four lines, complete and still.
 */

const SITE = 'Practice Field B';

const STORM = [
  { event: 'lightning.watch', time: '13:24:02' },
  { event: 'lightning.warning', time: '14:21:00' },
  { event: 'hail.approaching', time: '14:29:40' },
  { event: 'lightning.all_clear', time: '15:12:06' },
];

/** When the first line lands after the log scrolls in, then between lines. */
const START_MS = 0;
const STEP_MS = 700;
/** How long a row stays lit after its line lands: the 200ms fade-in (the
 * .whl-row transition) plus a 600ms hold; it then fades out over 200ms. */
const HOT_MS = 800;
const FADE_MS = 200;
/** Lines kept; the log shows the latest 6 (3 on phones). */
const KEEP = 8;

type Line = { key: number; event: string; time: string; seed?: boolean };

const SEED: Line[] = STORM.map((s, i) => ({ key: -1 - i, ...s, seed: true }));

const noMotion = '(prefers-reduced-motion: reduce)';
function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia(noMotion);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

const clock = () => new Date().toTimeString().slice(0, 8);

export function WebhookEvents({ events }: { events: WebhookEvent[] }) {
  const still = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(noMotion).matches,
    () => true,
  );
  const [played, setPlayed] = useState<Line[] | null>(null);
  const lines = played ?? (still ? SEED : []);
  // Rows lit right now; lines 700ms apart overlap a row's 1s light.
  const [hot, setHot] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [touched, setTouched] = useState(false);

  const root = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const hotTimers = useRef(new Map<string, number>());
  const nextKey = useRef(0);

  const flash = (event: string) => {
    if (still) return;
    setHot((h) => (h.includes(event) ? h : [...h, event]));
    clearTimeout(hotTimers.current.get(event));
    hotTimers.current.set(
      event,
      window.setTimeout(() => setHot((h) => h.filter((e) => e !== event)), HOT_MS),
    );
  };

  const add = (event: string, time: string) => {
    setPlayed((prev) => [...(prev ?? (still ? SEED : [])), { key: nextKey.current++, event, time }].slice(-KEEP));
    flash(event);
  };

  const play = () => {
    timers.current.forEach(clearTimeout);
    setPlayed([]);
    setDone(false);
    timers.current = STORM.map((s, i) => window.setTimeout(() => add(s.event, s.time), START_MS + i * STEP_MS));
    timers.current.push(
      window.setTimeout(() => setDone(true), START_MS + (STORM.length - 1) * STEP_MS + HOT_MS + FADE_MS),
    );
  };

  // Play the storm once, the first time the log is in view.
  useEffect(() => {
    const block = root.current;
    if (!block || still) return;
    let started = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        block.toggleAttribute('data-inview', entry.isIntersecting);
        if (entry.isIntersecting && !started) {
          started = true;
          play();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(block);
    const pending = timers.current;
    const lit = hotTimers.current;
    return () => {
      observer.disconnect();
      pending.forEach(clearTimeout);
      lit.forEach(clearTimeout);
      block.removeAttribute('data-inview');
    };
    // `play` is rebuilt every render; the storm only needs to start once per motion setting.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [still]);

  const th = 'pb-[14px] text-left text-micro font-semibold tracking-label text-text-muted uppercase';

  return (
    <div ref={root} className="whl">
      <div className="whl-table">
        <table className="w-full min-w-[720px] border-collapse">
          <caption className="sr-only">
            Flash API webhook events, when each fires and its lead time. Choose an event to log a sample delivery.
          </caption>
          <thead>
            <tr className="border-b border-border-strong">
              <th scope="col" className={`${th} w-[300px] pl-2`}>
                Event
              </th>
              <th scope="col" className={th}>
                Fires when
              </th>
              <th scope="col" className={`${th} w-[190px]`}>
                Lead
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((w) => (
              <tr
                key={w.event}
                data-hot={hot.includes(w.event) ? '' : undefined}
                className="whl-row border-b border-border"
                onClick={() => {
                  setTouched(true);
                  add(w.event, clock());
                }}
              >
                <th scope="row" className="py-4 pr-6 pl-2 text-left font-normal">
                  <button type="button" className="whl-event" aria-controls="webhook-log">
                    <span className="sr-only">Log a sample delivery: </span>
                    {w.event}
                  </button>
                </th>
                <td className="py-4 pr-8 text-[15px] leading-body-s text-text">{w.firesWhen}</td>
                <td className="py-4 pr-2 text-[15px] leading-body-s font-medium text-text-muted">{w.lead}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section aria-label="Webhook delivery log (illustrative)" className="whl-log">
        <div className="whl-bar">
          <p className="flex items-center gap-2.5 text-caption leading-caption font-semibold text-text-on-dark">
            <span aria-hidden className="whl-live" />
            Delivery log
          </p>
          <p className="text-[11px] leading-[14px] font-semibold tracking-label text-[#8F9AB8] uppercase">
            Illustrative
          </p>
        </div>
        <ol id="webhook-log" role="log" aria-live={touched ? 'polite' : 'off'} className="whl-body">
          {lines.length === 0 && <li className="whl-empty">Waiting for the next event…</li>}
          {lines.map((l) => (
            <li
              key={l.key}
              data-seed={l.seed ? '' : undefined}
              data-kind={l.event.endsWith('all_clear') ? 'clear' : undefined}
              className="whl-line"
            >
              <span className="flex gap-2.5">
                <span className="text-[#6F7A99]">{l.time}</span>
                <span className="text-viz-gold">{l.event}</span>
              </span>
              <span className="text-[#8F9AB8]">
                {SITE} · <span className="text-[#7FD1A8]">delivered ✓ signed</span>
              </span>
            </li>
          ))}
        </ol>
        <div className="whl-foot">
          <p className="font-mono text-[11px] leading-[14px] text-[#6F7A99]">POST hooks.yourapp.com/flash</p>
          {done && !still && (
            <button type="button" className="whl-replay" onClick={play}>
              <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4.4h4.4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Replay
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
