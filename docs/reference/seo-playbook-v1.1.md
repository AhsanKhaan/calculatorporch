# SEO Playbook: Beating calculator.net-Class Giants with a New Tool Site (v1.1)

> **v1.1 (2026-10-04)** applies all 24 required edits from the LLM-council revalidation (§14).
> v1.0 is archived at `research/playbook/seo-playbook-v1.0.md`. Section detail is in `research/playbook/P1–P6*.md`.

**Evidence grades** (every bullet carries one):
- **[M] Measured:** we observed it. Includes n, date, method and vantage.
- **[S] Sourced:** a primary source. Link given, or a tag saying where to verify.
- **[C] Consensus:** installed LLM skills agreed. Plausible, but not proof.
- **[J] Judgement:** an operator rule, not a claim about Google.
- **[D] Disputed:** the resolution is given.

Numbers additionally carry **PROXY** (method stated) or **UNVERIFIED**. "verify" means check the primary source before you rely on it.

---

## 0. The core truth (read first)
- **[M] Giants win on age, brand and links, not on-page polish.** calculator.net's mulch and concrete pages have no JSON-LD, no author and no "updated" date. The #1 result for "mulch calculator" is landscapecalculator.com, a niche domain with about 81 words.
- **[J] Out-specialise, don't out-authority.** One niche, deeper tools, better job fit, on SERPs that are already weak.
- **[M] Vendor-owned SERPs are unwinnable** (mulch, pool, dog food, epoxy, prorated rent). The same goes for queries where the AI Overview fully answers the question. Source: 15 manual SERPs, 2026-10-02.
- **[S] Google's generative UI** reportedly builds calculators inside AI Overviews (announced 2026-08-19 per Search Engine Journal; verify). Formula-only tools are the most exposed.
- **[J] Ranking is not earning.** The goal is revenue from US traffic. Outranking calculator.net on head terms is not the goal.

> **Evidence limits.** The teardown covers n = 9 pages, one desktop run, from a Pakistan network, with no mobile run (2026-10-04). The 81-word #1 page is **one example, and its cause is unknown** (domain age? links?). The SERP sample is 15 + 23 queries. **Upgrade it during niche selection: sample 20–30 SERPs** before committing.

## 0.1 Week-0 checklist (do this before building anything)
1. **[J] Hours budget:** set a weekly hours budget (e.g. N h/week) and a **stop-loss** (§12).
2. **Pick ONE niche.** Default candidate: **3D printing**. It has the most [M] evidence and the lowest liability. Alternatives are candles/soap (lye maths is safety-critical, see §2A) and events (seating charts take a larger build). **Pets are parked:** dog-food SERPs are vendor-owned, and the niche needs a credentialed reviewer you don't have. Test each candidate with:
   - the **3-of-5 SERP test** (§1) on about 10 head queries;
   - the **R8 generative-UI check**;
   - from a **US vantage** (§11).
3. **Domain and brand** [J]:
   - brandable;
   - broad enough for the niche cluster, not a single-tool exact match;
   - not confusable with a competitor's trademark;
   - registrar payable from Pakistan;
   - no expired or dropped domains;
   - chosen once, because rebranding is costly.
4. **Site skeleton:** a Git repo, an Astro project and Cloudflare Pages (§5).
5. **Measurement:** GA4, a GSC Domain property, Bing Webmaster Tools (import from GSC) and an IndexNow key.
6. **Write down the revenue floor** (§1, PROXY). If even the high case can't justify your hours budget, pick another niche.
7. **Write down the kill/continue gates** (§12).

## 0.2 Protect the AdSense account (the one irreversible asset)
- **a. [J] Affiliates first.** Don't put AdSense code on the site, or apply, until the trigger below is met.
- **b. [J] Apply only when ALL of these hold:**
  - 8–10 tools in one niche, each passing the quality gates (§3);
  - 4–6 spokes;
  - trust pages (About, Contact, Privacy, Methodology, Disclosure);
  - no placeholders, lorem ipsum or "coming soon" pages;
  - the consent banner is live;
  - **4+ consecutive weeks of organic clicks in GSC.** Google publishes no traffic minimum (verify); this is a self-imposed bar.
