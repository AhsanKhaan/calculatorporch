import electricity from '@/data/electricity-us.json';
import type { Explain } from '@/lib/engine/explain';
import { DEFAULTS, DENSITY, FEE_PRESETS, calculate } from './3d-printing-cost';

const money = (n: number | null) => (n === null ? 'n/a' : `$${n.toFixed(2)}`);

export default function explain(): Explain {
  const r = calculate(DEFAULTS);
  const p = FEE_PRESETS[DEFAULTS.feePreset];
  const rates = Object.entries(electricity.rates as Record<string, number>).filter(([n]) => n !== 'US average').sort((a, b) => b[1] - a[1]);
  const tenHours = (c: number) => money(Math.round(0.12 * 10 * c) / 100);
  return {
    formula: [
      'material      = grams ÷ spool grams × spool price',
      'electricity   = watts ÷ 1000 × hours × (¢/kWh ÷ 100)',
      'machine       = hours × (printer price ÷ lifetime hours + maintenance per hour)',
      'failure share = run cost ÷ (1 − failure rate) − run cost',
      'total cost    = material + electricity + machine + failure share + labor + extras',
      'price         = (total cost + fixed fees) ÷ (1 − margin − fee %)',
    ],
    example:
      `Worked example (the defaults): ${DEFAULTS.grams} g of PLA from a $${DEFAULTS.spoolPrice}, 1 kg spool = ${money(r.material)}. ` +
      `0.12 kW × ${DEFAULTS.hours} h × $${(DEFAULTS.centsPerKwh / 100).toFixed(4)} = ${money(r.electricity)} of electricity. ` +
      `${DEFAULTS.hours} h × ($${DEFAULTS.printerPrice} ÷ ${DEFAULTS.lifetimeHours.toLocaleString('en-US')} h + $${DEFAULTS.maintPerHour}) = ${money(r.machine)} of machine wear. ` +
      `A ${DEFAULTS.failRatePct}% failure rate adds ${money(r.failureAllowance)}, ${DEFAULTS.laborMinutes} minutes at $${DEFAULTS.laborRate}/h adds ${money(r.labor)}, and packaging is ${money(r.extras)}: ` +
      `a total cost of ${money(r.totalCost)}. With Etsy-style fees (${(p.pct * 100).toFixed(1)}% + ${money(p.fixed)}) and a ${DEFAULTS.marginPct}% margin, ` +
      `price = (${money(r.totalCost)} + ${money(p.fixed)}) ÷ (1 − ${DEFAULTS.marginPct / 100} − ${p.pct}) = ${money(r.price)}, leaving ${money(r.profit)} profit.`,
    tables: [
      { caption: 'Most expensive states: 10-hour print at 120 W', columns: ['State', '¢/kWh', 'Cost'], rows: rates.slice(0, 5).map(([n, c]) => [n, `${c.toFixed(2)}¢`, tenHours(c)]) },
      { caption: 'Cheapest states: 10-hour print at 120 W', columns: ['State', '¢/kWh', 'Cost'], rows: rates.slice(-5).reverse().map(([n, c]) => [n, `${c.toFixed(2)}¢`, tenHours(c)]), note: `Source: U.S. EIA, Electric Power Monthly Table 5.6.A, residential, ${electricity.period} (retrieved ${electricity.retrieved}).` },
    ],
    assumptions: [
      `Filament length assumes 1.75 mm filament and typical densities (${Object.entries(DENSITY).map(([m, d]) => `${m} ${d}`).join(', ')} g/cm³). Brands vary slightly.`,
      'The 120 W default errs high on purpose: Prusa measured an average of 80 W printing generic PLA and 120 W printing generic ABS on its MK-series printers (at 26 °C room temperature). Power draw varies with bed temperature, enclosure and material, so a plug-in power meter gives your real number.',
      "Marketplace fee presets are approximations for US sellers and change over time. Check the platform's official fee page; offsite ads, shipping labels and taxes aren't included.",
    ],
  };
}
