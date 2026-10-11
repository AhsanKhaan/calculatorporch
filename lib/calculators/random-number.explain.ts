import type { Explain } from '@/lib/engine/explain';

const pct = (x: number) => `${(x * 100).toFixed(2)}%`;

export default function explain(): Explain {
  const ranges = [6, 10, 16, 20, 50, 100];
  return {
    formula: [
      'range size        = highest − lowest + 1',
      'chance per pick   = 1 ÷ range size',
      'unbiased draw     = lowest + (random 32-bit value mod range size), redrawing values that would bias the result',
      'no repeats        = draw again whenever a number has already been picked',
    ],
    example:
      'Worked example: for a number between 1 and 16, the range size is 16, so each number has a 1 in 16 (6.25%) chance on every pick. Asking for 3 numbers with no repeats draws until 3 different numbers come up.',
    tables: [
      {
        caption: 'Chances for common ranges',
        columns: ['Range', 'Chance per pick', 'Chance a repeat appears in 5 picks'],
        rows: ranges.map((n) => {
          let noRepeat = 1;
          for (let i = 0; i < 5; i++) noRepeat *= Math.max(0, n - i) / n;
          return [`1 to ${n}`, pct(1 / n), pct(1 - noRepeat)];
        }),
        note: 'The last column is the "birthday problem": repeats come up sooner than most people expect.',
      },
    ],
    assumptions: [
      "Numbers come from your browser's cryptographic random generator (crypto.getRandomValues), with rejection sampling so every number in the range is equally likely.",
      'The page itself shows no random result: press Generate. Nothing is stored or sent anywhere.',
      "Don't use it for lotteries, gambling or anything with legal requirements for certified randomness.",
    ],
  };
}
