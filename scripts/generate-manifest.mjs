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
// This script derives the manifest EXCLUSIVELY from files that exist on disk,
// so the manifest can never describe a page that does not exist. It runs on
// every build via the `prebuild` npm script.
//
// REDESIGN NOTE — the manifest is also the data source for every HUB page
// (tradition hubs, gender hubs, letter hubs, NameCard). Two defects made those
// hubs render empty or broken:
//   1. `gender` was read only from the flat `data.gender` field. Schema-A
//      records keep it at `identity.gender`, so ALL 5,180 Islamic and 352
//      Italian names shipped with an empty gender and the gender hubs
//      (/islamic-boy-names etc.) filtered down to zero results.
//   2. `meaning` was empty for the Italian set and for every Schema-A record
//      whose meaning lives at `core_meaning.short_meaning`.
// Both are now resolved with ordered fallbacks, and gender is normalised to a
// canonical boy|girl|unisex token so hub filters are exact.
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

function obj(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

// Canonical gender token. Schema-B wraps values in parentheses, e.g. "(Male)".
function normalizeGenderKey(value) {
  const g = String(value || '')
    .toLowerCase()
    .replace(/[()]/g, '')
    .trim();
  if (!g) return '';
  if (/unknown|unspecified|n\/a|not\s/.test(g)) return '';
  const isFemale = /female|girl|feminine/.test(g);
  const isMale = /(^|[^e])male|\bboy|masculin/.test(g);
  if (isMale && isFemale) return 'unisex';
  if (isFemale) return 'girl';
  if (isMale) return 'boy';
  if (/unisex|neutral|genderless/.test(g)) return 'unisex';
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

    const identity = obj(data.identity);
    const coreMeaning = obj(data.core_meaning);
    const originValue = data.origin;
    const seoBlock = obj(obj(data.seo).seo).title ? obj(data.seo).seo : obj(data.seo);
    const seoContent = obj(data.seo_content);
    const semantic = obj(data.semantic_field);
    const etymology = obj(data.etymology);
    const popularity = obj(data.popularity);

    manifest[rel].push({
      name: firstString(data.name, identity.display_name),
      slug,
      religion: rel,
      meaning: firstString(
        data.short_meaning,
        data.meaning,
        coreMeaning.short_meaning,
        coreMeaning.primary_meaning,
        coreMeaning.literal_meaning,
        seoContent.intro,
        seoBlock.description_paragraph,
        semantic.primary_semantic_domain
      ),
      origin: firstString(
        data.origins,
        typeof originValue === 'string' ? originValue : '',
        originValue && originValue.primary_origin,
        etymology.primary_language
      ),
      gender: normalizeGenderKey(firstString(data.gender, identity.gender)),
      category: firstString(data.category),
      popularity_score:
        Number(data.popularity_score) || Number(popularity.overall_score) || 0,
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
  const withGender = items.filter((i) => i.gender).length;
  const withMeaning = items.filter((i) => i.meaning).length;
  console.log(
    `  ${rel}: ${items.length} names — ${withGender} gendered, ${withMeaning} with meaning`
  );
}
