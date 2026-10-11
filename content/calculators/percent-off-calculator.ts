import type { ToolInput } from '../schema';

const tool: ToolInput = {
  url: '/finance/percent-off-calculator/',
  calculator: 'percent-off',
  name: 'Percent Off Calculator',
  title: 'Percent Off Calculator: Sale Price and Savings',
  description: 'Percent off calculator: find the sale price and how much you save at any discount, with optional sales tax and a table of common discounts.',
  h1: 'Percent Off Calculator',
  directAnswer:
    'To calculate a percent off, multiply the price by the discount to get your savings, then subtract it from the price. 40% off $60 saves $24.00, so you pay $36.00, which is 60% of the original price. Add your sales tax rate to see the total at the register.',
  whatItMeans:
    'The sale price is what the item costs after the discount, and "you save" is the discount in dollars. The "you pay" percentage is the share of the original price left after the discount, which makes it easy to compare offers: 30% off and "pay 70%" are the same deal. Sales tax, if you add it, is charged on the discounted price.',
  howToUse: [
    'Enter the original price.',
    'Enter the percent off (for example 25 for 25% off).',
    'Optionally add your sales tax rate to see the total you will pay.',
    'Compare offers with the table, or share the result with Copy link.',
  ],
  faqs: [
    { q: 'How do you calculate the percentage off a price?', a: 'Multiply the original price by the percentage and divide by 100 to get the savings, then subtract the savings from the price. For 25% off $80: $80 × 25 ÷ 100 = $20 saved, so the sale price is $60.' },
    { q: 'What is 40% off $60?', a: '40% off $60 is $36. The discount is $60 × 0.40 = $24, and $60 − $24 = $36, which is 60% of the original price.' },
    { q: 'Do two discounts add up?', a: 'No, they multiply. 20% off followed by another 10% off is 28% off in total, not 30%: you pay 80% of 90% of the price, which is 72%.' },
    { q: 'Is sales tax charged before or after the discount?', a: 'For store discounts and sales, US sales tax is generally charged on the discounted price, which is what this calculator does. Rules for manufacturer coupons vary by state.' },
    { q: 'How do I find the original price from a sale price?', a: 'Divide the sale price by (1 − discount). If something costs $36 after 40% off, the original price was $36 ÷ 0.60 = $60.' },
  ],
  sources: [
    {
      title: "Coupons Shouldn't Be Taxed, but Government Vouchers Should",
      url: 'https://taxfoundation.org/blog/coupons-shouldnt-be-taxed-government-vouchers-should/',
      publisher: 'Tax Foundation (Josh Barro, updated July 24, 2023)',
      accessed: '2026-10-11',
    },
    {
      title: 'Grade 6: Ratios and Proportional Relationships (6.RP.A.3.c, percent of a quantity)',
      url: 'https://www.thecorestandards.org/Math/Content/6/RP/',
      publisher: 'Common Core State Standards Initiative',
      accessed: '2026-10-11',
    },
  ],
  pendingVerification: [],
  related: ['/finance/tip-calculator/', '/math/percentage-calculator/', '/finance/3d-printing-cost-calculator/'],
  published: '2026-10-11',
  updated: '2026-10-11',
  batch: 1,
};

export default tool;
