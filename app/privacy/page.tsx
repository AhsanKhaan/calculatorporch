import TrustPage from '@/components/TrustPage';
import { SITE } from '@/content/site';
import { pageMetadata } from '@/lib/seo/metadata';

const META = {
  title: 'Privacy Policy',
  description: `${SITE.name} collects no personal data: no accounts, no cookies, no analytics. Calculator inputs stay in your browser.`,
  path: '/privacy/',
};
export const metadata = pageMetadata(META);

// Must match what actually runs (SEC-PRIV-04). Update in the same change that adds any third party.
export default function PrivacyPage() {
  return (
    <TrustPage path={META.path} name="Privacy" title={META.title} description={META.description} updated="2026-10-11">
      <h1>Privacy policy</h1>
      <p>Short version: {SITE.name} doesn&apos;t collect personal data, set cookies or track you.</p>

      <h2>What we collect</h2>
      <ul>
        <li>No accounts, sign-ups, comments or forms.</li>
        <li>No cookies, analytics, advertising or tracking scripts.</li>
        <li>
          Calculator inputs are processed only in your browser. They&apos;re never sent to us. If you use &ldquo;Copy
          link&rdquo;, your inputs are placed in the link you copy, and only you decide who sees it.
        </li>
        <li>Your unit or display preferences, if a calculator offers them, are stored only in your own browser.</li>
      </ul>

      <h2>Hosting</h2>
      <p>
        The site is served by Cloudflare. Like any web host, Cloudflare processes technical request data (such as your IP
        address and browser type) to deliver the pages and protect the site from attacks. See{' '}
        <a href="https://www.cloudflare.com/privacypolicy/" rel="noopener noreferrer">
          Cloudflare&apos;s privacy policy
        </a>
        .
      </p>

      <h2>Email</h2>
      <p>If you email us, we use your address and message only to reply, and we don&apos;t share them.</p>

      <h2>Changes</h2>
      <p>
        If we ever add analytics, advertising or affiliate links, this page will be updated first, and where the law
        requires it, you&apos;ll be asked for consent before anything runs.
      </p>

      <h2>Contact</h2>
      <p>
        Privacy questions: <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
      </p>
    </TrustPage>
  );
}
