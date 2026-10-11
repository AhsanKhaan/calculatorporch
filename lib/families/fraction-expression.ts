import { operate, parseFraction, toDecimal, toFractionString, toMixed, type Op, OP_WORD } from '@/lib/calculators/fraction';
import type { Family } from './types';

/** Wave-1 instances: only expressions with research evidence (docs/11 §1, gated by demand). */
const EXPRESSIONS: Record<string, { a: string; op: Op; b: string } | { convert: string }> = {
  '2-3-times-2-3': { a: '2/3', op: '×', b: '2/3' },
  '3-1-3-divided-by-4': { a: '3 1/3', op: '÷', b: '4' },
  '2-1-3-minus-2-3': { a: '2 1/3', op: '-', b: '2/3' },
  '2-1-3-times-2': { a: '2 1/3', op: '×', b: '2' },
  '1-1-2-times-1-4': { a: '1 1/2', op: '×', b: '1/4' },
  '2-3-in-fraction-form': { convert: '2/3' },
};

const SYM: Record<Op, string> = { '+': '+', '-': '−', '×': '×', '÷': '÷' };
const answerText = (a: string, op: Op, b: string) => {
  const r = operate(parseFraction(a)!, op, parseFraction(b)!, a, b);
  return r.result ? toMixed(r.result) : 'undefined';
};

const fractionFamily: Family = {
  id: 'fraction-expression',
  build: (slug) => {
    const def = EXPRESSIONS[slug];
    if (!def) return null;

    if ('convert' in def) {
      const f = parseFraction(def.convert)!;
      const dec = toDecimal(f);
      return {
        slug,
        name: `${def.convert} in Fraction Form`,
        title: `${def.convert} in Fraction Form, Decimal and Percent`,
        description: `${def.convert} is already a fraction in simplest form. See it as a decimal (${dec.toFixed(4)}) and a percent, plus its equivalent fractions.`,
        h1: `${def.convert} in Fraction Form`,
        directAnswer: `${def.convert} is already a fraction, and it is in simplest form because 2 and 3 share no common factor other than 1. As a decimal it is 0.6667 (rounded; the 6 repeats forever), and as a percentage it is 66.67%. Equivalent fractions include 4/6, 6/9 and 8/12.`,
        answer: { label: 'Simplest form', value: toFractionString(f) },
        steps: [
          `The greatest common divisor of 2 and 3 is 1, so ${def.convert} can't be simplified further.`,
          `Decimal: 2 ÷ 3 = ${dec.toFixed(6)}… (the 6 repeats).`,
          `Percent: ${dec.toFixed(6)} × 100 = ${(dec * 100).toFixed(2)}%.`,
        ],
        table: {
          caption: `Fractions equivalent to ${def.convert}`,
          columns: ['Multiply top and bottom by', 'Equivalent fraction', 'Decimal'],
          rows: [2, 3, 4, 5, 10].map((k) => [k, `${2 * k}/${3 * k}`, ((2 * k) / (3 * k)).toFixed(4)]),
        },
        faqs: [
          { q: 'What is 2/3 as a decimal?', a: '2/3 as a decimal is 0.666…, with the 6 repeating forever. Rounded to two decimal places it is 0.67, and to four places 0.6667.' },
          { q: 'Is 2/3 in simplest form?', a: 'Yes. A fraction is in simplest form when its numerator and denominator have no common factor other than 1. The only factor 2 and 3 share is 1, so 2/3 cannot be reduced.' },
        ],
        island: { id: 'fraction', initial: { a: '2/3', op: '×', b: '1' } },
      };
    }

    const { a, op, b } = def;
    const r = operate(parseFraction(a)!, op, parseFraction(b)!, a, b);
    const res = r.result!;
    const simple = toFractionString(res);
    const mixed = toMixed(res);
    const dec = toDecimal(res);
    const expr = `${a} ${SYM[op]} ${b}`;
    const word = OP_WORD[op];
    // Neighbouring problems: same first value, nearby second values (unique per instance).
    const neighbours = (op === '÷' || op === '×' ? ['1/2', '2', '3', '4', '5'] : ['1/3', '1/2', '1', '1 1/2', '2']).filter((x) => x !== b);
    return {
      slug,
      name: `${a} ${word} ${b}`,
      title: `${a} ${word[0]!.toUpperCase()}${word.slice(1)} ${b}: Answer as a Fraction`,
      description: `${expr} = ${simple}${mixed !== simple ? ` (${mixed})` : ''}. See the step-by-step working, the decimal (${dec.toFixed(4)}) and similar fraction problems.`,
      h1: `${a} ${word} ${b}`,
      directAnswer: `${a} ${word} ${b} equals ${simple}${mixed !== simple ? `, or ${mixed} as a mixed number` : ''}, which is ${dec.toFixed(4)} as a decimal. ${op === '×' ? 'To multiply fractions, multiply the numerators and the denominators' : op === '÷' ? 'To divide by a fraction or whole number, multiply by its reciprocal' : 'To subtract or add fractions, rewrite them over a common denominator'}, then simplify. The working below shows each step. As a percentage that is ${(dec * 100).toFixed(2)}%. Change either number in the calculator below to solve a similar problem.`,
      answer: { label: `${expr} =`, value: mixed !== simple ? `${simple} = ${mixed}` : simple },
      steps: r.steps,
      table: {
        caption: `${a} ${word} other numbers`,
        columns: ['Problem', 'Answer', 'Decimal'],
        rows: neighbours.map((n) => {
          const x = operate(parseFraction(a)!, op, parseFraction(n)!, a, n);
          return [`${a} ${SYM[op]} ${n}`, x.result ? toMixed(x.result) : 'undefined', x.result ? toDecimal(x.result).toFixed(4) : '—'];
        }),
      },
      faqs: [
        { q: `What is ${a} ${word} ${b} in fraction form?`, a: `${expr} = ${simple}${mixed !== simple ? `, which is ${mixed} as a mixed number` : ''}. As a decimal that is about ${dec.toFixed(4)}, and as a percentage ${(dec * 100).toFixed(2)}%.` },
        { q: `How do you work out ${a} ${word} ${b}?`, a: `${r.steps.join(' ')}` },
        { q: `What is ${a} ${word} ${neighbours[0]}?`, a: `${a} ${SYM[op]} ${neighbours[0]} = ${answerText(a, op, neighbours[0]!)}. Use the fraction calculator on this page to try any other numbers, with every step shown.` },
      ],
      island: { id: 'fraction', initial: { a, op, b } },
    };
  },
};

export default fractionFamily;
