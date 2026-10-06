import { getManifest } from '../../lib/data/names-data.js';
import PopularityClient from '../../components/PopularityClient.jsx';
import NameCard from '../../components/NameCard.jsx';
import AdSlot from '../../components/AdSlot.jsx';

export const revalidate = 2592000; // 30 days

export const metadata = {
  title: 'Popularity Comparison — Compare Baby Names Side by Side | NameVerse',
  description:
    'Compare any two baby names side by side with the NameVerse popularity score. Plus the 50 most popular names of 2026 across Islamic, Christian, Hindu and Italian traditions.',
  alternates: {
    canonical: 'https://nameverse.site/popularity',
  },
};

export default function PopularityPage() {
  const manifest = getManifest();
  const popular = [];
  for (const rel of ['islamic', 'christian', 'hindu', 'italian']) {
    for (const item of manifest[rel] || []) {
      popular.push({ ...item, religion: rel });
    }
  }
  popular.sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0));
  const top50 = popular.slice(0, 50);

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 text-center">
          <span className="eyebrow">Rank &amp; compare</span>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-nv-text sm:text-5xl">
            Compare Baby Name Popularity
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-nv-text-secondary">
            Search 42,000+ names, add your shortlist, and see how they rank against each other on the NameVerse popularity scale.
          </p>
        </header>

        <AdSlot placement="popularity-top" />

        {/* Client comparison tool */}
        <PopularityClient
          initialList={top50.slice(0, 3).map((item) => ({
            n: item.name,
            s: item.slug,
            religion: item.religion,
            p: item.popularity_score,
            m: item.short_meaning || item.meaning,
          }))}
        />

        {/* Top 50 names server-rendered list */}
        <section className="mt-16 border-t border-nv-border pt-12" aria-labelledby="top50-heading">
          <h2 id="top50-heading" className="font-display text-2xl font-bold tracking-tight text-nv-text sm:text-3xl mb-6">
            Top 50 Most Popular Names of 2026
          </h2>
          <div className="grid gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {top50.map((item) => (
              <NameCard key={`${item.religion}-${item.slug}`} item={item} showReligion />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
