import type { CalculatorSpec } from '@/lib/engine/spec';

/**
 * Typical loose densities in tons (2,000 lb) per cubic yard. [U] docs/03 §6: verify each against supplier or DOT
 * data and cite before publishing (content `pendingVerification`).
 */
export const GRAVEL_TYPES = {
  pea: { label: 'Pea gravel', tonsPerYd3: 1.4 },
  crushed57: { label: '#57 crushed stone', tonsPerYd3: 1.4 },
  river: { label: 'River rock', tonsPerYd3: 1.35 },
  dg: { label: 'Decomposed granite', tonsPerYd3: 1.5 },
  crusherRun: { label: 'Crusher run / road base', tonsPerYd3: 1.7 },
} as const;
export type GravelType = keyof typeof GRAVEL_TYPES;

export const BAG_FT3 = 0.5;

export function gravel(areaFt2: number, depthIn: number, type: GravelType, wastePct: number) {
  const ft3 = areaFt2 * (depthIn / 12) * (1 + wastePct / 100);
  const yd3 = ft3 / 27;
  const tons = yd3 * GRAVEL_TYPES[type].tonsPerYd3;
  // Round away float noise first (110 / 0.5 = 220.00000000000003 would otherwise ceil to 221).
  return { ft3, yd3, tons, bags: Math.ceil(Number((ft3 / BAG_FT3).toFixed(6))) };
}

const spec: CalculatorSpec = {
  id: 'gravel',
  fields: [
    { key: 'shape', label: 'Area shape', type: 'select', group: 'Area', options: [{ value: 'rectangle', label: 'Rectangle' }, { value: 'circle', label: 'Circle' }], default: 'rectangle' },
    { key: 'length', label: 'Length (ft)', type: 'number', group: 'Area', min: 0, max: 100_000, step: 0.1, default: 40, hint: 'Diameter for a circle.' },
    { key: 'width', label: 'Width (ft)', type: 'number', group: 'Area', min: 0, max: 100_000, step: 0.1, default: 10, hint: 'Ignored for a circle.' },
    { key: 'depth', label: 'Depth (inches)', type: 'number', group: 'Area', min: 0.5, max: 48, step: 0.5, default: 3 },
    { key: 'type', label: 'Gravel type', type: 'select', group: 'Material', options: Object.entries(GRAVEL_TYPES).map(([k, g]) => ({ value: k, label: `${g.label} (~${g.tonsPerYd3} t/yd³)` })), default: 'pea' },
    { key: 'waste', label: 'Extra for compaction and waste (%)', type: 'number', group: 'Material', min: 0, max: 50, step: 1, default: 10 },
    { key: 'pricePerTon', label: 'Price per ton ($)', type: 'number', group: 'Material', min: 0, max: 10_000, step: 0.01, default: 0, hint: 'Optional: from your supplier.' },
  ],
  outputs: [
    { key: 'yd3', label: 'Gravel needed', format: 'number', decimals: 2, suffix: 'cubic yards', primary: true },
    { key: 'tons', label: 'Weight', format: 'number', decimals: 2, suffix: 'tons' },
    { key: 'ft3', label: 'Cubic feet', format: 'number', decimals: 1 },
    { key: 'bags', label: '0.5 cu ft bags', format: 'integer' },
    { key: 'cost', label: 'Estimated cost', format: 'currency', hideWhenNull: true },
  ],
  compute: (v) => {
    const l = Number(v.length);
    const w = Number(v.width);
    const areaFt2 = v.shape === 'circle' ? Math.PI * (l / 2) ** 2 : l * w;
    const type = (v.type as GravelType) in GRAVEL_TYPES ? (v.type as GravelType) : 'pea';
    const g = gravel(areaFt2, Number(v.depth), type, Number(v.waste));
    return {
      values: { ...g, cost: Number(v.pricePerTon) > 0 ? g.tons * Number(v.pricePerTon) : null },
      steps: [
        `Area = ${v.shape === 'circle' ? `π × (${l} ÷ 2)²` : `${l} ft × ${w} ft`} = ${areaFt2.toFixed(1)} sq ft.`,
        `Volume = area × depth ÷ 12 × (1 + ${v.waste}%) = ${areaFt2.toFixed(1)} × ${v.depth} ÷ 12 × ${(1 + Number(v.waste) / 100).toFixed(2)} = ${g.ft3.toFixed(1)} cu ft.`,
        `Cubic yards = cu ft ÷ 27 = ${g.yd3.toFixed(2)} yd³.`,
        `Tons = yd³ × ${GRAVEL_TYPES[type].tonsPerYd3} (${GRAVEL_TYPES[type].label}) = ${g.tons.toFixed(2)} tons.`,
      ],
    };
  },
};

export default spec;
