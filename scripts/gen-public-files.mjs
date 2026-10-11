// Generates files that depend on the deploy environment, before `next build`.
// - /.well-known/security.txt (RFC 9116; SEC-HDR-06) from NEXT_PUBLIC_SITE_URL, Expires ≤ 1 year.
import { mkdirSync, writeFileSync } from 'node:fs';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://calculatorporch.com').replace(/\/+$/, '');
const url = new URL(siteUrl);
if (url.protocol !== 'https:' || url.pathname !== '/') {
  console.error(`NEXT_PUBLIC_SITE_URL must be an https origin, got: ${siteUrl}`);
  process.exit(1);
}
const host = url.hostname;
const expires = new Date(Date.now() + 360 * 24 * 60 * 60 * 1000).toISOString().replace(/\.\d{3}Z$/, '.000Z');

mkdirSync('public/.well-known', { recursive: true });
writeFileSync(
  'public/.well-known/security.txt',
  [
    `Contact: mailto:contact@${host}`,
    `Expires: ${expires}`,
    'Preferred-Languages: en',
    `Canonical: ${siteUrl}/.well-known/security.txt`,
    '',
  ].join('\n'),
);
console.log(`gen-public-files: security.txt for ${host} (expires ${expires.slice(0, 10)})`);
