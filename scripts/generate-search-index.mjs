import fs from 'node:fs';
import path from 'node:path';

// ---------------------------------------------------------------------------
// Fix 4 — generate a search index for EVERY tradition.
//
// Only `public/names/italian/_search-index.json` was committed. The three
// client search components (HomepageSearch, SearchClient, PopularityClient)
// fetch `/names/${religion}/_search-index.json` for all four traditions, so
// search silently failed for islamic / christian / hindu and each attempt was
// a wasted edge request returning 404.
//
// The index is built from the reconciled manifest (see generate-manifest.mjs),
// so it can only ever contain names that have a real page. Field names are
// compact to keep the payload small:
//   n = name, s = slug, m = meaning, o = origin, g = gender, p = popularity
// ---------------------------------------------------------------------------

const ROOT = path.resolve(process.cwd());
const MANIFEST_PATH = path.join(ROOT, 'src', 'lib', 'data', 'names-manifest.json');

const VALID_RELIGIONS = ['islamic', 'christian', 'hindu', 'italian'];

function loadManifest() {
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  } catch {
    return { islamic: [], christian: [], hindu: [], italian: [] };
  }
}

function compact(item) {
  return {
    n: item.name || '',
    s: item.slug || '',
    m: String(item.meaning || item.short_meaning || '').slice(0, 90),
    o: item.origin || '',
    g: item.gender || '',
    p: Number(item.popularity_score) || 0,
  };
}

const manifest = loadManifest();
let total = 0;

for (const rel of VALID_RELIGIONS) {
  const items = (manifest[rel] || [])
    .filter((item) => item.slug && item.name)
    .map(compact)
    .sort((a, b) => a.n.localeCompare(b.n));

  const outDir = path.join(ROOT, 'public', 'names', rel);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, '_search-index.json'), JSON.stringify(items), 'utf8');
  total += items.length;
  console.log(`Generated ${rel} search index with ${items.length} entries`);
}

console.log(`Total search index entries: ${total}`);
