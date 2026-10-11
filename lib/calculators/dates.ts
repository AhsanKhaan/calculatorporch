/** Calendar maths on ISO dates (UTC arithmetic, so daylight-saving changes never shift a day). */
import { addDaysIso, daysBetweenIso, longDate } from '@/lib/engine/format';

export { addDaysIso, daysBetweenIso, longDate };

const weekday = (iso: string) => new Date(`${iso}T00:00:00Z`).getUTCDay(); // 0 Sun … 6 Sat

export interface DayCount {
  days: number; // signed, end − start (+1 if the end day is included)
  weeks: number;
  remDays: number;
  weekdays: number; // Mon–Fri within the counted span
  weekendDays: number;
}

/** Count days from `start` to `end`. includeEnd adds the end date itself (e.g. a hotel stay vs an event span). */
export function countDays(start: string, end: string, includeEnd: boolean): DayCount {
  const raw = daysBetweenIso(start, end);
  const sign = raw < 0 ? -1 : 1;
  const span = Math.abs(raw) + (includeEnd ? 1 : 0);
  const from = raw < 0 ? end : start;
  let weekdays = 0;
  // Count whole weeks arithmetically, then the remainder day by day (fast for long spans).
  const fullWeeks = Math.floor(span / 7);
  weekdays += fullWeeks * 5;
  for (let i = fullWeeks * 7; i < span; i++) {
    const w = weekday(addDaysIso(from, i));
    if (w !== 0 && w !== 6) weekdays++;
  }
  const days = sign * span;
  return { days, weeks: Math.trunc(span / 7), remDays: span % 7, weekdays, weekendDays: span - weekdays };
}

export const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
export const weekdayName = (iso: string) => WEEKDAY_NAMES[weekday(iso)] ?? '';
