/**
 * JSON-LD builders (docs/04 §7): one @graph per page.
 * Never: aggregateRating, review, HowTo, SearchAction (docs/04 §7, playbook §10).
 */
import { SITE, absoluteUrl } from '@/content/site';
import type { Faq, Tool } from '@/content/schema';

type Node = Record<string, unknown>;

export interface Crumb {
  name: string;
  path: string;
}

/**
 * SEC-CODE-02: serialize for a <script type="application/ld+json"> tag. Escapes <, >, & and the
 * JS line separators so text such as "</script>" in a FAQ answer can't close the tag.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

const ORG_ID = absoluteUrl('/#org');
const WEBSITE_ID = absoluteUrl('/#website');
const AUTHOR_ID = absoluteUrl(`${SITE.author.path}#person`);

export const organization = (): Node => ({
  '@type': 'Organization',
  '@id': ORG_ID,
  name: SITE.name,
  url: absoluteUrl('/'),
});

export const website = (): Node => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: absoluteUrl('/'),
  name: SITE.name,
  description: SITE.description,
  publisher: { '@id': ORG_ID },
  inLanguage: SITE.locale,
});

export const author = (): Node => ({
  '@type': 'Person',
  '@id': AUTHOR_ID,
  name: SITE.author.name,
  url: absoluteUrl(SITE.author.path),
  ...(SITE.author.sameAs.length ? { sameAs: [...SITE.author.sameAs] } : {}),
});

export const breadcrumb = (path: string, crumbs: Crumb[]): Node => ({
  '@type': 'BreadcrumbList',
  '@id': absoluteUrl(`${path}#breadcrumb`),
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: absoluteUrl(c.path),
  })),
});

export const faqPage = (path: string, faqs: readonly Faq[]): Node => ({
  '@type': 'FAQPage',
  '@id': absoluteUrl(`${path}#faq`),
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a }, // identical to the visible answer (tested)
  })),
});

interface PageInfo {
  path: string;
  name: string;
  description: string;
  published?: string;
  updated?: string;
  type?: 'WebPage' | 'CollectionPage' | 'AboutPage' | 'ContactPage';
  withAuthor?: boolean;
  extra?: Node;
}

export const webPage = (p: PageInfo): Node => ({
  '@type': p.type ?? 'WebPage',
  '@id': absoluteUrl(p.path),
  url: absoluteUrl(p.path),
  name: p.name,
  description: p.description,
  isPartOf: { '@id': WEBSITE_ID },
  breadcrumb: { '@id': absoluteUrl(`${p.path}#breadcrumb`) },
  inLanguage: SITE.locale,
  ...(p.withAuthor ? { author: { '@id': AUTHOR_ID } } : {}),
  ...(p.published ? { datePublished: p.published } : {}),
  ...(p.updated ? { dateModified: p.updated } : {}),
  ...(p.extra ?? {}),
});

export const graph = (...nodes: Node[]): Node => ({ '@context': 'https://schema.org', '@graph': nodes });

/** Category pages and the A–Z index: CollectionPage + ItemList of every listed tool. */
export function collectionGraph(p: { path: string; name: string; description: string; crumbs: Crumb[]; items: readonly { name: string; url: string }[] }): Node {
  return graph(
    organization(),
    website(),
    webPage({
      path: p.path,
      name: p.name,
      description: p.description,
      type: 'CollectionPage',
      extra: { mainEntity: { '@type': 'ItemList', numberOfItems: p.items.length, itemListElement: p.items.map((t, i) => ({ '@type': 'ListItem', position: i + 1, url: absoluteUrl(t.url), name: t.name })) } },
    }),
    breadcrumb(p.path, p.crumbs),
  );
}

/** Programmatic instance pages: WebPage about the parent calculator, breadcrumb, FAQ. */
export function instanceGraph(i: { url: string; title: string; description: string; faqs: readonly Faq[] }, parentUrl: string, crumbs: Crumb[], updated: string): Node {
  return graph(
    organization(),
    website(),
    author(),
    webPage({ path: i.url, name: i.title, description: i.description, updated, withAuthor: true, extra: { about: { '@id': absoluteUrl(`${parentUrl}#app`) } } }),
    breadcrumb(i.url, crumbs),
    faqPage(i.url, i.faqs),
  );
}

export function toolGraph(tool: Tool, path: string, crumbs: Crumb[]): Node {
  return graph(
    organization(),
    website(),
    author(),
    webPage({ path, name: tool.title, description: tool.description, published: tool.published, updated: tool.updated, withAuthor: true }),
    {
      '@type': 'WebApplication',
      '@id': absoluteUrl(`${path}#app`),
      name: tool.name,
      url: absoluteUrl(path),
      applicationCategory: tool.appCategory,
      operatingSystem: 'Any (web browser)',
      browserRequirements: 'Requires JavaScript',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      publisher: { '@id': ORG_ID },
    },
    breadcrumb(path, crumbs),
    faqPage(path, tool.faqs),
  );
}
