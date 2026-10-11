import type { Explain } from '@/lib/engine/explain';
import { addDaysIso, longDate } from './dates';
import { METHODS, MILESTONES } from './dog-pregnancy.spec';

export default function explain(): Explain {
  const mating = '2026-03-01';
  const weeks = [
    ['1', '1–7', 'Fertilization in the oviducts; no visible signs.'],
    ['2', '8–14', 'Embryos travel to the uterus.'],
    ['3', '15–21', 'Embryos implant in the uterus around days 20–21.'],
    ['4', '22–28', 'From about day 25 a vet may confirm pregnancy by ultrasound; it is reliable by days 25–35.'],
    ['5', '29–35', 'Weight gain and a larger belly start to show.'],
    ['6', '36–42', 'Appetite increases; talk to your vet about her diet.'],
    ['7', '43–49', 'Puppies show on an X-ray from about day 45; X-rays after day 55 are best for counting them.'],
    ['8', '50–56', 'Prepare the whelping box somewhere quiet.'],
    ['9', '57–63+', 'Take her temperature twice a day from about day 58; a drop usually comes 8–24 hours before delivery.'],
  ];
  return {
    formula: [
      `from mating:     due = mating date + ${METHODS.mating.due} days   (normal window: day ${METHODS.mating.early}–${METHODS.mating.late})`,
      `from ovulation:  due = ovulation date + ${METHODS.ovulation.due} days (window day ${METHODS.ovulation.early}–${METHODS.ovulation.late})`,
      `from LH surge:   due = LH surge date + ${METHODS.lh.due} days (window day ${METHODS.lh.early}–${METHODS.lh.late})`,
      `two matings:     window runs from first mating + ${METHODS.mating.early} to last mating + ${METHODS.mating.late}`,
    ],
    example: `Worked example: a mating on ${longDate(mating)} gives an estimated due date of ${longDate(addDaysIso(mating, METHODS.mating.due))}, with a normal window from ${longDate(addDaysIso(mating, METHODS.mating.early))} to ${longDate(addDaysIso(mating, METHODS.mating.late))}. The range is wide because sperm can survive for several days before ovulation, so the mating date isn't the conception date.`,
    tables: [
      { caption: 'Dog pregnancy week by week', columns: ['Week', 'Days', 'What happens'], rows: weeks },
      { caption: 'Key dates from a 1 March 2026 mating', columns: ['Milestone', 'Date'], rows: [...MILESTONES.map((m) => [m.label, longDate(addDaysIso(mating, m.day))]), [`Estimated due date (day ${METHODS.mating.due})`, longDate(addDaysIso(mating, METHODS.mating.due))]] },
    ],
    assumptions: [
      'This is an educational estimate, not veterinary advice. Involve your vet for prenatal care, and call them immediately if labor problems occur.',
      'Due dates from progesterone-timed ovulation or the LH surge are more precise than dates counted from mating. The MSD Veterinary Manual gives 64–66 days from the LH surge, and a wider 58–72 days counted from the first day she accepted breeding.',
      'The mating window (56–68 days after a single mating) and the ovulation window (62–64 days) follow Concannon (2000); milestone days assume mating close to ovulation.',
      'Milestone days are typical ranges; individual dogs and breeds vary.',
    ],
  };
}
