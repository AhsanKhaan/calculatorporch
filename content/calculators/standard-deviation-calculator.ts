import type { ToolInput } from '../schema';

const tool: ToolInput = {
  url: '/statistics/standard-deviation-calculator/',
  calculator: 'standard-deviation',
  name: 'Standard Deviation Calculator',
  title: 'Standard Deviation Calculator: Sample and Population',
  description: 'Standard deviation calculator with every step of the calculation shown: the standard deviation, variance and mean of a sample or a population.',
  h1: 'Standard Deviation Calculator',
  directAnswer:
    'Standard deviation measures how spread out numbers are around their mean: find the mean, average the squared distances from it, and take the square root. For 2, 4, 4, 4, 5, 5, 7, 9 the mean is 5 and the population standard deviation is 2; as a sample it is about 2.138.',
  appCategory: 'EducationalApplication',
  whatItMeans:
    'A small standard deviation means your values sit close to the mean; a large one means they are spread out. Use the sample version (dividing by n − 1) when your numbers are a subset of a larger group, which is the usual case for homework, surveys and experiments, and the population version (dividing by n) only when you have every value there is.',
  howToUse: [
    'Paste or type your numbers, separated by commas, spaces or new lines.',
    'Choose sample or population.',
    'Read the standard deviation, variance, mean, count and sum.',
    'Open "Show the working" to see every step, ready to copy into your notes.',
  ],
  faqs: [
    { q: 'What is the difference between sample and population standard deviation?', a: 'The population formula divides the sum of squared deviations by n, the number of values. The sample formula divides by n − 1, which corrects the tendency of a sample to underestimate the spread of the whole group. With large data sets the two get very close.' },
    { q: 'How do you calculate standard deviation by hand?', a: 'Find the mean, subtract it from each value and square the results, add the squares, divide by n (population) or n − 1 (sample) to get the variance, then take the square root. The working panel shows each of these steps for your data.' },
    { q: 'What is variance?', a: 'Variance is the average of the squared deviations from the mean, which is the standard deviation squared. It is in squared units (for example dollars squared), which is why the standard deviation is usually easier to interpret.' },
    { q: 'Can standard deviation be zero?', a: 'Yes, when every value is the same, because nothing differs from the mean. Standard deviation can never be negative.' },
    { q: 'How many numbers can I enter?', a: 'Up to 5,000 values, separated by commas, spaces, semicolons or new lines. Each value can be negative or a decimal.' },
  ],
  sources: [
    {
      title: 'NIST/SEMATECH e-Handbook of Statistical Methods, 1.3.5.6 Measures of Scale',
      url: 'https://www.itl.nist.gov/div898/handbook/eda/section3/eda356.htm',
      publisher: 'National Institute of Standards and Technology (NIST)',
      accessed: '2026-10-11',
    },
    {
      title: 'Introductory Statistics 2e, 2.7 Measures of the Spread of the Data',
      url: 'https://openstax.org/books/introductory-statistics-2e/pages/2-7-measures-of-the-spread-of-the-data',
      publisher: 'OpenStax, Rice University (Barbara Illowsky and Susan Dean)',
      accessed: '2026-10-11',
    },
  ],
  pendingVerification: [],
  related: ['/statistics/mean-median-mode-calculator/', '/statistics/z-score-calculator/', '/statistics/statistics-calculator/'],
  published: '2026-10-11',
  updated: '2026-10-11',
  batch: 2,
};

export default tool;
