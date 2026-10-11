# 07: Rollout, gates and estimates

## 1. Phases (v2, 2026-10-11; architecture in docs/10)
| Phase | When | Work | Exit criteria |
|---|---|---|---|
| **0. Decide** | Done | Domain (calculatorporch.com), hosting (Cloudflare Pages), author, positioning (production calculator.net/Omni-style), wave-1 scope | ✅ |
| **1. Docs** | Done 2026-10-11 | Keyword clustering (docs/11 + `content/keyword-map.json`), architecture & pSEO spec (docs/10), PRD v2 | ✅ |
| **2. Platform** | Build week 1–2 | Taxonomy, routes (category / calculator / child / A–Z / author / editorial), config engine + Explainer, link graph, FAQ markup, llms.txt, cannibalization report, families framework, daily rebuild workflow. 3D cost re-expressed as a spec | `npm run verify` green; 7 ported tests green |
| **3. Batch A build** | Build weeks 2–4 | 20 highest-volume wave-1 tools + dog pregnancy + 3D cost; their launch guides; programmatic instances. Verify every [U] constant (`check:release`) | QA checklist (docs/05 §9) + `check:release` pass |
| **4. Publish batch A** | Launch day | Batch A + categories + A–Z + trust/author/editorial + llms.txt. Sitemap to GSC and Bing; IndexNow | Pages indexed (GSC URL Inspection) |
| **5. Batch B** | ~2–3 weeks after A | Remaining wave-1 tools + guides | Batch A indexed, no GSC errors |
| **6. Waves 2–3** | After the day-30 gate | docs/11 §2–3 in order, **≤ 10 new URLs a week**; programmatic instances only via the docs/10 §5 gate | Gates below |
| **7. AdSense check** | When the §0.2 gate is met (typically months 4–8) | Wave 1 live, consent banner, **4+ consecutive weeks of organic clicks**; every published page `adsense: green` | Apply once, carefully |

**Build effort [P, rough; a solo builder with AI assistance]:**
- platform (phase 2): 5–7 days;
- each engine calculator with tests and content: 0.5–1 day;
- each guide: 0.5–1 day.

Time your first 3 tools and re-plan from real numbers (playbook §5).

## 2. Kill / continue gates (playbook §12)
- **Day 30:** all published tools are indexed. If not, fix technical issues first; don't rewrite content.
- **Month 3:** impressions are appearing for the batch-1 keywords. If there are none, audit indexing and quality before adding tools.
- **Month 6:** some target queries rank ≤ 30 and the revenue floor is still plausible. **Continue**, or pivot categories on the same codebase.
- **Months 9–12:** clicks and revenue vs the floor decide continue or kill.
- **Generative-UI kill:** each quarter, check whether Google renders its own interactive calculator for most head terms in a category. If it does, stop building in that category.
- **Stop-loss:** going over the hours budget N weeks in a row triggers a review.
- **GSC review rules:**
  - use 3-month windows;
  - no per-page rewrite until the page has been indexed for 12+ weeks and the domain shows impressions elsewhere;
  - judge seasonal terms year-on-year.

## 3. How long until we rank? (evidence)
- Only **1.74%** of newly published pages reach Google's top 10 within a year (Ahrefs 2025), down from **5.7%** in 2017 [M23].
- Of the 2017 pages that did reach the top 10, most took **about 61–182 days** [M23, secondary summary].
- The average #1 page is about **5 years old** [M23, secondary summary].
- **Our edge:** we only target KD ≤ 30 keywords whose top 10 already contains sites with authority 2–30 [M26][M31][M32]. That's the profile where new pages do break in.

| Window | Expectation on Tier 1 pages [P] |
|---|---|
| Weeks 1–4 | Indexed; first impressions in GSC |
| Months 2–4 | Long-tails at positions 11–30; first clicks |
| Months 4–9 | Several Tier 1 heads reach the top 10 (bowling score, pizza dough, candle wax, rafter length are the likeliest), provided a few natural links arrive |
| Months 9–18 | Some top-3 spots; Tier 2 pages reach the top 10 |
| Not expected | calculator.net and Omni strongholds (concrete, tire size, pace, one rep max) |

**No one can promise exact dates or positions.** These are evidence-based expectations, not guarantees.

