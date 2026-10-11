import { z } from 'zod';

// SITE_URL must be an https origin with no path (SEC-CODE-04). Fails the build otherwise.
const siteUrl = z
  .string()
  .url()
  .refine((u) => new URL(u).protocol === 'https:' && new URL(u).pathname === '/', 'NEXT_PUBLIC_SITE_URL must be an https origin')
  .parse((process.env.NEXT_PUBLIC_SITE_URL ?? 'https://calculatorporch.com').replace(/\/+$/, '') + '/')
  .replace(/\/$/, '');

export const SITE = {
  name: 'Calculator Porch',
  url: siteUrl, // e.g. https://calculatorporch.com (no trailing slash)
  host: new URL(siteUrl).hostname,
  tagline: 'Free online calculators for math, money, building, food and everyday life',
  description:
    'Free online calculators for math, statistics, money, construction, food, pets and everyday life, each with its formula, steps and cited sources.',
  locale: 'en-US',
  /** "true" only in Cloudflare Production. Everything else is noindex. */
  indexable: process.env.NEXT_PUBLIC_INDEXABLE === 'true',
  /** Public contact address on our own domain, forwarded privately (SEC-CODE-21, SEC-ACC-03). */
  contactEmail: 'contact@calculatorporch.com',
  author: {
    name: 'Ahsan Khan',
    path: '/authors/ahsan-khan/',
    /** Real public profiles only (docs/04 §7). Empty until they exist. */
    sameAs: [] as string[],
  },
  foundingYear: 2026,
} as const;

export const absoluteUrl = (path: string): string => `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`;
