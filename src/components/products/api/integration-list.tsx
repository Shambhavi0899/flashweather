'use client';

import { useEffect, useRef } from 'react';

import { Motion } from '@/components/motion';

import { integrations } from './content';

/**
 * The integrations list of "Where does Flash already plug in?". Each connector
 * carries a "Receives:" line with the webhook events it takes. With a mouse
 * from 768px the line slides in under the description on hover, or when the
 * item is reached by keyboard (items take focus for that); on phones and touch
 * screens it is always there. The line is in the markup either way, so
 * crawlers and screen readers read it.
 *
 * The list fades in once, row by row: one Motion block, and each item's
 * data-row (its visual row, from offsetTop) sets its delay in
 * styles/api-integrations.css. Rows are counted again when the column count
 * changes.
 */
export function IntegrationList() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = [...root.querySelectorAll<HTMLElement>('.ain-item')];
    const number = () => {
      const tops = [...new Set(items.map((item) => item.offsetTop))].sort((a, b) => a - b);
      items.forEach((item) => (item.dataset.row = String(tops.indexOf(item.offsetTop))));
    };
    const observer = new ResizeObserver(number);
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <Motion as="ul" replay={false} className="motion ain-list grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {integrations.map((item) => (
          <li
            key={item.name}
            tabIndex={0}
            className="ain-item flex flex-col gap-[6px] border-r border-b border-border p-5 md:p-6"
          >
            <h3 className="text-[17px] leading-6 font-semibold text-text">{item.name}</h3>
            <p className="text-body-s leading-5 text-text-muted">{item.use}</p>
            <p className="ain-receives">
              <span className="ain-receives-label">Receives:</span>
              {item.receives === 'all' ? (
                <span className="ain-chip ain-chip-all">every event</span>
              ) : (
                item.receives.map((event) => (
                  <code key={event} className="ain-chip">
                    {event}
                  </code>
                ))
              )}
            </p>
          </li>
        ))}
      </Motion>
    </div>
  );
}
