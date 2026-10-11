import type { MetadataRoute } from 'next';
import { SITE, absoluteUrl } from '@/content/site';

export const dynamic = 'force-static';

/**
 * Production: allow all crawlers, including AI search and training bots (docs/04 §7, playbook §4).
 * Any other build (preview, local): disallow everything so it's never indexed.
 */
export default function robots(): MetadataRoute.Robots {
  if (!SITE.indexable) return { rules: { userAgent: '*', disallow: '/' } };
  return { rules: { userAgent: '*', allow: '/' }, sitemap: absoluteUrl('/sitemap.xml') };
}
