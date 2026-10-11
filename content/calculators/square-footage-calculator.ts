import type { ToolInput } from '../schema';

const tool: ToolInput = {
  url: '/construction/square-footage-calculator/',
  calculator: 'square-footage',
  name: 'Square Footage Calculator',
  title: 'Square Footage Calculator: Rooms, Circles, Triangles',
  description: 'Calculate square feet for rectangles, circles and triangles, convert to square yards, square meters and acres, and estimate cost per square foot.',
  h1: 'Square Footage Calculator',
  directAnswer:
    'To calculate square feet, multiply length by width in feet. A 12 ft by 15 ft room is 180 square feet, which is 20 square yards or 16.72 square meters. For circles use π × radius², and for triangles base × height ÷ 2. Split L-shaped rooms into rectangles and add them.',
  whatItMeans:
    'Square footage is the floor area of a space. It is what you need to order flooring, paint for a floor, sod, or to compare home and room sizes. Material quantities usually need extra for cuts and waste, so add 5–15% to the area when you buy, depending on the material and the shape of the room.',
  howToUse: [
    'Choose the shape: rectangle, circle or triangle.',
    'Enter the length and width in feet (diameter for a circle; base and height for a triangle).',
    'If you have several identical areas, enter how many.',
    'Optionally enter a price per square foot to estimate cost.',
  ],
  faqs: [
    { q: 'How do you calculate square feet?', a: 'Multiply the length by the width, both in feet. A room 11 feet by 14 feet is 154 square feet. If you measured in inches, divide each measurement by 12 first, or multiply the inches together and divide by 144.' },
    { q: 'How do you measure square footage of an irregular room?', a: 'Sketch the room, split it into rectangles (and triangles if there are angled walls), measure each part, work out each area and add them together. Subtract areas you won’t cover, such as a fixed kitchen island.' },
    { q: 'How do I convert square feet to square meters?', a: 'Divide square feet by 10.7639. For example, 180 square feet is 16.72 square meters. To go the other way, multiply square meters by 10.7639.' },
    { q: 'How many square feet are in an acre?', a: 'An acre is 43,560 square feet, which is about 4,047 square meters. The calculator shows acres alongside square feet for large areas such as lots and lawns.' },
    { q: 'How much extra flooring should I buy?', a: 'A common rule of thumb is 5–10% extra for simple rooms and 10–15% for diagonal layouts or rooms with many corners. Check the manufacturer’s guidance for your product.' },
    { q: 'How do you calculate the square footage of a circle?', a: 'Multiply π (about 3.1416) by the radius squared. A circular patio 10 feet across has a radius of 5 feet, so its area is 3.1416 × 25 ≈ 78.54 square feet.' },
  ],
  sources: [],
  pendingVerification: ['Add 2 references: the exact foot–meter definition (NIST) and a flooring waste-allowance source, with accessed dates'],
  related: ['/construction/tile-calculator/', '/construction/concrete-slab-cost-calculator/', '/construction/gravel-calculator/'],
  published: '2026-10-11',
  updated: '2026-10-11',
  batch: 1,
};

export default tool;
