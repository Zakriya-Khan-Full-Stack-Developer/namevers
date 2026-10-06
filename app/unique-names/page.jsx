import Link from 'next/link';
import { getManifest } from '../../lib/data/names-data.js';
import NameCard from '../../components/NameCard.jsx';
import AdSlot from '../../components/AdSlot.jsx';

export const revalidate = 2592000; // 30 days

export const metadata = {
  title: 'Unique & Rare Baby Names — 100 Distinctive Picks | NameVerse',
  description:
    'Discover 100 unique and rare baby names from Islamic, Hindu, Christian and Italian traditions — beautiful, meaningful and unlikely to be shared at school.',
  alternates: {
    canonical: 'https://nameverse.site/unique-names',
  },
};

export default function UniqueNamesPage() {
  const manifest = getManifest();
  const all = [];
  for (const rel of ['islamic', 'christian', 'hindu', 'italian']) {
    for (const item of manifest[rel] || []) {
      if (item.slug && item.name && (item.popularity_score || 0) > 0) {
        all.push({ ...item, religion: rel });
      }
    }
  }
  all.sort((a, b) => (a.popularity_score || 0) - (b.popularity_score || 0));
  const unique = all.slice(0, 100);

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 text-center">
          <span className="eyebrow">For families who dare to differ</span>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-nv-text sm:text-5xl">
            Unique Baby Names
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-nv-text-secondary">
            100 rare and distinctive names in the NameVerse database — beautiful, meaningful, and unlikely to
            be shared. Every pick includes a verified meaning, origin and lucky number.
          </p>
          <div className="mt-6">
            <Link href="/search?sort=popularity" className="btn-ghost">
              Explore Popular Names Instead
            </Link>
          </div>
        </header>

        <AdSlot placement="unique-names-top" />

        <div className="grid gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {unique.map((item) => (
            <NameCard key={`${item.religion}-${item.slug}`} item={item} showReligion />
          ))}
        </div>

        <section className="mx-auto mt-16 max-w-3xl border-t border-nv-border pt-10" aria-labelledby="seo-heading">
          <h2 id="seo-heading" className="font-display text-2xl font-bold tracking-tight text-nv-text sm:text-3xl">
            The Case for a Rare Name
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-nv-text-secondary sm:text-base">
            <p>
              A unique name gives your child an instant sense of identity. It is easy to remember, hard
              to confuse, and comes with a built-in conversation starter: &ldquo;what does your name mean?&rdquo;
              The names here come from every tradition NameVerse covers, so rarity never means losing
              the cultural depth you care about.
            </p>
            <p>
              One thing to check before committing: pronunciation and spelling in your own language.
              Every name page includes a pronunciation guide and spelling variations, so you can make
              sure the name will travel well.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
