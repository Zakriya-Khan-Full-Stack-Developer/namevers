import Link from 'next/link';
import { getManifest } from '../../lib/data/names-data.js';
import { ORIGIN_SLUGS, ORIGIN_LABELS, originSlugFor } from '../../lib/data/name-utils.js';
import AdSlot from '../../components/AdSlot.jsx';

export const revalidate = 2592000; // 30 days

export const metadata = {
  title: 'Baby Names by Origin — Arabic, Biblical, Sanskrit, Persian & More',
  description:
    'Browse 42,000+ baby names grouped by linguistic and cultural origin: Arabic, Biblical, Sanskrit, Hindu, Italian, Persian, Tamil and more, with verified meanings.',
  alternates: {
    canonical: 'https://nameverse.site/origins',
  },
};

export default function OriginsIndexPage() {
  const manifest = getManifest();
  const origins = ORIGIN_SLUGS.map((slug) => {
    let count = 0;
    for (const rel of ['islamic', 'christian', 'hindu', 'italian']) {
      for (const item of manifest[rel] || []) {
        if (originSlugFor(item.origin) === slug) count++;
      }
    }
    return { slug, label: ORIGIN_LABELS[slug], count };
  }).sort((a, b) => b.count - a.count);

  const total = origins.reduce((sum, o) => sum + o.count, 0);

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-6 flex items-center gap-2 text-sm text-nv-text-secondary" aria-label="Breadcrumb">
          <Link href="/" className="font-medium hover:text-nv-accent transition">Home</Link>
          <span>/</span>
          <span className="font-medium text-nv-text">Names by Origin</span>
        </nav>

        <header className="mb-10 text-center">
          <span className="eyebrow">Browse by culture</span>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-nv-text sm:text-5xl">
            Baby Names by Origin
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-nv-text-secondary">
            {origins.length} linguistic and cultural collections covering {total.toLocaleString()}+ names.
            Pick a language to discover the names that grew out of it.
          </p>
        </header>

        <AdSlot placement="origins-index-top" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {origins.map((o) => (
            <Link
              key={o.slug}
              href={`/origins/${o.slug}`}
              className="card card-hover group flex flex-col gap-2 p-6"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-display text-xl font-semibold text-nv-text group-hover:text-nv-accent transition-colors">
                  {o.label}
                </h2>
                <span className="badge bg-nv-accent-subtle text-nv-accent">{o.count.toLocaleString()}</span>
              </div>
              <p className="text-sm text-nv-text-secondary">
                Browse {o.count.toLocaleString()} {o.label.toLowerCase()} names with meanings and origins.
              </p>
              <span className="mt-auto pt-4 text-sm font-semibold text-nv-accent">
                Browse names &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
