import { describe, expect, test } from 'vitest';
import { adsAllowed } from '@/lib/ads';
import { csvCell, toCsv } from '@/lib/csv';
import { faqPage, instanceGraph, serializeJsonLd, toolGraph } from '@/lib/seo/jsonld';
import { publishedInstances, publishedTools } from '@/content/registry';
import { crumbsForInstance, crumbsForTool } from '@/lib/links';

type Graph = { '@graph': Record<string, unknown>[] };
const faqOf = (g: Graph) => g['@graph'].find((n) => n['@type'] === 'FAQPage') as { mainEntity: { name: string; acceptedAnswer: { text: string } }[] };

describe('JSON-LD (SEC-CODE-02, docs/10 §8)', () => {
  test('a FAQ answer containing </script> cannot close the tag', () => {
    const out = serializeJsonLd(faqPage('/x/', [{ q: 'Is this safe to embed?', a: '</script><script>alert(1)</script> & more text here' }]));
    expect(out).not.toContain('</script');
    expect(out).not.toContain('<');
    expect(JSON.parse(out).mainEntity[0].acceptedAnswer.text).toBe('</script><script>alert(1)</script> & more text here');
  });
  test('JS line separators (U+2028/U+2029) are escaped', () => {
    const LS = String.fromCharCode(0x2028);
    const PS = String.fromCharCode(0x2029);
    const out = serializeJsonLd({ text: `a${LS}b${PS}c` });
    expect(out).not.toContain(LS);
    expect(out).not.toContain(PS);
    expect(JSON.parse(out).text).toBe(`a${LS}b${PS}c`);
  });
  test.each(publishedTools.map((t) => [t.url, t] as const))('%s: FAQPage text equals the visible FAQ; no ratings', (_, tool) => {
    const g = toolGraph(tool, tool.url, crumbsForTool(tool)) as Graph;
    expect(faqOf(g).mainEntity.map((q) => [q.name, q.acceptedAnswer.text])).toEqual(tool.faqs.map((f) => [f.q, f.a]));
    const json = serializeJsonLd(g);
    for (const banned of ['aggregateRating', '"review"', 'HowTo', 'SearchAction']) expect(json).not.toContain(banned);
  });
  test.each(publishedInstances.map((i) => [i.url, i] as const))('%s: instance FAQPage equals its visible FAQ', (_, i) => {
    const g = instanceGraph(i, i.parent.url, crumbsForInstance(i), '2026-10-11') as Graph;
    expect(faqOf(g).mainEntity.map((q) => [q.name, q.acceptedAnswer.text])).toEqual(i.faqs.map((f) => [f.q, f.a]));
  });
});

describe('CSV export (SEC-CODE-23)', () => {
  test('formula-like text is neutralised; numbers stay numbers', () => {
    expect(csvCell('=HYPERLINK("http://x")')).toBe('"\'=HYPERLINK(""http://x"")"');
    expect(csvCell('+1+1')).toBe('"\'+1+1"');
    expect(csvCell('@SUM(A1)')).toBe('"\'@SUM(A1)"');
    expect(csvCell(-5)).toBe('"-5"');
    expect(toCsv([['a', 1], ['b', null]])).toBe('"a","1"\r\n"b",""');
  });
});

describe('Ads switch (SEC-CODE-22, SEC-ADS-02)', () => {
  const ok = { enabledFlag: 'true', hostname: 'calculatorporch.com', productionHost: 'calculatorporch.com', webdriver: false };
  test('all three locks must hold', () => {
    expect(adsAllowed(ok)).toBe(true);
    expect(adsAllowed({ ...ok, enabledFlag: undefined })).toBe(false);
    expect(adsAllowed({ ...ok, enabledFlag: 'TRUE' })).toBe(false);
    expect(adsAllowed({ ...ok, hostname: 'abc.calculatorporch.pages.dev' })).toBe(false);
    expect(adsAllowed({ ...ok, webdriver: true })).toBe(false);
  });
});
