# 01: Decisions and verdict

## 1. What we're building
A **single broad-brand calculator website** in **Next.js**.
- **Every page targets its own keyword:** one primary keyword per URL, with no two pages competing.
- **Every tool page has:**
  - a live calculator;
  - a direct-answer passage;
  - a worked example;
  - an original data table;
  - a guides ("blog") section, sized by measured keyword demand in docs/02 (10 guides at launch across 8 tools, with 14 more queued);
  - a visible FAQ;
  - JSON-LD;
  - author, sources and a "last reviewed" date.
- **Goals:** page-one rankings on low-competition keywords, AI-answer citations, then affiliate and (later) AdSense revenue.

## 2. Decisions locked (by you, 2026-10-05)
| Topic | Decision |
|---|---|
| Brand | **One broad brand**, with category hubs (diy, garden, pets, crafts, kitchen, events, fitness, hobby-tech, photo, auto-energy, money, teacher). The 3D tool's old working name, handmadeprice.com, is too narrow |
| Framework | **Next.js** (App Router, TypeScript, static export) |
| Domain | **calculatorporch.com**, brand name **"Calculator Porch"** (decided 2026-10-10). Canonical host is the apex `https://calculatorporch.com/`, with `www` → apex through a single 301. Checks on 2026-10-10: RDAP unregistered; Wayback never captured; no existing "Calculator Porch" brand found [M48] |
| Hosting | **Cloudflare Pages** (decided 2026-10-10). Free; static export; unmetered static bandwidth [M46]. Domain bought through Cloudflare Registrar in the same account |
| Existing 3D tool | **Port into Next.js:** done 2026-10-10 → `lib/calculators/3d-printing-cost.ts` |
| Keyword selection | Low KD, real volume, weak competitors (low DR/PR). Your 58-keyword list was the seed, not the launch list |
| Data sources | Semrush (your account) for KD, volume, CPC, SERP and authority; Google Keyword Planner (your account); live Google checks; Firecrawl |
| Authority metric | Semrush **Authority Score** (stands in for DR). Page-level DA/PA from the SERP extension stands in for PR (Google retired public PageRank in 2016) |

## 3. Verdict vs calculator.net and Omni Calculator
**You can't beat them on their head terms. You can beat them page by page.**

- **Their authority [M30]:**
  - calculator.net: Authority Score 90, 30.3K referring domains, about 37.8M organic visits a month.
  - Omni: AS 84, 30K referring domains, about 16.9M organic visits.
  - A new domain won't outrank them on "concrete calculator", "pace calculator" or "tire size calculator".
- **Where they're weak:**
  1. **Coverage [M21]:** calculator.net has about 203 calculators and covers only **8 of our 58** reference topics. Omni covers 27. **17 topics have no page on either.**
  2. **On-page [M22]:**
     - calculator.net has no JSON-LD, FAQ, author or date, click-to-calculate forms, several calculators stacked per page, and metric defaults.
     - Omni has strong E-E-A-T, but no WebApplication or BreadcrumbList schema, a schema date that doesn't match one visible date, and a heavy ad stack (0.95–1.34 MB of HTML).
  3. **SERPs:** on our Tier 1 keywords, sites with authority **2–30** already hold several top-10 spots [M26][M31][M32].
- **How we win:**
  1. Skip their strongholds and every vendor-owned SERP.
  2. Target low-KD keywords where small sites already rank.
  3. Out-depth them on each topic: a better tool, original data, guides, FAQ, sources.
  4. Ship complete schema and fast pages (no ad stack until the AdSense gate).

## 4. Final selection (details in docs/02)
**Tier 1, launch.** These pass every rule (KD ≤ 30, volume ≥ 1K, weak top 10, score ≥ 60):

| # | Page | Volume | KD | Score |
|---|---|---|---|---|
| 1 | puppy weight calculator | 12,100 | 18 | 68.4 |
| 2 | dog pregnancy calculator | 2,900 | 14 | 67.7 |
| 3 | candle wax calculator | 1,300 | 13 | 66.2 |
| 4 | board foot calculator | 18,100 | 26 | 64.0 |
| 5 | pizza dough calculator | 2,400 | 17 | 62.3 |
| 6 | bowling score calculator | 4,400 | 15 | 61.6 |
| 7 | gravel calculator | 40,500 | 22 | 60.7 |
| 8 | rafter calculator (primary changed by Task D; includes "rafter length calculator" 3,600 / KD 7) | 5,400 | 10 | 60.6 |
| + | **3D printing cost calculator** (already built) | 1,300 | 22 | 52.5 |

