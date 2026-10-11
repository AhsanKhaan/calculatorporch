import type { CalculatorSpec } from '@/lib/engine/spec';

export interface Stats {
  n: number;
  sum: number;
  mean: number;
  ss: number; // sum of squared deviations
  variance: number;
  sd: number;
}

/** Standard deviation (sample: divide by n − 1; population: divide by n). Two-pass for numerical stability. */
export function describe(xs: readonly number[], sample: boolean): Stats {
  const n = xs.length;
  const sum = xs.reduce((s, x) => s + x, 0);
  const mean = n ? sum / n : 0;
  const ss = xs.reduce((s, x) => s + (x - mean) ** 2, 0);
  const denom = sample ? n - 1 : n;
  const variance = denom > 0 ? ss / denom : 0;
  return { n, sum, mean, ss, variance, sd: Math.sqrt(variance) };
}

const fmt = (x: number) => (Number.isInteger(x) ? String(x) : x.toFixed(4).replace(/0+$/, '').replace(/\.$/, ''));

const spec: CalculatorSpec = {
  id: 'standard-deviation',
  fields: [
    { key: 'data', label: 'Your numbers', type: 'numberList', default: '2, 4, 4, 4, 5, 5, 7, 9', maxItems: 5000, min: -1e12, max: 1e12, hint: 'Separate with commas, spaces or new lines. Up to 5,000 values.' },
    { key: 'type', label: 'Treat the data as', type: 'select', options: [{ value: 'sample', label: 'A sample (divide by n − 1)' }, { value: 'population', label: 'The whole population (divide by n)' }], default: 'sample' },
  ],
  outputs: [
    { key: 'sd', label: 'Standard deviation', format: 'number', decimals: 6, primary: true },
    { key: 'variance', label: 'Variance', format: 'number', decimals: 6 },
    { key: 'mean', label: 'Mean', format: 'number', decimals: 6 },
    { key: 'n', label: 'Count (n)', format: 'integer' },
    { key: 'sum', label: 'Sum', format: 'number', decimals: 6 },
  ],
  compute: (v) => {
    const xs = v.data as number[];
    const sample = v.type === 'sample';
    const s = describe(xs, sample);
    if (sample && s.n < 2) return { values: { sd: null, variance: null, mean: s.mean, n: s.n, sum: s.sum }, warnings: ['A sample needs at least 2 values.'] };
    const shown = xs.slice(0, 8);
    return {
      values: { sd: s.sd, variance: s.variance, mean: s.mean, n: s.n, sum: s.sum },
      steps: [
        `Mean = sum ÷ n = ${fmt(s.sum)} ÷ ${s.n} = ${fmt(s.mean)}.`,
        `Squared deviations: ${shown.map((x) => `(${fmt(x)} − ${fmt(s.mean)})² = ${fmt((x - s.mean) ** 2)}`).join('; ')}${xs.length > 8 ? '; …' : ''}.`,
        `Sum of squared deviations = ${fmt(s.ss)}.`,
        `Variance = ${fmt(s.ss)} ÷ ${sample ? `(n − 1) = ${s.n - 1}` : `n = ${s.n}`} = ${fmt(s.variance)}.`,
        `Standard deviation = √${fmt(s.variance)} = ${fmt(s.sd)}.`,
      ],
    };
  },
};

export default spec;
