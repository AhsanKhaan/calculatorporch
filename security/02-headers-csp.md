# 02: Security headers and Content Security Policy (CSP)

## 1. Facts this file is built on (verified 2026-10-10)
- **A static export ignores `headers()` in `next.config`, and it can't use Proxy (middleware)** [M, Next.js 16.4 docs, "Static exports → Unsupported features"]. So **every header goes in `public/_headers`**, which Cloudflare Pages serves. Vercel would use `vercel.json` instead.
- **Nonce-based CSP needs dynamic rendering**, which a static export doesn't have [M, Next.js 16.4 docs, "Content Security Policy"]. For CSP without nonces, Next.js's own example uses `script-src 'self' 'unsafe-inline'`. Its alternative is experimental **SRI**, which hashes script *files*.
- **App Router pages contain inline scripts** (the `self.__next_f.push(...)` payload). [U] A strict `script-src 'self'` will likely block them even with SRI. That's why the launch policy below allows `'unsafe-inline'`, and why §4 tests the strict version at scaffold.
- **Cloudflare Pages `_headers` limits** [M, Cloudflare docs]:
  - up to **100 header rules**;
  - **2,000 characters per line**;
  - the file applies only to static assets, not to Pages Functions (we have none).
- **Correction to docs/04 §2:** "a CSP that allows only your own origin" would break hydration. Use this file instead (04 §2 now points here).

## 2. Rules
| ID | Rule | Level | Enforced by |
|---|---|---|---|
| SEC-HDR-01 | All security headers live in `public/_headers` (§3). `headers()` and `proxy.ts` aren't used | MUST | review |
| SEC-HDR-02 | The CSP matches the current phase in §5. **Adding a third party changes the CSP in the same PR** (SEC-CODE-12) | MUST | review; e2e (no CSP violations in the console on every page type) |
| SEC-HDR-03 | The headers are tested in two places:<br>• in CI, a unit test parses `public/_headers` and asserts the CSP contains `object-src 'none'` and `frame-ancestors 'none'`, plus `nosniff`, `Referrer-Policy` and `Permissions-Policy`;<br>• before release, the **live** preview headers are checked with `curl -sI` | MUST | test (CI); manual (07 §1) |
| SEC-HDR-04 | Preview and `*.pages.dev` hosts send `X-Robots-Tag: noindex` (§3), so Google never indexes a duplicate copy of the site | MUST | test (the same `_headers` unit test); manual (`curl -sI` on a `pages.dev` URL, 07 §1) |
| SEC-HDR-05 | HSTS is ramped up:<br>• `max-age=86400` for the first week on the real domain;<br>• then `max-age=31536000; includeSubDomains`;<br>• **no `preload`**: removal from the preload list takes months, so leave it for the buyer to decide.<br>Set HSTS in **one** place only: `_headers` *or* the Cloudflare dashboard | SHOULD | manual (07 §1) |
| SEC-HDR-06 | Serve `/.well-known/security.txt` (RFC 9116) with `Contact` and `Expires` (≤ 1 year). **Generate it at build from `NEXT_PUBLIC_SITE_URL`**; don't hand-write the domain | SHOULD | test (file exists in `out/` and `Expires` is in the future) |
| SEC-HDR-07 | Run the MDN HTTP Observatory after the first deploy and after each phase change. Fix every failing test except the accepted risk in §6 | SHOULD | manual (07 §1) |
| SEC-HDR-08 | `_headers` stays within Cloudflare's limits: ≤ 100 rules and ≤ 2,000 characters per line | MUST | CI (a small check in `scripts/check-content.ts`) |

