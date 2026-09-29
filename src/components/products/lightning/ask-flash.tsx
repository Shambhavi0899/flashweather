import Link from 'next/link';

import { BOLT_PATH } from '@/components/bolt-path';
import { Motion } from '@/components/motion';
import { SectionHeader } from '@/components/products/section-header';

import { AskFlashPlayer } from './ask-flash-player';
import { askFlash, type AgentExample, type AgentToolPreview } from './content';

function AgentMark() {
  return (
    <span aria-hidden className="bg-gold-metallic flex size-7 shrink-0 items-center justify-center rounded-full">
      <svg width="12" height="16" viewBox="0 0 26 34">
        <path d={BOLT_PATH} fill="#070D26" />
      </svg>
    </span>
  );
}

/** A tick that draws itself when its step comes (`ask-tick`). */
function Tick() {
  return (
    <svg aria-hidden width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
      <path
        className="ask-tick"
        pathLength="1"
        d="M2.5 6.4l2.3 2.3 4.7-5.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Each preview's steps and their start times (ms), for <AskFlashPlayer>. The
 * answer streams over the first second; the card is done at the last step.
 */
const steps = {
  schedule: 'tool@1150 move@1750 confirm@2600 done@3200',
  audit: 'tool@1150 rows@1500 confirm@2650 done@3250',
} satisfies Record<AgentToolPreview['kind'], string>;

const chip = 'flex min-h-6 items-center rounded-sm border px-[10px] text-micro';
const toolLabel = 'text-[11px] leading-[14px] font-semibold tracking-label text-[#8F9AB8] uppercase';

/**
 * Two illustrative Flash Agent exchanges on the deep-navy ground, each ending
 * in the tool it acted in.
 *
 * The heading and intro rise in (<Motion>, `ask-head`); the cards play on
 * <AskFlashPlayer>: the question is there from the start, the answer streams
 * in, a small unbranded preview of the tool slides open under it and shows the
 * change landing, and the Action chip arrives with its tick as the tool
 * confirms (`ask-*` in styles/products.css). The second card waits for a
 * little more scroll than the first. Every piece is laid out from the start
 * and only fades, slides or clips, so the cards keep their final height
 * throughout; without JS or with reduced motion they are simply finished.
 */
export function LightningAskFlash() {
  return (
    <section aria-labelledby="ask-flash-heading" className="bg-brand-navy-deep">
      <div className="container-page flex flex-col gap-12 py-20 lg:py-[112px]">
        <Motion replay={false} className="motion ask-head">
          <SectionHeader
            id="ask-flash-heading"
            size="md"
            tone="dark"
            label={askFlash.label}
            heading={askFlash.heading}
            aside={
              <div className="flex flex-col gap-3">
                <p className="text-body text-[#C9D1E3]">{askFlash.body}</p>
                <Link
                  href={askFlash.link.href}
                  className="text-body-s leading-5 font-medium text-viz-gold hover:underline"
                >
                  {askFlash.link.label} <span aria-hidden>→</span>
                </Link>
              </div>
            }
          />
        </Motion>

        <AskFlashPlayer className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {askFlash.examples.map((example) => (
            <AgentCard key={example.role} example={example} />
          ))}
        </AskFlashPlayer>
      </div>
    </section>
  );
}

function AgentCard({ example }: { example: AgentExample }) {
  return (
    <li
      data-ask-card
      data-ask-steps={steps[example.preview.kind]}
      className="chat flex flex-col gap-4 rounded-[20px] border border-white/10 bg-[#040818B8] p-6 sm:p-[28px]"
    >
      <div className="flex items-center gap-[10px]">
        <AgentMark />
        <p className="min-w-0 grow text-[11px] leading-[14px] font-semibold tracking-label text-[#8F9AB8] uppercase">
          {example.role}
        </p>
        {/* Hidden until the card has played; its room is kept, so nothing moves. */}
        <button
          type="button"
          data-chat-replay
          aria-label={`Replay: ${example.role}`}
          className="chat-replay flex h-7 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-white/20 px-2 text-micro font-bold text-[#C9D1E3] hover:border-white/40 hover:text-text-on-dark sm:px-3"
        >
          <span aria-hidden>↻</span>
          <span className="max-sm:sr-only">Replay</span>
        </button>
      </div>

      <h3 className="text-body-l leading-body font-medium text-pretty text-text-on-dark">{example.question}</h3>
      <p className="text-[15px] leading-6 text-pretty text-[#C9D1E3]">
        {example.answer.split(' ').map((word, i) => (
          <span key={i}>
            <span className="chat-word">{word}</span>{' '}
          </span>
        ))}
      </p>

      {example.preview.kind === 'schedule' ? (
        <SchedulePreview preview={example.preview} />
      ) : (
        <AuditPreview preview={example.preview} />
      )}

      {/* The context first; the action last, as the tool confirms it. */}
      <ul className="flex flex-wrap gap-2" aria-label="Actions and sources">
        {example.chips.map((label) => (
          <li key={label} className={`ask-chip border-white/14 font-medium text-text-on-dark-muted ${chip}`}>
            {label}
          </li>
        ))}
        <li
          className={`ask-action gap-1.5 border-alert-clear/60 bg-alert-clear/16 font-semibold text-[#7FD1A8] ${chip}`}
        >
          <Tick />
          {example.action}
        </li>
      </ul>
    </li>
  );
}

const hours = ['8a', '10a', '12p', '2p', '4p'];

/**
 * A generic week grid, 8am to 6pm across. The block in the moved day's row
 * slides from 10:00 to its new slot and turns green; its label changes with
 * it, then the confirmation ticks in. The grid is a picture of the labels
 * below it, so it is hidden from assistive tech.
 */
function SchedulePreview({ preview }: { preview: Extract<AgentToolPreview, { kind: 'schedule' }> }) {
  return (
    <div className="ask-preview flex flex-col gap-3 rounded-xl border border-white/10 bg-white/3 p-3 sm:p-4">
      <div className="flex items-center justify-between gap-3">
        <p className={toolLabel}>{preview.tool} · Schedule</p>
        <p className="truncate text-[11px] leading-[14px] font-medium text-[#C9D1E3]">{preview.title}</p>
      </div>
      <div aria-hidden className="flex flex-col gap-1.5">
        <div className="flex gap-2">
          <span className="w-7 shrink-0" />
          <div className="grid grow grid-cols-5 text-[11px] leading-[14px] text-[#8F9AB8]">
            {hours.map((hour) => (
              <span key={hour}>{hour}</span>
            ))}
          </div>
        </div>
        {preview.days.map((day, i) => (
          <div key={day} className="flex items-center gap-2">
            <span className="w-7 shrink-0 text-[11px] leading-[14px] font-medium text-[#8F9AB8]">{day}</span>
            <div className="ask-track relative h-6 grow rounded-[5px]">
              {day === preview.day ? (
                <span className="ask-lift absolute inset-y-[3px] rounded-[3px]" />
              ) : (
                <span className={`ask-busy absolute inset-y-[3px] rounded-[3px] ${i === 0 ? 'ask-busy-a' : 'ask-busy-b'}`} />
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 text-caption leading-[18px]">
        <p className="grid font-medium">
          <span aria-hidden className="ask-when-from col-start-1 row-start-1 text-[#C9D1E3]">
            {preview.from}
          </span>
          <span className="ask-when-to col-start-1 row-start-1 text-[#7FD1A8]">{preview.to}</span>
        </p>
        <p className="ask-confirm flex items-center gap-1.5 font-semibold text-[#7FD1A8]">
          <Tick />
          {preview.confirm}
        </p>
      </div>
    </div>
  );
}

/** A generic file table: the night's all-clear events tick in row by row, then the file saves. */
function AuditPreview({ preview }: { preview: Extract<AgentToolPreview, { kind: 'audit' }> }) {
  return (
    <div className="ask-preview flex flex-col gap-2.5 rounded-xl border border-white/10 bg-white/3 p-3 sm:p-4">
      <div className="flex items-center justify-between gap-3">
        <p className={toolLabel}>{preview.tool} · File</p>
        <p className="truncate text-[11px] leading-[14px] font-medium text-[#C9D1E3]">{preview.title}</p>
      </div>
      <table className="w-full text-left text-[11px] leading-[14px] tabular-nums">
        <thead>
          <tr className="text-[#8F9AB8]">
            {preview.columns.map((column) => (
              <th key={column} scope="col" className="pb-1.5 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-[#C9D1E3]">
          {preview.rows.map(([time, cell, decision, who]) => (
            <tr key={time} className="ask-row border-t border-white/6">
              <td className="py-[3px]">{time}</td>
              <td className="py-[3px]">{cell}</td>
              <td className="py-[3px]">
                <span className="flex items-center gap-1.5">
                  <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-alert-clear" />
                  {decision}
                </span>
              </td>
              <td className="py-[3px]">{who}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="ask-confirm flex items-center gap-1.5 text-caption leading-[18px] font-semibold text-[#7FD1A8]">
        <Tick />
        {preview.confirm}
      </p>
    </div>
  );
}
