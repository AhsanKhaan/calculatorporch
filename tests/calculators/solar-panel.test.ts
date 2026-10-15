// Reference cases for the solar panel calculator: hand-worked sizing, data integrity, and the numbers its page publishes.
import { describe, expect, test } from 'vitest';
import sun from '@/data/solar-sun-hours.json';
import spec from '@/lib/calculators/solar-panel.spec';
import { APPLIANCES, DEFAULTS, LOCATIONS, PK_ASSUMED_RATE, US_AVERAGE, formatMoney, locationById, solarSize, type SolarInput } from '@/lib/calculators/solar-panel';
import { applyChange, defaultState, parseAll } from '@/lib/engine/parse';
import content from '@/content/calculators/solar-panel-calculator';

const today = '2026-10-16';
const input = (over: Partial<SolarInput> = {}): SolarInput => ({
  monthlyKwh: 900, psh: 4.73, panelWatts: 400, lossesPct: 20, offsetPct: 100, efficiencyPct: 21, rate: 0.1831, selfUsePct: 100, exportRate: 0, systemCost: 0, ...over,
});
const run = (state: Record<string, string>) => {
  const { values } = parseAll(spec, state, today);
  return spec.compute(values, { today });
};

describe('solar sizing maths', () => {
  test('900 kWh/month at 4.73 sun hours, 20% losses → 7.82 kW → 20 × 400 W = 8 kW', () => {
    const r = solarSize(input());
    expect(r.dailyNeedKwh).toBeCloseTo(29.589, 3); // 900 × 12 ÷ 365
    expect(r.kwhPerKwDay).toBeCloseTo(3.784, 6); // 4.73 × 0.8
    expect(r.requiredKw).toBeCloseTo(7.8195, 4);
    expect(r.panels).toBe(20);
    expect(r.systemKw).toBe(8);
    expect(r.annualKwh).toBeCloseTo(11_049.28, 2); // 8 × 3.784 × 365
    expect(r.areaM2).toBeCloseTo(38.095, 3); // 8 ÷ 0.21
  });
  test('savings cap self-use at what the home uses; the excess earns only the export credit', () => {
    const r = solarSize(input({ exportRate: 0.05 }));
    expect(r.selfUsedKwh).toBe(10_800);
    expect(r.exportedKwh).toBeCloseTo(249.28, 2);
    expect(r.annualSavings).toBeCloseTo(10_800 * 0.1831 + 249.28 * 0.05, 2);
  });
  test('net billing: 55% used directly, rest exported at a lower credit', () => {
    const r = solarSize(input({ monthlyKwh: 417, psh: 5.12, rate: 60, selfUsePct: 55, exportRate: 11 }));
    expect(r.panels).toBe(9); // 3.347 kW ÷ 0.4 kW = 8.37 → 9
    expect(r.annualKwh).toBeCloseTo(3.6 * 5.12 * 0.8 * 365, 6);
    expect(r.selfUsedKwh).toBeCloseTo(r.annualKwh * 0.55, 6);
    expect(r.annualSavings).toBeCloseTo(r.annualKwh * 0.55 * 60 + r.annualKwh * 0.45 * 11, 4);
  });
  test('payback only with a quote and positive savings; savings only with a price', () => {
    expect(solarSize(input({ systemCost: 20_000 })).paybackYears).toBeCloseTo(20_000 / 1_977.48, 4);
    expect(solarSize(input({ rate: 0, systemCost: 20_000 })).annualSavings).toBeNull();
    expect(solarSize(input({ rate: 0, systemCost: 20_000 })).paybackYears).toBeNull();
  });
  test('exact multiples do not round up an extra panel (float noise)', () => {
    // 1.2 kW needed with 400 W panels must be 3 panels, not 4.
    const r = solarSize(input({ monthlyKwh: (1.2 * 3.784 * 365) / 12 }));
    expect(r.panels).toBe(3);
  });
  test('weakest month uses the location’s monthly sun and days in month', () => {
    const lahore = locationById('pk-lahore')!;
    const r = solarSize(input({ psh: lahore.psh, monthly: lahore.monthly }));
    const kwh = lahore.monthly.map((h, m) => r.systemKw * h * 0.8 * [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m]!);
    expect(r.lowMonth?.kwh).toBeCloseTo(Math.min(...kwh), 6);
  });
  test('money formatting per currency', () => {
    expect(formatMoney(1977.48, 'USD')).toBe('$1,977.48');
    expect(formatMoney(210_500.4, 'PKR')).toBe('Rs 210,500');
  });
});

