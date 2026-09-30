import { Motion } from '@/components/motion';
import { glossaryId, safetyStack, safetyStackCopy } from '@/content/why-flash';

/**
 * "What should a safety officer actually run?" as a sum: the three items
 * with a "+" between them and "= one complete safety plan" under them.
 *
 * Under Motion's data-anim it builds once on scroll-in (item, "+", item,
 * "+", item, then the sum line); hovering an item lifts it, sweeps its rule
 * and chip to gold and dims the other two. All of it lives in
 * styles/why-flash-stack.css. Reduced motion (or no JS) shows the finished
 * sum. The "+" signs are drawn, so assistive tech skips them and reads the
 * figure's label instead.
 */
export function SafetyStack() {
  return (
    <Motion className="motion wfs flex flex-col gap-10 lg:gap-12" replay={false} threshold={0.25}>
      <figure aria-label="Three-step diagram of the recommended stack: Flash prediction for the 60 minutes before a storm, a detection feed to confirm strikes, and a sideline WBGT sensor for policy readings">
        <ol className="wfs-list flex flex-col gap-14 lg:flex-row lg:gap-16">
          {safetyStack.map((item, i) => (
            <li key={item.step} className="wfs-item relative flex flex-1" data-step={i}>
              {i > 0 && (
                <svg aria-hidden className="wfs-plus" width="20" height="20" viewBox="0 0 20 20">
                  <path className="wfs-plus-h" d="M2 10H18" pathLength={1} />
                  <path className="wfs-plus-v" d="M10 2V18" pathLength={1} />
                </svg>
              )}
              <div className="wfs-card flex flex-1 flex-col gap-[14px] pt-6">
                <p aria-hidden className="wfs-num text-display-m leading-display-m font-bold tracking-[-0.03em]">
                  {item.step}
                </p>
                <p
                  className={`text-[11px] leading-[14px] font-semibold tracking-label uppercase ${
                    item.gold ? 'text-viz-gold' : 'text-text-on-dark-muted'
                  }`}
                >
                  {item.when}
                </p>
                <h3 className="text-h4 leading-h4 font-bold text-text-on-dark">{item.name}</h3>
                <p className="wfs-body text-[15px] leading-body-s">{item.body}</p>
                <p className="wfs-chip">
                  <span className="wfs-chip-label">{safetyStackCopy.duty}</span>
                  <span className="sr-only">: </span>
                  <span>{item.duty}</span>
                </p>
                {/* Sidenote: the step's terms, linked down to the glossary (arrival highlight in glossary.tsx). */}
                <p className="text-caption leading-caption text-text-on-dark-muted">
                  <span className="font-semibold">Glossary ↓</span>{' '}
                  {item.terms.map((term, t) => (
                    <span key={term}>
                      {t > 0 && ', '}
                      <a
                        href={`#${glossaryId(term)}`}
                        className="text-text-on-dark underline decoration-white/35 decoration-dotted underline-offset-4 hover:text-viz-gold hover:decoration-viz-gold"
                      >
                        {term}
                      </a>
                    </span>
                  ))}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </figure>
      <p className="wfs-sum text-h4 leading-h4 font-bold text-text-on-dark md:text-[24px] md:leading-[32px]">
        <span className="wfs-equals">=</span> {safetyStackCopy.sum}
      </p>
    </Motion>
  );
}
