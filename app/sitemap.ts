import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/content/site';
import { AUTHOR, BUILD_TODAY, TRUST_PAGES, categoryPath, publishedCategories, publishedInstances, publishedTools } from '@/content/registry';

export const dynamic = 'force-static';

const TRUST_UPDATED = '2026-10-11';

/** Every published URL with lastModified = the content's real `updated` date (docs/04 §7, docs/10 §11). */
export default function sitemap(): MetadataRoute.Sitemap {
  const latest = (urls: string[]) => urls.sort().at(-1) ?? TRUST_UPDATED;
  return [
    { url: absoluteUrl('/'), lastModified: latest(publishedTools.map((t) => t.updated)) },
    { url: absoluteUrl('/calculators/'), lastModified: latest(publishedTools.map((t) => t.updated)) },
    ...publishedCategories.map((c) => ({ url: absoluteUrl(categoryPath(c)), lastModified: latest(publishedTools.filter((t) => t.category.slug === c.slug).map((t) => t.updated)) })),
    ...publishedTools.map((t) => ({ url: absoluteUrl(t.url), lastModified: t.updated })),
    // Date-dependent instances change daily (daily rebuild); others change with their parent.
    ...publishedInstances.map((i) => ({ url: absoluteUrl(i.url), lastModified: i.dateDependent ? BUILD_TODAY : i.parent.updated })),
    ...TRUST_PAGES.map((p) => ({ url: absoluteUrl(p.path), lastModified: TRUST_UPDATED })),
    { url: absoluteUrl(AUTHOR.path), lastModified: TRUST_UPDATED },
  ];
}
