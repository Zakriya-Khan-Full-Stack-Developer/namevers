import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getManifest } from '../../../lib/data/names-data.js';
import { CATEGORY_SLUGS, CATEGORY_LABELS, categorySlugFor, religionLabel } from '../../../lib/data/name-utils.js';
import NameCard from '../../../components/NameCard.jsx';
import AdSlot from '../../../components/AdSlot.jsx';

export const revalidate = 2592000; // 30 days
export const dynamicParams = false;

// Fix 2 — prerender all curated category hubs at build time.
export function generateStaticParams() {
  return CATEGORY_SLUGS.map((category) => ({ category }));
}

export async function generateMetadata({ params }) {
  const category = params.category;
  if (!CATEGORY_SLUGS.includes(category)) return {};
  const label = CATEGORY_LABELS[category] || category.charAt(0).toUpperCase() + category.slice(1);

  return {
    title: `${label} Baby Names with Meanings & Origins`,
    description: `Browse ${label.toLowerCase()} baby names with verified meanings, origins, gender and lucky numbers — ranked by popularity for 2026.`,
    alternates: {
      canonical: `https://nameverse.site/categories/${category}`,
    },
  };
}

export default function CategoryDetailPage({ params }) {
  const category = params.category;
  if (!CATEGORY_SLUGS.includes(category)) notFound();

  const label = CATEGORY_LABELS[category] || category.charAt(0).toUpperCase() + category.slice(1);
  const canonicalUrl = `https://nameverse.site/categories/${category}`;

  const manifest = getManifest();
  const all = [];
  const religionCounts = new Map();

  for (const rel of ['islamic', 'christian', 'hindu', 'italian']) {
    for (const item of manifest[rel] || []) {
      if (categorySlugFor(item.category) === category) {
        all.push({ ...item, religion: rel });
        religionCounts.set(rel, (religionCounts.get(rel) || 0) + 1);
      }
    }
  }

  all.sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0));
  const topNames = all.slice(0, 300);
  const religionsWithNames = [...religionCounts.entries()].sort((a, b) => b[1] - a[1]);

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${label} Baby Names`,
    description: `${all.length.toLocaleString()} ${label.toLowerCase()} baby names with meanings and origins.`,
    url: canonicalUrl,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://nameverse.site' },
      { '@type': 'ListItem', position: 2, name: 'Categories', item: 'https://nameverse.site/categories' },
      { '@type': 'ListItem', position: 3, name: `${label} Names` },
    ],
  };

  return (
    <div className="container-page py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="mx-auto max-w-6xl">
        <nav className="mb-6 flex items-center gap-2 text-sm text-nv-text-secondary" aria-label="Breadcrumb">
          <Link href="/" className="font-medium hover:text-nv-accent transition">Home</Link>
          <span>/</span>
          <Link href="/categories" className="font-medium hover:text-nv-accent transition">Categories</Link>
          <span>/</span>
          <span className="font-medium text-nv-text">{label} names</span>
        </nav>

        <header className="mb-8 text-center">
          <span className="badge bg-nv-accent-subtle text-nv-accent">{all.length.toLocaleString()} {label} names</span>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-nv-text sm:text-5xl">
            {label} Baby Names &amp; Meanings
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-nv-text-secondary">
            {all.length.toLocaleString()} names celebrating {label.toLowerCase()} spiritual and cultural significance.
            Below are the 300 most popular choices.
          </p>

          {religionsWithNames.length > 1 && (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {religionsWithNames.map(([rel, count]) => (
                <Link
                  key={rel}
                  href={`/names/${rel}`}
                  className="rounded-full border border-nv-border bg-nv-surface px-3 py-1 text-xs font-semibold text-nv-text hover:border-nv-accent hover:text-nv-accent transition"
                >
                  {religionLabel(rel)} ({count.toLocaleString()})
                </Link>
              ))}
            </div>
          )}
        </header>

        <AdSlot placement="category-top" />

        <div className="grid gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {topNames.map((item) => (
            <NameCard key={`${item.religion}-${item.slug}`} item={item} showReligion />
          ))}
        </div>

        {all.length > 300 && (
          <p className="mt-10 text-center text-sm text-nv-text-secondary">
            Showing the 300 most popular of {all.length.toLocaleString()}.{' '}
            <Link href={`/search?category=${category}&sort=popularity`} className="font-semibold text-nv-accent hover:underline">
              Search the full list &rarr;
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
