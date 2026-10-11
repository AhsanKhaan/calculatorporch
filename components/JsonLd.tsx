import { serializeJsonLd } from '@/lib/seo/jsonld';

/**
 * The ONE allowed use of dangerouslySetInnerHTML (SEC-CODE-01/02). The data is serialized with
 * serializeJsonLd(), which escapes "<" so content can never close the script tag.
 * JSON-LD is a data block, so CSP script-src doesn't apply to it.
 */
export default function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
