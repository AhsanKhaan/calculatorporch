# 03: Page briefs for batch 1 (build specs)

Each brief gives the calculator's **inputs, defaults, formulas, outputs**, its **original data table**, **FAQ seeds**, **disclaimers** and the **sources to cite**.

**Rules for every brief:**
- **[U, verify]** marks constants and ranges that must be checked against the named source **before publishing**, then cited on the page and in `/methodology/` (playbook §2A).
- **Formulas live as pure functions** in `lib/calculators/<slug>.ts`, each with unit tests built from hand-worked or cited cases.
- **US defaults** (imperial, USD), with a global metric toggle.
- **The result renders server-side** with the default inputs.
- **No URL rewriting while typing**; sharing works through a "Copy link" button.

---

## 1. Puppy weight calculator: `/pets/puppy-weight-calculator/`
**Job:** "How big will my puppy get, and how much of that is already done?"

- **Inputs:**
  - current weight (lb / kg);
  - age (weeks, 4–52; months accepted);
  - expected adult size class: toy < 12 lb · small 12–25 · medium 25–50 · large 50–100 · giant > 100 [U];
  - optional: breed picker (later), sex.
- **Defaults:** 20 lb, 12 weeks, medium.

**Method (preferred):**
- Adult weight = current weight ÷ (expected fraction of adult weight at this age, for this size class).
- The fractions come from a **published canine growth standard**. Candidate: *Salt C. et al., "Growth standard charts for monitoring bodyweight in dogs of different sizes", PLOS ONE 2017;12(9):e0182064* (open access) [U, verify the citation and extract the median curves].
- Store the curves as `data/puppy-growth.json` (age in weeks → fraction, per size class), with the citation in the file.

