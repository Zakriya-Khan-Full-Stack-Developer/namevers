// ─────────────────────────────────────────────────────────────────────────────
// NameVerse — server-side CPU measurement harness
//
// Measures the ACTUAL CPU the Next.js server process burns per HTTP request by
// sampling /proc/<pid>/stat (utime + stime) around a batch of requests. This is
// the same quantity Vercel bills as Fluid Active CPU, so the before/after
// numbers are directly comparable to the 4h free-tier allowance.
//
// Usage:
//   node scripts/measure-server-cpu.mjs <serverPid> <url> [requests]
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';

const [, , pidArg, url, reqArg] = process.argv;
const PID = Number(pidArg);
const URL = url;
const REQUESTS = Number(reqArg) || 30;

if (!PID || !URL) {
  console.error('usage: node scripts/measure-server-cpu.mjs <serverPid> <url> [requests]');
  process.exit(1);
}

const CLK_TCK = 100; // Linux USER_HZ

function readCpuSeconds(pid) {
  const stat = fs.readFileSync(`/proc/${pid}/stat`, 'utf8');
  // Field 14 = utime, 15 = stime (1-indexed), after the comm field which may
  // itself contain spaces/parens — so split on the LAST ')'.
  const after = stat.slice(stat.lastIndexOf(')') + 2).split(' ');
  const utime = Number(after[11]);
  const stime = Number(after[12]);
  return (utime + stime) / CLK_TCK;
}

async function main() {
  // Warm-up: first request may include lazy module init.
  await fetch(URL).then((r) => r.text());

  const cpu0 = readCpuSeconds(PID);
  const t0 = Date.now();

  let bytes = 0;
  let status = 0;
  for (let i = 0; i < REQUESTS; i++) {
    const res = await fetch(URL);
    status = res.status;
    const body = await res.text();
    bytes += body.length;
  }

  const wall = (Date.now() - t0) / 1000;
  const cpu = readCpuSeconds(PID) - cpu0;

  const perReqCpuMs = (cpu / REQUESTS) * 1000;
  const perReqWallMs = (wall / REQUESTS) * 1000;

  console.log(JSON.stringify({
    url: URL,
    requests: REQUESTS,
    status,
    avgBytes: Math.round(bytes / REQUESTS),
    totalCpuSec: Number(cpu.toFixed(3)),
    totalWallSec: Number(wall.toFixed(3)),
    perRequestCpuMs: Number(perReqCpuMs.toFixed(2)),
    perRequestWallMs: Number(perReqWallMs.toFixed(2)),
  }, null, 2));
}

main().catch((e) => {
  console.error('measurement failed:', e.message);
  process.exit(1);
});
