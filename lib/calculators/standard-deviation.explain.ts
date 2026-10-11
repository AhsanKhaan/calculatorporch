import type { Explain } from '@/lib/engine/explain';
import { describe } from './standard-deviation.spec';

const f = (x: number) => x.toFixed(4).replace(/0+$/, '').replace(/\.$/, '');

export default function explain(): Explain {
  const data = [2, 4, 4, 4, 5, 5, 7, 9];
  const pop = describe(data, false);
  const smp = describe(data, true);
  const sets: [string, number[]][] = [
    ['1, 2, 3, 4, 5', [1, 2, 3, 4, 5]],
    ['10, 10, 10, 10', [10, 10, 10, 10]],
    ['2, 4, 4, 4, 5, 5, 7, 9', data],
    ['1, 100', [1, 100]],
  ];
  return {
    formula: [
      'mean (x̄)               = Σx ÷ n',
      'population SD (σ)      = √( Σ(x − x̄)² ÷ n )',
      'sample SD (s)          = √( Σ(x − x̄)² ÷ (n − 1) )     ← Bessel’s correction',
      'variance               = SD²',
    ],
    example: `Worked example: 2, 4, 4, 4, 5, 5, 7, 9. The mean is ${f(pop.mean)} and the squared deviations add up to ${f(pop.ss)}. As a population, variance = ${f(pop.ss)} ÷ 8 = ${f(pop.variance)} and σ = ${f(pop.sd)}. As a sample, variance = ${f(smp.ss)} ÷ 7 = ${f(smp.variance)} and s = ${f(smp.sd)}.`,
    tables: [
      { caption: 'Sample vs population standard deviation', columns: ['Data', 'Mean', 'Population σ', 'Sample s'], rows: sets.map(([label, xs]) => [label, f(describe(xs, false).mean), f(describe(xs, false).sd), f(describe(xs, true).sd)]), note: 'Computed by the calculator above.' },
    ],
    assumptions: [
      'Use "sample" when your numbers are a subset of a bigger group (most homework and survey data); use "population" when you have every value.',
      'The calculator uses a two-pass method (mean first, then squared deviations), which avoids the rounding errors of the shortcut formula on large numbers.',
    ],
  };
}
