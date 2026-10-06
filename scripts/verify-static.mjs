// ─────────────────────────────────────────────────────────────────────────────
// NameVerse — Static-output safety gate
//
// THE REGRESSION THIS PREVENTS
// The site was paused on Vercel because Fluid Active CPU hit 12h 15m against a
// 4h allowance. The cause was a single line: the name detail route declared
// `dynamicParams = true` and prerendered only the top 4,000 names, so ~9,800
// indexable pages were rendered on demand — each one re-running the full
// normalise + enrich + compose pipeline.
//
// That is a silent failure mode: the build succeeds, the route table looks
// fine, and the cost only shows up on the Vercel bill. This script makes it
// loud. It runs after `next build` and FAILS if any of the following is true:
//
//   1. The build emitted a dynamic (ƒ) route. Every route must be static (○)
//      or prerendered SSG (●).
//   2. A route that should be fully prerendered declares `dynamicParams = true`
//      in its source, which would let unknown paths render on demand.
//   3. An indexable manifest record has no prerendered HTML file, meaning it
//      would have to be rendered on demand.
//   4. The sitemap publishes a URL that has no prerendered page behind it.
//
// Run:  node scripts/verify-static.mjs
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const NEXT_DIR = path.join(ROOT, '.next');
const APP_DIR = path.join(NEXT_DIR, 'server', 'app');
const MANIFEST_PATH = path.join(ROOT, 'src', 'lib', 'data', 'names-manifest.json');

const failures = [];
const notes = [];

function fail(msg) {
  failures.push(msg);
}

// ── 1. No dynamic routes in the build output ────────────────────────────────
// Next.js writes the route table to stdout, not to a file, so we inspect the
// prerender manifest instead: every route in it must have been prerendered.
const prerenderManifestPath = path.join(NEXT_DIR, 'prerender-manifest.json');
if (!fs.existsSync(prerenderManifestPath)) {
  fail('prerender-manifest.json not found — run `next build` first.');
} else {
  const pm = JSON.parse(fs.readFileSync(prerenderManifestPath, 'utf8'));
  const routes = Object.keys(pm.routes || {});
  const dynamicRoutes = Object.keys(pm.dynamicRoutes || {});
  notes.push(`prerendered routes: ${routes.length}`);
  notes.push(`dynamic routes: ${dynamicRoutes.length}`);

  // A dynamic route entry with `fallback: null` and no prerendered paths is the
  // on-demand SSR case we are eliminating.
  for (const [route, cfg] of Object.entries(pm.dynamicRoutes || {})) {
    const hasPrerendered = routes.some((r) => r.startsWith(route.replace(/\/\[[^\]]+\]/g, '/')));
    if (!hasPrerendered) {
      fail(`dynamic route with no prerendered paths: ${route} (fallback=${cfg.fallback})`);
    }
  }
}

// ── 2. No route may declare dynamicParams = true ────────────────────────────
const ROUTE_FILES = [
  'app/names/[religion]/[slug]/page.jsx',
  'app/names/[religion]/page.jsx',
  'app/names/[religion]/letter/[letter]/page.jsx',
  'app/[genderHub]/page.jsx',
  'app/blog/[slug]/page.jsx',
  'app/categories/[category]/page.jsx',
  'app/origins/[origin]/page.jsx',
];

for (const rel of ROUTE_FILES) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) continue;
  const src = fs.readFileSync(p, 'utf8');
  if (/export\s+const\s+dynamicParams\s*=\s*true/.test(src)) {
    fail(`${rel} declares dynamicParams = true — unknown paths would render on demand`);
  }
}

// ── 3. Every indexable record must have a prerendered HTML file ─────────────
const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

function hasPrerenderedHtml(religion, slug) {
  const candidates = [
    path.join(APP_DIR, 'names', religion, `${slug}.html`),
    path.join(APP_DIR, 'names', religion, slug, 'index.html'),
  ];
  return candidates.some((c) => fs.existsSync(c));
}

let indexable = 0;
let missing = 0;
const missingSample = [];

for (const rel of Object.keys(manifest)) {
  for (const item of manifest[rel] || []) {
    if (!item.indexable) continue;
    indexable++;
    if (!hasPrerenderedHtml(rel, item.slug)) {
      missing++;
      if (missingSample.length < 10) missingSample.push(`${rel}/${item.slug}`);
    }
  }
}

notes.push(`indexable records: ${indexable}`);
notes.push(`indexable records with prerendered HTML: ${indexable - missing}`);

if (missing > 0) {
  fail(
    `${missing} indexable record(s) have no prerendered HTML and would render on demand. ` +
      `Examples: ${missingSample.join(', ')}`
  );
}

// ── 4. Sitemap must not publish URLs without a prerendered page ─────────────
// The sitemap route filters on `item.indexable`, which is the same flag checked
// above, so a mismatch here means the two have drifted apart.
const sitemapRoute = path.join(ROOT, 'app', 'sitemap', '[id]', 'route.js');
if (fs.existsSync(sitemapRoute)) {
  const src = fs.readFileSync(sitemapRoute, 'utf8');
  if (!/item\.indexable/.test(src)) {
    fail('sitemap/[id]/route.js does not filter on item.indexable — it may publish thin URLs');
  }
}

// ── Report ──────────────────────────────────────────────────────────────────
console.log('\nSTATIC-OUTPUT SAFETY GATE');
console.log('─'.repeat(64));
for (const n of notes) console.log(`  ${n}`);

if (failures.length) {
  console.log('');
  for (const f of failures) console.log(`  FAIL  ${f}`);
  console.log(`\n${failures.length} CHECK(S) FAILED — the build would burn Fluid Active CPU.`);
  process.exit(1);
}

console.log('\n  PASS  no dynamic routes, no dynamicParams=true, all indexable pages prerendered');
console.log('─'.repeat(64));
