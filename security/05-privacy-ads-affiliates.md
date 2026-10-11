# 05: Privacy, ads and affiliates

**Why these rules exist:**
- **The AdSense account is the one asset you can't replace** (playbook §0.2). One account, never risked.
- **Privacy rules are the law** in the EU, UK and US states. Google also requires them before it serves ads to European visitors.

## 1. Privacy
| ID | Rule | Level | Enforced by |
|---|---|---|---|
| SEC-PRIV-01 | **Collect no personal data at launch.** No forms, accounts, comments or uploads. Contact is a `mailto:` link (SEC-CODE-21) | MUST | review |
| SEC-PRIV-02 | **Calculator inputs never leave the browser.** If analytics records a "calculated" event, it sends only the tool slug, **never input values or results** (a puppy's weight, a due date) | MUST | review; test (e2e intercepts analytics requests and asserts no input values) |
| SEC-PRIV-03 | **Analytics and ads respect consent.**<br>• GA4 runs with Consent Mode, defaulting to *denied* for EEA, UK and Swiss visitors until they accept, through a **Google-certified CMP** [U: playbook §0.2f, verify the current requirement].<br>• The cookieless Cloudflare Web Analytics can run without a banner [U: confirm for your audience], but must still be listed in the privacy policy | MUST | manual (07 §1); CSP phase order (02 §5: CMP before analytics and ads) |
| SEC-PRIV-04 | **The privacy policy matches reality.** It lists every third party actually running (analytics, CMP, ads, affiliate networks), what each collects and how to opt out. It's updated **in the same PR** that adds the third party | MUST | review (05 §4 allow-list ↔ `/privacy/`) |
| SEC-PRIV-05 | **No personal data in URLs.** Query parameters carry only calculator inputs (SEC-CODE-05) | MUST | review |
| SEC-PRIV-06 | **No fingerprinting, no session recording, no heatmap tools** without a written decision and a privacy-policy update | MUST | review |

## 2. AdSense: protect the account (playbook §0.2)
| ID | Rule | Level | Enforced by |
|---|---|---|---|
| SEC-ADS-01 | **No AdSense code, `ads.txt` line or Auto ads before the §0.2 gate**:<br>• 8–10 tools;<br>• 4–6 guides;<br>• trust pages;<br>• no placeholders;<br>• the consent banner live;<br>• 4+ consecutive weeks of GSC clicks | MUST | review; CI (fails if `ads.txt` or `adsbygoogle` appears in `out/` while `NEXT_PUBLIC_ADS_ENABLED` isn't `true`) |
| SEC-ADS-02 | **Ads load only on the real site, for real visitors**, through the three locks in SEC-CODE-22:<br>• `NEXT_PUBLIC_ADS_ENABLED=true` is set **only in Cloudflare's Production environment**, never in Preview, local `.env` or CI;<br>• Playwright, Lighthouse and Firecrawl runs never load ads | MUST | test (e2e on the CI build asserts zero ad-network requests); manual (Cloudflare env-var check, 07 §1) |
| SEC-ADS-03 | **Never generate invalid traffic:**<br>• never click your own ads, or reload pages to see them;<br>• never view the live site through a VPN or proxy once ads are on;<br>• ask family and friends not to click.<br>For testing, use Google's documented ad-test mechanism [U: verify, playbook §0.2d] | MUST | habit |
| SEC-ADS-04 | **No bought or incentivised traffic.** No traffic exchanges, pop-under networks, bots, "click here" ad labels or pages made to drive ad clicks | MUST | habit |
| SEC-ADS-05 | **Placement:**<br>• never inside or between the calculator inputs and the result;<br>• slot heights reserved (no layout shift, 04 §8);<br>• labelled "Advertisement";<br>• keep the ad count modest. The page exists for the tool | MUST | review; Lighthouse CLS budget |
| SEC-ADS-06 | **Watch for attacks** (a competitor or bot "click-bombing" to get the account banned):<br>• check the AdSense Policy center weekly;<br>• check GA4 for sudden spikes from one source, country or device.<br>**If you see a spike:** set `NEXT_PUBLIC_ADS_ENABLED=false` and redeploy, which takes minutes. Then report it through Google's invalid-clicks contact form (07 §2) | MUST | manual (weekly once ads are on) |
| SEC-ADS-07 | `ads.txt` holds exactly your publisher ID line. **Remove it at the sale** (07 §4) | MUST | manual |

## 3. Affiliates
| ID | Rule | Level | Enforced by |
|---|---|---|---|
| SEC-AFF-01 | **Every affiliate link:**<br>• has `rel="sponsored nofollow noopener"`;<br>• has a visible disclosure next to it;<br>• is covered by the `/disclosure/` page (FTC; the UK ASA wants an "Ad" label, per playbook §0.2g) | MUST | test (`content.test.ts`: every link from the affiliate registry has the `rel`) |
| SEC-AFF-02 | **Affiliate links are plain links.** No affiliate JavaScript widgets or iframes, no automatic redirects, no cookie stuffing (setting affiliate cookies without a click) | MUST | CSP (02); review |
| SEC-AFF-03 | **All affiliate URLs live in one typed registry** (`content/affiliates.ts`: programme, URL, pages used on, date added), so they can be audited, disclosed and swapped by a buyer | SHOULD | review |
| SEC-AFF-04 | **Check each programme accepts Pakistan payees, and its payout method, before applying** (playbook §0.2h). PayPal-only programmes won't work | MUST | manual |

## 4. Third-party allow-list
Nothing third-party loads unless it's in this table, and each entry has its CSP (02 §5) and privacy-policy line.

| Service | Purpose | Phase | Loads scripts? | Sets cookies? | Needs consent? | CSP updated | Privacy policy updated |
|---|---|---|---|---|---|---|---|
| *(none at launch)* | | | | | | | |

**Candidates for later, each needing a PR that fills a row:**
- a Google-certified CMP;
- GA4 or Cloudflare Web Analytics;
- AdSense (after the gate).
