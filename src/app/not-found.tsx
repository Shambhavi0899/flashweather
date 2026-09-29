import { ButtonLink } from '@/components/button';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

/**
 * Any address that is not a page. It ends the way every page does, so a
 * visitor who lands here still has the whole site one link away. Next marks
 * it noindex itself; it takes no metadata of its own.
 */
export default function NotFound() {
  return (
    <>
      <SiteHeader tone="light" />
      <main id="main">
        <section aria-labelledby="not-found-heading" className="bg-neutral-0">
          <div className="container-page flex flex-col items-start gap-6 py-20 lg:py-[120px]">
            <p className="text-[11px] leading-[14px] font-semibold tracking-label-wide text-text-muted uppercase">
              Error 404
            </p>
            <h1
              id="not-found-heading"
              className="text-[28px] leading-[34px] font-extrabold tracking-[-0.03em] text-text md:text-h1 md:leading-h1"
            >
              This page is not here.
            </h1>
            <p className="max-w-narrow text-body leading-body text-pretty text-text-muted">
              The address may have changed, or the link that brought you here may be out of date. The home page and
              the platform overview are the quickest ways back in.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/" variant="blue">
                Go to the home page
              </ButtonLink>
              <ButtonLink href="/products/" variant="outline-light">
                See the platform
              </ButtonLink>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
