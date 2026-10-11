/**
 * Category taxonomy (docs/10 §2): Omni-style categories, subcategories as on-page headings (never URLs).
 * A category is generated only once it has a published page (playbook §0.2b: no empty hubs).
 */
export const CATEGORY_SLUGS = [
  'math', 'statistics', 'everyday-life', 'construction', 'finance', 'food', 'pets', 'sports', 'physics', 'education',
  'health', 'conversion', 'garden', 'photo', 'auto', 'other',
] as const;
export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export interface Category {
  slug: CategorySlug;
  name: string;
  /** ≤ 60 characters */
  title: string;
  /** ≤ 155 characters */
  description: string;
  /** About 90 words, shown at the top of the category page (Omni pattern). */
  intro: string;
  /** Display order of subcategory headings. Tools name their subcategory from this list. */
  subcategories: readonly string[];
}

export const CATEGORIES: readonly Category[] = [
  {
    slug: 'math',
    name: 'Math',
    title: 'Math Calculators: Fractions, Percentages, Geometry',
    description: 'Free math calculators with step-by-step working: fractions, percentages, LCM, volume and right triangles. Every formula shown.',
    intro:
      'Math calculators that show their working, not just an answer. Add, subtract, multiply and divide fractions and mixed numbers step by step, work out percentages of two numbers, find the least common multiple, and solve right triangles and the volume of common shapes. Each calculator explains the formula it uses, walks through a worked example you can check by hand, and lists the questions people ask most. Nothing you type leaves your browser, and every result updates as you type, so you can explore numbers freely.',
    subcategories: ['Fractions & arithmetic', 'Percentages', 'Geometry', 'Number theory'],
  },
  {
    slug: 'statistics',
    name: 'Statistics',
    title: 'Statistics Calculators: Mean, SD, Z-Score, Probability',
    description: 'Free statistics calculators: mean, median, mode, standard deviation, z-scores, probability and random numbers, with formulas and steps.',
    intro:
      'Statistics calculators for homework, reports and quick checks. Paste a list of numbers to get the mean, median, mode, range and standard deviation with every step shown, convert a value to a z-score, work out the probability of combined events, or generate random numbers in any range. Each tool states the formula it uses, including whether it treats your data as a sample or a whole population, so you know exactly which answer your teacher or report expects.',
    subcategories: ['Descriptive statistics', 'Probability & distributions', 'Random generators'],
  },
  {
    slug: 'everyday-life',
    name: 'Everyday Life',
    title: 'Everyday Calculators: Time, Dates, Age and Home',
    description: 'Free everyday calculators: time between times, days between dates, age, hours from now, electricity cost, crafts and event planning.',
    intro:
      'Calculators for everyday questions: how long between two times, how many days until a date, exactly how old someone is, and what time it will be a number of hours from now. You will also find tools for running costs at home, using official electricity prices by US state, and for craft projects like candle making and sewing, plus a seating chart maker for weddings and events. Each one shows how the answer is worked out, so you can trust it and explain it.',
    subcategories: ['Time & date', 'Home & energy', 'Crafts & sewing', 'Events'],
  },
  {
    slug: 'construction',
    name: 'Construction',
    title: 'Construction Calculators: Gravel, Concrete, Roofing',
    description: 'Free construction and DIY calculators: square footage, gravel, concrete slab cost, board feet, roofing, tile, rafters and stair stringers.',
    intro:
      'Construction and DIY calculators that help you order the right amount of material and cut it right the first time. Measure square footage, estimate gravel in cubic yards and tons, price a concrete slab, count board feet, size roofing, tile, rafters and stair stringers, and work out pool salt. Each tool lists its assumptions, such as material densities and waste allowances, cites where they come from, and shows a worked example, so you can sanity-check the result before you buy or build.',
    subcategories: ['Area & volume', 'Materials', 'Lumber & framing', 'Flooring & roofing', 'Pools'],
  },
  {
    slug: 'finance',
    name: 'Finance',
    title: 'Finance Calculators: Discounts, Tips and Pricing',
    description: 'Free finance calculators for everyday money maths: percent off and sale prices, tips and splitting a bill, and pricing for makers.',
    intro:
      'Everyday money calculators that do the arithmetic without the guesswork. Work out a sale price and how much you save at any percent off, calculate a tip and split the bill, and price products you make, such as 3D prints, so every sale covers materials, machine time, your labor and marketplace fees. These tools do maths, not financial advice: each one shows its formula and a worked example so you can check the numbers yourself.',
    subcategories: ['Shopping & discounts', 'Pricing & business'],
  },
  {
    slug: 'food',
    name: 'Food',
    title: "Food Calculators: Pizza Dough and Baker's Percentage",
    description: "Free food calculators for home bakers: pizza dough by baker's percentage and sourdough hydration, with recipes worked out by weight.",
    intro:
      "Food calculators for home cooks and bakers who want repeatable results. Scale pizza dough by baker's percentage for any number of pizzas and any hydration, and plan sourdough with the right starter, flour, water and salt by weight. Each calculator explains the ratios behind the recipe, gives a worked example, and answers the questions bakers ask most, so you understand what changing one number does to the dough.",
    subcategories: ['Baking & dough'],
  },
  {
    slug: 'pets',
    name: 'Pets',
    title: 'Pet Calculators: Puppy Weight and Dog Pregnancy',
    description: 'Free pet calculators: dog pregnancy due date and timeline, and puppy adult weight estimates, from cited veterinary references.',
    intro:
      "Pet calculators for dog owners and breeders. Work out a dog's due date and pregnancy timeline from the mating date, and estimate how big a puppy will get as an adult. Each calculator explains the method it uses and the veterinary references behind it, gives week-by-week milestones, and is clear about its limits: results are estimates to help you plan, not veterinary advice, so always involve your vet in a pregnancy or a growth concern.",
    subcategories: ['Dogs'],
  },
  {
    slug: 'sports',
    name: 'Sports',
    title: 'Sports Calculators: Bowling Scores and Gear Ratios',
    description: 'Free sports calculators: bowling score frame by frame with the official rules, and bike gear ratios, gear inches and speed.',
    intro:
      'Sports calculators that explain the rules as well as the numbers. Score a bowling game frame by frame, with strikes, spares and the tenth frame handled the way the official rules describe, and work out bike gear ratios, gear inches and speed at a given cadence. Each tool shows its working and a worked example, so you can learn the method as well as get the answer.',
    subcategories: ['Bowling', 'Cycling'],
  },
  {
    slug: 'physics',
    name: 'Physics',
    title: 'Physics Calculators: Speed, Distance and Time',
    description: 'Free physics calculators: solve for speed, distance or time with unit conversions and a worked example for every answer.',
    intro:
      'Physics calculators for everyday motion problems. Solve for speed, distance or time when you know the other two, in the units you actually use, from miles per hour to meters per second. Each calculator shows the formula, converts units for you, and walks through a worked example, so the answer is easy to check and easy to explain in homework or a report.',
    subcategories: ['Motion'],
  },
  {
    slug: 'education',
    name: 'Education',
    title: 'Grade Calculators: Grades and Final Exam Scores',
    description: 'Free grade calculators: turn points into percentages and letter grades, and find the score you need on your final exam.',
    intro:
      'Grade calculators for students and teachers. Turn points into a percentage and a letter grade, and work out exactly what you need on your final exam to reach the grade you want, given your current grade and how much the final is worth. Each tool shows the formula and a worked example, so you can plan your studying with real numbers instead of guesses.',
    subcategories: ['Grades'],
  },
  { slug: 'health', name: 'Health', title: 'Health Calculators', description: 'Health calculators with cited methods.', intro: 'Health calculators.', subcategories: [] },
  { slug: 'conversion', name: 'Conversion', title: 'Unit Conversion Calculators', description: 'Unit conversion calculators.', intro: 'Unit converters.', subcategories: [] },
  { slug: 'garden', name: 'Garden', title: 'Garden Calculators', description: 'Garden calculators.', intro: 'Garden calculators.', subcategories: [] },
  { slug: 'photo', name: 'Photo', title: 'Photography Calculators', description: 'Photography calculators.', intro: 'Photography calculators.', subcategories: [] },
  { slug: 'auto', name: 'Auto', title: 'Auto Calculators', description: 'Auto calculators.', intro: 'Auto calculators.', subcategories: [] },
  { slug: 'other', name: 'Other', title: 'Other Calculators', description: 'Other calculators.', intro: 'Other calculators.', subcategories: [] },
];

export const categoryBySlug = (slug: string): Category | undefined => CATEGORIES.find((c) => c.slug === slug);
