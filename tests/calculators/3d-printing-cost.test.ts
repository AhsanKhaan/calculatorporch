// The 7 regression tests ported unchanged in substance from the static probe's calc3d.test.js (docs/03 §8),
// plus checks that the engine spec reproduces them exactly.
import { describe, expect, test } from 'vitest';
import { DEFAULTS, DENSITY, calculate, filamentLengthMeters } from '@/lib/calculators/3d-printing-cost';
import spec from '@/lib/calculators/3d-printing-cost.spec';
import { applyChange, defaultState, parseAll } from '@/lib/engine/parse';

describe('3D printing cost: ported regression tests', () => {
  test('published worked example (defaults) matches hand calculation', () => {
    const r = calculate(DEFAULTS);
    expect(r.material).toBe(2.64);
    expect(r.electricity).toBe(0.13);
    expect(r.machine).toBe(1.14);
    expect(r.failureAllowance).toBe(0.43);
    expect(r.labor).toBe(5);
    expect(r.totalCost).toBe(10.85);
    expect(r.price).toBe(22.37);
    expect(r.fees).toBe(2.58);
    expect(r.profit).toBe(8.95);
  });
  test('profit equals target margin of price after fees', () => {
    const r = calculate({ ...DEFAULTS, marginPct: 25, feePct: 0.136, feeFixed: 0.4 });
    expect(Math.abs((r.profit ?? 0) - 0.25 * (r.price ?? 0))).toBeLessThan(0.02);
  });
  test('no fees, no margin → price equals total cost', () => {
    const r = calculate({ ...DEFAULTS, marginPct: 0, feePct: 0, feeFixed: 0 });
    expect(r.price).toBe(r.totalCost);
  });
  test('zero failure rate adds no allowance', () => {
    expect(calculate({ ...DEFAULTS, failRatePct: 0 }).failureAllowance).toBe(0);
  });
  test('impossible margin + fees is flagged invalid, not a negative price', () => {
    const r = calculate({ ...DEFAULTS, marginPct: 95, feePct: 0.2 });
    expect(r.valid).toBe(false);
    expect(r.price).toBeNull();
  });
  test('filament length: 1 kg of 1.75 mm PLA ≈ 335 m', () => {
    const m = filamentLengthMeters(1000, DENSITY.PLA, 1.75);
    expect(m).toBeGreaterThan(330);
    expect(m).toBeLessThan(340);
  });
  test('garbage inputs are clamped, never NaN', () => {
    const r = calculate({ grams: 'abc', hours: -5, spoolGrams: 0, marginPct: 30 });
    for (const k of ['material', 'electricity', 'machine', 'totalCost'] as const) expect(Number.isFinite(r[k])).toBe(true);
  });
});

describe('3D printing cost: engine spec', () => {
  const TODAY = '2026-10-11';
  test('spec defaults reproduce the published example exactly', () => {
    const { values, invalid } = parseAll(spec, defaultState(spec, TODAY), TODAY);
    expect(invalid).toEqual([]);
    const out = spec.compute(values, { today: TODAY }).values;
    expect(out.totalCost).toBe(10.85);
    expect(out.price).toBe(22.37);
    expect(out.profit).toBe(8.95);
  });
  test('choosing a state loads its EIA rate; editing the rate switches to custom', () => {
    let st = applyChange(spec, defaultState(spec, TODAY), 'state', 'Hawaii');
    expect(Number(st.centsPerKwh)).toBeGreaterThan(30);
    st = applyChange(spec, st, 'centsPerKwh', '20');
    expect(st.state).toBe('custom');
  });
  test('fee presets fill the fee fields; editing a fee switches to custom', () => {
    let st = applyChange(spec, defaultState(spec, TODAY), 'feePreset', 'ebay');
    expect(st.feePctDisplay).toBe('13.6');
    expect(st.feeFixed).toBe('0.4');
    st = applyChange(spec, st, 'feeFixed', '1');
    expect(st.feePreset).toBe('custom');
  });
});