- **Batch 1** = Tier 1 minus board foot (CPC $0.01 means near-zero ad value), so 8 tools + 10 launch guides (docs/02 §2; corrected 2026-10-10, see docs/00 §5.1).
- **Batch 2** (updated with Task A, 2026-10-05):
  1. **square footage calculator** (74,000 / KD 18; score 61.1; passes the AdSense rule on volume);
  2. board foot (≈ 33.6K combined with "board feet calculator");
  3. seating chart maker;
  4. concrete slab cost;
  5. add-ons (candle fragrance, filament, 3D print time);
  6. fabric yardage and bike gear ratio.
- **Needs a SERP check first:** **roofing calculator** (12,100 / KD 37 / **$6.27 CPC**), electricity cost, tile, abv.
- **AdSense rule** (your goal): a standalone tool page needs CPC ≥ $0.50 or volume ≥ 10K. Guides are exempt because they carry rankings and AdSense approval. This dropped sourdough, cross stitch, swim pace and priming sugar to "later".

## 5. Deviations from playbook v1.1, and how they're handled
| Playbook says | We're doing | Mitigation |
|---|---|---|
| Astro + islands (§5) | **Next.js static export** (your choice) | Same SSG output. The default result and all content are server-rendered, with one small client island per tool and a JS budget (docs/04 §8) |
| One niche first (§0.1, §1) | **A production calculator.net / Omni-style site** (decided 2026-10-11): 16 categories, 40 tools in wave 1 | Only calculators with existing research; non-YMYL first; AdSense green flag only; the internal-link system, clustering and cannibalization checks are build-enforced (docs/10); publishing is gated (2 launch batches, then ≤ 10 URLs a week) |
| Commodity maths and date topics excluded (v1 research: zero-click risk) | **Included** in wave 1 (fraction, statistics, time duration, day counter…), because they're the core of a calculator.net-class site | Researched long-tail intents, step-by-step working, computed tables; judged on GSC clicks at month 3 (docs/00 §10) |
| `llms.txt` deferred (§12) | **`/llms.txt` + `/llms-full.txt` at launch** (your decision, 2026-10-11) | Generated from the registry; costs almost nothing. Google ignores it [M47]; the benefit for AI crawlers is unverified |
| Programmatic SEO with caution (§7) | **Families gated by demand** (9 instances at launch) | An instance ships only with research evidence and unique computed content, and is linked from its parent (docs/10 §5) |
| Pets parked: needs a credentialed reviewer (§0.1) | Puppy weight and dog pregnancy in batch 1 | **No "Reviewed by" unless a real vet agrees in writing.** Use cited veterinary and peer-reviewed sources, "How we verify", a clear "estimate, not veterinary advice" disclaimer, and no health or dosing claims |
| Probe tool → 3 → 8–10 tools (§12) | Batch 1 = 8 tools | Build all 8, but publish in two waves of 4. Watch indexing (day-30 gate) before adding batch 2 |
| Guides at `/{category}/guides/{slug}/` (§8) | `/{category}/{tool}/{guide}/` (and instances at `/{category}/{tool}/{instance}/`) | You asked for each page to have its own blog section, so nesting guides under their tool makes the cluster explicit. The breadcrumb follows the URL |
| FAQPage schema optional (§6) | Include FAQPage that mirrors the visible FAQ | No Google rich result since 2026-05-07 [U, verify], but it's harmless and parsed by other engines. The visible FAQ is what matters |
| Tool pages about 400–800 words (§3) | 600–1,500, matched to the SERP | Omni runs 1,150–2,200 and calculator.net 400–1,400 [M22]. Floors, not targets; never pad |

## 6. Still open (your decisions)
1. ~~Brand name and domain~~ **Closed 2026-10-10: calculatorporch.com** (§2). Before buying, search the USPTO register for "PORCH" marks; see the §7 note on Porch.
2. ~~Hosting~~ **Closed 2026-10-10: Cloudflare Pages** (§2).
3. ~~Your real name and contact email~~ **Closed 2026-10-10.**
   - **Author:** **Ahsan Khan**, on About, bylines and the `Person` schema. Use exactly the name on your ID and bank, because the AdSense payee must match it (playbook §0.2c).
   - **Email:** the owner's private inbox (address kept out of this repo), as the forwarding destination. Visitors see **contact@calculatorporch.com**, forwarded to it by Cloudflare Email Routing (security SEC-CODE-21, SEC-ACC-03). The Gmail is never published on the site.
