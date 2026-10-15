import sun from '@/data/solar-sun-hours.json';

/**
 * Solar panel sizing maths (pure). Peak sun hours come from NASA POWER (data/solar-sun-hours.json): irradiance on a
 * south-facing panel tilted at the site latitude, 2001–2025 climatology. Sizing follows the standard energy balance
 * used by PVWatts-style estimates: kWh per installed kW per day = peak sun hours × (1 − losses).
 */
export interface SunLocation {
  id: string;
  country: 'US' | 'PK';
  region: string;
  city: string;
  lat: number;
  lon: number;
  /** Annual average peak sun hours per day (kWh/m²/day on a latitude-tilted, equator-facing surface). */
  psh: number;
  /** Jan–Dec averages, same units. */
  monthly: readonly number[];
  horizontal: number;
}

export const LOCATIONS: readonly SunLocation[] = sun.locations as SunLocation[];
export const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const;
export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] as const;

const round2 = (n: number) => Math.round(n * 100) / 100;
const US_LOCS = LOCATIONS.filter((l) => l.country === 'US');

/** Unweighted mean of the 51 US points (one city per state + DC), annual and per month. */
export const US_AVERAGE: SunLocation = {
  id: 'us-average',
  country: 'US',
  region: 'United States',
  city: 'average of 51 cities',
  lat: 0,
  lon: 0,
  psh: round2(US_LOCS.reduce((s, l) => s + l.psh, 0) / US_LOCS.length),
  monthly: DAYS_IN_MONTH.map((_, m) => round2(US_LOCS.reduce((s, l) => s + (l.monthly[m] ?? 0), 0) / US_LOCS.length)),
  horizontal: round2(US_LOCS.reduce((s, l) => s + l.horizontal, 0) / US_LOCS.length),
};

export const locationById = (id: string): SunLocation | undefined => (id === US_AVERAGE.id ? US_AVERAGE : LOCATIONS.find((l) => l.id === id));

export const DEFAULTS = {
  monthlyKwh: 900,
  location: US_AVERAGE.id,
  panelWatts: 400,
  lossesPct: 20,
  offsetPct: 100,
  efficiencyPct: 21,
  selfUsePct: 100,
  exportRate: 0,
  systemCost: 0,
} as const;

export interface SolarInput {
  monthlyKwh: number;
  psh: number;
  panelWatts: number;
  lossesPct: number;
  offsetPct: number;
  efficiencyPct: number;
  /** Electricity price per kWh in the visitor's currency; 0 = not entered. */
  rate: number;
  selfUsePct: number;
  exportRate: number;
  /** Installed cost from a quote; 0 = not entered. */
  systemCost: number;
  /** Monthly sun hours for the chosen place, if known. */
  monthly?: readonly number[];
}

export interface SolarResult {
  dailyNeedKwh: number;
  kwhPerKwDay: number;
  requiredKw: number;
  panels: number;
  systemKw: number;
  annualKwh: number;
  monthlyKwh: number;
  lowMonth: { index: number; kwh: number } | null;
  areaM2: number;
  annualUseKwh: number;
  selfUsedKwh: number;
  exportedKwh: number;
  annualSavings: number | null;
  paybackYears: number | null;
}

export function solarSize(i: SolarInput): SolarResult {
  const derate = 1 - i.lossesPct / 100;
  const kwhPerKwDay = i.psh * derate;
  const dailyNeedKwh = ((i.monthlyKwh * 12) / 365) * (i.offsetPct / 100);
  const requiredKw = kwhPerKwDay > 0 ? dailyNeedKwh / kwhPerKwDay : 0;
  // Round away float noise before ceil (e.g. 15.000000000000002 panels).
  const panels = requiredKw > 0 ? Math.ceil(Number(((requiredKw * 1000) / i.panelWatts).toFixed(6))) : 0;
  const systemKw = (panels * i.panelWatts) / 1000;
  const annualKwh = systemKw * kwhPerKwDay * 365;
  let lowMonth: SolarResult['lowMonth'] = null;
  if (i.monthly?.length === 12 && systemKw > 0) {
    const kwh = i.monthly.map((h, m) => systemKw * h * derate * DAYS_IN_MONTH[m]!);
    const index = kwh.indexOf(Math.min(...kwh));
    lowMonth = { index, kwh: kwh[index]! };
  }
  // Panel area at standard test conditions: 1 kW of panels at efficiency η covers 1 ÷ η square meters.
  const areaM2 = i.efficiencyPct > 0 ? systemKw / (i.efficiencyPct / 100) : 0;
  const annualUseKwh = i.monthlyKwh * 12;
  const selfUsedKwh = Math.min(annualKwh * (i.selfUsePct / 100), annualUseKwh);
  const exportedKwh = Math.max(0, annualKwh - selfUsedKwh);
  const annualSavings = i.rate > 0 ? selfUsedKwh * i.rate + exportedKwh * i.exportRate : null;
  const paybackYears = annualSavings && annualSavings > 0 && i.systemCost > 0 ? i.systemCost / annualSavings : null;
  return { dailyNeedKwh, kwhPerKwDay, requiredKw, panels, systemKw, annualKwh, monthlyKwh: annualKwh / 12, lowMonth, areaM2, annualUseKwh, selfUsedKwh, exportedKwh, annualSavings, paybackYears };
}

