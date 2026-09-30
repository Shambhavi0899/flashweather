import Image from 'next/image';
import Link from 'next/link';

import { Motion } from '@/components/motion';
import { customers } from '@/content/home';

import { CustomerSlider } from './customer-slider';

const Dots = ({ order }: { order: number[] }) => (
  <span aria-hidden className="customers-dots">
    {order.map((i) => (
      <span key={i} className="motion-loop" style={{ '--i': i } as React.CSSProperties} />
    ))}
  </span>
);

const Arrow = ({ dir }: { dir: 'prev' | 'next' }) => (
  <button
    type="button"
    {...{ [`data-slider-${dir}`]: '' }}
    aria-label={dir === 'prev' ? 'Previous logos' : 'Next logos'}
    className="customers-arrow"
  >
    <svg aria-hidden viewBox="0 0 16 16" className="size-[14px]">
      <path
        d={dir === 'prev' ? 'M10 3 5 8l5 5' : 'm6 3 5 5-5 5'}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);

/**
 * "Our partners and customers", a section of its own: one large tinted panel
 * (styles/home-customers.css) holding the eyebrow between its pulsing dots,
 * the heading, the customer logos in a slider (customer-slider.tsx moves it)
 * and a closing line with the way on to the case study. The logos stand on a
 * white strip, because many of the files carry a white plate, and its ends
 * fade. The space above the panel is this section's; the same space below it
 * is the top of the catalogue, whose ground starts white, so the section is
 * raised for the panel's shadow to fall over that. The heading, the row and
 * the closing line rise once as the section scrolls in.
 */
export function Customers() {
  return (
    <section aria-labelledby="customers-heading" className="relative z-[1] bg-neutral-0">
      <div className="container-page pt-20 lg:pt-[120px]">
        <Motion
          threshold={0.2}
          replay={false}
          className="motion customers-panel flex flex-col items-center gap-8 px-3 py-10 max-md:mx-1 md:gap-10 md:px-10 md:py-14 lg:px-12 lg:py-[72px]"
        >
          <div className="customers-rise flex max-w-[880px] flex-col items-center gap-4 text-center">
            <p className="flex items-center gap-3 text-[11px] leading-4 font-semibold tracking-label text-brand-blue uppercase md:text-micro">
              <Dots order={[0, 1, 2]} />
              Our partners and customers
              <Dots order={[2, 1, 0]} />
            </p>
            <h2
              id="customers-heading"
              className="text-[28px] leading-[34px] font-extrabold tracking-[-0.03em] text-balance text-text md:text-[40px] md:leading-[48px] md:tracking-[-0.035em]"
            >
              Trusted by teams who rely on real-time weather intelligence to make critical decisions
            </h2>
          </div>

          <CustomerSlider className="customers-rise flex w-full items-center gap-1.5 [--i:1] md:gap-4">
            <Arrow dir="prev" />
            <div className="customers-strip">
              <div data-slider-view className="customers-view">
                <ul className="customers-track">
                  {customers.map((customer) => (
                    <li key={customer.file} className="customers-logo">
                      <Image
                        src={`/logos/customers/${customer.file}.png`}
                        alt={customer.name}
                        width={customer.width}
                        height={customer.height}
                        sizes="160px"
                        style={{ '--s': customer.scale } as React.CSSProperties}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Arrow dir="next" />
          </CustomerSlider>

          <p className="customers-rise flex flex-col items-center gap-2 text-center text-body-s leading-5 text-text-muted [--i:2] lg:flex-row lg:gap-4">
            {customers.length} partners and customers across golf, sports, schools and agriculture
            <span aria-hidden className="hidden h-4 w-px bg-border-strong lg:block" />
            <Link href="/case-studies/troon/" className="font-bold text-brand-blue hover:underline">
              Read the Troon case study <span aria-hidden>→</span>
            </Link>
          </p>
        </Motion>
      </div>
    </section>
  );
}
