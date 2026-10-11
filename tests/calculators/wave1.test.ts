// Reference cases for the wave-1 engine calculators: hand-worked values and the examples published on each page.
import { describe, expect, test } from 'vitest';
import { operate, parseFraction, toDecimal, toFractionString, toMixed } from '@/lib/calculators/fraction';
import { addDaysIso, countDays } from '@/lib/calculators/dates';
import { percentOff } from '@/lib/calculators/percent-off.spec';
import { tip } from '@/lib/calculators/tip.spec';
import { generate, randomInt } from '@/lib/calculators/random-number.spec';
import { describe as stats } from '@/lib/calculators/standard-deviation.spec';
import { area } from '@/lib/calculators/square-footage.spec';
import { gravel } from '@/lib/calculators/gravel.spec';
import { dueDates } from '@/lib/calculators/dog-pregnancy.spec';
import dogSpec from '@/lib/calculators/dog-pregnancy.spec';
import randomSpec from '@/lib/calculators/random-number.spec';
import { addBusinessDays } from '@/lib/families/date-offset';

const F = (s: string) => parseFraction(s)!;
const res = (a: string, op: '+' | '-' | '×' | '÷', b: string) => toMixed(operate(F(a), op, F(b)).result!);

describe('fraction', () => {
  test('parses fractions, mixed numbers, integers, negatives and decimals', () => {
    expect(F('2 1/3')).toEqual({ n: 7, d: 3 });
    expect(F('-1 1/2')).toEqual({ n: -3, d: 2 });
    expect(F('6/8')).toEqual({ n: 3, d: 4 });
    expect(F('0.25')).toEqual({ n: 1, d: 4 });
    expect(F('5')).toEqual({ n: 5, d: 1 });
    expect(parseFraction('1/0')).toBeNull();
    expect(parseFraction('<script>')).toBeNull();
    expect(parseFraction('1234567/2')).toBeNull(); // > 6 digits
  });
  test.each([
    ['2/3', '×', '2/3', '4/9'],
    ['3 1/3', '÷', '4', '5/6'],
    ['2 1/3', '-', '2/3', '1 2/3'],
    ['2 1/3', '×', '2', '4 2/3'],
    ['1 1/2', '×', '1/4', '3/8'],
    ['1/2', '+', '1/3', '5/6'],
    ['3/4', '-', '1/3', '5/12'],
    ['1/2', '÷', '1/4', '2'],
    ['1/4', '-', '3/4', '-1/2'],
  ] as const)('%s %s %s = %s', (a, op, b, want) => expect(res(a, op, b)).toBe(want));
  test('division by zero is an error, not Infinity', () => {
    const r = operate(F('1/2'), '÷', F('0'));
    expect(r.result).toBeNull();
    expect(r.error).toMatch(/zero/);
  });
  test('formats', () => {
    expect(toFractionString({ n: 14, d: 3 })).toBe('14/3');
    expect(toDecimal({ n: 4, d: 9 })).toBeCloseTo(0.4444, 4);
  });
});

describe('dates and day counter', () => {
  test('2026 full year inclusive = 365 days, 261 weekdays', () => {
    const c = countDays('2026-01-01', '2026-12-31', true);
    expect(c.days).toBe(365);
    expect(c.weeks).toBe(52);
    expect(c.remDays).toBe(1);
    expect(c.weekdays + c.weekendDays).toBe(365);
    expect(c.weekdays).toBe(261);
  });
  test('leap years', () => {
    expect(countDays('2028-02-01', '2028-03-01', false).days).toBe(29);
    expect(countDays('2100-02-01', '2100-03-01', false).days).toBe(28);
  });
  test('negative spans and DST-safe arithmetic', () => {
    expect(countDays('2026-03-10', '2026-03-01', false).days).toBe(-9);
    expect(addDaysIso('2026-03-07', 2)).toBe('2026-03-09'); // across US DST start
  });
  test('business days skip weekends', () => {
    expect(addBusinessDays('2026-10-09', 1)).toBe('2026-10-12'); // Fri + 1 → Mon
    expect(addBusinessDays('2026-10-11', 10)).toBe('2026-10-23'); // Sun + 10 business days
  });
});

