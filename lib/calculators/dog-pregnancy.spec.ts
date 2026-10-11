import type { CalculatorSpec } from '@/lib/engine/spec';
import { addDaysIso, daysBetweenIso, longDate } from './dates';

/**
 * Canine gestation, per docs/03 §2. [U] Verify every number against a veterinary reproduction reference
 * (e.g. the Merck Veterinary Manual) and cite it before publishing (content `pendingVerification`).
 */
export const METHODS = {
  mating: { label: 'Mating (breeding) date', due: 63, early: 58, late: 68 },
  ovulation: { label: 'Ovulation date (from progesterone testing)', due: 63, early: 61, late: 65 },
  lh: { label: 'LH surge date (from progesterone testing)', due: 65, early: 64, late: 66 },
} as const;
export type Method = keyof typeof METHODS;

/** Milestones in days from mating [U]. */
export const MILESTONES = [
  { day: 18, label: 'Implantation begins (about days 18–22)' },
  { day: 25, label: 'Earliest ultrasound confirmation (about day 25 onward)' },
  { day: 45, label: 'X-ray can count puppies (about day 45 onward)' },
  { day: 58, label: 'Start taking her temperature twice a day' },
] as const;

export function dueDates(date: string, method: Method, secondMating = '') {
  const m = METHODS[method];
  const last = method === 'mating' && secondMating && secondMating > date ? secondMating : date;
  return { due: addDaysIso(date, m.due), early: addDaysIso(date, m.early), late: addDaysIso(last, m.late) };
}

const spec: CalculatorSpec = {
  id: 'dog-pregnancy',
  fields: [
    { key: 'method', label: 'Count from', type: 'select', options: Object.entries(METHODS).map(([k, m]) => ({ value: k, label: m.label })), default: 'mating' },
    { key: 'date', label: 'Date', type: 'date', default: 'today-21', min: '2000-01-01', max: '2100-12-31' },
    { key: 'second', label: 'Second mating date (optional)', type: 'date', default: '', optional: true, min: '2000-01-01', max: '2100-12-31', hint: 'If she was bred twice, the window runs from the first mating to the last.' },
  ],
  outputs: [
    { key: 'due', label: 'Estimated due date', format: 'date', primary: true },
    { key: 'window', label: 'Normal whelping window', format: 'text' },
    { key: 'daysPregnant', label: 'Days pregnant today', format: 'integer' },
    { key: 'daysLeft', label: 'Days until the due date', format: 'integer' },
  ],
  compute: (v, { today }) => {
    const method = (v.method as Method) in METHODS ? (v.method as Method) : 'mating';
    const date = String(v.date);
    const d = dueDates(date, method, String(v.second));
    const offset = method === 'mating' ? 0 : METHODS[method].due - 63; // align milestones (counted from mating) to the chosen method
    return {
      values: {
        due: d.due,
        window: `${longDate(d.early)} to ${longDate(d.late)}`,
        daysPregnant: Math.max(0, daysBetweenIso(date, today)),
        daysLeft: daysBetweenIso(today, d.due),
      },
      steps: [
        `Due date = ${longDate(date)} + ${METHODS[method].due} days = ${longDate(d.due)}.`,
        `Normal window: day ${METHODS[method].early} to day ${METHODS[method].late}${String(v.second) ? ' (from the first to the last mating)' : ''}.`,
        ...MILESTONES.map((ms) => `${longDate(addDaysIso(date, ms.day + offset))}: ${ms.label}.`),
      ],
      warnings: daysBetweenIso(date, today) > METHODS[method].late + 3 ? ['That date is more than about 70 days ago. If she hasn’t whelped, contact your vet.'] : [],
    };
  },
};

export default spec;
