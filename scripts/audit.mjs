// SEC-DEP-06 vulnerability gate: `npm audit` over ALL dependencies (dev included). Fails on any high/critical
// advisory unless it's listed in security/accepted-advisories.json with a reason and an unexpired date.
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const accepted = JSON.parse(readFileSync('security/accepted-advisories.json', 'utf8')).advisories;
const today = new Date().toISOString().slice(0, 10);

let report;
try {
  report = JSON.parse(execSync('npm audit --json', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }));
} catch (e) {
  report = JSON.parse(e.stdout); // npm audit exits non-zero when it finds anything
}

const failures = [];
const notes = [];
for (const [name, v] of Object.entries(report.vulnerabilities ?? {})) {
  if (!['high', 'critical'].includes(v.severity)) continue;
  for (const via of v.via.filter((x) => typeof x === 'object')) {
    const id = via.url?.split('/').pop();
    const a = accepted.find((x) => x.id === id);
    if (!a) failures.push(`${name}: ${via.title} (${id}, ${v.severity}) is not fixed or accepted`);
    else if (a.expires < today) failures.push(`${name}: accepted risk ${id} EXPIRED on ${a.expires}; re-check it`);
    else notes.push(`${name}: ${id} accepted until ${a.expires} (${a.reason.slice(0, 70)}…)`);
  }
}
for (const n of notes) console.log(`audit: ${n}`);
if (failures.length) {
  console.error(`audit: ${failures.length} blocking finding(s)\n - ` + failures.join('\n - '));
  process.exit(1);
}
console.log('audit: OK (no unaccepted high/critical advisories)');
