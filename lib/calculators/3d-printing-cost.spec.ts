import electricity from '@/data/electricity-us.json';
import type { CalculatorSpec } from '@/lib/engine/spec';
import { DEFAULTS, DENSITY, FEE_PRESETS, FEE_PRESET_KEYS, MATERIALS, calculate, filamentLengthMeters, type FeePreset } from './3d-printing-cost';

const RATES = new Map<string, number>(Object.entries(electricity.rates as Record<string, number>));
const US_AVG = RATES.get('US average') ?? DEFAULTS.centsPerKwh;
const STATE_OPTIONS = [
  { value: 'US average', label: `US average: ${US_AVG.toFixed(2)}¢/kWh` },
  ...[...RATES.entries()].filter(([n]) => n !== 'US average').sort((a, b) => a[0].localeCompare(b[0])).map(([n, c]) => ({ value: n, label: `${n}: ${c.toFixed(2)}¢/kWh` })),
  { value: 'custom', label: 'Custom rate' },
];
const pct = (p: FeePreset) => String(+(FEE_PRESETS[p].pct * 100).toFixed(2));

/** The 3D printing cost calculator as an engine spec. Maths unchanged: see ./3d-printing-cost.ts and its 7 tests. */
const spec: CalculatorSpec = {
  id: '3d-printing-cost',
  csvName: '3d-print-cost',
  fields: [
    { key: 'material', label: 'Filament type', type: 'select', group: 'Material', options: MATERIALS.map((m) => ({ value: m, label: m })), default: DEFAULTS.material },
    { key: 'grams', label: 'Filament used (g)', type: 'number', group: 'Material', min: 0, max: 100_000, step: 1, default: DEFAULTS.grams },
    { key: 'spoolPrice', label: 'Spool price ($)', type: 'number', group: 'Material', min: 0, max: 10_000, step: 0.01, default: DEFAULTS.spoolPrice },
    { key: 'spoolGrams', label: 'Spool weight (g)', type: 'number', group: 'Material', min: 1, max: 100_000, step: 1, default: DEFAULTS.spoolGrams },
    { key: 'hours', label: 'Print time (hours)', type: 'number', group: 'Machine & power', min: 0, max: 10_000, step: 0.1, default: DEFAULTS.hours },
    { key: 'watts', label: 'Average power draw (W)', type: 'number', group: 'Machine & power', min: 0, max: 5_000, step: 1, default: DEFAULTS.watts, hint: 'Check your printer specs or use a plug-in power meter.' },
    { key: 'state', label: 'Your state (electricity price)', type: 'select', group: 'Machine & power', options: STATE_OPTIONS, default: 'US average' },
    { key: 'centsPerKwh', label: 'Electricity (¢/kWh)', type: 'number', group: 'Machine & power', min: 0, max: 500, step: 0.01, default: DEFAULTS.centsPerKwh },
    { key: 'printerPrice', label: 'Printer price ($)', type: 'number', group: 'Machine & power', min: 0, max: 1_000_000, step: 1, default: DEFAULTS.printerPrice },
    { key: 'lifetimeHours', label: 'Expected printer life (hours)', type: 'number', group: 'Machine & power', min: 1, max: 1_000_000, step: 1, default: DEFAULTS.lifetimeHours },
    { key: 'maintPerHour', label: 'Maintenance per hour ($)', type: 'number', group: 'Machine & power', min: 0, max: 1_000, step: 0.01, default: DEFAULTS.maintPerHour, hint: 'Nozzles, belts, build plates.' },
    { key: 'failRatePct', label: 'Failure rate (%)', type: 'number', group: 'Machine & power', min: 0, max: 90, step: 1, default: DEFAULTS.failRatePct },
    { key: 'laborMinutes', label: 'Hands-on time (minutes)', type: 'number', group: 'Your time & extras', min: 0, max: 100_000, step: 1, default: DEFAULTS.laborMinutes, hint: 'Slicing, removal, support cleanup, packing.' },
    { key: 'laborRate', label: 'Your hourly rate ($)', type: 'number', group: 'Your time & extras', min: 0, max: 10_000, step: 0.5, default: DEFAULTS.laborRate },
    { key: 'extras', label: 'Packaging & extras ($)', type: 'number', group: 'Your time & extras', min: 0, max: 100_000, step: 0.01, default: DEFAULTS.extras },
    { key: 'feePreset', label: 'Where you sell', type: 'select', group: 'Selling', options: FEE_PRESET_KEYS.map((p) => ({ value: p, label: FEE_PRESETS[p].label.split(':')[0] ?? p })), default: DEFAULTS.feePreset, hint: "Presets are approximations; check the platform's current fee page." },
    { key: 'marginPct', label: 'Target profit margin (%)', type: 'number', group: 'Selling', min: 0, max: 95, step: 1, default: DEFAULTS.marginPct },
    { key: 'feePctDisplay', label: 'Fee % of price', type: 'number', group: 'Selling', min: 0, max: 50, step: 0.1, default: +(DEFAULTS.feePct * 100).toFixed(2) },
    { key: 'feeFixed', label: 'Fixed fee per order ($)', type: 'number', group: 'Selling', min: 0, max: 1_000, step: 0.01, default: DEFAULTS.feeFixed },
  ],
  outputs: [
    { key: 'price', label: 'Suggested price', format: 'currency', primary: true },
    { key: 'material', label: 'Filament', format: 'currency' },
    { key: 'electricity', label: 'Electricity', format: 'currency' },
    { key: 'machine', label: 'Machine wear & maintenance', format: 'currency' },
    { key: 'failureAllowance', label: 'Failed-print allowance', format: 'currency' },
    { key: 'labor', label: 'Your time', format: 'currency' },
    { key: 'extras', label: 'Packaging & extras', format: 'currency' },
    { key: 'totalCost', label: 'Total cost per good print', format: 'currency' },
    { key: 'fees', label: 'Marketplace fees at this price', format: 'currency' },
    { key: 'profit', label: 'Profit per sale', format: 'currency' },
    { key: 'lengthM', label: 'Filament length (1.75 mm)', format: 'number', decimals: 1, suffix: 'm' },
  ],
  onChange: {
    state: (v): Record<string, string> => (v === 'custom' ? {} : { centsPerKwh: String(v === 'US average' ? US_AVG : (RATES.get(v) ?? US_AVG)) }),
    centsPerKwh: () => ({ state: 'custom' }),
    feePreset: (v): Record<string, string> => (v === 'custom' || !(v in FEE_PRESETS) ? {} : { feePctDisplay: pct(v as FeePreset), feeFixed: String(FEE_PRESETS[v as FeePreset].fixed) }),
    feePctDisplay: () => ({ feePreset: 'custom' }),
    feeFixed: () => ({ feePreset: 'custom' }),
  },
  compute: (v) => {
    const r = calculate({
      grams: v.grams, spoolPrice: v.spoolPrice, spoolGrams: v.spoolGrams, hours: v.hours, watts: v.watts, centsPerKwh: v.centsPerKwh,
      printerPrice: v.printerPrice, lifetimeHours: v.lifetimeHours, maintPerHour: v.maintPerHour, laborMinutes: v.laborMinutes,
      laborRate: v.laborRate, extras: v.extras, failRatePct: v.failRatePct, marginPct: v.marginPct,
      feePct: Number(v.feePctDisplay) / 100, feeFixed: v.feeFixed,
    });
    const density = DENSITY[v.material as keyof typeof DENSITY] ?? DENSITY.PLA;
    const { valid, ...money } = r;
    return {
      values: { ...money, lengthM: filamentLengthMeters(Number(v.grams), density) },
      warnings: valid ? [] : ['Margin + fee percentage is too high to price. Lower one of them.'],
    };
  },
};

export default spec;
