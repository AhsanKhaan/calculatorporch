import type { Family } from './types';

/** Wave-1 instance: "number generator 1 to 16" (27.1K/KD 20, docs/11 §1). */
const RANGES: Record<string, [number, number]> = { '1-to-16': [1, 16] };

const pct = (x: number) => `${(x * 100).toFixed(2)}%`;

const randomRangeFamily: Family = {
  id: 'random-range',
  build: (slug) => {
    const r = RANGES[slug];
    if (!r) return null;
    const [lo, hi] = r;
    const size = hi - lo + 1;
    return {
      slug,
      name: `Random Number ${lo} to ${hi}`,
      title: `Random Number Generator ${lo} to ${hi}`,
      description: `Pick a random number from ${lo} to ${hi}, one or several, with or without repeats. Each number has a 1 in ${size} chance; see the odds for repeated picks.`,
      h1: `Random Number Generator ${lo} to ${hi}`,
      directAnswer: `Press Generate to pick a random whole number from ${lo} to ${hi}. Each of the ${size} numbers has an equal 1 in ${size} chance (${pct(1 / size)}) on every pick. Choose "no repeats" to draw several different numbers, for example to order ${size} teams or players fairly.`,
      answer: { label: `Chance of each number from ${lo} to ${hi}`, value: `1 in ${size} (${pct(1 / size)})` },
      steps: [`There are ${hi} − ${lo} + 1 = ${size} whole numbers in the range.`, `With a fair generator, each has a 1 ÷ ${size} = ${pct(1 / size)} chance on every pick.`],
      table: {
        caption: `Odds when picking from ${lo} to ${hi}`,
        columns: ['Picks', 'Chance a given number appears', 'Chance of at least one repeat'],
        rows: [1, 2, 3, 4, 5, 6, 8].map((k) => {
          let noRepeat = 1;
          for (let i = 0; i < k; i++) noRepeat *= (size - i) / size;
          return [k, pct(1 - ((size - 1) / size) ** k), pct(1 - noRepeat)];
        }),
      },
      faqs: [
        { q: `How do I get a random number between ${lo} and ${hi}?`, a: `The generator on this page is already set to ${lo}–${hi}: press Generate. It uses your browser's cryptographic random source, so each number has the same ${pct(1 / size)} chance.` },
        { q: `What are the odds of picking the same number twice from ${lo} to ${hi}?`, a: `On two picks the chance of a repeat is 1 in ${size} (${pct(1 / size)}). The odds of at least one repeat rise quickly with more picks, as the table shows; choose "no repeats" to avoid them.` },
      ],
      island: { id: 'random-number', initial: { min: String(lo), max: String(hi), count: '1', unique: 'no' } },
    };
  },
};

export default randomRangeFamily;
