import type { Explain } from '@/lib/engine/explain';
import { SQFT_PER_SQM, area } from './square-footage.spec';

export default function explain(): Explain {
  const rooms: [string, number, number][] = [
    ['Small bedroom', 10, 10],
    ['Primary bedroom', 14, 16],
    ['Living room', 16, 20],
    ['Two-car garage', 20, 20],
    ['Patio', 12, 15],
  ];
  return {
    formula: [
      'rectangle   = length × width',
      'circle      = π × (diameter ÷ 2)²',
      'triangle    = base × height ÷ 2',
      'sq yd = sq ft ÷ 9      sq m = sq ft ÷ 10.7639      acres = sq ft ÷ 43,560',
    ],
    example: `Worked example: a 12 ft × 15 ft room is 12 × 15 = ${area('rectangle', 12, 15)} sq ft, which is ${(180 / 9).toFixed(0)} sq yd or ${(180 / SQFT_PER_SQM).toFixed(2)} m². For an L-shaped room, split it into rectangles, work out each one and add them together.`,
    tables: [
      { caption: 'Typical room sizes', columns: ['Space', 'Dimensions', 'Square feet', 'Square meters'], rows: rooms.map(([n, l, w]) => [n, `${l} × ${w} ft`, area('rectangle', l, w), (area('rectangle', l, w) / SQFT_PER_SQM).toFixed(1)]), note: 'Examples only; measure your own space.' },
    ],
    sections: [
      { heading: 'How to measure square footage', paragraphs: ['Measure each wall at floor level with a tape measure, to the nearest inch, and convert inches to feet by dividing by 12 (6 inches is 0.5 ft). For irregular rooms, sketch the floor plan, split it into rectangles and triangles, and add the areas. Subtract anything you won’t cover, such as a kitchen island, when you are buying flooring.'] },
    ],
    assumptions: ['Material quantities usually need 5–15% extra for cuts and waste; this calculator gives the exact area.', '1 ft = 0.3048 m exactly, so 1 m² = 10.7639 sq ft.'],
  };
}
