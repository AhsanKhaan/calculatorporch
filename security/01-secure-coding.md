# 01: Secure coding rules (TypeScript, React, Next.js)

**Where the risk is on this site:** almost all of it sits in the browser. Visitors can type anything into calculators and URLs, and the build runs third-party code. These rules close those paths. They match the architecture in [docs/04](../docs/04-technical-spec.md).

## 1. HTML injection (XSS)
| ID | Rule | Level | Enforced by |
|---|---|---|---|
| SEC-CODE-01 | **Never write raw HTML.** No `dangerouslySetInnerHTML`, `innerHTML`, `outerHTML`, `insertAdjacentHTML` or `document.write`. **The one exception is `components/JsonLd.tsx`**, which must follow SEC-CODE-02 | MUST | lint (`react/no-danger`, `no-unsanitized`) |
| SEC-CODE-02 | **JSON-LD is serialized safely.** Run `JSON.stringify`, then escape `<` → `<`, `>` → `>`, `&` → `&`, U+2028 → ` ` and U+2029 → ` `. Otherwise a FAQ answer containing `</script>` breaks out of the tag | MUST | test (`schema.test.ts` feeds `</script><script>alert(1)</script>` through a FAQ answer and asserts the built HTML has no second `<script>`) |
| SEC-CODE-03 | **No dynamic code.** No `eval`, `new Function`, or `setTimeout`/`setInterval` with a string argument | MUST | lint (`no-eval`, `no-implied-eval`, `no-new-func`) |
| SEC-CODE-04 | **No `javascript:` URLs.** Every URL in content (sources, affiliate links, guide links) is validated at build: `z.string().url()`, and the protocol must be `https:` (internal links are relative) | MUST | test (zod schema in `content.test.ts`); lint (`react/jsx-no-script-url`) |

## 2. Calculator inputs and the "Copy link" query parameters
| ID | Rule | Level | Enforced by |
|---|---|---|---|
| SEC-CODE-05 | **Query parameters are untrusted.** The Copy link feature (04 §5.4) reads **only an allow-list of the tool's own input keys**. Each value is parsed with the tool's zod schema (number range, enum). Unknown keys are ignored, and invalid values fall back to the defaults | MUST | test (e2e: open a tool with `?__proto__[x]=1&constructor=1&weight=<script>alert(1)</script>`; assert the default result, no console error, and no `<script>` in the DOM) |
| SEC-CODE-06 | **Never build objects keyed by user input.** Assign each known key explicitly, or use `Object.create(null)` or a `Map`. Don't spread a parsed query string into an object (`{...params}`). This prevents prototype pollution | MUST | review |
| SEC-CODE-07 | **Inputs are bounded.** Every numeric input has `min`, `max` and `step` in its zod schema, and the same limits on the `<input>`. `NaN`, `Infinity`, negative values and `1e308` show a "check your inputs" message, never `NaN` or a frozen tab. Loops have fixed bounds (for example, bowling has at most 21 rolls) | MUST | test (unit edge cases per calculator: 0, min, max, max+1, NaN, `"1e308"`, empty) |
| SEC-CODE-08 | **Parameter values are never echoed into HTML, URLs or the `<title>`.** The page shows the computed result, not the raw string | MUST | review; e2e (SEC-CODE-05) |
| SEC-CODE-09 | **No history changes while typing.** No `history.pushState` or `replaceState` on input. Back-button hijacking is a Google spam policy, and it's also in 04 §5.3 | MUST | lint (`no-restricted-syntax`, see 06 §2); e2e (`history.length` unchanged) |

