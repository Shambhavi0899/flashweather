import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { LegalDocumentPage } from '@/components/legal/legal-document';
import { legalInformation as doc } from '@/content/legal';
import { JsonLd, webPageSchema } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: doc.title,
  description: doc.description,
  path: doc.path,
});

/** The legal information page, verbatim from the live site; the template lays it out. */
export default function LegalInformationPage() {
  return (
    <>
      <SiteHeader tone="light" />
      <main id="main">
        <JsonLd
          schema={webPageSchema({ type: 'WebPage', name: doc.headline, description: doc.description, path: doc.path })}
        />
        <LegalDocumentPage doc={doc} />
      </main>
      <SiteFooter />
    </>
  );
}
