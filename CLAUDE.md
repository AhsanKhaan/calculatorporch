# Calculator Porch: instructions for coding agents

## Always
- **Follow `security/`.** Every MUST rule blocks a merge. Cite rule IDs (e.g. `SEC-CODE-05`) in commits and reviews.
- **Scope and content decisions:** `docs/00-prd.md` wins on scope. `docs/02` owns keywords (one primary keyword per URL; `content/keyword-map.json`). `docs/04` owns architecture. `docs/05` owns page templates. The SEO/AdSense policy is `docs/reference/seo-playbook-v1.1.md`.
- **Label every number** you add to docs or content: [M] measured, [R] range, [P] proxy/estimate, [U] unverified.
- **Before saying a change is done, run** `npm run verify`.

## Never
- **Ads:**
  - add AdSense code, `ads.txt` or any ad script before the playbook §0.2 gate;
  - set `NEXT_PUBLIC_ADS_ENABLED=true` anywhere except Cloudflare Production after the gate.
- **Third parties:** add a script, iframe, font or image without updating `public/_headers` (CSP), `security/05` §4 and `/privacy/` in the same change.
- **Content:**
  - invent facts, credentials, reviewers or reviews;
  - publish a page with items left in `pendingVerification`;
  - use placeholders ("TODO", "lorem", "coming soon").
- **Dependencies:**
  - install one without the security/03 §2 checklist;
  - use versions published less than 7 days ago (`npm install --before=<date>`);
  - remove `ignore-scripts=true` from `.npmrc`.
- **Browser and markup:**
  - change `history` while a visitor types;
  - read query params outside each tool's allow-list;
  - use `dangerouslySetInnerHTML` outside `components/JsonLd.tsx`.
- **Accounts:** log in to the owner's accounts (Cloudflare, GitHub, Google, registrar).

## Working rules (set by the owner)
- **Blockers mean ask first:** login or auth, CAPTCHAs, permission denials, tools that aren't loaded or authenticated, paid or keyed APIs, rate limits. Stop and ask, with a one-line diagnosis and 2–3 options, before spending effort on workarounds.
- **Legitimate data and tools only.**

## Adding a calculator (engine pattern, docs/10 §6)
1. **Registry first:** the URL must exist in `content/keyword-map.json` with `status: launch` and `adsense: green`. To add one, change the page plan in `research/calc-site/cluster.mjs` (research pack) and re-run it. Never hand-edit the JSON.
2. **Spec:** `lib/calculators/<id>.spec.ts` (fields, outputs, pure `compute`), and pure maths in `lib/calculators/<id>.ts` if it is reused.
3. **Explainer:** `lib/calculators/<id>.explain.ts` (formula, worked example computed by the same code, an original data table, assumptions). Register it in `lib/calculators/explains.ts`.
4. **Island:** `components/calculators/<id>.tsx` (copy any existing wrapper), registered in `components/calculators/index.ts`.
5. **Content:** `content/calculators/<slug>.ts` (keyed by URL; FAQs chosen from the row's `faqCandidates`), added to `content/calculators/index.ts`.
6. **Tests:** reference cases in `tests/calculators/`, plus a line in `tests/helpers/specs.ts`.
7. **Verify:** run `npm run verify`. Then run `npm run check:release` before publishing.

**Programmatic instances:** only through `lib/families/` with a researched `instance` row (the docs/10 §5 gate).
