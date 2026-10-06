import { Suspense } from 'react';
import SearchClient from '../../components/SearchClient.jsx';
import PageJsonLd from '../../components/PageJsonLd.jsx';
import AdSlot from '../../components/AdSlot.jsx';

export const metadata = {
  title: 'Search 42,000+ Baby Names by Meaning, Origin & Tradition | NameVerse',
  description:
    'Search 42,000+ baby names by name, meaning, origin, religion, gender or category. Filter results and rank by popularity — free and instant.',
  robots: {
    index: false,
    follow: true,
  },
};

const searchJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Search Baby Names',
  description: 'Search 42,000+ baby names by meaning, origin, religion, gender, and popularity.',
  url: 'https://nameverse.site/search',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://nameverse.site/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export default function SearchPage() {
  return (
    <div className="container-page py-10 sm:py-14">
      <PageJsonLd data={searchJsonLd} />
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 text-center">
          <span className="eyebrow">Instant name search</span>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-nv-text sm:text-5xl">
            Search Baby Names
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-nv-text-secondary">
            Search 42,000+ baby names across traditions by keyword, meaning, language or gender.
          </p>
        </header>

        <AdSlot placement="search-top" />

        <Suspense fallback={<div className="card p-12 text-center text-nv-text-secondary">Loading search…</div>}>
          <SearchClient />
        </Suspense>

        <section className="mt-16 mx-auto max-w-3xl border-t border-nv-border pt-10" aria-labelledby="search-seo-heading">
          <h2 id="search-seo-heading" className="font-display text-2xl font-bold tracking-tight text-nv-text sm:text-3xl">
            The Smartest Way to Find a Baby Name
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-nv-text-secondary sm:text-base">
            <p>
              NameVerse indexes every one of its 42,000+ names so you can search the way you actually
              think — by a name you heard, a meaning you love, a language you come from, or a faith
              you follow. Because every record carries its religion, gender, origin, category and
              popularity score, a single search can answer &ldquo;Arabic girl names that mean light&rdquo; as
              easily as it can find a specific spelling.
            </p>
            <p>
              Use the filters above to combine traditions with gender, then sort by popularity to see
              which choices are beloved by parents right now. Every result opens into a full profile
              with pronunciation, lucky numbers, numerology, name variations and cultural context.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
