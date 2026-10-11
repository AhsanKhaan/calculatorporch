// Tiny static server for out/ (no dependencies), used by Playwright and for local previews.
// It applies the rules in public/_headers the way Cloudflare Pages does for "/*" and "/_next/static/*",
// so CSP problems show up locally. CSP_REPORT_ONLY=<policy> adds a report-only header (security/02 §4 SRI test).
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Paths resolve from the project root (this file's parent folder), so it works from any working directory.
const PROJECT = fileURLToPath(new URL('..', import.meta.url));
const ROOT = resolve(PROJECT, 'out');
const HEADERS_FILE = join(PROJECT, 'public', '_headers');
const PORT = Number(process.env.PORT ?? 4321);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json',
};

function parseHeaders(file) {
  const rules = [];
  let current = null;
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    if (!/^\s/.test(line)) {
      current = { pattern: line.trim(), headers: [] };
      rules.push(current);
    } else if (current) {
      const i = line.indexOf(':');
      current.headers.push([line.slice(0, i).trim(), line.slice(i + 1).trim()]);
    }
  }
  return rules.filter((r) => r.pattern.startsWith('/')); // host-specific rules (pages.dev) don't apply locally
}
const rules = existsSync(HEADERS_FILE) ? parseHeaders(HEADERS_FILE) : [];
const matches = (pattern, path) => (pattern.endsWith('*') ? path.startsWith(pattern.slice(0, -1)) : path === pattern);

createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname);
  let file = normalize(join(ROOT, urlPath));
  if (!file.startsWith(ROOT)) {
    res.writeHead(403).end();
    return;
  }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  let status = 200;
  if (!existsSync(file)) {
    // Cloudflare Pages: /path → /path/ (trailingSlash: true), else the 404 page.
    if (!urlPath.endsWith('/') && existsSync(join(ROOT, urlPath, 'index.html'))) {
      res.writeHead(308, { Location: `${urlPath}/` }).end();
      return;
    }
    file = join(ROOT, '404.html');
    status = 404;
  }
  const headers = { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' };
  for (const r of rules) if (matches(r.pattern, urlPath)) for (const [k, v] of r.headers) headers[k] = v;
  if (process.env.CSP_REPORT_ONLY) headers['Content-Security-Policy-Report-Only'] = process.env.CSP_REPORT_ONLY;
  res.writeHead(status, headers);
  res.end(readFileSync(file));
}).listen(PORT, () => console.log(`serve-out: http://localhost:${PORT} (${rules.length} _headers rules)`));
