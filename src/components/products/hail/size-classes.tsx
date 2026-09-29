import Image from 'next/image';

import { SectionHeader } from '@/components/products/section-header';

import { carriedSizeClass, sizeClassRows, sizeClassTone } from './content';

/** The class the comparison above ends its alert on ("1.00 in DAMAGING"), picked up here and by "Who moves first". */
const PICKED = carriedSizeClass;

/** The size-class table (class, typical damage, who is alerted) and the hail-on-the-ground photo band. */
export function SizeClasses() {
  return (
    <section aria-labelledby="hail-size-classes-heading" className="bg-neutral-0">
      <div className="container-page flex flex-col gap-8 pt-6 pb-20 lg:pb-[120px]">
        <SectionHeader
          size="md"
          labelTone="muted-light"
          id="hail-size-classes-heading"
          label="Size classes · what each alert means"
          heading="Which size class triggers whom?"
          aside={
            <p className="text-body-s text-text-muted lg:ml-auto lg:max-w-[360px]">
              Thresholds follow the National Weather Service severe-hail definition; each FlashHail alert names its size
              class.
            </p>
          }
        />

        <div className="relative overflow-x-auto rounded-md border border-border">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <caption className="sr-only">
              FlashHail size classes with typical damage and who is alerted, for severe, damaging and destructive hail
            </caption>
            <thead className="bg-surface-sunken">
              <tr className="border-b border-border">
                <th scope="col" className="w-[160px] px-6 py-3 text-micro font-semibold tracking-label text-text-muted uppercase lg:w-[200px]">
                  Class
                </th>
                <th scope="col" className="px-6 py-3 text-micro font-semibold tracking-label text-text-muted uppercase">
                  Typical damage
                </th>
                <th scope="col" className="w-[38%] px-6 py-3 text-micro font-semibold tracking-label text-text-muted uppercase lg:w-[380px]">
                  Who gets alerted
                </th>
              </tr>
            </thead>
            <tbody>
              {sizeClassRows.map((row, i) => (
                <tr
                  key={row.key}
                  className={`${i < sizeClassRows.length - 1 ? 'border-b border-border' : ''} ${
                    row.key === PICKED ? 'hc-picked' : ''
                  }`}
                >
                  <th scope="row" className="px-6 py-[18px] align-middle">
                    <span className="flex items-center gap-[10px]">
                      <span aria-hidden className={`size-[14px] shrink-0 rounded-full ${sizeClassTone[row.key].dot}`} />
                      <span className="text-micro font-bold tracking-[0.12em] text-text uppercase">{row.label}</span>
                    </span>
                  </th>
                  <td className="px-6 py-[18px] align-middle text-[15px] leading-body-s text-text">{row.damage}</td>
                  <td className="px-6 py-[18px] align-middle text-[15px] leading-body-s text-text-muted">{row.alerted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <figure className="flex flex-col gap-[10px]">
          <div className="relative isolate flex h-[220px] flex-col justify-between overflow-clip rounded-lg p-5 sm:px-6 lg:h-[200px]">
            <Image
              src="/images/products/flash-hailstones-ground-after-storm-size-class.png"
              alt="Hailstones scattered across wet grass and a driveway after a severe cell, beside the size-class table"
              fill
              sizes="(min-width: 1440px) 1248px, 100vw"
              className="-z-20 object-cover object-[50%_55%]"
            />
            <div aria-hidden className="products-photo-grade-hail-ground absolute inset-0 -z-10" />
            <p className="relative text-[10px] leading-3 font-extrabold tracking-[0.13em] text-viz-gold uppercase">
              What lands on the ground
            </p>
            <p className="relative max-w-[900px] text-[19px] leading-[26px] font-extrabold tracking-[-0.03em] text-white md:text-[22px] md:leading-body-l">
              The alert names the size class before the first stone falls — up to 55 minutes ahead.
            </p>
          </div>
          <figcaption className="text-micro leading-caption text-text-subtle">
            Hail on the ground after a severe cell · size classes follow the National Weather Service severe-hail
            definition
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
