# 05: SEO and content rules

Condensed from playbook v1.1 (`docs/reference/seo-playbook-v1.1.md`) and the approved plan. Where they differ, docs/01 §5 decides.

## 1. Tool page template (render in this order)
1. **Breadcrumb**: Home › Hub › Tool.
2. **H1** = primary keyword phrasing ("Gravel Calculator"), then a **byline**: real author, "Last reviewed Oct 11, 2026", link to `/methodology/`.
3. **Direct answer** (40–60 words, plain text) in a **"Quick answer" box** at full text contrast (never muted grey): what it computes, the formula in words, and one example number. This is the passage AI answers quote.
4. **Calculator**: prefilled with defaults, result visible above the fold (result first on mobile), presets, unit toggle, Copy link, CSV/print.
5. **What your result means**: 2–4 sentences, plus an assumptions and limits note.
6. **How to use it**: 3–5 numbered steps.
7. **Formula + worked example**: real numbers from the default result, with a cited source for every constant.
8. **Original data table**: computed by the same function (e.g. tons per 100 ft² by depth). This is the information-gain asset.
9. **Guides**: one card per published guide, each linking to a child guide. The count follows docs/02 (0–2 at launch, more as queued guides go live). If a tool has none yet, omit the section; never use "coming soon".
10. **FAQ**: 5–8 questions from real queries (PAA, Semrush questions, forums), each an **H3 with its answer always visible** (not collapsed), so every Q&A is a self-contained, quotable passage. The text matches the FAQPage JSON-LD exactly.
11. **Related tools**: 3–6, same hub first. While a hub has fewer than 3, top up with popular tools under their own heading ("More free calculators"), never labelled "related".
12. **Trust footer**:
    - author (real name) with a link to About;
    - "How we verify" with a link to `/methodology/`;
    - sources (title, publisher, accessed date);
    - "last reviewed" date;
    - "report an error" (email).
    - A topic disclaimer where needed (pets, structural, chemical).

**Length:** 600–1,500 words of unique text. Match the SERP (Omni runs 1,150–2,200, calculator.net 400–1,400 [M22]). These are floors, not targets; **never pad**.

### 1a. Heading structure and typography (every template: tool, instance, category, guide)
- **Headings:**
  - one H1;
  - one H2 per block, in template order, each wrapped in its own `<section>` with a stable fragment id;
  - H3 only inside an H2 (FAQ questions, sub-points); never skip a level.
- **"On this page":** after the calculator, list every H2 as a jump link when a page has ≥ 3 H2s.
- **Descriptive H2s:**
  - "How to use the Gravel Calculator", not "How to use it";
  - each data table gets its own H2 = its caption ("Tons of gravel per 100 sq ft (including 10% extra)").
- **Keyword placement:** put the tool name in **one** H2 ("How to use the …"), not in every heading. Tool pages measure 0.6–1.6% exact-match density [M] after this change. There is no target density; never add repeats.
- **Type scale:**
  - prose 17 px, line-height 1.7, measure ≤ 74ch;
  - H1 32–48 px (home hero up to 62 px), H2 22–27 px, H3 18 px, all fluid with `clamp()`, tight negative tracking;
  - **system font stack only** (SF Pro, Segoe UI Variable, Roboto): 0 font bytes. A self-hosted 29 KB Geist subset measured **+1.1 s LCP** on throttled mobile in an A/B test on 2026-10-11 [M], so no web fonts.

### 1b. Visual system and motion (2026-10-11 redesign)
- **Style:** minimal "Swiss" layout. Slate neutrals, one teal brand colour, and a teal→indigo gradient used sparingly (hero accent, result number, quick-answer bar, answer-card border). Light and dark themes come from `prefers-color-scheme`. All tokens live in `app/globals.css` `:root`; components never use raw hex.
- **Components:**
  - translucent header (sticky ≥ 721 px);
  - calculator as one elevated card (inputs | tinted result panel);
  - "Quick answer" card;
  - tool cards with category icons (the whole card is the link);
  - pill chips for related links;
  - an author monogram;
  - a column footer.
- **Icons:** inline SVG paths drawn for this site (`components/Icon.tsx`). No icon library, no emoji.
- **Motion (CSS only, no JS animation library):**
  - hover lift on cards (`transform` + shadow);
  - a 280 ms "pop" on the headline result after the visitor edits (never on first paint, so LCP is unaffected);
  - scroll-in "rise" on cards via `animation-timeline: view()` where supported. Transform only: content is never invisible to crawlers.
  - Everything is off under `prefers-reduced-motion`.
  - Lottie and other JSON animations are not used. Their runtime alone outweighs all the CSS motion here.
- **Layout ≥ 1100 px:** content column + 300 px rail. The rail holds the sticky "On this page" and, later, the 300×600 ad.
- **Ad slots** (`components/AdSlot.tsx`):
  - server-rendered with a fixed height, so a filled ad never shifts the page;
  - render **nothing** while `NEXT_PUBLIC_ADS_ENABLED` isn't `"true"`.
  - Positions:
    - tool pages: after the whole calculator (280 px), mid-content after the explainer (280 px), and the rail (600 px, desktop only);
    - home: after the popular tools;
    - category pages: after the first group;
    - instance pages: after the table.
  - Never between the inputs and the result (SEC-ADS-05).
