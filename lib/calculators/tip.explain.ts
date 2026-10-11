import type { Explain } from '@/lib/engine/explain';
import { tip } from './tip.spec';

const $ = (n: number) => `$${n.toFixed(2)}`;

export default function explain(): Explain {
  const ex = tip(64, 18, 2, false);
  const bills = [25, 50, 75, 100, 150];
  const pcts = [15, 18, 20, 22];
  return {
    formula: ['tip        = bill × tip % ÷ 100', 'total      = bill + tip', 'per person = total ÷ number of people'],
    example: `Worked example: an 18% tip on a $64 bill is ${$(ex.tipAmt)}, for a total of ${$(ex.total)}. Split two ways, each person pays ${$(ex.perPerson)}.`,
    tables: [
      { caption: 'Tip amounts at common percentages', columns: ['Bill', ...pcts.map((p) => `${p}%`)], rows: bills.map((b) => [$(b), ...pcts.map((p) => $(tip(b, p, 1, false).tipAmt))]), note: 'Computed by the calculator above.' },
    ],
    assumptions: [
      'The tip is calculated on the amount you enter. Many people tip on the pre-tax total; enter that amount if you prefer.',
      'Rounding each share up to a whole dollar makes the effective tip slightly higher; the calculator shows the exact percentage.',
    ],
  };
}
