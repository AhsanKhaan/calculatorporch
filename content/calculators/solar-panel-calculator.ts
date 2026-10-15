import type { ToolInput } from '../schema';

/** Solar panel calculator (energy category, added 2026-10-16 on owner request; research/solar/ in the research pack). */
const tool: ToolInput = {
  url: '/energy/solar-panel-calculator/',
  calculator: 'solar-panel',
  name: 'Solar Panel Calculator',
  title: 'Solar Panel Calculator: System Size, Panels and Savings',
  description: 'Solar panel calculator: the system size and number of panels you need from your monthly kWh, with NASA sun hours for every US state and Pakistani city.',
  h1: 'Solar Panel Calculator',
  directAnswer:
    'A home using 900 kWh a month needs about a 7.8 kW solar system: 20 panels of 400 watts (8.00 kW) at the US average of 4.73 peak sun hours. That makes about 11,049 kWh a year and saves about $1,977 at the average US electricity price. Pick your state or Pakistani city to recalculate.',
  appCategory: 'UtilitiesApplication',
  whatItMeans:
    "System size is the total rated power of the panels, in kW, that makes the electricity you want to cover over a year, given your location's sunshine and normal losses. It's rounded up to whole panels. Output and savings are yearly averages: summer months make more and winter months less, and the weakest month shows how deep that dip goes.",
  howToUse: [
    'Step 1, Location: pick your US state or Pakistani city to load NASA sun hours, or choose "Somewhere else" and type them from a solar map.',
    'Step 2, Electricity use: enter your monthly bill, the units (kWh) on it, or pick your appliances with the + and − buttons and set their hours a day.',
    "Step 3, Panels & roof: set your panel's watt rating and, if you like, your clear roof area in square feet, square meters or marla to check the panels fit.",
    'Step 4, Savings: under net billing, set how much solar you use directly and the export credit, and add a real quote to see the payback time.',
    'The result updates at every step. Share the link or download the estimate as CSV when you are done.',
  ],
  faqs: [
    {
      q: 'How many solar panels do I need?',
      a: "Divide the kWh you use a day by peak sun hours × (1 − losses) to get kW, then divide by your panel's watts. A home using 900 kWh a month at the US average of 4.73 sun hours needs about 7.8 kW, which is 20 panels of 400 W. Sunny Arizona needs 15 for the same use; cloudier Washington needs 25.",
    },
    {
      q: 'How many kW of solar do I need for 1,000 kWh a month?',
      a: 'About 8.7 kW at the US average of 4.73 peak sun hours and 20% losses, which rounds up to 22 panels of 400 W (8.8 kW). In Lahore, with 5.12 sun hours, the same use needs about 8.0 kW, or 21 panels (8.4 kW).',
    },
    {
      q: 'How many units does a 1 kW solar system produce in Pakistan?',
      a: "About 118 to 161 units (kWh) a month on average, depending on the city. With NASA's sun hours and 20% losses, 1 kW makes about 125 units a month in Lahore, 139 in Karachi and 161 in Quetta. Winter makes less: Lahore's January sun is about a quarter below its yearly average.",
    },
    {
      q: 'What are peak sun hours?',
      a: "Peak sun hours are the hours of full-strength sunlight (1,000 watts per square meter) that would deliver the same energy as a whole day's real, weaker sun. They aren't hours of daylight. Across our 51 US cities they range from 2.92 a day in Anchorage to 6.45 in Phoenix.",
    },
    {
      q: 'How much roof space do solar panels need?',
      a: "About 4.8 m² (51 sq ft) per kW of panels at 21% efficiency, before gaps for walkways, edges and shade. The 8 kW example needs about 38 m² (410 sq ft) of panel. Check your panel's spec sheet: higher efficiency means less area for the same power.",
    },
    {
      q: 'How long do solar panels take to pay for themselves?',
      a: "Divide the installed cost by the yearly savings. A $20,000 quote for a system that saves $1,977 a year pays back in about 10 years, before tax credits, financing or maintenance. Enter your own quote above: we don't publish price lists, because installed prices vary widely and change often.",
    },
    {
      q: 'How do I size solar panels from my appliances?',
      a: 'Add up watts × hours a day for everything you run and divide by 1,000 for kWh a day, then size as usual. Our default list (lights, four ceiling fans, a fridge, TV, computer, router, washing machine, iron and a 1 hp pump) comes to about 259 kWh a month, which needs about 2.1 kW in Lahore. One 1.5-ton inverter AC running 8 hours a day adds about 292 kWh a month.',
    },
    {
      q: 'Does net billing change how much solar saves?',
      a: 'Yes. With net metering, each kWh you export offsets one you buy later. With net billing, exports earn a lower credit than you pay for imports, so solar you use as it is made is worth more. Pakistan moved new rooftop connections to net billing in 2026; set the share you use directly and your export credit to model it.',
    },
  ],
  sources: [
    {
      title: 'POWER Climatology API (Prediction Of Worldwide Energy Resources)',
      url: 'https://power.larc.nasa.gov/docs/services/api/temporal/climatology/',
      publisher: 'NASA Langley Research Center',
      accessed: '2026-10-16',
    },
    {
      title: 'Electric Power Monthly, Table 5.6.A: Average Price of Electricity to Ultimate Customers by End-Use Sector, by State',
      url: 'https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_6_a',
      publisher: 'U.S. Energy Information Administration',
      accessed: '2026-10-04',
    },
    {
      title: 'No more net metering as govt shifts to net billing',
      url: 'https://www.geo.tv/latest/650018-no-more-net-metering-as-govt-shifts-to-net-billing',
      publisher: 'Geo News',
      accessed: '2026-10-16',
    },
  ],
  pendingVerification: [
    "PVWatts defaults (14% system losses, 96% inverter efficiency): confirm in NREL's PVWatts Version 5 Manual (NREL/TP-6A20-62641) and cite it; nrel.gov did not resolve from the build machine on 2026-10-16, so only secondary sources were read",
    "Pakistan net billing (2026): replace the news source with NEPRA's notified Prosumer Regulations 2026, and check whether the amendment proposed in February 2026 changed the export terms",
    'Panel ageing of "around half a percent a year": cite a degradation study (for example NREL\'s photovoltaic degradation rates review)',
    '21% default panel efficiency: confirm against current residential panel spec sheets',
    'Appliance wattages in the picker (typical running watts, average draw for fridge, freezer and inverter ACs): check each against manufacturer spec sheets or a current DOE or NEECA source',
    'Pakistan starting price of Rs 50 per unit: replace the Geo News figure with a NEPRA tariff schedule plus taxes from a sample bill',
    'Marla sizes (225 sq ft urban schemes, 272.25 sq ft revenue measure): cite a Pakistani land-measurement source',
  ],
  related: ['/energy/electricity-cost-calculator/', '/energy/battery-bank-calculator/', '/construction/square-footage-calculator/'],
  disclaimer: "A planning estimate, not an installer's design, a quote or financial advice. Shade, roof direction and local rules change real output and savings.",
  published: '2026-10-16',
  updated: '2026-10-16',
  batch: 2,
};

export default tool;
