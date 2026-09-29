'use client';

import Link from 'next/link';
import { useId, useState } from 'react';

import { Motion } from '@/components/motion';
import { faqIconFor, type FaqIcon } from '@/content/faq-icons';

export type FaqItem = {
  question: string;
  /** The answer as it is set on the page: text, or text with its links. */
  answer: React.ReactNode;
  /** Beside the question; left out, it follows the question's subject. */
  icon?: FaqIcon;
  /** Anything that follows the answer inside the panel: a source, a link. */
  after?: React.ReactNode;
};

/**
 * Every FAQ on the site: the questions as an accordion, one answer open at
 * a time, the first to begin with. Each question is a button in its heading
 * (Enter and Space toggle it) that controls the region under it, so it is an
 * accordion to assistive tech too. Every answer is in the server HTML
 * whatever is open, and with scripting off they are all shown.
 *
 * The section around it keeps its own look: `className` lays out the list,
 * `row` spaces a row, `question` and `answer` set the type. `flush` takes
 * the padding off the top of the first row and the rule and padding off the
 * bottom of the last, for a list that sits level with a heading beside it.
 * `ask` closes the list on a row that leads to Flash Agent.
 *
 * Each row is its own <Motion> block, so the rows that scroll in together
 * rise 80ms apart on the shared stagger. The height, the icon and the
 * colours are CSS transitions off `data-open` (app/globals.css); reduced
 * motion turns the transitions off and leaves the accordion working.
 */
export function FaqAccordion({
  faqs,
  className = 'flex flex-col',
  row = 'py-7',
  question = 'text-h4 leading-h4 font-semibold text-text',
  answer = 'mt-3 max-w-[640px] text-body text-pretty text-text-muted',
  flush = false,
  ask,
}: {
  faqs: FaqItem[];
  className?: string;
  row?: string;
  question?: string;
  answer?: string;
  flush?: boolean;
  /** Where the closing row leads; the row is left out without it. */
  ask?: string;
}) {
  const id = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className={className}>
      {faqs.map((faq, i) => {
        const last = i === faqs.length - 1 && !ask;
        return (
          <Motion key={faq.question} className="motion faq-item" replay={false}>
            <div
              data-open={open === i ? '' : undefined}
              className={`faq-row border-border ${row} ${flush && i === 0 ? 'faq-row-first pt-0' : ''} ${
                flush && last ? 'faq-row-last pb-0' : 'border-b'
              }`}
            >
              <h3 className={question}>
                <button
                  type="button"
                  id={`${id}-q${i}`}
                  aria-expanded={open === i}
                  aria-controls={`${id}-a${i}`}
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full cursor-pointer items-start justify-between gap-6 text-left"
                >
                  <span className="flex min-w-0 items-start gap-3">
                    <QuestionIcon icon={faq.icon ?? faqIconFor(faq.question)} />
                    <span className="faq-question">{faq.question}</span>
                  </span>
                  <span aria-hidden className="faq-mark flex size-6 shrink-0 items-center justify-center rounded-full border">
                    <svg width="10" height="10" viewBox="0 0 10 10">
                      <path d="M5 1v8M1 5h8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>
              </h3>
              <div id={`${id}-a${i}`} role="region" aria-labelledby={`${id}-q${i}`} className="faq-panel">
                <div className="faq-answer pl-8">
                  <p className={answer}>{faq.answer}</p>
                  {faq.after}
                </div>
              </div>
            </div>
          </Motion>
        );
      })}

      {/* Where the launcher goes: there is no widget to open yet, so this is
          the same link, and one a crawler can follow. */}
      {ask && (
        <Motion className="motion faq-item" replay={false}>
          <Link
            href={ask}
            className={`faq-row flex flex-wrap items-center justify-between gap-x-6 gap-y-2 ${row} ${
              flush ? 'faq-row-last pb-0' : ''
            }`}
          >
            <span className={`flex min-w-0 items-start gap-3 ${question}`}>
              <QuestionIcon icon="bolt" />
              <span className="faq-question">Still have a question?</span>
            </span>
            <span className="pl-8 text-body-s leading-5 font-semibold text-brand-blue sm:pl-0">
              Ask Flash Agent <span aria-hidden>→</span>
            </span>
          </Link>
        </Motion>
      )}
    </div>
  );
}

/**
 * The site's line icons: a 24 grid, 1.5 stroke, round caps. Drawn at 1em of
 * the question beside it, centred on its first line.
 */
function QuestionIcon({ icon }: { icon: FaqIcon }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="faq-icon shrink-0"
    >
      {icon === 'download' && <path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14" />}
      {icon === 'layers' && <path d="m12 4 8 4-8 4-8-4 8-4ZM4 12l8 4 8-4M4 16l8 4 8-4" />}
      {icon === 'bolt' && <path d="M15.7 2.5 4.7 13.5h5l-1.4 8 11-12h-5.7l2.1-7Z" />}
      {icon === 'pin' && (
        <>
          <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
          <circle cx="12" cy="10" r="2.3" />
        </>
      )}
      {icon === 'pin-plus' && (
        <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11ZM12 7.4v5.2M9.4 10h5.2" />
      )}
      {icon === 'code' && <path d="m9 8-4 4 4 4M15 8l4 4-4 4M13.2 6l-2.4 12" />}
      {icon === 'document' && (
        <path d="M13.5 3.5H7.5a1.5 1.5 0 0 0-1.5 1.5v14a1.5 1.5 0 0 0 1.5 1.5h9a1.5 1.5 0 0 0 1.5-1.5V8l-4.5-4.5ZM13.5 3.5V8H18M9 12.5h6M9 16h6" />
      )}
      {icon === 'thermometer' && (
        <>
          <path d="M14.5 13.6V5.5a2.5 2.5 0 0 0-5 0v8.1a4.5 4.5 0 1 0 5 0Z" />
          <path d="M12 8.5v6.2" />
          <circle cx="12" cy="17" r="1.6" />
        </>
      )}
      {icon === 'phone' && (
        <>
          <rect x="7" y="3" width="10" height="18" rx="2.2" />
          <path d="M11 17.8h2" />
        </>
      )}
      {icon === 'calendar' && (
        <>
          <rect x="4" y="5.5" width="16" height="14.5" rx="2" />
          <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
        </>
      )}
      {icon === 'flag' && <path d="M6 21V4M6 5h11.5l-2.4 3.8 2.4 3.7H6" />}
      {icon === 'clock' && (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5V12l3 2" />
        </>
      )}
      {icon === 'shield' && (
        <path d="M12 3.5 5.5 6v5.6c0 4 2.7 7.3 6.5 8.9 3.8-1.6 6.5-4.9 6.5-8.9V6L12 3.5ZM9.3 12l1.9 1.9 3.6-3.9" />
      )}
      {icon === 'bell' && <path d="M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 2H5l1.5-2ZM10 20.5h4" />}
      {icon === 'question' && (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M9.6 9.6a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1.1.9-1.1 1.7M12 16.6v.1" />
        </>
      )}
    </svg>
  );
}
