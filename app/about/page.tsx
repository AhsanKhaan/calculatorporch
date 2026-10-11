import Link from 'next/link';
import TrustPage from '@/components/TrustPage';
import { SITE } from '@/content/site';
import { AUTHOR, categoryPath, publishedCategories } from '@/content/registry';
import { pageMetadata } from '@/lib/seo/metadata';

const META = {
  title: `About ${SITE.name} and Who Builds It`,
  description: `${SITE.name} is a free collection of sourced, tested online calculators for math, money, building and everyday life, by ${SITE.author.name}.`,
  path: '/about/',
};
export const metadata = pageMetadata(META);

export default function AboutPage() {
  return (
    <TrustPage path={META.path} name="About" title={META.title} description={META.description} updated="2026-10-11" type="AboutPage">
      <h1>About {SITE.name}</h1>
      <p>
        {SITE.name} is a free collection of online calculators for{' '}
        {publishedCategories.map((c, i) => (
          <span key={c.slug}>
            {i > 0 ? (i === publishedCategories.length - 1 ? ' and ' : ', ') : ''}
            <Link href={categoryPath(c)}>{c.name.toLowerCase()}</Link>
          </span>
        ))}
        , with more added as they&apos;re built and tested. Browse them all on the <Link href="/calculators/">A–Z list</Link>.
      </p>
      <h2>Who builds it</h2>
      <p>
        {SITE.name} is written and maintained by <Link href={AUTHOR.path}>{SITE.author.name}</Link>, who builds every calculator, formula
        and explanation on the site and reviews each page before it&apos;s published and whenever its data is refreshed.
      </p>
      <h2>How the calculators are built</h2>
      <ul>
        <li>Each tool uses a published formula, shown on its page with a worked example you can check by hand.</li>
        <li>Prices, rates and constants come from cited sources, listed with the date they were checked.</li>
        <li>The same code runs in your browser and in an automated test suite that runs on every update.</li>
        <li>Nothing you type is sent anywhere: calculations happen in your browser.</li>
      </ul>
      <p>
        The full detail is on the <Link href="/methodology/">methodology page</Link>. Results are estimates to help you plan,
        not professional, financial, legal or veterinary advice.
      </p>
      <h2>Contact</h2>
      <p>
        Questions, corrections or suggestions for a new calculator: <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
      </p>
    </TrustPage>
  );
}
