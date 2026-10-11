// Post-build checks over the static export in out/ (docs/04 §6, docs/10 §4, §9; security/05 SEC-ADS-01). Fails the build on any error.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const OUT = 'out';
const errors = [];
const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://calculatorporch.com').replace(/\/+$/, '');

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}
if (!existsSync(OUT)) {
  console.error('check-out: out/ not found. Run `next build` first.');
  process.exit(1);
}
const files = walk(OUT);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const routeOf = (f) => {
  const r = '/' + relative(OUT, f).split(sep).join('/');
  return r.endsWith('/index.html') ? r.slice(0, -'index.html'.length) : r;
};
const pages = htmlFiles.filter((f) => !/[/\\](?:404|_not-found)[/\\.]/.test(f) && !f.endsWith(`${sep}404.html`));
const html = new Map(pages.map((f) => [routeOf(f), readFileSync(f, 'utf8')]));
const linksOf = (h) => [...h.matchAll(/<a [^>]*href="(\/[^"#?]*)/g)].map((m) => m[1]);
const exists = (path) => html.has(path.endsWith('/') ? path : `${path}/`) || existsSync(join(OUT, path)) || existsSync(join(OUT, path, 'index.html'));

// 1. Ads: no ad code or ads.txt until the §0.2 gate (SEC-ADS-01).
const AD_PATTERNS = [/adsbygoogle/i, /googlesyndication\.com/i, /doubleclick\.net/i, /googleadservices\.com/i];
if (!adsEnabled) {
  if (existsSync(join(OUT, 'ads.txt'))) errors.push('ads.txt exists but ads are disabled (SEC-ADS-01)');
  for (const f of files.filter((x) => /\.(?:html|js|txt|json)$/.test(x))) {
    const text = readFileSync(f, 'utf8');
    for (const re of AD_PATTERNS) if (re.test(text)) errors.push(`${relative(OUT, f)}: ad code ${re} while ads are disabled (SEC-ADS-01)`);
  }
}

// 2. Placeholders never ship (docs/04 §6).
const PLACEHOLDERS = [/\bTODO\b/, /lorem ipsum/i, /coming soon/i, /\[your name\]/i, /\[your-email\]/i, /\bSITE_URL\b/, /\bBRAND\b/, /handmadeprice/i, /home and hobby/i];
for (const [route, h] of html) for (const re of PLACEHOLDERS) if (re.test(h)) errors.push(`${route}: placeholder ${re}`);

// 3. One H1, one self-canonical per page.
for (const [route, h] of html) {
  const h1s = h.match(/<h1[\s>]/g)?.length ?? 0;
  if (h1s !== 1) errors.push(`${route}: expected 1 <h1>, found ${h1s}`);
  const canon = [...h.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map((m) => m[1]);
  if (canon.length !== 1) errors.push(`${route}: expected 1 canonical, found ${canon.length}`);
  else if (canon[0] !== siteUrl + route) errors.push(`${route}: canonical ${canon[0]} ≠ ${siteUrl + route}`);
}

// 4. Link graph (docs/10 §4): no broken links, ≤ 150 links/page, ≥ 3 inbound, depth ≤ 3, in the sitemap.
const inbound = new Map([...html.keys()].map((r) => [r, new Set()]));
for (const [from, h] of html) {
  const links = linksOf(h);
  if (links.length > 150) errors.push(`${from}: ${links.length} internal links (max 150)`);
  for (const l of links) {
    if (!exists(l)) errors.push(`${from}: broken internal link ${l}`);
    const to = l.endsWith('/') ? l : `${l}/`;
    if (to !== from && inbound.has(to)) inbound.get(to).add(from);
  }
}
for (const [route, set] of inbound) if (route !== '/' && set.size < 3) errors.push(`${route}: only ${set.size} inbound internal links (need ≥ 3)`);
// Depth: breadth-first from home.
const depth = new Map([['/', 0]]);
const queue = ['/'];
while (queue.length) {
  const r = queue.shift();
  for (const l of linksOf(html.get(r) ?? '')) {
    const to = l.endsWith('/') ? l : `${l}/`;
    if (html.has(to) && !depth.has(to)) {
      depth.set(to, depth.get(r) + 1);
      queue.push(to);
    }
  }
}
for (const r of html.keys()) if (!depth.has(r)) errors.push(`${r}: unreachable from home`);
  else if (depth.get(r) > 3) errors.push(`${r}: ${depth.get(r)} clicks from home (max 3)`);

const sitemapPath = join(OUT, 'sitemap.xml');
const sitemap = existsSync(sitemapPath) ? readFileSync(sitemapPath, 'utf8') : '';
if (!sitemap) errors.push('sitemap.xml missing');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(siteUrl, ''));
for (const r of html.keys()) if (!sitemapUrls.includes(r)) errors.push(`${r}: not in sitemap.xml`);
for (const r of sitemapUrls) if (!html.has(r)) errors.push(`sitemap lists ${r}, which has no page`);

// 5. Structure: every tool on its category page and the A–Z; every instance linked from its parent.
const NON_CATEGORY = new Set(['about', 'methodology', 'privacy', 'disclosure', 'contact', 'calculators', 'editorial-policy', 'authors']);
const segs = (r) => r.split('/').filter(Boolean);
const tools = sitemapUrls.filter((r) => segs(r).length === 2 && !NON_CATEGORY.has(segs(r)[0]));
const instances = sitemapUrls.filter((r) => segs(r).length === 3);
const az = html.get('/calculators/') ?? '';
for (const t of tools) {
  const cat = `/${segs(t)[0]}/`;
  if (!linksOf(html.get(cat) ?? '').includes(t)) errors.push(`${t}: not listed on its category page ${cat}`);
  if (!linksOf(az).includes(t)) errors.push(`${t}: missing from the A–Z index`);
}
for (const i of instances) {
  const parent = `/${segs(i)[0]}/${segs(i)[1]}/`;
  if (!linksOf(html.get(parent) ?? '').includes(i)) errors.push(`${i}: not linked from its parent ${parent}`);
}

// 6. llms.txt lists every category, tool and instance, and nothing that isn't published (docs/10 §9).
const llms = existsSync(join(OUT, 'llms.txt')) ? readFileSync(join(OUT, 'llms.txt'), 'utf8') : '';
if (!llms) errors.push('llms.txt missing');
const llmsUrls = [...llms.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map((m) => m[1].replace(siteUrl, ''));
for (const r of [...tools, ...instances, ...sitemapUrls.filter((r) => segs(r).length === 1 && !NON_CATEGORY.has(segs(r)[0]))]) if (!llmsUrls.includes(r)) errors.push(`llms.txt is missing ${r}`);
for (const r of llmsUrls) if (r !== '/llms-full.txt' && !html.has(r)) errors.push(`llms.txt lists ${r}, which isn't a published page`);

// 7. Required static files.
for (const p of ['_headers', 'robots.txt', '404.html', '.well-known/security.txt', 'llms.txt', 'llms-full.txt']) if (!existsSync(join(OUT, p))) errors.push(`missing out/${p}`);

if (errors.length) {
  console.error(`check-out: ${errors.length} problem(s)\n - ` + errors.slice(0, 60).join('\n - '));
  process.exit(1);
}
console.log(`check-out: OK (${html.size} pages: ${tools.length} tools, ${instances.length} instances; ${files.length} files; max depth ${Math.max(...depth.values())}; ads ${adsEnabled ? 'ENABLED' : 'disabled'})`);
