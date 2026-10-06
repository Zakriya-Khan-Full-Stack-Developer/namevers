import Link from 'next/link';
import { getManifest } from '../../lib/data/names-data.js';
import { CATEGORY_SLUGS, CATEGORY_LABELS, categorySlugFor } from '../../lib/data/name-utils.js';
import AdSlot from '../../components/AdSlot.jsx';

export const revalidate = 2592000; // 30 days

export const metadata = {
  title: 'Baby Names by Category — Islamic, Hindu, Biblical, Saint, Virtue, Italian',
  description:
    'Browse 42,000+ baby names grouped by category: Islamic, Hindu, Biblical, Saint, Virtue and Italian — each with verified meanings, origins and lucky numbers.',
  alternates: {
    canonical: 'https://nameverse.site/categories',
  },
};

export default function CategoriesIndexPage() {
  const manifest = getManifest();
  const categories = CATEGORY_SLUGS.map((slug) => {
    let count = 0;
    for (const rel of ['islamic', 'christian', 'hindu', 'italian']) {
      for (const item of manifest[rel] || []) {
        if (categorySlugFor(item.category) === slug) count++;
      }
    }
    return { slug, label: CATEGORY_LABELS[slug], count };
  }).sort((a, b) => b.count - a.count);

  const blurb = {
    islamic: 'Names from the Quran, Islamic tradition and classical Arabic culture.',
    hindu: 'Names inspired by Sanskrit scriptures, deities, virtues and nature.',
    biblical: 'Names that appear in the Bible, rich with faith and history.',
    saint: 'Timeless names of venerated saints that inspire virtue.',
    virtue: 'Names that express noble qualities like love, wisdom and strength.',
    italian: 'Melodic Italian names rooted in Latin and Mediterranean tradition.',
  };

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-6 flex items-center gap-2 text-sm text-nv-text-secondary" aria-label="Breadcrumb">
          <Link href="/" className="font-medium hover:text-nv-accent transition">Home</Link>
          <span>/</span>
          <span className="font-medium text-nv-text">Name Categories</span>
        </nav>

        <header className="mb-10 text-center">
          <span className="eyebrow">Browse by tradition</span>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-nv-text sm:text-5xl">
            Baby Names by Category
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-nv-text-secondary">
            Categories group names by cultural and spiritual themes. Choose one to explore names
            that fit your faith, heritage and values.
          </p>
        </header>

        <AdSlot placement="categories-index-top" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/categories/${c.slug}`}
              className="card card-hover group flex flex-col gap-2 p-6"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-display text-xl font-semibold text-nv-text group-hover:text-nv-accent transition-colors">
                  {c.label}
                </h2>
                <span className="badge bg-nv-accent-subtle text-nv-accent">{c.count.toLocaleString()}</span>
              </div>
              <p className="text-sm text-nv-text-secondary">{blurb[c.slug]}</p>
              <span className="mt-auto pt-4 text-sm font-semibold text-nv-accent">
                Browse {c.label.toLowerCase()} names &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