- **Readability details:**
  - links in running text are underlined (colour alone fails WCAG 1.4.1);
  - formulas are one equation per line, wrapping with a hanging indent;
  - data tables right-align numeric columns only, and scroll inside their frame, never the page;
  - the mobile header is one swipeable nav row;
  - optional outputs with no input (e.g. a cost with no price) are hidden, not "$0.00".
- **Dates in text:** "Oct 11, 2026" (`shortDate`), ISO only in `datetime` attributes and data.

## 2. Guide template ("blog section")
- **URL:** `/{hub}/{tool}/{guide}/`. H1 = an informational phrasing. **No "calculator" in the title or H1.**
- **Answer first** in the opening paragraph, and **a link to the parent tool within the first ~150 words** (anchor = the tool's primary keyword).
- **Types (pick 1 per guide):**
  - how-to;
  - formula explainer;
  - data comparison using your own computed numbers;
  - small original data study;
  - seasonal refresh.
- **Length:** 800–1,500 words; longer only if the SERP demands it. A visible FAQ is optional (3–5).
- **Images:** your own diagrams or charts (SVG preferred), with alt text. No stock filler. Lazy-load anything below the fold.

## 3. On-page rules
- **Title:** ≤ 60 chars, primary keyword first, plus a benefit (see docs/02). Add the brand only if it still fits.
- **Meta description:** ≤ 155 chars, an action plus outputs.
- **One H1 per page.** H2s follow the template. Use the primary keyword naturally in the H1, the first 100 words and one H2.
- **URL:** lowercase, hyphens, trailing slash, no dates. **Never change it after launch** (use a 301 if you must).
- **Canonical:** self, absolute. Query-param share links canonicalize to the base URL.
- **US English, imperial first.** Numbers carry units; dates use ISO in data and "Oct 5, 2026" in text.

### 3a. Search limits: Google's rules vs. rules of thumb (checked 2026-10-11)
Popular "SEO limits" cheat sheets mix Google's documented limits with rules of thumb, and some are wrong. Follow this table.

**Google's documented limits:**
- **robots.txt:** Google reads the first 500 KiB [U].
- **Sitemap:** at most 50 MB uncompressed and 50,000 URLs [U].
- **Redirects:** Googlebot follows up to 10 hops [M: Google crawler docs]. Ours: 0–1 (trailing slash).
- **Core Web Vitals "good":** LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 [U].
- **Disavow file:** 2 MB and 100,000 lines [U]. We don't use one; it's only for manual actions.

**Not hard limits:**
- **Title and meta description:** Google sets no length limit [M: Search Central]. Results truncate by device width, so keep **title ≤ 60** and **description ≤ 155** (§3) for display, not for ranking.
- **One H1:** Google says multiple H1s are fine. We use exactly one because it keeps the template clean.

**Rules of thumb, not Google rules:**
- **Keyword density** (e.g. "1–2%"): no such target exists. Never add repeats to hit a number (§1a).
- **Alt text ≤ 125 characters:** a screen-reader convention. Describe the image and keep it short.
- **Images < 100 KB:** a performance target. We use inline SVG.
- **Anchors of 2–5 words:** a style guide. Use descriptive anchors (§6).
- **Internal links "100–150 per page":** a ceiling, not a target. `check-out.mjs` enforces ≤ 150; pages run 24–54 [M].

**Analytics:**
- **GA4 data retention:** standard properties default to **2 months**; the maximum is 14 months, and 26–50 months is GA4 360 only [M: GA Help]. Set it to 14 months on day one. Explorations need the history, and so does the sale (docs/00 flip-readiness).

**Google Business Profile limits:** don't apply. This is an online-only site with no premises, so it isn't eligible for GBP.

## 4. E-E-A-T (honest version)
- **Real-name byline** on every tool and guide, linking to an About page with your real name, background and contact.
- **No personas and no fake credentials.** **No "Reviewed by" unless a real expert agrees in writing.** Without a reviewer, use "How we verify".
- **`/methodology/`:**
  - every formula and constant with its source;
  - the unit test cases (inputs → outputs);
  - the data refresh dates;
  - **a public changelog of corrections**.
- **Pets pages:** veterinary and peer-reviewed sources; "estimate, not veterinary advice"; no feeding, dosage or medical claims.
- **Rafter page:** "geometry only; sizing per local code or an engineer".
- **Candle page:** follow supplier fragrance-load and flash-point limits.
- **First-hand experience** where you genuinely have it (e.g. a 3D printing cost breakdown from your own prints). Never invent experience.

## 5. AEO / GEO (AI Overviews, ChatGPT, Perplexity, Copilot)
- AI visibility follows ranking: do §1–4 first.
- **Server-render** the direct answer, formula, worked example, tables and FAQ, because many AI crawlers don't run JS.
- **Passage-level citability:**
  - each H2 section opens with a one-sentence answer;
  - sections are self-contained;
  - figures carry a source and date.
- **Original data** is the strongest citation lever: EIA electricity by state, computed tables, small studies.
- **Entity consistency:** one brand name everywhere, Organization schema, the same author name.
- **Bing Webmaster + IndexNow** (feeds Copilot; reportedly ChatGPT search [U]).
- **robots.txt allows** OAI-SearchBot, PerplexityBot and Claude-SearchBot (see docs/04 §7).
- **Measure:**
  - GA4 "AI" channel regex `chatgpt\.com|perplexity\.ai|claude\.ai|gemini\.google\.com|copilot\.microsoft\.com`;
  - Bing AI Performance report;
  - a quarterly panel of 10 queries × 2 engines, logging who gets cited.
- **Rejected as hype:** "FAQ schema is the #1 AEO win", listicle or "vs" pages built for ChatGPT, keyword-variant doorway pages.

## 6. Internal linking
- **Hub-and-spoke:** home → hubs → tools → guides, and guides → tool (both ways).
- Every tool links to its breadcrumb, its hub, 3–6 related tools and its guides. Every guide links to its tool plus 1–2 sibling guides.
- **Orphan rule** (build-enforced): every page has ≥ 3 inbound links, is ≤ 3 clicks deep, and appears in the sitemap.
- **Anchors:** descriptive. For tools, the primary keyword or a close variant. No sitewide footer link stuffing.

## 7. Link building ($0, safe), in priority order
1. **Replace dead or shutting tools:** find 404ing calculator links on resource pages and offer yours.
2. **Genuine community help** (niche subreddits, forums: r/3Dprinting, r/candlemaking, r/Pizza, r/Bowling, r/woodworking, r/dogs). Follow each community's rules; no link drops.
3. **Resource-page pitches:** makerspaces, clubs, breed clubs, bowling leagues, homebrew clubs.
4. **Original data studies:** e.g. "What it costs to run a 3D printer in every US state" (EIA). These earn education and media links, the categories the giants' strongest links come from [M30].
5. At 8–10 tools: **one** launch post (Product Hunt **or** Show HN).
- **Anchors:** ≥ 70% branded or naked URL. No link spikes, PBNs, paid links, exchanges or expired domains.

## 8. AdSense and affiliate safety (playbook §0.2): one account, never risk it
- **No AdSense code** until all of these hold:
  - 8–10 tools passing quality;
  - 4–6 guides;
  - trust pages (About, Contact, Privacy, Methodology, Disclosure);
  - no placeholders;
  - consent banner live;
  - **4+ consecutive weeks of organic clicks in GSC**.
- **Affiliates first.** Disclose next to every link, and keep a `/disclosure/` page. Check that each programme accepts Pakistan payees (PartnerStack, Impact, CJ/Payoneer, Awin look workable; PayPal-only won't work; Amazon Associates [U]).
- `NEXT_PUBLIC_ADS_ENABLED=false` in dev, preview and every automated run. Never click your own ads; never view them through a VPN.
- When ads arrive: none inside the inputs or result, slot heights reserved, a Google-certified CMP for EEA, UK and Switzerland.

## 9. Pre-publish QA checklist (each page)
- [ ] Primary keyword unique in the registry; title ≤ 60; description ≤ 155; one H1; canonical correct.
- [ ] Default result present in the **raw HTML** (view-source), plus the formula, table and FAQ in the HTML.
- [ ] Every constant cited; every [U] in docs/03 verified and replaced with a cited value.
- [ ] Unit tests for the calculator pass, including the cited reference cases.
- [ ] JSON-LD validates (Rich Results Test / validator.schema.org); FAQ text matches; no ratings.
- [ ] ≥ 3 inbound internal links; every published guide linked both ways with its tool; related tools present.
- [ ] Security deploy checklist passed (`security/07` §1).
- [ ] Mobile: no horizontal scroll at 375 px; result visible without scrolling; inputs ≥ 16 px.
- [ ] Typing doesn't change the URL or history (Back button works).
- [ ] Lighthouse mobile meets the budgets (docs/04 §8).
- [ ] Byline (real name), sources, last-reviewed date, disclaimer (if a topic needs one), error-report link.
- [ ] No placeholders ("BRAND", "TODO", "[Your name]", lorem, "coming soon").

## 10. Never do
- PBNs, paid links without `rel="sponsored"`, link exchanges, mass directories, expired-domain redirects.
- Personas, fake credentials or reviews; self-made ratings in schema.
- Keyword-variant doorway pages. **Programmatic pages are off** until 8–10 flagship tools exist and the month-6 gate passes (playbook §7).
- 3–5 AI posts a day. AI drafts are allowed only with human verification of every formula and number.
- Back-button hijacking; ads in the input or result area; AdSense before the gate.
- Cracked or group-buy SEO tools. Automated Google SERP scraping.
- Copying competitors' prose, tables or datasets. Re-derive everything from primary sources.
