import type { CalculatorSpec } from '@/lib/engine/spec';
import { FRACTION_PATTERN, OPS, operate, parseFraction, toDecimal, toFractionString, toMixed, type Op } from './fraction';

const spec: CalculatorSpec = {
  id: 'fraction',
  fields: [
    { key: 'a', label: 'First fraction', type: 'text', default: '2/3', maxLength: 16, pattern: FRACTION_PATTERN, placeholder: 'e.g. 2 1/3', hint: 'Fraction (3/4), mixed number (2 1/3), whole number or decimal.' },
    { key: 'op', label: 'Operation', type: 'select', options: OPS.map((o) => ({ value: o, label: { '+': 'Add (+)', '-': 'Subtract (−)', '×': 'Multiply (×)', '÷': 'Divide (÷)' }[o] })), default: '×' },
    { key: 'b', label: 'Second fraction', type: 'text', default: '2/3', maxLength: 16, pattern: FRACTION_PATTERN, placeholder: 'e.g. 1/4' },
  ],
  outputs: [
    { key: 'fraction', label: 'Answer (simplest form)', format: 'text', primary: true },
    { key: 'mixed', label: 'As a mixed number', format: 'text' },
    { key: 'decimal', label: 'As a decimal', format: 'number', decimals: 6 },
    { key: 'percent', label: 'As a percentage', format: 'percent', decimals: 4 },
  ],
  compute: (v) => {
    const a = parseFraction(String(v.a));
    const b = parseFraction(String(v.b));
    if (!a || !b) return { values: { fraction: null, mixed: null, decimal: null, percent: null }, warnings: ['Enter each value as a fraction (3/4), mixed number (2 1/3), whole number or decimal.'] };
    const r = operate(a, v.op as Op, b, String(v.a).trim(), String(v.b).trim());
    if (!r.result) return { values: { fraction: null, mixed: null, decimal: null, percent: null }, steps: r.steps, warnings: r.error ? [r.error] : [] };
    const dec = toDecimal(r.result);
    return { values: { fraction: toFractionString(r.result), mixed: toMixed(r.result), decimal: dec, percent: dec * 100 }, steps: r.steps };
  },
};

export default spec;
