import type { CalculatorSpec } from '@/lib/engine/spec';
import { countDays, longDate } from './dates';

const spec: CalculatorSpec = {
  id: 'day-counter',
  fields: [
    { key: 'start', label: 'Start date', type: 'date', default: 'today', min: '1900-01-01', max: '2200-12-31' },
    { key: 'end', label: 'End date', type: 'date', default: 'today+30', min: '1900-01-01', max: '2200-12-31' },
    {
      key: 'includeEnd',
      label: 'Count the end date?',
      type: 'select',
      options: [
        { value: 'no', label: 'No: count the days between' },
        { value: 'yes', label: 'Yes: include the end date' },
      ],
      default: 'no',
    },
  ],
  outputs: [
    { key: 'days', label: 'Days', format: 'integer', primary: true, suffix: 'days' },
    { key: 'weeks', label: 'In weeks', format: 'text' },
    { key: 'weekdays', label: 'Weekdays (Mon–Fri)', format: 'integer' },
    { key: 'weekendDays', label: 'Weekend days', format: 'integer' },
  ],
  compute: (v) => {
    const c = countDays(String(v.start), String(v.end), v.includeEnd === 'yes');
    const span = Math.abs(c.days);
    return {
      values: { days: c.days, weeks: `${c.weeks} week${c.weeks === 1 ? '' : 's'} and ${c.remDays} day${c.remDays === 1 ? '' : 's'}`, weekdays: c.weekdays, weekendDays: c.weekendDays },
      steps: [
        `From ${longDate(String(v.start))} to ${longDate(String(v.end))} is ${span} day${span === 1 ? '' : 's'}${v.includeEnd === 'yes' ? ', counting the end date' : ''}.`,
        `${span} ÷ 7 = ${c.weeks} full week${c.weeks === 1 ? '' : 's'} with ${c.remDays} day${c.remDays === 1 ? '' : 's'} left over.`,
        `Of those, ${c.weekdays} fall on Monday to Friday and ${c.weekendDays} on weekends (public holidays aren't excluded).`,
      ],
      warnings: c.days < 0 ? ['The end date is before the start date, so the count is negative.'] : [],
    };
  },
};

export default spec;
