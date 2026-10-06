// ─────────────────────────────────────────────────────────────────────────────
// AdSlot — the single shared ad container for every page on NameVerse.
//
// WHY THIS EXISTS
//   The Adsterra banner script (invoke.js) fills the element whose id is
//   `container-c90e1cf06dc7451f1fd3d33c703af951`. That id must appear EXACTLY
//   ONCE per document — the script fills the first match and ignores the rest.
//   Before this component existed the id was rendered twice on every name page
//   (once in app/layout.jsx, once via components/Ad.jsx), so the second slot
//   silently never filled.
//
//   This component is the ONLY place that id is emitted. Every page shell
//   renders <AdSlot /> and nothing else defines the container.
//
// PLACEMENT CONTRACT
//   Rendered immediately AFTER the page's <h1> block, so the ad is:
//     • above the fold on desktop and on most mobile viewports
//     • BELOW the H1, so the primary keyword is never pushed out of view
//   The scripts themselves live once in app/layout.jsx.
//
// CLS CONTRACT
//   The container reserves its height before the ad arrives, so the ad cannot
//   push content down when it loads. `overflow-hidden` guarantees the reserved
//   box never grows, which keeps CLS at 0 even if the creative is oversized.
//   Reserved heights match Adsterra's common native sizes:
//     300x250 on mobile  → 250px reserved
//     728x90 / 970x90 on desktop → 90px reserved
//
// SERVER COST
//   This is a server component with no data fetching and no timers. It renders
//   a static div into the prerendered HTML and costs no Fluid Active CPU. The
//   ad scripts are client-side only and never execute on the server.
// ─────────────────────────────────────────────────────────────────────────────

export const AD_CONTAINER_ID = 'container-c90e1cf06dc7451f1fd3d33c703af951';

export default function AdSlot({ placement = 'top', className = '' }) {
  return (
    <aside
      className={`ad-slot ${className}`}
      data-ad-placement={placement}
      aria-label="Sponsored advertisement"
    >
      <div className="ad-slot__label" aria-hidden="true">
        <span>Advertisement</span>
      </div>
      <div className="ad-slot__frame">
        {/* The Adsterra banner script targets this id. It is emitted here and
            nowhere else in the codebase. */}
        <div id={AD_CONTAINER_ID} className="ad-slot__container" />
      </div>
    </aside>
  );
}
