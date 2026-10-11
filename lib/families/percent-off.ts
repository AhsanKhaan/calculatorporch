import { percentOff } from '@/lib/calculators/percent-off.spec';
import type { Family } from './types';

/** Wave-1 instance: "60 off 40" / "60$ 40 off" (2.9K + 1.9K, docs/11 §1). */
const CASES: Record<string, { pct: number; price: number }> = { '40-percent-off-60': { pct: 40, price: 60 } };

const $ = (n: number) => `$${n.toFixed(2)}`;

const percentOffFamily: Family = {
  id: 'percent-off',
  build: (slug) => {
    const c = CASES[slug];
    if (!c) return null;
    const r = percentOff(c.price, c.pct);
    return {
      slug,
      name: `${c.pct}% Off $${c.price}`,
      title: `${c.pct}% Off $${c.price}: Sale Price and Savings`,
      description: `${c.pct}% off $${c.price} is ${$(r.sale)}: you save ${$(r.savings)}. See the working, other discounts on $${c.price}, and ${c.pct}% off other prices.`,
      h1: `${c.pct}% Off $${c.price}`,
      directAnswer: `${c.pct}% off $${c.price} is ${$(r.sale)}. The discount is $${c.price} × ${c.pct}% = ${$(r.savings)}, and $${c.price} − ${$(r.savings)} = ${$(r.sale)}, so you pay ${r.paidPct}% of the original price. Sales tax, if any, is added to the ${$(r.sale)} sale price. For a quick mental check, 10% of $${c.price} is ${$(c.price / 10)}, so ${c.pct}% is ${c.pct / 10} times that.`,
      answer: { label: `${c.pct}% off $${c.price}`, value: $(r.sale) },
      steps: [`Savings = $${c.price} × ${c.pct} ÷ 100 = ${$(r.savings)}.`, `Sale price = $${c.price} − ${$(r.savings)} = ${$(r.sale)}.`],
      table: {
        caption: `Other discounts on $${c.price}, and ${c.pct}% off other prices`,
        columns: ['Deal', 'Sale price', 'You save'],
        rows: [
          ...[20, 25, 30, 50, 60].map((p) => [`${p}% off $${c.price}`, $(percentOff(c.price, p).sale), $(percentOff(c.price, p).savings)]),
          ...[40, 50, 80, 100].map((p) => [`${c.pct}% off $${p}`, $(percentOff(p, c.pct).sale), $(percentOff(p, c.pct).savings)]),
        ],
      },
      faqs: [
        { q: `How much is ${c.pct}% off $${c.price}?`, a: `${c.pct}% off $${c.price} is ${$(r.sale)}. You save ${$(r.savings)}, which is ${c.pct}% of $${c.price}.` },
        { q: `What is ${c.pct}% of $${c.price}?`, a: `${c.pct}% of $${c.price} is ${$(r.savings)} (that is the discount). Multiply $${c.price} by ${c.pct / 100} to get it.` },
        { q: `Is ${c.pct}% off then another 10% off the same as ${c.pct + 10}% off?`, a: `No. Discounts multiply: ${c.pct}% off and then 10% off leaves ${(100 - c.pct) * 0.9}% of the price, which is ${100 - (100 - c.pct) * 0.9}% off in total, slightly less than ${c.pct + 10}%.` },
      ],
      island: { id: 'percent-off', initial: { price: String(c.price), pct: String(c.pct), tax: '0' } },
    };
  },
};

export default percentOffFamily;
