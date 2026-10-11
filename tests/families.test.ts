// Programmatic families (docs/10 §5): every wave-1 instance builds, validates and states the right answer.
import { describe, expect, test } from 'vitest';
import { buildInstance } from '@/lib/families';
import { publishedInstances, REGISTRY } from '@/content/registry';

const TODAY = '2026-10-11';

describe('wave-1 instances', () => {
  test('all 9 researched instances are published', () => {
    const launch = REGISTRY.filter((r) => r.type === 'instance' && r.status === 'launch').map((r) => r.url).sort();
    expect(publishedInstances.map((i) => i.url).sort()).toEqual(launch);
    expect(launch.length).toBe(9);
  });

  test.each([
    ['fraction-expression', '2-3-times-2-3', '4/9'],
    ['fraction-expression', '3-1-3-divided-by-4', '5/6'],
    ['fraction-expression', '2-1-3-minus-2-3', '5/3 = 1 2/3'],
    ['fraction-expression', '2-1-3-times-2', '14/3 = 4 2/3'],
    ['fraction-expression', '1-1-2-times-1-4', '3/8'],
    ['fraction-expression', '2-3-in-fraction-form', '2/3'],
    ['percent-off', '40-percent-off-60', '$36.00'],
    ['random-range', '1-to-16', '1 in 16 (6.25%)'],
  ])('%s/%s answers %s', (family, slug, answer) => {
    expect(buildInstance(family, slug, TODAY)?.answer.value).toBe(answer);
  });

  test('10 days from today is computed from the build date, with business days', () => {
    const i = buildInstance('date-offset', '10-days-from-today', TODAY)!;
    expect(i.answer.value).toBe('Wednesday, October 21, 2026');
    expect(i.directAnswer).toContain('Friday, October 23, 2026'); // 10 business days from Sunday Oct 11
    expect(i.dateDependent).toBe(true);
    expect(i.table.rows).toHaveLength(7);
  });

  test('unknown slugs build nothing (the gate)', () => {
    expect(buildInstance('fraction-expression', '9-9-times-9-9', TODAY)).toBeNull();
    expect(buildInstance('nope', 'x', TODAY)).toBeNull();
  });

  test('every instance table is unique (no doorway duplicates)', () => {
    const tables = publishedInstances.map((i) => JSON.stringify(i.table.rows));
    expect(new Set(tables).size).toBe(tables.length);
  });
});
