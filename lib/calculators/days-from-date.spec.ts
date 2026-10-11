import type { CalculatorSpec } from '@/lib/engine/spec';
import { addDaysIso, longDate, weekdayName } from './dates';

/** "N days from a date" (the date-offset family's calculator; embedded on its instance pages). */
const spec: CalculatorSpec = {
  id: 'days-from-date',
  fields: [
    { key: 'start', label: 'Start date', type: 'date', default: 'today', min: '1900-01-01', max: '2200-12-31' },
    { key: 'days', label: 'Number of days', type: 'number', min: 0, max: 100_000, step: 1, default: 10 },
    { key: 'direction', label: 'Direction', type: 'select', options: [{ value: 'after', label: 'From (after) the date' }, { value: 'before', label: 'Before the date' }], default: 'after' },
  ],
  outputs: [
    { key: 'date', label: 'Date', format: 'date', primary: true },
    { key: 'weekday', label: 'Day of the week', format: 'text' },
  ],
  compute: (v) => {
    const n = Math.trunc(Number(v.days));
    const date = addDaysIso(String(v.start), v.direction === 'before' ? -n : n);
    return {
      values: { date, weekday: weekdayName(date) },
      steps: [`${longDate(String(v.start))} ${v.direction === 'before' ? '−' : '+'} ${n} day${n === 1 ? '' : 's'} = ${longDate(date)}.`],
    };
  },
};

export default spec;