- **c. Real identity.** The payee name matches your bank and ID, and your real name is on the About page. **No personas.**
- **d. Invalid-traffic hygiene:**
  - never click or reload your own ads, and don't let friends click them;
  - ads are **disabled by an environment flag** in dev, preview and **all** Playwright or Firecrawl runs;
  - never view your own ad pages through a VPN;
  - use AdSense's test mechanism during development (verify how it works).
- **e. Placement:** no ads in the inputs or result area, and reserved slot heights (§5).
- **f. Consent:** a Google-certified CMP for EEA, UK and Swiss visitors. The project's Phase 0 found this required since 2024-01-16 [S: idea2 phase0 H2; verify].
- **g. Affiliate disclosure** next to every affiliate link, plus a `/disclosure` page. US FTC rules; the UK ASA wants an "Ad" label [S: idea2 phase0 H15/H16].
- **h. Pakistan checks, each verified on the official help pages:**
  - AdSense pays to Pakistan by wire or check [S: idea2 phase0 H6];
  - the address PIN arrives by post;
  - tax information;
  - each affiliate programme's acceptance of Pakistan payees and its payout method. PartnerStack, Impact, CJ/Payoneer and Awin look workable; PayPal-only programmes are not [S: idea2 phase2-affiliates]. Amazon Associates is UNVERIFIED.
- **i. Recovery path:** if you get a GSC manual action or an AdSense policy notice, fix the issue, document the fix, then request reconsideration or appeal.

---

## 1. Pick the battlefield (niche & keyword selection)
- **[C] One niche cluster first, breadth later** (P1).
- **[J] Decision rule: the 3-of-5 SERP test.** Build only if ≥3 of these hold (P1):
  1. A small or indie site is in the top 3.
  2. A giant sits at position 5 or lower, or is absent.
  3. The AI Overview shows only a formula, a tool list, or nothing.
  4. No vendor owns the SERP.
  5. Odd results rank (forums, app-store pages, foreign sites).
- **[M] Page-type mismatch is an opportunity.** When blogs, Reddit or Play-store pages rank for a "calculator" query, no good dedicated tool exists (example: "3d print cost calculator", 2026-10-02).
- **[C] One page per intent, never per keyword variant** (P2).
- **[D] SERP overlap sets page boundaries, not text similarity** (P2). Manual top-5 test: if variant A's #1–3 URLs appear in B's top 5, merge.
- **[J] Optional tiebreaker only:** `V × W × B × (1 − A/4) ÷ E`, with all weights UNVERIFIED. The 3-of-5 test decides.
  - V = Keyword Planner volume band; W = SERP weakness; B = bid; A = AI Overview answer level; E = build effort.
