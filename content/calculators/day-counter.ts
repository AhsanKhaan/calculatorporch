import type { ToolInput } from '../schema';

const tool: ToolInput = {
  url: '/everyday-life/day-counter/',
  calculator: 'day-counter',
  name: 'Day Counter',
  title: 'Day Counter: Count Days Between Two Dates',
  description: 'Day counter: count the days between two dates, with or without the end date, in days, weeks, weekdays and weekend days. Leap years handled.',
  h1: 'Day Counter',
  directAnswer:
    'To count the days between two dates, subtract the start date from the end date; add one if you count the end day too. January 1 to December 31, 2026, counting both dates, is 365 days: 52 weeks and 1 day. This day counter also splits the total into weekdays and weekends.',
  whatItMeans:
    'The main number is the count of calendar days between your two dates. Whether to include the end date depends on what you are counting: the nights of a stay exclude it, while the days of an event usually include it. The weekday figure counts Monday to Friday only, which is a good first estimate of working days before you subtract public holidays.',
  howToUse: [
    'Pick a start date and an end date (both default to sensible dates you can change).',
    'Choose whether to count the end date itself.',
    'Read the total in days, then the same span in weeks, weekdays and weekend days.',
    'Use Copy link to share or save the exact dates.',
  ],
  faqs: [
    { q: 'How many days are in April?', a: 'April has 30 days in every year. The months with 31 days are January, March, May, July, August, October and December; February has 28 days, or 29 in a leap year. The table on this page lists every month for a normal year and a leap year.' },
    { q: 'Does the day counter include the end date?', a: 'Only if you choose it. By default it counts the days between the dates (like nights in a hotel). Choose "include the end date" to count both the first and the last day, which is how many people count the length of an event or a holiday.' },
    { q: 'How do I count only business days?', a: 'The calculator shows weekdays (Monday to Friday) separately from weekend days. Public holidays differ by country and employer, so subtract the ones that apply to you from the weekday figure.' },
    { q: 'Are leap years counted?', a: 'Yes. The calculator follows the Gregorian calendar, where a year is a leap year if it divides by 4, except century years, which must divide by 400. So 2028 is a leap year and 2100 is not.' },
    { q: 'What if the end date is before the start date?', a: 'You get a negative number of days, which tells you how far back the end date is. Swap the dates if you want a positive count.' },
  ],
  sources: [
    {
      title: 'Leap Year',
      url: 'https://www.hko.gov.hk/en/gts/time/basicterms-leapyear.htm',
      publisher: 'Hong Kong Observatory',
      accessed: '2026-10-11',
    },
    {
      title: 'Which years are leap years and can you have leap seconds?',
      url: 'https://www.rmg.co.uk/stories/time/which-years-are-leap-years-can-you-have-leap-seconds',
      publisher: 'Royal Museums Greenwich',
      accessed: '2026-10-11',
    },
  ],
  pendingVerification: [],
  related: ['/everyday-life/time-duration-calculator/', '/everyday-life/age-calculator/', '/everyday-life/hours-calculator/'],
  published: '2026-10-11',
  updated: '2026-10-11',
  batch: 1,
};

export default tool;