## 3. Network, storage and third parties
| ID | Rule | Level | Enforced by |
|---|---|---|---|
| SEC-CODE-10 | **No network calls from calculators.** All data (`data/*.json`) is bundled at build. No `fetch` or `XMLHttpRequest` in `lib/calculators/` or `components/` | MUST | CSP `connect-src 'self'` (02); lint (`no-restricted-globals` for `fetch` in those folders) |
| SEC-CODE-11 | **`localStorage` is used only for the unit and theme preferences.** Every read and write is wrapped in try/catch. A value read back must be on an allow-list (`'imperial' \| 'metric'`, `'light' \| 'dark' \| 'system'`). Never store inputs, results or anything personal | MUST | review; unit test of the storage helper |
| SEC-CODE-12 | **No third-party scripts, iframes, fonts or images at launch.** Anything third-party is added only through the allow-list in 05 §4, **in the same PR as** its CSP change (02) and its privacy-policy change | MUST | CSP (02); review |
| SEC-CODE-13 | **External links:**<br>• `target="_blank"` links carry `rel="noopener noreferrer"`;<br>• affiliate or paid links carry `rel="sponsored nofollow noopener"` (05 §3);<br>• source links open in the same tab unless there's a reason | MUST | lint (`react/jsx-no-target-blank`); test (`content.test.ts` checks affiliate `rel`) |

## 4. Content (MDX guides and data files)
| ID | Rule | Level | Enforced by |
|---|---|---|---|
| SEC-CODE-14 | **MDX is trusted, local content only.** Guides are compiled at build from files in the repo. No remote MDX, no runtime compilation, and no MDX from visitors | MUST | review |
| SEC-CODE-15 | **MDX may import only from `components/mdx/*`.** Raw `<script>`, `<iframe>`, `<object>`, `<embed>`, inline `on*=` handlers and `javascript:` are banned in `.mdx` | MUST | CI (`scripts/check-content.ts` greps every `.mdx` for those patterns and fails the build) |
| SEC-CODE-16 | **Every `data/*.json` file carries provenance and a licence:** `source`, `source_url`, `retrieved` and `license`. This extends 04 §6 with `license`, which a buyer will ask about (07 §3) | MUST | CI (`check-content.ts`) |

## 5. Errors, logging and type safety
| ID | Rule | Level | Enforced by |
|---|---|---|---|
| SEC-CODE-17 | **No stack traces, env values or file paths on any page.** `not-found.tsx` is static, and calculator errors show a plain message | MUST | review; e2e |
| SEC-CODE-18 | **No `console.log` in production.** Use `compiler.removeConsole` in production builds (keep `console.error`). Never log input values | SHOULD | lint (`no-console`: warn); build config |
| SEC-CODE-19 | **TypeScript `strict` and `noUncheckedIndexedAccess`.** No `any` in `lib/calculators/` or `lib/seo/` | SHOULD | `tsc` in CI; lint (`@typescript-eslint/no-explicit-any` in those folders) |
| SEC-CODE-20 | **Regexes that touch user input are linear-time** (no nested quantifiers such as `(a+)+`). Prefer `Number()` and zod over regex for parsing numbers | SHOULD | lint (`eslint-plugin-regexp`, recommended config) [U, confirm the plugin at scaffold] |

## 6. Contact and feedback
| ID | Rule | Level | Enforced by |
|---|---|---|---|
| SEC-CODE-21 | **Contact and "report an error" use a plain `mailto:` link** to the site's own address (04 SEC-ACC-03). **No forms at launch.** A form needs its own rules file first (spam, storage, privacy, a server or third party) | MUST | review |
| SEC-CODE-23 | **CSV exports can't carry formulas.** Every cell goes through `lib/csv.ts`: a cell starting with `=`, `+`, `-`, `@`, a tab or a CR that isn't a plain number is prefixed with `'`, so Excel and Sheets treat it as text (CSV/formula injection). Added 2026-10-11 | MUST | test (`tests/lib.test.ts`) |

## 7. Ads switch (code side; the policy is in 05)
| ID | Rule | Level | Enforced by |
|---|---|---|---|
| SEC-CODE-22 | **`AdSlot` renders nothing unless all three locks hold:**<br>1. `NEXT_PUBLIC_ADS_ENABLED === 'true'`;<br>2. `window.location.hostname` equals the production host;<br>3. the user agent isn't an automated test browser. Playwright sets a flag such as `navigator.webdriver`, and `AdSlot` refuses to run when it's present | MUST | test (e2e on the CI build, where the ads flag is unset, asserts zero requests to `googlesyndication.com`, `doubleclick.net` and `googleadservices.com`) |
