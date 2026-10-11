import type { Explain } from '@/lib/engine/explain';
import { GRAVEL_TYPES, gravel } from './gravel.spec';

export default function explain(): Explain {
  const ex = gravel(400, 3, 'pea', 10);
  const depths = [2, 3, 4, 6];
  return {
    formula: [
      'volume (cu ft) = area (sq ft) × depth (in) ÷ 12 × (1 + waste %)',
      'cubic yards    = cu ft ÷ 27',
      'tons           = cubic yards × density (tons per cubic yard)',
      'bags           = cu ft ÷ 0.5   (rounded up)',
    ],
    example: `Worked example ("figuring gravel"): a 40 ft × 10 ft driveway at 3 inches deep is 400 sq ft. 400 × 3 ÷ 12 = 100 cu ft, plus 10% for compaction = ${ex.ft3.toFixed(0)} cu ft. ÷ 27 = ${ex.yd3.toFixed(2)} cubic yards. At about ${GRAVEL_TYPES.pea.tonsPerYd3} tons per cubic yard of pea gravel, that's ${ex.tons.toFixed(2)} tons.`,
    tables: [
      {
        caption: 'Tons of gravel per 100 sq ft (including 10% extra)',
        columns: ['Gravel type', ...depths.map((d) => `${d} in deep`)],
        rows: Object.entries(GRAVEL_TYPES).map(([k, g]) => [g.label, ...depths.map((d) => gravel(100, d, k as keyof typeof GRAVEL_TYPES, 10).tons.toFixed(2))]),
        note: 'Computed by the calculator above from typical densities; your supplier’s figure for their stone is the one to trust.',
      },
    ],
    sections: [
      { heading: 'Driveway gravel depth', paragraphs: ['A new gravel driveway is usually built in layers: a base of larger crushed stone, then a top layer of finer gravel, for a total of roughly 4 to 6 inches or more on soft ground. Top-ups and paths often need only 2 to 3 inches. Use the depth for the layer you are ordering, and order each layer separately if they are different stones.'] },
    ],
    assumptions: [
      'Densities are typical values for loose, dry stone and vary with rock type, size and moisture. Ask your supplier for the weight per cubic yard of the exact product.',
      'The 10% default allowance covers compaction and uneven ground; increase it for very soft or uneven sites.',
      'Gravel is usually sold by the ton or by the cubic yard; bagged gravel (0.5 cu ft) is practical only for small jobs.',
    ],
  };
}