4. **Optional vet reviewer** for the pets pages. Without one, use the mitigation above.
5. **Remaining Semrush pulls** (docs/08 §2). They don't block the build.

## 7. Brand, domain and hosting research (2026-10-06; domains updated 2026-10-10)
### Decision 2026-10-10: calculatorporch.com
- **Chosen by you.** Checked the same day: RDAP unregistered; Wayback never captured; no existing "Calculator Porch" brand in a web search [M48].
- **Watch item:** Porch (porch.com, Porch Group, Nasdaq: PRCH) is a home-improvement services brand with cost guides, which is close to our DIY hub. That's why porchcalc and calcporch were ruled out below. In "Calculator Porch" the leading word is the generic "Calculator", so the risk is lower [U].
- **Before buying:** search the USPTO register for live "PORCH" marks in classes 9, 35 and 42.
- **In practice:** always write the brand as "Calculator Porch", never "Porch" on its own, and never use Porch-like logos or colours.

### Update 2026-10-10: the recommendation before your decision [M48]
**Method:**
- RDAP checked 139 .com names, across a "how much" theme, a calc-brand theme, a descriptive theme and coined names.
- The Wayback Machine CDX API checked the free shortlist, **including `robots.txt` captures**. The method was validated on figurekind.com (2003 captures) and calculatorsoup.com (2010).
- A web search looked for existing brands.
- Raw results: `research/domains-2026-10-10.tsv`.

**Correction: figuremill.com is EXCLUDED.** It served a `robots.txt` in March 2007, so it was registered before, and the playbook allows no expired or dropped domains. The 2026-10-06 check used the Wayback availability API, which ignores `robots.txt` captures, so it missed this.

| Rank | Domain | RDAP | Wayback | Read |
|---|---|---|---|---|
| **1** | **HandsOnCalc.com** (+ register **HandsOnCalculator.com** and 301 it) | ✅ | never captured | "Hands-on" fits every hub: DIY, crafts, cooking, 3D printing, pet care, bowling, garden, photo. "Calc" says what the site is. Short (11). No existing brand found |
| 2 | **HomeAndHobbyCalc.com** | ✅ | never captured | The clearest description of the hubs. Longer (16), and "and" fails the radio test ("n"? "&"?) |
| 3 | **HobbyCalculator.com** | ✅ | never captured | Full word "calculator". But "hobby" is a stretch for pets, gravel, rafters and future money/teacher hubs |
| 4 | **FigureNook.com** | ✅ | never captured | The pure-brand option, with no keyword signal |
| ✗ | figuremill.com | ✅ | **2007** | Previously registered (see above) |
| ✗ | porchcalc.com · calcporch.com | ✅ | never captured | Confusable with **Porch** (porch.com, a home-improvement services company), which is the same field as our DIY hub |
| ✗ | tinkercalcs.com | ✅ | never captured | Confusable with Autodesk **Tinkercad** in our 3D-printing hub |
| — | homespuncalc · kitchentablecalc · calchearth · calcfolk · realworldcalcs | ✅ | never captured | Narrower fit or weaker recall |

**Taken in this round** (sample): howmuchcalc, howmuchineed, howmuchtobuy, calcmill, calcnook, calcbench, calcbarn, calcyard, everydaycalcs, dailycalcs, homesteadcalc, backyardcalc, garagecalc, hobbycalcs, makercalcs, tinkercalc, craftycalc, diycalcs.

**Before buying:**
1. Search the USPTO register for "HANDS ON" in classes 9 and 42 (software and online tools) [U].
2. An unregistered .com sells at the standard price, because .com has no registry premium tier [U: confirm at checkout].
3. Buy from a registrar you can pay from Pakistan. Cloudflare Registrar sells at cost.

### Brand / domain shortlist (2026-10-06, superseded by the update above)
**How these were checked:**
- 80 brandable .com names were checked through the Verisign RDAP registry [M45].
- Available ones were checked in the Wayback Machine for **prior use**, because the playbook rule is never to buy expired or dropped domains [M45].
- A web search found no existing brand under these names [M45].
- **Still to do before buying:** a USPTO trademark search, and the registrar's price check (RDAP doesn't show "premium" pricing).

