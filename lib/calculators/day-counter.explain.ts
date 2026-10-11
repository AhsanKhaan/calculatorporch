import type { Explain } from '@/lib/engine/explain';
import { addDaysIso, countDays, longDate } from './dates';

export default function explain(): Explain {
  const ex = countDays('2026-01-01', '2026-12-31', true);
  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const daysIn = (y: number, m: string) => countDays(`${y}-${m}-01`, addDaysIso(`${m === '12' ? y + 1 : y}-${m === '12' ? '01' : months[months.indexOf(m) + 1]}-01`, -1), true).days;
  return {
    formula: [
      'days      = end date − start date            (+1 if you count the end date)',
      'weeks     = floor(days ÷ 7), remainder = days mod 7',
      'weekdays  = days that fall Monday–Friday (public holidays not excluded)',
    ],
    example: `Worked example: from ${longDate('2026-01-01')} to ${longDate('2026-12-31')}, counting both dates, is ${ex.days} days: ${ex.weeks} weeks and ${ex.remDays} day, of which ${ex.weekdays} are weekdays and ${ex.weekendDays} are weekend days.`,
    tables: [
      { caption: 'Days in each month (2026 and 2028)', columns: ['Month', '2026', '2028 (leap year)'], rows: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((name, i) => [name, daysIn(2026, months[i]!), daysIn(2028, months[i]!)]) },
    ],
    assumptions: [
      'Dates use the Gregorian calendar. Leap years (every 4 years, except century years not divisible by 400) are handled.',
      'The count is in whole calendar days, so time zones and daylight-saving changes never shift it.',
      'Weekday counts don’t remove public holidays, which differ by country and employer.',
    ],
  };
}
