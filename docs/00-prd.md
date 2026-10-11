# 00: Product requirements (PRD)

**Version:** 2.0, 2026-10-11 · **Owner:** you · **Status:** approved (plan of 2026-10-11)

**What changed in v2:** the niche "home & hobby hub" plan became a production calculator site in the calculator.net / Omni class:
- an Omni-style taxonomy and a config-driven engine;
- programmatic SEO families and keyword clustering;
- FAQ markup and `llms.txt`;
- an AdSense green-flag screen.

Architecture is in `docs/10`, clusters in `docs/11`, the registry in `content/keyword-map.json`.

**How this fits:**
- This file sets the **why, what and when**. Docs 01–09 hold the evidence and the detailed specs, and [`security/`](../security/README.md) holds the coding rules.
- **If this PRD and another doc disagree on scope or goals, this PRD wins, and the other doc gets fixed.**
- Tags as in the rest of the pack: **[M]** measured · **[R]** range · **[P]** proxy/estimate · **[U]** unverified.

## 1. Vision
**Calculator Porch: free online calculators for math, money, building, food and everyday life.** It's a production calculator site in the style of calculator.net and omnicalculator.com, with 16 categories and a config-driven engine built to grow to hundreds of tools. It has three jobs:
1. **Win page by page:** rank on low-competition keywords the giants ignore or serve poorly.
2. **Earn:** affiliates first, then AdSense.
3. **Be sold:** built from day one as an asset a buyer can verify, take over and run.

**Calculators are the engine. Selling (the flip) is the exit.** (Your goal, 2026-10-05.)

## 2. Problem and opportunity
- **The giants can't be beaten on their head terms.**
  - calculator.net: Authority Score 90, 30.3K referring domains, ≈ 37.8M organic visits a month.
  - Omni: AS 84 and ≈ 16.9M visits [M30].
- **But they leave gaps:**
  - **Coverage:** calculator.net covers 8 of our 58 reference topics and Omni 27; **17 topics have no page on either** [M21].
  - **Page quality:** calculator.net has no schema, FAQ, author or date; Omni has a heavy ad stack [M22].
  - **Weak SERPs:** sites with Authority Score 2–30 already hold top-10 spots on our launch keywords [M26][M31][M32]. The small sites we'd displace have a median AS of 12 [M40].
- **So the opportunity is:** one better page per low-KD keyword, with a working tool, original data, guides, sources and complete schema (docs/01 §3, docs/06).

## 3. Goals and success metrics
| # | Goal | Metric | Target | By | Source |
|---|---|---|---|---|---|
| G1 | Get indexed | Share of published URLs indexed (GSC) | 100% | Day 30 after launch | docs/07 §2 |
| G2 | Get seen | Impressions for batch-1 keywords | Every launched hub has impressions | Month 3 | docs/07 §2 |
| G3 | Rank | Target queries at position ≤ 30 | Some in every launched hub; the revenue floor still plausible | Month 6 | docs/07 §2 |
| G4 | Traffic | Organic visits a month | **Base ≈ 35K** at month 12 (conservative ≈ 8.8K, optimistic ≈ 198K) [P] | Month 12 | docs/07 §4b |
| G5 | Monetize safely | AdSense approved on the first application, with zero policy strikes | Apply when the §0.2 gate is met | Months 4–8 [P] | playbook §0.2 |
| G6 | Revenue | AdSense + affiliates a month | **Base ≈ $230/mo AdSense** at month 12 [P]; affiliates not modelled | Month 12 | docs/07 §4b |
| G7 | Sellable | Unbroken monthly P&L, plus GA4, GSC and AdSense history; all assets separable (§9) | 12+ months of clean history [U: buyer norms to research before month 12] | Months 12–24 | §9 |

**Kill/continue gates** follow docs/07 §2:
- day 30 (indexing);
- month 3 (impressions);
- month 6 (rankings and revenue floor);
- months 9–12 (continue or kill);
- a quarterly check for Google's own generative calculators;
- the hours stop-loss.