**Fallback (only if the curves can't be extracted):** the common "weekly" heuristic, adult ≈ current weight ÷ age in weeks × 52, for toy, small and medium dogs only. Label it as a rough rule [U].

**Outputs:**
- estimated adult weight as a **range** (±10–15% band [P]);
- % of adult weight reached;
- age when growth typically levels off for the size class [U, from the source];
- a projected growth table every 4 weeks.

- **Original data table:** "% of adult weight by age" for the 5 size classes, plus worked examples (a 10 lb puppy at 10 weeks in each class).
- **FAQ seeds:**
  - How accurate is a puppy weight calculator?
  - When do puppies reach full size?
  - Do paw size or parents predict adult size?
  - Mixed-breed puppies: which size class?
  - Why is my puppy above or below the curve?
  - Kilograms or pounds?
- **Disclaimer:** "An estimate from population growth data, not veterinary advice. Ask your vet about your puppy's growth and body condition." No feeding or dosage advice.
- **E-E-A-T:** cite the growth standard plus 1–2 veterinary sources. **No "Reviewed by" without a real vet's written agreement.**
- **On-page sections (Semrush cluster [M39][M43]):** "Puppy growth chart" · "When do puppies stop growing?" · "How to weigh a puppy". The page's secondary-keyword cluster is ≈ 62K/mo. **Guide:** `dog-breed-weight-chart/` (≈ 5.3K/mo; cite breed standards). **Deferred:** puppy feeding (≈ 9.4K/mo); needs a vet reviewer.

## 2. Dog pregnancy calculator: `/pets/dog-pregnancy-calculator/`
**Job:** "When are the puppies due, and what happens each week?"

- **Inputs:**
  - mating (breeding) date, with an optional second mating date;
  - optional advanced mode with an **ovulation date** or **LH-surge date** (from progesterone testing).
- **Defaults:** today − 21 days.

**Formulas (verified 2026-10-11; sources in `content/calculators/dog-pregnancy-calculator.ts`):**
- From mating: due ≈ mating + **63 days**, normal window **56–68 days** after a single mating [M: Concannon 2000, IVIS]. With two matings, the window runs from the first mating + 56 to the last mating + 68. The MSD/Merck Veterinary Manual gives a wider 58–72 days from the first accepted breeding [M]; this is shown as a note on the page.
- From ovulation: 63 days, window 62–64 [M: Concannon 2000].
- From LH surge: 65 days, window 64–66 [M: MSD Veterinary Manual, Jun 2025; Concannon 2000].
- Overall: "about 62 to 64 days" [M: MSD Veterinary Manual, dog owners version].

**Outputs:**
- due date;
- whelping window;
- countdown;
- **week-by-week timeline (weeks 1–9)** with milestones:
  - implantation, about days 20–21 from mating (day 22–23 after the LH surge) [M: Concannon 2000];
  - ultrasound confirms pregnancy reliably by days 25–35 [M: MSD Veterinary Manual];
  - X-ray shows the puppies from about day 45, best for counting after day 55 [M: MSD Veterinary Manual];
  - start temperature checks twice a day about day 58;
  - temperature drop (mean 98.8°F / 37.1°C, range 98.1–100°F) usually 8–24 h before whelping [M: MSD Veterinary Manual];
- downloadable .ics calendar of key dates (client-side).

- **Original data table:** a day-by-day milestone table, plus "due date from mating date" examples.
- **FAQ seeds:**
  - How long are dogs pregnant?
  - Can a dog give birth at 58 days?
  - How accurate is a due date from the mating date?
  - When can a vet confirm pregnancy?
  - What are the signs labor is starting?
  - Two matings: which date counts?
- **Disclaimer:** "Educational estimate, not veterinary advice. Contact your vet for prenatal care and immediately if labor problems occur."
- **Guides** (docs/02 §2): **launch** `how-long-are-dogs-pregnant/` (≈ 54K/mo; week-by-week + labor signs) · **queue** `dog-pregnancy-test/` (≈ 22K, KD 8) and `signs-of-pregnancy-in-dogs/` (≈ 35K). **Never** cover termination; false pregnancy waits for a vet reviewer.

## 3. Candle wax calculator: `/crafts/candle-wax-calculator/`
**Job:** "How much wax and fragrance do I need for these jars?"

- **Inputs:**
  - container: **water capacity** (fl oz / ml), or dimensions (cylinder: inner diameter × fill height; rectangle: L × W × fill height);
  - number of candles;
  - wax type: soy · paraffin · coconut blend · beeswax · parasoy;
  - fragrance load % (default 8%; allowed range 0–12%, capped by the wax's stated maximum);
  - optional: wax price per lb, fragrance price per oz.
- **Formulas:**
  - fill volume (ml) = capacity, or π·r²·h (cm³);
  - wax weight (g) = fill volume (ml) × wax density (g/ml);
  - fragrance oil (g) = wax weight × FO%;
  - total pour weight = wax + FO.
  - **State the convention on the page:** FO% is measured against wax weight. Also show the "percent of total" equivalent.
- **Densities and rules [U, verify with supplier data sheets (e.g. CandleScience, Golden Brands) and cite them]:**
  - soy about 0.86–0.90 g/ml, paraffin about 0.88–0.92, coconut blends about 0.88, beeswax about 0.96;
  - common supplier rule: wax oz ≈ water fl oz × 0.86 (soy).
- **Outputs:**
  - wax per candle and per batch (oz / lb / g);
  - fragrance oil amount;
  - total weight;
  - cost per candle (if prices are given);
  - a warning when FO% exceeds the selected wax's max [U].
- **Original data table:** wax and FO for common jar sizes (4, 6, 8, 10, 12, 16 fl oz) × wax type, all computed.
- **FAQ seeds:**
  - How much wax for an 8 oz candle?
  - What fragrance load should I use?
  - Is fragrance load measured by weight or volume?
  - Soy vs paraffin: does the amount differ?
  - How much wax for 10 candles?
  - Why do my candles sink after pouring?
- **Disclaimer:** follow the supplier's max fragrance load and flash-point guidance; never leave a burning candle unattended.
- **On-page sections:** fragrance load chart · soy vs paraffin · candle jar sizes · FAQ "how much fragrance oil per pound of wax". **Guides [M43]:** `what-is-candle-wax-made-of/` (≈ 4.0K/mo, KD 17) · `how-to-dye-candle-wax/` (≈ 1.6K, KD 10) · `best-wax-for-candles/` (≈ 770, KD 17; affiliate).
- **Add-on later:** candle fragrance calculator.

## 4. Pizza dough calculator: `/kitchen/pizza-dough-calculator/`
**Job:** "Exact grams for N pizzas in my style."

- **Inputs:**
  - style preset: Neapolitan · New York · Detroit (pan) · Thin/Bar · Custom;
  - number of dough balls;
  - ball weight (g), or pizza diameter + thickness factor;
  - hydration %, salt %, yeast type (IDY / ADY / fresh / sourdough starter) and %;
  - oil %, sugar %;
  - optional: residue/waste allowance % (default 2%).

**Formulas (baker's percentages; exact maths):**
- total dough = balls × ball weight × (1 + waste);
- flour = total ÷ (1 + h + s + y + o + su), where every percentage is relative to flour;
- water = flour × h, salt = flour × s, and so on.
- **Yeast conversion [U, verify, e.g. King Arthur guidance]:** ADY ≈ IDY × 1.25; fresh ≈ IDY × 3.
- **Ball weight from size (optional):** weight (oz) = π·r² (in²) × thickness factor (oz/in²). NY TF about 0.085–0.10 [U].

**Style presets [U, verify and cite, e.g. AVPN rules for Neapolitan]:**

| Style | Hydration | Salt | Yeast (IDY) | Oil | Sugar | Ball weight |
|---|---|---|---|---|---|---|
| Neapolitan | about 60% | about 2.8% | about 0.2% | 0% | 0% | 250–280 g |
| New York | about 62% | about 2% | about 0.4% | about 2% | about 1% | 450–550 g for 16–18" |
| Detroit | about 70% | about 2% | about 0.5% | — | — | by pan size |

- **Outputs:**
  - ingredient table per ball and per batch (g and oz);
  - total flour in cups (approximate, flagged);
  - a printable recipe card.
- **Original data table:** grams for 2 / 4 / 6 balls per style (computed), plus a hydration-vs-texture chart.
- **FAQ seeds:**
  - What hydration is best for pizza dough?
  - What is baker's percentage?
  - How much dough for a 12" or 16" pizza?
  - Can I use active dry instead of instant yeast?
  - Why weigh instead of using cups?
  - How long should pizza dough ferment?
- **On-page sections:** "Pizza dough hydration" (480/mo; clusters with the calculator [M39]) · "What is baker's percentage?" · style presets table · ingredients FAQ. **Guides:** `neapolitan-pizza-dough-recipe/` (6,600 / KD 33) · `new-york-style-pizza-dough-recipe/` (≈ 520 / KD ~20) [M42][M43]. Recipe SERPs need `Recipe` schema **and your own photos**.

## 5. Bowling score calculator: `/fitness/bowling-score-calculator/`
**Job:** "Score my game frame by frame (and learn the rules)."

- **Inputs:** a 10-frame scorecard.
  - Each frame takes roll 1 and roll 2; the 10th frame allows a 3rd roll after a strike or spare.
  - Pin keypad buttons 0–9, plus **X** (strike) and **/** (spare).
  - Optional mode: enter a single total per frame.
- **Rules (standard ten-pin; deterministic) [verify wording against USBC rules]:**
  - strike = 10 + the next two rolls;
  - spare = 10 + the next roll;
  - open frame = pins knocked down;
  - the 10th frame earns bonus rolls only for a strike or spare;
  - validation: two rolls in frames 1–9 can't exceed 10 pins;
  - maximum score 300.
- **Outputs:**
  - running total per frame;
  - final score;
  - **maximum still possible** from the current state;
  - counts of strikes, spares, opens and splits (optional input);
  - shareable scorecard image (client-side canvas, later).
- **Original data table:** example games (all strikes = 300; alternating strike/spare = 200; all 9-spares with 9 fills = 190; all 9-0 = 90), computed by the same function as the tests.
- **FAQ seeds:**
  - How do you score a strike?
  - How does the 10th frame work?
  - What's a good bowling score?
  - What is a perfect game?
  - How is a split scored?
  - How do I calculate my bowling average?
- **On-page section:** "How to calculate a bowling average". **Guides:** **launch** `how-to-score-bowling/` (≈ 6.1K/mo; "how to keep score in bowling" 1,300 / KD 11) · **queue** `perfect-game-bowling/` (2,400 / 21).

## 6. Gravel calculator: `/diy/gravel-calculator/`
**Job:** "How many cubic yards, tons or bags of gravel do I need, and what will it cost?"

- **Inputs:**
  - shape: rectangle · circle · triangle · multiple areas;
  - dimensions (ft/in or m);
  - depth (in / cm; default 3 in);
  - gravel type, which sets density;
  - price per ton or per cubic yard, or bag size (0.5 ft³ default) and bag price;
  - waste/compaction allowance % (default 10% [P]).
- **Formulas:**
  - volume (ft³) = area (ft²) × depth (in) ÷ 12;
  - cubic yards = ft³ ÷ 27;
  - tons = yd³ × density (tons/yd³);
  - bags = ft³ ÷ bag ft³;
  - all multiplied by (1 + allowance).
- **Densities [U, verify with supplier or DOT data and cite]:**
  - typical gravel about 1.35–1.7 tons/yd³ (about 2,700–3,400 lb/yd³);
  - give separate rows for pea gravel, #57 crushed stone, river rock, decomposed granite, and crusher run (road base).
- **Outputs:** yd³, tons, bags, cost, plus the formula shown with the user's own numbers ("figuring gravel" walkthrough).
- **Original data table:** tons per 100 ft² at 2 / 3 / 4 / 6 in for each gravel type (computed).
- **FAQ seeds:**
  - How much gravel do I need for a driveway?
  - How many tons in a cubic yard of gravel?
  - How deep should gravel be?
  - How much does a yard of gravel weigh?
  - How many bags make a yard?
  - Should I add extra for compaction?
- **On-page section:** "Driveway gravel depth". **Guides:** **launch** `how-much-does-gravel-cost/` (≈ 18.5K/mo, KD 9; sampled supplier prices with dates [U]) and `how-much-does-a-yard-of-gravel-weigh/` (1,900 / KD 3) · **queue** `how-to-build-a-gravel-driveway/` (≈ 12K), `types-of-gravel/` (≈ 34K), `best-gravel-for-driveway/` (SERP-check first).

## 7. Rafter calculator: `/diy/rafter-calculator/` (primary "rafter calculator" 5,400 / KD 10 [M44])
**Job:** "Exact common-rafter length and cut angles for my roof."

- **Inputs:**
  - building span (outside wall to outside wall), or run;
  - roof pitch (rise per 12 in, 1–24), or rise, or angle;
  - overhang (horizontal, inches);
  - ridge board thickness (default 1.5 in);
  - optional: rafter depth (for heel height / birdsmouth guidance).
- **Formulas (exact geometry):**
  - run = span ÷ 2 − ridge thickness ÷ 2;
  - slope factor = √(1 + (pitch/12)²);
  - rafter line length = run × slope factor;
  - overhang length = overhang run × slope factor;
  - total = line length + overhang length;
  - plumb-cut angle = atan(pitch/12);
  - seat-cut angle = 90° − plumb angle;
  - rise = run × pitch/12.
- **Outputs:**
  - lengths in ft-in to 1/16" (and mm);
  - angles;
  - **lumber length to buy** (next standard length: 8, 10, 12 … 20 ft);
  - total rise.
- **Original data table:** slope factor and angle for every pitch from 1/12 to 12/12 (computed), plus rafter length for common spans.
- **FAQ seeds:**
  - How do you calculate rafter length?
  - What is roof pitch (4/12, 6/12)?
  - How do you include the overhang?
  - What lumber length should I buy?
  - What is a birdsmouth cut?
  - What size rafters do I need for my span?
- **Disclaimer (structural):** "Geometry only. Rafter size, spacing and span must meet your local building code (e.g. IRC span tables) or an engineer's design."
- **On-page section:** "How to calculate rafter length" (formula + worked example). **Guides:** **launch** `rafter-span-table/` (≈ 13.7K/mo, KD 11, CPC ~$3.8; cite and link IRC/AWC tables, never reproduce them in full [U]) and `roof-pitch-chart/` (2,900 / KD 4) · **queue** `truss-vs-rafter/` (≈ 7.4K, KD 10), `rafter-spacing/` (≈ 5K, KD 8), `how-to-cut-a-birdsmouth/` (≈ 7K, KD 22). **Never invent span values.**

## 8. 3D printing cost calculator: `/hobby-tech/3d-printing-cost-calculator/` (port)
- **Port (done 2026-10-10):** the static probe's `calc3d.js` → `lib/calculators/3d-printing-cost.ts` (maths identical); its 7 tests → `tests/calculators/3d-printing-cost.test.ts` (all green).
- **Inputs:**
  - material (PLA / PETG / ABS / ASA / TPU / Nylon, with densities);
  - grams, spool price and spool grams;
  - print hours and printer watts;
  - **electricity rate by US state** (`electricity-us.json`, EIA July 2026; US average 18.31¢/kWh [M]);
  - printer price, lifetime hours, maintenance per hour;
  - labor minutes and rate;
  - extras;
  - failure rate %, margin %;
  - marketplace fee preset (Etsy / eBay / custom; fee values [U, verify current fee pages]).
- **Defaults → outputs (tested):** material $2.64, electricity $0.13, machine $1.14, failure allowance $0.43, labor $5.00, extras $1.50, **total $10.85, price $22.37**, fees $2.58, profit $8.95 [M, unit tests].
- **Content to reuse:** `docs/reference/static-3d/3d-print-cost-calculator.html` (formula, worked example, EIA table, 6 FAQs) and `methodology.html`.
- **On-page section:** "3D printing cost spreadsheet" (CSV export). **Guides [M43]:** `how-much-does-3d-printing-cost/` (≈ 7.2K/mo, KD 19; include service and prototype costs plus "how much to charge") · `how-much-does-a-3d-printer-cost/` (≈ 19K/mo, KD 22; affiliate) · `3d-printer-electricity-cost/` (EIA data).
- **Add-ons later:** filament calculator, 3D print time calculator.

## 9. Board foot calculator (batch 2): `/diy/board-foot-calculator/`
- **Formula:** board feet = thickness (in) × width (in) × length (in) ÷ 144 (equivalently T × W × L(ft) ÷ 12). Support a cut list (multiple rows), quantity, and price per board foot.
- **Note:** softwood dimension lumber is usually priced on **nominal** sizes; hardwood on actual rough thickness in quarters (4/4 = 1"). Explain this and let the user choose [U, verify with a lumber-grading reference].
- **Original data table:** board feet for common nominal sizes (2×4, 2×6, 1×6 … at 8–16 ft).

---

## Batch 2 briefs
- **ABV calculator** (`/kitchen/abv-calculator/`):
  - **Homebrew mode:** OG and FG → ABV = (OG − FG) × 131.25. Offer a high-gravity alternative formula [U, verify against a brewing reference]. Add an attenuation % output.
  - **Cocktail mode:** each ingredient's volume × ABV → total ABV after dilution. Dilution % is a stated assumption [U].
  - **Disclaimer:** an estimate; drink responsibly; no health claims. Check AdSense publisher restrictions for alcohol content first [U].
  - **Add-on:** priming sugar calculator.
- **Fabric yardage calculator:**
  - **Inputs:** piece width and length, quantity, fabric width (42–60"), pattern repeat, shrinkage %.
  - **Maths:** pieces per row = ⌊fabric width ÷ piece width⌋; rows = ⌈qty ÷ per row⌉; length = rows × (piece length + repeat allowance); yards = length ÷ 36 × (1 + shrinkage).
  - **Outputs:** yards, rounded up to ⅛ yd, plus a cutting layout.
- **Bike gear ratio calculator:**
  - **Maths:** ratio = chainring teeth ÷ cog teeth; gear inches = ratio × wheel diameter (in); development (m) = ratio × wheel circumference (m); speed = development × cadence × 60 ÷ 1000 (km/h, plus mph).
  - **Outputs:** a gear table for the whole cassette.
- **Electricity cost calculator:**
  - **Maths:** kWh = watts × hours ÷ 1000; cost = kWh × rate.
  - **Rate:** a US state picker using `electricity-us.json` (EIA). Cross-link the 3D running-cost guide.
- **Square footage:**
  - **Inputs:** multiple shapes and a room list, in ft/in or m.
  - **Sections:** answer-first "How to calculate square feet" (length × width; its #1 result is a calculator [M42]).
- **Seating chart maker:** drag-and-drop table layout, guest-list CSV import, round and rectangular tables, export to PDF or PNG. All client-side; no accounts.
- **Concrete slab cost:** yd³ × price/yd³ + delivery and short-load fees + labor/ft² + rebar or mesh; bag option (60 or 80 lb). Prices are regional; cite the source and date [U].
- **Board foot:** see §9.
- **Add-ons (candle fragrance · filament · 3D print time · priming sugar):** reuse their parent's data and functions.
