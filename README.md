# Calculator Porch

Free online calculators for math, money, building, food and everyday life: **[calculatorporch.com](https://calculatorporch.com)** (not live yet).

**What it is:** a production calculator site in the calculator.net / omnicalculator.com class:
- an Omni-style taxonomy and a config-driven calculator engine;
- programmatic SEO families gated by demand;
- keyword clustering with build-enforced cannibalization rules;
- FAQ markup and `llms.txt`;
- an AdSense green-flag screen.

**Stack:**
- **Framework:** Next.js 16 (App Router), built as a static export.
- **Language and UI:** TypeScript, React 19, Tailwind CSS 4.
- **Validation:** zod.
- **Tests:** Vitest and Playwright.
- **Hosting:** Cloudflare Pages.

## Start here
| Read | For |
|---|---|
| [docs/00-prd.md](docs/00-prd.md) | Goals, scope (wave 1: 40 tools), requirements, risks, flip-readiness |
| [docs/10-site-architecture-pseo.md](docs/10-site-architecture-pseo.md) | **Architecture:** competitor research, taxonomy, URLs, link system, families, engine, AdSense screen |
| [docs/11-keyword-clusters.md](docs/11-keyword-clusters.md) | **Generated** keyword clusters: every researched keyword mapped to one URL |
| [docs/02-keyword-map.md](docs/02-keyword-map.md) | How the registry works, URL changes from v1, cannibalization rules |
| [security/](security/README.md) | **Rules every change must follow.** A MUST rule blocks a release |
| [CLAUDE.md](CLAUDE.md) | Working rules and the "add a calculator" recipe |

## Commands
```bash
npm ci                 # install exactly the lockfile; install scripts are blocked (.npmrc)
npm run dev            # local dev server
npm run build          # static export to out/, then flatten-segments and check-out (link graph, llms, ads)
npm run serve          # serve out/ on :4321 with public/_headers applied
npm run verify         # everything CI runs: repo checks, audit, lint, types, unit tests, build, e2e
npm run check:release  # publish gate: fails while any tool has pending verifications or < 2 sources
```

## Status (2026-10-11)
- **Platform: done.**
  - taxonomy and routes (category, calculator, instance, A–Z, author, editorial policy);
  - the config engine and its Explainer;
  - the link graph;
  - FAQ markup, `llms.txt` / `llms-full.txt`, the cannibalization report;
  - 4 programmatic families;
  - the daily-rebuild workflow.
- **Built: 10 of the 40 wave-1 calculators**, plus all **9 researched programmatic instances**. The 10 calculators:
  - fraction;
  - day counter;
  - random number generator;
  - percent off;
  - tip;
  - standard deviation;
  - square footage;
  - gravel;
  - dog pregnancy;
  - 3D printing cost.
- **Checks:** `npm run verify` passes (122 unit tests, the post-build link-graph checks, 25 e2e tests). Every page is ≤ 2 clicks from home.
- **Publishing is blocked** by `check:release` until each tool's `pendingVerification` items are cited (≥ 2 sources each).
- **Next:**
  1. the remaining 30 wave-1 calculators (docs/11 §1);
  2. the 10 launch guides (MDX);
  3. source verification;
  4. connecting Cloudflare Pages and adding the `CLOUDFLARE_DEPLOY_HOOK_URL` secret.
