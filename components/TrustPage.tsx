import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import { shortDate } from '@/lib/engine/format';
import { author, breadcrumb, graph, organization, webPage, website } from '@/lib/seo/jsonld';

type PageType = 'WebPage' | 'AboutPage' | 'ContactPage';

/** Shared shell for About, Methodology, Privacy, Disclosure and Contact. */
export default function TrustPage({
  path,
  name,
  title,
  description,
  updated,
  type = 'WebPage',
  children,
}: {
  path: string;
  name: string;
  title: string;
  description: string;
  updated: string;
  type?: PageType;
  children: React.ReactNode;
}) {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name, path },
  ];
  const extra = type === 'AboutPage' ? { mainEntity: { '@id': (author() as { '@id': string })['@id'] } } : undefined;
  return (
    <>
      <JsonLd
        data={graph(
          organization(),
          website(),
          ...(type === 'AboutPage' ? [author()] : []),
          webPage({ path, name: title, description, updated, type, extra }),
          breadcrumb(path, crumbs),
        )}
      />
      <Breadcrumbs crumbs={crumbs} />
      <article className="prose">
        {children}
        <p className="muted">
          Last updated <time dateTime={updated}>{shortDate(updated)}</time>
        </p>
      </article>
    </>
  );
}