## 4. Traffic and AdSense estimate [P] (updated 2026-10-06; Tasks A–D complete)
- **Launch set** (8 tools + 10 launch guides, primary + on-page keywords) ≈ **314K US searches a month** [M38][M39][M43][M44]:
  - tools ≈ 181K, led by gravel ≈ 71.5K, puppy ≈ 62K and rafter ≈ 22.7K;
  - launch guides ≈ 133K, led by "how long are dogs pregnant" ≈ 53.8K, "how much does a 3D printer cost" ≈ 19K and gravel cost ≈ 18.5K.
- **Queued guides** add ≈ 167K over the following weeks. **Batch 2** adds ≈ 150K.
- **Assumptions:**
  - CTR by average position: #3 ≈ 10%, #5 ≈ 6%, #8 ≈ 2% [U];
  - long-tail ×1.2;
  - 1.3 pages per visit;
  - page RPM $5 [R, low credibility, M24].

| Launch set, average position at month 12 | Visits/mo | AdSense/mo |
|---|---|---|
| #8 | about 7,500 | about **$49** |
| #5 | about 22,600 | about **$147** |
| #3 | about 37,700 | about **$245** |

- **Caveats:**
  - Most guide demand is answer-type ("how long are dogs pregnant", "what is gravel"), where AI Overviews cut clicks, so real guide CTR may be far lower.
  - Low-CPC guides earn a lower RPM.
  - The real-world check: one single-tool competitor (AS 12) gets ≈ **1.6K organic visits/mo** [M41]. Treat the guide share as the optimistic part.
- **Affiliates** (3D printers and filament, candle supplies, pizza steels and ovens, bowling gear) are extra and not modelled.
- AdSense starts only after the §0.2 gate (months 4–8 at the earliest). **Revenue depends on where visitors are, not where you live.**
- Replace every assumption with GSC CTR and real RPM after launch. Re-run monthly.

## 4b. 12-month traffic projection and the "1M visits" question [P] (2026-10-06)
**Model:** visits = Σ over pages of (mature visits per page × ramp by page age).
- **Ramp** by months since publishing: 5%, 12%, 25%, 40%, 55%, 70%, 80%, 90%, then 100%. This is based on Ahrefs: pages that do rank usually take about 2–6 months [M23].
- **Calibration:** the best single-tool competitor (AS 12) gets ≈ 1.6K organic visits/mo [M41].
- **Launch:** 18 pages (8 tools + 10 guides).

| Scenario | New pages/month | Mature visits per page | Month 6 visits | Month 12 visits | **Year-1 total** |
|---|---|---|---|---|---|
| Conservative | 6 | 150 | ≈ 3,100 | ≈ 8,800 | ≈ **47K** |
| **Base** | 6 (playbook cadence) | 600 | ≈ 12,500 | ≈ 35,000 | ≈ **188K** |
| Optimistic | 12 | 2,000 (every page performs like the best competitor) | ≈ 58,000 | ≈ 198,000 | ≈ **972K** |

**Verdict on "1M visits in one year":**
- **1M visits per month by month 12 is not realistic** for a new domain. It needs ≈ 500 fully ranked pages at 2,000 visits each, or ≈ 1,700 pages at the base rate, plus authority the site won't have in year 1.
- **1M total visits in year 1** happens only in the **optimistic** case: ~12+ quality pages a month **and** near-top-3 rankings across the board. At 20 pages/month with optimistic performance, the model reaches ≈ 1.4M. That pace exceeds the playbook's 1–2 items/week and raises the risk of a scaled-content judgement against the site.
- **Plan on the base case** (≈ 35K visits/mo by month 12, ≈ 188K in year 1). Treat the optimistic case as the upside.

**Levers that move us toward the optimistic case:**
1. Publish the queued guides on time.
2. Ship batch 2 by month 4–5.
3. Earn 20–50 genuine referring domains through the original data pages (EIA state costs, span and spacing explainers) and community help.
4. Refresh pages that GSC shows at positions 5–15.
5. Keep CWV and E-E-A-T signals strong.

**Revenue at the base case:** month-12 ≈ 35K visits × 1.3 pages/visit × $5 RPM ≈ **$230/mo** [P], with AdSense only after the gate.

## 5. Seasonality (check before scheduling content refreshes)
- Keyword Planner flags +900% / −90% as seasonality, not trends [M16].
- **Known seasonal:**
  - seating chart maker (wedding season);
  - rubric maker and easy grader (back to school);
  - turkey cooking time (November);
  - gravel, rafter, paver (spring/summer building season [U]).
- Build a month-by-month calendar from Keyword Planner's monthly data for batch-1 keywords before the first refresh cycle [U].
