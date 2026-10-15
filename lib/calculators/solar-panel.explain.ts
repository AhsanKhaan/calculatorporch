import electricity from '@/data/electricity-us.json';
import sun from '@/data/solar-sun-hours.json';
import type { Explain } from '@/lib/engine/explain';
import { APPLIANCES, DAYS_PER_MONTH, DEFAULTS, LOCATIONS, MONTH_NAMES, PK_ASSUMED_RATE, ROOF_UNITS, US_AVERAGE, applianceMonthlyKwh, formatMoney, solarSize, type SolarInput } from './solar-panel';

const fmt0 = (n: number) => Math.round(n).toLocaleString('en-US');
const derate = 1 - DEFAULTS.lossesPct / 100;
/** kWh a year from 1 kW of panels at the default losses. */
const perKwYear = (psh: number) => psh * derate * 365;
const US_RATE = (electricity.rates as Record<string, number>)['US average']! / 100;

const base = (over: Partial<SolarInput>): SolarInput => ({
  monthlyKwh: DEFAULTS.monthlyKwh, psh: US_AVERAGE.psh, panelWatts: DEFAULTS.panelWatts, lossesPct: DEFAULTS.lossesPct, offsetPct: DEFAULTS.offsetPct,
  efficiencyPct: DEFAULTS.efficiencyPct, rate: US_RATE, selfUsePct: DEFAULTS.selfUsePct, exportRate: DEFAULTS.exportRate, systemCost: 0, monthly: US_AVERAGE.monthly, ...over,
});

