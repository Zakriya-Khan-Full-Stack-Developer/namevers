import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getManifest, normalizeReligion, VALID_RELIGIONS } from '../../../lib/data/names-data.js';
import { lettersFor } from '../../../lib/data/letter-browser.js';
import {
  religionLabel,
  ORIGIN_LABELS,
  originSlugFor,
  categorySlugFor,
  CATEGORY_LABELS,
  isBoy,
  isGirl,
} from '../../../lib/data/name-utils.js';
import AlphabetNav from '../../../components/AlphabetNav.jsx';
import NameCard from '../../../components/NameCard.jsx';
import NativeAdBanner from '../../../components/NativeAdBanner.jsx';

export const revalidate = 2592000; // 30 days
export const dynamicParams = true;

// Fix 2 — prerender the four tradition hubs at build time so they are served
// from the CDN edge with zero function invocations.
export function generateStaticParams() {
  return VALID_RELIGIONS.map((religion) => ({ religion }));
}

export async function generateMetadata({ params }) {
  const finalReligion = normalizeReligion(params.religion);
  if (!finalReligion) return {};
  const label = religionLabel(finalReligion);
  const manifest = getManifest();
  const count = (manifest[finalReligion] || []).length;

  return {
    title: `${label} Baby Names with Meanings, Origins & Lucky Numbers (${count.toLocaleString()})`,
    description: `Browse ${count.toLocaleString()} ${label.toLowerCase()} baby names with verified meanings, origins, gender and lucky numbers. Explore popular ${label.toLowerCase()} names A–Z.`,
    alternates: {
      canonical: `https://nameverse.site/names/${finalReligion}`,
    },
  };
}

export default function ReligionHubPage({ params }) {
  const finalReligion = normalizeReligion(params.religion);
  if (!finalReligion) notFound();

  const manifest = getManifest();
  const allNames = manifest[finalReligion] || [];
  const label = religionLabel(finalReligion);
  const availableLetters = lettersFor(finalReligion, manifest);

  const popular = allNames
    .slice()
    .sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0))
    .slice(0, 16);

  const boyCount = allNames.filter(isBoy).length;
  const girlCount = allNames.filter(isGirl).length;

  const originSet = new Map();
  for (const item of allNames) {
    const slug = originSlugFor(item.origin);
    if (slug) originSet.set(slug, (originSet.get(slug) || 0) + 1);
  }
  const origins = [...originSet.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);

  const catSet = new Map();
  for (const item of allNames) {
    const slug = categorySlugFor(item.category);
    if (slug) catSet.set(slug, (catSet.get(slug) || 0) + 1);
  }
  const categories = [...catSet.entries()].sort((a, b) => b[1] - a[1]);

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${label} Baby Names`,
    description: `${allNames.length.toLocaleString()} ${label.toLowerCase()} baby names with meanings, origins and cultural context.`,
    url: `https://nameverse.site/names/${finalReligion}`,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://nameverse.site' },
      { '@type': 'ListItem', position: 2, name: 'All Names', item: 'https://nameverse.site/names' },
      { '@type': 'ListItem', position: 3, name: `${label} Names` },
    ],
  };

  return (
    <div className="container-page py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <NativeAdBanner placement="religion-hub-top" title="Featured Partner" />
        </div>
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-nv-text-secondary" aria-label="Breadcrumb">
          <Link href="/" className="font-medium hover:text-nv-accent transition">Home</Link>
          <span>/</span>
          <Link href="/names" className="font-medium hover:text-nv-accent transition">Names</Link>
          <span>/</span>
          <span className="font-medium text-nv-text">{label} Names</span>
        </nav>

        {/* Header */}
        <header className="mb-8 text-center">
          <span className="badge bg-nv-accent-subtle text-nv-accent">
            {allNames.length.toLocaleString()} names &bull; {boyCount.toLocaleString()} boys &bull; {girlCount.toLocaleString()} girls
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-nv-text sm:text-5xl">
            {label} Baby Names with Meanings
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-nv-text-secondary sm:text-lg">
            {label} baby names carry rich linguistic heritage and spiritual meaning. Browse the complete
            collection — each with verified meaning, origin, pronunciation guide and lucky numbers.
          </p>

          {/* Gender Buttons */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href={`/${finalReligion}-boy-names`} className="btn-primary">
              Browse {label} Boy Names ({boyCount.toLocaleString()})
            </Link>
            <Link href={`/${finalReligion}-girl-names`} className="btn-ghost">
              Browse {label} Girl Names ({girlCount.toLocaleString()})
            </Link>
          </div>
        </header>

        {/* Alphabet Navigator */}
        <div className="mb-12">
          <div className="text-center mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-nv-text-secondary">
              Browse {label} Names by Letter (A–Z)
            </h2>
          </div>
          <AlphabetNav religion={finalReligion} availableLetters={availableLetters} />
        </div>

        {/* Popular Names */}
        <section className="mb-14" aria-labelledby="popular-heading">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <span className="eyebrow">Most searched</span>
              <h2 id="popular-heading" className="mt-2 font-display text-2xl font-bold tracking-tight text-nv-text sm:text-3xl">
                Popular {label} Names
              </h2>
            </div>
            <Link href={`/search?religion=${finalReligion}&sort=popularity`} className="btn-ghost text-xs">
              View All Ranked by Popularity &rarr;
            </Link>
          </div>
          <div className="grid gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {popular.map((item) => (
              <NameCard key={item.slug} item={{ ...item, religion: finalReligion }} />
            ))}
          </div>
        </section>

        {/* Origins in this religion */}
        {origins.length > 0 && (
          <section className="mb-12 card p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-nv-text mb-4">
              Linguistic Roots in {label} Names
            </h2>
            <div className="flex flex-wrap gap-2">
              {origins.map(([slug, count]) => (
                <Link
                  key={slug}
                  href={`/origins/${slug}`}
                  className="rounded-full border border-nv-border bg-nv-surface px-4 py-2 text-sm font-semibold text-nv-text hover:border-nv-accent hover:text-nv-accent transition"
                >
                  {ORIGIN_LABELS[slug] || slug} ({count.toLocaleString()})
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Categories in this religion */}
        {categories.length > 0 && (
          <section className="card p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-nv-text mb-4">
              {label} Name Categories
            </h2>
            <div className="flex flex-wrap gap-2">
              {categories.map(([slug, count]) => (
                <Link
                  key={slug}
                  href={`/categories/${slug}`}
                  className="rounded-full border border-nv-border bg-nv-surface px-4 py-2 text-sm font-semibold text-nv-text hover:border-nv-accent hover:text-nv-accent transition"
                >
                  {CATEGORY_LABELS[slug] || slug} ({count.toLocaleString()})
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

