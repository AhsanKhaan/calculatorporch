import type { ToolInput } from '../schema';

const tool: ToolInput = {
  url: '/pets/dog-pregnancy-calculator/',
  calculator: 'dog-pregnancy',
  name: 'Dog Pregnancy Calculator',
  title: 'Dog Pregnancy Calculator: Due Date and Timeline',
  description: 'Estimate a dog’s due date and whelping window from the mating, ovulation or LH-surge date, with a week-by-week pregnancy timeline and key milestones.',
  h1: 'Dog Pregnancy Calculator',
  directAnswer:
    'Dogs are pregnant for about 63 days from mating, with a normal range of roughly 58 to 68 days because the mating date isn’t the conception date. A mating on March 1, 2026 points to a due date around May 3, 2026. Enter your dates for a full week-by-week timeline.',
  appCategory: 'LifestyleApplication',
  whatItMeans:
    'The due date is an estimate, and most dogs whelp within the window shown rather than on the exact day. If your vet has timed ovulation with progesterone tests, choose that method for a much narrower estimate. The milestones show when a vet can confirm the pregnancy and when to start temperature checks before labor.',
  howToUse: [
    'Choose what you are counting from: the mating date, or ovulation or the LH surge if your vet tested progesterone.',
    'Enter the date. If she was mated twice, add the second date too.',
    'Read the due date, the whelping window and how many days she has been pregnant.',
    'Open "Show the working" for the milestone dates, and share them with Copy link.',
  ],
  faqs: [
    { q: 'How long are dogs pregnant?', a: 'About 63 days, or roughly nine weeks, counted from ovulation. Counted from the mating date the range is wider, typically about 58 to 68 days, because sperm can survive in the female for several days before the eggs are released.' },
    { q: 'How many months is a dog pregnancy?', a: 'A little over two months. At about 63 days, a dog pregnancy lasts around nine weeks, which is why breeders usually plan by weeks and days rather than months.' },
    { q: 'How accurate is a due date from the mating date?', a: 'It gives a useful window but not an exact day, because conception can happen days after mating. Due dates from progesterone-timed ovulation or the LH surge are much more precise, often to within a day or two.' },
    { q: 'When can a vet confirm a dog is pregnant?', a: 'An ultrasound can usually confirm pregnancy from about day 25 after mating, and an X-ray from about day 45 can count the puppies. Ask your vet which is best for your dog.' },
    { q: 'When do dogs start to show pregnancy?', a: 'Physical changes usually become noticeable in the second half of pregnancy, from around week five, with weight gain and a rounder belly. Early signs can be subtle, so a vet check is the reliable way to know.' },
    { q: 'What if she was mated twice?', a: 'Enter both dates. The whelping window then runs from 58 days after the first mating to 68 days after the last, which covers either mating being the one that resulted in pregnancy.' },
  ],
  sources: [],
  pendingVerification: [
    'Gestation length from mating / ovulation / LH surge (63 days, 58–68 window; 63±2; 65±1): verify against a veterinary reproduction reference (e.g. the Merck Veterinary Manual) and cite',
    'Milestones (implantation ~days 18–22, ultrasound ~day 25+, X-ray ~day 45+, temperature drop 12–24 h before labor): verify and cite (docs/03 §2)',
  ],
  related: ['/pets/puppy-weight-calculator/', '/everyday-life/day-counter/'],
  disclaimer: 'Educational estimate, not veterinary advice. Contact your vet for prenatal care, and immediately if labor problems occur.',
  published: '2026-10-11',
  updated: '2026-10-11',
  batch: 1,
};

export default tool;
