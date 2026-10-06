import Link from 'next/link';
import EditorialMeta from './EditorialMeta.jsx';
import JsonLd from './JsonLd.jsx';
import AdSlot from './AdSlot.jsx';

// Shared shell for every US search-demand page.
//
// It enforces the heading contract the SEO strategy depends on:
//   H1  — exactly one, carrying the page's primary keyword (cluster.h1)
//   H2  — every major section, including the FAQ block
//   H3  — every sub-item (FAQ questions, methodology steps, card titles)
//
// It also guarantees the E-E-A-T block and the JSON-LD are present on every
// page, so no page can ship without them.
export default function UsPageShell({
  cluster,
  intro,
  breadcrumb = [],
  children,
  cta = null,
  faqs = [],
  sources,
  schema = [],
  updatedLabel,
  updatedISO,
}) {
  return (
    <div className="container-page py-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <JsonLd blocks={schema} />

        {/* ── Breadcrumb ───────────────────────────────────────────────── */}
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-nv-text-muted">
            <li>
              <Link href="/" className="transition hover:text-nv-accent">
                Home
              </Link>
            </li>
            {breadcrumb.map((crumb) => (
              <li key={crumb.href} className="flex items-center gap-1.5">
                <span aria-hidden="true">/</span>
                <Link href={crumb.href} className="transition hover:text-nv-accent">
                  {crumb.name}
                </Link>
              </li>
            ))}
            <li className="flex items-center gap-1.5">
              <span aria-hidden="true">/</span>
              <span aria-current="page" className="font-semibold text-nv-text-secondary">
                {cluster.h1}
              </span>
            </li>
          </ol>
        </nav>

        {/* ── H1 + intro (primary keyword above the fold on mobile) ────── */}
        <header className="mb-8">
          <span className="eyebrow">United States &middot; {cluster.intent}</span>
          <h1 className="mt-2 text-balance font-display text-3xl font-bold tracking-tight text-nv-text sm:text-5xl">
            {cluster.h1}
          </h1>
          <p className="mt-4 max-w-3xl text-pretty text-sm leading-relaxed text-nv-text-secondary sm:text-base">
            {intro}
          </p>
        </header>

        {/* Ad slot — below the H1, above the fold. Applies to all 11 US pages. */}
        <AdSlot placement="us-page-top" />

        {children}

        {/* ── FAQ (visible content mirrors the FAQPage schema) ─────────── */}
        {faqs.length > 0 && (
          <section className="mt-14" aria-labelledby="faq-heading">
            <h2
              id="faq-heading"
              className="font-display text-2xl font-bold tracking-tight text-nv-text sm:text-3xl"
            >
              Frequently asked questions
            </h2>
            <div className="mt-6 space-y-5">
              {faqs.map((f) => (
                <div key={f.q} className="card p-5">
                  <h3 className="font-display text-base font-bold text-nv-text sm:text-lg">{f.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-nv-text-secondary">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        {cta && (
          <div className="mt-12 rounded-bento border border-nv-accent/30 bg-nv-accent-subtle/50 p-6 sm:p-8">
            {cta}
          </div>
        )}

        <EditorialMeta sources={sources} updatedLabel={updatedLabel} updatedISO={updatedISO} />
      </div>
    </div>
  );
}
