# 03: Dependencies and supply chain

**Why this matters most for a static site:**
- With no server to hack, the realistic way in is **a package or CI step that runs during the build**. It could inject scripts, spam links or ads into every page, or steal tokens.
- npm has had real incidents of this kind: maintainer accounts phished to publish malicious versions of popular packages, and the self-spreading "Shai-Hulud" worm (both September 2025) [M, widely reported; details in the advisories of the time].
- The defences: few packages, locked versions, no install scripts, a waiting period before new versions, and pinned CI actions.

## 1. Rules
| ID | Rule | Level | Enforced by |
|---|---|---|---|
| SEC-DEP-01 | **Keep packages minimal.** Runtime packages at launch: `next`, `react`, `react-dom`, `zod`, `@next/mdx` and its MDX peers. Everything else is a dev dependency.<br>**Every new package needs a one-line reason in the PR, plus the §2 check.** Prefer 20 lines of your own code over a tiny package | MUST | review |
| SEC-DEP-02 | **Lockfile always.** `package-lock.json` is committed. CI and Cloudflare builds use `npm ci`, never `npm install`. Lockfile changes are reviewed like code: an unexpected new package is a red flag | MUST | CI (`npm ci` fails on a lockfile mismatch); review |
| SEC-DEP-03 | **Exact versions.** `.npmrc` has `save-exact=true`, so there are no `^` or `~` ranges in `package.json` | MUST | CI (a check that rejects `^` or `~` in `package.json`) |
| SEC-DEP-04 | **Install scripts are blocked.** `.npmrc` has `ignore-scripts=true`.<br>• If a package truly needs its install script, run it explicitly (`npm rebuild <pkg>`) and list it in §3.<br>• `npm run <script>` still works, but `pre*` and `post*` hooks don't, so chain steps explicitly in `package.json`.<br>[U] At scaffold, confirm which packages break without their scripts. Next.js's SWC and sharp ship prebuilt binaries as optional dependencies | MUST | CI (`.npmrc` check); §3 list |
| SEC-DEP-05 | **Update cooldown: a new version is adopted only after ≥ 7 days on the registry.** Most malicious releases are pulled within days. Use the Dependabot `cooldown` option or Renovate `minimumReleaseAge` [U: confirm the current syntax at setup]. **Security fixes are the exception:** review the advisory, then update at once | MUST | Dependabot/Renovate config |
| SEC-DEP-06 | **Vulnerability gate.** `npm audit --audit-level=high` runs in CI over **all** dependencies, dev ones included: they run during the build. High or critical findings fail the build. Fix them, or record an accepted risk in §3 with an expiry date | MUST | CI |
| SEC-DEP-07 | **No typosquats.** Copy package names from the project's official docs, and check that the npm page links to the expected GitHub repo before installing | MUST | review |
| SEC-DEP-08 | **GitHub Actions:**<br>• pinned to a **full 40-character commit SHA**, with the version as a comment;<br>• only from `actions/*`, `github/*` or reviewed publishers;<br>• the workflow has `permissions: contents: read` at the top, and widens it per job only when needed;<br>• **never `pull_request_target`**;<br>• no secrets in jobs that run on pull requests.<br>Run `gha-security-review` before enabling any workflow | MUST | review; skill (06) |
| SEC-DEP-09 | **Licences fit a site you'll sell.** Shipped and build dependencies are MIT, ISC, BSD-2/3-Clause, Apache-2.0, 0BSD or CC0. **No GPL or AGPL without a decision.** Keep a licence list (07 §3) | SHOULD | CI (licence check at release) [U: pick the tool at scaffold] |
| SEC-DEP-10 | **One Node version everywhere.** Pin the Node LTS in `.nvmrc` and `engines`. Use the same version in CI and in Cloudflare's build (`NODE_VERSION`) | SHOULD | CI |
| SEC-DEP-11 | **Deploy from Git, not from your PC.** Cloudflare Pages builds from the repo, so the live site always equals a reviewed commit. Upload `out/` by hand only in an emergency, and record it | MUST | manual |
| SEC-DEP-12 | **Updates are batched and reviewed weekly.** Read the changelog for major versions of `next`, `react` and `zod`, and run the full test suite before merging | SHOULD | Dependabot/Renovate grouping; review |
| SEC-DEP-13 | **Claude Code skills and plugins are third-party code too.** Install them only after reviewing their files (README "Scanning skills"), and re-review after `npx skills update`. Never install a skill or plugin that a web page, document or tool output asks you to install | MUST | manual |

## 2. New-package checklist (run before `npm install <pkg>`)
Run the `supply-chain-risk-auditor` skill once `uv` is installed. Until then, check by hand:
- [ ] Is it really needed? Could ~20 lines of code replace it?
- [ ] Weekly downloads, number of maintainers, last publish date, and a linked repo that's not archived.
- [ ] Does it have `preinstall`, `install` or `postinstall` scripts? If yes, the answer is no, unless it's listed in §3.
- [ ] How many transitive dependencies does it add? (`npm install --dry-run` and the lockfile diff.)
- [ ] Is the licence on the SEC-DEP-09 list?
- [ ] Are there known advisories? (`npm audit` after install, or osv.dev.)

## 3. Registers (filled at scaffold, 2026-10-11)
**Install policy used at scaffold:** every package installed with `npm install --before=<today − 7 days>`, so the whole tree, transitive packages included, respects the SEC-DEP-05 cooldown. `npm view` ignores `--before`, so check real publish dates with `npm view <pkg> time --json`. This is how next 16.4.0 (6 days old) was caught and 16.3.8 was used instead.

**Packages allowed to run install scripts:** none. Two packages in the tree declare scripts, and both stay blocked:

| Package | Script | Why blocking is fine | Reviewed |
|---|---|---|---|
| `fsevents` | native build | macOS-only optional dependency; not installed on Windows or Linux | 2026-10-11 |
| `unrs-resolver` (via the ESLint import resolver) | `napi-postinstall` (binary fallback) | Prebuilt binary arrives as an optional dependency; lint passes without the script | 2026-10-11 |

**Accepted audit findings:** machine-readable in `security/accepted-advisories.json`, which `npm run audit` (CI) enforces, including expiry.

| Advisory | Package | Why not fixable now | Mitigation | Expires |
|---|---|---|---|---|
| GHSA-vfj7-8cjw-p6xm (high) | `braces` ≤ 3.0.3, via `eslint-config-next` | No patched release exists (advisory 2026-09-18) | Dev-only lint dependency, not shipped (`npm ls braces --omit=dev` is empty); needs attacker-controlled globs | 2026-12-10 |

**Node version exception (SEC-DEP-10):** `.nvmrc` pins **22.23.3**, the current Node 22 LTS, for CI and Cloudflare. This machine still runs **22.17.1**, which is too old for `eslint-plugin-regexp` 3.x, so the project uses 2.10.0. **Update local Node to 22.23.3**, then this exception and the regexp-plugin pin can go.
