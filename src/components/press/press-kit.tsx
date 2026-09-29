import Image from 'next/image';

import { ButtonLink } from '@/components/button';
import {
  boilerplate,
  factSheet,
  founderBio,
  logoFiles,
  logoVariants,
  pressFiles,
  productImagery,
} from '@/content/press';
import { site } from '@/lib/seo/site';

const label = 'text-micro font-semibold tracking-label text-viz-gold uppercase';
const fileLink = 'inline-flex min-h-11 items-center md:min-h-0 text-body-s text-text-on-dark underline decoration-white/30 underline-offset-4 hover:decoration-white';
const footLink = 'inline-flex min-h-11 items-center md:min-h-0 text-caption font-medium text-text-on-dark-muted hover:text-text-on-dark';

/**
 * The press kit, every file served from our own domain (audit: the old kit
 * linked to a staging server). Each panel has an anchor -- #logos,
 * #boilerplate, #founder-bio, #fact-sheet -- so a retired kit URL can
 * redirect to the exact piece it used to serve.
 */
export function PressKit() {
  return (
    <section id="press-kit" aria-labelledby="press-kit-heading" className="scroll-mt-6 bg-brand-navy">
      <div className="container-page flex flex-col gap-12 py-16 lg:py-[112px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="flex max-w-[800px] flex-col gap-4">
            <h2
              id="press-kit-heading"
              className="text-[30px] leading-[36px] font-extrabold tracking-[-0.03em] text-text-on-dark md:text-h1 md:leading-h1"
            >
              Press kit: self-hosted, no staging links
            </h2>
            <p className="text-[17px] leading-h4 text-pretty text-[#C9D1E3]">
              Every file below is served from flashweather.ai/press/. The staging-server links in the old kit are
              retired and redirect here.
            </p>
          </div>
          <ButtonLink href={pressFiles.kitZip} variant="outline-dark" className="self-start rounded-full lg:self-auto">
            Download press kit · ZIP
          </ButtonLink>
        </div>

        <div className="grid rounded-[20px] border border-white/10 bg-[#040818B8] md:grid-cols-2 xl:grid-cols-4">
          <div
            id="logos"
            className="flex scroll-mt-6 flex-col gap-3 border-b border-white/10 px-6 py-[28px] md:border-r xl:border-b-0"
          >
            <h3 className={label}>Logo files</h3>
            <div className="flex h-16 items-center rounded-md bg-neutral-0 px-4">
              <Image
                src="/images/press/flash-weather-ai-logo-press-kit.svg"
                alt="Flash Weather AI wordmark with the lightning-bolt mark, press-kit version on a white ground, self-hosted at flashweather.ai/press/"
                width={244}
                height={32}
                unoptimized
                className="h-auto w-full max-w-[220px]"
              />
            </div>
            <ul className="flex flex-col gap-3">
              {logoFiles.map((file) => (
                <li key={file.href}>
                  <a href={file.href} download className={fileLink}>
                    {file.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-body-s text-text-on-dark">Reversed and mono versions of each</p>
            <ul className="flex flex-wrap gap-x-3 gap-y-1">
              {logoVariants.map((file) => (
                <li key={file.href}>
                  <a href={file.href} download className={footLink}>
                    {file.label}
                  </a>
                </li>
              ))}
            </ul>
            <a href={pressFiles.kitZip} download className={footLink}>
              Every logo file, in the press kit ZIP <span aria-hidden>→</span>
            </a>
          </div>

          <div id="boilerplate" className="flex scroll-mt-6 flex-col gap-3 border-b border-white/10 px-6 py-[28px] xl:border-r xl:border-b-0">
            <h3 className={label}>Boilerplate</h3>
            <p className="text-body-s text-text-on-dark">{boilerplate.text}</p>
            <p className="text-caption text-text-on-dark-muted">{boilerplate.note}</p>
            <a href={pressFiles.boilerplate} download className={footLink}>
              Download boilerplate · TXT <span aria-hidden>→</span>
            </a>
          </div>

          <div
            id="founder-bio"
            className="flex scroll-mt-6 flex-col gap-3 border-b border-white/10 px-6 py-[28px] md:border-r md:border-b-0"
          >
            <h3 className={label}>Founder bio</h3>
            <p className="text-body-s text-text-on-dark">{founderBio}</p>
            <a href={pressFiles.founderBio} download className={footLink}>
              Download founder bio · TXT <span aria-hidden>→</span>
            </a>
            <a href={`mailto:${site.email}?subject=Founder%20photo%20request`} className={footLink}>
              Founder photo: request from {site.email} <span aria-hidden>→</span>
            </a>
          </div>

          <div id="fact-sheet" className="flex scroll-mt-6 flex-col gap-3 px-6 py-[28px]">
            <h3 className={label}>Fact sheet</h3>
            <ul className="flex flex-col gap-3">
              {factSheet.map((fact) => (
                <li key={fact} className="text-body-s text-text-on-dark">
                  {fact}
                </li>
              ))}
            </ul>
            <a href={pressFiles.factSheet} download className={footLink}>
              Download fact sheet · TXT <span aria-hidden>→</span>
            </a>
            <h3 className={`${label} pt-2`}>Press contact</h3>
            <a href={`mailto:${site.email}`} className="text-body leading-[22px] font-semibold text-text-on-dark hover:underline">
              {site.email}
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-[18px]">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-micro font-bold tracking-[0.13em] text-viz-gold uppercase">Product imagery in the kit</h3>
            <p className="text-caption text-neutral-400">Print-resolution PNG, served from flashweather.ai</p>
          </div>
          <ul className="grid gap-6 md:grid-cols-3">
            {productImagery.map((item) => (
              <li key={item.file}>
                <a
                  href={item.href}
                  download
                  className="group flex flex-col overflow-hidden rounded-lg border border-white/12 bg-brand-navy-deep"
                >
                  <span className="relative block aspect-[400/210]">
                    <Image
                      src={item.href}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 1440px) 400px, (min-width: 768px) 30vw, calc(100vw - 32px)"
                      className={item.fit === 'contain' ? 'object-contain' : 'object-cover'}
                    />
                  </span>
                  <span className="flex flex-col gap-[2px] px-[18px] pt-[14px] pb-[18px]">
                    <span className="text-[15px] leading-5 font-extrabold text-text-on-dark group-hover:underline">
                      {item.title}
                    </span>
                    <span className="text-micro text-neutral-400">{item.file}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
