import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import ToolList from '@/components/ToolList';
import { SITE } from '@/content/site';
import { categoryPath, publishedCategories, publishedTools } from '@/content/registry';
import { popular, popularIn } from '@/lib/links';
import { graph, organization, website } from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/metadata';

export const metadata = pageMetadata({
  title: 'Calculator Porch: Free Online Calculators With Steps',
  description: SITE.description,
  path: '/',
});

/** Home: a descriptive H1, an entity-defining first sentence (docs/05 §5), popular tools with descriptions, then every category. */
export default function HomePage() {
  return (
    <>
      <JsonLd data={graph(organization(), website())} />
      <section className="prose hero">
        <h1>Free online calculators with the working shown</h1>
        <p className="lede">
          {SITE.name} is a free collection of {publishedTools.length} calculators for math, money, building, food and everyday life. Each one shows
          its formula and a worked example, and nothing you type leaves your browser.
        </p>
      </section>

      <section className="page-section" aria-labelledby="popular">
        <h2 id="popular">Popular calculators</h2>
        <ToolList tools={popular(6)} />
      </section>

      <section className="page-section" aria-labelledby="categories">
        <h2 id="categories">Browse by category</h2>
        <div className="hub-grid">
          {publishedCategories.map((c) => {
            const count = publishedTools.filter((t) => t.category.slug === c.slug).length;
            return (
              <section key={c.slug} className="card" aria-labelledby={`cat-${c.slug}`}>
                <h3 id={`cat-${c.slug}`}>
                  <Link href={categoryPath(c)}>{c.name}</Link> <span className="muted">({count})</span>
                </h3>
                <ToolList tools={popularIn(c, 4)} compact />
                <p>
                  <Link href={categoryPath(c)}>All {c.name.toLowerCase()} calculators →</Link>
                </p>
              </section>
            );
          })}
        </div>
      </section>

      <section className="prose page-section" aria-labelledby="how-built">
        <h2 id="how-built">How every calculator is built</h2>
        <ul>
          <li>A published formula, with a worked example you can check by hand.</li>
          <li>Constants and prices from cited sources, with the date we checked them.</li>
          <li>The same code runs in your browser and in our automated tests.</li>
        </ul>
        <p>
          Read the <Link href="/methodology/">methodology</Link> and <Link href="/editorial-policy/">editorial policy</Link>, or see{' '}
          <Link href="/calculators/">all calculators A–Z</Link>.
        </p>
      </section>
    </>
  );
}