**Non-goals:**
- outranking calculator.net or Omni on head terms;
- 1M visits a month in year 1, which isn't realistic for a new domain (docs/07 §4b);
- more than one domain before the month 9–12 gate;
- apps, accounts or user-generated content in v1.

## 4. Users and jobs
Primary market: **US, English, imperial units by default**. All keyword data is US [M28][M38].

| User | The job they're doing | Wave-1 pages (examples) |
|---|---|---|
| Student or parent | Fractions, percentages, statistics, grades, step by step | fraction, percentage, statistics, standard deviation, grade, final grade |
| Anyone planning time | Time between times, dates, days from today, ages | time duration, day counter, age, hours |
| Homeowner or DIYer | Order the right amount of material; cut it right; know the cost | square footage, gravel, concrete slab cost, roofing, tile, rafter, stair stringer |
| Shopper or seller | Discounts, tips, pricing for an Etsy or eBay shop | percent off, tip, 3D printing cost |
| Dog owner or breeder | Estimate adult weight; know the due date and milestones | puppy weight, dog pregnancy |
| Home cook or baker | Dough by weight and hydration | pizza dough, sourdough |
| Sports player | Score a game; pick a gear ratio | bowling score, bike gear ratio |

## 5. Scope
### 5.1 Wave 1 (decided 2026-10-11)
**Rules:**
- only calculators that **your existing research** covers;
- all categories in the structure, **non-YMYL first**;
- **AdSense green flag only** (docs/10 §10).

**What launches:**
- **40 calculators across 10 categories**, plus **10 launch guides** and **9 programmatic instances** (gated by demand). The full list is in docs/02 §2 and docs/11 §1.
- **Home**, the published categories, the **A–Z index** (`/calculators/`), the **author** page and the **editorial policy**.
- **Trust pages:** About (your real name), Methodology (with a changelog), Privacy, Disclosure, Contact and a 404.
- **Publishing:** 2 batches of about 30 URLs, 2–3 weeks apart.
  - **Batch A:** the 20 highest-volume tools, plus dog pregnancy and 3D printing cost.
  - **Batch B:** the rest.
- **Researched demand behind the wave-1 pages:** about 2.37M US searches a month (summed cluster volume) [M]. This is demand, not a traffic estimate.

### 5.2 After launch
- **Waves 2–3:** 43 calculators and 15 queued guides from the same research (docs/11 §2–3).
- **Later (each status explained in docs/02 §1):**
  - `later-kd` (15);
  - `skip-vendor-serp` (11);
  - `ymyl-later` (9; needs stronger trust signals);
  - `not-green` (5; never built while AdSense matters).
- **Programmatic instance candidates** (docs/11 §8) become pages only through the gate in docs/10 §5.
- **Publishing pace:** **≤ 10 new URLs a week** after the launch batches.

### 5.3 Out of scope for v1
Each of these needs a PRD change first:
- user accounts, comments, forms or user-submitted data (crowdsourced costs come at month 4+ at the earliest; playbook §12);
- server code;
- translations or locale pages;
- embeddable widgets or a public API (month 6+);
- multiple domains;
- **any AdSense code before the §0.2 gate.**

