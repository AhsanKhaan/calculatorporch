// Repository-level supply-chain checks (security/03). Runs in CI before install-dependent steps.
import { existsSync, readFileSync } from 'node:fs';

const errors = [];
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

// SEC-DEP-03: exact versions only.
for (const section of ['dependencies', 'devDependencies', 'optionalDependencies']) {
  for (const [name, range] of Object.entries(pkg[section] ?? {})) {
    if (!/^\d+\.\d+\.\d+$/.test(range)) errors.push(`${section}.${name} = "${range}" is not an exact version (SEC-DEP-03)`);
  }
}
// SEC-DEP-04/03: .npmrc settings.
const npmrc = existsSync('.npmrc') ? readFileSync('.npmrc', 'utf8') : '';
for (const line of ['ignore-scripts=true', 'save-exact=true']) {
  if (!npmrc.split(/\r?\n/).some((l) => l.trim() === line)) errors.push(`.npmrc must contain "${line}" (security/03)`);
}
// SEC-DEP-02: lockfile committed.
if (!existsSync('package-lock.json')) errors.push('package-lock.json missing (SEC-DEP-02)');
// No lifecycle hooks that would silently not run under ignore-scripts.
for (const name of Object.keys(pkg.scripts ?? {})) {
  if (/^(?:pre|post)/.test(name) || ['prepare', 'install', 'postinstall', 'preinstall'].includes(name)) {
    errors.push(`package.json script "${name}" is a lifecycle hook; chain steps explicitly instead (SEC-DEP-04)`);
  }
}
// SEC-DEP-10: one Node version.
if (!existsSync('.nvmrc')) errors.push('.nvmrc missing (SEC-DEP-10)');

if (errors.length) {
  console.error(`check-repo: ${errors.length} problem(s)\n - ` + errors.join('\n - '));
  process.exit(1);
}
console.log('check-repo: OK');
