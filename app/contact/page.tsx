import Link from 'next/link';
import TrustPage from '@/components/TrustPage';
import { SITE } from '@/content/site';
import { pageMetadata } from '@/lib/seo/metadata';

const META = {
  title: `Contact ${SITE.name}`,
  description: `Email ${SITE.name} to report an error in a calculator, ask about a formula or a result, or suggest a new calculator for us to build.`,
  path: '/contact/',
};
export const metadata = pageMetadata(META);

// Plain mailto, no form (SEC-CODE-21). The public address is on our own domain and forwarded privately.
export default function ContactPage() {
  return (
    <TrustPage path={META.path} name="Contact" title={META.title} description={META.description} updated="2026-10-11" type="ContactPage">
      <h1>Contact</h1>
      <p>
        Email: <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
      </p>
      <h2>Reporting an error</h2>
      <p>
        Tell us which calculator it was and paste the link from &ldquo;Copy link with these numbers&rdquo;, so we can
        reproduce your exact inputs. Confirmed fixes are logged on the <Link href="/methodology/">methodology page</Link>.
      </p>
      <h2>Suggesting a calculator</h2>
      <p>Tell us what you&apos;re trying to work out and what you&apos;d type in. Real use cases shape what gets built next.</p>
    </TrustPage>
  );
}
