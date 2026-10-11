import Link from 'next/link';
import TrustPage from '@/components/TrustPage';
import { AUTHOR } from '@/content/registry';
import { SITE } from '@/content/site';
import { pageMetadata } from '@/lib/seo/metadata';

const META = {
  title: 'Editorial Policy: How Calculators Are Built and Checked',
  description: `How ${SITE.name} chooses sources, verifies formulas and data, tests every calculator, and handles corrections and updates.`,
  path: '/editorial-policy/',
};
export const metadata = pageMetadata(META);

export default function EditorialPolicyPage() {
  return (
    <TrustPage path={META.path} name="Editorial policy" title={META.title} description={META.description} updated="2026-10-11">
      <h1>Editorial policy</h1>
      <h2>Who writes the calculators</h2>
      <p>
        Every calculator is written, built and reviewed by <Link href={AUTHOR.path}>{SITE.author.name}</Link>. Pages never claim a reviewer or a
        credential that doesn&apos;t exist.
      </p>
      <h2>Formulas and sources</h2>
      <ul>
        <li>Each calculator uses a published, standard formula, shown on the page with a worked example you can check by hand.</li>
        <li>Constants, prices and rates come from cited primary or authoritative sources (for example government statistics), listed with the date they were checked.</li>
        <li>A page isn&apos;t published until every constant on it has a cited source; estimates and assumptions are labelled as such.</li>
      </ul>
      <h2>Testing</h2>
      <p>
        The same code runs in your browser and in an automated test suite. Every calculator has reference test cases, including the worked
        examples published on its page, and the site can&apos;t be deployed if any test fails. See the <Link href="/methodology/">methodology</Link>.
      </p>
      <h2>Independence</h2>
      <p>
        Results never depend on advertisers, affiliates or partners. If the site adds ads or affiliate links, they will be labelled, and the{' '}
        <Link href="/disclosure/">disclosure page</Link> will list them.
      </p>
      <h2>Corrections and updates</h2>
      <p>
        Found an error? Email <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a> with the page and the link from &ldquo;Copy link&rdquo;.
        Confirmed errors are fixed promptly and logged on the methodology page with the date; each page shows when it was last reviewed.
      </p>
      <h2>Health, money and safety</h2>
      <p>
        Calculators give estimates to help you plan. They aren&apos;t medical, veterinary, financial, legal or engineering advice, and pages say so where
        it matters.
      </p>
    </TrustPage>
  );
}
