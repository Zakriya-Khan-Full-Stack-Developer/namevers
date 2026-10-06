// ─────────────────────────────────────────────────────────────────────────────
// NameVerse — per-render CPU benchmark
//
// Measures the real CPU cost of the work a name detail page performs on every
// render, so the Fluid Active CPU fix can be reported as a before/after number
// rather than an assertion.
//
// It times the exact call chain the page uses:
//   getManifest()            → parse the 2.2 MB manifest
//   getKnownSlugsMap()       → build the 13,801-entry link-resolution Map
//   readNameData()           → read + parse one name JSON
//   normalizeNameRecord()    → flatten the source schema
//   enrichNameProfile()      → numerology, acrostic, FAQ + prose composition
//
// Run:  node scripts/bench-render.mjs [iterations]
// ─────────────────────────────────────────────────────────────────────────────

import { performance } from 'node:perf_hooks';
import {
  getManifest,
  getKnownSlugsMap,
  readNameData,
  getPopularSlugs,
} from '../lib/data/names-data.js';
import { enrichNameProfile } from '../lib/data/name-enricher.js';

const ITERATIONS = Number(process.argv[2]) || 200;

function ms(fn) {
  const t0 = performance.now();
  const r = fn();
  return { ms: performance.now() - t0, result: r };
}

async function msAsync(fn) {
  const t0 = performance.now();
  const r = await fn();
  return { ms: performance.now() - t0, result: r };
}

function cpuMs(fn) {
  const c0 = process.cpuUsage();
  const t0 = performance.now();
  fn();
  const c = process.cpuUsage(c0);
  return { wall: performance.now() - t0, cpu: (c.user + c.system) / 1000 };
}

console.log('NameVerse — per-render CPU benchmark');
console.log('='.repeat(64));

// ── 1. Cold-start costs (what a fresh serverless instance pays) ──────────────
console.log('\n[1] COLD START (fresh instance, caches empty)');

const coldManifest = cpuMs(() => getManifest());
console.log(`  getManifest()        wall ${coldManifest.wall.toFixed(1)}ms  cpu ${coldManifest.cpu.toFixed(1)}ms`);

const coldMap = cpuMs(() => getKnownSlugsMap());
console.log(`  getKnownSlugsMap()   wall ${coldMap.wall.toFixed(1)}ms  cpu ${coldMap.cpu.toFixed(1)}ms`);

const coldPopular = cpuMs(() => getPopularSlugs(20000));
console.log(`  getPopularSlugs()    wall ${coldPopular.wall.toFixed(1)}ms  cpu ${coldPopular.cpu.toFixed(1)}ms`);

// ── 2. Warm per-render cost ─────────────────────────────────────────────────
console.log(`\n[2] WARM PER-RENDER (caches populated, ${ITERATIONS} iterations)`);

const manifest = getManifest();
const all = [];
for (const rel of ['islamic', 'christian', 'hindu', 'italian']) {
  for (const item of manifest[rel] || []) {
    if (item.slug && item.meaning && item.origin) all.push({ religion: rel, slug: item.slug });
  }
}
console.log(`  indexable name pages: ${all.length.toLocaleString()}`);

// Warm the caches the way a real instance would be.
getKnownSlugsMap();

let totalCpu = 0;
let totalWall = 0;
let enrichCpu = 0;
let readCpu = 0;

const sample = [];
for (let i = 0; i < ITERATIONS; i++) {
  const target = all[(i * 7919) % all.length]; // deterministic spread
  sample.push(target);
}

for (const target of sample) {
  const c0 = process.cpuUsage();
  const t0 = performance.now();

  const raw = await readNameData(target.religion, target.slug);
  const c1 = process.cpuUsage();
  readCpu += (c1.user + c1.system) / 1000;

  if (raw) {
    const c2 = process.cpuUsage();
    enrichNameProfile(raw);
    const c3 = process.cpuUsage();
    enrichCpu += (c3.user + c3.system) / 1000;
  }

  const cEnd = process.cpuUsage(c0);
  totalCpu += (cEnd.user + cEnd.system) / 1000;
  totalWall += performance.now() - t0;
}

const perRenderCpu = totalCpu / ITERATIONS;
const perRenderWall = totalWall / ITERATIONS;

console.log(`  read + parse name JSON   ${(readCpu / ITERATIONS).toFixed(2)} ms cpu/render`);
console.log(`  enrichNameProfile()      ${(enrichCpu / ITERATIONS).toFixed(2)} ms cpu/render`);
console.log(`  ─────────────────────────────────────────────`);
console.log(`  TOTAL per render         ${perRenderCpu.toFixed(2)} ms cpu  (${perRenderWall.toFixed(2)} ms wall)`);

// ── 3. Projected Fluid Active CPU ───────────────────────────────────────────
console.log('\n[3] PROJECTED FLUID ACTIVE CPU');

const ON_DEMAND_RENDERS = 9801; // 13,801 total − 4,000 prerendered
const onDemandCpuSec = (ON_DEMAND_RENDERS * perRenderCpu) / 1000;
console.log(`  on-demand renders (current config): ${ON_DEMAND_RENDERS.toLocaleString()}`);
console.log(`  CPU for one full crawl of the long tail: ${(onDemandCpuSec / 60).toFixed(1)} min`);

// A crawler that re-requests the long tail after each 30-day revalidation
// window repeats that cost. Two full crawls per month is a conservative model.
const monthlyCpuHours = (onDemandCpuSec * 2) / 3600;
console.log(`  modelled monthly (2 crawls): ${monthlyCpuHours.toFixed(2)} h`);

console.log('\n' + '='.repeat(64));
console.log(JSON.stringify({
  perRenderCpuMs: Number(perRenderCpu.toFixed(3)),
  perRenderWallMs: Number(perRenderWall.toFixed(3)),
  readCpuMs: Number((readCpu / ITERATIONS).toFixed(3)),
  enrichCpuMs: Number((enrichCpu / ITERATIONS).toFixed(3)),
  coldManifestCpuMs: Number(coldManifest.cpu.toFixed(3)),
  coldMapCpuMs: Number(coldMap.cpu.toFixed(3)),
  indexablePages: all.length,
}, null, 2));
