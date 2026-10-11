import { EXPLAINS } from '@/lib/calculators/explains';
import { publishedInstances, publishedTools } from '@/content/registry';
import { SITE, absoluteUrl } from '@/content/site';

export const dynamic = 'force-static';

/** /llms-full.txt: each published calculator's direct answer, formula and sources as plain text (docs/10 §9). */
export function GET() {
  const out: string[] = [`# ${SITE.name}: full text`, '', `> ${SITE.description}`, ''];
  for (const t of publishedTools) {
    const ex = EXPLAINS[t.calculator]?.();
    out.push(`## ${t.name}`, '', `URL: ${absoluteUrl(t.url)}`, '', t.directAnswer, '');
    if (ex) out.push('Formula:', ...ex.formula.map((f) => `    ${f}`), '');
    if (t.sources.length) out.push('Sources:', ...t.sources.map((s) => `- ${s.title}, ${s.publisher} (${s.url}, accessed ${s.accessed})`), '');
  }
  if (publishedInstances.length) {
    out.push('## Worked answers', '');
    for (const i of publishedInstances) out.push(`### ${i.name}`, `URL: ${absoluteUrl(i.url)}`, '', i.directAnswer, '');
  }
  return new Response(out.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
