import type { Metadata } from 'next';
import { SITE, absoluteUrl } from '@/content/site';

/** Per-page metadata (docs/04 §7): absolute canonical with trailing slash, index only in Production. */
export function pageMetadata(p: { title: string; description: string; path: string }): Metadata {
  return {
    title: { absolute: p.title },
    description: p.description,
    alternates: { canonical: absoluteUrl(p.path) },
    robots: SITE.indexable ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      type: 'website',
      siteName: SITE.name,
      locale: 'en_US',
      url: absoluteUrl(p.path),
      title: p.title,
      description: p.description,
    },
    twitter: { card: 'summary', title: p.title, description: p.description },
  };
}
