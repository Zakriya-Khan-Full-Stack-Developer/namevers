import Link from 'next/link';
import { getManifest } from '../../lib/data/names-data.js';
import { ORIGIN_SLUGS, ORIGIN_LABELS, originSlugFor } from '../../lib/data/name-utils.js';
import AdSlot from '../../components/AdSlot.jsx';

export const revalidate = 2592000; // 30 days

export const metadata = {
  title: 'Baby Names by Origin — Arabic, Biblical, Sanskrit & More | NameVerse',
  description:
    'Browse baby names by linguistic and cultural origin: Arabic, Biblical, Sanskrit, Persian, Tamil, Hindi and more — with verified meanings on every name.',
  alternates: {
    canonical: 'https://nameverse.site/names-by-origin',
  },
};

export default function NamesByOriginPage() {
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

  const blurb = {
    arabic: 'Quranic, classical and modern names from the Arab world.',
    biblical: 'Names from the Bible across Hebrew, Greek and Latin forms.',
    sanskrit: "Names from ancient India's language of scripture and philosophy.",
    hindu: 'Names rooted in Hindu mythology, deities and traditions.',
    italian: 'Melodic names from Italy, many derived from Latin.',
    persian: 'Names from Iran and the Persian-speaking world.',
    english: 'Names shaped by English language and culture.',
    tamil: 'Names from the Tamil-speaking regions of South Asia.',
    hindi: 'Names from Hindi-speaking North India.',
    bengali: 'Names from Bengali-speaking Bangladesh and Bengal.',
    urdu: 'Names from the Urdu-speaking communities of South Asia.',
  };

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 text-center">
          <span className="eyebrow">Browse by language</span>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-nv-text sm:text-5xl">
            Baby Names by Origin
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-nv-text-secondary">
            Every name has a birthplace — a language and culture that shaped its sound and meaning.
            Choose an origin below to explore its full collection.
          </p>
        </header>

        <AdSlot placement="names-by-origin-top" />

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
              <p className="text-sm text-nv-text-secondary">{blurb[o.slug] || `Browse ${o.label.toLowerCase()} names.`}</p>
              <span className="mt-auto pt-4 text-sm font-semibold text-nv-accent">
                Browse {o.label.toLowerCase()} names &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
