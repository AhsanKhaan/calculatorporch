import { addDaysIso, longDate, weekdayName } from '@/lib/calculators/dates';
import type { Family } from './types';

/** Wave-1 instance: only "10 days from today" has research evidence (60.5K/KD 20, docs/11 §1). */
const OFFSETS: Record<string, number> = { '10-days-from-today': 10 };

/** Add N business days (Mon–Fri), not counting the start date. */
export function addBusinessDays(iso: string, n: number): string {
  let d = iso;
  let left = n;
  while (left > 0) {
    d = addDaysIso(d, 1);
    const w = new Date(`${d}T00:00:00Z`).getUTCDay();
    if (w !== 0 && w !== 6) left--;
  }
  return d;
}

const dateOffsetFamily: Family = {
  id: 'date-offset',
  build: (slug, { today }) => {
    const n = OFFSETS[slug];
    if (n === undefined) return null;
    const target = addDaysIso(today, n);
    const business = addBusinessDays(today, n);
    return {
      slug,
      name: `${n} Days From Today`,
      title: `What Date Is ${n} Days From Today?`,
      description: `Find the date ${n} days from today, the day of the week, and ${n} business days from today, with a table for each upcoming start date.`,
      h1: `${n} Days From Today`,
      directAnswer: `${n} days from today is ${longDate(target)}, counting today as day 0. That is one week and three days from now. If you only count business days (Monday to Friday), ${n} business days from today is ${longDate(business)}. The calculator below always uses your device's current date.`,
      answer: { label: `${n} days from ${longDate(today)}`, value: longDate(target) },
      dateDependent: true,
      steps: [`Start from today, ${longDate(today)}, and count forward ${n} calendar days: ${longDate(target)} (a ${weekdayName(target)}).`, `Skipping Saturdays and Sundays instead, ${n} business days from today is ${longDate(business)}.`],
      table: {
        caption: `${n} days from each of the next seven days`,
        columns: ['Start date', `+${n} days`, `+${n} business days`],
        rows: Array.from({ length: 7 }, (_, i) => {
          const s = addDaysIso(today, i);
          return [longDate(s), longDate(addDaysIso(s, n)), longDate(addBusinessDays(s, n))];
        }),
      },
      faqs: [
        { q: `How many weeks is ${n} days?`, a: `${n} days is 1 week and 3 days, or about 1.43 weeks. Two weeks would be 14 days.` },
        { q: `What is ${n} business days from today?`, a: `Counting only Monday to Friday, ${n} business days from today is ${longDate(business)} (as of ${longDate(today)}). Public holidays aren't skipped, so add a day for each holiday that falls in the span.` },
        { q: `Does "${n} days from today" include today?`, a: `Usually not: today counts as day 0, and day ${n} is ${n} days later. If your deadline counts today as day 1, the date is one day earlier.` },
      ],
      island: { id: 'days-from-date', initial: { start: today, days: String(n), direction: 'after' } },
    };
  },
};

export default dateOffsetFamily;