export default function explain(): Explain {
  const r = solarSize(base({}));
  const pk = LOCATIONS.filter((l) => l.country === 'PK').sort((a, b) => b.psh - a.psh);
  const us = LOCATIONS.filter((l) => l.country === 'US').sort((a, b) => a.region.localeCompare(b.region));
  const lahore = LOCATIONS.find((l) => l.id === 'pk-lahore')!;
  const minMonth = (m: readonly number[]) => MONTH_NAMES[m.indexOf(Math.min(...m))];
  const maxMonth = (m: readonly number[]) => MONTH_NAMES[m.indexOf(Math.max(...m))];
  const sizeRow = (kwh: number) => {
    const a = solarSize(base({ monthlyKwh: kwh, monthly: undefined }));
    const b = solarSize(base({ monthlyKwh: kwh, psh: lahore.psh, monthly: undefined }));
    return [fmt0(kwh), `${a.systemKw.toFixed(1)} kW · ${a.panels}`, `${b.systemKw.toFixed(1)} kW · ${b.panels}`];
  };
  return {
    formula: [
      'monthly kWh          = units on your bill, or bill ÷ price per unit,',
      '                       or Σ appliances (qty × watts × hours a day) × 30.42 days ÷ 1,000',
      'daily need (kWh)     = monthly kWh × 12 ÷ 365 × share to cover',
      'kWh per kW per day   = peak sun hours × (1 − losses)',
      'system size (kW)     = daily need ÷ kWh per kW per day',
      'panels               = size × 1,000 ÷ panel watts, rounded up',
      'yearly output (kWh)  = panels × panel watts ÷ 1,000 × kWh per kW per day × 365',
      'panel area (m²)      = system kW ÷ panel efficiency',
      'panels on your roof  = roof area ÷ (panel watts ÷ 1,000 ÷ efficiency), rounded down',
      'yearly savings       = kWh you use × price + kWh exported × export credit',
      'payback (years)      = installed cost ÷ yearly savings',
    ],
    example:
      `Worked example (the defaults): a home using ${fmt0(DEFAULTS.monthlyKwh)} kWh a month needs ${r.dailyNeedKwh.toFixed(2)} kWh a day. ` +
      `At the US average of ${US_AVERAGE.psh} peak sun hours and ${DEFAULTS.lossesPct}% losses, each kW of panels makes ${r.kwhPerKwDay.toFixed(2)} kWh a day, ` +
      `so the home needs ${r.dailyNeedKwh.toFixed(2)} ÷ ${r.kwhPerKwDay.toFixed(2)} = ${r.requiredKw.toFixed(2)} kW. With ${DEFAULTS.panelWatts} W panels that rounds up to ` +
      `${r.panels} panels, a ${r.systemKw.toFixed(2)} kW system making about ${fmt0(r.annualKwh)} kWh a year. ` +
      `${MONTH_NAMES[r.lowMonth!.index]} is the weakest month at about ${fmt0(r.lowMonth!.kwh)} kWh. The panels cover roughly ${r.areaM2.toFixed(0)} m² at ${DEFAULTS.efficiencyPct}% efficiency, ` +
      `and at the US average electricity price of ${(US_RATE * 100).toFixed(2)}¢ per kWh they save about ${formatMoney(r.annualSavings!, 'USD')} a year.`,
    sections: [
      {
        heading: 'Peak sun hours are not hours of daylight',
        paragraphs: [
          'One peak sun hour is one hour of sunlight at full strength: 1,000 watts on each square meter of panel. A summer day with 14 hours of daylight might deliver 6 or 7 peak sun hours, because the sun is weak in the morning and evening.',
          'Our figures are NASA POWER averages for a panel facing the equator (south in the US and Pakistan) and tilted at the local latitude, a common fixed-roof layout. A flat roof, an east- or west-facing roof or shade from trees and buildings will lower the real number.',
        ],
      },
      {
        heading: 'Net metering, net billing and what solar saves',
        paragraphs: [
          'With full net metering, every kWh your panels make offsets a kWh you would have bought, so savings are simply output × your electricity price (up to what you use). Leave "Solar you use directly" at 100% for that case.',
          'Under net billing, power you export is credited at a lower rate than you pay to import. Pakistan moved new rooftop systems to net billing in 2026. To model it, set the share of solar you use as it is made (more if you are home during the day or have a battery) and the export credit your utility pays.',
        ],
      },
    ],
    tables: [
      {
        caption: 'Typical appliance use per month',
        columns: ['Appliance', 'Watts', 'Hours a day (default)', 'kWh a month each'],
        rows: APPLIANCES.map((a) => [a.label, a.watts.toLocaleString('en-US'), String(a.hours), (applianceMonthlyKwh([{ qty: 1, watts: a.watts, hours: a.hours }])).toFixed(1)]),
        note: `kWh a month = watts × hours a day × ${DAYS_PER_MONTH.toFixed(2)} days ÷ 1,000. Cycling appliances use an average draw. The calculator's default appliance list (${APPLIANCES.filter((a) => a.qty > 0).length} types) adds up to ${fmt0(applianceMonthlyKwh(APPLIANCES.map((a) => ({ qty: a.qty, watts: a.watts, hours: a.hours }))))} kWh a month.`,
      },
      {
        caption: "Peak sun hours in Pakistan's major cities",
        columns: ['City', 'Sun hours a day (year)', 'Weakest month', 'Best month', 'kWh per kW per month'],
        rows: pk.map((l) => [l.city, l.psh.toFixed(2), `${minMonth(l.monthly)} (${Math.min(...l.monthly).toFixed(2)})`, `${maxMonth(l.monthly)} (${Math.max(...l.monthly).toFixed(2)})`, fmt0(perKwYear(l.psh) / 12)]),
        note: `Source: NASA POWER climatology, ${sun.period}, panel tilted at latitude facing south (retrieved ${sun.retrieved}). Output column assumes ${DEFAULTS.lossesPct}% losses. NASA's solar grid is about 1° wide, so neighbouring cities such as Islamabad and Rawalpindi share a value.`,
      },
      {
        caption: 'Solar system size for common monthly use',
        columns: ['Monthly use (kWh)', `US average (${US_AVERAGE.psh} h): size · panels`, `Lahore (${lahore.psh} h): size · panels`],
        rows: [300, 500, 750, 1_000, 1_500, 2_000].map(sizeRow),
        note: `${DEFAULTS.panelWatts} W panels, ${DEFAULTS.lossesPct}% losses, covering 100% of use. Computed with the calculator above.`,
      },
      {
        caption: 'Peak sun hours by US state',
        columns: ['State', 'City', 'Sun hours a day', 'kWh per kW per year'],
        rows: us.map((l) => [l.region, l.city, l.psh.toFixed(2), fmt0(perKwYear(l.psh))]),
        note: `Source: NASA POWER climatology, ${sun.period} (retrieved ${sun.retrieved}). One representative city per state; output assumes ${DEFAULTS.lossesPct}% losses. ${sun.acknowledgement}`,
      },
    ],
    assumptions: [
      `Sun hours are 25-year NASA averages (${sun.period}) for a south-facing panel tilted at the site's latitude. Any single year can be several percent higher or lower.`,
      `The ${DEFAULTS.lossesPct}% loss default is a planning figure: NREL's PVWatts uses 14% system losses (soiling, wiring, mismatch and similar) plus a 96% efficient inverter, about 17% together, and we add a few points for heat, which costs output on hot roofs.`,
      'Shading, roof direction and tilt are not modelled. An installer\'s site survey or a tool such as NREL PVWatts gives a site-specific figure.',
      'Panel output slowly declines with age (often around half a percent a year), which this estimate ignores. Payback is simple: it leaves out financing, maintenance, inverter replacement and future price changes.',
      `US electricity prices are EIA state averages for homes. Pakistani tariffs depend on your slab, DISCO, taxes and adjustments, so the Rs ${PK_ASSUMED_RATE} a unit starting price is only an assumption: your own is your bill ÷ the units on it.`,
      `Appliance watts are typical running figures, not nameplate maximums: a fridge, freezer or inverter AC cycles, so it uses an average draw over its hours. Your appliance labels give exact figures.`,
      `Roof check: ${Object.values(ROOF_UNITS).map((u) => u.label).join(', ')}. It counts panel area only; walkways, edges, tank rooms and shade need extra space, and an installer's layout is the real test.`,
    ],
  };
}