describe('percent off and tip', () => {
  test('40% off $60 = $36, save $24', () => expect(percentOff(60, 40)).toMatchObject({ sale: 36, savings: 24, paidPct: 60 }));
  test('tax applies to the sale price', () => expect(percentOff(100, 20, 10)).toMatchObject({ sale: 80, tax: 8, total: 88 }));
  test('18% of $64 split 2 ways', () => expect(tip(64, 18, 2, false)).toMatchObject({ tipAmt: 11.52, total: 75.52, perPerson: 37.76 }));
  test('rounding each share up raises the effective tip', () => {
    const t = tip(64, 18, 2, true);
    expect(t.perPerson).toBe(38);
    expect(t.total).toBe(76);
    expect(t.effectivePct).toBe(18.75);
  });
});

describe('random number generator', () => {
  test('rejection sampling stays in range and is unbiased on a fake source', () => {
    let i = 0;
    const seq = [0xffffffff, 5, 6, 7]; // first value is in the rejected tail for range 6
    const r = randomInt(1, 6, () => seq[i++ % seq.length]!);
    expect(r).toBeGreaterThanOrEqual(1);
    expect(r).toBeLessThanOrEqual(6);
    expect(i).toBe(2); // the biased value was redrawn
  });
  test('unique draws never repeat', () => {
    const xs = generate(1, 16, 16, true);
    expect(new Set(xs).size).toBe(16);
  });
  test('static HTML shows no fake random result; asking for too many unique numbers warns', () => {
    const v = { min: 1, max: 16, count: 20, unique: 'yes' };
    expect(randomSpec.compute(v, { today: '2026-10-11' }).values.numbers).toBe('Press "Generate"');
    expect(randomSpec.action!.run(v, { today: '2026-10-11' }).warnings?.[0]).toMatch(/only 16/);
  });
});

describe('standard deviation', () => {
  const data = [2, 4, 4, 4, 5, 5, 7, 9];
  test('population σ = 2, sample s ≈ 2.138', () => {
    expect(stats(data, false).sd).toBe(2);
    expect(stats(data, true).sd).toBeCloseTo(2.13809, 5);
    expect(stats(data, true).mean).toBe(5);
  });
  test('constant data has zero spread', () => expect(stats([10, 10, 10], true).sd).toBe(0));
});

describe('square footage and gravel', () => {
  test('areas', () => {
    expect(area('rectangle', 12, 15)).toBe(180);
    expect(area('circle', 10, 0)).toBeCloseTo(78.5398, 4);
    expect(area('triangle', 10, 6)).toBe(30);
  });
  test('40×10 ft driveway, 3 in, pea gravel, +10% ≈ 4.07 yd³, 5.70 t (published example)', () => {
    const g = gravel(400, 3, 'pea', 10);
    expect(g.ft3).toBeCloseTo(110, 6);
    expect(g.yd3).toBeCloseTo(4.074, 3);
    expect(g.tons).toBeCloseTo(5.704, 3);
    expect(g.bags).toBe(220);
  });
});

describe('dog pregnancy', () => {
  test('mating + 63 days, window 56–68 (published example; Concannon 2000)', () => {
    expect(dueDates('2026-03-01', 'mating')).toEqual({ due: '2026-05-03', early: '2026-04-26', late: '2026-05-08' });
  });
  test('two matings: window runs to the last mating + 68', () => {
    expect(dueDates('2026-03-01', 'mating', '2026-03-03').late).toBe('2026-05-10');
  });
  test('days pregnant uses the visitor date from context', () => {
    const out = dogSpec.compute({ method: 'mating', date: '2026-03-01', second: '' }, { today: '2026-03-22' }).values;
    expect(out.daysPregnant).toBe(21);
    expect(out.daysLeft).toBe(42);
  });
});
