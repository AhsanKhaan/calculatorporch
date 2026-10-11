/**
 * 3D printing cost & price calculator: pure functions shared by the page, the build and the tests.
 * Ported unchanged in maths from the static probe's calc3d.js (docs/03 §8). All money in USD.
 * No I/O, no DOM (SEC-CODE-10).
 */

/** Typical filament densities in g/cm³ (see /methodology/). */
export const DENSITY = { PLA: 1.24, PETG: 1.27, ABS: 1.04, ASA: 1.07, TPU: 1.21, Nylon: 1.14 } as const;
export type Material = keyof typeof DENSITY;
export const MATERIALS = Object.keys(DENSITY) as Material[];

/** Editable marketplace presets. Fees change: verify on each platform's official fee page (docs/08 §3). */
export const FEE_PRESETS = {
  none: { label: 'No marketplace fees', pct: 0, fixed: 0 },
  etsy: { label: 'Etsy (US): 6.5% transaction + 3% + $0.25 processing + $0.20 listing', pct: 0.095, fixed: 0.45 },
  ebay: { label: 'eBay (US, most categories): about 13.6% + $0.40 per order', pct: 0.136, fixed: 0.4 },
  custom: { label: 'Custom fees', pct: 0, fixed: 0 },
} as const;
export type FeePreset = keyof typeof FEE_PRESETS;
export const FEE_PRESET_KEYS = Object.keys(FEE_PRESETS) as FeePreset[];

export const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;

/** Filament length in metres for a given mass, material density and diameter (mm). */
export function filamentLengthMeters(grams: number, density: number, diameterMm = 1.75): number {
  if (!(grams > 0) || !(density > 0) || !(diameterMm > 0)) return 0;
  const radiusCm = diameterMm / 20; // mm → cm, halved
  const areaCm2 = Math.PI * radiusCm * radiusCm;
  const volumeCm3 = grams / density;
  return volumeCm3 / areaCm2 / 100; // cm → m
}

/** Numeric inputs to `calculate`. `feePct` is a fraction (0.095), the rest are display units. */
export interface PrintCostNumbers {
  grams: number;
  spoolPrice: number;
  spoolGrams: number;
  hours: number;
  watts: number;
  centsPerKwh: number;
  printerPrice: number;
  lifetimeHours: number;
  maintPerHour: number;
  laborMinutes: number;
  laborRate: number;
  extras: number;
  failRatePct: number;
  marginPct: number;
  feePct: number;
  feeFixed: number;
}

/** Loose input: any value is coerced and clamped, so garbage never produces NaN. */
export type LooseInputs = { [K in keyof PrintCostNumbers]?: unknown };

export interface PrintCostResult {
  material: number;
  electricity: number;
  machine: number;
  failureAllowance: number;
  labor: number;
  extras: number;
  totalCost: number;
  price: number | null;
  fees: number | null;
  profit: number | null;
  valid: boolean;
}

/** Cost and suggested price for one successful print. */
export function calculate(i: LooseInputs): PrintCostResult {
  const n = (v: unknown, d = 0): number => (Number.isFinite(Number(v)) ? Number(v) : d);
  const grams = Math.max(0, n(i.grams));
  const spoolPrice = Math.max(0, n(i.spoolPrice));
  const spoolGrams = Math.max(1, n(i.spoolGrams, 1000));
  const hours = Math.max(0, n(i.hours));
  const watts = Math.max(0, n(i.watts));
  const centsPerKwh = Math.max(0, n(i.centsPerKwh));
  const printerPrice = Math.max(0, n(i.printerPrice));
  const lifetimeHours = Math.max(1, n(i.lifetimeHours, 5000));
  const maintPerHour = Math.max(0, n(i.maintPerHour));
  const laborMinutes = Math.max(0, n(i.laborMinutes));
  const laborRate = Math.max(0, n(i.laborRate));
  const extras = Math.max(0, n(i.extras));
  const failRate = Math.min(0.9, Math.max(0, n(i.failRatePct) / 100));
  const margin = Math.min(0.95, Math.max(0, n(i.marginPct) / 100));
  const feePct = Math.max(0, n(i.feePct));
  const feeFixed = Math.max(0, n(i.feeFixed));

  const material = (grams / spoolGrams) * spoolPrice;
  const electricity = (watts / 1000) * hours * (centsPerKwh / 100);
  const machine = hours * (printerPrice / lifetimeHours + maintPerHour);
  // Failed prints waste material, power and machine time, so spread their cost over successful prints.
  const printRun = material + electricity + machine;
  const failureAllowance = failRate > 0 ? printRun / (1 - failRate) - printRun : 0;
  const labor = (laborMinutes / 60) * laborRate;
  const totalCost = printRun + failureAllowance + labor + extras;

  // Price so that, after percentage + fixed fees, profit = margin × price.
  const denom = 1 - margin - feePct;
  const valid = denom > 0.01;
  const price = valid ? (totalCost + feeFixed) / denom : NaN;
  const fees = valid ? price * feePct + feeFixed : NaN;
  const profit = valid ? price - fees - totalCost : NaN;

  return {
    material: round2(material),
    electricity: round2(electricity),
    machine: round2(machine),
    failureAllowance: round2(failureAllowance),
    labor: round2(labor),
    extras: round2(extras),
    totalCost: round2(totalCost),
    price: valid ? round2(price) : null,
    fees: valid ? round2(fees) : null,
    profit: valid ? round2(profit) : null,
    valid,
  };
}

/** Defaults shown on the page and used in the published worked example. */
export const DEFAULTS = {
  material: 'PLA' as Material,
  grams: 120,
  spoolPrice: 22,
  spoolGrams: 1000,
  hours: 6,
  watts: 120,
  centsPerKwh: 18.31, // US average residential, EIA July 2026 (data/electricity-us.json)
  printerPrice: 700,
  lifetimeHours: 5000,
  maintPerHour: 0.05,
  laborMinutes: 20,
  laborRate: 15,
  extras: 1.5,
  failRatePct: 10,
  marginPct: 40,
  feePreset: 'etsy' as FeePreset,
  feePct: FEE_PRESETS.etsy.pct,
  feeFixed: FEE_PRESETS.etsy.fixed,
};
