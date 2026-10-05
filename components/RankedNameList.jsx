import Link from 'next/link';

// A ranked list of names.
//
// Renders the rank, the name, and — when we hold a verified profile — the
// meaning and a link to the profile page. Names without a profile are shown
// with a muted "profile in progress" marker instead of a dead link.
//
// The rank number is the source's rank, not ours. We never re-rank.
export default function RankedNameList({ items, startRank = 1, showMeaning = true }) {
  if (!items || !items.length) return null;

  return (
    <ol className="divide-y divide-nv-border overflow-hidden rounded-card border border-nv-border bg-nv-surface">
      {items.map((item, i) => {
        const rank = startRank + i;
        const body = (
          <>
            <span className="w-8 shrink-0 text-right font-display text-sm font-bold tabular-nums text-nv-text-muted">
              {rank}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-base font-bold text-nv-text">{item.name}</span>
              {showMeaning && item.meaning && (
                <span className="mt-0.5 block truncate text-xs text-nv-text-secondary">
                  {item.meaning}
                </span>
              )}
            </span>
            {item.origin && (
              <span className="hidden shrink-0 text-xs text-nv-text-muted sm:block">{item.origin}</span>
            )}
            {item.href ? (
              <span className="shrink-0 text-xs font-semibold text-nv-accent">&rarr;</span>
            ) : (
              <span className="shrink-0 text-[10px] uppercase tracking-wide text-nv-text-muted">
                soon
              </span>
            )}
          </>
        );

        return (
          <li key={`${item.name}-${rank}`}>
            {item.href ? (
              <Link
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 transition hover:bg-nv-subtle/60"
              >
                {body}
              </Link>
            ) : (
              <div className="flex items-center gap-3 px-4 py-3">{body}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
