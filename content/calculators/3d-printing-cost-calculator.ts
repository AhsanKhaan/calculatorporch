import type { ToolInput } from '../schema';

/** Ported from the v1 content module; URL moved to /finance/ (docs/02 §3). */
const tool: ToolInput = {
  url: '/finance/3d-printing-cost-calculator/',
  calculator: '3d-printing-cost',
  name: '3D Printing Cost Calculator',
  title: '3D Printing Cost Calculator: Price Your Prints for Profit',
  description: 'Find what a 3D print really costs (filament, power, wear, failed prints, your time) and the price that keeps your margin after Etsy or eBay fees.',
  h1: '3D Printing Cost Calculator',
  directAnswer:
    '3D print cost = filament + electricity + machine wear + a failed-print allowance + your time + packaging. A 120 g PLA print that runs 6 hours costs about $10.85. To keep a 40% margin after Etsy-style fees, sell it for about $22.37. Change any input and every number updates.',
  appCategory: 'BusinessApplication',
  whatItMeans:
    "Total cost per good print is what one sellable print really costs you: filament, power and machine wear, the share of failed prints, your hands-on time, and packaging. Suggested price is the lowest price that still leaves your target margin after the marketplace takes its fees. Price below it and you're paying to make sales.",
  howToUse: [
    'Read filament used and print time from your slicer (Bambu Studio, PrusaSlicer, Cura and others all show both).',
    'Pick your state to load its average electricity price, or type your exact rate from your bill.',
    "Enter your printer's price and how many hours you expect it to last. Wear is spread across every print hour.",
    'Be honest about failures and hands-on time. Those two usually matter more than filament.',
    'Choose where you sell, set your margin, then use Download CSV to keep a pricing record.',
  ],
  faqs: [
    { q: 'How do you calculate the cost of a 3D print?', a: 'Add filament (grams used ÷ spool grams × spool price), electricity (kW × hours × rate), machine wear (hours × printer price ÷ lifetime hours), a failed-print allowance, your hands-on time and packaging. The calculator above does it for you and shows each part.' },
    { q: 'What is a good price to charge for 3D printing?', a: 'Start from your full cost per good print, then add a margin that pays for design time, returns and growth. Your niche, quality and competition decide what buyers accept. Set the margin field and the calculator works backwards to the price that keeps that margin after fees.' },
    { q: 'How much do 3D printer materials cost per print?', a: 'Divide the grams your slicer reports by the spool weight and multiply by the spool price. With a $22, 1 kg spool, a 120 g print uses $2.64 of filament. Material is often a smaller share of the cost than your time and failed prints.' },
    { q: 'Is there a 3D print cost calculator for Excel or Google Sheets?', a: 'Use Download CSV above. The file opens in Excel or Google Sheets with every input and result, so you can keep a pricing log for each product.' },
    { q: 'How do I calculate the electricity cost of my 3D printer?', a: 'Multiply average watts by print hours and divide by 1,000 to get kWh, then multiply by your rate. For example, 120 W × 10 h = 1.2 kWh × $0.1831 = about $0.22. Pick your state above to use its official EIA average.' },
    { q: 'Can I legally sell 3D prints?', a: "It depends on the design. Prints of your own designs are generally yours to sell. Many downloadable models carry licences (for example, non-commercial Creative Commons) that forbid selling, and trademarked or patented items carry extra risk. Check each model's licence. This isn't legal advice." },
  ],
  sources: [
    {
      title: 'Electric Power Monthly, Table 5.6.A: Average Price of Electricity to Ultimate Customers by End-Use Sector, by State',
      url: 'https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_6_a',
      publisher: 'U.S. Energy Information Administration',
      accessed: '2026-10-04',
    },
    {
      title: 'Selling fees',
      url: 'https://www.ebay.com/help/selling/fees-credits-invoices/selling-fees?id=4822',
      publisher: 'eBay',
      accessed: '2026-10-11',
    },
    {
      title: 'FAQ: Frequently Asked Questions (average power consumption)',
      url: 'https://help.prusa3d.com/article/_1932',
      publisher: 'Prusa Research Knowledge Base',
      accessed: '2026-10-11',
    },
  ],
  pendingVerification: [
    'Etsy US fee preset (6.5% + 3% + $0.25 + $0.20): etsy.com/legal/fees blocks automated readers (bot check, 2026-10-11); the owner must confirm it in a browser and add it as a source',
    'Filament densities: PLA 1.24 and PETG 1.27 g/cm³ match Prusament data sheets per search summaries (not yet read first-hand); ABS 1.04, ASA 1.07, TPU 1.21 and nylon 1.14 still need a manufacturer data sheet',
  ],
  related: ['/finance/percent-off-calculator/', '/everyday-life/electricity-cost-calculator/'],
  disclaimer: 'This is an estimate to help you price, not financial or tax advice.',
  published: '2026-10-11',
  updated: '2026-10-11',
  batch: 1,
};

export default tool;