| Rank | Domain | Available (RDAP) | Prior use (Wayback) | Read |
|---|---|---|---|---|
| ✗ | ~~figuremill.com~~ | ✅ | ~~none~~ **2007 capture, found 2026-10-10** | **Excluded:** previously registered (see the update above) |
| 2 | **figurenook.com** | ✅ | none | Friendly, hobby feel; broad. "Nook" is slightly less clear to non-native English readers |
| 3 | **handyfigure.com** | ✅ | none | "Handy" signals practical/DIY. But "handy figure" is a common phrase (and a Fallout toy name), so the brand is weaker as an entity |
| — | figurepatch.com · figureroost.com · figurequill.com · figurehandy.com · tallyhandy.com | ✅ | not checked | Weaker meaning or recall |
| ✗ | figurekind.com | ✅ | **site in 2003** | Excluded: expired domain (playbook) |

**Taken** (sample): figurely, reckonly, calcnest, tallywise, measurely, handycalc, calcsmith, calcforge, figurewise, sumcraft and 60 others.

### Niche-descriptive ("SEO-friendly") options (2026-10-06 [M47])
**Google's position** (SEO Starter Guide): keywords in a domain name "have hardly any effect" on ranking beyond breadcrumbs [M47].
- A descriptive name still helps people decide to click, and it gives natural keyword anchor text when others link using the brand name.
- It must cover **every** hub, not a single tool.

| Rank | Domain | Free (RDAP) | Prior use | Niche fit (batch 1: pets ×2, DIY ×2, crafts, kitchen, sports, 3D) |
|---|---|---|---|---|
| **1** | **HomeAndHobbyCalc.com** | ✅ | never captured | **Covers all 8.** "Home" = DIY, garden, pets, kitchen, energy; "Hobby" = crafts, 3D printing, bowling, brewing, bikes, photo |
| 2 | HobbyCalculator.com | ✅ | never captured | Full word "calculator", short and clean. Fits less naturally for pets and roofing/rafters |
| 3 | MakeItCalc.com | ✅ | not checked (Wayback timed out) | Short and brandable ("make it": baking, candles, 3D prints, building). Weaker for pets and bowling |
| 4 | WeekendCalcs.com | ✅ | never captured | Fits "weekend projects"; weaker for pets |
| — | HomeHobbyCalc.com · HomeAndHobbyCalcs.com · HobbyCalculators.com · WorkbenchCalcs.com · CalcMyHobby.com | ✅ | never captured | Variants or narrower fits |

**Taken:** projectcalc, hobbycalc, makercalc, craftcalc, homecalcs, handycalcs, diycalculators, projectcalculator, makercalculator, craftcalculator, calcworkshop, calcgarage and about 50 more.

### Hosting: Cloudflare Pages vs Vercel (verified 2026-10-06 [M46])
| | **Cloudflare Pages (Free)** | **Vercel Pro** |
|---|---|---|
| Price | **$0** | **$20/mo per deploying seat** (includes $20 usage credit) |
| Commercial use (ads, affiliates) | No non-commercial clause found [U]. The plan page describes Free as "for personal or hobby projects that aren't business-critical" | ✅ allowed. **Vercel Hobby (free) is personal, non-commercial only**, so an ad or affiliate site needs Pro |
| Static bandwidth and requests | **Unlimited / unmetered** | Metered beyond the included credit |
| Builds | 500/month, 1 concurrent | Generous, concurrent |
| Site size limits | 20,000 files per deployment; 25 MiB per file | Effectively not a constraint for this site |
| Next.js support | Static export (`output: 'export'`) works perfectly. Server features would need Workers (metered) | Native: ISR, server components, image optimization, middleware |
| Extras | Same account has DNS, CDN, DDoS protection, Web Analytics (cookieless) and an at-cost domain registrar | Vercel Analytics and Speed Insights (paid add-ons), preview deployments |

**Recommendation: Cloudflare Pages.**
- Our build is a **pure static export** by design (docs/04), so Vercel's server features add nothing.
- Unlimited static bandwidth at $0 is the right fit for an ad-funded site.
- Move to Vercel Pro (or Cloudflare paid) only if we later need server-side features.
- **You** create the Cloudflare account, add the domain and connect the Git repo; I never log in.
