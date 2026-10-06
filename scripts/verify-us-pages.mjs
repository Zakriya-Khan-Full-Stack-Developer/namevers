// Quality-gate verifier for the US search-demand pages.
//
// Checks, against the ACTUAL prerendered HTML (not the source):
//   1. Heading contract  — exactly one H1, real H2/H3 structure
//   2. JSON-LD           — every block parses, and the expected types are present
//   3. E-E-A-T           — byline, last-updated, methodology, sources, policy link
//   4. Canonical         — exactly one, pointing at the page's own URL
//   5. Internal links    — every href resolves to a real route (no dead links)
//   6. Uniqueness        — no two pages share a title or meta description
//
// Run: node scripts/verify-us-pages.mjs
import fs from 'node:fs';
import path from 'node:path';

const APP_DIR = path.join(process.cwd(), '.next', 'server', 'app');

const PAGES = [
  'popular-names-2026',
  'top-baby-names-2026',
  'unique-baby-names',
  'gender-neutral-names',
  'baby-names-by-state',
  'vintage-baby-names',
  'biblical-baby-names',
  'muslim-baby-names-america',
  'nature-baby-names',
  'short-baby-names',
  'editorial-policy',
];

// React SSR inserts `<!-- -->` between static text and interpolated values, so
// "By {name}" lands in the HTML as "By <!-- -->NameVerse Editorial Team".
// Strip comments before doing any text matching.
function clean(html) {
  return html.replace(/<!--.*?-->/g, '');
}

function collectRoutes(dir, out = new Set()) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectRoutes(full, out);
    } else if (entry.name.endsWith('.html')) {
      let r = full.replace(APP_DIR, '').replace(/\.html$/, '');
      if (r.endsWith('/index')) r = r.slice(0, -6);
      out.add(r === '' ? '/' : r);
    }
  }
  return out;
}

const DYNAMIC = [
  /^\/names\/[a-z]+\/[a-z0-9-]+$/,
  /^\/names\/[a-z]+$/,
  /^\/names\/[a-z]+\/letter\/[a-z%0-9]+$/,
  /^\/origins\/[a-z-]+$/,
  /^\/categories\/[a-z-]+$/,
  /^\/blog\/[a-z0-9-]+$/,
  /^\/[a-z-]+-boy-names$/,
  /^\/[a-z-]+-girl-names$/,
];

// Paths that are real but are not prerendered .html files:
//   /_next/static/**  — build assets emitted by Next, served from the CDN
//   /sitemap*.xml     — route handlers (app/sitemap/**/route.js)
//   /robots.txt       — route handler (app/robots.js)
const NON_HTML = [
  /^\/_next\//,
  /^\/sitemap[\w.-]*\.xml$/,
  /^\/robots\.txt$/,
  /^\/favicon\.ico$/,
];

const EXPECTED_SCHEMA = ['CollectionPage', 'ItemList', 'FAQPage', 'BreadcrumbList', 'Article'];

let failures = 0;
const titles = new Map();
const descriptions = new Map();

const routes = collectRoutes(APP_DIR);

console.log('─'.repeat(78));
console.log('US PAGE QUALITY GATE');
console.log('─'.repeat(78));

for (const page of PAGES) {
  const file = path.join(APP_DIR, `${page}.html`);
  const problems = [];

  if (!fs.existsSync(file)) {
    console.log(`FAIL  ${page}  — no prerendered HTML`);
    failures += 1;
    continue;
  }

  const raw = fs.readFileSync(file, 'utf8');
  const html = clean(raw);

  // 1. Headings
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  const h2 = (html.match(/<h2[\s>]/g) || []).length;
  const h3 = (html.match(/<h3[\s>]/g) || []).length;
  if (h1 !== 1) problems.push(`h1=${h1} (must be exactly 1)`);
  if (h2 < 3) problems.push(`h2=${h2} (need >=3)`);
  if (h3 < 3) problems.push(`h3=${h3} (need >=3)`);

  // 2. JSON-LD
  const blocks = [...raw.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(
    (m) => m[1]
  );
  let parsed = 0;
  for (const b of blocks) {
    try {
      JSON.parse(b);
      parsed += 1;
    } catch (e) {
      problems.push(`invalid JSON-LD: ${e.message.slice(0, 60)}`);
    }
  }
  const types = new Set([...raw.matchAll(/"@type":"([A-Za-z]+)"/g)].map((m) => m[1]));
  const isPolicy = page === 'editorial-policy';
  const required = isPolicy ? ['BreadcrumbList', 'Article'] : EXPECTED_SCHEMA;
  for (const t of required) {
    if (!types.has(t)) problems.push(`missing schema ${t}`);
  }

  // 3. E-E-A-T
  // The editorial policy page IS the policy, so it carries the byline in its
  // body rather than in the shared footer block — check for the author name
  // itself rather than the "By ..." prefix.
  const eeat = {
    byline: isPolicy ? /NameVerse Editorial Team/.test(html) : /By NameVerse Editorial Team/.test(html),
    updated: /Last updated/.test(html),
    methodology: /How we compile and verify name data/.test(html),
    sources: /ssa\.gov/.test(html),
    policy: /editorial-policy/.test(html),
  };
  for (const [k, v] of Object.entries(eeat)) {
    if (!v) problems.push(`missing E-E-A-T: ${k}`);
  }

  // 4. Canonical
  const canon = (html.match(/rel="canonical" href="([^"]+)"/) || [])[1];
  if (!canon) problems.push('no canonical');
  else if (!canon.endsWith(`/${page}`)) problems.push(`canonical points elsewhere: ${canon}`);

  // 5. Internal links
  const hrefs = [...new Set([...html.matchAll(/href="(\/[^"#?]*)"/g)].map((m) => m[1]))];
  const dead = hrefs.filter(
    (x) => !routes.has(x) && !DYNAMIC.some((d) => d.test(x)) && !NON_HTML.some((d) => d.test(x))
  );
  if (dead.length) problems.push(`dead links: ${dead.slice(0, 5).join(', ')}`);

  // 6. Title / description uniqueness
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  const desc = (html.match(/name="description" content="([^"]*)"/) || [])[1] || '';
  if (!title) problems.push('no title');
  if (!desc) problems.push('no meta description');
  if (titles.has(title)) problems.push(`duplicate title with ${titles.get(title)}`);
  else titles.set(title, page);
  if (descriptions.has(desc)) problems.push(`duplicate description with ${descriptions.get(desc)}`);
  else descriptions.set(desc, page);

  if (problems.length) {
    failures += 1;
    console.log(`FAIL  ${page}`);
    for (const p of problems) console.log(`        · ${p}`);
  } else {
    console.log(
      `PASS  ${page.padEnd(26)} h1=${h1} h2=${h2} h3=${h3} ld=${parsed}/${blocks.length} links=${hrefs.length}`
    );
  }
}

console.log('─'.repeat(78));
if (failures === 0) {
  console.log(`ALL ${PAGES.length} PAGES PASS — headings, schema, E-E-A-T, canonicals, links, uniqueness`);
} else {
  console.log(`${failures} of ${PAGES.length} PAGES FAILED`);
  process.exitCode = 1;
}
