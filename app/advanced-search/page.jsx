import { Suspense } from 'react';
import SearchClient from '../../components/SearchClient.jsx';
import AdSlot from '../../components/AdSlot.jsx';

export const metadata = {
  title: 'Advanced Baby Name Search — Filter by Religion, Gender, Origin | NameVerse',
  description:
    'Advanced baby name search with multi-filters: combine religion, gender, origin, category and popularity across 42,000+ Islamic, Hindu, Christian and Italian names.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function AdvancedSearchPage() {
  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 text-center">
          <span className="eyebrow">Advanced multi-filter</span>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-nv-text sm:text-5xl">
            Advanced Baby Name Search
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-nv-text-secondary">
            Combine a keyword with multiple traditions, genders, origins and categories. Results update live and rank by popularity.
          </p>
        </header>

        <AdSlot placement="advanced-search-top" />

        <Suspense fallback={<div className="card p-12 text-center text-nv-text-secondary">Loading search…</div>}>
          <SearchClient isAdvanced={true} />
        </Suspense>
      </div>
    </div>
  );
}
