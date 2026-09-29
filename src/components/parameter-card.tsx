import Image from 'next/image';
import Link from 'next/link';

export type ParameterCardData = {
  tag: string;
  caption: string;
  image: { src: string; alt: string };
  items: { title: string; body: string }[];
  links?: { label: string; href: string }[];
  /** The navy card that closes a grid. */
  dark?: boolean;
};

/** The live layer each subject carries over its photo; keyed by the card's tag. */
const overlays: Record<string, string> = {
  severe: 'strike',
  heat: 'heat',
  water: 'rain',
  wind: 'wind',
  agronomy: 'frost',
  'visibility and winter': 'fog',
  delivery: 'scan',
  intelligence: 'network',
  coverage: 'network',
};

/**
 * The card both parameter catalogues use: the home page's "What we predict"
 * and the Platform page's "What does Flash predict?". A photo with its tag
 * and caption, then the products it covers.
 *
 * Its motion is CSS (styles/parameter-card.css): the card lifts on hover and its
 * photo grows a little, a live layer plays over the photo while the card is in view, and a link's
 * arrow slides as it is hovered. The photo sits in a frame 12px taller than
 * its window, top and bottom, so a section can move it with the scroll
 * (`--pc-y`, from <ScrollFlow>) without ever showing an edge.
 *
 * `grade` is the photo's gradient, a class from the area's stylesheet.
 * `pinLinks` holds the links to the bottom of the card, as the Platform grid
 * draws them. `industries` names the filter chips the card answers to, as
 * `data-for`, for a grid that can be filtered (styles/products.css).
 */
export function ParameterCard({
  card,
  grade,
  pinLinks = false,
  industries,
}: {
  card: ParameterCardData;
  grade: string;
  pinLinks?: boolean;
  industries?: readonly string[];
}) {
  const dark = card.dark ?? false;
  const overlay = overlays[card.tag.toLowerCase()];
  const accent = dark ? 'text-viz-gold' : 'text-brand-blue';

  return (
    <article
      data-for={industries?.join(' ')}
      className={`pc flex w-full flex-col overflow-hidden rounded-lg border ${
        dark ? 'border-viz-gold/45 bg-brand-navy' : 'border-border bg-neutral-0'
      }`}
    >
      <div className="pc-media relative h-[132px] shrink-0 overflow-hidden">
        <div className="pc-photo absolute inset-x-0 -inset-y-3">
          <Image
            src={card.image.src}
            alt={card.image.alt}
            fill
            sizes="(min-width: 1024px) 294px, (min-width: 480px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        {overlay && (
          <span aria-hidden className={`pc-fx pc-fx-${overlay} absolute inset-0`}>
            <span className="motion-loop" />
            <span className="motion-loop" />
            <span className="motion-loop" />
          </span>
        )}
        <span aria-hidden className={`absolute inset-0 ${grade}`} />
        <p className="absolute top-3 left-[14px] text-[10px] leading-3 font-extrabold tracking-[0.13em] text-viz-gold uppercase">
          {card.tag}
        </p>
        <p className="absolute bottom-3 left-[14px] text-micro font-extrabold text-text-on-dark uppercase">
          {card.caption}
        </p>
      </div>
      <div className="flex grow flex-col gap-[14px] px-[18px] pt-[18px] pb-[22px]">
        {card.items.map((item) => (
          <div key={item.title} className="flex flex-col gap-[2px]">
            <h3 className={`text-[17px] leading-6 font-bold ${dark ? 'text-text-on-dark' : 'text-text'}`}>
              {item.title}
            </h3>
            <p className={`text-body-s leading-5 ${dark ? 'text-text-on-dark-muted' : 'text-text-muted'}`}>
              {item.body}
            </p>
          </div>
        ))}
        {card.links && (
          <p className={`flex flex-wrap gap-x-2 text-body-s leading-5 font-bold ${pinLinks ? 'mt-auto' : ''}`}>
            {card.links.map((link, i) => (
              <span key={link.href} className="flex gap-2">
                {i > 0 && (
                  <span aria-hidden className={accent}>
                    ·
                  </span>
                )}
                <Link href={link.href} className={`pc-link hover:underline ${accent}`}>
                  {link.label} <span aria-hidden>→</span>
                </Link>
              </span>
            ))}
          </p>
        )}
      </div>
    </article>
  );
}
