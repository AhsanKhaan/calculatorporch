import type { ToolInput } from '../schema';

const tool: ToolInput = {
  url: '/finance/tip-calculator/',
  calculator: 'tip',
  name: 'Tip Calculator',
  title: 'Tip Calculator: Tip, Total and Split the Bill',
  description: 'Tip calculator and gratuity calculator: work out the tip and total for any bill, split it between people and round each share up to a whole dollar.',
  h1: 'Tip Calculator',
  directAnswer:
    'To calculate a tip, multiply the bill by the tip percentage. An 18% tip on a $64 bill is $11.52, making the total $75.52, or $37.76 each when two people split it. Choose to round each share up and the calculator shows the exact tip percentage that results.',
  whatItMeans:
    'The tip is the extra you add for service, and the total is the bill plus the tip. When you split the bill, each person pays an equal share of the total. Rounding each share up to a whole dollar makes paying in cash easier and nudges the tip up slightly, so the calculator shows the effective tip percentage after rounding.',
  howToUse: [
    'Enter the bill amount (before or after tax, whichever you prefer to tip on).',
    'Enter the tip percentage.',
    'Enter how many people are splitting the bill.',
    'Optionally round each share up, then read the tip, total and amount per person.',
  ],
  faqs: [
    { q: 'How do you calculate a tip?', a: 'Multiply the bill by the tip percentage and divide by 100. For a 20% tip on $45: $45 × 20 ÷ 100 = $9, so the total is $54. A quick mental check for 20% is to move the decimal one place left and double it.' },
    { q: 'Should I tip on the total before or after tax?', a: 'It’s your choice, and the difference is small. On a $50 bill with 8% sales tax ($54 in total), a 20% tip is $10.00 on the pre-tax amount or $10.80 on the total. Enter whichever amount you want to tip on.' },
    { q: 'How do you split a bill with a tip?', a: 'Add the tip to the bill, then divide the total by the number of people. For a $64 bill with an 18% tip split two ways, the total is $75.52 and each person pays $37.76.' },
    { q: 'How much should I tip for a haircut?', a: 'There’s no single rule, and this calculator doesn’t set a percentage for you. In a 2023 Pew Research Center survey, only 33% of US adults said it’s easy to know how much to tip for different services. Enter the price and the percentage you choose to see the tip and total.' },
    { q: 'What does rounding up each share do?', a: 'It raises each person’s payment to the next whole dollar, which makes the tip a little bigger. The calculator shows the new tip amount and the effective percentage, so you know exactly what you are leaving.' },
  ],
  sources: [
    {
      title: 'Tipping Culture in America: Public Sees a Changed Landscape',
      url: 'https://www.pewresearch.org/2023/11/09/tipping-culture-in-america-public-sees-a-changed-landscape/',
      publisher: 'Pew Research Center (Drew DeSilver and Jordan Lippert)',
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
  related: ['/finance/percent-off-calculator/', '/math/percentage-calculator/'],
  published: '2026-10-11',
  updated: '2026-10-11',
  batch: 2,
};

export default tool;
