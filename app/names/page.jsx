import Link from 'next/link';
import { getManifest, getPopularSlugs } from '../../lib/data/names-data.js';
import { isBoy, isGirl } from '../../lib/data/name-utils.js';
import NameCard from '../../components/NameCard.jsx';
import PageJsonLd from '../../components/PageJsonLd.jsx';
import AdSlot from '../../components/AdSlot.jsx';
export const revalidate = 2592000; // 30 days

export const metadata = {
  title: 'All Baby Names by Religion — 42,000+ Names & Meanings',
  description:
    'Browse 42,000+ baby names by religion: Islamic, Christian, Hindu & Italian names with verified meanings, origins and lucky numbers. Free A–Z browsing.',
  alternates: {
    canonical: 'https://nameverse.site/names',
  },
};

const namesIndexJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'All Baby Names',
  description: 'Browse 42,000+ baby names across Islamic, Christian, Hindu, and Italian traditions.',
  url: 'https://nameverse.site/names',
  isPartOf: {
    '@type': 'WebSite',
    name: 'NameVerse',
    url: 'https://nameverse.site',
  },
};

export default function NamesIndexPage() {
  const manifest = getManifest();
  const religions = [
    { key: 'islamic', label: 'Islamic Names', description: 'Quranic, Arabic & Urdu names', badgeClass: 'bg-cyan-50 text-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-300' },
    { key: 'christian', label: 'Christian Names', description: 'Biblical & modern names', badgeClass: 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300' },
    { key: 'hindu', label: 'Hindu Names', description: 'Sanskrit & Vedic names', badgeClass: 'bg-red-50 text-red-800 dark:bg-red-950/50 dark:text-red-300' },
    { key: 'italian', label: 'Italian Names', description: 'Classical Italian names', badgeClass: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' },
  ].map((r) => {
    const items = manifest[r.key] || [];
    const boyCount = items.filter(isBoy).length;
    const girlCount = items.filter(isGirl).length;
    return { ...r, count: items.length, boyCount, girlCount };
  });

  const totalCount = religions.reduce((s, r) => s + r.count, 0);

  const bySlug = {};
  for (const key of ['islamic', 'christian', 'hindu', 'italian']) {
    for (const item of manifest[key] || []) bySlug[item.slug] = item;
  }
  const topNames = getPopularSlugs(24).map(({ slug }) => bySlug[slug]).filter(Boolean);

  return (
    <div className="container-page py-10 sm:py-14">
      <PageJsonLd data={namesIndexJsonLd} />
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 text-center">
          <span className="eyebrow">Name directory</span>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-nv-text sm:text-5xl">
            All Baby Names
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-nv-text-secondary">
            Every name in NameVerse — {totalCount.toLocaleString()} in total — organized by tradition.
            Pick a religion to browse its full A–Z collection, or start with the most popular names below.
          </p>
        </header>

        <AdSlot placement="names-index-top" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {religions.map((rel) => (
            <Link
              key={rel.key}
              href={`/names/${rel.key}`}
              className="card card-hover group flex flex-col gap-2 p-6"
            >
              <span className={`badge w-fit ${rel.badgeClass}`}>
                {rel.count.toLocaleString()} names
              </span>
              <h2 className="font-display text-xl font-bold text-nv-text group-hover:text-nv-accent transition-colors mt-2">
                {rel.label}
              </h2>
              <p className="text-sm text-nv-text-secondary">{rel.description}</p>
              <p className="text-xs text-nv-text-muted mt-1">
                {rel.boyCount.toLocaleString()} boys &bull; {rel.girlCount.toLocaleString()} girls
              </p>
              <span className="mt-auto pt-4 text-sm font-semibold text-nv-accent">
                Browse all &rarr;
              </span>
            </Link>
          ))}
        </div>

        {/* Quick Discovery Chips */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <Link href="/names-by-origin" className="rounded-full border border-nv-border bg-nv-surface px-4 py-2 text-sm font-semibold text-nv-text-secondary transition hover:border-nv-accent/50 hover:text-nv-accent">By origin</Link>
          <Link href="/names-by-meaning" className="rounded-full border border-nv-border bg-nv-surface px-4 py-2 text-sm font-semibold text-nv-text-secondary transition hover:border-nv-accent/50 hover:text-nv-accent">By meaning</Link>
          <Link href="/categories" className="rounded-full border border-nv-border bg-nv-surface px-4 py-2 text-sm font-semibold text-nv-text-secondary transition hover:border-nv-accent/50 hover:text-nv-accent">By category</Link>
          <Link href="/origins" className="rounded-full border border-nv-border bg-nv-surface px-4 py-2 text-sm font-semibold text-nv-text-secondary transition hover:border-nv-accent/50 hover:text-nv-accent">Origins index</Link>
          <Link href="/trending-names" className="rounded-full border border-nv-border bg-nv-surface px-4 py-2 text-sm font-semibold text-nv-text-secondary transition hover:border-nv-accent/50 hover:text-nv-accent">Trending</Link>
          <Link href="/unique-names" className="rounded-full border border-nv-border bg-nv-surface px-4 py-2 text-sm font-semibold text-nv-text-secondary transition hover:border-nv-accent/50 hover:text-nv-accent">Unique</Link>
          <Link href="/popularity" className="rounded-full border border-nv-border bg-nv-surface px-4 py-2 text-sm font-semibold text-nv-text-secondary transition hover:border-nv-accent/50 hover:text-nv-accent">Popularity tool</Link>
        </div>

        {/* Most Popular Names */}
        <section className="mt-16" aria-labelledby="popular-heading">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="eyebrow">Top picks</span>
              <h2 id="popular-heading" className="mt-2 font-display text-2xl font-bold tracking-tight text-nv-text sm:text-3xl">
                Most Popular Names Across Traditions
              </h2>
            </div>
            <Link href="/popularity" className="btn-ghost text-xs">
              Compare popularity &rarr;
            </Link>
          </div>
          <div className="grid gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {topNames.map((item) => (
              <NameCard key={`${item.religion}-${item.slug}`} item={item} showReligion />
            ))}
          </div>
        </section>

        {/* SEO Context Section */}
        <section className="mx-auto mt-20 max-w-3xl border-t border-nv-border pt-12" aria-labelledby="seo-heading">
          <h2 id="seo-heading" className="font-display text-2xl font-bold tracking-tight text-nv-text sm:text-3xl">
            The Complete Baby Name Directory
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-nv-text-secondary sm:text-base">
            <p>
              Whether you follow a specific tradition or you are simply hunting for the perfect name,
              the directory covers the two most useful dimensions at once: meaning and heritage. Each
              tradition hub gives you a complete A–Z index, gender-split counts and the most popular
              names right now.
            </p>
            <p>
              Every name page goes far beyond a one-line translation — with pronunciation, lucky
              numbers, numerology, spelling variations and the cultural story behind the meaning. Start
              with the hubs above, then use search to mix religion, gender and meaning in one go.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
