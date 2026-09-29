import type { Thing, WithContext } from 'schema-dts';

import { absoluteUrl, site } from './site';

/**
 * Structured data, as JSON-LD.
 *
 * JSON-LD rather than microdata because it is the only format Google
 * documents as recommended, and because it keeps the markup out of the
 * component tree -- the schema can be corrected without touching the layout.
 *
 * Typed against schema-dts so a mistyped property is a build error rather than
 * something you discover in Search Console six weeks later.
 */

/** Renders a schema object into the script tag Google looks for. */
export function JsonLd<T extends Thing>({ schema }: { schema: WithContext<T> }) {
  return (
    <script
      type="application/ld+json"
      // The content is our own serialised object, never user input. JSON.stringify
      // escapes quotes but not `<`, so a `</script>` inside a string would close
      // the tag early -- hence the replace.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
    />
  );
}

/** The company. Belongs on the root layout, once, and nowhere else. */
export function organizationSchema(): WithContext<Thing> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': absoluteUrl('/#organization'),
    name: site.name,
    url: site.url,
    description: site.description,
    logo: absoluteUrl('/logo.png'),
    legalName: site.legalName,
    email: site.email,
    foundingDate: site.foundingDate,
    address: { '@type': 'PostalAddress', ...site.address },
    sameAs: Object.values(site.social),
  } as WithContext<Thing>;
}

/**
 * The site itself. Paired with Organization by @id so the two are one entity
 * rather than two unrelated things that happen to share a domain.
 */
export function websiteSchema(): WithContext<Thing> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': absoluteUrl('/#website'),
    name: site.name,
    url: site.url,
    publisher: { '@id': absoluteUrl('/#organization') },
    inLanguage: site.lang,
  } as WithContext<Thing>;
}

/**
 * The trail Google prints under the result instead of a bare URL.
 *
 * Pass the ancestors in order, excluding the current page's own descendants.
 */
export function breadcrumbSchema(trail: { name: string; path: string }[]): WithContext<Thing> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  } as WithContext<Thing>;
}

/** Eligible for the expandable FAQ block in search results. */
export function faqSchema(faqs: { question: string; answer: string }[]): WithContext<Thing> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  } as WithContext<Thing>;
}

/** For anything with a byline and a date -- blog posts, case studies. */
export function articleSchema(article: {
  title: string;
  description: string;
  path: string;
  published: string;
  modified?: string;
  author?: string;
}): WithContext<Thing> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: absoluteUrl(article.path),
    datePublished: article.published,
    dateModified: article.modified ?? article.published,
    author: { '@type': article.author ? 'Person' : 'Organization', name: article.author ?? site.name },
    publisher: { '@id': absoluteUrl('/#organization') },
  } as WithContext<Thing>;
}

/**
 * The product, as a named service for a named industry.
 *
 * This is what makes a vertical page eligible to rank for "hail alerts for
 * roofing contractors" rather than only for the company name.
 */
export function serviceSchema(service: {
  name: string;
  description: string;
  path: string;
  industry: string;
}): WithContext<Thing> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    url: absoluteUrl(service.path),
    serviceType: 'Weather prediction and alerting',
    audience: { '@type': 'BusinessAudience', name: service.industry },
    provider: { '@id': absoluteUrl('/#organization') },
  } as WithContext<Thing>;
}

/**
 * A page that is itself a typed thing: a collection (blog index, industries
 * index), the contact page, the about page. Tied to the site by @id so it is
 * read as part of it rather than as a free-standing document.
 */
export function webPageSchema(page: {
  type: 'WebPage' | 'CollectionPage' | 'ContactPage' | 'AboutPage' | 'FAQPage';
  name: string;
  description: string;
  path: string;
}): WithContext<Thing> {
  return {
    '@context': 'https://schema.org',
    '@type': page.type,
    name: page.name,
    description: page.description,
    url: absoluteUrl(page.path),
    isPartOf: { '@id': absoluteUrl('/#website') },
    about: { '@id': absoluteUrl('/#organization') },
    inLanguage: site.lang,
  } as WithContext<Thing>;
}

/**
 * A Flash product as software. Only assert `offers` when a price is public --
 * an Offer with no price is a Rich Results error, not a neutral omission.
 */
export function softwareApplicationSchema(app: {
  name: string;
  description: string;
  path: string;
  category?: string;
  operatingSystem?: string;
}): WithContext<Thing> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.name,
    description: app.description,
    url: absoluteUrl(app.path),
    applicationCategory: app.category ?? 'BusinessApplication',
    operatingSystem: app.operatingSystem ?? 'Web, iOS, Android',
    publisher: { '@id': absoluteUrl('/#organization') },
  } as WithContext<Thing>;
}

