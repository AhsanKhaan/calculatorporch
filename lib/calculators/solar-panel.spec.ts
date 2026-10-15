import electricity from '@/data/electricity-us.json';
import type { CalculatorSpec, Field } from '@/lib/engine/spec';
import {
  APPLIANCES,
  CURRENCIES,
  DAYS_PER_MONTH,
  DEFAULTS,
  LOCATIONS,
  M2_TO_FT2,
  MONTH_NAMES,
  PK_ASSUMED_RATE,
  ROOF_UNITS,
  US_AVERAGE,
  applianceMonthlyKwh,
  formatMoney,
  locationById,
  panelsThatFit,
  solarSize,
  type Currency,
  type RoofUnit,
} from './solar-panel';

const RATES = electricity.rates as Record<string, number>;
/** EIA residential average for a state, in dollars per kWh (EIA publishes cents). */
const usRate = (region: string): number => Math.round((RATES[region] ?? RATES['US average'] ?? 0) * 100) / 10_000;

const LOCATION_OPTIONS = [
  { value: US_AVERAGE.id, label: `United States average: ${US_AVERAGE.psh.toFixed(2)} sun hours` },
  ...LOCATIONS.filter((l) => l.country === 'US').sort((a, b) => a.region.localeCompare(b.region)).map((l) => ({ value: l.id, label: `${l.region} (${l.city}): ${l.psh.toFixed(2)} h` })),
  ...LOCATIONS.filter((l) => l.country === 'PK').sort((a, b) => a.city.localeCompare(b.city)).map((l) => ({ value: l.id, label: `Pakistan, ${l.city}: ${l.psh.toFixed(2)} h` })),
  { value: 'custom', label: 'Somewhere else (enter sun hours)' },
];

const currencyOf = (v: unknown): Currency => (typeof v === 'string' && v in CURRENCIES ? (v as Currency) : 'other');
const fmt0 = (n: number) => Math.round(n).toLocaleString('en-US');
const CURRENCY_FOR = { US: 'USD', PK: 'PKR' } as const;
const APPLIANCES_SHOWN = { key: 'usageMode', in: ['appliances'] } as const;

/** One −/+ quantity stepper per appliance, with its hours a day as an inline companion input. */
const applianceFields: Field[] = APPLIANCES.flatMap((a): Field[] => [
  { key: `qty_${a.id}`, label: a.label, hint: `${a.watts.toLocaleString('en-US')} W each`, type: 'number', display: 'stepper', companion: `hrs_${a.id}`, group: 'Appliances', min: 0, max: 99, step: 1, default: a.qty, showWhen: APPLIANCES_SHOWN },
  { key: `hrs_${a.id}`, label: `${a.label}: hours a day`, type: 'number', group: 'Appliances', min: 0, max: 24, step: 0.25, default: a.hours, suffix: 'hours a day', showWhen: APPLIANCES_SHOWN },
]);

