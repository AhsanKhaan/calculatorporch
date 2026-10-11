import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import Byline from '@/components/Byline';
import DataTable from '@/components/DataTable';
import Faq from '@/components/Faq';
import JsonLd from '@/components/JsonLd';
import QuickAnswer from '@/components/QuickAnswer';
import ToolList from '@/components/ToolList';
import { ISLANDS } from '@/components/calculators';
import { BUILD_TODAY, publishedInstances } from '@/content/registry';
import { anchorId } from '@/lib/format';
import { crumbsForInstance, nearbyInstances, related } from '@/lib/links';
import { longDate } from '@/lib/engine/format';
import { instanceGraph } from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/metadata';

export const dynamicParams = false;

/** Children of a calculator: programmatic instances (and guides, once written). */
export function generateStaticParams() {
  return publishedInstances.map((i) => {
    const [, category, slug, child] = i.url.split('/');
    return { category: category!, slug: slug!, child: child! };
  });
}

type Props = { params: Promise<{ category: string; slug: string; child: string }> };

const find = async (params: Props['params']) => {
  const { category, slug, child } = await params;
  return publishedInstances.find((i) => i.url === `/${category}/${slug}/${child}/`);
};

export async function generateMetadata({ params }: Props) {
  const i = await find(params);
  return i ? pageMetadata({ title: i.title, description: i.description, path: i.url }) : {};
}

/**
 * Programmatic instance page (docs/10 §5): answer, steps, unique table, embedded calculator, FAQs, links up.
 * Same heading rules as tool pages (docs/05 §1a): one H1, an H2 per block, FAQ questions as H3s.
 */
export default async function InstancePage({ params }: Props) {
  const i = await find(params);
  const Island = i ? ISLANDS[i.island.id] : undefined;
  if (!i || !Island) notFound();
  const crumbs = crumbsForInstance(i);
  const nearby = nearbyInstances(i);
  const rel = related(i.parent, 2);
  const tableId = anchorId(i.table.caption);

  return (
    <>
      <JsonLd data={instanceGraph(i, i.parent.url, crumbs, BUILD_TODAY)} />
      <Breadcrumbs crumbs={crumbs} />
      <h1>{i.h1}</h1>
      <Byline updated={i.parent.updated} />
      <QuickAnswer text={i.directAnswer} />

      <section className="card answer" aria-label="Answer">
        <p className="result-label">{i.answer.label}</p>
        <p className="price" data-testid="instance-answer">
          {i.answer.value}
        </p>
        {i.dateDependent ? <p className="hint">Worked out for {longDate(BUILD_TODAY)}. The calculator below uses your device&apos;s date.</p> : null}
        <p>
          <Link href={i.parent.url} className="parent-link">
            Open the {i.parent.name} →
          </Link>
        </p>
      </section>

      <div className="content">
        <section aria-labelledby="steps">
          <h2 id="steps">Step-by-step working</h2>
          <ol>
            {i.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </section>
      </div>

      <section className="page-section" aria-labelledby="try">
        <h2 id="try">Try other numbers</h2>
        <Island buildToday={BUILD_TODAY} initial={i.island.initial} />
      </section>

      <div className="content">
        <section aria-labelledby={tableId}>
          <h2 id={tableId}>{i.table.caption}</h2>
          <DataTable labelledBy={tableId} columns={i.table.columns} rows={i.table.rows} />
        </section>

        <Faq faqs={i.faqs} />

        {nearby.length ? (
          <section aria-labelledby="nearby">
            <h2 id="nearby">Similar answers</h2>
            <ul className="link-list">
              {nearby.map((x) => (
                <li key={x.url}>
                  <Link href={x.url}>{x.name}</Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        <section aria-labelledby="tools">
          <h2 id="tools">Related calculators</h2>
          <ToolList tools={[i.parent, ...rel]} compact />
        </section>
      </div>
    </>
  );
}
