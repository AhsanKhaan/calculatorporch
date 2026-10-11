import { categoryPath, publishedCategories, publishedInstances, publishedTools, TRUST_PAGES } from '@/content/registry';
import { SITE, absoluteUrl } from '@/content/site';

export const dynamic = 'force-static';

/** /llms.txt (llmstxt.org format), generated from the registry: every published page, nothing unpublished (docs/10 §9). */
export function GET() {
  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    'Every calculator shows its formula, a worked example and its sources; calculations run in the browser and nothing typed is stored.',
    '',
  ];
  for (const c of publishedCategories) {
    lines.push(`## ${c.name}`, '', `- [${c.name} calculators](${absoluteUrl(categoryPath(c))}): ${c.description}`);
    for (const t of publishedTools.filter((x) => x.category.slug === c.slug)) lines.push(`- [${t.name}](${absoluteUrl(t.url)}): ${t.description}`);
    lines.push('');
  }
  lines.push('## Optional', '');
  for (const i of publishedInstances) lines.push(`- [${i.name}](${absoluteUrl(i.url)}): ${i.description}`);
  lines.push(`- [All calculators A–Z](${absoluteUrl('/calculators/')})`);
  for (const p of TRUST_PAGES) lines.push(`- [${p.name}](${absoluteUrl(p.path)})`);
  lines.push(`- [Full text for LLMs](${absoluteUrl('/llms-full.txt')})`, '');
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
