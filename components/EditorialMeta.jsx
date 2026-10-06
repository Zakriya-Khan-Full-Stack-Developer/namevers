import Link from 'next/link';
import {
  AUTHOR,
  REVIEWER,
  METHODOLOGY,
  LAST_UPDATED,
  LAST_UPDATED_LABEL,
  resolveSources,
  DEFAULT_SOURCE_KEYS,
} from '../lib/data/editorial.js';

// The E-E-A-T block. Rendered at the foot of every US page so that authorship,
// freshness, methodology and sourcing are present and identical everywhere.
//
// It is deliberately visible rather than schema-only: Google's quality raters
// assess what a reader can see, and a `citation` property with no visible
// source list is a weak signal at best.
export default function EditorialMeta({
  sources,
  updatedLabel = LAST_UPDATED_LABEL,
  updatedISO = LAST_UPDATED,
}) {
  const cited = resolveSources(sources || DEFAULT_SOURCE_KEYS);

  return (
    <div className="mt-14 border-t border-nv-border pt-8">
      {/* ── Byline + freshness ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-nv-accent-subtle text-xs font-bold text-nv-accent">
            NV
          </span>
          <div>
            <p className="text-sm font-semibold text-nv-text">By {AUTHOR.name}</p>
            <p className="text-xs text-nv-text-muted">{AUTHOR.role}</p>
          </div>
        </div>
        <span className="hidden text-nv-text-muted sm:inline" aria-hidden="true">
          &middot;
        </span>
        <p className="text-xs text-nv-text-muted">
          Last updated <time dateTime={updatedISO}>{updatedLabel}</time>
        </p>
        {REVIEWER.name && (
          <>
            <span className="hidden text-nv-text-muted sm:inline" aria-hidden="true">
              &middot;
            </span>
            <p className="text-xs text-nv-text-muted">Reviewed by {REVIEWER.name}</p>
          </>
        )}
      </div>

      <p className="mt-3 max-w-3xl text-xs leading-relaxed text-nv-text-secondary">
        {AUTHOR.credentials}{' '}
        <Link href="/editorial-policy" className="font-semibold text-nv-accent hover:underline">
          Read our editorial policy
        </Link>
        .
      </p>

      {/* ── Methodology ────────────────────────────────────────────────── */}
      <section className="mt-10" aria-labelledby="methodology-heading">
        <h2
          id="methodology-heading"
          className="font-display text-xl font-bold tracking-tight text-nv-text sm:text-2xl"
        >
          {METHODOLOGY.title}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-nv-text-secondary">
          {METHODOLOGY.intro}
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {METHODOLOGY.steps.map((step) => (
            <div key={step.title} className="inset-panel">
              <h3 className="text-sm font-bold text-nv-text">{step.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-nv-text-secondary">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Sources ────────────────────────────────────────────────────── */}
      <section className="mt-10" aria-labelledby="sources-heading">
        <h2
          id="sources-heading"
          className="font-display text-xl font-bold tracking-tight text-nv-text sm:text-2xl"
        >
          Sources
        </h2>
        <ul className="mt-4 space-y-3">
          {cited.map((s) => (
            <li key={s.url} className="text-sm leading-relaxed">
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-nv-accent hover:underline"
              >
                {s.name}
              </a>
              <span className="text-nv-text-muted">
                {' '}
                &mdash; {s.publisher}. {s.note}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
