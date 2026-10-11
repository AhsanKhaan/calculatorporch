import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import ToolList from '@/components/ToolList';
import { categoryPath, publishedCategories, publishedInstances } from '@/content/registry';
import { categoryBySlug } from '@/content/taxonomy';
import { crumbsForCategory, popularIn, toolsBySubcategory } from '@/lib/links';
import { anchorId } from '@/lib/format';
import { collectionGraph } from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/metadata';

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedCategories.map((c) => ({ category: c.slug }));
}

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props) {
  const c = categoryBySlug((await params).category);
  return c ? pageMetadata({ title: c.title, description: c.description, path: categoryPath(c) }) : {};
}

/** Category page (Omni pattern): intro, every tool under its subcategory heading, popular, other categories. */
export default async function CategoryPage({ params }: Props) {
  const c = categoryBySlug((await params).category);
  if (!c || !publishedCategories.includes(c)) notFound();
  const groups = toolsBySubcategory(c);
  const all = groups.flatMap((g) => g.tools);
  const popular = popularIn(c, 6);
  const answers = publishedInstances.filter((i) => i.parent.category.slug === c.slug);
  return (
    <>
      <JsonLd data={collectionGraph({ path: categoryPath(c), name: c.title, description: c.description, crumbs: crumbsForCategory(c), items: all })} />
      <Breadcrumbs crumbs={crumbsForCategory(c)} />
      <h1>{c.name} Calculators</h1>
      <p className="lede">{c.intro}</p>

      {popular.length > 3 ? (
        <section aria-labelledby="popular-heading" className="card page-section">
          <h2 id="popular-heading">Popular in {c.name}</h2>
          <ToolList tools={popular} compact />
        </section>
      ) : null}

      {groups.map((g) => (
        <section key={g.subcategory} className="page-section" aria-labelledby={`sub-${anchorId(g.subcategory)}`}>
          <h2 id={`sub-${anchorId(g.subcategory)}`}>{g.subcategory}</h2>
          <ToolList tools={g.tools} />
        </section>
      ))}

      {answers.length ? (
        <section className="page-section" aria-labelledby="answers-heading">
          <h2 id="answers-heading">Worked answers</h2>
          <ul className="link-list">
            {answers.map((i) => (
              <li key={i.url}>
                <Link href={i.url}>{i.name}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <nav aria-label="Other categories" className="other-cats">
        <h2>Other categories</h2>
        <ul className="link-list">
          {publishedCategories
            .filter((x) => x.slug !== c.slug)
            .map((x) => (
              <li key={x.slug}>
                <Link href={categoryPath(x)}>{x.name}</Link>
              </li>
            ))}
        </ul>
      </nav>
    </>
  );
}
