import type { Explain } from '@/lib/engine/explain';
import { percentOff } from './percent-off.spec';

const $ = (n: number) => `$${n.toFixed(2)}`;

export default function explain(): Explain {
  const ex = percentOff(60, 40);
  const prices = [20, 50, 100];
  const pcts = [10, 15, 20, 25, 30, 40, 50, 60, 70];
  return {
    formula: ['savings    = price × percent off ÷ 100', 'sale price = price − savings = price × (1 − percent off ÷ 100)', 'with tax   = sale price × (1 + tax rate ÷ 100)'],
    example: `Worked example: 40% off $60. Savings = $60 × 0.40 = ${$(ex.savings)}. Sale price = $60 − ${$(ex.savings)} = ${$(ex.sale)}, which is ${ex.paidPct}% of the original price.`,
    tables: [
      {
        caption: 'Sale prices at common discounts',
        columns: ['Percent off', ...prices.map((p) => `$${p} item`)],
        rows: pcts.map((pct) => [`${pct}% off`, ...prices.map((p) => $(percentOff(p, pct).sale))]),
        note: 'Computed by the calculator above; sales tax not included.',
      },
    ],
    assumptions: [
      'Stacked discounts multiply rather than add: 20% off and then another 10% off is 28% off in total, not 30%.',
      'Sales tax is applied to the discounted price, which is how most US states handle store coupons and sales. Check your state for manufacturer coupons.',
    ],
  };
}