/** The platform as a Product, for the home page and the products index. */
export function productSchema(product: {
  name: string;
  description: string;
  path: string;
  image?: string;
}): WithContext<Thing> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    url: absoluteUrl(product.path),
    ...(product.image ? { image: absoluteUrl(product.image) } : {}),
    brand: { '@id': absoluteUrl('/#organization') },
    manufacturer: { '@id': absoluteUrl('/#organization') },
  } as WithContext<Thing>;
}

/** An ordered list of links -- the pages a hub page exists to point at. */
export function itemListSchema(items: { name: string; path: string }[]): WithContext<Thing> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  } as WithContext<Thing>;
}

/**
 * The blog as a whole, for the blog index. Lists only posts that exist, so
 * every `blogPost` URL resolves.
 */
export function blogSchema(blog: {
  name: string;
  description: string;
  path: string;
  posts: { headline: string; path: string; published: string; modified?: string; author?: string }[];
}): WithContext<Thing> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: blog.name,
    description: blog.description,
    url: absoluteUrl(blog.path),
    publisher: { '@id': absoluteUrl('/#organization') },
    inLanguage: site.lang,
    blogPost: blog.posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.headline,
      url: absoluteUrl(post.path),
      datePublished: post.published,
      dateModified: post.modified ?? post.published,
      author: { '@type': post.author ? 'Person' : 'Organization', name: post.author ?? site.name },
    })),
  } as WithContext<Thing>;
}

/** A data table that is the substance of a page (a policy's threshold table). */
export function tableSchema(table: { name: string; about: string; path: string }): WithContext<Thing> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Table',
    name: table.name,
    about: table.about,
    url: absoluteUrl(table.path),
    isPartOf: { '@id': absoluteUrl('/#website') },
  } as WithContext<Thing>;
}

/**
 * A glossary that is visible on the page. Each term is a DefinedTerm in the
 * set; only assert it where the terms and definitions are on the page.
 */
export function definedTermSetSchema(set: {
  name: string;
  path: string;
  terms: { term: string; definition: string }[];
}): WithContext<Thing> {
  const url = absoluteUrl(set.path);
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': `${url}#glossary`,
    name: set.name,
    url,
    hasDefinedTerm: set.terms.map((t) => ({
      '@type': 'DefinedTerm',
      name: t.term,
      description: t.definition,
      inDefinedTermSet: { '@id': `${url}#glossary` },
    })),
  } as WithContext<Thing>;
}

/**
 * A technical document with a named author (a method or specification page).
 * Dates are optional: pass them only when the page shows them.
 */
export function techArticleSchema(article: {
  title: string;
  description: string;
  path: string;
  author: { name: string; jobTitle?: string };
  published?: string;
  modified?: string;
}): WithContext<Thing> {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.title,
    description: article.description,
    url: absoluteUrl(article.path),
    mainEntityOfPage: absoluteUrl(article.path),
    ...(article.published ? { datePublished: article.published, dateModified: article.modified ?? article.published } : {}),
    author: {
      '@type': 'Person',
      name: article.author.name,
      ...(article.author.jobTitle ? { jobTitle: article.author.jobTitle } : {}),
      worksFor: { '@id': absoluteUrl('/#organization') },
    },
    publisher: { '@id': absoluteUrl('/#organization') },
    inLanguage: site.lang,
  } as WithContext<Thing>;
}

/**
 * A dataset the page describes and tells readers how to obtain. Without a
 * public download, it says how to request it rather than asserting a
 * distribution URL that does not exist.
 */
export function datasetSchema(dataset: {
  name: string;
  description: string;
  path: string;
  variables: string[];
  howToObtain: string;
  format?: string;
}): WithContext<Thing> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: dataset.name,
    description: dataset.description,
    url: absoluteUrl(dataset.path),
    creator: { '@id': absoluteUrl('/#organization') },
    publisher: { '@id': absoluteUrl('/#organization') },
    variableMeasured: dataset.variables,
    usageInfo: dataset.howToObtain,
    ...(dataset.format ? { encodingFormat: dataset.format } : {}),
  } as WithContext<Thing>;
}

/**
 * A named person the page is about -- the founder on /about-us/. Tied to the
 * Organization by @id rather than restating it.
 */
export function personSchema(person: {
  name: string;
  jobTitle: string;
  description: string;
  path: string;
  image?: string;
}): WithContext<Thing> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    jobTitle: person.jobTitle,
    description: person.description,
    url: absoluteUrl(person.path),
    worksFor: { '@id': absoluteUrl('/#organization') },
    ...(person.image ? { image: absoluteUrl(person.image) } : {}),
  } as WithContext<Thing>;
}
