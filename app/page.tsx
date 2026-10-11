import Link from 'next/link';
import AdSlot from '@/components/AdSlot';
import Icon, { categoryIcon } from '@/components/Icon';
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

const FEATURES = [
  { icon: 'check', title: 'Every formula shown', text: 'Each result comes with the formula and a worked example you can check by hand.' },
  { icon: 'book', title: 'Sources you can check', text: 'Constants and prices come from cited sources, with the date we checked them.' },
  { icon: 'code', title: 'Tested on every update', text: 'The same code runs in your browser and in our automated tests. Nothing you type is sent anywhere.' },
] as const;

/** Home: descriptive H1 and an entity-defining first sentence (docs/05 §5), categories, popular tools, how it's built. */
export default function HomePage() {
  return (
    <>
      <JsonLd data={graph(organization(), website())} />
      <section className="hero">
        <span className="eyebrow">
          <span className="dot" aria-hidden="true" />
          {publishedTools.length} free calculators, formulas included
        </span>
        <h1>
          Free online calculators <span className="grad-text">with the working shown</span>
        </h1>
        <p className="lede">
          {SITE.name} is a free collection of calculators for math, money, building, food and everyday life. Each one shows its formula and
          a worked example, and nothing you type leaves your browser.
        </p>
        <div className="btns">
          <Link href="/calculators/" className="btn primary">
            Browse all calculators <Icon name="arrow" size={16} />
          </Link>
          <Link href="/methodology/" className="btn">
            How we check our numbers
          </Link>
        </div>
        <ul className="hero-stats">
          <li>
            <Icon name="check" size={16} /> {publishedCategories.length} categories
          </li>
          <li>
            <Icon name="check" size={16} /> Step-by-step working
          </li>
          <li>
            <Icon name="check" size={16} /> No sign-up
          </li>
        </ul>
      </section>

      <section className="page-section" aria-labelledby="categories">
        <div className="section-head">
          <h2 id="categories">Browse by category</h2>
          <Link href="/calculators/">All calculators A–Z</Link>
        </div>
        <div className="cat-grid reveal">
          {publishedCategories.map((c) => {
            const count = publishedTools.filter((t) => t.category.slug === c.slug).length;
            return (
              <section key={c.slug} className="cat-card" aria-labelledby={`cat-${c.slug}`}>
                <div className="cat-head">
                  <span className="icon-tile">
                    <Icon name={categoryIcon(c.slug)} />
                  </span>
                  <h3 id={`cat-${c.slug}`}>
                    <Link href={categoryPath(c)}>{c.name}</Link>
                  </h3>
                  <span className="count">{count}</span>
                </div>
                <ToolList tools={popularIn(c, 4)} compact />
                <Link href={categoryPath(c)} className="more">
                  All {c.name.toLowerCase()} calculators <Icon name="arrow" size={16} />
                </Link>
              </section>
            );
          })}
        </div>
      </section>

      <section className="page-section" aria-labelledby="popular">
        <h2 id="popular">Popular calculators</h2>
        <ToolList tools={popular(6)} reveal />
      </section>

      <AdSlot id="home-inline" />

      <section className="page-section" aria-labelledby="how-built">
        <h2 id="how-built">How every calculator is built</h2>
        <ul className="feature-grid">
          {FEATURES.map((f) => (
            <li key={f.title}>
              <span className="icon-tile">
                <Icon name={f.icon} />
              </span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </li>
          ))}
        </ul>
        <p className="muted">
          Read the <Link href="/methodology/">methodology</Link> and <Link href="/editorial-policy/">editorial policy</Link>.
        </p>
      </section>
    </>
  );
}
