import Image from 'next/image';

import { ButtonLink } from '@/components/button';
import { Motion } from '@/components/motion';
import { DEMO_HREF } from '@/content/navigation';
import { devicesImage } from '@/content/home';

import { DevicesOverlay } from './devices-overlay';

export function SeeWhatsComing() {
  return (
    <section aria-labelledby="coming-heading" className="bg-brand-navy-deep">
      <div className="container-page flex flex-col gap-12 py-20 lg:flex-row lg:items-center lg:gap-16 lg:py-28">
        <div className="flex flex-col gap-[26px] lg:w-[480px] lg:shrink xl:shrink-0">
          <p className="text-micro font-bold tracking-[0.13em] text-viz-gold uppercase">One engine · every screen</p>
          <h2
            id="coming-heading"
            className="text-[44px] leading-[48px] font-extrabold tracking-[-0.05em] text-text-on-dark sm:text-[64px] sm:leading-[68px] sm:tracking-[-0.065em]"
          >
            <span className="block">See what&rsquo;s coming</span>
            <span className="block">before it&rsquo;s</span>
            <span className="text-gold-metallic">too late.</span>
          </h2>
          <p className="max-w-[420px] text-body leading-[27px] text-pretty text-[#C9D1E3]">
            Flash combines decades of meteorological expertise with advanced modeling to deliver real-time, predictive
            forecasts. Act faster, reduce disruptions, and manage weather risk with confidence.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href={DEMO_HREF} variant="gold" size="hero" icon="↗">
              Book a demo
            </ButtonLink>
            <ButtonLink href="#platform" variant="outline-dark" size="hero" icon="↓">
              See the platform
            </ButtonLink>
          </div>
        </div>

        <figure className="flex min-w-0 grow flex-col gap-[18px]">
          {/* The screens come alive on top of the still (devices-overlay.tsx):
              the loops run while in view, the gauge plays once, and the
              "9.0" counts up. */}
          <Motion
            count="9.0"
            replay={false}
            className="motion devices relative aspect-[704/393] w-full overflow-hidden rounded-[12px]"
          >
            <Image
              src={devicesImage.src}
              alt={devicesImage.alt}
              fill
              sizes="(min-width: 1440px) 704px, (min-width: 1024px) 50vw, 100vw"
              quality={90}
              className="object-cover"
            />
            <DevicesOverlay />
          </Motion>
          <figcaption className="text-[11px] leading-[14px] font-bold tracking-[0.1em] text-[#8F9AB8] uppercase">
            Weather Command Center and the Flash Mobile App. One prediction engine.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
