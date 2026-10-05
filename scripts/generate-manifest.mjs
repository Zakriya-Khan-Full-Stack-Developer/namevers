import fs from 'node:fs';
import path from 'node:path';

// ---------------------------------------------------------------------------
// Fix 3 — reconcile the manifest with the filesystem.
//
// The committed manifest advertised 42,310 names while only 13,802 JSON files
// existed on disk. The sitemaps are generated from the manifest, so they
// published ~28,508 URLs that 404 — each one burning a function invocation and
// poisoning crawl budget.
//
// This script now derives the manifest EXCLUSIVELY from files that exist on
// disk, so the manifest can never describe a page that does not exist. It runs
// on every build via the `prebuild` npm script.
// ---------------------------------------------------------------------------

const ROOT = path.resolve(process.cwd());
const NAMES_DIR = path.join(ROOT, 'public', 'names');
const MANIFEST_PATH = path.join(ROOT, 'src', 'lib', 'data', 'names-manifest.json');

const VALID_RELIGIONS = ['islamic', 'christian', 'hindu', 'italian'];

function readJsonFile(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && 'data' in parsed) return parsed.data;
    return parsed;
  } catch {
    return null;
  }
}

function firstString(...values) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

const manifest = { islamic: [], christian: [], hindu: [], italian: [] };
let skipped = 0;

for (const rel of VALID_RELIGIONS) {
  const dir = path.join(NAMES_DIR, rel);
  if (!fs.existsSync(dir)) continue;

  const entries = fs
    .readdirSync(dir)
    .filter((entry) => entry.toLowerCase().endsWith('.json') && !entry.startsWith('_'));

  for (const entry of entries) {
    const slug = entry.replace(/\.json$/i, '');
    if (!slug) continue;

    const data = readJsonFile(path.join(dir, entry));
    if (!data) {
      skipped++;
      continue;
    }

    // Flatten nested data objects into the exact flat strings the UI expects.
    // `origin` is RICH data files: { primary_origin, origin_type, ... } while
    // the manifest, NameCard and the origin hubs all require a plain string.
    // Storing the raw object made React throw "Objects are not valid as a
    // React child" the first time these pages were ever prerendered. `meaning`
    // has the same problem via core_meaning.short_meaning.
    const originValue = data.origin;
    const coreMeaning = data.core_meaning;

    manifest[rel].push({
      name: firstString(data.name, data.na, data.title),
      slug,
      religion: rel,
      meaning: firstString(
        data.short_meaning,
        data.meaning,
        coreMeaning && coreMeaning.short_meaning,
        coreMeaning && coreMeaning.primary_meaning
      ),
      origin: firstString(
        data.origins,
        typeof originValue === 'string' ? originValue : '',
        originValue && originValue.primary_origin
      ),
      gender: firstString(data.gender),
      category: firstString(data.category),
      popularity_score: Number(data.popularity_score) || Number(data.popularity) || 0,
    });
  }
}

fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest), 'utf8');

const total = Object.values(manifest).reduce((sum, arr) => sum + arr.length, 0);
const bytes = fs.statSync(MANIFEST_PATH).size;
console.log(
  `Manifest rebuilt from filesystem: ${total} names (${(bytes / 1024 / 1024).toFixed(2)} MB)` +
    (skipped ? ` — ${skipped} unreadable file(s) skipped` : '')
);
for (const [rel, items] of Object.entries(manifest)) {
  console.log(`  ${rel}: ${items.length}`);
}