## 6. Requirements
### 6.1 Functional
| ID | Requirement | Detail in |
|---|---|---|
| FR-01 | **Every tool page renders its default result into the static HTML.** Crawlers and AI bots see real numbers. The live result then updates as the visitor types | docs/04 §5 |
| FR-02 | **Tool page order:**<br>1. breadcrumb;<br>2. H1;<br>3. a direct answer of 40–60 words;<br>4. the calculator, with its result first on mobile;<br>5. what the result means;<br>6. how to use it;<br>7. the formula and a worked example;<br>8. an original data table;<br>9. guide cards;<br>10. FAQ (5–8 questions);<br>11. related tools (3–6);<br>12. a trust footer (author, sources, last reviewed, report an error, a disclaimer where needed) | docs/05 §1 |
| FR-03 | **Calculator controls:** unit toggle (imperial by default), presets, Copy link (query parameters), and CSV or print. **No URL changes while typing** | docs/04 §5, security SEC-CODE-05/09 |
| FR-04 | **Guides:**<br>• the answer comes first;<br>• a link to the parent tool within ~150 words;<br>• 800–1,500 words;<br>• no "calculator" in the title or H1;<br>• your own diagrams | docs/05 §2 |
| FR-05 | **Categories** list every tool, grouped under subcategory headings, and are published only when they have ≥ 1 live tool. **Home** links every category. **`/calculators/`** lists every tool A–Z | docs/10 §2, §4 |
| FR-08 | **Config-driven engine:** every calculator is a `CalculatorSpec` rendered by one engine island. Custom islands only where a form won't do | docs/10 §6 |
| FR-09 | **Programmatic instances** carry a computed answer, steps, a unique neighbouring-values table, 2–3 FAQs and links to their parent and siblings. They're published only through the demand gate | docs/10 §5 |
| FR-06 | **Every constant is cited.** Every [U] value in docs/08 §3 is verified before its page is published. Data files carry their source, retrieval date and licence | docs/03, docs/08 §3, SEC-CODE-16 |
| FR-07 | **Trust pages carry real identity:** your real name on About, and a real contact email. **No personas and no invented reviewers** | playbook §0.2c, §10 |

### 6.2 SEO
| ID | Requirement | Detail in |
|---|---|---|
| SEO-01 | **One primary keyword per URL; every keyword is owned once.** The registry (`content/keyword-map.json`, generated by clustering) is the single source of truth. The build fails on duplicates or near-duplicate titles (Jaccard > 0.8) across all page types | docs/02 §4, docs/10 §7 |
| SEO-02 | **URLs:** `/{category}/{slug}/` for calculators and `/{category}/{slug}/{child}/` for guides and instances. Lowercase, with a trailing slash; depth ≤ 3 | docs/10 §3 |
| SEO-03 | **JSON-LD for every page type:**<br>• tool: WebPage, WebApplication, BreadcrumbList, FAQPage;<br>• guide: Article;<br>• hub: CollectionPage;<br>• home: Organization and WebSite;<br>• **About: AboutPage + Person; Contact: ContactPage** (added 2026-10-10).<br>No self-made ratings | docs/04 §7 |
| SEO-04 | **Discovery:** `sitemap.xml` with real `lastModified` dates, `robots.txt` (AI search bots allowed), IndexNow, GSC and Bing Webmaster | docs/04 §7 |
| SEO-05 | **Internal links, generated from the registry:**<br>• breadcrumbs;<br>• "Similar {subcategory} calculators" (max 8);<br>• "Related calculators" (3–6);<br>• guides and instances linked both ways.<br>**Build checks:** ≥ 3 inbound links, ≤ 3 clicks deep, no broken links, ≤ 150 links per page | docs/10 §4 |
| SEO-07 | **Keyword clustering:** every researched keyword is assigned to exactly one page (calculator, guide, instance or FAQ candidate) or explicitly discarded | docs/11, docs/02 §4 |
| SEO-08 | **FAQ semantic markup:** visible FAQs (5–8 per tool, 2–3 per instance), with identical `FAQPage` JSON-LD (tested) | docs/10 §8 |
| SEO-09 | **`llms.txt` + `llms-full.txt`**, generated from the registry, listing every published page | docs/10 §9 |
| SEO-10 | **AdSense green flag:** every published row is `adsense: green`; restricted or YMYL topics are blocked by the build | docs/10 §10 |
| SEO-06 | **AI answers (AEO):** a quotable direct-answer passage, a visible FAQ and cited sources on every tool | docs/05 §5 |
| SEO-07 | **The never-do list** (playbook §10) is binding | playbook §10 |

