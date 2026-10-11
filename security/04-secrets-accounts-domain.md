# 04: Secrets, accounts and the domain

**Why accounts matter most:** in a static site the accounts *are* the attack surface. Whoever controls your email, registrar, Cloudflare, GitHub or Google account controls the site and its income. They're also what you hand over at a sale, so set them up from day one in a way that can be transferred cleanly.

## 1. What's secret and what isn't
**Everything in a static export is public.** Anything in the built JavaScript, including every `NEXT_PUBLIC_*` variable, can be read by anyone.

| Item | Secret? | Where it lives |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_BRAND`, `NEXT_PUBLIC_CURRENT_BATCH`, `NEXT_PUBLIC_ADS_ENABLED`, `NEXT_PUBLIC_GA_ID` | No (public by design) | Cloudflare Pages environment variables. **Production and Preview are set separately** (05 SEC-ADS-02). Placeholders go in `.env.example` |
| IndexNow key | No: IndexNow requires it to be served at `/<key>.txt` | `public/<key>.txt` (04 §3) |
| Cloudflare API token | **Yes** | **Avoid needing one:** use Cloudflare Pages' Git integration (SEC-SEC-04) |
| Logins for the registrar, Cloudflare, GitHub, Google (AdSense, GA4, GSC), Bing, affiliate networks and payout services | **Yes** | A password manager only. Never in the repo, chat, docs or screenshots |
| 2FA recovery codes | **Yes** | Offline: printed, or an encrypted file not synced to the repo |

## 2. Secret rules
| ID | Rule | Level | Enforced by |
|---|---|---|---|
| SEC-SEC-01 | **Nothing secret in client code or `NEXT_PUBLIC_*`.** If a value must stay private, it can't be used by this static site | MUST | review; CI (gitleaks over `out/` after the build) |
| SEC-SEC-02 | **`.gitignore` covers `.env*`, except `.env.example`.** gitleaks runs before every commit and in CI. GitHub secret scanning and push protection are on [U: confirm what's available for your repo type and plan] | MUST | pre-commit; CI |
| SEC-SEC-03 | **A secret that reached a remote is compromised.** Rotate it at the provider *first*, then purge it from history and check the provider's logs (07 §2) | MUST | manual |
| SEC-SEC-04 | **Deploy without a long-lived token.** Connect the GitHub repo in Cloudflare Pages, so Cloudflare pulls the code and no token sits in GitHub. If a token is ever needed: scope it to Pages Edit on one account, give it an expiry, and keep it only in GitHub Actions secrets | MUST | manual |

## 3. Account rules
| ID | Rule | Level | Enforced by |
|---|---|---|---|
| SEC-ACC-01 | **2FA on every account, starting with email**, because email resets everything else. The full list: email, registrar, Cloudflare, GitHub, Google (AdSense, GA4, GSC), Bing, affiliate networks, Payoneer or bank.<br>Prefer **passkeys or a hardware key**, then an authenticator app. **Never SMS only.** Store recovery codes offline | MUST | manual (07 §1) |
| SEC-ACC-02 | **A unique, generated password for every account**, kept in a password manager | MUST | manual |
| SEC-ACC-03 | **Keep the site's assets separate from your personal life, so they can be sold** (§4) | MUST | manual |
| SEC-ACC-04 | **Domain protection:**<br>• registrar transfer lock on;<br>• auto-renew on, with a card that won't expire before renewal;<br>• expiry alerts to two addresses;<br>• WHOIS privacy on;<br>• **DNSSEC on**. Cloudflare can turn it on in one click; it must be turned off in the right order at a transfer (07 §4) | MUST | manual (07 §1) |
| SEC-ACC-05 | **DNS hygiene:**<br>• change DNS only in Cloudflare;<br>• delete records you don't use. A dangling CNAME to a deleted service lets someone else take over that subdomain;<br>• add CAA records that allow only the certificate authorities Cloudflare uses [U: check Cloudflare's current list] | MUST | manual (monthly, 07 §1) |
| SEC-ACC-06 | **Least privilege.** A helper (freelancer, writer) gets their own member account, limited to the task and removed when it's done. **Never share your login.** Claude never logs in to your accounts (project rule) | MUST | manual |
| SEC-ACC-07 | **Phishing hygiene.** Emails about "policy violations", "payment holds" or "verify your site" from Google, AdSense, the registrar or a "buyer": **open the dashboard yourself, never through the email link** | MUST | habit |
| SEC-ACC-08 | **Keep a private asset register:** every account, which email owns it, 2FA type, renewal dates and monthly cost. No passwords in it. Keep it outside the public repo. A buyer will ask for it (07 §4) | SHOULD | manual |

## 4. Set up for the sale from day one (SEC-ACC-03 in detail)
| Asset | Set it up like this | Why |
|---|---|---|
| **Site email** | A dedicated mailbox used only for this site (for example, a new Google account), with 2FA. For public contact, use an address on the domain forwarded with Cloudflare Email Routing [U: confirm it's still free] | The buyer takes over the whole mailbox and every account tied to it, with no personal mail inside |
| **Domain** | An account at the registrar used only for this domain, or easy to push domain by domain | A clean transfer |
| **Cloudflare** | Its own account, created with the site email | Move the zone or project without exposing your other sites [U: confirm Cloudflare's transfer options at sale time] |
| **GitHub** | A repo that holds only the site | GitHub can transfer a repo to another user |
| **GA4 and GSC** | Created with the site email. Your personal account can be added as an extra admin | Add the buyer as owner, then remove yourself. **The history stays with the property**, and that history is what the buyer values |
| **AdSense** | **Stays on your personal, identity-checked account.** It can't be transferred (memory, playbook §0.2c) | At sale: remove the ad code and the `ads.txt` line, and remove the site from your account (07 §4) |
| **Affiliate accounts** | Usually personal or company-bound [U: check each programme's terms on transfers] | The buyer re-applies. Keep affiliate links in one registry so they're easy to swap (05 SEC-AFF-03) |
