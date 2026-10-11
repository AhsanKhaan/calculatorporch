import type { CalculatorSpec } from '@/lib/engine/spec';

export const SQFT_PER_SQM = 10.763910416709722; // 1 m² = 10.7639 ft² (exact from 1 ft = 0.3048 m)
export const SQFT_PER_ACRE = 43_560;

export type Shape = 'rectangle' | 'circle' | 'triangle';
export function area(shape: Shape, a: number, b: number): number {
  switch (shape) {
    case 'rectangle':
      return a * b;
    case 'circle':
      return Math.PI * (a / 2) ** 2; // a = diameter
    case 'triangle':
      return (a * b) / 2; // base × height ÷ 2
  }
}

const spec: CalculatorSpec = {
  id: 'square-footage',
  fields: [
    { key: 'shape', label: 'Shape', type: 'select', options: [{ value: 'rectangle', label: 'Rectangle or square' }, { value: 'circle', label: 'Circle' }, { value: 'triangle', label: 'Triangle' }], default: 'rectangle' },
    { key: 'a', label: 'Length (ft)', type: 'number', min: 0, max: 1_000_000, step: 0.01, default: 12, hint: 'Diameter for a circle; base for a triangle.' },
    { key: 'b', label: 'Width (ft)', type: 'number', min: 0, max: 1_000_000, step: 0.01, default: 15, hint: 'Height for a triangle; ignored for a circle.' },
    { key: 'count', label: 'Number of identical areas', type: 'number', min: 1, max: 1000, step: 1, default: 1 },
    { key: 'price', label: 'Price per sq ft ($)', type: 'number', min: 0, max: 100_000, step: 0.01, default: 0, hint: 'Optional: to estimate material or labor cost.' },
  ],
  outputs: [
    { key: 'sqft', label: 'Area', format: 'number', decimals: 2, suffix: 'sq ft', primary: true },
    { key: 'sqyd', label: 'Square yards', format: 'number', decimals: 2 },
    { key: 'sqm', label: 'Square meters', format: 'number', decimals: 2 },
    { key: 'acres', label: 'Acres', format: 'number', decimals: 4 },
    { key: 'cost', label: 'Estimated cost', format: 'currency', hideWhenNull: true },
  ],
  compute: (v) => {
    const shape = v.shape as Shape;
    const one = area(shape, Number(v.a), Number(v.b));
    const sqft = one * Number(v.count);
    const how = { rectangle: `${v.a} ft × ${v.b} ft = ${one.toFixed(2)} sq ft`, circle: `π × (${v.a} ÷ 2)² = ${one.toFixed(2)} sq ft`, triangle: `${v.a} ft × ${v.b} ft ÷ 2 = ${one.toFixed(2)} sq ft` }[shape];
    return {
      values: { sqft, sqyd: sqft / 9, sqm: sqft / SQFT_PER_SQM, acres: sqft / SQFT_PER_ACRE, cost: Number(v.price) > 0 ? sqft * Number(v.price) : null },
      steps: [
        `Area of one ${shape}: ${how}.`,
        ...(Number(v.count) > 1 ? [`× ${v.count} areas = ${sqft.toFixed(2)} sq ft.`] : []),
        `Square yards = sq ft ÷ 9 = ${(sqft / 9).toFixed(2)}; square meters = sq ft ÷ 10.7639 = ${(sqft / SQFT_PER_SQM).toFixed(2)}.`,
      ],
    };
  },
};

export default spec;
