import { Lines } from '@/components/lines';
import { Motion } from '@/components/motion';
import { ParameterCard } from '@/components/parameter-card';
import { ScrollFlow } from '@/components/scroll-flow';
import { catalogue, type CatalogueCard } from '@/content/home';

/** Photo grade per card family; the gradients live in src/styles/home.css. */
const GRADE_CLASS: Record<CatalogueCard['grade'], string> = {
  standard: 'home-catalogue-grade-standard',
  delivery: 'home-catalogue-grade-delivery',
  intelligence: 'home-catalogue-grade-intelligence',
};

/** "What we predict", the parameter catalogue. */
export function Catalogue() {
  return (
    <>
      {/* Moves with the scroll (styles/parameter-card.css): the header and the
          cards reveal once as they come into view, then <ScrollFlow> drifts
          each photo in its frame and eases the cards back as the section
          leaves. */}
      <ScrollFlow labelledBy="catalogue-heading" className="scroll-flow home-catalogue-ground relative isolate overflow-hidden">
        <div className="container-page flex flex-col gap-12 py-20 lg:gap-14 lg:py-[120px]">
          <Motion
            threshold={0.2}
            replay={false}
            className="motion scroll-flow-head flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12"
          >
            <div className="flex max-w-narrow flex-col gap-[18px]">
              <p className="scroll-flow-eyebrow text-[11px] leading-4 font-semibold tracking-label text-brand-blue uppercase md:text-micro">
                What we predict · one grid, every layer
              </p>
              <h2
                id="catalogue-heading"
                className="text-[26px] leading-8 font-extrabold tracking-[-0.03em] text-text md:text-[48px] md:leading-[54px] md:tracking-[-0.04em]"
              >
                <Lines
                  className="scroll-flow-word"
                  text="Every parameter your operation runs on, forecast on the same 1 km grid."
                />
              </h2>
            </div>
            <p className="scroll-flow-intro text-[17px] leading-h4 text-pretty text-text-muted lg:w-[380px] lg:shrink xl:shrink-0">
              15+ proprietary prediction products and 100+ atmospheric parameters, all scored against ground truth and
              delivered through one platform.
            </p>
          </Motion>

          <ul className="scroll-flow-cards grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {catalogue.map((card) => (
              <Motion as="li" key={card.tag} threshold={0.2} replay={false} className="motion scroll-flow-card flex">
                <ParameterCard
                  grade={GRADE_CLASS[card.grade]}
                  card={{ ...card, links: card.link && [card.link] }}
                />
              </Motion>
            ))}
          </ul>
        </div>
      </ScrollFlow>
    </>
  );
}
