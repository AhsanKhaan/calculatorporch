import Link from 'next/link';
import { notFound } from 'next/navigation';
import TrustPage from '@/components/TrustPage';
import { AUTHOR, categoryPath, publishedCategories, publishedTools } from '@/content/registry';
import { SITE } from '@/content/site';
import { pageMetadata } from '@/lib/seo/metadata';

export const dynamicParams = false;
export function generateStaticParams() {
  return [{ author: AUTHOR.slug }];
}

const META = {
  title: `${SITE.author.name}, Author of ${SITE.name}`,
  description: `${SITE.author.name} writes, builds and reviews every calculator on ${SITE.name}. See the calculators, the method and how to get in touch.`,
  path: AUTHOR.path,
};
export const metadata = pageMetadata(META);

/** Author profile (Omni's /authors/ pattern, E-E-A-T). Real identity only: no invented credentials. */
export default async function AuthorPage({ params }: { params: Promise<{ author: string }> }) {
  if ((await params).author !== AUTHOR.slug) notFound();
  return (
    <TrustPage path={META.path} name={SITE.author.name} title={META.title} description={META.description} updated="2026-10-11" type="AboutPage">
      <h1>{SITE.author.name}</h1>
      <p>
        {SITE.author.name} is the founder of {SITE.name} and writes, builds and reviews every calculator on the site: the formulas, the code, the
        worked examples and the explanations. Each calculator is checked against hand-worked examples and cited sources before it&apos;s published,
        and again whenever its data is refreshed.
      </p>
      <h2>Calculators</h2>
      <p>
        {publishedTools.length} calculators across{' '}
        {publishedCategories.map((c, i) => (
          <span key={c.slug}>
            {i > 0 ? (i === publishedCategories.length - 1 ? ' and ' : ', ') : ''}
            <Link href={categoryPath(c)}>{c.name.toLowerCase()}</Link>
          </span>
        ))}
        . See the full list on the <Link href="/calculators/">all calculators</Link> page.
      </p>
      <h2>How the work is checked</h2>
      <p>
        The <Link href="/methodology/">methodology</Link> page explains the formulas and test cases, and the <Link href="/editorial-policy/">editorial policy</Link>{' '}
        explains how sources are chosen and how corrections are handled.
      </p>
      <h2>Contact</h2>
      <p>
        <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
      </p>
    </TrustPage>
  );
}
