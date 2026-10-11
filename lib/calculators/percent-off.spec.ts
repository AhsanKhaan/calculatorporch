import type { CalculatorSpec } from '@/lib/engine/spec';

export const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export function percentOff(price: number, pct: number, taxPct = 0) {
  const savings = round2((price * pct) / 100);
  const sale = round2(price - savings);
  const tax = round2((sale * taxPct) / 100);
  return { sale, savings, tax, total: round2(sale + tax), paidPct: 100 - pct };
}

const spec: CalculatorSpec = {
  id: 'percent-off',
  fields: [
    { key: 'price', label: 'Original price ($)', type: 'number', min: 0, max: 10_000_000, step: 0.01, default: 60 },
    { key: 'pct', label: 'Percent off (%)', type: 'number', min: 0, max: 100, step: 0.5, default: 40 },
    { key: 'tax', label: 'Sales tax (%)', type: 'number', min: 0, max: 30, step: 0.01, default: 0, hint: 'Optional: applied to the sale price.' },
  ],
  outputs: [
    { key: 'sale', label: 'Sale price', format: 'currency', primary: true },
    { key: 'savings', label: 'You save', format: 'currency' },
    { key: 'paidPct', label: 'You pay (of the original)', format: 'percent', decimals: 2 },
    { key: 'taxAmt', label: 'Sales tax', format: 'currency' },
    { key: 'total', label: 'Total with tax', format: 'currency' },
  ],
  compute: (v) => {
    const price = Number(v.price);
    const pct = Number(v.pct);
    const r = percentOff(price, pct, Number(v.tax));
    return {
      values: { sale: r.sale, savings: r.savings, paidPct: r.paidPct, taxAmt: r.tax, total: r.total },
      steps: [
        `Savings = $${price.toFixed(2)} × ${pct}% = $${r.savings.toFixed(2)}.`,
        `Sale price = $${price.toFixed(2)} − $${r.savings.toFixed(2)} = $${r.sale.toFixed(2)} (you pay ${r.paidPct}% of the original).`,
        ...(Number(v.tax) > 0 ? [`Tax = $${r.sale.toFixed(2)} × ${Number(v.tax)}% = $${r.tax.toFixed(2)}; total $${r.total.toFixed(2)}.`] : []),
      ],
    };
  },
};

export default spec;
