import Link from 'next/link';
import Formula from '@/components/Formula';
import TrustPage from '@/components/TrustPage';
import electricity from '@/data/electricity-us.json';
import { SITE } from '@/content/site';
import { categoryPath, publishedCategories, publishedTools } from '@/content/registry';
import { DEFAULTS, calculate } from '@/lib/calculators/3d-printing-cost';
import { EXPLAINS } from '@/lib/calculators/explains';
import { pageMetadata } from '@/lib/seo/metadata';

const META = {
  title: 'Methodology: Formulas, Sources and Test Cases',
  description: `How ${SITE.name} builds and checks every calculator: published formulas, cited data sources, automated test cases and a public correction log.`,
  path: '/methodology/',
};
export const metadata = pageMetadata(META);

/** Every published calculator's formula (from its explainer, the same code the calculator runs), by category. */
export default function MethodologyPage() {
  const d = calculate(DEFAULTS);
  return (
    <TrustPage path={META.path} name="Methodology" title={META.title} description={META.description} updated="2026-10-11">
      <h1>Methodology</h1>
      <p>
        Every calculation on {SITE.name} is a small, published formula. The same code runs in your browser and in an automated test suite, and the
        site can&apos;t be deployed unless every test passes. Each calculator&apos;s page shows a worked example computed by that same code, so the published
        numbers always match what the calculator does.
      </p>
      <h2>How results are tested</h2>
      <ul>
        <li>Reference cases for every calculator: the worked examples published on its page plus hand-checked values.</li>
        <li>Edge cases: zero, the largest allowed values, and invalid input, which must never produce a blank or NaN result.</li>
        <li>
          Example: the 3D printing cost defaults must give a total cost of ${d.totalCost.toFixed(2)} and a price of ${d.price?.toFixed(2)}, matching the
          hand calculation on that page.
        </li>
      </ul>

      <h2>Formulas by calculator</h2>
      {publishedCategories.map((c) => (
        <section key={c.slug}>
          <h3>
            <Link href={categoryPath(c)}>{c.name}</Link>
          </h3>
          {publishedTools
            .filter((t) => t.category.slug === c.slug)
            .map((t) => {
              const ex = EXPLAINS[t.calculator]?.();
              return (
                <div key={t.url}>
                  <p>
                    <Link href={t.url}>{t.name}</Link>
                  </p>
                  {ex ? <Formula lines={ex.formula} /> : null}
                </div>
              );
            })}
        </section>
      ))}

      <h2>Data sources</h2>
      <ul>
        <li>
          Electricity prices: U.S. Energy Information Administration, Electric Power Monthly Table 5.6.A, residential average price by state,{' '}
          {electricity.period} (retrieved {electricity.retrieved}). Public-domain US government data, refreshed quarterly.
        </li>
        <li>Every other constant is cited on the page that uses it, with the date it was checked.</li>
      </ul>

      <h2>Corrections</h2>
      <p>
        Found an error? Email <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a> with the page and the link from &ldquo;Copy link&rdquo;.
        Fixes are logged below with dates. See also the <Link href="/editorial-policy/">editorial policy</Link>.
      </p>

      <h2>Changelog</h2>
      <ul>
        <li>
          <time dateTime="2026-10-11">2026-10-11</time>: {publishedTools.length} calculators added across {publishedCategories.length} categories.
        </li>
      </ul>
    </TrustPage>
  );
}
