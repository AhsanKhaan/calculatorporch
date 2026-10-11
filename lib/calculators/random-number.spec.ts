import type { CalculatorSpec, Values } from '@/lib/engine/spec';

/** Unbiased integer in [min, max] using crypto.getRandomValues with rejection sampling (no modulo bias). */
export function randomInt(min: number, max: number, rand: () => number = cryptoUint32): number {
  const range = max - min + 1;
  const limit = Math.floor(0x1_0000_0000 / range) * range;
  let x: number;
  do x = rand();
  while (x >= limit);
  return min + (x % range);
}

function cryptoUint32(): number {
  const a = new Uint32Array(1);
  globalThis.crypto.getRandomValues(a);
  return a[0] ?? 0;
}

export function generate(min: number, max: number, count: number, unique: boolean, rand?: () => number): number[] {
  const out: number[] = [];
  const seen = new Set<number>();
  while (out.length < count) {
    const n = randomInt(min, max, rand);
    if (unique && seen.has(n)) continue;
    seen.add(n);
    out.push(n);
  }
  return out;
}

const bounds = (v: Values) => {
  const a = Math.trunc(Number(v.min));
  const b = Math.trunc(Number(v.max));
  return { lo: Math.min(a, b), hi: Math.max(a, b) };
};

const describe = (v: Values) => {
  const { lo, hi } = bounds(v);
  const size = hi - lo + 1;
  const count = Math.trunc(Number(v.count));
  const tooMany = v.unique === 'yes' && count > size;
  return { lo, hi, size, count, tooMany };
};

const spec: CalculatorSpec = {
  id: 'random-number',
  fields: [
    { key: 'min', label: 'Lowest number', type: 'number', min: -1_000_000_000, max: 1_000_000_000, step: 1, default: 1 },
    { key: 'max', label: 'Highest number', type: 'number', min: -1_000_000_000, max: 1_000_000_000, step: 1, default: 100 },
    { key: 'count', label: 'How many numbers', type: 'number', min: 1, max: 1000, step: 1, default: 1 },
    { key: 'unique', label: 'Allow repeats?', type: 'select', options: [{ value: 'no', label: 'Yes, numbers can repeat' }, { value: 'yes', label: 'No, every number is different' }], default: 'no' },
  ],
  outputs: [
    { key: 'numbers', label: 'Your random numbers', format: 'text', primary: true },
    { key: 'size', label: 'Numbers in the range', format: 'integer' },
    { key: 'chance', label: 'Chance of any one number (per pick)', format: 'percent', decimals: 4 },
  ],
  // Static HTML can't show a random result, so the default state invites a click; the button does the work.
  compute: (v) => {
    const d = describe(v);
    return {
      values: { numbers: 'Press "Generate"', size: d.size, chance: 100 / d.size },
      warnings: d.tooMany ? [`You asked for ${d.count} different numbers, but there are only ${d.size} in the range.`] : [],
    };
  },
  action: {
    label: 'Generate',
    run: (v) => {
      const d = describe(v);
      if (d.tooMany) return { values: { numbers: null, size: d.size, chance: 100 / d.size }, warnings: [`You asked for ${d.count} different numbers, but there are only ${d.size} in the range.`] };
      const nums = generate(d.lo, d.hi, d.count, v.unique === 'yes');
      return { values: { numbers: nums.join(', '), size: d.size, chance: 100 / d.size } };
    },
  },
};

export default spec;