## 3. `public/_headers` at launch (phase A)
```text
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; frame-src 'none'; worker-src 'none'; manifest-src 'self'; upgrade-insecure-requests
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
  Cross-Origin-Opener-Policy: same-origin
  X-Frame-Options: DENY

/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

https://:project.pages.dev/*
  X-Robots-Tag: noindex
```
**What each part does:**
- **`style-src 'unsafe-inline'`:** React `style={…}` attributes and `next/font` emit inline styles. The risk is low (no script execution).
- **`X-Frame-Options`:** a legacy backup for `frame-ancestors`. Both stop other sites framing your pages (clickjacking).
- **HTML caching:** HTML stays `max-age=0, must-revalidate`, per 04 §2. Check Cloudflare's default at scaffold, and add a rule only if it differs [U].
- **HSTS:** added to the `/*` block per SEC-HDR-05 once the real domain is live. Not on `pages.dev`.
- **Preview noindex:** [U] Cloudflare may already add `X-Robots-Tag: noindex` to preview deployments. Keep the rule anyway; the SEC-HDR-04 test confirms it.

## 4. The SRI test (at scaffold, about an hour)
The goal is to drop `'unsafe-inline'` from `script-src` if the framework allows it.
1. Set `experimental.sri: { algorithm: 'sha256' }` in `next.config.ts`.
2. On a preview deployment, keep the enforced launch CSP, and **add** `Content-Security-Policy-Report-Only` with the same policy but `script-src 'self'`.
3. In Playwright, open one page of every type: home, hub, tool, guide, About and 404. Type into a calculator, toggle units and theme, and collect console messages that mention "Content Security Policy".
4. **Zero report-only violations, and the calculator still works:** make the strict policy the enforced one and delete `'unsafe-inline'` from `script-src`.
5. **Otherwise:** keep the launch policy, and record the result in §6.

**Per-page hashes** would be possible too: a post-build step that writes each page's inline-script hashes into a `<meta>` CSP. It isn't worth the build complexity while the site has no user-generated content. Revisit it if that changes.

## 5. CSP by phase
Each phase adds sources to the launch policy. **Re-check each vendor's official CSP page on the day you add it** [U]; vendors change domains.

| Phase | Trigger | Add to `script-src` | Add to `connect-src` | Add to `img-src` | Add to `frame-src` |
|---|---|---|---|---|---|
| **A. Launch** | — | — | — | — | — |
| **B. Analytics: GA4** | Consent banner live (05 SEC-PRIV-03) | `https://*.googletagmanager.com` | `https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com` | `https://*.google-analytics.com https://*.googletagmanager.com` | — |
| **B′. Analytics: Cloudflare Web Analytics** (alternative, cookieless) | Enabled in the dashboard | `https://static.cloudflareinsights.com` | `https://cloudflareinsights.com` | — | — |
| **C. Consent banner (CMP)** | Before B, and before any ads | The CMP's documented script domains | The CMP's API domains | If needed | Its iframe domain, if any |
| **D. AdSense** | Playbook §0.2 gate met | Google's current AdSense CSP guidance [U]. It typically needs broad Google ad domains and `frame-src` for ad iframes | Per that guidance | Per that guidance | Ad iframe domains |

**Affiliate links** are plain links and need no CSP change. Affiliate *widgets* aren't allowed (05 SEC-AFF-02).

## 6. Accepted risks (review at every phase change)
| Risk | Why accepted | Mitigation | Review when |
|---|---|---|---|
| `script-src 'unsafe-inline'` | Static export: no nonces; framework inline scripts. **SRI test run 2026-10-11 [M]:** Next.js 16.3.8 gave 12 report-only violations from inline `self.__next_f.push(…)` scripts across 5 page types, **both with and without `experimental.sri`** (SRI added 7 `integrity` attributes to script files but leaves the inline scripts). Under the enforced launch policy: zero violations (e2e) | Raw HTML is impossible (SEC-CODE-01). Parameter values are never echoed (SEC-CODE-08). No third-party scripts at launch (SEC-CODE-12). `connect-src 'self'` limits data exfiltration | Re-run §4 on every Next.js minor or major upgrade; adding any user-generated content; phase D |
| `style-src 'unsafe-inline'` | React style attributes and `next/font` | No script execution through CSS. No third-party CSS | Yearly |
