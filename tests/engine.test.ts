// The engine's input handling, written once for every calculator (SEC-CODE-05/06/07/08).
import { describe, expect, test } from 'vitest';
import type { CalculatorSpec } from '@/lib/engine/spec';
import { applyChange, defaultState, parseAll, parseField, queryFromState, resolveDate, stateFromQuery } from '@/lib/engine/parse';
import { formatOutput } from '@/lib/engine/format';
import { stepValue } from '@/lib/engine/step';
import type { NumberField } from '@/lib/engine/spec';
import specs from './helpers/specs';

const spec: CalculatorSpec = {
  id: 'test',
  fields: [
    { key: 'n', label: 'N', type: 'number', min: 0, max: 100, step: 1, default: 10 },
    { key: 's', label: 'S', type: 'select', options: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }], default: 'a' },
    { key: 'd', label: 'D', type: 'date', default: 'today+5', min: '2000-01-01', max: '2100-12-31' },
    { key: 'o', label: 'O', type: 'date', default: '', optional: true },
    { key: 't', label: 'T', type: 'text', default: '1/2', maxLength: 8, pattern: /^\d+\/\d+$/ },
    { key: 'l', label: 'L', type: 'numberList', default: '1, 2, 3', maxItems: 4, min: -10, max: 10 },
  ],
  outputs: [{ key: 'x', label: 'X', format: 'number', primary: true }],
  onChange: { s: (v) => ({ n: v === 'b' ? '50' : '10', __proto__: 'x', evil: '1' }) },
  compute: () => ({ values: { x: 1 } }),
};
const TODAY = '2026-10-11';

describe('defaults and dates', () => {
  test('today±N resolves relative to the given day', () => {
    expect(resolveDate('today', TODAY)).toBe('2026-10-11');
    expect(resolveDate('today+5', TODAY)).toBe('2026-10-16');
    expect(resolveDate('today-21', TODAY)).toBe('2026-09-20');
    expect(resolveDate('2020-02-29', TODAY)).toBe('2020-02-29');
  });
  test('defaultState fills every field', () => {
    expect(defaultState(spec, TODAY)).toEqual({ n: '10', s: 'a', d: '2026-10-16', o: '', t: '1/2', l: '1, 2, 3' });
  });
});

describe('parseField (SEC-CODE-07)', () => {
  const f = (k: string) => spec.fields.find((x) => x.key === k)!;
  test.each([
    ['', 10, false], ['abc', 10, false], ['NaN', 10, false], ['Infinity', 10, false], ['-5', 0, false], ['1e308', 100, false], ['42', 42, true],
  ])('number %j → %j (valid %j)', (raw, value, valid) => {
    expect(parseField(f('n'), raw as string, TODAY)).toEqual({ value, valid });
  });
  test('select only accepts its options', () => {
    expect(parseField(f('s'), 'b', TODAY)).toEqual({ value: 'b', valid: true });
    expect(parseField(f('s'), '<script>', TODAY)).toEqual({ value: 'a', valid: false });
  });
  test('dates must be real calendar days within bounds', () => {
    expect(parseField(f('d'), '2026-02-30', TODAY).valid).toBe(false);
    expect(parseField(f('d'), '2101-01-01', TODAY).valid).toBe(false);
    expect(parseField(f('d'), '2024-02-29', TODAY)).toEqual({ value: '2024-02-29', valid: true });
    expect(parseField(f('o'), '', TODAY)).toEqual({ value: '', valid: true });
  });
  test('text must match its pattern and length', () => {
    expect(parseField(f('t'), '3/4', TODAY).valid).toBe(true);
    expect(parseField(f('t'), '<img src=x>', TODAY)).toEqual({ value: '1/2', valid: false });
    expect(parseField(f('t'), '123456/789', TODAY).valid).toBe(false); // too long
  });
  test('number lists drop bad items and cap the count', () => {
    expect(parseField(f('l'), '1 2\n3;4', TODAY)).toEqual({ value: [1, 2, 3, 4], valid: true });
    expect(parseField(f('l'), '1, x, 99', TODAY)).toEqual({ value: [1], valid: false });
    expect(parseField(f('l'), '1,2,3,4,5', TODAY)).toEqual({ value: [1, 2, 3, 4], valid: false });
  });
  test('parseAll never yields NaN', () => {
    const { values, invalid } = parseAll(spec, { n: 'NaN', s: 'zzz', d: 'x', o: '', t: '', l: '' }, TODAY);
    expect(values.n).toBe(10);
    expect(invalid).toEqual(expect.arrayContaining(['n', 's', 'd', 't', 'l']));
  });
});

