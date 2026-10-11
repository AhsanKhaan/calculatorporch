import type { ToolInput } from '../schema';

const tool: ToolInput = {
  url: '/statistics/random-number-generator/',
  calculator: 'random-number',
  name: 'Random Number Generator',
  title: 'Random Number Generator: Any Range, No Repeats',
  description: 'Generate random numbers in any range, one or many, with or without repeats. Uses cryptographic randomness, so every number is equally likely.',
  h1: 'Random Number Generator',
  directAnswer:
    'Set the lowest and highest numbers, choose how many you need and whether they can repeat, then press Generate. Every whole number in the range is equally likely: between 1 and 16, each has a 1 in 16 (6.25%) chance on every pick. Nothing you generate is stored or sent anywhere.',
  whatItMeans:
    'Each number is drawn independently from the whole range, so with repeats allowed the same number can come up twice. Choose "every number is different" for things like picking winners or shuffling an order. The chance figure tells you how likely any single number is on one pick, which is useful for checking whether a result is as surprising as it feels.',
  howToUse: [
    'Enter the lowest and highest whole numbers you want (negative numbers work too).',
    'Choose how many numbers to generate, up to 1,000.',
    'Decide whether numbers may repeat.',
    'Press Generate as many times as you like; use Download CSV to keep a list.',
  ],
  faqs: [
    { q: 'Is this random number generator truly random?', a: 'It uses your browser’s cryptographic random source (crypto.getRandomValues), which is suitable for games, classroom draws and sampling. It is not a certified device for lotteries or gambling, which have their own legal requirements.' },
    { q: 'How do I pick a random number between 1 and 10?', a: 'Set the lowest number to 1 and the highest to 10, leave "how many" at 1 and press Generate. Each of the 10 numbers has a 10% chance of coming up.' },
    { q: 'Can I generate numbers without repeats?', a: 'Yes. Choose "No, every number is different". You can ask for as many unique numbers as there are in the range: up to 16 different numbers between 1 and 16, for example.' },
    { q: 'Why do I keep getting the same number?', a: 'Repeats are normal in random draws. With 5 picks from 1 to 20 there is about a 42% chance of at least one repeat, which surprises most people. The table on this page shows the odds for common ranges.' },
    { q: 'Can I use it to pick a winner?', a: 'Yes: number your entries, set the range to match, and generate one number (or several unique numbers for several winners). For transparency, share your screen or record the draw.' },
  ],
  sources: [
    {
      title: 'Web Cryptography Level 2: the getRandomValues() method',
      url: 'https://www.w3.org/TR/WebCryptoAPI/',
      publisher: 'W3C (World Wide Web Consortium)',
      accessed: '2026-10-11',
    },
    {
      title: 'Fast Random Integer Generation in an Interval',
      url: 'https://doi.org/10.1145/3230636',
      publisher: 'Daniel Lemire, ACM Transactions on Modeling and Computer Simulation 29(1), 2019',
      accessed: '2026-10-11',
    },
  ],
  pendingVerification: [],
  related: ['/statistics/probability-calculator/', '/statistics/statistics-calculator/', '/math/percentage-calculator/'],
  published: '2026-10-11',
  updated: '2026-10-11',
  batch: 1,
};

export default tool;
