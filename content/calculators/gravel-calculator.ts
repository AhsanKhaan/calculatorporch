import type { ToolInput } from '../schema';

const tool: ToolInput = {
  url: '/construction/gravel-calculator/',
  calculator: 'gravel',
  name: 'Gravel Calculator',
  title: 'Gravel Calculator: Cubic Yards, Tons and Bags',
  description: 'Work out how much gravel you need in cubic yards, tons and bags for a driveway, path or patio, by gravel type and depth, with an optional cost estimate.',
  h1: 'Gravel Calculator',
  directAnswer:
    'To figure gravel, multiply length × width × depth in inches ÷ 12 to get cubic feet, then divide by 27 for cubic yards. A 40 by 10 ft driveway 3 inches deep needs about 4.07 cubic yards with 10% extra, roughly 5.7 tons of pea gravel. Choose your gravel type for its weight.',
  whatItMeans:
    'Cubic yards is how most suppliers sell bulk gravel; tons is how quarries and landscape yards often price it, and the conversion depends on the stone. The 10% extra covers compaction and uneven ground, so you don’t run short. For small jobs, the bag count tells you how many 0.5 cubic foot bags to buy instead.',
  howToUse: [
    'Choose rectangle or circle and enter the dimensions in feet.',
    'Enter the depth in inches for the layer you are ordering.',
    'Pick the gravel type, which sets the weight per cubic yard, and keep or change the 10% extra.',
    'Optionally enter your supplier’s price per ton for a cost estimate.',
  ],
  faqs: [
    { q: 'How much gravel do I need for my driveway?', a: 'Multiply the driveway’s length by its width, then by the depth in inches ÷ 12, and divide by 27 for cubic yards. A 40 ft by 10 ft driveway at 3 inches deep needs about 3.7 cubic yards, or about 4.1 with 10% extra for compaction.' },
    { q: 'How many tons are in a cubic yard of gravel?', a: 'Typically about 1.35 to 1.7 tons, depending on the stone, its size and moisture. Pea gravel is often around 1.4 tons per cubic yard and road base nearer 1.7. Your supplier can tell you the figure for their product.' },
    { q: 'How deep should gravel be?', a: 'Paths and top-ups often need 2–3 inches. A new driveway is usually built in layers totaling roughly 4–6 inches or more, with larger crushed stone at the bottom and finer gravel on top. Soft ground needs more.' },
    { q: 'How much pea gravel do I need?', a: 'Use the same formula with pea gravel selected: area in square feet × depth in inches ÷ 12 ÷ 27 gives cubic yards, then about 1.4 tons per cubic yard. For a 10 ft × 10 ft area at 2 inches, that’s about 0.68 cubic yards with 10% extra.' },
    { q: 'How many bags of gravel make a cubic yard?', a: 'A cubic yard is 27 cubic feet, so it takes 54 bags of 0.5 cubic feet. Bags make sense for small jobs; for anything over about a cubic yard, bulk delivery is usually cheaper.' },
    { q: 'Should I add extra gravel for compaction?', a: 'Yes. Gravel settles and compacts, and ground is rarely perfectly flat, so ordering about 10% extra is common. Increase it for soft or uneven ground.' },
  ],
  sources: [],
  pendingVerification: [
    'Gravel densities by type (pea 1.4, #57 1.4, river rock 1.35, DG 1.5, crusher run 1.7 t/yd³): verify against supplier or DOT data and cite (docs/03 §6)',
    'Driveway depth guidance: cite an extension-service or DOT gravel-road source',
  ],
  related: ['/construction/square-footage-calculator/', '/construction/concrete-slab-cost-calculator/'],
  published: '2026-10-11',
  updated: '2026-10-11',
  batch: 1,
};

export default tool;
