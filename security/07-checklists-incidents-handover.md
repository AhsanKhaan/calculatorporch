# 07: Checklists, incidents and the sale handover

## 1. Checklists
### Every production deploy
- [ ] CI is green, including `sast`, `secrets` and `npm audit` (06 §3).
- [ ] `/security-review` was run on the branch, and no High finding is open.
- [ ] No new third party. Or, if there is one, **the same PR** updated the CSP (02 §5), the allow-list (05 §4) and `/privacy/`.
- [ ] New packages passed 03 §2, and the lockfile diff has no surprise packages.
- [ ] Live preview headers checked with `curl -sI <preview-url>`: CSP, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, and `X-Robots-Tag: noindex` on `pages.dev` (SEC-HDR-03, SEC-HDR-04).
- [ ] Cloudflare env vars: `NEXT_PUBLIC_ADS_ENABLED` is unset (or `false`) in **Preview**. In **Production** it's `true` only after the §0.2 gate.
- [ ] `updated` dates were changed only for real content changes (04 §12).

### First launch (once)
- [ ] 2FA on every account in 04 SEC-ACC-01, with recovery codes stored offline.
- [ ] Domain: transfer lock, auto-renew, two expiry alerts, WHOIS privacy, DNSSEC (SEC-ACC-04).
- [ ] DNS: no unused records; CAA records added (SEC-ACC-05).
- [ ] HSTS at `max-age=86400`, then raised to one year after a clean week (SEC-HDR-05).
- [ ] `/.well-known/security.txt` is live (SEC-HDR-06).
- [ ] The MDN HTTP Observatory scan passes, except the accepted risk in 02 §6 (SEC-HDR-07).
- [ ] The SRI test (02 §4) was done and its result recorded in 02 §6.
- [ ] GitHub secret scanning and push protection are on, where available (SEC-SEC-02).
- [ ] The asset register exists (SEC-ACC-08).

### Before the AdSense application (the §0.2 gate)
- [ ] A full audit: the `semgrep` skill in "run all" mode, `supply-chain-risk-auditor` and `/security-review`, plus the claude-security plugin if installed (06 §5).
- [ ] The CMP works for EEA and UK visitors. **Test it before any ad code exists.**
- [ ] `/privacy/` and `/disclosure/` match what's running (SEC-PRIV-04).
- [ ] The CSP for phase D has been prepared from Google's current guidance (02 §5).
- [ ] You've re-read 05 §2, and everyone in the household knows not to click the ads.

### Monthly
- [ ] Merge dependency updates that have passed the cooldown (SEC-DEP-05), then run the full tests.
- [ ] Run `supply-chain-risk-auditor` over the lockfile and the `semgrep` skill in "run all" mode.
- [ ] Review account access: remove helpers who no longer need it, and review active sessions and OAuth apps on GitHub, Google and Cloudflare.
- [ ] DNS: no new or unknown records. Check the domain expiry date.
- [ ] Once ads are on: **weekly** AdSense Policy center checks and GA4 spike checks (SEC-ADS-06).

## 2. Incident playbooks
**Rule:** contain first, investigate second. Keep notes with times; they go into the asset register and, later, the sale disclosures.

| Incident | First 15 minutes | Then |
|---|---|---|
| **A secret or token leaked** (repo, chat, screenshot) | Revoke or rotate it at the provider. **Do this before anything else** | Purge it from git history. Check the provider's audit log for use. Record what happened |
| **The site shows something you didn't publish** (spam links, unknown script, defacement) | In Cloudflare Pages, **roll back to the last good deployment** (instant). Revoke any deploy tokens and change the GitHub password | Find the cause: a dependency (diff the lockfile), a CI action, or an account. Fix it and redeploy from a clean `npm ci`. Check GSC → Security issues, and request a review if the site is flagged |
| **Account takeover** (email, registrar, Cloudflare, GitHub, Google) | Use your recovery codes and the provider's account-recovery flow. Ask the registrar to lock the domain | Review DNS records, sessions, OAuth apps, forwarding rules and the GitHub deploy keys. Rotate everything that account could reach |
| **A malicious or compromised package is in the lockfile** | Remove it or pin a safe version. Rotate anything the build environment could read | Rebuild from a clean cache, check the deployed JS for injected code, and add the package to the 03 §3 notes |
| **AdSense invalid-traffic warning, or a click spike** | Set `NEXT_PUBLIC_ADS_ENABLED=false` in Production and redeploy (ads are off within minutes) | Analyse the GA4 sources. Report through Google's invalid-clicks contact form. Turn ads back on only once the source is understood |
| **GSC manual action or security issue** | Read the exact report | Fix, document and request reconsideration (playbook §0.2i) |

## 3. What a buyer will check (keep these ready from day one)
- A **licence list** of shipped dependencies (SEC-DEP-09) and of data sources (the `license` field, SEC-CODE-16).
- The **asset register** (SEC-ACC-08): every account, its owner email and renewal dates.
- A clean **security history**: no manual actions, no AdSense violations, and any incidents documented with their fixes (§2).
- This `security/` folder and the CI config, as proof the site is low-risk to operate.

## 4. Sale handover (the security steps)
1. **During negotiation:**
   - share read-only access only: GA4 Viewer, GSC restricted user, screenshots of AdSense;
   - **never share passwords**;
   - use an escrow service, and transfer nothing until the funds are in escrow;
   - expect fake "buyers" who send "verification" links. Treat them as phishing (SEC-ACC-07).
2. **Remove AdSense:**
   - delete the ad code by setting the ads flag to `false`, then remove the code in a commit;
   - delete the `ads.txt` line;
   - remove the site from your AdSense account. **AdSense can't be transferred** (04 §4).
3. **Transfer the assets** [U: confirm each platform's current procedure on the day]:
   - **Domain:** follow the registrar's steps for DNSSEC (usually turn it off, or move the DS records, before a change of registrar or nameservers). Then remove the transfer lock and give the auth code, or push the domain inside the same registrar.
   - **GitHub:** repo transfer.
   - **GA4 and GSC:** add the buyer as owner or admin, then remove yourself.
   - **Cloudflare:** move the project or zone, or hand over the dedicated account.
   - **Site email:** change its recovery phone and email to the buyer's, then hand it over.
4. **After the transfer:**
   - revoke all of your sessions, tokens and member roles;
   - revoke the buyer's due-diligence access if the sale falls through;
   - take your personal details off the site, since the buyer replaces the author identity.
