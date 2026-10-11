import type { Explain } from '@/lib/engine/explain';
import { operate, parseFraction, toFractionString, toMixed } from './fraction';

const show = (a: string, op: '+' | '-' | '×' | '÷', b: string) => {
  const r = operate(parseFraction(a)!, op, parseFraction(b)!);
  return r.result ? `${toFractionString(r.result)}${toMixed(r.result) !== toFractionString(r.result) ? ` (${toMixed(r.result)})` : ''}` : 'n/a';
};

export default function explain(): Explain {
  const ex = operate(parseFraction('2 1/3')!, '+', parseFraction('3/4')!, '2 1/3', '3/4');
  return {
    formula: [
      'add / subtract:  a/b ± c/d = (a×d ± c×b) / (b×d), then simplify',
      'multiply:        a/b × c/d = (a×c) / (b×d), then simplify',
      'divide:          a/b ÷ c/d = a/b × d/c = (a×d) / (b×c)',
      'mixed number:    w n/d = (w×d + n) / d',
      'simplify:        divide top and bottom by their greatest common divisor',
    ],
    example: `Worked example: 2 1/3 + 3/4. ${ex.steps.join(' ')} Answer: ${ex.result ? `${toFractionString(ex.result)} = ${toMixed(ex.result)}` : ''}.`,
    tables: [
      {
        caption: 'Common fraction results',
        columns: ['Problem', 'Answer'],
        rows: [
          ['1/2 + 1/3', show('1/2', '+', '1/3')],
          ['3/4 − 1/3', show('3/4', '-', '1/3')],
          ['2/3 × 3/4', show('2/3', '×', '3/4')],
          ['1/2 ÷ 1/4', show('1/2', '÷', '1/4')],
          ['1 1/2 × 1/4', show('1 1/2', '×', '1/4')],
          ['3 1/3 ÷ 4', show('3 1/3', '÷', '4')],
        ],
        note: 'Computed by the calculator above.',
      },
    ],
    assumptions: [
      'Results are exact fractions in simplest form; the decimal is rounded to 6 places.',
      'Each whole number, numerator and denominator can have up to 6 digits.',
      'A negative mixed number such as −1 1/2 means −(1 + 1/2) = −3/2.',
    ],
  };
}
