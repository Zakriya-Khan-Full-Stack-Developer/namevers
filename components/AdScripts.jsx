// ─────────────────────────────────────────────────────────────────────────────
// AdScripts — every Adsterra script tag, rendered once for the whole site.
//
// Rendered from app/layout.jsx, so it applies to every route: name detail
// pages, tradition hubs, letter hubs, the 11 US SEO pages, the homepage, the
// blog, and every utility page. There is no per-page copy of this markup.
//
// WHY PLAIN <script async> AND NOT next/script
//   next/script with strategy="lazyOnload" injects the tag from the client
//   runtime, so the tag is NOT reliably present in the prerendered HTML. These
//   are plain <script async> elements, which React server-renders straight into
//   the static HTML — verifiable in .next/server/app/**/*.html — while `async`
//   keeps them off the critical path so they never block parsing or paint.
//
// SERVER COST — ZERO
//   These tags are inert strings during the build. Nothing here executes on the
//   server, so the ad network contributes nothing to Fluid Active CPU. The
//   scripts only run in the visitor's browser.
//
// `data-cfasync="false"` is preserved on the banner unit as supplied, so
// Cloudflare's Rocket Loader does not defer it and break the fill.
// ─────────────────────────────────────────────────────────────────────────────

// 1 — Banner / native unit. Fills the container rendered by <AdSlot />.
const BANNER_SRC = 'https://revolthem.com/c90e1cf06dc7451f1fd3d33c703af951/invoke.js';

// 2 — Site-wide popunder.
const POPUNDER_SRC = 'https://revolthem.com/5e/0c/df/5e0cdf883b6f082ca7c001d812ce1be6.js';

// 3 — Adsterra smartlink (popunder). Served as JS by the network.
const SMARTLINK_SRC = 'https://revolthem.com/ju453abxnx?key=f5aec7a843f2265ad68cd330db5a6f3d';

export default function AdScripts() {
  return (
    <>
      {/* 1 — Banner / native */}
      <script async data-cfasync="false" src={BANNER_SRC} />
      {/* 2 — Popunder (site-wide) */}
      <script async src={POPUNDER_SRC} />
      {/* 3 — Smartlink popunder */}
      <script async src={SMARTLINK_SRC} />
    </>
  );
}
