import fs from 'node:fs';
import path from 'node:path';

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
    return data;
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
  getBlogPosts,
  getKnownSlugsMap,
  VALID_RELIGIONS,
};
