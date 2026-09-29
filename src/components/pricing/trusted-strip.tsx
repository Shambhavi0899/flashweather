import Image from 'next/image';
import Link from 'next/link';

type Customer = { name: string; use: string; href?: string };

/**
 * "Trusted on the field": the named-customer strip on Pricing and About. The
 * photo tile is optional -- Pricing has one, About does not.
 */
export function TrustedStrip({
  customers,
  photo,
}: {
  customers: Customer[];
  photo?: { src: string; alt: string; eyebrow: string; caption: string };
}) {
  return (
    <section aria-label="Trusted on the field" className="border-y border-border bg-neutral-0">
      <div className="mx-auto flex max-w-page flex-col xl:flex-row">
        {photo && (
          <div className="relative flex h-[150px] shrink-0 overflow-hidden bg-brand-navy xl:w-[300px]">
            <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1440px) 300px, 100vw" className="object-cover" />
            <div aria-hidden className="pricing-trusted-photo-grade absolute inset-0" />
            <p className="absolute top-4 left-5 text-[10px] leading-3 font-extrabold tracking-[0.13em] text-viz-gold uppercase">
              {photo.eyebrow}
            </p>
            <p className="absolute bottom-4 left-5 w-[240px] text-[15px] leading-5 font-extrabold text-text-on-dark">
              {photo.caption}
            </p>
          </div>
        )}
        <div
          className={`flex flex-col justify-center gap-2 border-border px-4 py-7 md:px-10 xl:w-[292px] xl:shrink-0 xl:border-r ${
            photo ? 'lg:pr-8 lg:pl-10' : 'xl:pl-24'
          }`}
        >
          <p className="text-[11px] leading-[14px] font-bold tracking-[0.13em] text-text-muted">TRUSTED ON THE FIELD</p>
          <p className="text-body-s text-text">Named customers, named use.</p>
        </div>
        <ul className="grid grow grid-cols-1 border-t border-border sm:grid-cols-2 lg:grid-cols-4 xl:border-t-0">
          {customers.map((c, i) => (
            <li
              key={c.name}
              className={`flex flex-col justify-center gap-[6px] border-border px-4 py-7 md:px-8 lg:border-r lg:last:border-r-0 ${
                i === customers.length - 1 ? 'xl:pr-24' : ''
              } ${i > 0 ? 'border-t sm:border-t-0' : ''} ${i >= 2 ? 'sm:border-t lg:border-t-0' : ''}`}
            >
              <p className="text-h4 leading-6 font-bold tracking-[0.02em] text-brand-navy uppercase">
                {c.href ? (
                  <Link href={c.href} className="hover:underline">
                    {c.name}
                  </Link>
                ) : (
                  c.name
                )}
              </p>
              <p className="text-caption text-text-muted">{c.use}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
