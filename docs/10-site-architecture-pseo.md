# 10: Site architecture and programmatic SEO (2026-10-11)

This is the structural spec for a production calculator site in the calculator.net / omnicalculator.com class.
- **Where it came from:** competitor research (§1). The approved plan is in `docs/00-prd.md` §5, and the keyword clusters are in `docs/11`.
- **What it governs:** the taxonomy, URLs, page types, internal links, programmatic families, cannibalization and the AdSense screen.
- **Where it's enforced:** the code (`content/taxonomy.ts`, `lib/links.ts`, `lib/families/`), the tests and `scripts/check-out.mjs`.

## 1. What the competitors do (researched 2026-10-11)
| | calculator.net | omnicalculator.com | What we take |
|---|---|---|---|
| Size [M] | 209 tools | **3,938** tools | Breadth over time, through a config engine (§6) |
| Categories | 4: Financial, Fitness & Health, Math, Other | 14: Biology, Chemistry, Construction, Conversion, Ecology, Everyday life, Finance, Food, Health, Math, Physics, Sports, Statistics, Other | Omni-style categories (§2) |
| URLs | flat `/x-calculator.html` | `/category/slug` | `/category/slug/`, which is readable and puts the category in the URL |
| Category page | full list under subheadings | ~90-word intro + subcategory **headings, not URLs** (Construction has 9 groups) | Subcategories as headings |
| Tool page | breadcrumb; an 18-link category list | "Check out N similar…" + "Related calculators"; in-content links; author and reviewer; table of contents; FAQ | All of these, plus a breadcrumb |
| Index | `/sitemap.html` (A–Z) | sitemap index | `/calculators/` (A–Z) + `sitemap.xml` |
| Programmatic | few | 294 `x-to-y` converters; `30-day`/`90-day`; `age-in-weeks` | Families, gated by demand (§5) |
| Engine | — | "Omni Builder" | `CalculatorSpec` + one engine island (§6) |

**Google spam policies (verified 2026-10-11):**
- **Scaled content abuse** is "many pages… generated for the primary purpose of manipulating search rankings and not helping users… no matter how it's created".
- **Doorway abuse** includes "substantially similar pages that are closer to search results than a clearly defined, browseable hierarchy".
- **So:** every programmatic page has unique computed value and a place in the hierarchy.

