// Next.js 16.3 static export writes segment-prefetch payloads as nested folders
// (about/__next.about/__PAGE__.txt), but the client requests a flat, dot-joined name
// (about/__next.about.__PAGE__.txt). Static hosts serve files literally, so every prefetch 404s
// and logs a console error. This copies each nested file to the flat name the client asks for.
// Re-check after each Next.js upgrade: if out/ already contains the flat files, delete this step.
import { copyFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';

const OUT = 'out';
let copied = 0;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (!statSync(p).isDirectory()) continue;
    if (name.startsWith('__next.')) flatten(p);
    else walk(p);
  }
}

function filesUnder(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? filesUnder(p) : [p];
  });
}

function flatten(segDir) {
  for (const file of filesUnder(segDir)) {
    const rel = relative(segDir, file).split(sep).join('.'); // $d$tool/__PAGE__.txt → $d$tool.__PAGE__.txt
    const target = join(dirname(segDir), `${segDir.split(sep).pop()}.${rel}`);
    if (!existsSync(target)) {
      copyFileSync(file, target);
      copied++;
    }
  }
}

if (!existsSync(OUT)) {
  console.error('flatten-segments: out/ not found');
  process.exit(1);
}
walk(OUT);
console.log(`flatten-segments: ${copied} prefetch file(s) copied to flat names`);
