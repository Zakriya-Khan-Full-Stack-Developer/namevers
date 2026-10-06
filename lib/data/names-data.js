import fs from 'node:fs';
import path from 'node:path';
import { normalizeNameRecord } from './name-normalizer.js';

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public');
const NAMES_DIR = path.join(PUBLIC_DIR, 'names');
const MANIFEST_PATH = path.join(ROOT, 'src', 'lib', 'data', 'names-manifest.json');
const BLOG_POSTS_PATH = path.join(PUBLIC_DIR, 'data', 'blog-posts.json');

export const VALID_RELIGIONS = ['islamic', 'christian', 'hindu', 'italian'];

// ---------------------------------------------------------------------------
// Fix 7 — memoize the manifest.
// The manifest is a multi-megabyte JSON file read by nearly every route. It is
// now read + parsed ONCE per server instance instead of on every request,
// which removes a large chunk of Active CPU and Provisioned Memory per
// invocation. The cache is module-scoped, so it survives across requests
// handled by the same warm function instance.
// ---------------------------------------------------------------------------
let _manifestCache = null;
let _knownSlugsMapCache = null;

export function getManifest() {
  if (_manifestCache) return _manifestCache;
  try {
    const raw = fs.readFileSync(MANIFEST_PATH, 'utf8');
    _manifestCache = JSON.parse(raw);
    return _manifestCache;
  } catch (err) {
    console.error('Failed to load names-manifest.json:', err.message);
    return { islamic: [], christian: [], hindu: [], italian: [] };
  }
}

export function normalizeReligion(religion) {
  if (!religion || typeof religion !== 'string') return null;
  const normalized = religion.toLowerCase().trim();
  if (normalized === 'islam' || normalized === 'muslim') return 'islamic';
  if (normalized === 'christianity') return 'christian';
  if (normalized === 'hinduism') return 'hindu';
  return VALID_RELIGIONS.includes(normalized) ? normalized : null;
}

export function normalizeSlug(slug) {
  return String(slug || '').trim().toLowerCase().replace(/\.json$/i, '');
}

// ---------------------------------------------------------------------------
// Fix 1 — read name records from the filesystem only.
//
// The previous implementation fell through to
//     fetch(assetUrl, { cache: 'no-store' })
// whenever the local read failed. Per Next.js semantics, a single `no-store`
// fetch on a route forces the ENTIRE route to be dynamically rendered, which
// silently overrode the `export const revalidate = 2592000` declared on every
// page. That is what made all 13,802 name pages render on every request.
//
// The dataset lives in `public/names/**`, which is present during `next build`,
// so the build-time read always succeeds for real pages. A miss is now a
// genuine 404 (the caller calls notFound()) instead of a dynamic render.
// ---------------------------------------------------------------------------
export async function readNameData(religion, slug) {
  const normalizedReligion = normalizeReligion(religion);
  const normalizedSlug = normalizeSlug(slug);
  if (!normalizedReligion || !normalizedSlug) return null;

  const filePath = path.join(NAMES_DIR, normalizedReligion, `${normalizedSlug}.json`);

  try {
    const raw = await fs.promises.readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    const data = parsed && typeof parsed === 'object' && 'data' in parsed ? parsed.data : parsed;
    if (!data) return null;
    if (!data.religion) data.religion = normalizedReligion;
    // Flatten whichever of the two source schemas this record uses into the
    // single canonical shape the page template consumes. Without this the
    // template read fields that exist in neither schema and rendered empty
    // meaning / origin / etymology on thousands of pages.
    return normalizeNameRecord(data, normalizedReligion, normalizedSlug);
  } catch {
    // No self-fetch fallback. A miss is a real 404, not a dynamic render.
    return null;
  }
}

export function getReligionDirs() {
  return VALID_RELIGIONS.filter((rel) => fs.existsSync(path.join(NAMES_DIR, rel)));
}

export function getSlugs(religion) {
  const normalizedReligion = normalizeReligion(religion);
  if (!normalizedReligion) return [];
  const manifest = getManifest();
  const items = manifest[normalizedReligion] || [];
  return items.map((item) => item.slug).sort((a, b) => a.localeCompare(b));
}