export const CURRENCIES = { USD: { label: 'US dollars ($)', symbol: '$', decimals: 2 }, PKR: { label: 'Pakistani rupees (Rs)', symbol: 'Rs ', decimals: 0 }, other: { label: 'Other (no symbol)', symbol: '', decimals: 2 } } as const;
export type Currency = keyof typeof CURRENCIES;

export function formatMoney(n: number, currency: Currency): string {
  const c = CURRENCIES[currency] ?? CURRENCIES.other;
  const s = Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: c.decimals, maximumFractionDigits: c.decimals });
  return `${n < 0 ? '−' : ''}${c.symbol}${s}`;
}

export const M2_TO_FT2 = 10.7639;

/**
 * Assumed all-in price per unit (kWh) in Pakistan, used only until the visitor types their own. Tariffs are slab-based
 * (NEPRA base rates roughly Rs 10–48 per unit before fuel adjustments, fixed charges and taxes), so there is no single
 * official average; Geo News (2026-02-10) reports that consumer tariffs "for many households exceed Rs50 per unit".
 * [U] pendingVerification: replace with a NEPRA tariff schedule plus taxes from a sample bill.
 */
export const PK_ASSUMED_RATE = 50;

/** Average days in a month (365 ÷ 12), used to turn daily appliance use into a monthly figure. */
export const DAYS_PER_MONTH = 365 / 12;

/**
 * Appliance picker. Watts are typical running figures for planning, not nameplate maximums: appliances that cycle
 * (refrigerator, freezer, inverter AC) use an average draw over the hours listed. Visitors change quantity and hours;
 * the custom row also takes watts. [U] pendingVerification: check each wattage against manufacturer spec sheets.
 */
export const APPLIANCES = [
  { id: 'led', label: 'LED bulbs', watts: 10, hours: 6, qty: 8 },
  { id: 'tube', label: 'LED tube lights', watts: 20, hours: 6, qty: 2 },
  { id: 'fan', label: 'Ceiling fans', watts: 75, hours: 12, qty: 4 },
  { id: 'dcfan', label: 'DC inverter ceiling fans', watts: 35, hours: 12, qty: 0 },
  { id: 'pedestal', label: 'Pedestal fans', watts: 60, hours: 8, qty: 0 },
  { id: 'fridge', label: 'Refrigerator (average while cycling)', watts: 60, hours: 24, qty: 1 },
  { id: 'freezer', label: 'Deep freezer (average while cycling)', watts: 70, hours: 24, qty: 0 },
  { id: 'ac1', label: '1-ton inverter AC (average)', watts: 800, hours: 8, qty: 0 },
  { id: 'ac15', label: '1.5-ton inverter AC (average)', watts: 1_200, hours: 8, qty: 0 },
  { id: 'acfixed', label: '1.5-ton non-inverter AC', watts: 1_800, hours: 8, qty: 0 },
  { id: 'tv', label: 'LED TV', watts: 80, hours: 5, qty: 1 },
  { id: 'computer', label: 'Laptop or computer', watts: 60, hours: 6, qty: 1 },
  { id: 'router', label: 'Wi-Fi router', watts: 10, hours: 24, qty: 1 },
  { id: 'washer', label: 'Washing machine', watts: 500, hours: 1, qty: 1 },
  { id: 'iron', label: 'Clothes iron', watts: 1_000, hours: 0.5, qty: 1 },
  { id: 'pump', label: 'Water pump (1 hp)', watts: 746, hours: 1, qty: 1 },
  { id: 'microwave', label: 'Microwave', watts: 1_200, hours: 0.25, qty: 0 },
] as const;

/** kWh a month from quantity × watts × hours a day for each appliance. */
export function applianceMonthlyKwh(items: readonly { qty: number; watts: number; hours: number }[]): number {
  return (items.reduce((s, a) => s + a.qty * a.watts * a.hours, 0) / 1000) * DAYS_PER_MONTH;
}

/** Roof-area units. A marla is 225 sq ft in most urban housing schemes and 272.25 sq ft in the older revenue measure. */
export const ROOF_UNITS = {
  sqft: { label: 'Square feet', sqft: 1 },
  m2: { label: 'Square meters', sqft: M2_TO_FT2 },
  marla225: { label: 'Marla (225 sq ft)', sqft: 225 },
  marla272: { label: 'Marla (272.25 sq ft)', sqft: 272.25 },
} as const;
export type RoofUnit = keyof typeof ROOF_UNITS;

/** Whole panels whose module area fits in `roofM2` (panel area = watts ÷ 1,000 ÷ efficiency, at 1 kW/m²). */
export function panelsThatFit(roofM2: number, panelWatts: number, efficiencyPct: number): number {
  const perPanel = panelWatts / 1000 / (efficiencyPct / 100);
  return perPanel > 0 ? Math.floor(Number((roofM2 / perPanel).toFixed(6))) : 0;
}
