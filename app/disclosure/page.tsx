import TrustPage from '@/components/TrustPage';
import { SITE } from '@/content/site';
import { pageMetadata } from '@/lib/seo/metadata';

const META = {
  title: 'Advertising and Affiliate Disclosure',
  description: `How ${SITE.name} is funded: currently no ads, affiliate links or sponsored content. Payments never change a calculator's result.`,
  path: '/disclosure/',
};
export const metadata = pageMetadata(META);

// Must match reality (SEC-AFF-01, SEC-PRIV-04). Update in the same change that adds ads or affiliate links.
export default function DisclosurePage() {
  return (
    <TrustPage path={META.path} name="Disclosure" title={META.title} description={META.description} updated="2026-10-11">
      <h1>Advertising and affiliate disclosure</h1>
      <p>
        {SITE.name} is free to use. Right now the site has <strong>no ads, no affiliate links and no sponsored content</strong>.
      </p>
      <h2>If that changes</h2>
      <ul>
        <li>Every affiliate link will be labelled right next to the link, and the programme will be listed on this page.</li>
        <li>Ads will be labelled &ldquo;Advertisement&rdquo; and never placed inside a calculator or its result.</li>
        <li>No payment, partner or advertiser ever changes a formula or a result.</li>
      </ul>
      <p>
        Questions: <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
      </p>
    </TrustPage>
  );
}
