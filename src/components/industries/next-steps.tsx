import Link from 'next/link';

import { ButtonLink } from '@/components/button';
import { Motion } from '@/components/motion';
import type { Industry, RelatedIntent } from '@/content/industries';
import { linkLabel } from '@/content/link-labels';
import { DEMO_HREF } from '@/content/navigation';

/** DOM and keyboard order; CSS lifts Act to the top on phones. */
const ORDER: RelatedIntent[] = ['learn', 'prove', 'act'];

/**
 * The related links grouped by what the reader wants next: learn the product,
 * see it proven, or act. Act is the primary card and leads with Book a demo.
 * Styles: `ns-*` in styles/industry-next-steps.css.
 */
export function NextStepCards({ related }: { related: NonNullable<Industry['related']> }) {
  const intents = related.intents;
  if (!intents) return null;

  return (
    <ul className="ns">
      {ORDER.map((key) => {
        const act = key === 'act';
        const id = `next-${key}`;
        return (
          <Motion key={key} as="li" className={`motion ns-item ns-item-${key}`} replay={false} threshold={0.25}>
            <div className={`ns-card ${act ? 'ns-card-act' : ''}`}>
              <div className="ns-head">
                <h3 id={id} className="ns-label">
                  {intents[key].label}
                </h3>
                <p className="ns-line">{intents[key].line}</p>
              </div>
              {act && (
                <ButtonLink href={DEMO_HREF} variant="gold" icon="→" className="ns-demo">
                  {linkLabel(DEMO_HREF)}
                </ButtonLink>
              )}
              <ul className="ns-links" aria-labelledby={id}>
                {related.links
                  .filter((link) => link.intent === key)
                  .map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="ns-row">
                        <span className="ns-row-copy">
                          <span className="ns-row-title">{link.title}</span>
                          <span className="ns-row-text">{link.text}</span>
                        </span>
                        <span aria-hidden className="ns-arrow">
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </Motion>
        );
      })}
    </ul>
  );
}