const spec: CalculatorSpec = {
  id: 'solar-panel',
  csvName: 'solar-panel-estimate',
  steps: [
    { title: 'Location', intro: 'Sun hours are NASA averages for 2001–2025. Choosing a place also sets the currency and a starting price per unit.', groups: ['Location'] },
    { title: 'Electricity use', intro: 'Use whichever you know best: your bill, the units (kWh) printed on it, or the appliances you run.', groups: ['Electricity use', 'Appliances'] },
    { title: 'Panels & roof', intro: 'The defaults suit most homes. Add your roof area to check the panels fit.', groups: ['Panels', 'Roof (optional)'] },
    { title: 'Savings', intro: 'How your utility credits solar, and your installer quote for the payback time.', groups: ['Savings'] },
  ],
  groupTotals: { Appliances: 'usageKwh' },
  fields: [
    { key: 'location', label: 'Where the panels will be', type: 'select', group: 'Location', options: LOCATION_OPTIONS, default: DEFAULTS.location },
    { key: 'sunHours', label: 'Peak sun hours per day', type: 'number', group: 'Location', min: 0.5, max: 12, step: 0.01, default: US_AVERAGE.psh, hint: 'Hours of full-strength sun, not hours of daylight. Typing a value switches to "Somewhere else".' },
    { key: 'currency', label: 'Currency', type: 'select', group: 'Location', options: Object.entries(CURRENCIES).map(([value, c]) => ({ value, label: c.label })), default: 'USD' },

    {
      key: 'usageMode', label: 'How do you want to enter your use?', type: 'select', display: 'tabs', group: 'Electricity use', default: 'units',
      options: [{ value: 'bill', label: 'Monthly bill' }, { value: 'units', label: 'Monthly units (kWh)' }, { value: 'appliances', label: 'Pick appliances' }],
    },
    { key: 'monthlyKwh', label: 'Electricity you use per month (kWh)', type: 'number', group: 'Electricity use', min: 1, max: 1_000_000, step: 1, default: DEFAULTS.monthlyKwh, showWhen: { key: 'usageMode', in: ['units'] }, hint: 'The "kWh used" or "units" on your bill. Average 12 months if you can, because use changes with the seasons.' },
    { key: 'monthlyBill', label: 'Your average monthly bill', type: 'number', group: 'Electricity use', min: 0, max: 100_000_000, step: 1, default: 0, showWhen: { key: 'usageMode', in: ['bill'] }, hint: 'In your currency. We divide it by the price per unit below to estimate your units.' },
    { key: 'rate', label: 'Price per unit (kWh)', type: 'number', group: 'Electricity use', min: 0, max: 10_000, step: 0.0001, default: usRate('US average'), hint: `US: your state's EIA average. Pakistan: an assumed Rs ${PK_ASSUMED_RATE}. Your exact figure is your bill ÷ the units on it.` },
    ...applianceFields,
    { key: 'customWatts', label: 'Other appliance: watts', type: 'number', group: 'Appliances', min: 0, max: 20_000, step: 1, default: 0, showWhen: APPLIANCES_SHOWN, hint: 'Anything not listed. Check the label for its watts.' },
    { key: 'qty_custom', label: 'Other appliance: how many', type: 'number', display: 'stepper', companion: 'hrs_custom', group: 'Appliances', min: 0, max: 99, step: 1, default: 0, showWhen: APPLIANCES_SHOWN },
    { key: 'hrs_custom', label: 'Other appliance: hours a day', type: 'number', group: 'Appliances', min: 0, max: 24, step: 0.25, default: 0, suffix: 'hours a day', showWhen: APPLIANCES_SHOWN },

    { key: 'panelWatts', label: 'Panel size (watts)', type: 'number', group: 'Panels', min: 50, max: 1_000, step: 5, default: DEFAULTS.panelWatts, hint: "The rated watts on the panel's spec sheet." },
    { key: 'lossesPct', label: 'System losses (%)', type: 'number', group: 'Panels', min: 0, max: 60, step: 1, default: DEFAULTS.lossesPct, hint: 'Heat, dust, wiring and the inverter. 20% is our planning default; raise it for shade or very hot, dusty roofs.' },
    { key: 'offsetPct', label: 'Share of your use to cover (%)', type: 'number', group: 'Panels', min: 1, max: 200, step: 1, default: DEFAULTS.offsetPct, hint: 'Over 100% leaves headroom for new appliances.' },
    { key: 'efficiencyPct', label: 'Panel efficiency (%)', type: 'number', group: 'Panels', min: 5, max: 30, step: 0.1, default: DEFAULTS.efficiencyPct, hint: 'Listed on the spec sheet as "module efficiency". Only changes the area.' },
    { key: 'roofArea', label: 'Clear, usable roof area', type: 'number', group: 'Roof (optional)', min: 0, max: 1_000_000, step: 1, default: 0, hint: 'Leave 0 to skip. Count only unshaded space you could cover, not the whole plot.' },
    { key: 'roofUnit', label: 'Area unit', type: 'select', group: 'Roof (optional)', options: Object.entries(ROOF_UNITS).map(([value, u]) => ({ value, label: u.label })), default: 'sqft' },

    { key: 'selfUsePct', label: 'Solar you use directly (%)', type: 'number', group: 'Savings', min: 0, max: 100, step: 1, default: DEFAULTS.selfUsePct, hint: 'Leave at 100% with full net metering. Under net billing (Pakistan since 2026), enter the share of solar you use as it is made.' },
    { key: 'exportRate', label: 'Credit per exported unit (kWh)', type: 'number', group: 'Savings', min: 0, max: 10_000, step: 0.01, default: DEFAULTS.exportRate, hint: 'What your utility pays for solar you send to the grid. 0 if unknown.' },
    { key: 'systemCost', label: 'Installed cost from your quote', type: 'number', group: 'Savings', min: 0, max: 1_000_000_000, step: 1, default: DEFAULTS.systemCost, hint: 'Optional. Enter a real quote to see the payback time.' },
  ],
  outputs: [
    { key: 'systemKw', label: 'Solar system size', format: 'number', decimals: 2, suffix: 'kW', primary: true },
    { key: 'usageKwh', label: 'Your monthly use', format: 'number', decimals: 0, suffix: 'kWh' },
    { key: 'panels', label: 'Number of panels', format: 'integer' },
    { key: 'annualKwh', label: 'Estimated yearly output', format: 'number', decimals: 0, suffix: 'kWh' },
    { key: 'monthlyKwh', label: 'Average monthly output', format: 'number', decimals: 0, suffix: 'kWh' },
    { key: 'lowMonth', label: 'Output in the weakest month', format: 'text', hideWhenNull: true },
    { key: 'area', label: 'Panel area (approx.)', format: 'text' },
    { key: 'roofFit', label: 'Fits on your roof?', format: 'text', hideWhenNull: true },
    { key: 'monthlySavings', label: 'Estimated monthly savings', format: 'text', hideWhenNull: true },
    { key: 'annualSavings', label: 'Estimated yearly savings', format: 'text', hideWhenNull: true },
    { key: 'payback', label: 'Simple payback', format: 'number', decimals: 1, suffix: 'years', hideWhenNull: true },
  ],
  onChange: {
    location: (v, state): Record<string, string> => {
      const loc = locationById(v);
      if (!loc) return {};
      const currency = CURRENCY_FOR[loc.country];
      const start = loc.country === 'US' ? String(usRate(loc.id === US_AVERAGE.id ? 'US average' : loc.region)) : String(PK_ASSUMED_RATE);
      // A new country means a new currency: the old bill and price no longer apply.
      if (state.currency !== currency) return { sunHours: String(loc.psh), currency, rate: start, monthlyBill: '0' };
      // Same country: US states load their own EIA average; in Pakistan the visitor's price is kept.
      return loc.country === 'US' ? { sunHours: String(loc.psh), rate: start } : { sunHours: String(loc.psh) };
    },
    sunHours: () => ({ location: 'custom' }),
  },
  compute: (v) => {
    const loc = v.location === 'custom' ? undefined : locationById(String(v.location));
    // The chosen place is authoritative for sun hours, so a link or saved state can never mix one city's size with
    // another's monthly data. The sun-hours field is used only for 'Somewhere else' (editing it switches to custom).
    const psh = loc ? loc.psh : Number(v.sunHours);
    const currency = currencyOf(v.currency);
    const rate = Number(v.rate);
    const mode = String(v.usageMode);
    const items = [
      ...APPLIANCES.map((a) => ({ qty: Number(v[`qty_${a.id}`]), watts: a.watts, hours: Number(v[`hrs_${a.id}`]) })),
      { qty: Number(v.qty_custom), watts: Number(v.customWatts), hours: Number(v.hrs_custom) },
    ];
    const applianceKwh = applianceMonthlyKwh(items);
    const usage = mode === 'bill' ? (rate > 0 ? Number(v.monthlyBill) / rate : 0) : mode === 'appliances' ? applianceKwh : Number(v.monthlyKwh);

    const r = solarSize({
      monthlyKwh: usage, psh, panelWatts: Number(v.panelWatts), lossesPct: Number(v.lossesPct), offsetPct: Number(v.offsetPct),
      efficiencyPct: Number(v.efficiencyPct), rate, selfUsePct: Number(v.selfUsePct), exportRate: Number(v.exportRate),
      systemCost: Number(v.systemCost), monthly: loc?.monthly,
    });

    const roofUnit = (String(v.roofUnit) in ROOF_UNITS ? String(v.roofUnit) : 'sqft') as RoofUnit;
    const roofSqft = Number(v.roofArea) * ROOF_UNITS[roofUnit].sqft;
    const needSqft = r.areaM2 * M2_TO_FT2;
    const fit = roofSqft > 0 ? panelsThatFit(roofSqft / M2_TO_FT2, Number(v.panelWatts), Number(v.efficiencyPct)) : null;

    const warnings: string[] = [];
    if (mode === 'bill' && Number(v.monthlyBill) <= 0) warnings.push('Enter your average monthly bill to size the system.');
    if (mode === 'bill' && rate <= 0) warnings.push('Enter a price per unit so the bill can be turned into units.');
    if (mode === 'appliances' && applianceKwh <= 0) warnings.push('Add at least one appliance (and its hours a day).');
    if (rate <= 0) warnings.push('Enter a price per unit (kWh) to see savings and payback.');
    if (loc?.country === 'PK' && r.annualSavings !== null && Number(v.selfUsePct) === 100)
      warnings.push("Pakistan's 2026 net billing credits exported units below the price you pay. In Savings, set the share of solar you use directly and the export credit for a realistic figure.");
    if (fit !== null && fit < r.panels) warnings.push(`Your roof fits about ${fit} panels (${((fit * Number(v.panelWatts)) / 1000).toFixed(2)} kW), fewer than the ${r.panels} needed.`);
    if (r.annualKwh > r.annualUseKwh * 1.25 && usage > 0) warnings.push('This system makes much more than you use. Extra output is only worth the export credit.');

    const usageStep =
      mode === 'bill'
        ? `Monthly use = bill ${formatMoney(Number(v.monthlyBill), currency)} ÷ ${formatMoney(rate, currency)} per unit = ${fmt0(usage)} kWh.`
        : mode === 'appliances'
          ? `Monthly use = appliances ${(applianceKwh / DAYS_PER_MONTH).toFixed(2)} kWh a day × ${DAYS_PER_MONTH.toFixed(2)} days = ${fmt0(usage)} kWh.`
          : `Monthly use = ${fmt0(usage)} kWh (from your bill).`;

    return {
      values: {
        systemKw: r.systemKw,
        usageKwh: usage,
        panels: r.panels,
        annualKwh: r.annualKwh,
        monthlyKwh: r.monthlyKwh,
        lowMonth: r.lowMonth ? `${fmt0(r.lowMonth.kwh)} kWh (${MONTH_NAMES[r.lowMonth.index]})` : null,
        area: `${r.areaM2.toFixed(1)} m² (${fmt0(needSqft)} sq ft)`,
        roofFit: fit === null ? null : fit >= r.panels ? `Yes: needs ${fmt0(needSqft)} of ${fmt0(roofSqft)} sq ft` : `No: about ${fit} of ${r.panels} panels fit`,
        monthlySavings: r.annualSavings === null ? null : formatMoney(r.annualSavings / 12, currency),
        annualSavings: r.annualSavings === null ? null : formatMoney(r.annualSavings, currency),
        payback: r.paybackYears,
      },
      steps: [
        usageStep,
        `Daily energy to cover = ${fmt0(usage)} kWh × 12 ÷ 365 × ${v.offsetPct}% = ${r.dailyNeedKwh.toFixed(2)} kWh a day.`,
        `Each kW of panels makes ${psh} sun hours${loc ? ` (NASA average, ${loc.id === US_AVERAGE.id ? 'US' : loc.city})` : ''} × (1 − ${v.lossesPct}% losses) = ${r.kwhPerKwDay.toFixed(2)} kWh a day.`,
        `Size needed = ${r.dailyNeedKwh.toFixed(2)} ÷ ${r.kwhPerKwDay.toFixed(2)} = ${r.requiredKw.toFixed(2)} kW.`,
        `Panels = ${r.requiredKw.toFixed(2)} kW × 1,000 ÷ ${v.panelWatts} W = ${r.panels} panels (rounded up), so ${r.panels} × ${v.panelWatts} W = ${r.systemKw.toFixed(2)} kW.`,
        `Yearly output = ${r.systemKw.toFixed(2)} kW × ${r.kwhPerKwDay.toFixed(2)} kWh × 365 = ${fmt0(r.annualKwh)} kWh.`,
        ...(r.annualSavings === null
          ? []
          : [`Savings = ${fmt0(r.selfUsedKwh)} kWh used × ${rate} + ${fmt0(r.exportedKwh)} kWh exported × ${v.exportRate} = ${formatMoney(r.annualSavings, currency)} a year.`]),
      ],
      warnings,
    };
  },
};

export default spec;