describe('NASA sun-hour data', () => {
  test('51 US points (50 states + DC) and 13 Pakistani cities, all plausible', () => {
    expect(LOCATIONS.filter((l) => l.country === 'US')).toHaveLength(51);
    expect(LOCATIONS.filter((l) => l.country === 'PK')).toHaveLength(13);
    for (const l of LOCATIONS) {
      expect(l.psh, l.id).toBeGreaterThan(2);
      expect(l.psh, l.id).toBeLessThan(8);
      expect(l.monthly, l.id).toHaveLength(12);
    }
    expect(new Set(LOCATIONS.map((l) => l.id)).size).toBe(LOCATIONS.length);
    expect(sun.retrieved).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
  test('US average is the mean of the 51 points', () => expect(US_AVERAGE.psh).toBe(4.73));
});

describe('solar engine spec', () => {
  test('defaults: 8.00 kW, 20 panels, $1,977.48 a year, December weakest', () => {
    const out = run(defaultState(spec, today));
    expect(out.values.systemKw).toBe(8);
    expect(out.values.panels).toBe(20);
    expect(out.values.annualSavings).toBe('$1,977.48');
    expect(out.values.lowMonth).toMatch(/\(December\)$/);
    expect(out.values.payback).toBeNull();
  });
  test('choosing a Pakistani city loads its sun hours, switches to rupees and an assumed Rs 50 a unit', () => {
    const s = applyChange(spec, defaultState(spec, today), 'location', 'pk-karachi');
    expect(s.sunHours).toBe(String(locationById('pk-karachi')!.psh));
    expect(s.currency).toBe('PKR');
    expect(s.rate).toBe(String(PK_ASSUMED_RATE));
    const out = run(s);
    expect(String(out.values.annualSavings)).toMatch(/^Rs /);
    expect(out.warnings?.join(' ')).toMatch(/net billing/);
    expect(run({ ...s, rate: '0' }).values.annualSavings).toBeNull();
  });
  test('regression: every city sizes with its own sun hours, even from a link without them (was always 4.73)', () => {
    const sizes = ['pk-lahore', 'pk-karachi', 'pk-quetta'].map((id) => run({ ...defaultState(spec, today), location: id, monthlyKwh: '600' }).values.systemKw);
    expect(new Set(sizes).size).toBe(3);
    const lahore = run({ ...defaultState(spec, today), location: 'pk-lahore', monthlyKwh: '600' });
    expect(lahore.values.systemKw).toBe(solarSize(input({ monthlyKwh: 600, psh: locationById('pk-lahore')!.psh })).systemKw);
    expect(lahore.steps?.join(' ')).toContain('5.12 sun hours (NASA average, Lahore)');
  });
  test('bill mode: units = bill ÷ price per unit', () => {
    let s = applyChange(spec, defaultState(spec, today), 'location', 'pk-lahore');
    s = applyChange(spec, s, 'usageMode', 'bill');
    s = applyChange(spec, s, 'monthlyBill', '25000');
    const out = run(s);
    expect(out.values.usageKwh).toBe(25_000 / PK_ASSUMED_RATE); // 500 kWh
    expect(out.values.systemKw).toBe(solarSize(input({ monthlyKwh: 500, psh: 5.12 })).systemKw);
    expect(out.steps?.[0]).toBe('Monthly use = bill Rs 25,000 ÷ Rs 50 per unit = 500 kWh.');
    expect(run({ ...s, monthlyBill: '0' }).warnings?.join(' ')).toMatch(/monthly bill/);
  });
  test('appliance mode: quantity × watts × hours a day, including the custom row', () => {
    const base = { ...defaultState(spec, today), usageMode: 'appliances' };
    const defaults = run(base);
    const wh = APPLIANCES.reduce((s, a) => s + a.qty * a.watts * a.hours, 0);
    expect(wh).toBe(8_506);
    expect(defaults.values.usageKwh).toBeCloseTo((wh / 1000) * (365 / 12), 6);
    const withAc = run({ ...base, qty_ac15: '1' });
    expect((withAc.values.usageKwh as number) - (defaults.values.usageKwh as number)).toBeCloseTo(1.2 * 8 * (365 / 12), 6);
    const withCustom = run({ ...base, customWatts: '2000', qty_custom: '1', hrs_custom: '1' });
    expect((withCustom.values.usageKwh as number) - (defaults.values.usageKwh as number)).toBeCloseTo(2 * (365 / 12), 6);
    const none = Object.fromEntries(APPLIANCES.map((a) => ['qty_' + a.id, '0']));
    expect(run({ ...base, ...none }).warnings?.join(' ')).toMatch(/at least one appliance/);
  });
  test('roof check: fits, or how many panels fit, in sq ft, m² or marla', () => {
    const s = { ...defaultState(spec, today) }; // 20 × 400 W at 21% → 38.1 m² ≈ 410 sq ft
    expect(run({ ...s, roofArea: '600' }).values.roofFit).toBe('Yes: needs 410 of 600 sq ft');
    const small = run({ ...s, roofArea: '1', roofUnit: 'marla225' }); // 225 sq ft = 20.9 m² → 10 panels of 1.905 m²
    expect(small.values.roofFit).toBe('No: about 10 of 20 panels fit');
    expect(small.warnings?.join(' ')).toMatch(/fits about 10 panels/);
    expect(run(s).values.roofFit).toBeNull();
  });
  test('switching between Pakistani cities keeps the price and bill you entered; switching country resets them', () => {
    let s = applyChange(spec, defaultState(spec, today), 'location', 'pk-lahore');
    s = applyChange(spec, s, 'rate', '60');
    s = applyChange(spec, s, 'monthlyBill', '30000');
    s = applyChange(spec, s, 'location', 'pk-karachi');
    expect(s.rate).toBe('60');
    expect(s.monthlyBill).toBe('30000');
    s = applyChange(spec, s, 'location', 'us-texas');
    expect(s.currency).toBe('USD');
    expect(Number(s.rate)).toBeLessThan(1);
    expect(s.monthlyBill).toBe('0');
  });
  test('monthly savings are a twelfth of yearly savings', () => {
    const out = run(defaultState(spec, today));
    expect(out.values.monthlySavings).toBe(formatMoney(1977.48 / 12, 'USD'));
  });
  test('choosing a US state loads its EIA price in dollars; editing sun hours switches to custom', () => {
    const s = applyChange(spec, defaultState(spec, today), 'location', 'us-arizona');
    expect(s.currency).toBe('USD');
    expect(Number(s.rate)).toBeGreaterThan(0.05);
    expect(Number(s.rate)).toBeLessThan(0.6);
    expect(applyChange(spec, s, 'sunHours', '5.5').location).toBe('custom');
    expect(run(applyChange(spec, s, 'sunHours', '5.5')).values.lowMonth).toBeNull();
  });
});

describe('published numbers match the calculator', () => {
  const panelsFor = (kwh: number, psh: number) => solarSize(input({ monthlyKwh: kwh, psh })).panels;
  test('direct answer', () => {
    const r = solarSize(input({ monthly: US_AVERAGE.monthly }));
    expect(content.directAnswer).toContain(`${r.requiredKw.toFixed(1)} kW`);
    expect(content.directAnswer).toContain(`${r.panels} panels of 400 watts (${r.systemKw.toFixed(2)} kW)`);
    expect(content.directAnswer).toContain(`${US_AVERAGE.psh} peak sun hours`);
    expect(content.directAnswer).toContain(Math.round(r.annualKwh).toLocaleString('en-US'));
    expect(content.directAnswer).toContain(formatMoney(Math.floor(r.annualSavings!), 'USD').replace(/\.00$/, ''));
  });
  test('FAQ figures', () => {
    const faq = content.faqs.map((f) => f.a).join(' ');
    const az = locationById('us-arizona')!;
    const wa = locationById('us-washington')!;
    const la = locationById('pk-lahore')!;
    expect(faq).toContain(`Arizona needs ${panelsFor(900, az.psh)}`);
    expect(faq).toContain(`Washington needs ${panelsFor(900, wa.psh)}`);
    expect(faq).toContain(`${panelsFor(1000, US_AVERAGE.psh)} panels of 400 W`);
    expect(faq).toContain(`${panelsFor(1000, la.psh)} panels`);
    const perMonth = (id: string) => Math.round((locationById(id)!.psh * 0.8 * 365) / 12);
    expect(faq).toContain(`${perMonth('pk-lahore')} units a month in Lahore`);
    expect(faq).toContain(`${perMonth('pk-karachi')} in Karachi`);
    expect(faq).toContain(`${perMonth('pk-quetta')} in Quetta`);
    const pk = LOCATIONS.filter((l) => l.country === 'PK').map((l) => Math.round((l.psh * 0.8 * 365) / 12));
    expect(faq).toContain(`About ${Math.min(...pk)} to ${Math.max(...pk)} units`);
    const us = LOCATIONS.filter((l) => l.country === 'US');
    expect(faq).toContain(`${Math.min(...us.map((l) => l.psh)).toFixed(2)} a day in Anchorage`);
    expect(faq).toContain(`${Math.max(...us.map((l) => l.psh)).toFixed(2)} in Phoenix`);
    expect(DEFAULTS.lossesPct).toBe(20);
    const applianceKwh = (APPLIANCES.reduce((s, a) => s + a.qty * a.watts * a.hours, 0) / 1000) * (365 / 12);
    expect(faq).toContain('comes to about ' + Math.round(applianceKwh) + ' kWh a month');
    const lahoreKw = solarSize(input({ monthlyKwh: applianceKwh, psh: locationById('pk-lahore')!.psh })).requiredKw;
    expect(faq).toContain('needs about ' + lahoreKw.toFixed(1) + ' kW in Lahore');
    expect(faq).toContain('adds about ' + Math.round(1.2 * 8 * (365 / 12)) + ' kWh a month');
  });
});
