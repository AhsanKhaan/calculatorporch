import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import ToolList from '@/components/ToolList';
import { categoryPath, publishedCategories, publishedInstances, publishedTools } from '@/content/registry';
import { SITE } from '@/content/site';
import { collectionGraph } from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/metadata';

const META = {
  title: 'All Calculators A–Z',
  description: `Every free calculator on ${SITE.name}, listed by category: math, statistics, everyday life, construction, finance, food, pets, sports and more.`,
  path: '/calculators/',
};
export const metadata = pageMetadata(META);

/** The A–Z index (calculator.net's sitemap.html pattern): every published tool, grouped by category. */
export default function AllCalculatorsPage() {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'All calculators', path: META.path },
  ];
  const sorted = [...publishedTools].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <>
      <JsonLd data={collectionGraph({ path: META.path, name: META.title, description: META.description, crumbs, items: sorted })} />
      <Breadcrumbs crumbs={crumbs} />
      <h1>All calculators</h1>
      <p className="lede">
        {publishedTools.length} free calculators in {publishedCategories.length} categories. Every one shows its formula, a worked example and its sources.
      </p>
      <div className="hub-grid">
        {publishedCategories.map((c) => (
          <section key={c.slug} className="card" aria-labelledby={`az-${c.slug}`}>
            <h2 id={`az-${c.slug}`}>
              <Link href={categoryPath(c)}>{c.name}</Link>
            </h2>
            <ToolList tools={sorted.filter((t) => t.category.slug === c.slug)} compact />
          </section>
        ))}
      </div>
      {publishedInstances.length ? (
        <section aria-labelledby="az-answers">
          <h2 id="az-answers">Worked answers</h2>
          <ul className="link-list">
            {publishedInstances.map((i) => (
              <li key={i.url}>
                <Link href={i.url}>{i.name}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