export function getAllSlugs() {
  const manifest = getManifest();
  const all = [];
  for (const rel of VALID_RELIGIONS) {
    const items = manifest[rel] || [];
    for (const item of items) {
      if (item.slug) {
        all.push({ religion: rel, slug: item.slug });
      }
    }
  }
  return all;
}

export function getPopularSlugs(limit = 20000) {
  const manifest = getManifest();
  const all = [];
  for (const rel of VALID_RELIGIONS) {
    for (const item of manifest[rel] || []) {
      if (item.slug) {
        all.push({ religion: rel, slug: item.slug, popularity_score: item.popularity_score || 0 });
      }
    }
  }
  return all
    .sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0))
    .slice(0, limit)
    .map((item) => ({ religion: item.religion, slug: item.slug }));
}

// ─────────────────────────────────────────────────────────────────────────────
// FIX — Fluid Active CPU: the complete prerender set.
//
// Returns every name page that should EXIST, so generateStaticParams can
// prerender all of them at build time and the route can declare
// `dynamicParams = false`. A page exists when the record has a slug and either
// carries real content (`indexable`) or is a duplicate that must still render so
// it can point its canonical at the surviving page (`canonicalSlug`).
//
// Records that are neither — the negative-assertion stubs whose meaning reads
// "no confident lexical sense is asserted" — are deliberately excluded. They
// have no unique content to serve, so they 404 rather than burning CPU to
// render a near-duplicate of every other stub.
//
// This is the function that replaced the old `getPopularSlugs(4000)` cap. The
// cap was the root cause of the Fluid Active CPU burn: it left ~9,800 indexable
// pages to be rendered on demand, and each on-demand render re-ran the entire
// normalise + enrich + compose pipeline.
// ─────────────────────────────────────────────────────────────────────────────
// ──────────────────────────────────────────────────────────────────────────────
// PRERENDER SET — complete, uncapped.
//
// Every page that has real content to serve is prerendered at build time. There
// is deliberately NO cap: a cap is what caused the Fluid Active CPU burn. The
// previous `PRERENDER_NAME_PAGES || 4000` limit left ~8,400 indexable pages to
// be rendered on demand, and each on-demand render re-ran the full normalise +
// enrich + compose pipeline.
//
// Build-time CPU is billed as build minutes, not as Fluid Active CPU, so moving
// the work into the build is what makes the runtime cost disappear. The route
// declares `dynamicParams = false`, so a URL outside this set is a 404 and can
// never fall through to an on-demand render.
// ─────────────────────────────────────────────────────────────────────────────
export function getRenderableSlugs() {
  const manifest = getManifest();
  const out = [];
  for (const rel of VALID_RELIGIONS) {
    for (const item of manifest[rel] || []) {
      if (!item.slug) continue;
      // A page is prerendered when it carries real content, or when it is a
      // duplicate that must still render so it can point its canonical at the
      // surviving page. Negative-assertion stubs are excluded entirely — they
      // have no unique content, so they 404 rather than burning CPU to render a
      // near-duplicate of every other stub.
      if (item.indexable || item.canonicalSlug) {
        out.push({ religion: rel, slug: item.slug });
      }
    }
  }
  return out;
}

export function getBlogPosts() {
  try {
    const raw = fs.readFileSync(BLOG_POSTS_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load blog-posts.json:', err.message);
    return [];
  }
}

export function getKnownSlugsMap() {
  if (_knownSlugsMapCache) return _knownSlugsMapCache;
  const manifest = getManifest();
  const map = new Map();
  for (const r of VALID_RELIGIONS) {
    for (const item of manifest[r] || []) {
      if (item && item.slug) {
        map.set(`${r}:${item.slug}`, item);
      }
    }
  }
  _knownSlugsMapCache = map;
  return map;
}

export default {
  getManifest,
  normalizeReligion,
  normalizeSlug,
  readNameData,
  getReligionDirs,
  getSlugs,
  getAllSlugs,
  getPopularSlugs,
  getRenderableSlugs,
  getBlogPosts,
  getKnownSlugsMap,
  VALID_RELIGIONS,
};