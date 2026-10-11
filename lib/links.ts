/**
 * The internal-link system (docs/10 §4), generated from the registry so it scales with the site.
 * Build checks in scripts/check-out.mjs enforce ≥ 3 inbound links, depth ≤ 3, no broken links, ≤ 150 links/page.
 */
import { categoryPath, demand, publishedInstances, publishedTools, type PublishedInstance, type PublishedTool } from '@/content/registry';
import type { Category } from '@/content/taxonomy';
import type { Crumb } from '@/lib/seo/jsonld';

const byDemand = (a: PublishedTool, b: PublishedTool) => demand(b) - demand(a);

export const crumbsForCategory = (c: Category): Crumb[] => [
  { name: 'Home', path: '/' },
  { name: c.name, path: categoryPath(c) },
];

export const crumbsForTool = (t: PublishedTool): Crumb[] => [...crumbsForCategory(t.category), { name: t.name, path: t.url }];

export const crumbsForInstance = (i: PublishedInstance): Crumb[] => [...crumbsForTool(i.parent), { name: i.name, path: i.url }];

/** Every published tool in a category, grouped under its subcategory headings (taxonomy order), by demand. */
export function toolsBySubcategory(c: Category): { subcategory: string; tools: PublishedTool[] }[] {
  const tools = publishedTools.filter((t) => t.category.slug === c.slug);
  const order = [...c.subcategories, ...new Set(tools.map((t) => t.subcategory).filter((s) => !c.subcategories.includes(s)))];
  return order.map((s) => ({ subcategory: s, tools: tools.filter((t) => t.subcategory === s).sort(byDemand) })).filter((g) => g.tools.length);
}

/** "Similar {subcategory} calculators": siblings in the same subcategory, max 8. */
export const siblings = (t: PublishedTool, max = 8): PublishedTool[] =>
  publishedTools.filter((x) => x.url !== t.url && x.category.slug === t.category.slug && x.subcategory === t.subcategory).sort(byDemand).slice(0, max);

/** "Related calculators": explicit related[] (may cross categories), published only, not already a sibling, 3–6. */
export function related(t: PublishedTool, max = 6): PublishedTool[] {
  const sib = new Set(siblings(t).map((s) => s.url));
  const explicit = t.related.map((u) => publishedTools.find((x) => x.url === u)).filter((x): x is PublishedTool => !!x && !sib.has(x.url) && x.url !== t.url);
  // Top up from the same category so every tool has a few related links even early on.
  const fill = publishedTools.filter((x) => x.url !== t.url && x.category.slug === t.category.slug && !sib.has(x.url) && !explicit.includes(x)).sort(byDemand);
  return [...explicit, ...fill].slice(0, max);
}

/**
 * Early on a category may hold only 1–2 tools, leaving fewer than the 3 links docs/05 §1 item 11 asks for. Top up with
 * the most-searched tools elsewhere, shown under their own honest heading ("More free calculators"), never as "related".
 */
export function moreTools(t: PublishedTool, shown: readonly PublishedTool[], min = 3): PublishedTool[] {
  if (shown.length >= min) return [];
  const taken = new Set([t.url, ...shown.map((s) => s.url)]);
  return popular(publishedTools.length)
    .filter((x) => !taken.has(x.url))
    .slice(0, min + 1 - shown.length);
}

export const instancesOf =(t: PublishedTool, max = 8): PublishedInstance[] =>
  publishedInstances.filter((i) => i.parent.url === t.url).sort((a, b) => (b.row.evidence.primaryVolume ?? 0) - (a.row.evidence.primaryVolume ?? 0)).slice(0, max);

export const nearbyInstances = (i: PublishedInstance, max = 6): PublishedInstance[] => instancesOf(i.parent, max + 1).filter((x) => x.url !== i.url).slice(0, max);

export const popular = (n = 12): PublishedTool[] => [...publishedTools].sort(byDemand).slice(0, n);
export const popularIn = (c: Category, n = 6): PublishedTool[] => publishedTools.filter((t) => t.category.slug === c.slug).sort(byDemand).slice(0, n);