- **[C] Free discovery:**
  - Keyword Planner bands;
  - manual autocomplete and PAA (don't script Google);
  - niche subreddits;
  - competitors' sitemap slugs;
  - GSC after launch.
- **[M] Keyword Planner "+900%" or "-90%" flags are usually seasonality.** Build a seasonality calendar from Keyword Planner's monthly data.
- **Revenue floor (PROXY; every input UNVERIFIED):**
  - Monthly page views ≈ Σ (KP band midpoint × assumed CTR at the expected position) × pages per session
  - AdSense ≈ page views ÷ 1,000 × assumed RPM
  - Affiliate ≈ tool sessions × outbound CTR × conversion × average commission

  Run low, mid and high cases. After launch, swap the assumptions for GSC CTR and real RPM or earnings.

## 2. Tool & page quality: table stakes
- **[C] Build for the specific job, not a formula box** (P1). Example: 3D-print cost including electricity, labour, failure rate and marketplace fees.
- **[M] Input bar** (2026-10-04, n = 9 pages):
  - calculator.net: 48–50 inputs (mulch, concrete);
  - Inch Calculator: 26–72;
  - printpal.io (indie winner): 10 inputs plus WebApplication schema.

  Match what searchers need, then add presets, unit toggles and exports.
- **[D] UX is a retention and RPM lever, not a proven ranking lever** (P1). Do it anyway:
  - result above the fold;
  - prefilled example;
  - mobile-first;
  - a "Copy link" button;
  - print, PDF and CSV export.
- **[C] Add a "Who this is for / not for" block.**
- **[M] Staleness wedge:** an Omni 3D-printing page shows "Last updated July 30, 2024".
- **[J] US defaults:** imperial units, USD and US spelling, with metric and currency toggles.

## 2A. Accuracy, liability & maintenance
- **[J] Disclaimers:**
  - general: "estimate, not professional advice";
  - topic-specific: vet, medical, chemical safety, structural.
- **[J] Safety-critical maths** (lye, dosage, loads) is cross-checked against a cited reference before shipping.
- **[J] Regression tests:** every pure function has test cases from cited references or hand-worked examples. They run in CI on every build and are published on `/methodology/`.
- **[J] Error reports:** set a fix-time target, and log every correction in a public changelog.
- **[J] Maintenance budget:** reserve a fixed share of weekly hours for quarterly refreshes of data and accuracy. Your own data goes stale too.
- **[S] Accessibility:** WCAG 2.2 AA basics (labels, keyboard use, contrast, clear error messages).

## 2B. Defensibility (the real moat)
- **[J] Tool quality is table stakes.** Browser maths can be cloned, so don't rely on obfuscation.
- **[C] The moat is data, brand and community:**
  - sourced and owned reference datasets on `/data/` pages (densities, wax limits, failure rates);
  - a niche brand;
  - a public test-case record;
  - genuine community presence;
  - a visible changelog.
- **[J] Training bots:** allow GPTBot and ClaudeBot at launch. Revisit only if you find evidence of cloning (§4).

## 3. Content & blog strategy
- **[C] The tool is the pillar.** Ship tools first and blog later (P3).
- **[C] Tool-page template, 10 blocks in order:**
  1. H1 + answer-first line.
  2. Tool with a prefilled example.
  3. What the result means.
  4. How to use it (3–5 steps).
  5. Formula + a worked example using real output, with a cited source.
  6. Assumptions, limits and disclaimers (§2A).
  7. A unique table or chart.
  8. 4–6 visible FAQs from real queries.
  9. Related tools + 2–3 guides.
  10. Trust footer: author, "How we verify", sources, changelog, "report an error".
- **[D] Word counts are floors, not targets:**
  - tool pages: about 400–800 unique words;
  - posts: 800–1,500, longer only if the SERP demands it.

  [M] The #1 mulch page has about 81 words, while Omni writes about 3,208 for the same tool. Match the SERP; never pad.
- **[C] Blog = 3–6 spokes per tool, linked both ways:**
  - how-to;
  - formula explainer;
  - data-backed comparison (your own computed numbers);
  - small original data study;
  - seasonal refresh (updated in place).
- **[C]** Each post links to its tool within the first ~150 words.
- **[D] Cadence:** 1–2 shipped items per week, each passing the gates. 3–5 AI posts a day was rejected (scaled-content and AdSense risk).
- **[D] AI drafting needs human verification.** A human checks every formula and adds the examples, data and real experience.
- **[D] No "X alternative" or giant-vs pages at launch.** Revisit at month 6 only if GSC shows demand.
- **[J] E-E-A-T, honest version:**
  - a real-name byline;
  - **no "Reviewed by" until a real reviewer agrees in writing** (without one, use "How we verify", sources and test cases);
  - a methodology page;
  - primary sources;
  - a changelog;
  - original data;
  - an error-report address.

  **No personas, and never fake credentials.**

## 4. AEO / GEO (AI Overviews, AI Mode, ChatGPT, Perplexity, Gemini, Claude, Copilot)
- **[S] AI visibility follows ranking.** Google says AI Overviews and AI Mode use the same index and quality systems (Google AI optimisation guide, updated 2026-07-10, per P4; verify). Do §1–3 first.
- **[C] Server-render** the formula, worked example, tables and FAQ as real HTML. Many AI crawlers don't run JavaScript.
- **[C] Passage-level citability:**
  - each section opens with a direct answer;
  - sections are self-contained;
  - figures carry sources and dates;
  - write naturally.
- **[C] Original or first-hand data** (see §2B). It is the strongest citation lever.
- **[C] Entity basics:**
  - one consistent brand;
  - Organization schema;
  - genuine help in niche subreddits and forums (follow each community's rules; no link drops).
- **[S] Bing Webmaster Tools + IndexNow.** Bing feeds Copilot and, reportedly, ChatGPT search (verify).
- **robots.txt:**
  - **[S] Allow** Googlebot, Bingbot, OAI-SearchBot, PerplexityBot and Claude-SearchBot. These decide citation; the OpenAI bots doc says OAI-SearchBot powers ChatGPT search (verify).
  - **[J] Training bots** (GPTBot, ClaudeBot, Google-Extended): allow at launch, see §2B.
- **[D] Rejected as over-hyped:**
  - FAQ schema as "the #1 AEO win";
  - schema as "the biggest AI lever";
  - listicle or "vs" pages built for ChatGPT.
- **Measure (cheap):**
  - GA4 "AI" channel matching `chatgpt\.com|perplexity\.ai|claude\.ai|gemini\.google\.com|copilot\.microsoft\.com`;
  - Bing Webmaster's AI Performance report;
  - GSC's "Search generative AI" report, if your property shows it (verify);
  - a **quarterly** panel of 10 queries × 2 engines;
  - **US / Tier-1 share** through the GSC country filter and GA4 country.

## 5. Technical SEO
- **[C] Initial HTML must contain** the title, canonical, meta robots, JSON-LD and the default calculator result. CSR-only tools are an indexing risk (P5).
- **[J] Stack:**
  - Astro (SSG) with a small Preact or vanilla "island";
  - hosted on Cloudflare Pages or a static CDN (free-tier limits UNVERIFIED);
  - each calculator's maths is one pure function, pre-rendered at build time and hydrated in the browser.
- **[J] Spec-driven builds are allowed.** Time the first 3 builds, and raise targets only if each tool still passes the §2A tests.
- **[S] Core Web Vitals** (field, p75): LCP ≤2.5s, **INP ≤200ms**, CLS ≤0.1. These are tiebreakers.
  - Ads cause most INP and CLS damage: reserve ad-slot heights, and keep ads away from the inputs and result.
  - [M] Lab bars (Pakistan network, one desktop run): Inch Calculator 0.3–0.4s LCP; Omni up to about 6.8s. Prefer PageSpeed Insights / CrUX field data where it exists.
- **[C] Indexing:**
  - sitemap with real `lastmod`, submitted to GSC and Bing;
  - IndexNow (not used by Google);
  - self-canonicals;
  - preset and share URLs noindexed and canonicalised to the base tool;
  - pages ≤3 clicks from home.
- **[S] No Back-button hijacking:** never call `pushState`/`replaceState` per keystroke; use a "Copy link" button. Enforced since 2026-06-15 per claude-seo (verify). Test with ads on.
- **[S] Mobile:**
  - inputs ≥16px with `inputmode="decimal"`;
  - touch targets ≥24px (ideally 48px);
  - no intrusive interstitials;
  - no key content hidden in tabs.

## 6. Schema (cheap hygiene, not a ranking lever)
| Type | Use | Grade / verdict |
|---|---|---|
| WebApplication (`offers.price: 0`) | each tool | [D] For entity clarity. **Never add self-made ratings**: the Software App rich result needs genuine reviews (Google docs, per P5; verify). No evidence it drives rank. |
| BreadcrumbList | all pages | [C] |
| Organization + WebSite | home | [C] |
| Person / ProfilePage | the real author | [C] |
| Article / BlogPosting | guides | [C] |
| FAQPage | optional | [D] No Google rich result since 2026-05-07 (claude-seo quality gates; verify on developers.google.com). Keep the visible FAQs. |
| HowTo | none | [S] Deprecated. |

Combine everything into one `@graph` per page, generated at build time from frontmatter.

## 7. Programmatic SEO
- **[J] 0 programmatic pages until 8–10 flagship tools exist AND the niche passes the month-6 continue gate.**
- Programmatic pages are allowed only with measured demand per variant, a preset that changes the inputs, computed examples with different numbers, and variant-specific guidance. If more than 60% of the text is shared boilerplate, it's abuse.
- Detailed gates (30/50 page caps, uniqueness thresholds): see `research/playbook/P5-technical-schema-pseo.md`.

## 8. Architecture & internal linking
- **[C] Hub-and-spoke URLs:**
  - `/{category}/{tool}/`
  - `/{category}/guides/{slug}/`
  - `/data/{slug}/`
  - `/methodology/`, `/about/`, `/disclosure/`

  Lock 4–6 categories before launch (P6).
- **[C] Every tool links to** its breadcrumb, its hub, 4–6 related tools and 1–2 guides. [M] calculator.net and Omni show "related calculators" blocks; Inch Calculator has 60–69 internal links.
- **[J] Orphan rule:** every new page needs ≥3 inbound links and a sitemap entry, and must be ≤3 clicks deep. Fail the build otherwise.
- **[D] Internal linking is necessary but not sufficient.** You also need a few editorial links (§9).

## 9. Authority & link building ($0, safe)
Ranked by safety × impact (P6):
1. **[C] Dead or shutting-tool replacement.** Example: rubric-maker.com says it will go offline at the end of 2026 [M: SERP snippet, 2026-10-02]. It's off-niche, shown only as an example of the method.
2. **[C] Genuine community help.** Mostly nofollow; the payoff is traffic, mentions and AI citations.
3. **[C] Resource-page pitches:** niche blogs, clubs, makerspaces.
4. **[C] Original data studies** (§2B).
5. At 8–10 tools, at most **one** launch post: Product Hunt **or** Show HN.
- **[J] Controlled anchors:** ≥70% branded or naked URL. No link spikes.

## 10. NEVER do
- PBNs.
- Paid links without `rel="sponsored"`.
- Link exchanges or mass directories.
- Keyword-rich widget links.
- Expired-domain redirects.
- **Personas, or fake credentials or reviews.**
- Self-made ratings in schema.
- Keyword-variant doorway pages.
- 3–5 AI posts a day.
- Back-button hijacking.
- Ads inside the inputs or result area.
- Clicking your own ads, or viewing them through a VPN.
- AdSense code on the site before the §0.2 gate.
- Cracked or group-buy SEO tools.
- Vendor-owned niches.
- Automated Google SERP scraping.
- Copying competitors' prose, tables or datasets.

## 11. Research runbook (Playwright + Firecrawl)
**Prereqs:**
- **Firecrawl:** run `firecrawl login` once (the user does this). The scrape flag is `-f/--format`.
- **Playwright:** `NODE_PATH="$(npm root -g)"`. Script: `research/playbook/scripts/teardown.js`.
- **Vantage [J]:**
  - Do manual SERP and AI Overview checks from a **US IP (VPN), in a logged-out clean browser profile**, with `gl=us&hl=en`. Using `gl=us` from Pakistan is only a partial stand-in.
  - **Never solve or bypass CAPTCHAs.**
  - Use the VPN **only** for SERP checks, never for your own ad pages.
  - Label Playwright CWV as "lab, Pakistan network".
- **No Google SERP automation.** `firecrawl search` is for **candidate-URL discovery only** (link prospects, competitor pages), **never ranking positions**.
- **Legal and cost [J]:**
  - Check each target site's robots.txt **and ToS** before R1 and R2.
  - Collect structure and metrics only. Never copy prose, tables or datasets; re-derive them from primary sources. This is not legal advice.
  - Firecrawl credits are finite and the free-tier allowance is UNVERIFIED. Estimate the credits needed first (R1 ≈ 4 sites × up to 500 URLs) and set `--limit` on every task.
  - Keep automation away from any logged-in Google account.
  - **Own-site ads must be off during every automated run.**

| Tier | # | Task | Method | Decides |
|---|---|---|---|---|
| **Core (before the niche commit)** | R3 | SERP-weakness and overlap check | **Manual, US vantage**: top 10, owner type, page type, AI Overview state | 3-of-5 test; merge or split |
| | R8 | Generative-UI threat | **Manual, US vantage**: does Google render its own interactive calculator for ~10 niche head terms? Re-run quarterly | Niche kill test |
| | R1 | Giant coverage per niche | `firecrawl map https://www.omnicalculator.com --search "<niche>" --limit 500 -o omni.txt` (repeat for calculator.net, inchcalculator.com, calculatorsoup.com) | Saturation; where giants are thin |
| **After the niche commit** | R2 | Competitor page teardown | `firecrawl scrape <url> -f markdown,links` on the top 3 per term (metrics only) | Content bar, inputs, gaps |
| | R7 | AI citation panel | Manual, quarterly: 10 queries × 2 engines; log who gets cited | Citable gaps |
| | R9 | Link prospects | `firecrawl search "<niche> tools resources" --limit 20` (discovery only), then Playwright checks for 404s | Outreach list |
| **Optional** | R4 | Schema, CWV and structure audit | `teardown.js` (3 runs, mobile emulation) | Performance bar |
| | R5 | Raw HTML vs rendered DOM | Playwright `request.get` vs `page.content()` | Competitors' crawlability without JS |
| | R6 | Indie-winner trust signals | Playwright on 3–5 indie winners | Minimum trust set |
| | R10 | Variant demand | Keyword Planner (user account) | Only after programmatic pages are allowed (§7) |

## 12. Staged 12-month plan + kill/continue gates
**Expectation [J, UNVERIFIED]:** revenue inside 90 days is unlikely. Meaningful organic traffic for a new domain may take 6–12 months.

| Phase | When | Ship |
|---|---|---|
| 0 | Week 0 | §0.1 checklist |
| 1 | Weeks 1–4 | Trust pages (real name), **1 probe tool**, GA4 + GSC + Bing + IndexNow, consent banner |
| 2 | Months 2–3 | **3 tools** + 2 spokes |
| 3 | Months 4–6 | **8–10 tools** + 4–6 spokes → check the §0.2 AdSense gate |
| 4 | Months 6–12 | Spokes, refreshes, gated expansion (backlog below) |

**Kill / continue gates [J]:**
- **Day 30:** all tool pages are indexed in GSC. If not, fix technical issues; don't rewrite content.
- **Month 3:** niche-level impressions are appearing. If there are none, audit indexing and quality before adding tools.
- **Month 6:** some target queries rank in positions ≤30, and the revenue floor is still plausible. Continue, or **pivot the niche on the same codebase**.
- **Months 9–12:** clicks and revenue vs the floor decide continue or kill.
- **Generative-UI kill:** quarterly R8. If Google renders its own interactive calculator for most of the niche's head terms, stop building there.
- **Stop-loss:** going over the hours budget for N consecutive weeks triggers a review.

**GSC review rules [J]:**
- Use 3-month windows, aggregated by niche or page group.
- No per-page rewrite until the page has been indexed for 12+ weeks **and** the domain shows impressions elsewhere.
- Judge seasonal terms year-on-year against the seasonality calendar.

**Expansion backlog (gated):**
- **Now:**
  - affiliates first;
  - sourced open-data tables;
  - spec-driven pure-function builds;
  - unit and currency toggles.
- **Month 4+ (after the month-3 gate):** moderated "submit your real cost" crowdsourced data.
- **Month 6+ (after the month-6 gate):**
  - branded, nofollow, ad-free embeddable widgets for niche suppliers;
  - a public JSON endpoint for the datasets;
  - locale pages only where GSC shows non-US Tier-1 demand.
- **Months 9–12+:** a second niche; decide then between the same domain and a separate niche domain.
- **Deferred:**
  - MCP or WebMCP endpoints (adoption UNVERIFIED);
  - translated sites;
  - multiple domains at launch;
  - YouTube demos;
  - llms.txt;
  - HARO without real data.

## 13. Validation map
| Section | Skill A (drafted) | Skill B (challenged) | Key overrides |
|---|---|---|---|
| P1 Strategy | claude-seo:seo + seo-sxo + seo-competitor-pages | competitors | No giant-vs pages; UX ≠ a ranking lever |
| P2 Keywords | searchfit-seo:keyword-clustering | claude-seo:seo-cluster | SERP overlap > similarity; no cluster minimum |
| P3 Content | searchfit-seo:content-strategy + content-brief | claude-seo:seo-content | 1–2 items/week; word counts as floors |
| P4 AEO/GEO | claude-seo:seo-geo | ai-seo + aeo:aeo (+ searchfit ai-visibility) | OAI-SearchBot (not GPTBot) powers ChatGPT search; llms.txt optional |
| P5 Technical | claude-seo:seo-technical + seo-schema | programmatic-seo + schema | No HowTo/FAQ schema; no self-made ratings |
| P6 Links | site-architecture + searchfit internal-linking | claude-seo:seo-backlinks + marketing-ideas | Internal links necessary, not sufficient |
| Grounding | Playwright teardown, n = 9 [M] | project SERP and KP data [M] | Word count ≠ ranking |
| **Revalidation** | **llm-council**: 5 advisors + 5 peer reviews + chairman | **done 2026-10-04** | 24 edits applied (§14) |

## 14. Council verdict (summary)
Full text: `research/playbook/council-verdict.md`.
- **Agreed:** the direction is right (out-specialise, one niche, 3-of-5 test, tool first, $0-safe links), but v1.0 under-protected AdSense, overstated its evidence, contradicted itself (tool counts, personas) and had no time-to-results or kill gates.
- **Rulings:**
  - shrink, don't scale: 1 → 3 → 8–10 tools;
  - AdSense needs both a content bar and a traffic bar;
  - use a VPN only for viewing SERPs;
  - data, brand and community are the moat;
  - the Expansionist's ideas are gated by month.
- **The one thing to do first:** the Week-0 niche sprint from a US vantage (§0.1).

## 15. Glossary
| Term | Meaning |
|---|---|
| **AEO** | Answer Engine Optimisation: getting your content used in direct answers. |
| **GEO** | Generative Engine Optimisation: getting cited by AI search (ChatGPT, Perplexity, AI Overviews). |
| **SXO** | Search Experience Optimisation: matching the page type and UX to what the SERP rewards. |
| **pSEO** | Programmatic SEO: many pages generated from a template plus data. |
| **YMYL** | "Your Money or Your Life": health and finance topics held to stricter quality standards. |
| **E-E-A-T** | Experience, Expertise, Authoritativeness, Trust: Google's quality-rater framework. |
| **CWV** | Core Web Vitals: the three metrics below. |
| **LCP** | Largest Contentful Paint: loading speed. |
| **INP** | Interaction to Next Paint: responsiveness. |
| **CLS** | Cumulative Layout Shift: visual stability. |
| **SSG** | Static Site Generation: pages pre-built at build time. |
| **CSR** | Client-Side Rendering: pages built in the browser by JavaScript. |
| **Island / hydrate** | A small interactive JS component on an otherwise static page, activated ("hydrated") in the browser. |
| **JSON-LD / `@graph`** | The structured-data format for schema; `@graph` bundles several schema objects into one block. |
| **IndexNow** | A protocol for pinging Bing, Yandex and Naver about new URLs. |
| **GSC / GA4** | Google Search Console / Google Analytics 4. |
| **KP** | Google Ads Keyword Planner. |
| **PAA** | People Also Ask. |
| **CTR** | Click-through rate. |
| **RPM** | Revenue per 1,000 page views. |
| **CMP** | Consent Management Platform: the cookie-consent banner. |
| **SERP** | Search engine results page. |
| **Vantage** | The country or IP a check is run from. |
| **P1 × P3** | Notation meaning "section file P1 was challenged against P3". |
