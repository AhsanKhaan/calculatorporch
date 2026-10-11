# 06: Scanning, tools and CI

## 1. What runs when
| When | What's checked | Tool | Blocks? |
|---|---|---|---|
| **While writing code** | The secure-coding rules (01) | `security-and-hardening` skill (Claude loads it when building input handling, storage or integrations); ESLint security rules in the editor (§2) | — |
| **Every commit** (pre-commit hook) | Secrets in staged files; lint | gitleaks (`gitleaks git --staged`) [U: confirm the subcommand for the installed version]; ESLint on staged files | **Yes** |
| **Every push / PR** (CI, §3) | Lockfile install, audit, lint, types, unit/schema/content tests, build, e2e, SAST, secrets in history and in `out/` | GitHub Actions | **Yes** |
| **Adding a package** | Supply-chain risk (03 §2) | `supply-chain-risk-auditor` skill | **Yes** if it reports high risk |
| **Adding or changing a CI workflow** | Workflow injection, permissions, unpinned actions | `gha-security-review` skill | **Yes** |
| **Before each production deploy** | The diff, headers, ads switch | `/security-review` (built in) on the branch; checklist 07 §1 | **Yes** for High findings |
| **Monthly** | A full SAST pass; the whole lockfile; accounts and DNS | `semgrep` skill in "run all" mode; `supply-chain-risk-auditor`; 07 §1 monthly list | — |
| **Before applying to AdSense, and before listing the site for sale** | A full audit | All of the above, plus a deep scan (§5) | **Yes** |

## 2. ESLint security rules
Merge these into the Next.js flat config at scaffold. [U] Confirm the plugin names and flat-config exports for the versions you install.
```js
// eslint.config.mjs (security section)
import noUnsanitized from 'eslint-plugin-no-unsanitized';
import regexp from 'eslint-plugin-regexp';

export default [
  // ...the Next.js / React / TypeScript configs come first
  noUnsanitized.configs.recommended,           // SEC-CODE-01: innerHTML, insertAdjacentHTML, document.write
  regexp.configs['flat/recommended'],          // SEC-CODE-20: unsafe or inefficient regexes
  {
    rules: {
      'no-eval': 'error',                      // SEC-CODE-03
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',                // SEC-CODE-04
      'react/no-danger': 'error',              // SEC-CODE-01
      'react/jsx-no-script-url': 'error',
      'react/jsx-no-target-blank': ['error', { allowReferrer: false }], // SEC-CODE-13
      'no-console': ['warn', { allow: ['error'] }],                     // SEC-CODE-18
      'no-restricted-syntax': ['error', {
        selector: "CallExpression[callee.property.name=/^(pushState|replaceState)$/]",
        message: 'SEC-CODE-09: no history changes on input (back-button hijacking).',
      }],
    },
  },
  {
    files: ['lib/calculators/**', 'components/**'],
    rules: {
      'no-restricted-globals': ['error',      // SEC-CODE-10
        { name: 'fetch', message: 'SEC-CODE-10: calculators make no network calls.' },
        { name: 'XMLHttpRequest', message: 'SEC-CODE-10' },
      ],
    },
  },
  {
    files: ['lib/calculators/**', 'lib/seo/**'],
    rules: { '@typescript-eslint/no-explicit-any': 'error' }, // SEC-CODE-19
  },
  {
    files: ['components/JsonLd.tsx'],          // the one allowed exception (SEC-CODE-02)
    rules: { 'react/no-danger': 'off' },
  },
];
```

## 3. CI security steps (GitHub Actions sketch)
**Before enabling it:**
- Replace every `<sha>` with the real full commit SHA of the release you choose. **Never use a tag alone.**
- Run `gha-security-review` over the file.
```yaml
name: ci
on:
  push: { branches: [main] }
  pull_request:                       # never pull_request_target (SEC-DEP-08)
permissions:
  contents: read                      # least privilege for every job

jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@<sha>  # vX.Y.Z
        with: { persist-credentials: false }
      - uses: actions/setup-node@<sha> # vX.Y.Z
        with: { node-version-file: .nvmrc, cache: npm }
      - run: npm ci                   # .npmrc: ignore-scripts=true, save-exact=true
      - run: npm audit --audit-level=high          # SEC-DEP-06
      - run: npm run lint && npm run typecheck
      - run: npm test                 # unit + schema + content (incl. _headers file checks)
      - run: npm run check            # scripts/check-content.ts (keyword map, MDX bans, provenance, _headers limits)
      - run: npm run build            # NEXT_PUBLIC_ADS_ENABLED is unset here
      - run: npm run check:out        # no ads code / ads.txt in out/ (SEC-ADS-01)
      - run: npm run test:e2e         # XSS params, history, no ad requests, CSP console clean

  sast:
    runs-on: ubuntu-latest
    container: semgrep/semgrep@sha256:<digest>   # pin the image digest
    steps:
      - uses: actions/checkout@<sha>
        with: { persist-credentials: false }
      - run: semgrep scan --config p/ci --config p/typescript --config p/react --config p/nextjs --config p/secrets --error

  secrets:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@<sha>
        with: { fetch-depth: 0, persist-credentials: false }
      # gitleaks over the full history: a pinned release binary with a checksum check, or a pinned container [U: choose at scaffold]
```
**Header tests:**
- CI checks the `public/_headers` file itself (SEC-HDR-03, SEC-HDR-08).
- The **live** headers of the preview deployment are checked in the release checklist (07 §1). `next build` alone doesn't apply `_headers`.

## 4. Local tools to install when the code exists (ask first)
| Tool | Why | Windows install [U: verify the current command] |
|---|---|---|
| Semgrep CLI | Needed by the `semgrep` skill for local scans | `py -m pip install semgrep`. If native Windows support is limited, run it in WSL or rely on the CI `sast` job |
| `uv` | Runs the `supply-chain-risk-auditor` scripts | `py -m pip install uv` or `winget install astral-sh.uv` |
| gitleaks | Pre-commit secret scan | `winget install Gitleaks.Gitleaks`, or a release binary from GitHub |
| Git hooks runner | Runs gitleaks and ESLint before each commit | `lefthook` or `simple-git-hooks` as a dev dependency. **Install the hooks with an explicit command**, because SEC-DEP-04 blocks `prepare` scripts |

## 5. Optional: Anthropic security plugins (claude.ai plugin directory)
Both are published by Anthropic and installed from the plugin card, not by Claude.

| Plugin | What it adds | Trade-off |
|---|---|---|
| **Security Guidance** | Pattern-based warnings while Claude edits code, plus an LLM review of the diff at the end of each turn | Runs on every turn, so it costs extra tokens. Worth it during the build phase |
| **claude-security** | An on-demand deep vulnerability scan with verified findings and suggested patches | Use it before the AdSense application and before a sale, not on every change |
