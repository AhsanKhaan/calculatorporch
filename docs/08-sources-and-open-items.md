# 08: Sources, data caveats and open items

## 1. Source index (full detail in `research/sources.md`)
| Code | What | Where (in `research/`) |
|---|---|---|
| M16 | Keyword Planner US, 58 reference keywords (2026-10-02) | idea3/kp-screen.md |
| M17 | Live Google checks, 15 queries (2026-10-02) | idea3/shortlist.md |
| M19 | Firecrawl search US, 10 queries (proxy for Google's top 10) | calc-site/serp-screen-batch0.md |
| M20 | Firecrawl search, R1 sequential (10 of 48 done, then 429) | calc-site/serp-screen-r1.md |
| M21 | Firecrawl map: calculator.net and Omni inventories | calc-site/competitors.md, omni-en-slugs.txt |
| M22 | Firecrawl scrape: 4 giant pages (teardown) | calc-site/competitors.md |
| M23 | Ahrefs time-to-rank studies (via search snippets) | — |
| M24 | AdSense RPM range (low credibility) | — |
| M25 | Keyword Planner US, 38 gap candidates | calc-site/kp-gap.md |
| M26 | Live Google US in Chrome: extension KD, DA/PA, AI Overview, top 10 (21 keywords) | calc-site/r3-serp-measure.md |
| M27 | Ubersuggest: 1 free search (brine) | — |
| M28 | Semrush bulk Keyword Overview, 88 keywords | calc-site/semrush/bulk-overview.csv |
| M29 | Semrush Organic Research: calculator.net, KD ≤ 29 | calc-site/semrush/organic-calculatornet.csv, gap-calculatornet.md |
| M30 | Semrush Backlinks: calculator.net vs Omni | calc-site/semrush/backlinks-calculatornet-vs-omni.pdf |
| M31 | Semrush SERP: bowling score calculator | calc-site/semrush/serp-bowling-score-calculator.csv |
| M32 | Semrush Keyword Overview + SERP: dog pregnancy calculator | calc-site/semrush/kw-overview-dog-pregnancy-calculator.pdf |
| M33 | Semrush SERP: concrete slab cost calculator | calc-site/semrush/serp-concrete-slab-cost-calculator.csv |
| M34 | Semrush Keyword Overview: 3D printer cost calculator | calc-site/semrush/kw-overview-3d-printer-cost-calculator.pdf |
| M35 | Semrush SERP: square footage calculator | calc-site/semrush/serp-square-footage-calculator.xlsx |
| M36 | Semrush Keyword Overview: final grade calculator | calc-site/semrush/kw-overview-final-grade-calculator.pdf |
| M37 | Semrush SERP: final grade calculator | calc-site/semrush/serp-final-grade-calculator.xlsx |
| M38 | Semrush bulk Keyword Overview, Task A (51 keywords) | calc-site/semrush/A_bulk-overview_51.csv |
| M44 | Semrush Task C (how to score bowling) + Task D seeds dog pregnancy, how to score bowling, gravel, rafter | calc-site/semrush/C/, calc-site/semrush/D/, calc-site/task-cd-analysis.md §Part 2 |
| M43 | Semrush Keyword Magic Tool, Task D: 4 of 8 seeds (all + questions) | calc-site/semrush/D/, calc-site/task-cd-analysis.md |
| M42 | Semrush SERP Analysis, Task C: 8 keywords (Page AS) | calc-site/semrush/C/, calc-site/task-cd-analysis.md |
| M41 | Semrush Domain Overview screenshot: 3dprintingcostcalculator.com (organic traffic, keywords, AI visibility, 2-year trend) | calc-site/semrush/overview-3dprintingcostcalculator.png |
| M40 | Semrush Backlinks Bulk Analysis, Task B (28 domains) | calc-site/semrush/B_bulk-backlinks_28.csv |
| M39 | Semrush keyword clusters (6 screenshots: same-SERP keyword groups + top-10 Domain AS) | calc-site/semrush/clusters/*.png |
| EIA | Electricity rates by state, July 2026 (public domain) | data/electricity-us.json |

## 2. Remaining data pulls (none block the build; step-by-step in docs/09)
| # (docs/09) | Pull | Why | Status |
|---|---|---|---|
| A | Bulk Keyword Overview, 51 keywords | Guide and on-page volumes; square footage head KD | ✅ **Done 2026-10-05** [M38]. 8 keywords returned no data ("refresh"); the rest are scored |
| B | Backlinks → Bulk Analysis, 28 small domains | Real Authority Score of the sites we displace | ✅ **Done 2026-10-05** [M40]: median AS 12; 21 of 26 small sites AS ≤ 30 (docs/06 §7) |
| C | SERP Analysis, 9 keywords | Decides KD 31–37 candidates and guide-vs-section | ✅ **Done 2026-10-06** (9 of 9) [M42][M44] |
| D | Keyword Magic Tool, 8 seeds (all + questions) | Guide topics and FAQ questions | ✅ **Done 2026-10-06** (8 of 8) [M43][M44] |
| E–G | Organic Research (Omni, Inch, CalculatorSoup), small-site pages, Keyword Gap | Future categories | Optional |
| H | Keyword Planner monthly data | Seasonality | Optional |

After each pull, add the new export to `BULK` (or SERP rows to `SERP`) in `research/calc-site/score.mjs`, re-run it, and update docs/02.

## 3. Verify before publishing (the [U] list)
**Calculator constants (docs/03):**
- puppy growth curves (Salt et al. 2017; confirm the citation and extract the medians);
- dog gestation numbers and milestones (veterinary reproduction reference);
- wax densities and the 0.86 rule (supplier data sheets);
- max fragrance loads per wax;
- yeast conversion factors;
- pizza style presets (AVPN for Neapolitan);
- thickness factors;
- gravel densities by type (supplier or DOT);
- lumber nominal vs actual and grading notes;
- IRC rafter span tables (cite; never invent);
- marketplace fee presets in the 3D tool (current Etsy and eBay fee pages);
- USBC bowling scoring wording.

**Platform and policy:**
- Vercel Hobby non-commercial terms and current Vercel/Cloudflare pricing;
- FAQ rich results discontinued 2026-05-07;
- Back-button hijacking enforcement date;
- OAI-SearchBot and ChatGPT search's use of Bing;
- AdSense requirements and Pakistan payout method;
- the CMP requirement for EEA/UK;
- each affiliate programme's acceptance of Pakistan payees (Amazon Associates especially).

**Estimates:** CTR-by-position assumptions and page RPM. Replace them with GSC and AdSense data after launch.

## 4. Data caveats (read before trusting a number)
- **Semrush PKD %** (personal difficulty) is ignored: with no domain set it reads 89–100 for everything. **KD % is the difficulty metric used.**
- **Authority metrics differ in scale:** Semrush AS (calculator.net 90) vs the extension's Moz-style DA (calculator.net 74). Compare within one metric only.
- **Search volumes differ by tool:** Semrush (exact) ≈ Keyword Planner bands, while the Chrome extension's volumes run much higher (e.g. pizza dough 165K ext vs 2.4K Semrush). **Semrush/KP are used.**
- **CPC:** Semrush CPC is lower than Keyword Planner's top-of-page bid high. Scoring uses Semrush CPC for consistency.
- **Firecrawl search ≠ Google:** batch-0 and R1 reads are proxies without AI Overview data. Live Google and Semrush SERP data override them.
- **Vantage:** live Google checks ran from a Pakistan IP with `gl=us&hl=en&pws=0`, a partial stand-in for a US user.
- **Blocked or partial sources:**
  - the extension masked KD after about 10 lookups a day;
  - the DA/PA box stopped rendering mid-pass;
  - Ahrefs DR/UR on SERPs needs the paid plan;
  - the Firecrawl search rate limit was about 5 a minute;
  - the PSI keyless quota was exhausted.

  All of this is logged; nothing was worked around.
- **"Monthly Visits" in Backlinks Bulk Analysis** are all-channel Traffic Analytics estimates and can be ~50× higher than organic for small sites (3dprintingcostcalculator.com: 83.2K vs 1.6K organic [M40][M41]). Use Domain Overview organic traffic.
- **Inferred keywords:** two Semrush SERP files had no keyword field (concrete slab cost [M33], square footage [M35]). The keyword was inferred from the results.

## 5. Research changelog
| Date | Change |
|---|---|
| 2026-10-02 | 58-keyword Keyword Planner screen; 15 live SERPs; vendor-owned pattern found |
| 2026-10-04 | Maker niche picks; 3D print cost probe tool built and tested (static) |
| 2026-10-05 (late) | Task A (51 keywords) + Semrush clusters: square footage → batch 2 #1; roofing calculator found ($6.27 CPC); puppy, pizza and board-feet guide keywords moved on-page; one dog-pregnancy guide (34.7K/mo); AdSense rule added to scoring |
| 2026-10-05 | Plan approved (broad brand, Next.js). Competitor teardown, gap screen, live Google measurements. Semrush data: 88-keyword bulk, calculator.net organic, backlinks, 5 SERP/overview reports. Tier 1 finalized (9 pages); this `finalized/` pack created |
