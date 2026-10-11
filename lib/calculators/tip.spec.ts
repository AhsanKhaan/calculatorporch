import type { CalculatorSpec } from '@/lib/engine/spec';

const r2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export function tip(bill: number, pct: number, people: number, roundUp: boolean) {
  const tipAmt = r2((bill * pct) / 100);
  let total = r2(bill + tipAmt);
  let perPerson = r2(total / people);
  if (roundUp) {
    perPerson = Math.ceil(perPerson);
    total = r2(perPerson * people);
  }
  return { tipAmt: r2(total - bill), total, perPerson, tipPerPerson: r2((total - bill) / people), effectivePct: bill > 0 ? r2(((total - bill) / bill) * 100) : 0 };
}

const spec: CalculatorSpec = {
  id: 'tip',
  fields: [
    { key: 'bill', label: 'Bill amount ($)', type: 'number', min: 0, max: 1_000_000, step: 0.01, default: 64 },
    { key: 'pct', label: 'Tip (%)', type: 'number', min: 0, max: 100, step: 0.5, default: 18 },
    { key: 'people', label: 'Split between (people)', type: 'number', min: 1, max: 100, step: 1, default: 2 },
    { key: 'round', label: 'Round up each share?', type: 'select', options: [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes: to the next whole dollar' }], default: 'no' },
  ],
  outputs: [
    { key: 'tipAmt', label: 'Tip', format: 'currency', primary: true },
    { key: 'total', label: 'Total with tip', format: 'currency' },
    { key: 'perPerson', label: 'Each person pays', format: 'currency' },
    { key: 'tipPerPerson', label: 'Tip per person', format: 'currency' },
    { key: 'effectivePct', label: 'Effective tip', format: 'percent' },
  ],
  compute: (v) => {
    const bill = Number(v.bill);
    const people = Math.max(1, Math.trunc(Number(v.people)));
    const t = tip(bill, Number(v.pct), people, v.round === 'yes');
    return {
      values: t,
      steps: [
        `Tip = $${bill.toFixed(2)} × ${Number(v.pct)}% = $${r2((bill * Number(v.pct)) / 100).toFixed(2)}.`,
        `Total = $${bill.toFixed(2)} + tip = $${r2(bill + (bill * Number(v.pct)) / 100).toFixed(2)}; ÷ ${people} = $${r2((bill + (bill * Number(v.pct)) / 100) / people).toFixed(2)} each.`,
        ...(v.round === 'yes' ? [`Rounded up to $${t.perPerson.toFixed(2)} each, the tip becomes $${t.tipAmt.toFixed(2)} (${t.effectivePct}%).`] : []),
      ],
    };
  },
};

export default spec;