### 6.3 Non-functional
| ID | Requirement | Detail in |
|---|---|---|
| NFR-01 | **Performance (mobile, lab):** LCP ≤ 1.8 s, CLS ≤ 0.05, TBT ≤ 150 ms, ≤ 70 KB gzip of JS per tool route. Enforced by Lighthouse CI | docs/04 §8 |
| NFR-02 | **Accessibility:** WCAG 2.2 AA basics (labels, focus, contrast, keyboard, 44 px targets) | docs/04 §9 |
| NFR-03 | **Security: every MUST rule in `security/` is a release blocker.** That covers: no raw HTML, validated query params, the `_headers` CSP, a locked and cooled-down dependency supply chain, 2FA everywhere and the triple-locked ads switch | security/README |
| NFR-04 | **Privacy:** no personal data collected; calculator inputs never leave the browser; analytics only with consent where required | security/05 §1 |
| NFR-05 | **Reliability:** a static export on a CDN, deployed from Git, with one-click rollback to the last good deployment | docs/04 §12, security SEC-DEP-11 |
| NFR-06 | **Maintainability:** calculators are pure tested functions; content is typed data validated at build; the build is reproducible (`npm ci`, pinned Node) | docs/04 §4, §10 |

## 7. Monetization
| ID | Requirement | Detail in |
|---|---|---|
| MON-01 | **Affiliates first:** relevant programmes only (3D printers and filament, candle supplies, pizza tools, bowling gear), each disclosed next to the link. Check that the programme accepts Pakistan payees before applying | security/05 §3, playbook §0.2h |
| MON-02 | **Apply to AdSense only when every §0.2 gate condition holds:**<br>• 8–10 tools;<br>• 4–6 guides;<br>• trust pages;<br>• no placeholders;<br>• the consent banner live;<br>• 4+ consecutive weeks of GSC clicks | playbook §0.2b |
| MON-03 | **Choosing pages for the AdSense rule:** a standalone tool page needs CPC ≥ $0.50 or volume ≥ 10K. Guides are exempt | docs/01 §4 |
| MON-04 | **Ad placement:** never in the inputs or result area; reserved heights; labelled. **One AdSense account, never risked** | security/05 §2 |

## 8. Milestones
| Phase | When | Done when |
|---|---|---|
| 0. Decide | Week 0 | §11 decisions closed |
| 1. Scaffold | Build week 1 | Next.js app per docs/04, with security CI (security/06 §3), the `_headers` file and the SRI test (security/02 §4). CI green; Lighthouse budgets met |
| 2. Port the 3D tool | Build weeks 1–2 | 7 ported tests green; the QA checklist passes |
| 3. Build batch 1 | Build weeks 2–4 | All 8 tools and 10 guides pass docs/05 §9 and security/07 §1 |
| 4. Publish wave 1 | Launch day | Indexed (GSC URL Inspection). Sitemap submitted to GSC and Bing; IndexNow sent |
| 5. Publish wave 2 | Launch + 2–3 weeks | Wave 1 indexed, with no GSC errors |
| 6. Batch 2 | After the day-30 gate | ≤ 10 URLs a week |
| 7. AdSense | When the §0.2 gate is met (months 4–8 [P]) | Approved; the phase D CSP live |
| 8. Continue or kill | Months 9–12 | Gate decision recorded |
| 9. Sale decision | Months 12–24 | §9 checklist complete; marketplace research done [U] |

**Effort** [P]: scaffold 2–4 days; each tool 1–2 days; each guide 0.5–1 day. Time the first 3 tools, then re-plan (docs/07 §1).

## 9. Flip-readiness (built in from day one)
The buyer pays for **verifiable, transferable, low-maintenance income**. These requirements make the exit possible without changing how the site ranks.

