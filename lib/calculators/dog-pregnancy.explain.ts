import type { Explain } from '@/lib/engine/explain';
import { addDaysIso, longDate } from './dates';
import { METHODS, MILESTONES } from './dog-pregnancy.spec';

export default function explain(): Explain {
  const mating = '2026-03-01';
  const weeks = [
    ['1', '1–7', 'Fertilization in the oviducts; no visible signs.'],
    ['2', '8–14', 'Embryos travel to the uterus.'],
    ['3', '15–21', 'Implantation begins around days 18–22.'],
    ['4', '22–28', 'A vet can usually confirm pregnancy by ultrasound from about day 25.'],
    ['5', '29–35', 'Weight gain and a larger belly start to show.'],
    ['6', '36–42', 'Appetite increases; talk to your vet about her diet.'],
    ['7', '43–49', 'An X-ray from about day 45 can count the puppies.'],
    ['8', '50–56', 'Prepare the whelping box somewhere quiet.'],
    ['9', '57–63+', 'Take her temperature twice a day from about day 58; a drop often comes 12–24 hours before labor.'],
  ];
  return {
    formula: [
      `from mating:     due = mating date + ${METHODS.mating.due} days   (normal window: day ${METHODS.mating.early}–${METHODS.mating.late})`,
      `from ovulation:  due = ovulation date + ${METHODS.ovulation.due} days (window ±2)`,
      `from LH surge:   due = LH surge date + ${METHODS.lh.due} days (window ±1)`,
      'two matings:     window runs from first mating + 58 to last mating + 68',
    ],
    example: `Worked example: a mating on ${longDate(mating)} gives an estimated due date of ${longDate(addDaysIso(mating, 63))}, with a normal window from ${longDate(addDaysIso(mating, 58))} to ${longDate(addDaysIso(mating, 68))}. The range is wide because sperm can survive for several days before ovulation, so the mating date isn't the conception date.`,
    tables: [
      { caption: 'Dog pregnancy week by week', columns: ['Week', 'Days', 'What happens'], rows: weeks },
      { caption: 'Key dates from a 1 March 2026 mating', columns: ['Milestone', 'Date'], rows: [...MILESTONES.map((m) => [m.label, longDate(addDaysIso(mating, m.day))]), ['Estimated due date (day 63)', longDate(addDaysIso(mating, 63))]] },
    ],
    assumptions: [
      'This is an educational estimate, not veterinary advice. Involve your vet for prenatal care, and call them immediately if labor problems occur.',
      'Due dates from progesterone-timed ovulation or the LH surge are more precise than dates counted from mating.',
      'Milestone days are typical ranges; individual dogs and breeds vary.',
    ],
  };
}