describe('query params (SEC-CODE-05/06)', () => {
  test('only allow-listed keys with valid values are read', () => {
    const st = stateFromQuery(spec, '?__proto__[polluted]=1&constructor=1&n=55&s=<b>&evil=1&d=2026-01-01', TODAY);
    expect(st.n).toBe('55');
    expect(st.s).toBe('a');
    expect(st.d).toBe('2026-01-01');
    expect(Object.keys(st).sort()).toEqual(['d', 'l', 'n', 'o', 's', 't']);
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });
  test('round trip preserves state', () => {
    const st = { ...defaultState(spec, TODAY), n: '77', t: '3/8' };
    expect(stateFromQuery(spec, `?${queryFromState(spec, st)}`, TODAY)).toEqual(st);
  });
  test('overlong values are ignored', () => {
    expect(stateFromQuery(spec, `?l=${'1,'.repeat(2000)}`, TODAY).l).toBe('1, 2, 3');
  });
});

describe('onChange links', () => {
  test('apply only to known field keys', () => {
    const next = applyChange(spec, defaultState(spec, TODAY), 's', 'b');
    expect(next.n).toBe('50');
    expect(next).not.toHaveProperty('evil');
    expect(Object.prototype.hasOwnProperty.call(next, '__proto__')).toBe(false);
  });
  test('unknown keys are ignored entirely', () => {
    const st = defaultState(spec, TODAY);
    expect(applyChange(spec, st, 'nope', 'x')).toBe(st);
  });
});

describe('formatOutput', () => {
  test('formats and never prints NaN', () => {
    expect(formatOutput({ key: 'a', label: '', format: 'currency' }, 1234.5)).toBe('$1,234.50');
    expect(formatOutput({ key: 'a', label: '', format: 'percent', decimals: 2 }, 6.25)).toBe('6.25%');
    expect(formatOutput({ key: 'a', label: '', format: 'number', suffix: 'days' }, 30)).toBe('30 days');
    expect(formatOutput({ key: 'a', label: '', format: 'date' }, '2026-05-03')).toBe('Sunday, May 3, 2026');
    expect(formatOutput({ key: 'a', label: '', format: 'number' }, Number.NaN)).toBe('n/a');
    expect(formatOutput({ key: 'a', label: '', format: 'number' }, null)).toBe('n/a');
  });
});

describe('engine options: steppers and wizards', () => {
  const qty: NumberField = { key: 'q', label: 'Q', type: 'number', display: 'stepper', min: 0, max: 3, step: 1, default: 1 };
  const hrs: NumberField = { key: 'h', label: 'H', type: 'number', min: 0, max: 24, step: 0.25, default: 6 };
  test('stepper buttons move by step, clamp to min/max and avoid float noise', () => {
    expect(stepValue(qty, '1', 1)).toBe('2');
    expect(stepValue(qty, '3', 1)).toBe('3');
    expect(stepValue(qty, '0', -1)).toBe('0');
    expect(stepValue(qty, '', 1)).toBe('2'); // empty → from the default
    expect(stepValue(qty, 'abc', -1)).toBe('0');
    expect(stepValue(hrs, '0.5', 1)).toBe('0.75');
    expect(stepValue({ ...hrs, step: 0.1 }, '0.2', 1)).toBe('0.3'); // not 0.30000000000000004
  });
  test.each(Object.entries(specs).filter(([, s]) => s.steps?.length))('%s: wizard steps cover every group once; showWhen, companions and totals point at real keys', (_, s) => {
    const groups = new Set(s.fields.map((f) => f.group ?? ''));
    const inSteps = s.steps!.flatMap((x) => x.groups);
    expect(new Set(inSteps).size).toBe(inSteps.length);
    expect(new Set(inSteps)).toEqual(groups);
    const keys = new Set(s.fields.map((f) => f.key));
    for (const f of s.fields) {
      if (f.showWhen) expect(keys.has(f.showWhen.key), f.key).toBe(true);
      if (f.type === 'number' && f.companion) expect(s.fields.find((c) => c.key === f.companion)?.type, f.key).toBe('number');
    }
    for (const [g, out] of Object.entries(s.groupTotals ?? {})) {
      expect(groups.has(g), g).toBe(true);
      expect(s.outputs.some((o) => o.key === out), out).toBe(true);
    }
  });
});
