import type { ToolInput } from '../schema';

const tool: ToolInput = {
  url: '/math/fraction-calculator/',
  calculator: 'fraction',
  name: 'Fraction Calculator',
  title: 'Fraction Calculator: Add, Subtract, Multiply, Divide',
  description: 'Add, subtract, multiply and divide fractions and mixed numbers, with every step shown and the answer in simplest form, as a mixed number and a decimal.',
  h1: 'Fraction Calculator',
  directAnswer:
    'To multiply fractions, multiply the numerators and the denominators, then simplify: 2/3 × 2/3 = 4/9. To add or subtract, rewrite both over a common denominator first. This fraction calculator does all four operations with mixed numbers too, and shows every step and the decimal answer.',
  appCategory: 'EducationalApplication',
  whatItMeans:
    'The answer is shown in simplest form, which means the numerator and denominator share no common factor other than 1. If the answer is bigger than 1, you also get it as a mixed number (a whole number plus a fraction), plus the decimal and percentage, so you can use whichever form your homework or recipe asks for.',
  howToUse: [
    'Type the first value as a fraction (3/4), a mixed number with a space (2 1/3), a whole number or a decimal.',
    'Choose add, subtract, multiply or divide.',
    'Type the second value the same way.',
    'Read the answer in simplest form, then open "Show the working" to see each step.',
  ],
  faqs: [
    { q: 'How do you add fractions with different denominators?', a: 'Find a common denominator (the least common multiple of the two denominators), rewrite each fraction over it, add the numerators, then simplify. For 1/2 + 1/3, the common denominator is 6: 3/6 + 2/6 = 5/6.' },
    { q: 'How do you multiply mixed numbers?', a: 'Turn each mixed number into an improper fraction first: 2 1/3 becomes (2 × 3 + 1)/3 = 7/3. Then multiply the numerators and denominators and simplify. For 2 1/3 × 2, that is 7/3 × 2/1 = 14/3, or 4 2/3 as a mixed number.' },
    { q: 'How do you divide fractions?', a: 'Multiply the first fraction by the reciprocal of the second (flip it upside down). For example, 1/2 ÷ 1/4 = 1/2 × 4/1 = 4/2 = 2. Dividing by zero is undefined, so the calculator warns you if the second value is 0.' },
    { q: 'What does simplest form mean?', a: 'A fraction is in simplest form when the numerator and denominator have no common factor other than 1. To get there, divide both by their greatest common divisor: 12/18 has a GCD of 6, so it simplifies to 2/3.' },
    { q: 'How do I enter a mixed number?', a: 'Type the whole number, a space, then the fraction, like 2 1/3. You can also type improper fractions (7/3), whole numbers (5), negative values (-3/4) and short decimals (0.25), which are converted to fractions exactly.' },
    { q: 'How do you convert a fraction to a decimal?', a: 'Divide the numerator by the denominator. For example, 2/3 = 2 ÷ 3 = 0.666667 (rounded). The calculator shows the decimal and the percentage for every answer.' },
  ],
  sources: [
    {
      title: 'Grade 5: Number and Operations, Fractions (5.NF)',
      url: 'https://www.thecorestandards.org/Math/Content/5/NF/',
      publisher: 'Common Core State Standards Initiative',
      accessed: '2026-10-11',
    },
    {
      title: 'Grade 6: The Number System (6.NS.A.1, dividing fractions by fractions)',
      url: 'https://www.thecorestandards.org/Math/Content/6/NS/',
      publisher: 'Common Core State Standards Initiative',
      accessed: '2026-10-11',
    },
  ],
  pendingVerification: [],
  related: ['/math/lcm-calculator/', '/math/percentage-calculator/', '/statistics/mean-median-mode-calculator/'],
  published: '2026-10-11',
  updated: '2026-10-11',
  batch: 1,
};

export default tool;
