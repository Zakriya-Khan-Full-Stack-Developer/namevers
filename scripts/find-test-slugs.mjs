// Find one prerendered and one non-prerendered name slug, for CPU comparison.
import fs from 'node:fs';
import path from 'node:path';

const manifest = JSON.parse(fs.readFileSync('src/lib/data/names-manifest.json', 'utf8'));
const dir = '.next/server/app/names';

const pre = new Set();
for (const r of ['islamic', 'christian', 'hindu', 'italian']) {
  const p = path.join(dir, r);
  if (!fs.existsSync(p)) continue;
  for (const f of fs.readdirSync(p)) {
    if (f.endsWith('.html')) pre.add(r + ':' + f.replace('.html', ''));
  }
}
console.log('prerendered name HTML files:', pre.size);

const out = { prerendered: null, onDemand: null };
for (const r of ['islamic', 'christian', 'hindu', 'italian']) {
  for (const item of manifest[r] || []) {
    if (!item.meaning || !item.origin) continue;
    const key = r + ':' + item.slug;
    if (pre.has(key) && !out.prerendered) out.prerendered = { religion: r, slug: item.slug, name: item.name };
    if (!pre.has(key) && !out.onDemand) out.onDemand = { religion: r, slug: item.slug, name: item.name };
  }
}
console.log(JSON.stringify(out, null, 2));