| ID | Requirement | Why a buyer cares |
|---|---|---|
| FLIP-01 | **Separate site accounts:** a dedicated site email; Cloudflare, GitHub, GA4 and GSC owned through it; AdSense stays personal and is removed at sale | Clean transfer (security/04 §4) |
| FLIP-02 | **A monthly P&L from month 1:** revenue by source (AdSense and each affiliate) and costs (domain, hosting, tools, paid help), plus **your hours**. Save monthly exports or screenshots from AdSense, GA4 and GSC | Proof of earnings and of the time needed to run the site |
| FLIP-03 | **Unbroken analytics:** GA4 and GSC from launch day, never reset or re-created. Significant changes are logged in the Methodology changelog | Buyers discount sites with gaps or resets |
| FLIP-04 | **Clean traffic:** organic only; no bought, incentivised or bot traffic; no manual actions | Due diligence checks the traffic sources (security/05 §2) |
| FLIP-05 | **Clean IP:** original prose, tables and images; licences of code and data recorded | Due diligence (security/07 §3) |
| FLIP-06 | **An operating manual:** docs/, security/ and a "how to add a tool" procedure. Content is data, so a new tool is a spec plus a pure function plus a content file | Lower perceived risk, so a higher price |
| FLIP-07 | **Brand over person:** a brandable domain, with the author identity on About and in bylines only, so the buyer can replace it | Transferable trust |
| FLIP-08 | **A safe handover:** escrow; read-only access during due diligence; the transfer steps in security/07 §4 | Protects you from scams |

## 10. Risks
| Risk | Effect | Mitigation |
|---|---|---|
| Google renders its own calculators in AI Overviews | Lost clicks in a category | Quarterly check; stop building in an affected category (docs/07 §2); lean on original data and guides |
| **Commodity maths and date queries are zero-click** (fraction, statistics, time duration: Google widgets and AI Overviews; the reason v1 excluded them) | High impressions, low CTR | Target the researched long-tail intents (mixed fractions, "what do I need on my final", specific expressions); show step-by-step working and computed tables a widget doesn't give; judge these categories on GSC clicks at month 3 |
| Scaled-content or doorway judgement on programmatic pages | Site-wide demotion | Demand gate, unique computed content per instance, a place in the hierarchy (docs/10 §5); ≤ 10 new URLs a week after launch |
| AI Overviews answer the guide questions | Low guide CTR | Plan on the base case; mostly tool-led traffic; original data |
| New-domain ranking is slow | Revenue later than hoped | Gates and a stop-loss; plan on the base case, not the optimistic one |
| Pets pages are YMYL-adjacent | Trust or liability | No vet claims without a real reviewer; cite sources; "estimate, not veterinary advice" (docs/01 §5) |
| AdSense rejection or a ban | Engine lost | The §0.2 gate; security/05 §2; the triple ads lock |
| Supply-chain or account compromise | Spam injected, rankings and AdSense lost | security/03 and 04; rollback playbook (security/07 §2) |
| Publishing too fast reads as scaled content | Site-wide demotion | ≤ 10 URLs a week; every page has a real tool or data |
| Solo time runs out | The project stalls | Hours budget and stop-loss (§11) |
| Payouts from Pakistan | Revenue can't be received | Verify AdSense and each affiliate's payout method before applying (docs/08 §3) |

## 11. Open decisions (yours)
1. ~~Brand and domain~~ **Closed 2026-10-10: calculatorporch.com, brand "Calculator Porch".** You buy it through Cloudflare Registrar, after a USPTO check for "PORCH" marks (docs/01 §7).
2. ~~Hosting~~ **Closed 2026-10-10: Cloudflare Pages.** This matches security/02 and 04 §12.
3. ~~Your real name and contact email~~ **Closed 2026-10-10: author Ahsan Khan.** Public contact is contact@calculatorporch.com, forwarded to the owner's private inbox (address kept out of this repo; docs/01 §6).
4. **Weekly hours budget and stop-loss N** (playbook §0.1). Needed for G7, since buyers ask about hours too.
5. **Optional vet reviewer** for the pets pages.
6. **Local security tools:** permission to install the Semgrep CLI, `uv` and gitleaks once the code exists (security/06 §4).
7. **Optional Anthropic plugins:** Security Guidance (while coding) and claude-security (deep scans) (security/06 §5).

## 12. Definition of done
**A page ships when:**
- it passes the docs/05 §9 QA checklist;
- every [U] constant on it is verified;
- the security/07 §1 deploy checklist is ticked.

**A phase ends when** its row in §8 is met.