## 2. Taxonomy (`content/taxonomy.ts`)
- **16 categories**, with subcategories as on-page headings. Subcategories never become URLs (Omni's approach), so they can change without redirects.
- **A category is generated only once it has a published page** (playbook §0.2b: no empty hubs).

| Category | Subcategories | Wave 1 tools |
|---|---|---|
| `math` | Fractions & arithmetic · Percentages · Geometry · Number theory | 5 |
| `statistics` | Descriptive statistics · Probability & distributions · Random generators | 6 |
| `everyday-life` | Time & date · Crafts & sewing · Events | 7 |
| `construction` | Area & volume · Materials · Lumber & framing · Flooring & roofing · Pools | 9 |
| `finance` | Shopping & discounts · Pricing & business (later: loans, investing, tax & salary) | 3 |
| `energy` (added 2026-10-16) | Solar · Batteries & backup · Electricity & bills | 2: electricity cost (moved from everyday-life) and solar panel (owner-requested exception: primary KD 71). RV solar and battery bank queued here |
| `food` | Baking & dough | 2 |
| `pets` | Dogs (cats later) | 2 |
| `sports` | Bowling · Cycling | 2 |
| `physics` | Motion | 1 |
| `education` | Grades | 2 |
| `health` · `conversion` · `garden` · `photo` · `auto` · `other` | defined, unpublished | 0 |

## 3. URLs and page types
| Type | URL | Example | Breadcrumb |
|---|---|---|---|
| Home | `/` | | — |
| Category | `/{category}/` | `/construction/` | Home › Construction |
| Calculator | `/{category}/{slug}/` | `/pets/dog-pregnancy-calculator/` | Home › Pets › Dog Pregnancy Calculator |
| Guide | `/{category}/{slug}/{guide}/` | `/pets/dog-pregnancy-calculator/how-long-are-dogs-pregnant/` | … › Dog Pregnancy Calculator › How Long Are Dogs Pregnant |
| Programmatic instance | `/{category}/{slug}/{instance}/` | `/math/fraction-calculator/2-3-times-2-3/` | … › Fraction Calculator › 2/3 × 2/3 |
| A–Z index | `/calculators/` | | Home › All calculators |
| Author / editorial | `/authors/{author}/`, `/editorial-policy/` | | |
| Trust | `/about/`, `/methodology/`, `/privacy/`, `/disclosure/`, `/contact/` | | |

**Rules:**
- **Slug** = the primary keyword, in kebab case.
- **Format:** lowercase, with a trailing slash.
- **Depth:** never more than 3 clicks from home.
- **The breadcrumb mirrors the URL.**

## 4. Internal-link system (`lib/links.ts`, generated from the registry)
| Page | Links |
|---|---|
| **Every page** | Header with the published categories. Footer with categories, `/calculators/`, trust pages and `/llms.txt` |
| Home | Category grid (name, count, top 4 tools); "Popular calculators" (top 12 by researched cluster volume) |
| Category | ~90-word intro; one section per subcategory listing **every** tool; "Popular in {category}" (top 6); other categories |
| Calculator | Breadcrumb; **"Similar {subcategory} calculators"** (siblings, max 8); **"Related calculators"** (explicit `related[]`, may cross categories, 3–6); "Guides" (its published guides); "Popular {family} answers" (published instances, max 8); contextual links written in the content |
| Instance | Breadcrumb; a prominent "Open the {parent}" link; "Nearby" (sibling instances, max 6); 2 related tools |
| Guide | Parent tool within the first 150 words; sibling guides; related tools |
| A–Z | Every published tool, grouped by category |

**Build-enforced** (`scripts/check-out.mjs`):
- every page has ≥ 3 inbound links, is ≤ 3 clicks deep and appears in the sitemap;
- **no broken internal links**;
- ≤ 150 internal links per page;
- every tool appears on its category page and the A–Z index;
- every instance is linked from its parent.

## 5. Programmatic families (`lib/families/`)
**What a family is:** `{ id, parent, slugFor(params), title(params), compute(params), neighbours(params), faqs(params) }`.

**What every published instance renders:**
- the computed answer, in the static HTML;
- step-by-step working;
- a neighbouring-values table (unique per instance);
- a 40–60 word direct answer;
- 2–3 FAQs;
- links to its parent and siblings.

**The gate** (an instance is published only if all three hold):
1. Its exact query has research evidence (`content/keyword-map.json`, `type: instance`).
2. It renders unique computed content.
3. It's linked from its parent.

Every other instance candidate (listed in docs/11 §8) waits for data or GSC impressions.

**Wave-1 instances (9):**
| Family | Instances (volume / KD) |
|---|---|
| Date offsets | `10-days-from-today` (60.5K/20). The date changes daily, so the client computes it, and a schedule-only workflow triggers a daily rebuild through a Cloudflare deploy hook |
| Fraction expressions | `2-3-times-2-3` (33.1K/23) · `3-1-3-divided-by-4` (9.9K/–) · `2-1-3-minus-2-3` (8.1K/22) · `2-1-3-times-2` (8.1K/–) · `2-3-in-fraction-form` (8.1K/29) · `1-1-2-times-1-4` (1.6K/–) |
| Random ranges | `1-to-16` (27.1K/20) |
| Percent off | `40-percent-off-60` (2.9K + 1.9K) |

## 6. Calculator engine (`lib/engine/`, `components/engine/`)
- **`CalculatorSpec`** (zod) declares:
  - inputs: key, label, type (`number | select | date | time | fraction | numberList`), unit group, min, max, step, default;
  - outputs: key, label, format, primary flag;
  - a pure `compute()`;
  - `examples[]` and a `table` generator.
- **One client island, `CalculatorEngine`**, renders any spec: fields, live results, unit toggle, Copy link and CSV. The security rules are implemented **once** here: SEC-CODE-05/06/07/08/09/23.
- **`Explainer`** (server) renders the formula, the worked example and the tables from the spec, computed at build. The published numbers can't drift from the code.
- **Custom islands** only where a form won't do (the bowling scorecard, the seating chart maker).
- **Optional engine features (added 2026-10-16, first used by the solar panel calculator):**
  - `steps`: a wizard with a clickable progress bar and Back/Next. The result panel stays visible on every step and in the static HTML.
  - `display: 'tabs'` on a select: a segmented radio group, e.g. bill / units / appliances.
  - `display: 'stepper'` on a number: − and + buttons, clamped to min/max.
  - `companion`: an inline second input in the same cell, e.g. hours a day.
  - `showWhen`: show a field only in one mode.
  - `groupTotals`: a running total in a group heading, sticky while the list scrolls.
  - Every step must cover each field group exactly once (`tests/engine.test.ts`).

## 7. Keyword clustering and cannibalization (details: docs/11)
**Source:** `content/keyword-map.json`, generated by `research/calc-site/cluster.mjs` (research pack) from existing research only:
- 3,247 keywords;
- 157 URL rows;
- each keyword owned by exactly one URL; the script fails otherwise.

**Rules:**
- Tools own "… calculator" and other tool-intent phrases.
- Guides own informational phrasing, and their titles never say "calculator".
- Instances own the exact numeric query, and **the parent never targets a numeric-expression query**.
- Question keywords become **FAQ candidates**, chosen editorially at 5–8 per page.

**Automated checks** (`tests/content.test.ts`):
- primary and secondary keywords unique;
- title and H1 Jaccard ≤ 0.8 across all page types;
- no duplicate normalized instance queries;
- every instance's parent exists and links to it;
- `out/cannibalization-report.json` lists the closest pairs.

**After launch:** a monthly GSC check. If 2+ of our URLs show for one query, merge them or re-target one.

## 8. FAQ semantic markup
- **Calculator pages:** 5–8 visible FAQs in `<details>`. **Instances:** 2–3. **Guides:** optional 3–5.
- **Markup:** `FAQPage` JSON-LD inside the page `@graph`, with text **identical** to the visible FAQ (tested). Escaped by `serializeJsonLd()`.
- **Caveat:** Google limits FAQ rich results [U]. The markup is still read by Bing and AI engines.

## 9. `llms.txt`
- **`/llms.txt`** (llmstxt.org format), generated after the build from the registry:
  - an H1 with the site name;
  - a summary;
  - one section per published category, listing `[Tool](url): description`;
  - an Optional section.
- **`/llms-full.txt`:** direct answers, formulas and sources.
- **Check:** `check-out.mjs` verifies both list every published page and nothing unpublished.
- **Caveat:** Google ignores it [M47]. It's a low-cost signal for AI crawlers. This deviates from the playbook (docs/01 §5).

## 10. AdSense green-flag screen
**Basis:** Google Publisher Restrictions (verified 2026-10-11) restrict 12 categories: sexual content, shocking content, explosives, guns, other weapons, tobacco, recreational drugs, **alcohol sale or misuse**, online gambling, prescription drugs, unapproved pharmaceuticals, and apps removed from Play. Restricted pages get "fewer advertising sources… in some cases no ads".

**A page is green only if:**
1. it touches no restricted category, even adjacent;
2. it isn't YMYL advice for people (wave 1);
3. it has no trademark risk;
4. it has no safety liability;
5. it has a substantial unique explainer.

**Registry rows:** each carries `adsense: green | not-green`, and the build refuses to publish a not-green row.
- **Not green:** ABV, wedding alcohol, priming sugar, bra size, soap lye.
- **YMYL, later:** CD, APR, business loan, mileage, army body fat, target heart rate, fat intake, macro, pregnancy conception.
- **Sensitive queries excluded from clusters:** pet-pregnancy termination, human-pregnancy detection.

## 11. Sitemaps
- One `sitemap.xml` while the site is under 1,000 URLs.
- After that, per-category files through `generateSitemaps` (Next.js 16) [U: verify with static export].
