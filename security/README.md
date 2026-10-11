# Security rules for the calculator site (2026-10-10)

These are the rules every line of code, every dependency and every account for the site must follow.
- **Why they exist:** they protect the things that make the site earn money and stay sellable: the AdSense account, the domain, the rankings and the clean history a buyer will check.
- **Where they fit:** [docs/00-prd.md](../docs/00-prd.md) §7 makes every **MUST** rule here a product requirement. The tech spec ([docs/04](../docs/04-technical-spec.md)) points here for headers and CSP.

## How to use this folder
| When | Read |
|---|---|
| Writing any code | 01 (code), 02 (headers), 03 (adding a package) |
| Setting up accounts, the domain or deploys | 04 |
| Adding analytics, a consent banner, ads or affiliate links | 05 |
| Setting up CI, or choosing which scanner to run | 06 |
| Before every production deploy, during an incident and at sale | 07 |

**Rule format:**
- **ID:** for example `SEC-CODE-04`. Cite it in commits and reviews ("fixes SEC-CODE-04").
- **Level:**
  - **MUST** blocks the merge or release.
  - **SHOULD** means do it unless there's a written reason in the PR.
- **Enforced by:** what catches a violation: `lint`, `test`, `CI`, `review` (/security-review or a human) or `manual` (a checklist in 07).
- **Tags:** used as in the rest of the pack: **[M]** measured · **[R]** range · **[P]** proxy/estimate · **[U]** unverified (verify before relying on it).

## Threat model (what we protect, from what)
The site is a **static export**: no server, no database, no logins, no payments, no user uploads. That removes most of the OWASP Top 10 (SQL injection, broken auth, IDOR, SSRF). What's left:

| Asset | Why it matters to the goal | Main threats | Rules |
|---|---|---|---|
| **AdSense account** (one, personal, can't be transferred) | The revenue engine. A ban is effectively permanent | Invalid traffic (your own clicks, test runs with ads on, bot "click-bombing"), ad code before the §0.2 gate, policy violations | 05 |
| **Domain, DNS, hosting and code accounts** | The whole business; transferred at sale | Account takeover (no 2FA, phishing), domain expiry, DNS hijack, dangling records | 04 |
| **Site integrity** (what visitors and Google see) | Rankings, trust, AdSense approval | A compromised npm package or GitHub Action injecting scripts or spam links; XSS through query parameters; a leaked deploy token | 01, 02, 03 |
| **Visitor privacy** | GDPR/CCPA, and Google's consent requirement for ads | Tracking without consent; personal data in URLs or analytics; third-party leakage | 05 |
| **Code, data and history** (GSC, GA4, revenue) | What the buyer pays for and audits | Leaked secrets in git; unlicensed code or data; business assets mixed into personal accounts | 03, 04, 07 |

**Out of scope until it exists:** server code, forms that store data, user accounts, payments and the crowdsourced "submit your real cost" data (playbook §12, month 4+). **Each needs its own rules file before anyone builds it.**

## Files
| File | Covers |
|---|---|
| [01-secure-coding.md](01-secure-coding.md) | TypeScript, React and Next.js rules: XSS, inputs and query params, JSON-LD, MDX, links, storage, errors |
| [02-headers-csp.md](02-headers-csp.md) | The Cloudflare Pages `_headers` file, CSP by phase, HSTS, `security.txt` |
| [03-dependencies-supply-chain.md](03-dependencies-supply-chain.md) | npm packages, lockfile, install scripts, update cooldown, GitHub Actions, licences, Claude skills |
| [04-secrets-accounts-domain.md](04-secrets-accounts-domain.md) | Env vars and secrets, 2FA, domain and DNS hardening, keeping site assets separate for the sale |
| [05-privacy-ads-affiliates.md](05-privacy-ads-affiliates.md) | Consent, analytics, AdSense invalid-traffic rules, affiliate links, the third-party allow-list |
| [06-scanning-and-tools.md](06-scanning-and-tools.md) | Which scanner or skill runs when; ESLint security rules; the CI security job |
| [07-checklists-incidents-handover.md](07-checklists-incidents-handover.md) | Release checklist, incident playbooks, security steps of the flip handover |

## Scanning skills installed (2026-10-10)
All were installed globally for Claude Code with `npx skills add … -g -a claude-code`. Each was reviewed before use: its scripts contact only package registries and advisory databases, and its delete commands only touch temporary folders.

| Skill | Source [M, 2026-10-10] | Use it for | Needs |
|---|---|---|---|
| `security-and-hardening` | addyosmani/agent-skills (104K★ repo; 55K installs) | Secure-coding guidance while building features | Nothing |
| `semgrep` | trailofbits/skills (7.4K★; 8.8K installs) | Static analysis (SAST) of the codebase, with an approval step before it runs | **Semgrep CLI (not installed yet)** |
| `supply-chain-risk-auditor` | trailofbits/skills (7.5K installs) | Auditing npm dependencies: advisories, abandoned packages, publisher concentration, install scripts | **`uv` Python runner (not installed yet)** |
| `gha-security-review` | getsentry/skills (1K★; 4.6K installs) | Reviewing `.github/workflows/` before CI is enabled | Nothing |
| `/security-review` | Built into Claude Code | Reviewing the pending changes on a branch | A git repo (none yet) |

**Still to install, when the code exists (ask first):** the Semgrep CLI, `uv` and `gitleaks` (06 §4).
